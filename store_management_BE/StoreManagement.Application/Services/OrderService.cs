using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using Microsoft.Extensions.Logging;
using StoreManagement.Application.DTOs.Order;
using StoreManagement.Domain.Entities;
using StoreManagement.Domain.Enums;
using StoreManagement.Domain.Interfaces;
using System.Threading;

namespace StoreManagement.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IPromotionRepository _promotionRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IInventoryRepository inventoryRepository,
        IPromotionRepository promotionRepository,
        IPaymentRepository paymentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _inventoryRepository = inventoryRepository;
        _promotionRepository = promotionRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    private async Task RecalculateOrderTotalAsync(Order order)
    {
        var total = order.OrderItems.Sum(oi => oi.Quantity * oi.Price);
        order.TotalAmount = total;
        order.DiscountAmount = 0;

        if (order.PromoId.HasValue)
        {
            var promotion = await _promotionRepository.GetByIdAsync(order.PromoId.Value);
            var now = DateTime.UtcNow;
            var isValid = promotion != null
                          && string.Equals(promotion.Status, "active", StringComparison.OrdinalIgnoreCase)
                          && now >= promotion.StartDate
                          && now <= promotion.EndDate
                          && total >= promotion.MinOrderAmount
                          && (promotion.UsageLimit == 0 || promotion.UsedCount < promotion.UsageLimit);

            if (isValid)
            {
                order.DiscountAmount = await CalculateDiscountAsync(promotion!, total);
            }
            else
            {
                order.PromoId = null;
                order.DiscountAmount = 0;
            }
        }
    }

    private Task<decimal> CalculateDiscountAsync(Promotion promotion, decimal orderAmount)
    {
        decimal discount = promotion.DiscountType == DiscountType.Percent
            ? orderAmount * (promotion.DiscountValue / 100)
            : Math.Min(promotion.DiscountValue, orderAmount);

        return Task.FromResult(discount);
    }

    private static bool IsPending(Order order) => order.Status == OrderStatus.Pending;

    private async Task<Promotion> GetValidPromotionByCodeAsync(string promoCode, decimal orderTotal)
    {
        var promotion = await _promotionRepository.GetByPromoCodeAsync(promoCode);
        if (promotion == null)
            throw new InvalidOperationException("Promotion not found");

        var now = DateTime.UtcNow;
        if (!string.Equals(promotion.Status, "active", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Promotion is not active");
        if (now < promotion.StartDate)
            throw new InvalidOperationException("Promotion has not started yet");
        if (now > promotion.EndDate)
            throw new InvalidOperationException("Promotion has expired");
        if (promotion.MinOrderAmount > 0 && orderTotal < promotion.MinOrderAmount)
            throw new InvalidOperationException($"Order amount must be at least {promotion.MinOrderAmount:C}");
        if (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit)
            throw new InvalidOperationException("Promotion usage limit has been reached");

        return promotion;
    }

    public async Task<OrderResponse?> GetByIdAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
        return order != null ? _mapper.Map<OrderResponse>(order) : null;
    }

    public async Task<(IEnumerable<OrderResponse> Items, int TotalCount)> GetAllPagedAsync(
        int pageNumber,
        int pageSize,
        OrderStatus? status = null,
        int? userId = null,
        int? customerId = null,
        string? sortBy = null,
        bool sortDesc = false)
    {
        Expression<Func<Order, bool>>? filter = null;

        if (status.HasValue || userId.HasValue || customerId.HasValue)
        {
            filter = o =>
                (!status.HasValue || o.Status == status.Value) &&
                (!userId.HasValue || o.UserId == userId) &&
                (!customerId.HasValue || o.CustomerId == customerId);
        }

        Expression<Func<Order, object>> primarySort = (sortBy ?? string.Empty).ToLower() switch
        {
            "id" => o => o.OrderId,
            "orderdate" => o => o.OrderDate,
            "totalamount" => o => o.TotalAmount ?? 0,
            "status" => o => o.Status,
            "customerid" => o => o.CustomerId ?? 0,
            "userid" => o => o.UserId ?? 0,
            _ => o => o.OrderDate
        };

        Func<IQueryable<Order>, IOrderedQueryable<Order>> orderBy = q =>
        {
            var ordered = sortDesc ? q.OrderByDescending(primarySort) : q.OrderBy(primarySort);
            return sortDesc
                ? ordered.ThenByDescending(o => o.OrderId)
                : ordered.ThenBy(o => o.OrderId);
        };

        var (items, totalCount) = await _orderRepository.GetPagedAsync(pageNumber, pageSize, filter, orderBy);
        var mappedItems = _mapper.Map<IEnumerable<OrderResponse>>(items);

        return (mappedItems, totalCount);
    }

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = new Order
            {
                CustomerId = request.CustomerId,
                UserId = userId,
                Status = OrderStatus.Pending,
                OrderDate = DateTime.UtcNow
            };

            // Build items and reserve inventory
            foreach (var item in request.OrderDetails)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId)
                              ?? throw new InvalidOperationException("Product not found");

                var inventory = await _inventoryRepository.GetByProductIdAsync(item.ProductId)
                               ?? throw new InvalidOperationException("Inventory not found for product");

                if (inventory.Quantity < item.Quantity)
                    throw new InvalidOperationException(
                        $"Insufficient inventory. Available: {inventory.Quantity}, Requested: {item.Quantity}");

                inventory.Quantity -= item.Quantity;
                await _inventoryRepository.UpdateAsync(inventory);

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Subtotal = item.Quantity * product.Price
                });
            }

            await RecalculateOrderTotalAsync(order);

            if (request.PromoId.HasValue)
            {
                var promotion = await _promotionRepository.GetByIdAsync(request.PromoId.Value)
                               ?? throw new InvalidOperationException("Promotion not found");

                var now = DateTime.UtcNow;
                if (!string.Equals(promotion.Status, "active", StringComparison.OrdinalIgnoreCase)
                    || now < promotion.StartDate
                    || now > promotion.EndDate
                    || (promotion.MinOrderAmount > 0 && (order.TotalAmount ?? 0) < promotion.MinOrderAmount)
                    || (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit))
                {
                    throw new InvalidOperationException("Promotion is not valid for this order");
                }

                order.PromoId = promotion.PromoId;
                order.DiscountAmount = await CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);
            }

            await _orderRepository.AddAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            var createdOrder = await _orderRepository.GetByIdWithDetailsAsync(order.OrderId);
            return _mapper.Map<OrderResponse>(createdOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse?> UpdateAsync(int orderId, UpdateOrderRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) return null;
            if (!IsPending(order)) throw new InvalidOperationException("Cannot update order that is not pending");

            order.CustomerId = request.CustomerId;
            await RecalculateOrderTotalAsync(order);

            await _orderRepository.UpdateAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            return _mapper.Map<OrderResponse>(order);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> CancelAsync(int orderId)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) return false;
            if (order.Status == OrderStatus.Paid)
                throw new InvalidOperationException("Cannot cancel a paid order");
            if (order.Status != OrderStatus.Pending)
                throw new InvalidOperationException("Only pending orders can be cancelled");

            foreach (var item in order.OrderItems)
            {
                if (!item.ProductId.HasValue) continue;
                var inventory = await _inventoryRepository.GetByProductIdAsync(item.ProductId.Value);
                if (inventory != null)
                {
                    inventory.Quantity += item.Quantity;
                    await _inventoryRepository.UpdateAsync(inventory);
                }
            }

            order.Status = OrderStatus.Canceled;
            await _orderRepository.UpdateAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> AddItemAsync(int orderId, AddOrderItemRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot add items to order that is not pending");

            var product = await _productRepository.GetByIdAsync(request.ProductId)
                          ?? throw new InvalidOperationException("Product not found");

            var inventory = await _inventoryRepository.GetByProductIdAsync(request.ProductId)
                           ?? throw new InvalidOperationException("Inventory not found for product");

            if (inventory.Quantity < request.Quantity)
                throw new InvalidOperationException(
                    $"Insufficient inventory. Available: {inventory.Quantity}, Requested: {request.Quantity}");

            inventory.Quantity -= request.Quantity;
            await _inventoryRepository.UpdateAsync(inventory);

            var existingItem = order.OrderItems.FirstOrDefault(oi => oi.ProductId == request.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                existingItem.Subtotal = existingItem.Quantity * existingItem.Price;
            }
            else
            {
                order.OrderItems.Add(new OrderItem
                {
                    OrderId = orderId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Price = product.Price,
                    Subtotal = request.Quantity * product.Price
                });
            }

            await RecalculateOrderTotalAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> UpdateItemAsync(int orderId, int itemId, UpdateOrderItemRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot update items in order that is not pending");

            var orderItem = order.OrderItems.FirstOrDefault(oi => oi.OrderItemId == itemId)
                             ?? throw new InvalidOperationException("Order item not found");

            var quantityDelta = request.Quantity - orderItem.Quantity;

            if (quantityDelta > 0)
            {
                if (!orderItem.ProductId.HasValue)
                    throw new InvalidOperationException("Order item has no product ID");

                var inventory = await _inventoryRepository.GetByProductIdAsync(orderItem.ProductId.Value)
                               ?? throw new InvalidOperationException("Inventory not found for product");

                if (inventory.Quantity < quantityDelta)
                    throw new InvalidOperationException(
                        $"Insufficient inventory. Available: {inventory.Quantity}, Needed: {quantityDelta}");

                inventory.Quantity -= quantityDelta;
                await _inventoryRepository.UpdateAsync(inventory);
            }
            else if (quantityDelta < 0 && orderItem.ProductId.HasValue)
            {
                var inventory = await _inventoryRepository.GetByProductIdAsync(orderItem.ProductId.Value);
                if (inventory != null)
                {
                    inventory.Quantity += Math.Abs(quantityDelta);
                    await _inventoryRepository.UpdateAsync(inventory);
                }
            }

            orderItem.Quantity = request.Quantity;
            orderItem.Subtotal = orderItem.Quantity * orderItem.Price;

            await RecalculateOrderTotalAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> DeleteItemAsync(int orderId, int itemId)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot delete items from order that is not pending");

            var orderItem = order.OrderItems.FirstOrDefault(oi => oi.OrderItemId == itemId)
                             ?? throw new InvalidOperationException("Order item not found");

            if (orderItem.ProductId.HasValue)
            {
                var inventory = await _inventoryRepository.GetByProductIdAsync(orderItem.ProductId.Value);
                if (inventory != null)
                {
                    inventory.Quantity += orderItem.Quantity;
                    await _inventoryRepository.UpdateAsync(inventory);
                }
            }

            order.OrderItems.Remove(orderItem);

            await RecalculateOrderTotalAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> ApplyPromotionAsync(int orderId, ApplyPromotionRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot apply promotion to order that is not pending");
            if (order.OrderItems == null || !order.OrderItems.Any())
                throw new InvalidOperationException("Order has no items");

            await RecalculateOrderTotalAsync(order);
            var promotion = await GetValidPromotionByCodeAsync(request.PromoCode, order.TotalAmount ?? 0);

            order.PromoId = promotion.PromoId;
            order.DiscountAmount = await CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);

            await _orderRepository.UpdateAsync(order);
            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> RemovePromotionAsync(int orderId)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot remove promotion from order that is not pending");
            if (!order.PromoId.HasValue) throw new InvalidOperationException("No promotion applied to this order");

            order.PromoId = null;
            order.DiscountAmount = 0;
            await RecalculateOrderTotalAsync(order);

            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderResponse> CheckoutAsync(int orderId, CheckoutRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            if (order == null) throw new InvalidOperationException("Order not found");
            if (!IsPending(order)) throw new InvalidOperationException("Cannot checkout order that is not pending");
            if (order.OrderItems.Count == 0) throw new InvalidOperationException("Cannot checkout empty order");

            await RecalculateOrderTotalAsync(order);

            if (!string.IsNullOrWhiteSpace(request.PromoCode))
            {
                var promotion = await GetValidPromotionByCodeAsync(request.PromoCode, order.TotalAmount ?? 0);
                order.PromoId = promotion.PromoId;
                order.DiscountAmount = await CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);
            }

            var finalAmount = Math.Max(0, (order.TotalAmount ?? 0) - order.DiscountAmount);

            if (request.Amount != finalAmount)
                throw new InvalidOperationException($"Payment amount {request.Amount:C} does not match order amount {finalAmount:C}");

            if (request.CustomerPaid > 0 && request.CustomerPaid < finalAmount)
                throw new InvalidOperationException("Customer paid amount is insufficient");

            if (!Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var paymentMethod))
                throw new InvalidOperationException($"Invalid payment method: {request.PaymentMethod}");

            if (request.CustomerId.HasValue)
                order.CustomerId = request.CustomerId;

            var payment = new Payment
            {
                OrderId = orderId,
                Amount = finalAmount,
                PaymentMethod = paymentMethod,
                PaymentDate = DateTime.UtcNow
            };
            await _paymentRepository.AddAsync(payment);

            order.Status = OrderStatus.Paid;

            if (order.PromoId.HasValue)
            {
                var promotion = await _promotionRepository.GetByIdAsync(order.PromoId.Value);
                if (promotion != null)
                {
                    promotion.UsedCount++;
                    await _promotionRepository.UpdateAsync(promotion);
                }
            }

            await _unitOfWork.CommitTransactionAsync();

            var updatedOrder = await _orderRepository.GetByIdWithDetailsAsync(orderId);
            return _mapper.Map<OrderResponse>(updatedOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}

using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using Microsoft.Extensions.Logging;
using StoreManagement.Application.DTOs.Order;
using StoreManagement.Domain.Entities;
using StoreManagement.Domain.Enums;
using StoreManagement.Domain.Interfaces;

namespace StoreManagement.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IOrderPricingService _orderPricingService;
    private readonly IOrderPaymentService _orderPaymentService;
    private readonly IOrderInventoryService _orderInventoryService;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        IOrderPricingService orderPricingService,
        IOrderPaymentService orderPaymentService,
        IOrderInventoryService orderInventoryService,
        IMapper mapper,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _orderPricingService = orderPricingService;
        _orderPaymentService = orderPaymentService;
        _orderInventoryService = orderInventoryService;
        _mapper = mapper;
        _logger = logger;
    }
    private static bool IsPending(Order order) => order.Status == OrderStatus.Pending;

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

                await _orderInventoryService.ReserveAsync(item.ProductId, item.Quantity);

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Subtotal = item.Quantity * product.Price
                });
            }

            await _orderPricingService.RecalculateOrderAsync(order);

            if (request.PromoId.HasValue)
            {
                var promotion = await _orderPricingService.ValidatePromotionByIdAsync(request.PromoId.Value, order.TotalAmount ?? 0);
                order.PromoId = promotion.PromoId;
                order.DiscountAmount = await _orderPricingService.CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);
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
        await _orderPricingService.RecalculateOrderAsync(order);

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

            await _orderInventoryService.ReleaseOrderAsync(order);

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

            await _orderInventoryService.ReserveAsync(request.ProductId, request.Quantity);

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

        await _orderPricingService.RecalculateOrderAsync(order);
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

            await _orderInventoryService.ReserveAsync(orderItem.ProductId.Value, quantityDelta);
        }
        else if (quantityDelta < 0 && orderItem.ProductId.HasValue)
        {
            await _orderInventoryService.ReleaseAsync(orderItem.ProductId.Value, Math.Abs(quantityDelta));
        }

            orderItem.Quantity = request.Quantity;
            orderItem.Subtotal = orderItem.Quantity * orderItem.Price;

        await _orderPricingService.RecalculateOrderAsync(order);
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
            await _orderInventoryService.ReleaseAsync(orderItem.ProductId.Value, orderItem.Quantity);
        }

            order.OrderItems.Remove(orderItem);

        await _orderPricingService.RecalculateOrderAsync(order);
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

        await _orderPricingService.RecalculateOrderAsync(order);
        var promotion = await _orderPricingService.ValidatePromotionByCodeAsync(request.PromoCode, order.TotalAmount ?? 0);

            order.PromoId = promotion.PromoId;
            order.DiscountAmount = await _orderPricingService.CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);

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
        await _orderPricingService.RecalculateOrderAsync(order);

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

        await _orderPricingService.RecalculateOrderAsync(order);

            if (!string.IsNullOrWhiteSpace(request.PromoCode))
            {
            var promotion = await _orderPricingService.ValidatePromotionByCodeAsync(request.PromoCode, order.TotalAmount ?? 0);
            order.PromoId = promotion.PromoId;
            order.DiscountAmount = await _orderPricingService.CalculateDiscountAsync(promotion, order.TotalAmount ?? 0);
        }

        await _orderPaymentService.HandleCheckoutAsync(order, request);

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

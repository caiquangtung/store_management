using StoreManagement.Application.DTOs.Order;
using StoreManagement.Domain.Entities;
using StoreManagement.Domain.Enums;
using StoreManagement.Domain.Interfaces;

namespace StoreManagement.Application.Services;

/// <summary>
/// Handles payment validation and persistence for order checkout.
/// </summary>
public class OrderPaymentService : IOrderPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IPromotionRepository _promotionRepository;

    public OrderPaymentService(IPaymentRepository paymentRepository, IPromotionRepository promotionRepository)
    {
        _paymentRepository = paymentRepository;
        _promotionRepository = promotionRepository;
    }

    public async Task HandleCheckoutAsync(Order order, CheckoutRequest request)
    {
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
            OrderId = order.OrderId,
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
    }
}

using System.Linq;
using StoreManagement.Domain.Entities;
using StoreManagement.Domain.Enums;
using StoreManagement.Domain.Interfaces;

namespace StoreManagement.Application.Services;

/// <summary>
/// Handles order total calculation and promotion validation/discount computation.
/// </summary>
public class OrderPricingService : IOrderPricingService
{
    private readonly IPromotionRepository _promotionRepository;

    public OrderPricingService(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task RecalculateOrderAsync(Order order)
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

    public async Task<Promotion> ValidatePromotionByCodeAsync(string promoCode, decimal orderTotal)
    {
        var promotion = await _promotionRepository.GetByPromoCodeAsync(promoCode);
        if (promotion == null)
            throw new InvalidOperationException("Promotion not found");

        ValidatePromotionWindowAndUsage(orderTotal, promotion);

        return promotion;
    }

    public async Task<Promotion> ValidatePromotionByIdAsync(int promoId, decimal orderTotal)
    {
        var promotion = await _promotionRepository.GetByIdAsync(promoId)
                       ?? throw new InvalidOperationException("Promotion not found");

        ValidatePromotionWindowAndUsage(orderTotal, promotion);
        return promotion;
    }

    public Task<decimal> CalculateDiscountAsync(Promotion promotion, decimal orderAmount)
    {
        decimal discount = promotion.DiscountType == DiscountType.Percent
            ? orderAmount * (promotion.DiscountValue / 100)
            : Math.Min(promotion.DiscountValue, orderAmount);

        return Task.FromResult(discount);
    }

    private static void ValidatePromotionWindowAndUsage(decimal orderTotal, Promotion promotion)
    {
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
    }
}

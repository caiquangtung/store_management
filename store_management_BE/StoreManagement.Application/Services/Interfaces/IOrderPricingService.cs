using StoreManagement.Domain.Entities;

namespace StoreManagement.Application.Services;

public interface IOrderPricingService
{
    Task RecalculateOrderAsync(Order order);
    Task<Promotion> ValidatePromotionByCodeAsync(string promoCode, decimal orderTotal);
    Task<Promotion> ValidatePromotionByIdAsync(int promoId, decimal orderTotal);
    Task<decimal> CalculateDiscountAsync(Promotion promotion, decimal orderAmount);
}

namespace StoreManagement.Application.Services;

public interface IOrderService : IOrderQueryService, IOrderCartService, IOrderPromotionService, IOrderCheckoutService
{
}

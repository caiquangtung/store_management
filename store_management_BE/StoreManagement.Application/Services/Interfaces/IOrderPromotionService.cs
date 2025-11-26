using StoreManagement.Application.DTOs.Order;

namespace StoreManagement.Application.Services;

public interface IOrderPromotionService
{
    Task<OrderResponse> ApplyPromotionAsync(int orderId, ApplyPromotionRequest request);
    Task<OrderResponse> RemovePromotionAsync(int orderId);
}

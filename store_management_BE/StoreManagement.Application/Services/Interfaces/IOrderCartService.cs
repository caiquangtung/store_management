using StoreManagement.Application.DTOs.Order;

namespace StoreManagement.Application.Services;

public interface IOrderCartService
{
    Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId);
    Task<OrderResponse?> UpdateAsync(int orderId, UpdateOrderRequest request);
    Task<bool> CancelAsync(int orderId);
    Task<OrderResponse> AddItemAsync(int orderId, AddOrderItemRequest request);
    Task<OrderResponse> UpdateItemAsync(int orderId, int itemId, UpdateOrderItemRequest request);
    Task<OrderResponse> DeleteItemAsync(int orderId, int itemId);
}

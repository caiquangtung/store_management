using StoreManagement.Application.DTOs.Order;

namespace StoreManagement.Application.Services;

public interface IOrderCheckoutService
{
    Task<OrderResponse> CheckoutAsync(int orderId, CheckoutRequest request);
}

using StoreManagement.Application.DTOs.Order;
using StoreManagement.Domain.Entities;

namespace StoreManagement.Application.Services;

public interface IOrderPaymentService
{
    Task HandleCheckoutAsync(Order order, CheckoutRequest request);
}

using StoreManagement.Application.DTOs.Order;
using StoreManagement.Domain.Enums;

namespace StoreManagement.Application.Services;

public interface IOrderQueryService
{
    Task<OrderResponse?> GetByIdAsync(int orderId);
    Task<(IEnumerable<OrderResponse> Items, int TotalCount)> GetAllPagedAsync(
        int pageNumber,
        int pageSize,
        OrderStatus? status = null,
        int? userId = null,
        int? customerId = null,
        string? sortBy = null,
        bool sortDesc = false);
}

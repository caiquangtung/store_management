using StoreManagement.Domain.Entities;

namespace StoreManagement.Application.Services;

public interface IOrderInventoryService
{
    Task ReserveAsync(int productId, int quantity);
    Task ReleaseAsync(int productId, int quantity);
    Task ReleaseOrderAsync(Order order);
}

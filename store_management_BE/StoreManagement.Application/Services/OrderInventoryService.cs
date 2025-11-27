using StoreManagement.Domain.Entities;
using StoreManagement.Domain.Interfaces;

namespace StoreManagement.Application.Services;

/// <summary>
/// Encapsulates inventory reservation/release for order operations.
/// </summary>
public class OrderInventoryService : IOrderInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;

    public OrderInventoryService(IInventoryRepository inventoryRepository)
    {
        _inventoryRepository = inventoryRepository;
    }

    public async Task ReserveAsync(int productId, int quantity)
    {
        var inventory = await _inventoryRepository.GetByProductIdAsync(productId)
                       ?? throw new InvalidOperationException("Inventory not found for product");

        if (inventory.Quantity < quantity)
        {
            throw new InvalidOperationException(
                $"Insufficient inventory. Available: {inventory.Quantity}, Requested: {quantity}");
        }

        inventory.Quantity -= quantity;
        await _inventoryRepository.UpdateAsync(inventory);
    }

    public async Task ReleaseAsync(int productId, int quantity)
    {
        var inventory = await _inventoryRepository.GetByProductIdAsync(productId);
        if (inventory != null)
        {
            inventory.Quantity += quantity;
            await _inventoryRepository.UpdateAsync(inventory);
        }
        else
        {
            var newInventory = new Inventory
            {
                ProductId = productId,
                Quantity = quantity
            };
            await _inventoryRepository.AddAsync(newInventory);
        }
    }

    public async Task ReleaseOrderAsync(Order order)
    {
        foreach (var item in order.OrderItems)
        {
            if (item.ProductId.HasValue)
            {
                await ReleaseAsync(item.ProductId.Value, item.Quantity);
            }
        }
    }
}

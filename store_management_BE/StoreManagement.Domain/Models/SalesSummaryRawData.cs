namespace StoreManagement.Domain.Models;

/// <summary>
/// Raw aggregation result for sales overview reporting.
/// </summary>
public class SalesSummaryRawData
{
    public string Period { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int NumberOfOrders { get; set; }
}

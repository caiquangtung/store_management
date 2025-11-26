using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StoreManagement.Domain.Interfaces;
using StoreManagement.Infrastructure.Repositories;
using StoreManagement.Infrastructure.Services;
using StoreManagement.Application.Common.Interfaces;
using Microsoft.Extensions.Options;
using StoreManagement.Infrastructure.Models;
using StoreManagement.Infrastructure.Data;

namespace StoreManagement.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();

        services.AddScoped<IPurchaseRepository, PurchaseRepository>();
        services.AddScoped<IInventoryAdjustmentRepository, InventoryAdjustmentRepository>();

        // Unit of Work to coordinate transactions across repositories
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        // Register infrastructure services
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IJwtService, JwtService>(provider =>
        {
            var jwtSettings = provider.GetRequiredService<IOptions<JwtSettings>>().Value;
            return new JwtService(jwtSettings);
        });

        // Refresh token store (in-memory; DB-first so no schema changes)
        services.AddSingleton<IRefreshTokenStore, InMemoryRefreshTokenStore>();

        return services;
    }
}

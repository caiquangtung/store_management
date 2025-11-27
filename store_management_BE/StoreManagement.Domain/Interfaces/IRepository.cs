using System.Linq.Expressions;

namespace StoreManagement.Domain.Interfaces;

public interface IRepository<T> : IReadRepository<T>, IWriteRepository<T> where T : class
{
}

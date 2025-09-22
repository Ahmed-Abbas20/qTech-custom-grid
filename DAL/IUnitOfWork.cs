using DAL.IRepos;
using DAL.Models;

namespace DAL
{

    /// Unit of Work interface for managing database transactions
    /// Provides centralized access to all repositories
    public interface IUnitOfWork : IDisposable
    {

        IUserRepo Users { get; }

        IBaseRepo<Bank> Banks { get; }


        IBaseRepo<MaritalStatus> MaritalStatuses { get; }


        int SaveChanges();


        Task<int> SaveChangesAsync();


        Task BeginTransactionAsync();


        Task CommitTransactionAsync();


        Task RollbackTransactionAsync();
    }
}

using DAL.IRepos;
using DAL.Models;

namespace DAL
{
    /// <summary>
    /// Unit of Work interface for managing database transactions
    /// Provides centralized access to all repositories
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// User repository instance
        /// </summary>
        IUserRepo Users { get; }

        /// <summary>
        /// Bank repository instance
        /// </summary>
        IBaseRepo<Bank> Banks { get; }

        /// <summary>
        /// MaritalStatus repository instance
        /// </summary>
        IBaseRepo<MaritalStatus> MaritalStatuses { get; }

        /// <summary>
        /// Save all changes to database synchronously
        /// </summary>
        /// <returns>Number of affected records</returns>
        int SaveChanges();

        /// <summary>
        /// Save all changes to database asynchronously
        /// </summary>
        /// <returns>Number of affected records</returns>
        Task<int> SaveChangesAsync();

        /// <summary>
        /// Begin database transaction
        /// </summary>
        /// <returns>Transaction instance</returns>
        Task BeginTransactionAsync();

        /// <summary>
        /// Commit current transaction
        /// </summary>
        Task CommitTransactionAsync();

        /// <summary>
        /// Rollback current transaction
        /// </summary>
        Task RollbackTransactionAsync();
    }
}

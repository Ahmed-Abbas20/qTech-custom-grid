using BLL.Repos;
using DAL;
using DAL.Data;
using DAL.IRepos;
using DAL.Models;

namespace BLL
{
    /// <summary>
    /// Unit of Work implementation for managing JSON data operations
    /// Provides centralized access to all repositories
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly JsonDataService _dataService;

        // Repository instances
        private IUserRepo? _users;
        private IBaseRepo<Bank>? _banks;
        private IBaseRepo<MaritalStatus>? _maritalStatuses;

        /// <summary>
        /// Constructor with JSON data service injection
        /// </summary>
        /// <param name="dataService">JSON data service</param>
        public UnitOfWork(JsonDataService dataService)
        {
            _dataService = dataService;
        }

        /// <summary>
        /// User repository instance (lazy initialization)
        /// </summary>
        public IUserRepo Users => _users ??= new UserRepo(_dataService);

        /// <summary>
        /// Bank repository instance (lazy initialization)
        /// </summary>
        public IBaseRepo<Bank> Banks => _banks ??= new BaseRepo<Bank>(_dataService);

        /// <summary>
        /// MaritalStatus repository instance (lazy initialization)
        /// </summary>
        public IBaseRepo<MaritalStatus> MaritalStatuses => _maritalStatuses ??= new BaseRepo<MaritalStatus>(_dataService);

        /// <summary>
        /// Save all changes synchronously (no-op for JSON, changes are saved immediately)
        /// </summary>
        /// <returns>Number of affected records (always returns 1 for JSON)</returns>
        public int SaveChanges()
        {
            // JSON data is saved immediately in each operation
            return 1;
        }

        /// <summary>
        /// Save all changes asynchronously (no-op for JSON, changes are saved immediately)
        /// </summary>
        /// <returns>Number of affected records (always returns 1 for JSON)</returns>
        public async Task<int> SaveChangesAsync()
        {
            // JSON data is saved immediately in each operation
            return await Task.FromResult(1);
        }

        /// <summary>
        /// Begin transaction (no-op for JSON)
        /// </summary>
        public async Task BeginTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }

        /// <summary>
        /// Commit current transaction (no-op for JSON)
        /// </summary>
        public async Task CommitTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }

        /// <summary>
        /// Rollback current transaction (no-op for JSON)
        /// </summary>
        public async Task RollbackTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }

        /// <summary>
        /// Dispose resources
        /// </summary>
        public void Dispose()
        {
            // Nothing to dispose for JSON data service
        }
    }
}

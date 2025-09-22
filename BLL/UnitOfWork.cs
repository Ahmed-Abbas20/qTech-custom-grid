using BLL.Repos;
using DAL;
using DAL.Data;
using DAL.IRepos;
using DAL.Models;

namespace BLL
{
    /// Unit of Work implementation for managing JSON data operations
    /// Provides centralized access to all repositories
    public class UnitOfWork : IUnitOfWork
    {
        private readonly JsonDataService _dataService;

        // Repository instances
        private IUserRepo? _users;
        private IBaseRepo<Bank>? _banks;
        private IBaseRepo<MaritalStatus>? _maritalStatuses;


        /// Constructor with JSON data service injection
        public UnitOfWork(JsonDataService dataService)
        {
            _dataService = dataService;
        }


        /// User repository instance (lazy initialization)
        public IUserRepo Users => _users ??= new UserRepo(_dataService);

        /// Bank repository instance (lazy initialization)
        public IBaseRepo<Bank> Banks => _banks ??= new BaseRepo<Bank>(_dataService);


        /// MaritalStatus repository instance (lazy initialization)
        public IBaseRepo<MaritalStatus> MaritalStatuses => _maritalStatuses ??= new BaseRepo<MaritalStatus>(_dataService);


        /// Save all changes synchronously (no-op for JSON, changes are saved immediately)
        public int SaveChanges()
        {
            // JSON data is saved immediately in each operation
            return 1;
        }

        /// Save all changes asynchronously (no-op for JSON, changes are saved immediately)
        public async Task<int> SaveChangesAsync()
        {
            // JSON data is saved immediately in each operation
            return await Task.FromResult(1);
        }

        /// Begin transaction (no-op for JSON)
        public async Task BeginTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }

        /// Commit current transaction (no-op for JSON)
        public async Task CommitTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }

   
        /// Rollback current transaction (no-op for JSON)
        public async Task RollbackTransactionAsync()
        {
            // JSON doesn't support transactions, operations are atomic per file write
            await Task.CompletedTask;
        }


        public void Dispose()
        {
          
        }
    }
}

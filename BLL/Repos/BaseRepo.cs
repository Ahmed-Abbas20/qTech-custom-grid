using DAL.Data;
using DAL.IRepos;
using DAL.Models;
using System.Linq.Expressions;

namespace BLL.Repos
{
    /// <summary>
    /// Generic base repository implementation for common CRUD operations
    /// Implements standard JSON-based operations for all entities
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    public class BaseRepo<T> : IBaseRepo<T> where T : class
    {
        protected readonly JsonDataService _dataService;

        /// <summary>
        /// Constructor with JSON data service injection
        /// </summary>
        /// <param name="dataService">JSON data service</param>
        public BaseRepo(JsonDataService dataService)
        {
            _dataService = dataService;
        }

        /// <summary>
        /// Get all entities asynchronously
        /// </summary>
        /// <returns>Collection of all entities</returns>
        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            var data = await _dataService.ReadDataAsync();
            
            if (typeof(T) == typeof(Bank))
                return (IEnumerable<T>)data.Banks;
            else if (typeof(T) == typeof(MaritalStatus))
                return (IEnumerable<T>)data.MaritalStatuses;
            else if (typeof(T) == typeof(User))
                return (IEnumerable<T>)data.Users;
            
            return new List<T>();
        }

        /// <summary>
        /// Get entity by ID asynchronously
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>Entity if found, null otherwise</returns>
        public virtual async Task<T?> GetByIdAsync(int id)
        {
            var entities = await GetAllAsync();
            return entities.FirstOrDefault(e => GetEntityId(e) == id);
        }

        /// <summary>
        /// Find entities by condition asynchronously
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>Collection of matching entities</returns>
        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Where(predicate.Compile());
        }

        /// <summary>
        /// Get first entity matching condition asynchronously
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>First matching entity or null</returns>
        public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.FirstOrDefault(predicate.Compile());
        }

        /// <summary>
        /// Add new entity asynchronously
        /// </summary>
        /// <param name="entity">Entity to add</param>
        /// <returns>Added entity</returns>
        public virtual async Task<T> AddAsync(T entity)
        {
            var data = await _dataService.ReadDataAsync();
            
            if (typeof(T) == typeof(Bank) && entity is Bank bank)
            {
                bank.Id = data.Banks.Any() ? data.Banks.Max(b => b.Id) + 1 : 1;
                bank.CreatedAt = DateTime.Now;
                data.Banks.Add(bank);
            }
            else if (typeof(T) == typeof(MaritalStatus) && entity is MaritalStatus maritalStatus)
            {
                maritalStatus.Id = data.MaritalStatuses.Any() ? data.MaritalStatuses.Max(m => m.Id) + 1 : 1;
                maritalStatus.CreatedAt = DateTime.Now;
                data.MaritalStatuses.Add(maritalStatus);
            }
            else if (typeof(T) == typeof(User) && entity is User user)
            {
                user.Id = data.Users.Any() ? data.Users.Max(u => u.Id) + 1 : 1;
                user.CreatedAt = DateTime.Now;
                user.UpdatedAt = DateTime.Now;
                data.Users.Add(user);
            }
            
            await _dataService.WriteDataAsync(data);
            return entity;
        }

        /// <summary>
        /// Add multiple entities asynchronously
        /// </summary>
        /// <param name="entities">Entities to add</param>
        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                await AddAsync(entity);
            }
        }

        /// <summary>
        /// Update existing entity
        /// </summary>
        /// <param name="entity">Entity to update</param>
        public virtual async void Update(T entity)
        {
            await UpdateAsync(entity);
        }

        /// <summary>
        /// Update existing entity asynchronously
        /// </summary>
        /// <param name="entity">Entity to update</param>
        public virtual async Task UpdateAsync(T entity)
        {
            var data = await _dataService.ReadDataAsync();
            var entityId = GetEntityId(entity);
            
            if (typeof(T) == typeof(Bank) && entity is Bank bank)
            {
                var existingBank = data.Banks.FirstOrDefault(b => b.Id == entityId);
                if (existingBank != null)
                {
                    var index = data.Banks.IndexOf(existingBank);
                    bank.CreatedAt = existingBank.CreatedAt;
                    data.Banks[index] = bank;
                }
            }
            else if (typeof(T) == typeof(MaritalStatus) && entity is MaritalStatus maritalStatus)
            {
                var existingStatus = data.MaritalStatuses.FirstOrDefault(m => m.Id == entityId);
                if (existingStatus != null)
                {
                    var index = data.MaritalStatuses.IndexOf(existingStatus);
                    maritalStatus.CreatedAt = existingStatus.CreatedAt;
                    data.MaritalStatuses[index] = maritalStatus;
                }
            }
            else if (typeof(T) == typeof(User) && entity is User user)
            {
                var existingUser = data.Users.FirstOrDefault(u => u.Id == entityId);
                if (existingUser != null)
                {
                    var index = data.Users.IndexOf(existingUser);
                    user.CreatedAt = existingUser.CreatedAt;
                    user.UpdatedAt = DateTime.Now;
                    data.Users[index] = user;
                }
            }
            
            await _dataService.WriteDataAsync(data);
        }

        /// <summary>
        /// Update multiple entities
        /// </summary>
        /// <param name="entities">Entities to update</param>
        public virtual async void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                await UpdateAsync(entity);
            }
        }

        /// <summary>
        /// Delete entity
        /// </summary>
        /// <param name="entity">Entity to delete</param>
        public virtual async void Delete(T entity)
        {
            var entityId = GetEntityId(entity);
            await DeleteByIdAsync(entityId);
        }

        /// <summary>
        /// Delete entity by ID
        /// </summary>
        /// <param name="id">Entity ID to delete</param>
        public virtual async Task DeleteByIdAsync(int id)
        {
            var data = await _dataService.ReadDataAsync();
            
            if (typeof(T) == typeof(Bank))
            {
                var bank = data.Banks.FirstOrDefault(b => b.Id == id);
                if (bank != null)
                {
                    data.Banks.Remove(bank);
                    await _dataService.WriteDataAsync(data);
                }
            }
            else if (typeof(T) == typeof(MaritalStatus))
            {
                var maritalStatus = data.MaritalStatuses.FirstOrDefault(m => m.Id == id);
                if (maritalStatus != null)
                {
                    data.MaritalStatuses.Remove(maritalStatus);
                    await _dataService.WriteDataAsync(data);
                }
            }
            else if (typeof(T) == typeof(User))
            {
                var user = data.Users.FirstOrDefault(u => u.Id == id);
                if (user != null)
                {
                    data.Users.Remove(user);
                    await _dataService.WriteDataAsync(data);
                }
            }
        }

        /// <summary>
        /// Delete multiple entities
        /// </summary>
        /// <param name="entities">Entities to delete</param>
        public virtual async void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                var entityId = GetEntityId(entity);
                await DeleteByIdAsync(entityId);
            }
        }

        /// <summary>
        /// Check if entity exists by condition
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>True if exists, false otherwise</returns>
        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Any(predicate.Compile());
        }

        /// <summary>
        /// Count entities by condition
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>Count of matching entities</returns>
        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Count(predicate.Compile());
        }

        /// <summary>
        /// Get entities with pagination
        /// </summary>
        /// <param name="pageNumber">Page number (1-based)</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="predicate">Optional filter condition</param>
        /// <returns>Paged collection of entities</returns>
        public virtual async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>>? predicate = null)
        {
            var entities = await GetAllAsync();
            var query = entities.AsQueryable();
            
            if (predicate != null)
            {
                query = query.Where(predicate.Compile()).AsQueryable();
            }

            return query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        /// <summary>
        /// Get entity ID using reflection
        /// </summary>
        /// <param name="entity">Entity to get ID from</param>
        /// <returns>Entity ID</returns>
        private int GetEntityId(T entity)
        {
            var idProperty = typeof(T).GetProperty("Id");
            if (idProperty != null && idProperty.PropertyType == typeof(int))
            {
                return (int)idProperty.GetValue(entity)!;
            }
            return 0;
        }
    }
}

using System.Linq.Expressions;

namespace DAL.IRepos
{
    /// <summary>
    /// Generic base repository interface for common CRUD operations
    /// Provides standard database operations for all entities
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    public interface IBaseRepo<T> where T : class
    {
        /// <summary>
        /// Get all entities asynchronously
        /// </summary>
        /// <returns>Collection of all entities</returns>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Get entity by ID asynchronously
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>Entity if found, null otherwise</returns>
        Task<T?> GetByIdAsync(int id);

        /// <summary>
        /// Find entities by condition asynchronously
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>Collection of matching entities</returns>
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Get first entity matching condition asynchronously
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>First matching entity or null</returns>
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Add new entity asynchronously
        /// </summary>
        /// <param name="entity">Entity to add</param>
        /// <returns>Added entity</returns>
        Task<T> AddAsync(T entity);

        /// <summary>
        /// Add multiple entities asynchronously
        /// </summary>
        /// <param name="entities">Entities to add</param>
        Task AddRangeAsync(IEnumerable<T> entities);

        /// <summary>
        /// Update existing entity
        /// </summary>
        /// <param name="entity">Entity to update</param>
        void Update(T entity);

        /// <summary>
        /// Update multiple entities
        /// </summary>
        /// <param name="entities">Entities to update</param>
        void UpdateRange(IEnumerable<T> entities);

        /// <summary>
        /// Delete entity
        /// </summary>
        /// <param name="entity">Entity to delete</param>
        void Delete(T entity);

        /// <summary>
        /// Delete entity by ID
        /// </summary>
        /// <param name="id">Entity ID to delete</param>
        Task DeleteByIdAsync(int id);

        /// <summary>
        /// Delete multiple entities
        /// </summary>
        /// <param name="entities">Entities to delete</param>
        void DeleteRange(IEnumerable<T> entities);

        /// <summary>
        /// Check if entity exists by condition
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>True if exists, false otherwise</returns>
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Count entities by condition
        /// </summary>
        /// <param name="predicate">Search condition</param>
        /// <returns>Count of matching entities</returns>
        Task<int> CountAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Get entities with pagination
        /// </summary>
        /// <param name="pageNumber">Page number (1-based)</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="predicate">Optional filter condition</param>
        /// <returns>Paged collection of entities</returns>
        Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>>? predicate = null);
    }
}

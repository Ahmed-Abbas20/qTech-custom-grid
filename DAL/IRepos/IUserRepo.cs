using DAL.Models;

namespace DAL.IRepos
{
    /// <summary>
    /// User repository interface for specific user operations
    /// Extends base repository with user-specific methods
    /// </summary>
    public interface IUserRepo : IBaseRepo<User>
    {
        /// <summary>
        /// Get users with their related data (Bank, MaritalStatus)
        /// </summary>
        /// <returns>Collection of users with includes</returns>
        Task<IEnumerable<User>> GetUsersWithDetailsAsync();

        /// <summary>
        /// Get user by ID with related data
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User with includes or null</returns>
        Task<User?> GetUserWithDetailsByIdAsync(int id);

        /// <summary>
        /// Search users by multiple criteria
        /// </summary>
        /// <param name="searchTerm">Search term for name, mobile, or identity</param>
        /// <param name="phoneSearch">Search term for phone number</param>
        /// <param name="idSearch">Search term for identity number</param>
        /// <returns>Collection of matching users</returns>
        Task<IEnumerable<User>> SearchUsersAsync(string? searchTerm = null, string? phoneSearch = null, string? idSearch = null);

        /// <summary>
        /// Check if identity number already exists
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
        /// <returns>True if exists, false otherwise</returns>
        Task<bool> IsIdentityNumberExistsAsync(string identityNumber, int? excludeUserId = null);

        /// <summary>
        /// Get users with pagination and search
        /// </summary>
        /// <param name="pageNumber">Page number</param>
        /// <param name="pageSize">Page size</param>
        /// <param name="searchTerm">Optional search term</param>
        /// <param name="phoneSearch">Optional phone search term</param>
        /// <param name="idSearch">Optional ID search term</param>
        /// <param name="sortColumn">Sort column</param>
        /// <param name="sortOrder">Sort order (ASC/DESC)</param>
        /// <returns>Paged collection of users</returns>
        Task<IEnumerable<User>> GetUsersPagedAsync(int pageNumber, int pageSize, string? searchTerm = null, string? phoneSearch = null, string? idSearch = null, string? sortColumn = null, string? sortOrder = null);

        /// <summary>
        /// Get total count of users matching search criteria
        /// </summary>
        /// <param name="searchTerm">Optional search term</param>
        /// <param name="phoneSearch">Optional phone search term</param>
        /// <param name="idSearch">Optional ID search term</param>
        /// <returns>Total count</returns>
        Task<int> GetUsersCountAsync(string? searchTerm = null, string? phoneSearch = null, string? idSearch = null);

        /// <summary>
        /// Delete multiple users by IDs
        /// </summary>
        /// <param name="userIds">Collection of user IDs to delete</param>
        Task DeleteUsersAsync(IEnumerable<int> userIds);
    }
}

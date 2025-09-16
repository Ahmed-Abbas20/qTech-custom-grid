using DAL.Data;
using DAL.IRepos;
using DAL.Models;

namespace BLL.Repos
{
    /// <summary>
    /// User repository implementation for specific user operations
    /// Extends base repository with user-specific methods
    /// </summary>
    public class UserRepo : BaseRepo<User>, IUserRepo
    {
        /// <summary>
        /// Constructor with JSON data service injection
        /// </summary>
        /// <param name="dataService">JSON data service</param>
        public UserRepo(JsonDataService dataService) : base(dataService)
        {
        }

        /// <summary>
        /// Get users with their related data (Bank, MaritalStatus)
        /// </summary>
        /// <returns>Collection of users with includes</returns>
        public async Task<IEnumerable<User>> GetUsersWithDetailsAsync()
        {
            return await _dataService.GetUsersWithDetailsAsync();
        }

        /// <summary>
        /// Get user by ID with related data
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User with includes or null</returns>
        public async Task<User?> GetUserWithDetailsByIdAsync(int id)
        {
            return await _dataService.GetUserWithDetailsByIdAsync(id);
        }

        /// <summary>
        /// Search users by multiple criteria
        /// </summary>
        /// <param name="searchTerm">Search term for name, mobile, or identity</param>
        /// <param name="phoneSearch">Search term for phone number</param>
        /// <param name="idSearch">Search term for identity number</param>
        /// <returns>Collection of matching users</returns>
        public async Task<IEnumerable<User>> SearchUsersAsync(string? searchTerm = null, string? phoneSearch = null, string? idSearch = null)
        {
            var users = await GetUsersWithDetailsAsync();

            if (string.IsNullOrWhiteSpace(searchTerm) && 
                string.IsNullOrWhiteSpace(phoneSearch) && 
                string.IsNullOrWhiteSpace(idSearch))
            {
                return users;
            }

            var filteredUsers = users.AsEnumerable();

            // Filter by phone search
            if (!string.IsNullOrWhiteSpace(phoneSearch))
            {
                filteredUsers = filteredUsers.Where(u => u.MobileNumber.Contains(phoneSearch.Trim()));
            }

            // Filter by ID search
            if (!string.IsNullOrWhiteSpace(idSearch))
            {
                filteredUsers = filteredUsers.Where(u => u.IdentityNumber.Contains(idSearch.Trim()));
            }

            // Filter by general search term
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower().Trim();
                filteredUsers = filteredUsers.Where(u => 
                    u.FirstName.ToLower().Contains(lowerSearchTerm) ||
                    u.FatherName.ToLower().Contains(lowerSearchTerm) ||
                    u.GrandFatherName.ToLower().Contains(lowerSearchTerm) ||
                    u.FamilyName.ToLower().Contains(lowerSearchTerm) ||
                    u.MobileNumber.Contains(searchTerm) ||
                    u.IdentityNumber.Contains(searchTerm));
            }

            return filteredUsers;
        }

        /// <summary>
        /// Check if identity number already exists
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
        /// <returns>True if exists, false otherwise</returns>
        public async Task<bool> IsIdentityNumberExistsAsync(string identityNumber, int? excludeUserId = null)
        {
            return await _dataService.IsIdentityNumberExistsAsync(identityNumber, excludeUserId);
        }

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
        public async Task<IEnumerable<User>> GetUsersPagedAsync(int pageNumber, int pageSize, string? searchTerm = null, string? phoneSearch = null, string? idSearch = null, string? sortColumn = null, string? sortOrder = null)
        {
            var users = await SearchUsersAsync(searchTerm, phoneSearch, idSearch);
            
            // Apply sorting
            if (!string.IsNullOrWhiteSpace(sortColumn))
            {
                var isDescending = sortOrder?.ToUpper() == "DESC";
                
                users = sortColumn.ToLower() switch
                {
                    "fullname" => isDescending ? users.OrderByDescending(u => u.FirstName + " " + u.FatherName + " " + u.GrandFatherName + " " + u.FamilyName) : users.OrderBy(u => u.FirstName + " " + u.FatherName + " " + u.GrandFatherName + " " + u.FamilyName),
                    "identitynumber" => isDescending ? users.OrderByDescending(u => u.IdentityNumber) : users.OrderBy(u => u.IdentityNumber),
                    "mobilenumber" => isDescending ? users.OrderByDescending(u => u.MobileNumber) : users.OrderBy(u => u.MobileNumber),
                    "maritalstatusname" => isDescending ? users.OrderByDescending(u => u.MaritalStatus?.Name ?? "") : users.OrderBy(u => u.MaritalStatus?.Name ?? ""),
                    "nationalityname" => isDescending ? users.OrderByDescending(u => u.Nationality.ToString()) : users.OrderBy(u => u.Nationality.ToString()),
                    "email" => isDescending ? users.OrderByDescending(u => u.Email ?? "") : users.OrderBy(u => u.Email ?? ""),
                    _ => users.OrderBy(u => u.FirstName)
                };
            }
            else
            {
                users = users.OrderBy(u => u.FirstName);
            }
            
            return users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }

        /// <summary>
        /// Get total count of users matching search criteria
        /// </summary>
        /// <param name="searchTerm">Optional search term</param>
        /// <param name="phoneSearch">Optional phone search term</param>
        /// <param name="idSearch">Optional ID search term</param>
        /// <returns>Total count</returns>
        public async Task<int> GetUsersCountAsync(string? searchTerm = null, string? phoneSearch = null, string? idSearch = null)
        {
            var users = await SearchUsersAsync(searchTerm, phoneSearch, idSearch);
            return users.Count();
        }

        /// <summary>
        /// Delete multiple users by IDs
        /// </summary>
        /// <param name="userIds">Collection of user IDs to delete</param>
        public async Task DeleteUsersAsync(IEnumerable<int> userIds)
        {
            await _dataService.DeleteUsersAsync(userIds);
        }
    }
}

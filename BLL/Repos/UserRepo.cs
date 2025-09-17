using DAL.Data;
using DAL.IRepos;
using DAL.Models;

namespace BLL.Repos
{

    public class UserRepo : BaseRepo<User>, IUserRepo
    {

        public UserRepo(JsonDataService dataService) : base(dataService)
        {
        }


        public async Task<IEnumerable<User>> GetUsersWithDetailsAsync()
        {
            return await _dataService.GetUsersWithDetailsAsync();
        }


        public async Task<User?> GetUserWithDetailsByIdAsync(int id)
        {
            return await _dataService.GetUserWithDetailsByIdAsync(id);
        }


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


        public async Task<int> GetUsersCountAsync(string? searchTerm = null, string? phoneSearch = null, string? idSearch = null)
        {
            var users = await SearchUsersAsync(searchTerm, phoneSearch, idSearch);
            return users.Count();
        }


        public async Task DeleteUsersAsync(IEnumerable<int> userIds)
        {
            await _dataService.DeleteUsersAsync(userIds);
        }
    }
}

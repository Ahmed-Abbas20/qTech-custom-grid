using DAL.Models;
using System.Text.Json;

namespace DAL.Data
{
    /// <summary>
    /// JSON data service for managing data persistence in JSON files
    /// Provides thread-safe operations for reading and writing JSON data
    /// </summary>
    public class JsonDataService
    {
        private readonly string _dataFilePath;
        private readonly JsonSerializerOptions _jsonOptions;
        private readonly object _lockObject = new object();

        public JsonDataService(string dataFilePath)
        {
            _dataFilePath = dataFilePath;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
                PropertyNameCaseInsensitive = true
            };
            
            EnsureDataFileExists();
        }

        /// <summary>
        /// Data model for JSON file structure
        /// </summary>
        public class JsonDataModel
        {
            public List<User> Users { get; set; } = new List<User>();
            public List<Bank> Banks { get; set; } = new List<Bank>();
            public List<MaritalStatus> MaritalStatuses { get; set; } = new List<MaritalStatus>();
        }

        /// <summary>
        /// Read all data from JSON file
        /// </summary>
        /// <returns>Complete data model</returns>
        public async Task<JsonDataModel> ReadDataAsync()
        {
            try
            {
                lock (_lockObject)
                {
                    if (!File.Exists(_dataFilePath))
                    {
                        return new JsonDataModel();
                    }

                    var jsonContent = File.ReadAllText(_dataFilePath);
                    if (string.IsNullOrWhiteSpace(jsonContent))
                    {
                        return new JsonDataModel();
                    }

                    var data = JsonSerializer.Deserialize<JsonDataModel>(jsonContent, _jsonOptions);
                    return data ?? new JsonDataModel();
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error reading data from {_dataFilePath}: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Write all data to JSON file
        /// </summary>
        /// <param name="data">Complete data model</param>
        public async Task WriteDataAsync(JsonDataModel data)
        {
            try
            {
                lock (_lockObject)
                {
                    var jsonContent = JsonSerializer.Serialize(data, _jsonOptions);
                    File.WriteAllText(_dataFilePath, jsonContent);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error writing data to {_dataFilePath}: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get all users with their related data populated
        /// </summary>
        /// <returns>Collection of users with includes</returns>
        public async Task<IEnumerable<User>> GetUsersWithDetailsAsync()
        {
            var data = await ReadDataAsync();
            
            // Populate navigation properties
            foreach (var user in data.Users)
            {
                if (user.BankId.HasValue)
                {
                    user.Bank = data.Banks.FirstOrDefault(b => b.Id == user.BankId.Value);
                }
                
                if (user.MaritalStatusId.HasValue)
                {
                    user.MaritalStatus = data.MaritalStatuses.FirstOrDefault(m => m.Id == user.MaritalStatusId.Value);
                }
            }

            return data.Users;
        }

        /// <summary>
        /// Get user by ID with related data
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User with includes or null</returns>
        public async Task<User?> GetUserWithDetailsByIdAsync(int id)
        {
            var users = await GetUsersWithDetailsAsync();
            return users.FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Get all banks
        /// </summary>
        /// <returns>Collection of banks</returns>
        public async Task<IEnumerable<Bank>> GetBanksAsync()
        {
            var data = await ReadDataAsync();
            return data.Banks;
        }

        /// <summary>
        /// Get all marital statuses
        /// </summary>
        /// <returns>Collection of marital statuses</returns>
        public async Task<IEnumerable<MaritalStatus>> GetMaritalStatusesAsync()
        {
            var data = await ReadDataAsync();
            return data.MaritalStatuses;
        }

        /// <summary>
        /// Add new user
        /// </summary>
        /// <param name="user">User to add</param>
        /// <returns>Added user with generated ID</returns>
        public async Task<User> AddUserAsync(User user)
        {
            var data = await ReadDataAsync();
            
            // Generate new ID
            user.Id = data.Users.Any() ? data.Users.Max(u => u.Id) + 1 : 1;
            user.CreatedAt = DateTime.Now;
            user.UpdatedAt = DateTime.Now;
            
            data.Users.Add(user);
            await WriteDataAsync(data);
            
            return user;
        }

        /// <summary>
        /// Update existing user
        /// </summary>
        /// <param name="user">User to update</param>
        public async Task UpdateUserAsync(User user)
        {
            var data = await ReadDataAsync();
            var existingUser = data.Users.FirstOrDefault(u => u.Id == user.Id);
            
            if (existingUser != null)
            {
                var index = data.Users.IndexOf(existingUser);
                user.UpdatedAt = DateTime.Now;
                user.CreatedAt = existingUser.CreatedAt; // Preserve original creation date
                data.Users[index] = user;
                await WriteDataAsync(data);
            }
        }

        /// <summary>
        /// Delete user by ID
        /// </summary>
        /// <param name="id">User ID to delete</param>
        public async Task DeleteUserAsync(int id)
        {
            var data = await ReadDataAsync();
            var user = data.Users.FirstOrDefault(u => u.Id == id);
            
            if (user != null)
            {
                data.Users.Remove(user);
                await WriteDataAsync(data);
            }
        }

        /// <summary>
        /// Delete multiple users by IDs
        /// </summary>
        /// <param name="userIds">Collection of user IDs to delete</param>
        public async Task DeleteUsersAsync(IEnumerable<int> userIds)
        {
            var data = await ReadDataAsync();
            var usersToDelete = data.Users.Where(u => userIds.Contains(u.Id)).ToList();
            
            foreach (var user in usersToDelete)
            {
                data.Users.Remove(user);
            }
            
            if (usersToDelete.Any())
            {
                await WriteDataAsync(data);
            }
        }

        /// <summary>
        /// Check if identity number already exists
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
        /// <returns>True if exists, false otherwise</returns>
        public async Task<bool> IsIdentityNumberExistsAsync(string identityNumber, int? excludeUserId = null)
        {
            var data = await ReadDataAsync();
            return data.Users.Any(u => u.IdentityNumber == identityNumber && 
                                     (!excludeUserId.HasValue || u.Id != excludeUserId.Value));
        }

        /// <summary>
        /// Ensure data file exists with initial structure
        /// </summary>
        private void EnsureDataFileExists()
        {
            if (!File.Exists(_dataFilePath))
            {
                var initialData = new JsonDataModel();
                var jsonContent = JsonSerializer.Serialize(initialData, _jsonOptions);
                Directory.CreateDirectory(Path.GetDirectoryName(_dataFilePath)!);
                File.WriteAllText(_dataFilePath, jsonContent);
            }
        }
    }
}

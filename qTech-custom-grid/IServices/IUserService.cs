using qTech_custom_grid.ViewModels;

namespace qTech_custom_grid.IServices
{
    /// <summary>
    /// User service interface for business logic operations
    /// Handles all user-related business operations and validations
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Get all users with pagination and search
        /// </summary>
        /// <param name="searchModel">Search and pagination parameters</param>
        /// <returns>Search results with users and pagination info</returns>
        Task<UserSearchViewModel> GetUsersAsync(UserSearchViewModel searchModel);

        /// <summary>
        /// Get user by ID for details view
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details or null if not found</returns>
        Task<UserDetailsViewModel?> GetUserByIdAsync(int id);

        /// <summary>
        /// Get user by ID for editing
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User edit model or null if not found</returns>
        Task<EditUserViewModel?> GetUserForEditAsync(int id);

        /// <summary>
        /// Create new user
        /// </summary>
        /// <param name="model">User creation model</param>
        /// <returns>Success result with user ID or validation errors</returns>
        Task<ServiceResult<int>> CreateUserAsync(CreateUserViewModel model);

        /// <summary>
        /// Update existing user
        /// </summary>
        /// <param name="model">User update model</param>
        /// <returns>Success result or validation errors</returns>
        Task<ServiceResult<bool>> UpdateUserAsync(EditUserViewModel model);

        /// <summary>
        /// Delete user by ID
        /// </summary>
        /// <param name="id">User ID to delete</param>
        /// <returns>Success result or error message</returns>
        Task<ServiceResult<bool>> DeleteUserAsync(int id);

        /// <summary>
        /// Delete multiple users by IDs
        /// </summary>
        /// <param name="userIds">Collection of user IDs to delete</param>
        /// <returns>Success result with count of deleted users or error message</returns>
        Task<ServiceResult<int>> DeleteUsersAsync(IEnumerable<int> userIds);

        /// <summary>
        /// Get form data for user creation/editing (dropdowns)
        /// </summary>
        /// <returns>Form data with banks and marital statuses</returns>
        Task<UserFormDataViewModel> GetUserFormDataAsync();

        /// <summary>
        /// Validate if identity number is unique
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
        /// <returns>True if unique, false if exists</returns>
        Task<bool> IsIdentityNumberUniqueAsync(string identityNumber, int? excludeUserId = null);

        /// <summary>
        /// Check if identity number exists (for validation)
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <returns>True if exists, false otherwise</returns>
        Task<bool> CheckIdentityNumberExistsAsync(string identityNumber);

        /// <summary>
        /// Validate hiring date is not in the future
        /// </summary>
        /// <param name="hiringDate">Hiring date to validate</param>
        /// <returns>True if valid, false if in future</returns>
        bool ValidateHiringDate(DateTime hiringDate);

        /// <summary>
        /// Calculate vacation balance for a user
        /// </summary>
        /// <param name="hiringDate">User's hiring date</param>
        /// <returns>Vacation balance in days</returns>
        int CalculateVacationBalance(DateTime hiringDate);
    }

    /// <summary>
    /// Generic service result class for returning operation results
    /// </summary>
    /// <typeparam name="T">Result data type</typeparam>
    public class ServiceResult<T>
    {
        /// <summary>
        /// Indicates if operation was successful
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// Result data if operation was successful
        /// </summary>
        public T? Data { get; set; }

        /// <summary>
        /// Error message if operation failed
        /// </summary>
        public string? ErrorMessage { get; set; }

        /// <summary>
        /// Collection of validation errors
        /// </summary>
        public IEnumerable<string> ValidationErrors { get; set; } = new List<string>();

        /// <summary>
        /// Create successful result
        /// </summary>
        /// <param name="data">Result data</param>
        /// <returns>Successful service result</returns>
        public static ServiceResult<T> Success(T data)
        {
            return new ServiceResult<T>
            {
                IsSuccess = true,
                Data = data
            };
        }

        /// <summary>
        /// Create failed result with error message
        /// </summary>
        /// <param name="errorMessage">Error message</param>
        /// <returns>Failed service result</returns>
        public static ServiceResult<T> Failure(string errorMessage)
        {
            return new ServiceResult<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage
            };
        }

        /// <summary>
        /// Create failed result with validation errors
        /// </summary>
        /// <param name="validationErrors">Collection of validation errors</param>
        /// <returns>Failed service result</returns>
        public static ServiceResult<T> ValidationFailure(IEnumerable<string> validationErrors)
        {
            return new ServiceResult<T>
            {
                IsSuccess = false,
                ValidationErrors = validationErrors
            };
        }
    }
}

using AutoMapper;
using DAL;
using DAL.Models;
using qTech_custom_grid.IServices;
using qTech_custom_grid.ViewModels;

namespace qTech_custom_grid.Services
{
    /// <summary>
    /// User service implementation for business logic operations
    /// Handles all user-related business operations and validations
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor with dependency injection
        /// </summary>
        /// <param name="unitOfWork">Unit of work for data access</param>
        /// <param name="mapper">AutoMapper for object mapping</param>
        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Get all users with pagination and search
        /// </summary>
        /// <param name="searchModel">Search and pagination parameters</param>
        /// <returns>Search results with users and pagination info</returns>
        public async Task<UserSearchViewModel> GetUsersAsync(UserSearchViewModel searchModel)
        {
            try
            {
                // Get users with pagination and search
                var users = await _unitOfWork.Users.GetUsersPagedAsync(
                    searchModel.PageNumber, 
                    searchModel.PageSize, 
                    searchModel.SearchTerm,
                    searchModel.PhoneSearch,
                    searchModel.IdSearch,
                    searchModel.SortColumn,
                    searchModel.SortOrder);

                // Get total count for pagination
                var totalCount = await _unitOfWork.Users.GetUsersCountAsync(
                    searchModel.SearchTerm,
                    searchModel.PhoneSearch,
                    searchModel.IdSearch);

                // Map to ViewModels
                var userViewModels = _mapper.Map<IEnumerable<UserListViewModel>>(users);

                return new UserSearchViewModel
                {
                    SearchTerm = searchModel.SearchTerm,
                    PageNumber = searchModel.PageNumber,
                    PageSize = searchModel.PageSize,
                    TotalCount = totalCount,
                    Users = userViewModels
                };
            }
            catch (Exception ex)
            {
                // Log exception (implement logging as needed)
                return new UserSearchViewModel
                {
                    SearchTerm = searchModel.SearchTerm,
                    PageNumber = searchModel.PageNumber,
                    PageSize = searchModel.PageSize,
                    Users = new List<UserListViewModel>()
                };
            }
        }

        /// <summary>
        /// Get user by ID for details view
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details or null if not found</returns>
        public async Task<UserDetailsViewModel?> GetUserByIdAsync(int id)
        {
            try
            {
                var user = await _unitOfWork.Users.GetUserWithDetailsByIdAsync(id);
                return user != null ? _mapper.Map<UserDetailsViewModel>(user) : null;
            }
            catch (Exception ex)
            {
                // Log exception
                return null;
            }
        }

        /// <summary>
        /// Get user by ID for editing
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User edit model or null if not found</returns>
        public async Task<EditUserViewModel?> GetUserForEditAsync(int id)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id);
                return user != null ? _mapper.Map<EditUserViewModel>(user) : null;
            }
            catch (Exception ex)
            {
                // Log exception
                return null;
            }
        }

        /// <summary>
        /// Create new user
        /// </summary>
        /// <param name="model">User creation model</param>
        /// <returns>Success result with user ID or validation errors</returns>
        public async Task<ServiceResult<int>> CreateUserAsync(CreateUserViewModel model)
        {
            try
            {
                // Validate business rules
                var validationErrors = await ValidateUserAsync(model);
                if (validationErrors.Any())
                {
                    return ServiceResult<int>.ValidationFailure(validationErrors);
                }

                // Map to entity
                var user = _mapper.Map<User>(model);

                // Add to database
                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();

                return ServiceResult<int>.Success(user.Id);
            }
            catch (Exception ex)
            {
                // Log exception
                return ServiceResult<int>.Failure("حدث خطأ أثناء إضافة المستخدم");
            }
        }

        /// <summary>
        /// Update existing user
        /// </summary>
        /// <param name="model">User update model</param>
        /// <returns>Success result or validation errors</returns>
        public async Task<ServiceResult<bool>> UpdateUserAsync(EditUserViewModel model)
        {
            try
            {
                // Check if user exists
                var existingUser = await _unitOfWork.Users.GetByIdAsync(model.Id);
                if (existingUser == null)
                {
                    return ServiceResult<bool>.Failure("المستخدم غير موجود");
                }

                // Validate business rules
                var validationErrors = await ValidateUserAsync(model, model.Id);
                if (validationErrors.Any())
                {
                    return ServiceResult<bool>.ValidationFailure(validationErrors);
                }

                // Map changes to existing entity
                _mapper.Map(model, existingUser);

                // Update in database
                _unitOfWork.Users.Update(existingUser);
                await _unitOfWork.SaveChangesAsync();

                return ServiceResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                // Log exception
                return ServiceResult<bool>.Failure("حدث خطأ أثناء تحديث المستخدم");
            }
        }

        /// <summary>
        /// Delete user by ID
        /// </summary>
        /// <param name="id">User ID to delete</param>
        /// <returns>Success result or error message</returns>
        public async Task<ServiceResult<bool>> DeleteUserAsync(int id)
        {
            try
            {
                // Check if user exists first
                var existingUser = await _unitOfWork.Users.GetByIdAsync(id);
                if (existingUser == null)
                {
                    return ServiceResult<bool>.Failure("المستخدم غير موجود");
                }

                // Use the BaseRepo's DeleteByIdAsync method which handles the deletion and saves immediately
                await _unitOfWork.Users.DeleteByIdAsync(id);
                
                // No need to call SaveChangesAsync as DeleteByIdAsync already saves the data
                return ServiceResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                // Log exception
                return ServiceResult<bool>.Failure("حدث خطأ أثناء حذف المستخدم: " + ex.Message);
            }
        }

        /// <summary>
        /// Delete multiple users by IDs
        /// </summary>
        /// <param name="userIds">Collection of user IDs to delete</param>
        /// <returns>Success result with count of deleted users or error message</returns>
        public async Task<ServiceResult<int>> DeleteUsersAsync(IEnumerable<int> userIds)
        {
            try
            {
                if (!userIds.Any())
                {
                    return ServiceResult<int>.Failure("لم يتم تحديد مستخدمين للحذف");
                }

                await _unitOfWork.Users.DeleteUsersAsync(userIds);
                var deletedCount = await _unitOfWork.SaveChangesAsync();

                return ServiceResult<int>.Success(deletedCount);
            }
            catch (Exception ex)
            {
                // Log exception
                return ServiceResult<int>.Failure("حدث خطأ أثناء حذف المستخدمين");
            }
        }

        /// <summary>
        /// Get form data for user creation/editing (dropdowns)
        /// </summary>
        /// <returns>Form data with banks and marital statuses</returns>
        public async Task<UserFormDataViewModel> GetUserFormDataAsync()
        {
            try
            {
                var banks = await _unitOfWork.Banks.FindAsync(b => b.IsActive);
                var maritalStatuses = await _unitOfWork.MaritalStatuses.FindAsync(m => m.IsActive);

                return new UserFormDataViewModel
                {
                    Banks = _mapper.Map<IEnumerable<SelectListItemViewModel>>(banks),
                    MaritalStatuses = _mapper.Map<IEnumerable<SelectListItemViewModel>>(maritalStatuses)
                };
            }
            catch (Exception ex)
            {
                // Log exception
                return new UserFormDataViewModel();
            }
        }

        /// <summary>
        /// Validate if identity number is unique
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
        /// <returns>True if unique, false if exists</returns>
        public async Task<bool> IsIdentityNumberUniqueAsync(string identityNumber, int? excludeUserId = null)
        {
            try
            {
                return !await _unitOfWork.Users.IsIdentityNumberExistsAsync(identityNumber, excludeUserId);
            }
            catch (Exception ex)
            {
                // Log exception
                return false;
            }
        }

        /// <summary>
        /// Validate hiring date is not in the future
        /// </summary>
        /// <param name="hiringDate">Hiring date to validate</param>
        /// <returns>True if valid, false if in future</returns>
        public bool ValidateHiringDate(DateTime hiringDate)
        {
            return hiringDate.Date <= DateTime.Now.Date;
        }

        /// <summary>
        /// Calculate vacation balance for a user
        /// </summary>
        /// <param name="hiringDate">User's hiring date</param>
        /// <returns>Vacation balance in days</returns>
        public int CalculateVacationBalance(DateTime hiringDate)
        {
            var yearsOfService = (DateTime.Now - hiringDate).TotalDays / 365.25;
            return (int)(yearsOfService * 21);
        }

        /// <summary>
        /// Validate user data for business rules
        /// </summary>
        /// <param name="model">User model to validate</param>
        /// <param name="excludeUserId">User ID to exclude from uniqueness checks</param>
        /// <returns>Collection of validation errors</returns>
        private async Task<IEnumerable<string>> ValidateUserAsync(CreateUserViewModel model, int? excludeUserId = null)
        {
            var errors = new List<string>();

            try
            {
                // Check identity number uniqueness
                if (!await IsIdentityNumberUniqueAsync(model.IdentityNumber, excludeUserId))
                {
                    errors.Add("عفوا رقم الهوية مكرر");
                }

                // Validate hiring date
                if (!ValidateHiringDate(model.HiringDate))
                {
                    errors.Add("لا يمكن ان يكون تاريخ التعيين بعد تاريخ اليوم");
                }

                // Additional business validations can be added here
            }
            catch (Exception ex)
            {
                // Log exception
                errors.Add("حدث خطأ أثناء التحقق من البيانات");
            }

            return errors;
        }

        /// <summary>
        /// Check if identity number exists (for validation)
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <returns>True if exists, false otherwise</returns>
        public async Task<bool> CheckIdentityNumberExistsAsync(string identityNumber)
        {
            try
            {
                return !(await IsIdentityNumberUniqueAsync(identityNumber));
            }
            catch (Exception ex)
            {
                // Log error and return false as safe default
                return false;
            }
        }
    }
}

using DAL.Models;
using System.ComponentModel.DataAnnotations;

namespace qTech_custom_grid.ViewModels
{
    /// <summary>
    /// ViewModel for displaying user list in grid
    /// Contains only necessary fields for grid display
    /// </summary>
    public class UserListViewModel
    {
        public int Id { get; set; }
        public string IdentityNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string? MaritalStatusName { get; set; }
        public string NationalityName { get; set; } = string.Empty;
        public string? Email { get; set; }
    }

    /// <summary>
    /// ViewModel for creating new user
    /// Contains all required fields with validation
    /// </summary>
    public class CreateUserViewModel
    {
        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "الاسم الأول يجب ألا يزيد عن 15 حرف")]
        [Display(Name = "الاسم الأول")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "اسم الأب يجب ألا يزيد عن 15 حرف")]
        [Display(Name = "اسم الأب")]
        public string FatherName { get; set; } = string.Empty;

        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "اسم الجد يجب ألا يزيد عن 15 حرف")]
        [Display(Name = "اسم الجد")]
        public string GrandFatherName { get; set; } = string.Empty;

        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "لقب العائلة يجب ألا يزيد عن 15 حرف")]
        [Display(Name = "لقب العائلة")]
        public string FamilyName { get; set; } = string.Empty;

        [Required(ErrorMessage = "برجاء ادخال تاريخ الميلاد")]
        [DataType(DataType.Date)]
        [Display(Name = "تاريخ الميلاد")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "برجاء ادخال رقم الحساب البنكي")]
        [StringLength(30, ErrorMessage = "رقم الحساب البنكي يجب ألا يزيد عن 30 حرف")]
        [Display(Name = "رقم الحساب البنكي")]
        public string BankAccountNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "برجاء إدخال رقم الهوية")]
        [StringLength(10, ErrorMessage = "رقم الهوية يجب ألا يزيد عن 10 أرقام")]
        [RegularExpression(@"^\d{1,10}$", ErrorMessage = "رقم الهوية يجب أن يحتوي على أرقام فقط")]
        [Display(Name = "رقم الهوية")]
        public string IdentityNumber { get; set; } = string.Empty;

        [Display(Name = "البنك")]
        public int? BankId { get; set; }

        [Required(ErrorMessage = "برجاء اختيار الجنسية")]
        [Display(Name = "الجنسية")]
        public NationalityType Nationality { get; set; }

        [Required(ErrorMessage = "برجاء ادخال رقم الجوال")]
        [StringLength(12, ErrorMessage = "رقم الجوال يجب ألا يزيد عن 12 رقم")]
        [RegularExpression(@"^9665\d{8}$", ErrorMessage = "عفوا رقم الجوال لابد ان يبدأ بـ 9665")]
        [Display(Name = "رقم الجوال")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        [Display(Name = "الجنس")]
        public GenderType Gender { get; set; } = GenderType.Male;

        [StringLength(50, ErrorMessage = "البريد الإلكتروني يجب ألا يزيد عن 50 حرف")]
        [EmailAddress(ErrorMessage = "عفوا صيغة البريد الالكتروني غير صحيح")]
        [Display(Name = "البريد الإلكتروني")]
        public string? Email { get; set; }

        [Display(Name = "الحالة الاجتماعية")]
        public int? MaritalStatusId { get; set; }

        [StringLength(200, ErrorMessage = "المؤهل الدراسي يجب ألا يزيد عن 200 حرف")]
        [Display(Name = "المؤهل الدراسي")]
        public string? EducationalQualification { get; set; }

        [Required(ErrorMessage = "برجاء ادخال تاريخ التعيين")]
        [DataType(DataType.Date)]
        [Display(Name = "تاريخ التعيين")]
        public DateTime HiringDate { get; set; }
    }

    /// <summary>
    /// ViewModel for editing existing user
    /// Extends CreateUserViewModel with ID field
    /// </summary>
    public class EditUserViewModel : CreateUserViewModel
    {
        public int Id { get; set; }
    }

    /// <summary>
    /// ViewModel for displaying user details
    /// Contains all user information including computed fields
    /// </summary>
    public class UserDetailsViewModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string FatherName { get; set; } = string.Empty;
        public string GrandFatherName { get; set; } = string.Empty;
        public string FamilyName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string BankAccountNumber { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
        public string? BankName { get; set; }
        public string NationalityName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string GenderName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? MaritalStatusName { get; set; }
        public string? EducationalQualification { get; set; }
        public DateTime HiringDate { get; set; }
        public int VacationBalance { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// ViewModel for search functionality
    /// Contains search criteria and pagination
    /// </summary>
    public class UserSearchViewModel
    {
        public string? SearchTerm { get; set; }
        public string? PhoneSearch { get; set; }
        public string? IdSearch { get; set; }
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int TotalCount { get; set; }
        public IEnumerable<UserListViewModel> Users { get; set; } = new List<UserListViewModel>();
        
        /// <summary>
        /// Calculate total pages based on total count and page size
        /// </summary>
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        
        /// <summary>
        /// Check if there is a previous page
        /// </summary>
        public bool HasPreviousPage => PageNumber > 1;
        
        /// <summary>
        /// Check if there is a next page
        /// </summary>
        public bool HasNextPage => PageNumber < TotalPages;
    }

    /// <summary>
    /// ViewModel for dropdown lists
    /// Contains data for Banks and MaritalStatuses
    /// </summary>
    public class UserFormDataViewModel
    {
        public IEnumerable<SelectListItemViewModel> Banks { get; set; } = new List<SelectListItemViewModel>();
        public IEnumerable<SelectListItemViewModel> MaritalStatuses { get; set; } = new List<SelectListItemViewModel>();
    }

    /// <summary>
    /// Generic ViewModel for dropdown items
    /// </summary>
    public class SelectListItemViewModel
    {
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
    }

    /// <summary>
    /// ViewModel for bulk operations
    /// Contains selected user IDs for batch operations
    /// </summary>
    public class BulkOperationViewModel
    {
        public IEnumerable<int> SelectedUserIds { get; set; } = new List<int>();
        public string Operation { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    /// <summary>
    /// User entity model representing employee data
    /// Contains all required fields for user management system
    /// </summary>
    public class User
    {
        /// <summary>
        /// Primary key for User entity
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// First name of the user (required, max 15 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "الاسم الأول يجب ألا يزيد عن 15 حرف")]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Father's name (required, max 15 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "اسم الأب يجب ألا يزيد عن 15 حرف")]
        public string FatherName { get; set; } = string.Empty;

        /// <summary>
        /// Grandfather's name (required, max 15 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "اسم الجد يجب ألا يزيد عن 15 حرف")]
        public string GrandFatherName { get; set; } = string.Empty;

        /// <summary>
        /// Family surname (required, max 15 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال الاسم الاول واسم الاب واسم الجد و لقب العائلة")]
        [StringLength(15, ErrorMessage = "لقب العائلة يجب ألا يزيد عن 15 حرف")]
        public string FamilyName { get; set; } = string.Empty;

        /// <summary>
        /// Full name computed property combining all name parts
        /// </summary>
        [JsonIgnore]
        public string FullName => $"{FirstName} {FatherName} {GrandFatherName} {FamilyName}";

        /// <summary>
        /// Date of birth (required)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال تاريخ الميلاد")]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// Bank account number (required, max 30 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال رقم الحساب البنكي")]
        [StringLength(30, ErrorMessage = "رقم الحساب البنكي يجب ألا يزيد عن 30 حرف")]
        public string BankAccountNumber { get; set; } = string.Empty;

        /// <summary>
        /// Identity number (required, unique, max 10 digits)
        /// </summary>
        [Required(ErrorMessage = "برجاء إدخال رقم الهوية")]
        [StringLength(10, ErrorMessage = "رقم الهوية يجب ألا يزيد عن 10 أرقام")]
        [RegularExpression(@"^\d{1,10}$", ErrorMessage = "رقم الهوية يجب أن يحتوي على أرقام فقط")]
        public string IdentityNumber { get; set; } = string.Empty;

        /// <summary>
        /// Bank ID (optional, foreign key)
        /// </summary>
        public int? BankId { get; set; }

        /// <summary>
        /// Navigation property to Bank entity
        /// </summary>
        [JsonIgnore]
        public Bank? Bank { get; set; }

        /// <summary>
        /// Nationality (required)
        /// </summary>
        [Required(ErrorMessage = "برجاء اختيار الجنسية")]
        public NationalityType Nationality { get; set; }

        /// <summary>
        /// Mobile number (required, must start with 9665, max 12 characters)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال رقم الجوال")]
        [StringLength(12, ErrorMessage = "رقم الجوال يجب ألا يزيد عن 12 رقم")]
        [RegularExpression(@"^9665\d{8}$", ErrorMessage = "عفوا رقم الجوال لابد ان يبدأ بـ 9665")]
        public string MobileNumber { get; set; } = string.Empty;

        /// <summary>
        /// Gender (required, default is Male)
        /// </summary>
        [Required]
        public GenderType Gender { get; set; } = GenderType.Male;

        /// <summary>
        /// Email address (optional, max 50 characters)
        /// </summary>
        [StringLength(50, ErrorMessage = "البريد الإلكتروني يجب ألا يزيد عن 50 حرف")]
        [EmailAddress(ErrorMessage = "عفوا صيغة البريد الالكتروني غير صحيح")]
        public string? Email { get; set; }

        /// <summary>
        /// Marital status ID (optional, foreign key)
        /// </summary>
        public int? MaritalStatusId { get; set; }

        /// <summary>
        /// Navigation property to MaritalStatus entity
        /// </summary>
        [JsonIgnore]
        public MaritalStatus? MaritalStatus { get; set; }

        /// <summary>
        /// Educational qualification (optional, max 200 characters)
        /// </summary>
        [StringLength(200, ErrorMessage = "المؤهل الدراسي يجب ألا يزيد عن 200 حرف")]
        public string? EducationalQualification { get; set; }

        /// <summary>
        /// Hiring date (required, cannot be in the future)
        /// </summary>
        [Required(ErrorMessage = "برجاء ادخال تاريخ التعيين")]
        [DataType(DataType.Date)]
        public DateTime HiringDate { get; set; }

        /// <summary>
        /// Vacation balance computed property (21 days per year)
        /// Calculated from hiring date to current date
        /// </summary>
        [JsonIgnore]
        public int VacationBalance
        {
            get
            {
                var yearsOfService = (DateTime.Now - HiringDate).TotalDays / 365.25;
                return (int)(yearsOfService * 21);
            }
        }

        /// <summary>
        /// Record creation timestamp
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Record last update timestamp
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    /// <summary>
    /// Bank entity model for storing bank information
    /// Used in dropdown list for user bank selection
    /// </summary>
    public class Bank
    {
        /// <summary>
        /// Primary key for Bank entity
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Bank name (required, max 100 characters)
        /// </summary>
        [Required(ErrorMessage = "اسم البنك مطلوب")]
        [StringLength(100, ErrorMessage = "اسم البنك يجب ألا يزيد عن 100 حرف")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Bank code (optional, for identification)
        /// </summary>
        [StringLength(10, ErrorMessage = "كود البنك يجب ألا يزيد عن 10 أحرف")]
        public string? Code { get; set; }

        /// <summary>
        /// Indicates if bank is active
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Record creation timestamp
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Navigation property to Users
        /// </summary>
        [JsonIgnore]
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}

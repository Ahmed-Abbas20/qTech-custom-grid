using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    /// <summary>
    /// MaritalStatus entity model for storing marital status information
    /// Used in dropdown list for user marital status selection
    /// </summary>
    public class MaritalStatus
    {
        /// <summary>
        /// Primary key for MaritalStatus entity
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Marital status name (required, max 50 characters)
        /// Examples: أعزب, متزوج, مطلق, أرمل
        /// </summary>
        [Required(ErrorMessage = "الحالة الاجتماعية مطلوبة")]
        [StringLength(50, ErrorMessage = "الحالة الاجتماعية يجب ألا تزيد عن 50 حرف")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if marital status is active
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

namespace DAL.Models
{
    /// <summary>
    /// Enumeration for nationality types
    /// Defines whether user is Saudi or Foreign
    /// </summary>
    public enum NationalityType
    {
        /// <summary>
        /// Saudi nationality
        /// </summary>
        Saudi = 1,

        /// <summary>
        /// Foreign nationality
        /// </summary>
        Foreign = 2
    }

    /// <summary>
    /// Enumeration for gender types
    /// Defines user gender with default value as Male
    /// </summary>
    public enum GenderType
    {
        /// <summary>
        /// Male gender (default)
        /// </summary>
        Male = 1,

        /// <summary>
        /// Female gender
        /// </summary>
        Female = 2
    }
}

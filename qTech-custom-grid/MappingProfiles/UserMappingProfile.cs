using AutoMapper;
using DAL.Models;
using qTech_custom_grid.ViewModels;

namespace qTech_custom_grid.MappingProfiles
{
    /// <summary>
    /// AutoMapper profile for User entity and ViewModels mapping
    /// Defines how to map between User model and various ViewModels
    /// </summary>
    public class UserMappingProfile : Profile
    {
        /// <summary>
        /// Configure mapping rules for User-related mappings
        /// </summary>
        public UserMappingProfile()
        {
            // User to UserListViewModel mapping
            CreateMap<User, UserListViewModel>()
                .ForMember(dest => dest.MaritalStatusName, 
                          opt => opt.MapFrom(src => src.MaritalStatus != null ? src.MaritalStatus.Name : null))
                .ForMember(dest => dest.NationalityName, 
                          opt => opt.MapFrom(src => GetNationalityName(src.Nationality)));

            // User to UserDetailsViewModel mapping
            CreateMap<User, UserDetailsViewModel>()
                .ForMember(dest => dest.BankName, 
                          opt => opt.MapFrom(src => src.Bank != null ? src.Bank.Name : null))
                .ForMember(dest => dest.MaritalStatusName, 
                          opt => opt.MapFrom(src => src.MaritalStatus != null ? src.MaritalStatus.Name : null))
                .ForMember(dest => dest.NationalityName, 
                          opt => opt.MapFrom(src => GetNationalityName(src.Nationality)))
                .ForMember(dest => dest.GenderName, 
                          opt => opt.MapFrom(src => GetGenderName(src.Gender)));

            // CreateUserViewModel to User mapping
            CreateMap<CreateUserViewModel, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Bank, opt => opt.Ignore())
                .ForMember(dest => dest.MaritalStatus, opt => opt.Ignore());

            // EditUserViewModel to User mapping
            CreateMap<EditUserViewModel, User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Bank, opt => opt.Ignore())
                .ForMember(dest => dest.MaritalStatus, opt => opt.Ignore());

            // User to EditUserViewModel mapping (for editing)
            CreateMap<User, EditUserViewModel>();

            // Bank to SelectListItemViewModel mapping
            CreateMap<Bank, SelectListItemViewModel>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Name));

            // MaritalStatus to SelectListItemViewModel mapping
            CreateMap<MaritalStatus, SelectListItemViewModel>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Name));
        }

        /// <summary>
        /// Get nationality name in Arabic based on enum value
        /// </summary>
        /// <param name="nationality">Nationality enum value</param>
        /// <returns>Arabic nationality name</returns>
        private static string GetNationalityName(NationalityType nationality)
        {
            return nationality switch
            {
                NationalityType.Saudi => "سعودي",
                NationalityType.Foreign => "أجنبي",
                _ => "غير محدد"
            };
        }

        /// <summary>
        /// Get gender name in Arabic based on enum value
        /// </summary>
        /// <param name="gender">Gender enum value</param>
        /// <returns>Arabic gender name</returns>
        private static string GetGenderName(GenderType gender)
        {
            return gender switch
            {
                GenderType.Male => "ذكر",
                GenderType.Female => "أنثى",
                _ => "غير محدد"
            };
        }
    }
}

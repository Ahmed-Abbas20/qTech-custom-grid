using BLL;
using BLL.Repos;
using DAL;
using DAL.Data;
using DAL.IRepos;
using DAL.Models;
using qTech_custom_grid.IServices;
using qTech_custom_grid.MappingProfiles;
using qTech_custom_grid.Services;

namespace qTech_custom_grid
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            // Configure JSON Data Service
            var dataFilePath = Path.Combine(builder.Environment.ContentRootPath, "Data", "data.json");
            builder.Services.AddSingleton<JsonDataService>(provider => new JsonDataService(dataFilePath));

            // Register AutoMapper with profiles
            builder.Services.AddAutoMapper(typeof(UserMappingProfile).Assembly);

            // Register Repository Pattern services
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<IBaseRepo<Bank>, BaseRepo<Bank>>();
            builder.Services.AddScoped<IBaseRepo<MaritalStatus>, BaseRepo<MaritalStatus>>();

            // Register Business Logic services
            builder.Services.AddScoped<IUserService, UserService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=User}/{action=Index}/{id?}");

            app.Run();
        }
    }
}

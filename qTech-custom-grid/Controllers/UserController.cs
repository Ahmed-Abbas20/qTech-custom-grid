using Microsoft.AspNetCore.Mvc;
using qTech_custom_grid.IServices;
using qTech_custom_grid.ViewModels;
using System.Text.Json;
using System.Text.Encodings.Web;

/// <summary>
/// Model for grid request from mGrid
/// </summary>
public class GridRequestModel
{
    public string sortColumn { get; set; } = "";
    public string sortOrder { get; set; } = "";
    public int pageIndex { get; set; } = 0;
    public int pageRowCounts { get; set; } = 10;
    public string searchTerm { get; set; } = "";
    public string phoneSearch { get; set; } = "";
    public string idSearch { get; set; } = "";
}

/// <summary>
/// Model for delete user request
/// </summary>
public class DeleteUserRequest
{
    public int id { get; set; }
}

namespace qTech_custom_grid.Controllers
{
    /// <summary>
    /// User controller for managing user operations
    /// Handles CRUD operations and provides JSON API endpoints for grid
    /// </summary>
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        /// <summary>
        /// Constructor with dependency injection
        /// </summary>
        /// <param name="userService">User service for business logic</param>
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Display users grid page
        /// </summary>
        /// <returns>Index view with users grid</returns>
        public async Task<IActionResult> Index()
        {
            // Initialize search model with default values
            var searchModel = new UserSearchViewModel
            {
                PageNumber = 1,
                PageSize = 10
            };

            // Get users for initial load
            var result = await _userService.GetUsersAsync(searchModel);
            
            return View(result);
        }

        /// <summary>
        /// Get users data for mGrid (AJAX endpoint)
        /// </summary>
        /// <param name="sortColumn">Sort column name</param>
        /// <param name="sortOrder">Sort order (ASC/DESC)</param>
        /// <param name="pageIndex">Page index (0-based)</param>
        /// <param name="pageRowCounts">Number of rows per page</param>
        /// <param name="searchTerm">Search term</param>
        /// <returns>JSON result in mGrid format</returns>
        [HttpPost]
        public async Task<IActionResult> GetUsersForGrid([FromBody] GridRequestModel request)
        {
            try
            {
                // Debug logging to see what parameters are received
                System.Diagnostics.Debug.WriteLine($"GetUsersForGrid called with: phoneSearch='{request?.phoneSearch}', idSearch='{request?.idSearch}', searchTerm='{request?.searchTerm}'");
                
                // Handle null request
                if (request == null)
                {
                    request = new GridRequestModel();
                }
                
                // Ensure minimum values for pagination
                int pageSize = request.pageRowCounts > 0 ? request.pageRowCounts : 10;
                
                var searchModel = new UserSearchViewModel
                {
                    SearchTerm = request.searchTerm,
                    PhoneSearch = request.phoneSearch,
                    IdSearch = request.idSearch,
                    SortColumn = request.sortColumn,
                    SortOrder = request.sortOrder,
                    PageNumber = request.pageIndex + 1, // Convert to 1-based
                    PageSize = pageSize
                };

                var result = await _userService.GetUsersAsync(searchModel);
                
                // Map user data to match the grid column names exactly
                var mappedData = result.Users.Select(u => new
                {
                    Id = u.Id,
                    IdentityNumber = u.IdentityNumber,
                    FullName = u.FullName,
                    MobileNumber = u.MobileNumber,
                    MaritalStatusName = u.MaritalStatusName ?? "غير محدد",
                    NationalityName = u.NationalityName,
                    Email = u.Email ?? "غير محدد"
                }).ToArray();

                // Create the mGrid-expected response structure
                var gridResponse = new
                {
                    Data = mappedData,
                    rowsCount = result.TotalCount,
                    pageIndex = request.pageIndex,
                    pagesCount = (int)Math.Ceiling((double)result.TotalCount / pageSize),
                    customResult = new { }
                };

                // Return in both formats to support different mGrid configurations
                // First try the .d format, but also include Json property for compatibility
                var serializedData = System.Text.Json.JsonSerializer.Serialize(gridResponse);
                var response = new
                {
                    d = serializedData,
                    Json = serializedData
                };
                var temp = Json(response);

                return Json(response);
            }
            catch (Exception ex)
            {
                // Return error response in the same format
                var errorResponse = new
                {
                    Data = new object[0],
                    rowsCount = 0,
                    pageIndex = 0,
                    pagesCount = 0,
                    customResult = new { }
                };

                var serializedErrorData = System.Text.Json.JsonSerializer.Serialize(errorResponse);
                var response = new
                {
                    d = serializedErrorData,
                    Json = serializedErrorData
                };

                return Json(response);
            }
        }


        /// <summary>
        /// Get user details by ID
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>Details view or NotFound</returns>
        public async Task<IActionResult> Details(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        /// <summary>
        /// Show create user modal (AJAX endpoint)
        /// </summary>
        /// <returns>Partial view for create user modal</returns>
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var formData = await _userService.GetUserFormDataAsync();
            ViewBag.FormData = formData;
            
            var model = new CreateUserViewModel
            {
                Gender = DAL.Models.GenderType.Male, // Default value
                HiringDate = DateTime.Now.Date // Default to today
            };

            return PartialView("_CreateUserModalV2", model);
        }

        /// <summary>
        /// Check if identity number exists (for validation)
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <returns>JSON result indicating if identity exists</returns>
        [HttpPost]
        public async Task<IActionResult> CheckIdentityExists(string identityNumber)
        {
            try
            {
                var exists = await _userService.CheckIdentityNumberExistsAsync(identityNumber);
                return Json(new { d = exists });
            }
            catch (Exception ex)
            {
                return Json(new { d = false });
            }
        }

        /// <summary>
        /// Create new user (AJAX POST endpoint)
        /// </summary>
        /// <param name="model">User creation model</param>
        /// <returns>JSON result with success/error message</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] CreateUserViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var formData = await _userService.GetUserFormDataAsync();
                    ViewBag.FormData = formData;
                    
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage);
                    
                    return Json(new { 
                        success = false, 
                        message = "يرجى تصحيح الأخطاء التالية:",
                        errors = errors,
                        html = await this.RenderViewAsync("_CreateUserModalV2", model, true)
                    });
                }

                var result = await _userService.CreateUserAsync(model);
                
                if (result.IsSuccess)
                {
                    return Json(new { 
                        success = true, 
                        message = "تم إضافة المستخدم بنجاح",
                        userId = result.Data 
                    });
                }
                else
                {
                    var formData = await _userService.GetUserFormDataAsync();
                    ViewBag.FormData = formData;
                    
                    return Json(new { 
                        success = false, 
                        message = result.ErrorMessage ?? "حدث خطأ أثناء إضافة المستخدم",
                        errors = result.ValidationErrors,
                        html = await this.RenderViewAsync("_CreateUserModalV2", model, true)
                    });
                }
            }
            catch (Exception ex)
            {
                // Add debugging information
                System.Diagnostics.Debug.WriteLine($"Create User Exception: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    System.Diagnostics.Debug.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                
                return Json(new { 
                    success = false, 
                    message = "حدث خطأ غير متوقع: " + ex.Message 
                });
            }
        }


        /// <summary>
        /// Delete single user (AJAX POST endpoint)
        /// </summary>
        /// <param name="request">Delete request with user ID</param>
        /// <returns>JSON result with success/error message</returns>
        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public async Task<IActionResult> Delete([FromBody] DeleteUserRequest request)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"Delete request received: {System.Text.Json.JsonSerializer.Serialize(request)}");
                
                if (request == null || request.id <= 0)
                {
                    System.Diagnostics.Debug.WriteLine("Invalid request or ID");
                    return Json(new { 
                        success = false, 
                        message = "معرف المستخدم غير صحيح" 
                    });
                }

                var result = await _userService.DeleteUserAsync(request.id);
                
                if (result.IsSuccess)
                {
                    return Json(new { 
                        success = true, 
                        message = "تم حذف المستخدم بنجاح" 
                    });
                }
                else
                {
                    return Json(new { 
                        success = false, 
                        message = result.ErrorMessage ?? "حدث خطأ أثناء حذف المستخدم" 
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = "حدث خطأ غير متوقع" 
                });
            }
        }

        /// <summary>
        /// Delete multiple users (AJAX POST endpoint)
        /// </summary>
        /// <param name="userIds">Array of user IDs to delete</param>
        /// <returns>JSON result with success/error message</returns>
        [HttpPost]
        // [ValidateAntiForgeryToken] // Temporarily disabled for testing
        public async Task<IActionResult> DeleteMultiple([FromBody] int[] userIds)
        {
            try
            {
                if (userIds == null || !userIds.Any())
                {
                    return Json(new { 
                        success = false, 
                        message = "لم يتم تحديد مستخدمين للحذف" 
                    });
                }

                var result = await _userService.DeleteUsersAsync(userIds);
                
                if (result.IsSuccess)
                {
                    return Json(new { 
                        success = true, 
                        message = $"تم حذف {result.Data} مستخدم بنجاح" 
                    });
                }
                else
                {
                    return Json(new { 
                        success = false, 
                        message = result.ErrorMessage ?? "حدث خطأ أثناء حذف المستخدمين" 
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { 
                    success = false, 
                    message = "حدث خطأ غير متوقع" 
                });
            }
        }

        /// <summary>
        /// Check if identity number is unique (AJAX endpoint for validation)
        /// </summary>
        /// <param name="identityNumber">Identity number to check</param>
        /// <param name="id">Current user ID (for edit scenarios)</param>
        /// <returns>JSON result indicating if identity is unique</returns>
        [HttpGet]
        public async Task<IActionResult> CheckIdentityNumber(string identityNumber, int? id = null)
        {
            try
            {
                var isUnique = await _userService.IsIdentityNumberUniqueAsync(identityNumber, id);
                return Json(isUnique);
            }
            catch (Exception ex)
            {
                return Json(false);
            }
        }

        /// <summary>
        /// Calculate vacation balance for preview (AJAX endpoint)
        /// </summary>
        /// <param name="hiringDate">Hiring date</param>
        /// <returns>JSON result with vacation balance</returns>
        [HttpGet]
        public IActionResult CalculateVacationBalance(DateTime hiringDate)
        {
            try
            {
                var balance = _userService.CalculateVacationBalance(hiringDate);
                return Json(new { success = true, balance = balance });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, balance = 0 });
            }
        }
    }

    /// <summary>
    /// Extension methods for controller
    /// </summary>
    public static class ControllerExtensions
    {
        /// <summary>
        /// Render view to string for AJAX responses
        /// </summary>
        /// <param name="controller">Controller instance</param>
        /// <param name="viewName">View name</param>
        /// <param name="model">Model object</param>
        /// <param name="partial">Is partial view</param>
        /// <returns>Rendered HTML string</returns>
        public static async Task<string> RenderViewAsync<TModel>(this Controller controller, string viewName, TModel model, bool partial = false)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                viewName = controller.ControllerContext.ActionDescriptor.ActionName;
            }

            controller.ViewData.Model = model;

            using (var writer = new StringWriter())
            {
                var viewEngine = controller.HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Mvc.ViewEngines.ICompositeViewEngine)) as Microsoft.AspNetCore.Mvc.ViewEngines.ICompositeViewEngine;
                var viewResult = viewEngine.FindView(controller.ControllerContext, viewName, !partial);

                if (viewResult.View == null)
                {
                    throw new ArgumentNullException($"{viewName} does not match any available view");
                }

                var viewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext(controller.ControllerContext, viewResult.View, controller.ViewData, controller.TempData, writer, new Microsoft.AspNetCore.Mvc.ViewFeatures.HtmlHelperOptions());

                await viewResult.View.RenderAsync(viewContext);

                return writer.GetStringBuilder().ToString();
            }
        }
    }
}

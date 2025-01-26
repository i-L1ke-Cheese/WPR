using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Runtime.InteropServices;
using System.Security.Claims;

namespace Project_WPR.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class RegisterController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _context;

        public RegisterController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext context) {
            _userManager = userManager;
            _signinManager = signinManager;
            _context = context;
        }
        // zorgt ervoor dat er een account wordt aangemaakt
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request, string renter) {

            User user = null;

            if (renter.Equals("Private")) {
                user = new PrivateRenter {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth

                };
            } else if (renter.Equals("Business")) {
                user = new BusinessRenter {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth
                };
            } else if (renter.Equals("Admin")) {
                user = new CompanyAdmin {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth,
                    CompanyId = 0

                };
            } else if (renter.Equals("VehicleManager")) {
                user = new VehicleManager {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth,
                    CompanyId = 0
                };
            } else if (renter.Equals("FrontOffice")) {
                user = new CA_Employee {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth,
                    Department = "Frontoffice"
                };
            } else if (renter.Equals("BackOffice")) {
                user = new CA_Employee {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth,
                    Department = "Backoffice"
                };
            }

            if (user == null) {
                return BadRequest("Unsupported user type");
            }

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "User registered successfully" });
        }
        [HttpPost("register-company-account")]
        [Authorize]
        public async Task<IActionResult> RegisterCompanyAccount([FromBody] RegisterDTO request) {
            if (User == null || !User.Identity.IsAuthenticated) {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound("Logged in user not found?! (this should never happen)");
            }
            var companyAdmin = await _context.CompanyAdmin.FirstOrDefaultAsync(ca => ca.Id == userID);
            if (companyAdmin == null) {
                return Unauthorized(new { Msg = "You do not have permission to create a business renter account." });
            }

            if (request.AccountType == "businessRenter")
            {
                BusinessRenter businessRenter = new BusinessRenter();
                businessRenter.CompanyId = companyAdmin.CompanyId;
                businessRenter.Email = request.Email;
                businessRenter.FirstName = request.FirstName;
                businessRenter.LastName = request.LastName;
                businessRenter.BirthDate = request.dateOfBirth;
                businessRenter.UserName = request.Email;

                var result = await _userManager.CreateAsync(businessRenter, request.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                return Ok(new { Message = "Business account successfully created for company", CompanyId = businessRenter.CompanyId });

            }
            else if(request.AccountType == "vehicleManager")
            {
                VehicleManager vehicleManager = new VehicleManager();
                vehicleManager.CompanyId = companyAdmin.CompanyId;
                vehicleManager.Email = request.Email;
                vehicleManager.FirstName = request.FirstName;
                vehicleManager.LastName = request.LastName;
                vehicleManager.BirthDate = request.dateOfBirth;
                vehicleManager.UserName = request.Email;

                var result = await _userManager.CreateAsync(vehicleManager, request.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                return Ok(new { Message = "VehicleManager account successfully created for company", CompanyId = vehicleManager.CompanyId });

            }

            return BadRequest("Er is iets misgegaan");
        }
        [HttpPost("register-employee-account")]
        [Authorize]
        public async Task<IActionResult> RegisterEmployeeAccount([FromBody] CaRegisterDTO request) {
            if (User == null || !User.Identity.IsAuthenticated) {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound("Logged in user not found?! (this should never happen)");
            }
            var BackOfficeEmployee = await _context.CA_Employees.FirstOrDefaultAsync(ca => ca.Id == userID && ca.Department == "Backoffice");
            if (BackOfficeEmployee == null) {
                return Unauthorized(new { Msg = "You do not have permission to create a company account." });
            }

            CA_Employee newEmployee = new CA_Employee();
            newEmployee.Department = request.Department;
            newEmployee.Email = request.Email;
            newEmployee.UserName = request.Email;
            newEmployee.FirstName = request.FirstName;
            newEmployee.LastName = request.LastName;
            newEmployee.BirthDate = request.dateOfBirth;

            var result = await _userManager.CreateAsync(newEmployee, request.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }
            return Ok(new { Message = "Employee account made successfully", ForDepartment = newEmployee.Department });
        }
    }
}
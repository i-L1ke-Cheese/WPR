using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Data;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Project_WPR.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _dbContext;
        public AccountController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext)
        {
            _userManager = userManager;
            _signinManager = signinManager;
            _dbContext = dbContext;
        }

        /// <summary>
        /// Gets the current account.
        /// </summary>
        /// <returns></returns>
        [HttpGet("getCurrentAccount")]
        public async Task<IActionResult> getCurrentAccount()
        {
            if (User == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null)
            {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null)
            {
                return NotFound();
            }

            var businessRenter = await _dbContext.BusinessRenters.FirstOrDefaultAsync(br => br.Id == userID);
            if (businessRenter != null)
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == businessRenter.CompanyId);

                if (businessRenter.CompanyId == 0)
                {
                    return Ok(new
                    {
                        role = "BusinessRenter",
                        Email = businessRenter.Email,
                        FName = businessRenter.FirstName,
                        LName = businessRenter.LastName,
                        ID = businessRenter.Id,
                        PhoneNumber = businessRenter.PhoneNumber,
                        Address = businessRenter.Address,
                        Place = businessRenter.Place,
                        LicenseNumber = user.LicenseNumber
                    });
                }
                return Ok(new
                {
                    role = "BusinessRenter",
                    Email = businessRenter.Email,
                    FName = businessRenter.FirstName,
                    LName = businessRenter.LastName,
                    ID = businessRenter.Id,
                    CompanyId = businessRenter.CompanyId,
                    CompanyName = company.Name,

                    // Toegevoegd tijdens merge
                    PhoneNumber = businessRenter.PhoneNumber,
                    Address = businessRenter.Address,
                    Place = businessRenter.Place,
                    LicenseNumber = user.LicenseNumber
                });
            }
            var companyAdmin = await _dbContext.CompanyAdmin.FirstOrDefaultAsync(ca => ca.Id == userID);
            if (companyAdmin != null)
            {

                var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyAdmin.CompanyId);

                if (companyAdmin.CompanyId == 0)
                {
                    return Ok(new
                    {
                        Email = companyAdmin.Email,
                        FName = companyAdmin.FirstName,
                        LName = companyAdmin.LastName,
                        ID = companyAdmin.Id,
                        role = "CompanyAdmin",
                    });
                }
                return Ok(new
                {
                    Email = companyAdmin.Email,
                    FName = companyAdmin.FirstName,
                    LName = companyAdmin.LastName,
                    ID = companyAdmin.Id,
                    role = "CompanyAdmin",
                    CompanyId = companyAdmin.CompanyId,
                    CompanyName = company.Name
                });
            }
            var privateRenter = await _dbContext.PrivateRenters.FirstOrDefaultAsync(pr => pr.Id == userID);
            if (privateRenter != null)
            {
                return Ok(new
                {
                    Email = privateRenter.Email,
                    FName = privateRenter.FirstName,
                    LName = privateRenter.LastName,
                    ID = privateRenter.Id,
                    PhoneNumber = privateRenter.PhoneNumber,
                    Address = privateRenter.Address,
                    Place = privateRenter.Place,
                    LicenseNumber = privateRenter.LicenseNumber,
                    role = "PrivateRenter"
                });
            }
            var employee = await _dbContext.CA_Employees.FirstOrDefaultAsync(e => e.Id == userID);
            if (employee != null)
            {
                var role = "";
                if (employee.Department == "Frontoffice")
                {
                    role = "EmployeeFrontOffice";
                }
                else if (employee.Department == "Backoffice")
                {
                    role = "EmployeeBackOffice";
                }
                return Ok(new
                {
                    Email = employee.Email,
                    FName = employee.FirstName,
                    LName = employee.LastName,
                    ID = employee.Id,
                    PhoneNumber = employee.PhoneNumber,
                    Address = employee.Address,
                    Place = employee.Place,
                    LicenseNumber = employee.LicenseNumber,
                    role = role
                });
            }
            var vehicleManager = await _dbContext.vehicleManagers.FirstOrDefaultAsync(vm => vm.Id == userID);
            if (vehicleManager != null)
            {
                return Ok(new
                {
                    Email = vehicleManager.Email,
                    FName = vehicleManager.FirstName,
                    LName = vehicleManager.LastName,
                    ID = vehicleManager.Id,
                    PhoneNumber = vehicleManager.PhoneNumber,
                    Address = vehicleManager.Address,
                    Place = vehicleManager.Place,
                    LicenseNumber = vehicleManager.LicenseNumber,
                    role = "VehicleManager"
                });
            }

            return Ok(new
            {
                ID = user.Id,
                Email = user.Email,
                FName = user.FirstName,
                LName = user.LastName,
                PhoneNr = user.PhoneNumber,
                Address = user.Address,
                Place = user.Place,
                LicenseNumber = user.LicenseNumber,
                role = "Unknown"
            });
        }

        /// <summary>
        /// Updates the user.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDTO request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null)
            {
                return Unauthorized(new { Msg = "Geen gebruiker ingelogd" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.UserName = request.Email;
            user.PhoneNumber = request.Phone;
            user.Address = request.Address;
            user.Place = request.Place;
            user.LicenseNumber = request.LicenseNumber;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "Gegevens succesvol bijgewerkt" });
        }

        /// <summary>
        /// Gets the user.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <returns></returns>
        [HttpGet("getUser")]
        public async Task<IActionResult> getUser([FromQuery] string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null)
            {
                return NotFound(new { Msg = "User not found" });
            }

            return Ok(new
            {
                FName = user.FirstName,
                LName = user.LastName,
            });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;

namespace Project_WPR.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _dbContext;
        public AccountController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext) {
            _userManager = userManager;
            _signinManager = signinManager;
            _dbContext = dbContext;
        }

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
                        Email = user.Email,
                        FName = user.FirstName,
                        LName = user.LastName,
                        ID = user.Id,
                        PhoneNr = user.PhoneNumber,
                        Address = user.Address,
                        Place = user.Place,
                        LicenseNumber = user.LicenseNumber
                    });
                }
                return Ok(new
                {
                    Email = user.Email,
                    FName = user.FirstName,
                    LName = user.LastName,
                    ID = user.Id,
                    CompanyId = businessRenter.CompanyId,
                    CompanyName = company.Name,
					
					// Toegevoegd tijdens merge
					PhoneNr = user.PhoneNumber,
					Address = user.Address,
					Place = user.Place,
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
                        Email = user.Email,
                        FName = user.FirstName,
                        LName = user.LastName,
                        ID = user.Id,
                        role = "CompanyAdmin",
                    });
                }
                return Ok(new 
                {
                    Email = user.Email,
                    FName = user.FirstName,
                    LName = user.LastName,
                    ID = user.Id,
                    role = "CompanyAdmin",
                    CompanyId = companyAdmin.CompanyId,
                    CompanyName = company.Name
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
                LicenseNumber = user.LicenseNumber
            });
        }

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

        [HttpPost("changePhoneNr")]
        public async Task<IActionResult> changePhoneNr([FromBody] changePhoneNumberDTO request) {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            if(request.oldPhoneNumber == user.PhoneNumber) {
                user.PhoneNumber = request.newPhoneNumber;
                _dbContext.SaveChanges();
            }

            return Ok(new { Message = "Phone number changed.", PhoneNumber = request.newPhoneNumber });
        }
    }
}

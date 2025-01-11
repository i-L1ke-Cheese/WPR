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

namespace Project_WPR.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _context;

        public RegisterController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext context)
        {
            _userManager = userManager;
            _signinManager = signinManager;
            _context = context;
        }
        // zorgt ervoor dat er een account wordt aangemaakt
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request, string renter)
        {

            User user = null;

            if (renter.Equals("Private"))
            {
                user = new PrivateRenter
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth

                };
            }
            else if (renter.Equals("Business"))
            {
                user = new BusinessRenter
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth
                };
            }
            else if (renter.Equals("Admin"))
            {
                user = new CompanyAdmin
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.dateOfBirth,
                    CompanyId = 0
                
                };
            }

            if (user == null)
            {
                return BadRequest("User is empty");
            }

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "User registered successfully" });
        }
    }
}
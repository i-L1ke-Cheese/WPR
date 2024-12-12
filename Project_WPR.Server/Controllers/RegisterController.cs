using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;

namespace Project_WPR.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class RegisterController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        public RegisterController(UserManager<User> userManager, SignInManager<User> signinManager) {
            _userManager = userManager;
            _signinManager = signinManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request) {
            var user = new User {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                BirthDate = request.dateOfBirth
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "User registered successfully" });
        }
    }
}
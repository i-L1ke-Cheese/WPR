using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;

namespace Project_WPR.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        public AccountController(UserManager<User> userManager, SignInManager<User> signinManager) {
            _userManager = userManager;
            _signinManager = signinManager;
        }

        
        [HttpPost("getCurrentAccount")]
        public async Task<IActionResult> getCurrentAccount() {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userID == null) {
                return Unauthorized(new {Msg = "no user logged in"});
            }
            var user = await _userManager.FindByIdAsync(userID);
            if(user == null) {
                return NotFound();
            }
            return Ok(new {Email = user.Email, UUID = user.Id});
        }
    }
}

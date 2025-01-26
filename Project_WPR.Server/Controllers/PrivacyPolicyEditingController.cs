using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;

namespace Project_WPR.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class PrivacyPolicyEditingController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _dbContext;
        public PrivacyPolicyEditingController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext) {
            _userManager = userManager;
            _signinManager = signinManager;
            _dbContext = dbContext;
        }

        [Authorize]
        [HttpPut("UpdatePrivacyPolicy")]
        public async Task<IActionResult> UpdatePrivacyPolicy([FromBody] string contents) {
            if (User == null || !User.Identity.IsAuthenticated) {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var employee = await _dbContext.CA_Employees.FirstOrDefaultAsync(ca => ca.Department == "Backoffice");
            if (employee == null) {
                return Unauthorized("account is not backoffice?");
            }

            PrivacyPolicyContent newContent = new PrivacyPolicyContent();
            newContent.Content = contents;

            var oldContents = await _dbContext.PrivacyPolicyContent.SingleOrDefaultAsync();
            if (oldContents != null) {
                var objToRemove = _dbContext.PrivacyPolicyContent.SingleOrDefault(o => o.Id == oldContents.Id);
                _dbContext.PrivacyPolicyContent.Remove(objToRemove);
            }
            _dbContext.PrivacyPolicyContent.Add(newContent);
            await _dbContext.SaveChangesAsync();
            return Ok();

        }
        [HttpGet("get")]
        public async Task<IActionResult> GetPrivacyPolicy() {
            var contents = await _dbContext.PrivacyPolicyContent.SingleOrDefaultAsync();
            if(contents == null) {
                return Ok(new { text = "NO CONTENT FOUND" });
            }
            return Ok(new { text = contents.Content });
        }
    }
}
using Microsoft.AspNetCore.Mvc;


namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogoutController : ControllerBase
    {
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Response.Cookies.Delete("auth_cookie");

            return Ok(new { message = "Logout successful" });
        }
    }
}

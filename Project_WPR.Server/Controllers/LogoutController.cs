using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LogoutController : ControllerBase
    {
        /// <summary>
        /// Logouts this instance by deleting all cookies.
        /// </summary>
        /// <returns></returns>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            foreach (var cookie in HttpContext.Request.Cookies) {
                HttpContext.Response.Cookies.Delete(cookie.Key);
            }

            return Ok();
        }
    }
}

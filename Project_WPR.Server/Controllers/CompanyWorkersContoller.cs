using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data.DTOs;
using Project_WPR.Server.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Project_WPR.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompanyWorkersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _dbContext;
        public CompanyWorkersController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext) {
            _userManager = userManager;
            _signinManager = signinManager;
            _dbContext = dbContext;
        }

        // post moet nog komen en ik moet het allemaal veiliger maken
        [HttpGet("companyTest")]
        public async Task<IActionResult> Get1Company(int companyIDset)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            return Ok(new { userID =  user.Id });

            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyIDset);

            if (company == null)
            {
                return BadRequest("Company aint real fam");
            }

            var users = await _dbContext.BusinessRenters.Where(u => u.CompanyId == companyIDset).Select(u => new
            {
                u.Id,
                companyName = company.Name,
                u.FirstName,
                u.LastName,
                u.Email
                //u.MaxVehiclesPerBusinessRenter  // null moet toegestaan worden anders crasht het steeds
            }).ToListAsync();

            if (users == null || !users.Any())
            {
                return BadRequest("Company aint real fam");
            }

            return Ok(users);
        }

     
    }
}
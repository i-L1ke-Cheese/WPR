using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data.DTOs;
using Project_WPR.Server.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Project_WPR.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CompanyWorkersController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public CompanyWorkersController(DatabaseContext context)
        {
            _context = context;
        }
        // post moet nog komen en ik moet het allemaal veiliger maken
        [HttpGet("companyTest")]
        public async Task<IActionResult> Get1Company(int companyIDset)
        {
            
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyIDset);

            if (company == null)
            {
                return BadRequest("Company aint real fam");
            }

            var users = await _context.BusinessRenters.Where(u => u.CompanyId == companyIDset).Select(u => new
            {
                u.BusinessRenterId,
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
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
    public class CompanyWorkersController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        public CompanyWorkersController(DatabaseContext dbContext) {
            _dbContext = dbContext;
        }

        // post moet nog komen en ik moet het allemaal veiliger maken
        [HttpGet("GetCompanyWorkers")]
        public async Task<IActionResult> GetCompanyWorkers(int companyIDset)
        {
           

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
                u.Email,
                u.MaxVehiclesPerBusinessRenter
            }).ToListAsync();

            if (users == null || !users.Any())
            {
                return BadRequest("Company aint real fam");
            }

            return Ok(users);
        }

     
    }
}
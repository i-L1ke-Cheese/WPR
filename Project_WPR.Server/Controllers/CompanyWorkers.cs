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

        // Pakt alle medewerkers van een bedrijf
        [HttpGet("GetCompanyWorkers")]
        public async Task<IActionResult> GetCompanyWorkers(int companyIDset)
        {
            // controleert of het de juiste bedrijf is zodat je niet medewerkers van een ander bedrijf ziet
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyIDset);
            // Bedrijf bestaat niet error
            if (company == null)
            {
                return BadRequest("Bedrijf bestaat niet");
            }

            var users = await _dbContext.BusinessRenters.Where(u => u.CompanyId == companyIDset).Select(u => new
            {
                u.Id,
                companyName = company.Name,
                u.FirstName,
                u.LastName,
                u.Email,
               // u.MaxVehiclesPerBusinessRenter moet nog op null toegestaan gezet worden
            }).ToListAsync();
            // 
            if (users == null || !users.Any())
            {
                return BadRequest("Gebruiker bestaat niet");
            }

            return Ok(users);
        }


    }
}
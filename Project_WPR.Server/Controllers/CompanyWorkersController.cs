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
        private readonly ILogger<CompanyWorkersController> _logger;
        public CompanyWorkersController(DatabaseContext dbContext, ILogger<CompanyWorkersController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
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

            try
            {
                var businessRenters = await _dbContext.BusinessRenters.Where(u => u.CompanyId == companyIDset).Select(u => new
                {
                    u.Id,
                    companyName = company.Name,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    UserRole = "BusinessRenter",
                    u.MaxVehiclesPerBusinessRenter
                }).ToListAsync();
                var vehicleManagers = await _dbContext.vehicleManagers.Where(u => u.CompanyId == companyIDset).Select(u => new
                {
                    u.Id,
                    companyName = company.Name,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    UserRole = "VehicleManager"
                }).ToListAsync();

                return Ok(new { businessRenters, vehicleManagers });
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching companyworkers.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching companyworkers.");
            }
        }
    }
}
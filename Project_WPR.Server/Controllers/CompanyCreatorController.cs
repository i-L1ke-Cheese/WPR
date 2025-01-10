using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data.DTOs;
using Project_WPR.Server.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace Project_WPR.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyCreatorController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public CompanyCreatorController(DatabaseContext context)
        {
            _context = context;

        }

        [HttpPost("company")]
        public async Task<IActionResult> Company([FromBody] CompanyDTO request, string id)
        {
            
                var companyAdmin = await _context.CompanyAdmin
                    .FirstOrDefaultAsync(ca => ca.Id == id);

                if (companyAdmin == null)
                {
                    return BadRequest("No admin found");
                }

 
                if (id == null)
                {
                    return Unauthorized("User not authenticated");
                }

                var company = new Company
                {
                    Name = request.Name,
                    Adress = request.Adress,
                    KVK_number = request.KVK_number,
                    SubscriptionId = 2,
                    MaxVehiclesPerCompany = 0
                };

                var newCompany = await _context.Companies
                    .FirstOrDefaultAsync(c => c.Name == request.Name && c.KVK_number == request.KVK_number && c.Adress == request.Adress && c.SubscriptionId == 2 && c.MaxVehiclesPerCompany == 0);

                if (newCompany != null)
                {
                    return BadRequest("Er is iets mis gegaan bij het voegen van de company: company bestaat al");
                }

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                companyAdmin.CompanyId = company.Id;
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Company registered successfully" });
          
        }
    }
}

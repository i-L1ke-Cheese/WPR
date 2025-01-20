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

        // maakt een bedrijf aan na het inloggen bij een companyAdmin account
        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyDTO request, string id)
        {
            // controleert wie is ingelogt
            var companyAdmin = await _context.CompanyAdmin
                .FirstOrDefaultAsync(ca => ca.Id == id);
            // Gebruiker bestaat niet
            if (companyAdmin == null)
            {
                return BadRequest("No admin found");
            }
            // Gebruiker is geen companyAdmin
            if (id == null)
            {
                return Unauthorized("User not authenticated");
            }

            // Fetch the subscription details
            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(s => s.Id == 1);
            if (subscription == null)
            {
                return BadRequest("Invalid SubscriptionId");
            }

            // maakt het bedrijf aan
            var company = new Company
            {
                Name = request.Name,
                Adress = request.Adress,
                KVK_number = request.KVK_number,
                SubscriptionId = 1, // is wat iedereen krijgt
                MaxVehiclesPerCompany = subscription.MaxVehicle // Set the max vehicles per company based on the subscription
            };

            // controleert of een ander bedrijf niet al het zelfde heeft
            var newCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == request.Name || c.KVK_number == request.KVK_number || c.Adress == request.Adress);
            // Bedrijf bestaat al error
            if (newCompany != null)
            {
                return BadRequest("Er is iets mis gegaan bij het voegen van de company: company bestaat al");
            }

            // Slaat het bedrijf op
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            // Voegt companyAdmin toe aan het bedrijf
            companyAdmin.CompanyId = company.Id;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Company registered successfully" });
        }
    }
}

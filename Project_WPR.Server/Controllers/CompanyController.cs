using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data.DTOs;
using Project_WPR.Server.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Project_WPR.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public CompanyController(DatabaseContext context)
        {
            _context = context;
        }
    [HttpPost("company")]
        public async Task<IActionResult> Company([FromBody] CompanyDTO request)
        {
            var company = new Company
            {
               
                Name = request.Name,
                Adress = request.Adress,
                KVK_number = request.KVK_number,
                Subscription = request.Subscription
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            var newCompany = await _context.Companies
                   .FirstOrDefaultAsync(c => c.Name == request.Name && c.KVK_number == request.KVK_number && c.Adress == request.Adress);

            if (newCompany == null)
            {
                return BadRequest("Er is iets mis gegaan bij het voegen van de company");
            }

            return Ok(new { Message = "Company registered successfully" });
        }
    }
} // niet af
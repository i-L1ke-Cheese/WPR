using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;

namespace Project_WPR.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        public CompanyController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("getCurrentCompany")]
        public async Task<IActionResult> getCurrentCompany(int companyId)
        {
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound("Bedrijf is niet gevonden");
            }

            return Ok(company);
        }

        [HttpPut("update-company/{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] CompanyDTO companyDTO)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound(new { message = "Company not found" });
            }

            company.Name = companyDTO.Name;
            company.Adress = companyDTO.Adress;
            company.CompanyPhone = companyDTO.CompanyPhone;

            try
            {
                _dbContext.Entry(company).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
            return Ok(new { message = "Company updated successfully.", company});

        }
    }
}


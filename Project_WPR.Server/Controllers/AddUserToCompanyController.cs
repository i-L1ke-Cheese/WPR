using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.ComponentModel.Design;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddUserToCompanyController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AddUserToCompanyController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("GetCompanyFromUser")]
        public async Task<IActionResult> GetCompanyFromUser(string businessRenterId)
        {
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.BusinessRenterId == businessRenterId);

            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }

            if(businessRenter.CompanyId == null)
            {
                return NotFound("Heeft geen Bedrijf");
            }
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == businessRenter.CompanyId);
            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }

            return Ok(company.Name);
        }

        [HttpPost("SetCompanyFromUser")]
        public async Task<IActionResult> SetCompanyFromUser(string businessRenterId, int addCompany)
        {
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.BusinessRenterId == businessRenterId);

            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == addCompany);
            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }

            businessRenter.CompanyId = addCompany;
            await _context.SaveChangesAsync();


            return Ok(businessRenter.CompanyId);
        }
    }
}
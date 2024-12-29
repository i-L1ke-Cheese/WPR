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
    public class VehicleLimitController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public VehicleLimitController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("GetBusinessRenterVehicleLimit")]
        public async Task<IActionResult> GetCompanyVehicleLimit(string businessRenterId)
        {
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == businessRenterId);

            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }

            var businessRenterDTO = new BusinessRentersDTO
            {
                MaxVehiclesPerBusinessRenter = businessRenter.MaxVehiclesPerBusinessRenter
            };

            return Ok(businessRenterDTO);
        }

        [HttpPost("SetBusinessRenterVehicleLimit")]
        public async Task<IActionResult> SetBusinessVehicleLimit([FromBody] VehicleLimitDTO vehicleLimitDTO)
        {
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == vehicleLimitDTO.BusinessRenterId);

            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }

            businessRenter.MaxVehiclesPerBusinessRenter = vehicleLimitDTO.MaxVehiclesPerBusinessRenter;
            await _context.SaveChangesAsync();

            var businessRenterDTO = new BusinessRentersDTO
            {
                MaxVehiclesPerBusinessRenter = businessRenter.MaxVehiclesPerBusinessRenter
            };

            return Ok(businessRenterDTO);
        }
        [HttpPost("SetCompanyRenterVehicleLimit")]
        public async Task<IActionResult> SetCompanyRenterVehicleLimit(int companyId)
        {

            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }
            if (company.Id != companyId)
            {
                return NotFound("Verkeerde bedrijf");
            }

            company.MaxVehiclesPerCompany = 10;
            await _context.SaveChangesAsync();

            return Ok(company.MaxVehiclesPerCompany);
        }

    }
}

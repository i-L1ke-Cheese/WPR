using Microsoft.AspNetCore.Authorization;
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
        // De API die er voorzorgt dat er uit de database wordt gehaald hoevaak een huurder mag gaan huren
        [HttpGet("GetBusinessRenterVehicleLimit")]
        public async Task<IActionResult> GetCompanyVehicleLimit(string businessRenterId)
        {
            // Hier controleren we of de huurder een bedrijfs huurder is.
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

            return Ok(businessRenterDTO.MaxVehiclesPerBusinessRenter);
        }


        // De API die er voorzorgt dat je een huurder een limiet kunt geven van hoevaak ze mogen huren
        [HttpPost("SetBusinessRenterVehicleLimit")]
        public async Task<IActionResult> SetBusinessVehicleLimit([FromBody] VehicleLimitDTO vehicleLimitDTO)
        {
            // Hier controleren we of de huurder een bedrijfs huurder is.
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == vehicleLimitDTO.BusinessRenterId);

            // Hier controleren of de huurder wel bij de correcte bedrijf hoort
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == businessRenter.CompanyId);


            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }

            // Hier wordt de totale aantal autos dat alle bedrijfshuurders mogen huren
            var totalVehiclesRented = await _context.BusinessRenters
            .Where(br => br.CompanyId == company.Id)
            .SumAsync(br => br.MaxVehiclesPerBusinessRenter);

            //var a = totalVehiclesRented + vehicleLimitDTO.MaxVehiclesPerBusinessRenter;
            if (totalVehiclesRented <= company.MaxVehiclesPerCompany && businessRenter.MaxVehiclesPerBusinessRenter >= 0)
            {
                businessRenter.MaxVehiclesPerBusinessRenter = vehicleLimitDTO.MaxVehiclesPerBusinessRenter;
                await _context.SaveChangesAsync();
            }



            // hier controleert het of de maximale dat de bedrijf mag gaan huren niet wordt overschreden door hoevaak alle huurders van dat bedrijf niet wordt overschreden
            if (totalVehiclesRented > company.MaxVehiclesPerCompany)
            {
                return NotFound("Limiet voor bedrijf is bereikt" + (company.MaxVehiclesPerCompany - totalVehiclesRented));
            }



            return Ok(businessRenter.MaxVehiclesPerBusinessRenter);



        }

        // De API die ervoorzorgt hoeveel een bedrijf mag gaan huren 
        [HttpPost("SetCompanyRenterVehicleLimit")]
        public async Task<IActionResult> SetCompanyRenterVehicleLimit(int companyId)
        {
            // controleer of het de juiste bedrijf is
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }
            if (company.Id != companyId)
            {
                return NotFound("Verkeerde bedrijf");
            }

            // voor nu een placeholder maar een company krijgt minimaal 10 dit wordt nog gekoppeld aan subscriptions
            company.MaxVehiclesPerCompany = 10;
            await _context.SaveChangesAsync();

            return Ok(company.MaxVehiclesPerCompany);
        }

        // De API die ervoorzorgt om te kijken hoeveel een bedrijf mag gaan huren
        [HttpGet("GetCompanyRenterVehicleLimit")]
        public async Task<IActionResult> GetCompanyRenterVehicleLimit(int companyId)
        {
            // controleer of het de juiste bedrijf is
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);

            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }
            if (company.Id != companyId)
            {
                return NotFound("Verkeerde bedrijf");
            }

            return Ok(company.MaxVehiclesPerCompany);
        }

    }

}

﻿using Microsoft.AspNetCore.Authorization;
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

        /// <summary>
        /// Initializes a new instance of the <see cref="VehicleLimitController"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public VehicleLimitController(DatabaseContext context)
        {
            _context = context;
        }

        // De API die er voorzorgt dat er uit de database wordt gehaald hoevaak een huurder mag gaan huren        
        /// <summary>
        /// Gets the company vehicle limit.
        /// </summary>
        /// <param name="businessRenterId">The business renter identifier.</param>
        /// <returns></returns>
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
        /// <summary>
        /// Sets the business vehicle limit.
        /// </summary>
        /// <param name="vehicleLimitDTO">The vehicle limit dto.</param>
        /// <returns></returns>
        [HttpPost("SetBusinessRenterVehicleLimit")]
        public async Task<IActionResult> SetBusinessVehicleLimit([FromBody] VehicleLimitDTO vehicleLimitDTO)
        {
            // Hier controleren we of de huurder een bedrijfs huurder is.
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == vehicleLimitDTO.BusinessRenterId);

            if (businessRenter == null)
            {
                return NotFound("Huurder niet gevonden");
            }

            // Hier controleren of de huurder wel bij de correcte bedrijf hoort
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == businessRenter.CompanyId);

            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }

            // Hier wordt de totale aantal autos dat alle bedrijfshuurders mogen huren
            var totalVehiclesRented = await _context.BusinessRenters
                .Where(br => br.CompanyId == company.Id)
                .SumAsync(br => br.MaxVehiclesPerBusinessRenter);

            // Bereken de nieuwe totale limiet als we de nieuwe limiet voor deze huurder toepassen
            var newTotalVehiclesRented = totalVehiclesRented - businessRenter.MaxVehiclesPerBusinessRenter + vehicleLimitDTO.MaxVehiclesPerBusinessRenter;

            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(sub => sub.Id == company.SubscriptionId);
            if(subscription == null) {
                return NotFound("Company subscription not found; contact your company admin.");
            }

            // Controleer of de nieuwe totale limiet binnen de bedrijfsgrens valt
            if (newTotalVehiclesRented > company.MaxVehiclesPerCompany || newTotalVehiclesRented > subscription.MaxVehicle || vehicleLimitDTO.MaxVehiclesPerBusinessRenter < 0)
            {
                return BadRequest("Limiet voor bedrijf is bereikt of ongeldige limiet voor huurder");
            }

            // Update de limiet voor de huurder
            businessRenter.MaxVehiclesPerBusinessRenter = vehicleLimitDTO.MaxVehiclesPerBusinessRenter;
            await _context.SaveChangesAsync();

            return Ok(businessRenter.MaxVehiclesPerBusinessRenter);
        }

        // De API die ervoorzorgt hoeveel een bedrijf mag gaan huren         
        /// <summary>
        /// Sets the company renter vehicle limit.
        /// </summary>
        /// <param name="companyId">The company identifier.</param>
        /// <returns></returns>
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
        /// <summary>
        /// Gets the company renter vehicle limit.
        /// </summary>
        /// <param name="companyId">The company identifier.</param>
        /// <returns></returns>
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

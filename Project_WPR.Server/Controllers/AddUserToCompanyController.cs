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
    public class AddUserToCompanyController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AddUserToCompanyController(DatabaseContext context)
        {
            _context = context;
        }

        // Verwijder medewerker van een bedrijf        
        /// <summary>
        /// Deletes the user from company.
        /// </summary>
        /// <param name="dto">The dto.</param>
        /// <returns></returns>
        [HttpDelete("DeleteUserFromCompany")]
        public async Task<IActionResult> DeleteUserFromCompany([FromBody] AddUserToCompanyDTO dto)
        {
            // controleert of het de juiste medewerker is
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == dto.BusinessRenterId);
            var vehicleManager = await _context.vehicleManagers.
                FirstOrDefaultAsync(vm => vm.Id == dto.BusinessRenterId);

            if (businessRenter == null && vehicleManager == null)
            {
                return NotFound("Werknemer niet gevonden");
            }

            if (businessRenter != null)
            {
                if (businessRenter.CompanyId != dto.Id)
                {
                    return BadRequest("Werknemer niet in dit bedrijf");
                }
                // verwijdert gebruiker van bedrijf
                businessRenter.MaxVehiclesPerBusinessRenter = 0;
                businessRenter.CompanyId = 0;
            }

            if (vehicleManager != null)
            {
                if (vehicleManager.CompanyId != dto.Id)
                {
                    return BadRequest("Werknemer niet in dit bedrijf");
                }
                // verwijdert gebruiker van bedrijf
                vehicleManager.CompanyId = 0;
            }

            // controleert of het de juiste bedrijf is
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Werknemer verwijderd" });
        }

        // Voeg medewerker toe aan bedrijf        
        /// <summary>
        /// Sets the user to company.
        /// </summary>
        /// <param name="dto">The dto.</param>
        /// <returns></returns>
        [HttpPost("SetUserToCompany")]
        public async Task<IActionResult> SetUserToCompany([FromBody] AddUserToCompanyDTO dto)
        {

            // controleert of het de juiste medewerker is
            var businessRenter = await _context.BusinessRenters
                .FirstOrDefaultAsync(br => br.Id == dto.BusinessRenterId);



            if (businessRenter == null)
            {
                return NotFound("Werknemer niet gevonden");
            }
            // controleert of het de juiste bedrijf is
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (company == null)
            {
                return NotFound("Bedrijf niet gevonden");
            }

            if(businessRenter.CompanyId != dto.Id)
            {
                BadRequest("Gebruiker werkt voor een ander bedrijf");
            }
            // voegt medewerker toe
            businessRenter.MaxVehiclesPerBusinessRenter = 1;
            businessRenter.CompanyId = dto.Id;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Werknemer toegevoegd" });
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalRequestController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public RentalRequestController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("beschikbare-voertuigen")]
        public IActionResult GetAvailableCars([FromQuery] DateTime? date)
        {
            // Haal alle beschikbare voertuigen op van Cars, Campers en Caravans
            var availableCars = _context.Cars
                .Where(car => car.IsAvailable)
                .Select(car => new { car.Id, car.Brand, car.Type });

            var availableCampers = _context.Campers
                .Where(camper => camper.IsAvailable)
                .Select(camper => new { camper.Id, camper.Brand, camper.Type });

            var availableCaravans = _context.Caravans
                .Where(caravan => caravan.IsAvailable)
                .Select(caravan => new { caravan.Id, caravan.Brand, caravan.Type });

            // Combineer de resultaten van Cars, Campers en Caravans
            var allAvailableVehicles = availableCars
                .Union(availableCampers)
                .Union(availableCaravans);

            return Ok(allAvailableVehicles);
        }

        [HttpPost("huur-auto")]
        public async Task<IActionResult> Rental([FromBody] RentalRequestDTO request)
        {
            var privateRenter = await _context.PrivateRenters.FirstOrDefaultAsync(u => u.Id == request.UserId);
            var businessRenter = await _context.BusinessRenters.FirstOrDefaultAsync(u => u.Id == request.UserId);

            if (privateRenter == null && businessRenter == null)
            {
                return Unauthorized(new { message = "Gebruiker bestaat niet." });
            }

            if (privateRenter != null)
            {
                var vehicle = await _context.Cars
        .Where(c => c.Id == request.VehicleId)
        .Cast<Vehicle>()
        .FirstOrDefaultAsync()
        ?? await _context.Campers
        .Where(c => c.Id == request.VehicleId)
        .Cast<Vehicle>()
        .FirstOrDefaultAsync()
        ?? await _context.Caravans
        .Where(c => c.Id == request.VehicleId)
        .Cast<Vehicle>()
        .FirstOrDefaultAsync();

                if (vehicle == null)
                {
                    return BadRequest(new { message = $"Voertuig is niet beschikbaar." });
                }

                vehicle.IsAvailable = false; // Update the availability status
                await _context.SaveChangesAsync();

                return Ok(new { message = $"{vehicle.Brand} {vehicle.Type} is verhuurd." });
            }

            if (businessRenter != null)
            {
                var car = _context.Cars.FirstOrDefault(c => c.Id == request.VehicleId && c.IsAvailable);

                if (car == null)
                {
                    return BadRequest(new { message = "Auto is niet beschikbaar" });
                }

                car.IsAvailable = false; // Update the availability status
                await _context.SaveChangesAsync();

                return Ok(new { message = $"{car.Brand} {car.Type} is verhuurd." });
            }

            return Ok(new { message = $"User logged in" });
        }
    }
}
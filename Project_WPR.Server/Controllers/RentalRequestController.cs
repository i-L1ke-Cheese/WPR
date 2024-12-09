using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("beschikbare-autos")]
        public IActionResult GetAvailableCars([FromQuery] DateTime? rentalDate)
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
                .Union(availableCaravans)
                .ToList();

            return Ok(allAvailableVehicles);
        }

        [HttpPost("huur-auto")]
        public IActionResult RentCar([FromBody] RentRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == request.UserId);

            if (user == null)
            {
                return Unauthorized(new { message = "Gebruiker bestaat niet." });
            }

            if (user is PrivateRenter privateRenter)
            {
                var vehicle = _context.Cars
                    .Where(c => c.Id == request.VehicleId && c.IsAvailable)
                    .FirstOrDefault()
                ?? (object)_context.Campers
                    .Where(c => c.Id == request.VehicleId && c.IsAvailable)
                    .FirstOrDefault()
                ?? _context.Caravans
                    .Where(c => c.Id == request.VehicleId && c.IsAvailable)
                    .FirstOrDefault();

                if (vehicle == null)
                {
                    return BadRequest(new { message = $"Voertuig is niet beschikbaar." });
                }

                vehicle.isAvailable = false; // Moet nog in database komen te staan zorgt ervoor wanneer een auto wordt verhuurd dat die niet beschikbaar komt te staan/
                _context.SaveChanges();

                return Ok(new { message = $"{vehicle.Brand} {vehicle.Type} is verhuurd." });

            }

            if (user is BusinessRenter businessRenter)
            {
                var car = _context.Cars.FirstOrDefault(c => c.Id == request.VehicleId && c.IsAvailable);

                if (car == null)
                {
                    return BadRequest(new { message = "Auto is niet beschikbaar" }); 
                }

                car.isAvailable = false; // Moet nog in database komen te staan zorgt ervoor wanneer een auto wordt verhuurd dat die niet beschikbaar komt te staan/
                _context.SaveChanges();

                return Ok(new { message = $"{car.Brand} {car.Type} is verhuurd." });

            }
        }
    }
}
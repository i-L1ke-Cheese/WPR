using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data.DTOs;
using Project_WPR.Server.data;


namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailableVehicleController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AvailableVehicleController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("beschikbare-voertuigen")]
        public IActionResult GetAvailableCars([FromQuery] DateTime? date)
        {
            // Haal alle beschikbare voertuigen op van Cars, Campers en Caravans
            var availableCars = _context.Cars
                .Where(car => car.IsAvailable)
                .Select(car => new { car.Id, car.Brand, car.Type, car.LicensePlate, car.Color, car.VehicleType });

            var availableCampers = _context.Campers
                .Where(camper => camper.IsAvailable)
                .Select(camper => new { camper.Id, camper.Brand, camper.Type, camper.LicensePlate, camper.Color, camper.VehicleType });

            var availableCaravans = _context.Caravans
                .Where(caravan => caravan.IsAvailable)
                .Select(caravan => new { caravan.Id, caravan.Brand, caravan.Type, caravan.LicensePlate, caravan.Color, caravan.VehicleType });

            // Combineer de resultaten van Cars, Campers en Caravans
            var allAvailableVehicles = availableCars
                .Union(availableCampers)
                .Union(availableCaravans);

            return Ok(allAvailableVehicles);
        }
    }
}
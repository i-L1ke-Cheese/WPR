using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase

    {
        private readonly data.DatabaseContext _context;
        private readonly ILogger<VehicleController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="VehicleController"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public VehicleController(data.DatabaseContext context, ILogger<VehicleController> logger)
        {
            _context = context;
            _logger = logger;
        }


        /// <summary>
        /// Gets all vehicles.
        /// </summary>
        /// <returns></returns>
        [HttpGet("alle-voertuigen")]
        public async Task<IActionResult> GetVehicles(int i)
        {
            var businessRenter = await _context.BusinessRenters.FirstOrDefaultAsync(x => x.BusinessRenterId == i);

            try
            {
                var cars = _context.Cars.ToList();
                var campers = _context.Campers.ToList();
                var caravans = _context.Caravans.ToList();

                if (businessRenter != null)
                {
                    return Ok(cars);
                }

                return Ok(new { cars, campers, caravans });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching vehicles.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching vehicles.");
            }
        }

        /// <summary>
        /// Gets a vehicle.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<data.Vehicle>> GetVehicle(int id)
        {
            if (_context == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Database context is not initialized.");
            }

            try
            {
                var auto = await _context.Cars.FindAsync(id);
                var camper = await _context.Campers.FindAsync(id);
                var caravan = await _context.Caravans.FindAsync(id);

                if (auto != null)
                {
                    return Ok(auto);
                }

                if (camper != null)
                {
                    return Ok(camper);
                }

                if (caravan != null)
                {
                    return Ok(caravan);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching the vehicle.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching the vehicle.");
            }
        }

        [HttpPost("voeg-voertuig-toe")]
        public async Task<ActionResult<data.Vehicle>> AddVehicle([FromBody] data.Vehicle vehicle)
        {
            if (vehicle == null)
            {
                return BadRequest("Vehicle is leeg.");
            }

            try
            {
                if (vehicle is data.Car car)
                {
                    _context.Cars.Add(car);
                }
                else if (vehicle is data.Camper camper)
                {
                    _context.Campers.Add(camper);
                }
                else if (vehicle is data.Caravan caravan)
                {
                    _context.Caravans.Add(caravan);
                }
                else
                {
                    return BadRequest("Ongeldig voertuigtype.");
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding the vehicle.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the vehicle.");
            }
        }

        [HttpPut("update-voertuig/{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] data.Vehicle vehicle)
        {
            _logger.LogInformation($"Recieved request to update vehicle with ID: {id}");

            if (vehicle == null || vehicle.Id != id)
            {
                _logger.LogWarning($"Invalid vehicle of ID. Vehicle ID: {vehicle?.Id}, URL ID: {id}");
                return BadRequest("Ongeldig voertuig of ID.");
            }

            var existingVehicle = await _context.Cars.FindAsync(id) as data.Vehicle
                                ?? await _context.Campers.FindAsync(id) as data.Vehicle
                                ?? await _context.Caravans.FindAsync(id) as data.Vehicle;

            if (existingVehicle == null)
            {
                _logger.LogWarning($"Vehicle with ID: {id} not found.");
                return NotFound("Voertuig niet gevonden.");
            }

            try
            {
                // Update properties
                existingVehicle.Brand = vehicle.Brand;
                existingVehicle.Type = vehicle.Type;
                existingVehicle.Color = vehicle.Color;
                existingVehicle.YearOfPurchase = vehicle.YearOfPurchase;
                existingVehicle.LicensePlate = vehicle.LicensePlate;
                existingVehicle.Description = vehicle.Description;
                existingVehicle.IsAvailable = vehicle.IsAvailable;
                existingVehicle.IsDamaged = vehicle.IsDamaged;
                existingVehicle.RentalPrice = vehicle.RentalPrice;

                if (existingVehicle is data.Car existingCar && vehicle is data.Car updatedCar)
                {
                    existingCar.TransmissionType = updatedCar.TransmissionType;
                }
                else if (existingVehicle is data.Camper existingCamper && vehicle is data.Camper updatedCamper)
                {
                    existingCamper.TransmissionType = updatedCamper.TransmissionType;
                    existingCamper.RequiredLicenseType = updatedCamper.RequiredLicenseType;
                }

                _context.Entry(existingVehicle).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully updated vehicle with ID: {id}");
                return Ok(existingVehicle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating the vehicle with ID: {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the vehicle.");
            }
        }
    }
}    


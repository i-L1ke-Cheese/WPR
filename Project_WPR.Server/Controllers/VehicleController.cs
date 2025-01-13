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
        private readonly data.IDatabaseContext _context;
        private readonly ILogger<VehicleController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="VehicleController"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public VehicleController(data.IDatabaseContext context, ILogger<VehicleController> logger)
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

            try
            {
                var cars = _context.Cars.ToList();
                var campers = _context.Campers.ToList();
                var caravans = _context.Caravans.ToList();

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
        public async Task<ActionResult<data.Vehicle>> AddVehicle([FromBody] data.DTOs.VehicleDTO vehicleDto)
        {
            if (vehicleDto == null)
            {
                return BadRequest("Vehicle is leeg.");
            }

            try
            {
                data.Vehicle vehicle;

                //_logger.LogInformation("Vehicle type: {VehicleType}", vehicle.VehicleType);
                //_logger.LogInformation("Vehicle object type: {ObjectType}", vehicle.GetType().Name);


                switch (vehicleDto.VehicleType?.ToLower())
                {
                    case "car":
                        vehicle = new data.Car
                        {
                            Brand = vehicleDto.Brand,
                            Type = vehicleDto.Type,
                            Color = vehicleDto.Color,
                            YearOfPurchase = vehicleDto.YearOfPurchase,
                            LicensePlate = vehicleDto.LicensePlate,
                            Description = vehicleDto.Description,
                            IsAvailable = vehicleDto.IsAvailable,
                            IsDamaged = vehicleDto.IsDamaged,
                            RentalPrice = vehicleDto.RentalPrice,
                            VehicleType = vehicleDto.VehicleType,
                            TransmissionType = vehicleDto.TransmissionType
                        };
                        _context.Cars.Add(vehicle as data.Car);
                        break;
                    case "camper":
                        vehicle = new data.Camper
                        {
                            Brand = vehicleDto.Brand,
                            Type = vehicleDto.Type,
                            Color = vehicleDto.Color,
                            YearOfPurchase = vehicleDto.YearOfPurchase,
                            LicensePlate = vehicleDto.LicensePlate,
                            Description = vehicleDto.Description,
                            IsAvailable = vehicleDto.IsAvailable,
                            IsDamaged = vehicleDto.IsDamaged,
                            RentalPrice = vehicleDto.RentalPrice,
                            VehicleType = vehicleDto.VehicleType,
                            TransmissionType = vehicleDto.TransmissionType,
                            RequiredLicenseType = vehicleDto.RequiredLicenseType
                        };
                        _context.Campers.Add(vehicle as data.Camper);
                        break;
                    case "caravan":
                        vehicle = new data.Caravan
                        {
                            Brand = vehicleDto.Brand,
                            Type = vehicleDto.Type,
                            Color = vehicleDto.Color,
                            YearOfPurchase = vehicleDto.YearOfPurchase,
                            LicensePlate = vehicleDto.LicensePlate,
                            Description = vehicleDto.Description,
                            IsAvailable = vehicleDto.IsAvailable,
                            IsDamaged = vehicleDto.IsDamaged,
                            RentalPrice = vehicleDto.RentalPrice,
                            VehicleType = vehicleDto.VehicleType
                        };
                        _context.Caravans.Add(vehicle as data.Caravan);
                        break;
                    default:
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

        [HttpDelete("verwijder-voertuig/{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Cars.FindAsync(id) as data.Vehicle
                        ?? await _context.Campers.FindAsync(id) as data.Vehicle
                        ?? await _context.Caravans.FindAsync(id) as data.Vehicle;

            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden");
            }

            try
            {
                // Verwijder gerelateerde RentalRequests
                var rentalRequests = _context.RentalRequests.Where(rr => rr.VehicleId == id);
                _context.RentalRequests.RemoveRange(rentalRequests);

                // Verwijder gerelateerde DamageReports
                var damageReports = _context.DamageReports.Where(dr => dr.VehicleId == id);
                _context.DamageReports.RemoveRange(damageReports);

                // Verwijder gerelateerde VehiclePictures
                var vehiclePictures = _context.VehiclePictures.Where(vp => vp.VehicleId == id);
                _context.VehiclePictures.RemoveRange(vehiclePictures);

                if (vehicle is data.Car)
                {
                    _context.Cars.Remove(vehicle as data.Car);
                }
                else if (vehicle is data.Camper)
                {
                    _context.Campers.Remove(vehicle as data.Camper);
                }
                else if (vehicle is data.Caravan)
                {
                    _context.Caravans.Remove(vehicle as data.Caravan);
                }
                else
                {
                    return BadRequest("Ongeldig voertuigtype.");
                }

                await _context.SaveChangesAsync();

                return Ok("Voertuig succesvol verwijderd");
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, $"Database update error when deleting the vehicle with ID: {id}");
                var innerExceptionMessage = dbEx.InnerException?.Message ?? "No inner exception";
                return StatusCode(StatusCodes.Status500InternalServerError, $"Database update error occurred while deleting the vehicle: {dbEx.Message}. Inner exception: {innerExceptionMessage}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred when deleting the vehicle with ID: {id}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the vehicle: {ex.Message}");
            }
        }
    }
}


using Microsoft.AspNetCore.Mvc;
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
        private readonly ILogger<VehicleController> _logger; //

        /// <summary>
        /// Initializes a new instance of the <see cref="VehicleController"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public VehicleController(data.IDatabaseContext context, ILogger<VehicleController> logger)
        {
            _context = context;
            _logger = logger; //
        }


        /// <summary>
        /// Gets all vehicles.
        /// </summary>
        /// <returns></returns>
        [HttpGet("alle-voertuigen")]
        public ActionResult<IEnumerable<data.Vehicle>> GetVehicles()
        {
            try
            {
                var cars = _context.Cars.ToList();
                var campers = _context.Campers.ToList();
                var caravans = _context.Caravans.ToList();

                var vehicles = cars.Cast<data.Vehicle>()
                    .Union(campers)
                    .Union(caravans);

                return Ok(vehicles);
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
    }
}

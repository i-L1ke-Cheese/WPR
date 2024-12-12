using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using System.Collections.Generic;
using System.Linq;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly data.DatabaseContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="VehicleController"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public VehicleController(data.DatabaseContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Gets the vehicles.
        /// </summary>
        /// <returns></returns>
        [HttpGet("alle-voertuigen")]
        public ActionResult<IEnumerable<data.Vehicle>> GetVehicles()
        {
            var cars = _context.Cars.ToList();
            var campers = _context.Campers.ToList();
            var caravans = _context.Caravans.ToList();

            var vehicles = cars.Cast<data.Vehicle>()
                .Union(campers)
                .Union(caravans);

            return Ok(vehicles);
        }

        /// <summary>
        /// Gets the vehicle.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<data.Vehicle>> GetVehicle(int id)
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

            if (caravan != null) {
                return Ok(caravan);
            }
            
            else {
                return NotFound();
            }
       

        }
    }
}

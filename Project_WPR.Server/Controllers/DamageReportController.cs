using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DamageReportController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;


        public DamageReportController(DatabaseContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("maak-schademelding")]
        [Authorize]
        public async Task<IActionResult> CreateDamageReport([FromBody] DamageReportDTO damageReportDTO)
        {
            // get currently logged in user from cookie
            if (User == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { Msg = "no user logged in 1" });
            }

            var employeeID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employeeID == null)
            {
                return Unauthorized(new { Msg = "No user logged in 2" });
            }

            var damageReport = new DamageReport
            {
                VehicleId = damageReportDTO.VehicleId,
                Date = damageReportDTO.Date,
                Description = damageReportDTO.Description,
                EmployeeId = employeeID,
                Status = damageReportDTO.Status
            };

            try
            {
                _context.DamageReports.Add(damageReport);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }

            return Ok(new { message = "Damage report created successfully.", damageReport });
        }

        [HttpGet("alle-voertuigen")]
        public async Task<IActionResult> GetAllDamageReports()
        {
            var damageReports = await _context.DamageReports.ToListAsync();

            if (damageReports == null || damageReports.Count == 0)
            {
                return NotFound(new { message = "No damage reports found" });
            }

            return Ok(damageReports);
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<IActionResult> GetDamageReports(int vehicleId)
        {
            var damageReports = await _context.DamageReports
                .Where(dr => dr.VehicleId == vehicleId)
                .ToListAsync();

            if (damageReports == null || damageReports.Count == 0)
            {
                return NotFound(new { message = "No damage reports found for the given vehicleId." });
            }

            return Ok(damageReports);
        }

        [HttpPut("update-schademelding/{id}")]
        public async Task<IActionResult> UpdateDamageReport(int id, [FromBody] DamageReportDTO damageReportDTO)
        {
            var damageReport = await _context.DamageReports.FindAsync(id);
            if (damageReport == null)
            {
                return NotFound(new { message = "Damage report not found" });
            }

            damageReport.Description = damageReportDTO.Description;
            damageReport.Status = damageReportDTO.Status;

            try
            {
                _context.Entry(damageReport).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }

            return Ok(new { message = "Damage report updated successfully.", damageReport });
        }

        [HttpDelete("delete-schademelding/{id}")]
        public async Task<IActionResult> DeleteDamageReport(int id)
        {
            var report = await _context.DamageReports.FindAsync(id);

            if (report == null)
            {
                return NotFound("Schademelding niet gevonden");
            }

            try
            {
                _context.DamageReports.Remove(report);
                await _context.SaveChangesAsync();
                return Ok("Schademelding succesvol verwijderd");
            } catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the vehicle: {ex.Message}");
            }
        }
    }
}
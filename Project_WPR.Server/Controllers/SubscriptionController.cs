using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SubscriptionController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("GetSubscriptionDetails")]
        public async Task<IActionResult> GetSubscriptionDetails()
        {
            var subscriptions = await _context.Subscriptions.ToListAsync();

            if (subscriptions == null || !subscriptions.Any())
            {
                return NotFound("No subscriptions found in the database");
            }

            return Ok(subscriptions);
        }

        [HttpPost("PostSubscriptionDetails")]
        public async Task<IActionResult> PostSubscriptionDetails([FromBody] SubscriptionDTO request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == request.CompanyId);

            if (company == null)
            {
                return NotFound("Geen bedrijf gevonden");
            }

            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(s => s.Id == request.SubscriptionId);

            if (subscription == null)
            {
                return NotFound("No subscription found with the given ID");
            }

            company.SubscriptionId = request.SubscriptionId;
            company.MaxVehiclesPerCompany = subscription.MaxVehicle;
            await _context.SaveChangesAsync();

            return Ok(await _context.Subscriptions.ToListAsync());
        }
    }
}
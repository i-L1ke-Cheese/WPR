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

            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var daysInMonth = DateTime.DaysInMonth(currentYear, currentMonth);

            foreach (var subscription in subscriptions)
            {
                subscription.Duration = $"{daysInMonth} Dagen";
            }

            return Ok(subscriptions);
        }

        [HttpGet("GetActiveSubscriptions")]
        public async Task<IActionResult> GetActiveSubscriptions()
        {
            var today = DateTime.Today;
            var activeSubscriptions = await _context.Companies
                .Where(c => c.SubscriptionStartDate <= today && c.SubscriptionEndDate >= today)
                .Select(c => c.Subscription)
                .ToListAsync();

            return Ok(activeSubscriptions);
        }

        [HttpPost("PostSubscriptionDetails")]
        public async Task<IActionResult> PostSubscriptionDetails([FromBody] SubscriptionDTO request)
        {
            var company = await _context.Companies.FindAsync(request.CompanyId);
            if (company == null)
            {
                return NotFound(new { message = "Bedrijf bestaat niet" });
            }

            var subscription = await _context.Subscriptions.FindAsync(request.SubscriptionId);
            if (subscription == null)
            {
                return NotFound(new { message = "Subscription bestaat niet" });
            }

            var nextMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1);
            var endOfNextMonth = nextMonth.AddMonths(1).AddDays(-1);

            company.SubscriptionId = request.SubscriptionId;
            company.MaxVehiclesPerCompany = subscription.MaxVehicle;
            company.SubscriptionStartDate = nextMonth;
            company.SubscriptionEndDate = endOfNextMonth;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscriptie geweizigd" });
        }

        [HttpPost("CheckAndRevertSubscriptions")]
        public async Task<IActionResult> CheckAndRevertSubscriptions()
        {
            var today = DateTime.Today;
            var companies = await _context.Companies
                .Where(c => c.SubscriptionEndDate < today)
                .ToListAsync();

            foreach (var company in companies)
            {
                company.SubscriptionId = 1; 
                company.SubscriptionStartDate = today;
                company.SubscriptionEndDate = today.AddMonths(1).AddDays(-1);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Gratis plan weer actief" });
        }
    }
}
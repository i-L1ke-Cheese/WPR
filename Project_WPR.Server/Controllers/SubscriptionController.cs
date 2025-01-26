using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        // Haal alle abonnement gegevens op
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
                subscription.Duration = daysInMonth;
            }

            return Ok(subscriptions);
        }

        // krijg de actieve abonnement
        [HttpGet("GetActiveSubscriptions")]
        public async Task<IActionResult> GetActiveSubscriptions()
        {
            // Datum van vandaag
            var today = DateTime.Today;

            // Controleert of de bedrijf een actieve abonnement heeft
            var activeSubscriptions = await _context.Companies
                .Where(c => c.SubscriptionStartDate <= today && c.SubscriptionEndDate >= today)
                .Select(c => c.Subscription)
                .ToListAsync();

            return Ok(activeSubscriptions);
        }


        // Zorgt ervoor dat de bedrijf abonnement die hij/zij heeft gekozen ook krijgt
        [HttpPost("PostSubscriptionDetails")]
        public async Task<IActionResult> PostSubscriptionDetails([FromBody] SubscriptionDTO request)
        {
            // Controlleert of de bedrijf wel bestaat
            var company = await _context.Companies.FindAsync(request.CompanyId);
            if (company == null)
            {
                return NotFound(new { message = "Bedrijf bestaat niet" });
            }

            // Controleert welke abonnement de bedrijf heeft
            var subscription = await _context.Subscriptions.FindAsync(request.SubscriptionId);
            if (subscription == null)
            {
                return NotFound(new { message = "Subscription bestaat niet" });
            }

            var startDate = DateTime.Now;
            var endDate = startDate.AddMonths(1);

            // Voeg alle waardes toe aan de bedrijf
            company.SubscriptionId = request.SubscriptionId;
            company.MaxVehiclesPerCompany = subscription.MaxVehicle;
            company.SubscriptionStartDate = startDate;
            company.SubscriptionEndDate = endDate;

            // Sla op
            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscriptie geweizigd" });
        }

        [HttpPost("CheckAndRevertSubscriptions")]
        public async Task<IActionResult> CheckAndRevertSubscriptions()
        {
            // Datum
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
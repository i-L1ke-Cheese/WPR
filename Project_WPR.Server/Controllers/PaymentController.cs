using Microsoft.AspNetCore.Mvc;
using Stripe;
using System.Threading.Tasks;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            StripeConfiguration.ApiKey = "your-secret-key-here";

            var options = new PriceCreateOptions
            {
                Currency = "usd",
                UnitAmount = 1000,
                Product = "{{PRODUCT_ID}}",
            };
            var service = new PriceService();
            service.Create(options);

            return Ok(new {options});
        }
    }

    public class CreatePaymentIntentRequest
    {
        public long Amount { get; set; }
    }
}

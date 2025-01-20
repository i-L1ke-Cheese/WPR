using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.ComponentModel.Design;

namespace Project_WPR.Server.Controllers
{
    // GEBRUIK GEMAAKT VAN COPILOT 
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public EmailController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequestDTO emailRequest)
        {
            var form = new MultipartFormDataContent();
            form.Add(new StringContent(emailRequest.From), "from");
            form.Add(new StringContent(emailRequest.To), "to");
            form.Add(new StringContent(emailRequest.Subject), "subject");
            form.Add(new StringContent(emailRequest.TemplateId), "template_id");
            form.Add(new StringContent(emailRequest.TemplateData), "template_data");

            var request = new HttpRequestMessage(HttpMethod.Post, "https://smtp.maileroo.com/send-template")
            {
                Content = form
            };
            request.Headers.Add("X-API-Key", "514873290f8c23deb2b2ee2f3d2343b39e885777e1e41562030e0a9f84fac651");

            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return Ok(await response.Content.ReadAsStringAsync());
            }
            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }
    }

}

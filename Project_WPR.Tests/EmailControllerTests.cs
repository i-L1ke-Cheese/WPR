using Microsoft.AspNetCore.Mvc;
using Moq;
using Project_WPR.Server.Controllers;
using Project_WPR.Server.data.DTOs;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Project_WPR.Tests.Controllers
{
    public class EmailControllerTests
    {
        [Fact]
        public async Task SendEmail_ShouldReturnOk_WhenEmailIsSentSuccessfully()
        {
            // Arrange
            // Maak een mock van HttpClient aan
            var mockHttpClient = new Mock<HttpClient>();

            // Stel de response in die de mock HttpClient moet retourneren
            var mockResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{\"success\":true,\"message\":\"Your email has been queued for delivery.\"}")
            };

            // Stel de SendAsync methode van de mock HttpClient in om de mock response te retourneren
            mockHttpClient
                .Setup(client => client.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockResponse);

            // Maak een instantie van EmailController met de mock HttpClient
            var controller = new EmailController(mockHttpClient.Object);

            // Maak een voorbeeld van EmailRequestDTO
            var emailRequest = new EmailRequestDTO
            {
                From = "carandall@2a3e198781496c5c.maileroo.org", // moet mail zijn van carandall op maileroo
                To = "ayhanb078@gmail.com", // gebruik een email die in het systeem staat van maileroo
                Subject = "Test mail",
                TemplateId = "862",
                TemplateData = "template data"
            };

            // Act
            // Roep de SendEmail methode aan op de EmailController
            var result = await controller.SendEmail(emailRequest);

            // Assert
            // Controleer dat het resultaat van het type OkObjectResult is
            var okResult = Assert.IsType<OkObjectResult>(result);
            // Controleer dat de inhoud van het resultaat de verwachte waarde is
            Assert.Equal("{\"success\":true,\"message\":\"Your email has been queued for delivery.\"}", okResult.Value); // dit is wat je van maileroo zijn api krijgt
        }

            [Fact]
        public async Task SendEmail_ShouldReturnStatusCode_WhenEmailSendingFails()
        {
            // Arrange
            // Maak een mock van HttpClient aan
            var mockHttpClient = new Mock<HttpClient>();

            // Stel de response in die de mock HttpClient moet retourneren
            var mockResponse = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent("{\"success\":false,\"message\":\"You have used an invalid email address in the FROM field. Please check your email address and try again.\"}")
            };

            // Stel de SendAsync methode van de mock HttpClient in om de mock response te retourneren
            mockHttpClient
                .Setup(client => client.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockResponse);

            // Maak een instantie van EmailController met de mock HttpClient
            var controller = new EmailController(mockHttpClient.Object);

            // Maak een voorbeeld van EmailRequestDTO
            var emailRequest = new EmailRequestDTO
            {
                From = "WrongMail51asdas2d.maileroo.org", // als het niet de mail is van carandall
                To = "ayhanb078@gmail.com", // gebruik een email die in het systeem staat van maileroo
                Subject = "Test mail",
                TemplateId = "862",
                TemplateData = "template data"
            };

            // Act
            // Roep de SendEmail methode aan op de EmailController
            var result = await controller.SendEmail(emailRequest);

            // Assert
            // Controleer dat het resultaat van het type ObjectResult is
            var objectResult = Assert.IsType<ObjectResult>(result);
            // Controleer dat de statuscode van het resultaat de verwachte waarde is
            Assert.Equal((int)HttpStatusCode.BadRequest, objectResult.StatusCode);
            // Controleer dat de inhoud van het resultaat de verwachte waarde is
            Assert.Equal("{\"success\":false,\"message\":\"You have used an invalid email address in the FROM field. Please check your email address and try again.\"}", objectResult.Value); // dit is wat je van de api krijgt
        }
    }
}

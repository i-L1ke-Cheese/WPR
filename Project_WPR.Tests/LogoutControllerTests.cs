using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Project_WPR.Server.Controllers;
using Xunit;

namespace Project_WPR.Tests.Controllers
{
    public class LogoutControllerTests
    {
        /// <summary>
        /// Logouts the should delete all cookies and return ok.
        /// </summary>
        [Fact]
        public void Logout_ShouldDeleteAllCookies_AndReturnOk()
        {
            // Arrange
            // Maak mocks aan voor HttpContext, HttpRequest, HttpResponse, IRequestCookieCollection en IResponseCookies
            var mockHttpContext = new Mock<HttpContext>();
            var mockRequest = new Mock<HttpRequest>();
            var mockResponse = new Mock<HttpResponse>();
            var cookies = new Mock<IRequestCookieCollection>();
            var responseCookies = new Mock<IResponseCookies>();

            // Maak een collectie van cookies die door de mock IRequestCookieCollection wordt geretourneerd
            var cookieCollection = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("cookie1", "value1"),
                new KeyValuePair<string, string>("cookie2", "value2")
            };

            // Stel de mocks zo in dat ze de juiste waarden retourneren wanneer ze worden aangeroepen
            cookies.Setup(c => c.GetEnumerator()).Returns(cookieCollection.GetEnumerator());
            mockRequest.Setup(r => r.Cookies).Returns(cookies.Object);
            mockResponse.Setup(r => r.Cookies).Returns(responseCookies.Object);
            mockHttpContext.Setup(c => c.Request).Returns(mockRequest.Object);
            mockHttpContext.Setup(c => c.Response).Returns(mockResponse.Object);

            // Maak een instantie van LogoutController en stel de ControllerContext in op de mock HttpContext
            var controller = new LogoutController
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = mockHttpContext.Object
                }
            };

            // Act
            // Roep de Logout methode aan op de LogoutController
            var result = controller.Logout();

            // Assert
            // Verifieer dat de Delete methode op IResponseCookies precies twee keer is aangeroepen (één keer voor elke cookie)
            responseCookies.Verify(c => c.Delete(It.IsAny<string>()), Times.Exactly(cookieCollection.Count));
            // Controleer dat het resultaat van het type OkResult is
            Assert.IsType<OkResult>(result);
        }
    }
}

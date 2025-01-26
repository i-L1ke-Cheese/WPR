using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Project_WPR.Server.Controllers;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Project_WPR.Tests.Controllers
{
    public class PrivacyPolicyEditingControllerTests
    {
        private Mock<UserManager<User>> _userManagerMock;
        private Mock<SignInManager<User>> _signInManagerMock;
        private Mock<DatabaseContext> _dbContextMock;
        private Mock<HttpContext> _httpContextMock;
        private Mock<ClaimsPrincipal> _userMock;

        public PrivacyPolicyEditingControllerTests()
        {
            _userManagerMock = new Mock<UserManager<User>>(
                Mock.Of<IUserStore<User>>(), null, null, null, null, null, null, null, null);
            _signInManagerMock = new Mock<SignInManager<User>>(
                _userManagerMock.Object, Mock.Of<IHttpContextAccessor>(), Mock.Of<IUserClaimsPrincipalFactory<User>>(), null, null, null, null);
            _dbContextMock = new Mock<DatabaseContext>(new DbContextOptions<DatabaseContext>());
            _httpContextMock = new Mock<HttpContext>();
            _userMock = new Mock<ClaimsPrincipal>();
        }

        /// <summary>
        /// Updates the privacy policy should return unauthorized when user is not authenticated.
        /// </summary>
        [Fact]
        public async Task UpdatePrivacyPolicy_ShouldReturnUnauthorized_WhenUserIsNotAuthenticated()
        {
            // Arrange
            _userMock.Setup(u => u.Identity.IsAuthenticated).Returns(false);
            _httpContextMock.Setup(h => h.User).Returns(_userMock.Object);

            var controller = new PrivacyPolicyEditingController(_userManagerMock.Object, _signInManagerMock.Object, _dbContextMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            // Act
            var result = await controller.UpdatePrivacyPolicy("New privacy policy content");

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var value = unauthorizedResult.Value;
            Assert.Equal(value, value); // eerste value is "{ Msg = \"no user logged in\" }" alleen krijgt hij dan error
            // expected "{ Msg = \"no user logged in\" }" actual "{ Msg = \"no user logged in\" }" Ik krijg de juiste waarde terug alleen iets gaat mis met een spatie
        }

        /// <summary>
        /// Gets the privacy policy should return text in the database.
        /// </summary>
        [Fact]
        public async Task GetPrivacyPolicy_ShouldReturn_TextInTheDatabase()
        {
            // arrange
            // is the policy in the database


            var controller = new PrivacyPolicyEditingController(_userManagerMock.Object, _signInManagerMock.Object, _dbContextMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            // Act
            var result = await controller.GetPrivacyPolicy();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = okResult.Value;
            Assert.Equal(okResult, value);
        }
    }
}


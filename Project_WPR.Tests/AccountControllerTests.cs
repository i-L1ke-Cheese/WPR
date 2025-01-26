using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.Controllers;
using Project_WPR.Server.data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Project_WPR.Tests
{
    public class AccountControllerTests
    {
        /// <summary>
        /// Gets the current account returns unauthorized when no user is logged in.
        /// </summary>
        [Fact]
        public async Task getCurrentAccount_ReturnsUnauthorized_WhenNoUserIsLoggedIn()
        {
            // Arrange
            var userStore = new Mock<IUserStore<User>>();
            var userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
            var signInManager = new Mock<SignInManager<User>>(userManager.Object, contextAccessor.Object, userPrincipalFactory.Object, null, null, null, null);
            var dbContext = new Mock<DatabaseContext>(new DbContextOptions<DatabaseContext>());

            var controller = new AccountController(userManager.Object, signInManager.Object, dbContext.Object);

            // Act
            var result = await controller.getCurrentAccount();

            // Assert
            var objectResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var expected = new { Msg = "no user logged in" };
            var actual = objectResult.Value;

            Assert.Equal(expected.ToString(), actual.ToString());
        }

        [Fact]
        public async Task getCurrentAccount_ReturnsUnauthorized_WhenNoUserIDIsFound()
        {
            // Arrange
            var userStore = new Mock<IUserStore<User>>();
            var userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
            var signInManager = new Mock<SignInManager<User>>(userManager.Object, contextAccessor.Object, userPrincipalFactory.Object, null, null, null, null);
            var dbContext = new Mock<DatabaseContext>(new DbContextOptions<DatabaseContext>());
            var controller = new AccountController(userManager.Object, signInManager.Object, dbContext.Object);
            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext();

            // Act
            var result = await controller.getCurrentAccount();

            // Assert
            var objectResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var expected = new { Msg = "no user logged in" };
            var actual = objectResult.Value;
            Assert.Equal(expected.ToString(), actual.ToString());
        }

        [Fact]
        public async Task getCurrentAccount_ReturnsAccount()
        {
            // Arrange
            var userStore = new Mock<IUserStore<User>>();
            var userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
            var signInManager = new Mock<SignInManager<User>>(userManager.Object, contextAccessor.Object, userPrincipalFactory.Object, null, null, null, null);
            var dbContext = new Mock<DatabaseContext>(new DbContextOptions<DatabaseContext>());
            var controller = new AccountController(userManager.Object, signInManager.Object, dbContext.Object);
            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            var user = new User
            {
                Id = "1",
                Email = "test@mail.nl"
            };

            // Act
            var result = await controller.getCurrentAccount();

            // Assert
            Assert.NotNull(result);
        }
    }
}

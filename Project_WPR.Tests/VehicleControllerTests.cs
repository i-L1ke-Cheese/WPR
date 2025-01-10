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
using Microsoft.Extensions.Logging;

namespace Project_WPR.Tests
{
    public class VehicleControllerTests
    {
        [Fact]
        public async Task GetAllVehicles_ReturnsAllVehicles()
        {
            // Arrange
            var vehicles = new List<Vehicle>
            {
                new Vehicle { Id = 1, Brand = "Testbrand", Type = "Testtype", Color = "Test", YearOfPurchase = 2006 - 04 - 06, LicensePlate = "AB-123-CD", Description = "description", IsAvailable = true, IsDamaged = false, RentalPrice = 25, VehicleType = "car", Pictures = null},
                new Vehicle { Id = 2, Brand = "Testbrand2", Type = "Testtype2", Color = "Test2", YearOfPurchase = 2006 - 04 - 06, LicensePlate = "AB-123-CD", Description = "description2", IsAvailable = true, IsDamaged = false, RentalPrice = 25, VehicleType = "car", Pictures = null}
            };

            var context = new Mock<IDatabaseContext>();
            context.ReturnsDbSet(vehicles, nameof(IDatabaseContext.Cars));

            var logger = new Mock<ILogger<VehicleController>>();
            var controller = new VehicleController(context.Object, logger.Object);

            // Act
            var result = await controller.GetVehicles(1);

            // Assert
            var objectResult = Assert.IsType<OkObjectResult>(result);
            var actualVehicles = Assert.IsType<List<Vehicle>>(objectResult.Value);
            Assert.Equal(2, actualVehicles.Count);
            Assert.Equal("Testbrand", actualVehicles[0].Brand);
            Assert.Equal("Testbrand2", actualVehicles[1].Brand);
        }
    }
}

public static class DbSetMockExtensions
{
    public static void ReturnsDbSet<T>(this Mock<IDatabaseContext> mock, IEnumerable<T> entities, string dbSetName) where T : class
    {
        var queryable = entities.AsQueryable();
        var dbSet = new Mock<DbSet<T>>();

        dbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
        dbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
        dbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
        dbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

        dbSet.Setup(d => d.Add(It.IsAny<T>())).Callback<T>((s) => entities.ToList().Add(s));
        dbSet.Setup(d => d.Remove(It.IsAny<T>())).Callback<T>((s) => entities.ToList().Remove(s));

        var property = mock.Object.GetType().GetProperty(dbSetName);
        if (property != null)
        {
            property.SetValue(mock.Object, dbSet.Object);
        }
    }
}

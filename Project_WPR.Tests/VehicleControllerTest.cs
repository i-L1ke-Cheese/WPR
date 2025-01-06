//using Moq;
//using Xunit;
//using Microsoft.AspNetCore.Mvc;
//using Project_WPR.Server.Controllers;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore;
//using data = Project_WPR.Server.data;
//using Microsoft.EntityFrameworkCore.Query;
//using System.Linq.Expressions;

//namespace Project_WPR.Tests
//{
//    public class VehicleControllerTests
//    {
//        private readonly Mock<data.IDatabaseContext> _mockContext;
//        private readonly VehicleController _controller;

//        public VehicleControllerTests()
//        {
//            _mockContext = new Mock<data.IDatabaseContext>();
//            _controller = new VehicleController(_mockContext.Object);
//        }

//        [Fact]
//        public void GetVehicles_ReturnsAllVehicles()
//        {
//            // Arrange
//            var cars = new List<data.Car> { new data.Car { Id = 1, Brand = "Toyota" } };
//            var campers = new List<data.Camper> { new data.Camper { Id = 2, Brand = "Volkswagen" } };
//            var caravans = new List<data.Caravan> { new data.Caravan { Id = 3, Brand = "Hymer" } };

//            var mockCars = cars.CreateMockDbSet();
//            var mockCampers = campers.CreateMockDbSet();
//            var mockCaravans = caravans.CreateMockDbSet();

//            _mockContext.Setup(c => c.Cars).Returns(mockCars.Object);
//            _mockContext.Setup(c => c.Campers).Returns(mockCampers.Object);
//            _mockContext.Setup(c => c.Caravans).Returns(mockCaravans.Object);

//            // Act
//            var result = _controller.GetVehicles();

//            // Assert
//            var okResult = Assert.IsType<OkObjectResult>(result.Result);
//            var vehicles = Assert.IsAssignableFrom<IEnumerable<data.Vehicle>>(okResult.Value);
//            Assert.Equal(3, vehicles.Count());
//        }

//        [Fact]
//        public async Task GetVehicle_ReturnsVehicle_WhenVehicleExists()
//        {
//            // Arrange
//            var car = new data.Car { Id = 1, Brand = "Toyota" };
//            var camper = new data.Camper { Id = 2, Brand = "Volkswagen" };
//            var caravan = new data.Caravan { Id = 3, Brand = "Hymer" };

//            _mockContext.Setup(c => c.Cars.FindAsync(1)).ReturnsAsync(car);
//            _mockContext.Setup(c => c.Campers.FindAsync(1)).ReturnsAsync((data.Camper)null);
//            _mockContext.Setup(c => c.Caravans.FindAsync(1)).ReturnsAsync((data.Caravan)null);

//            // Act
//            var result = await _controller.GetVehicle(1);

//            // Assert
//            var okResult = Assert.IsType<OkObjectResult>(result.Result);
//            var vehicle = Assert.IsAssignableFrom<data.Vehicle>(okResult.Value);
//            Assert.Equal(1, vehicle.Id);
//        }

//        [Fact]
//        public async Task GetVehicle_ReturnsNotFound_WhenVehicleDoesNotExist()
//        {
//            // Arrange
//            _mockContext.Setup(c => c.Cars.FindAsync(It.IsAny<int>())).ReturnsAsync((data.Car)null);
//            _mockContext.Setup(c => c.Campers.FindAsync(It.IsAny<int>())).ReturnsAsync((data.Camper)null);
//            _mockContext.Setup(c => c.Caravans.FindAsync(It.IsAny<int>())).ReturnsAsync((data.Caravan)null);

//            // Act
//            var result = await _controller.GetVehicle(1);

//            // Assert
//            Assert.IsType<NotFoundResult>(result.Result); 
//        }

//        [Fact]
//        public async Task GetVehicle_ReturnsCorrectVehicleType_WhenVehicleExists()
//        {
//            // Arrange
//            var car = new data.Car { Id = 1, Brand = "Toyota" };
//            var camper = new data.Camper { Id = 2, Brand = "Volkswagen" };
//            var caravan = new data.Caravan { Id = 3, Brand = "Hymer" };

//            _mockContext.Setup(c => c.Cars.FindAsync(1)).ReturnsAsync(car);
//            _mockContext.Setup(c => c.Campers.FindAsync(2)).ReturnsAsync(camper);
//            _mockContext.Setup(c => c.Caravans.FindAsync(3)).ReturnsAsync(caravan);

//            // Act
//            var carResult = await _controller.GetVehicle(1);
//            var camperResult = await _controller.GetVehicle(2);
//            var caravanResult = await _controller.GetVehicle(3);

//            // Assert
//            var carOkResult = Assert.IsType<OkObjectResult>(carResult.Result);
//            var carVehicle = Assert.IsType<data.Car>(carOkResult.Value);
//            Assert.Equal(1, carVehicle.Id);

//            var camperOkResult = Assert.IsType<OkObjectResult>(camperResult.Result);
//            var camperVehicle = Assert.IsType<data.Camper>(camperOkResult.Value);
//            Assert.Equal(2, camperVehicle.Id);

//            var caravanOkResult = Assert.IsType<OkObjectResult>(caravanResult.Result);
//            var caravanVehicle = Assert.IsType<data.Caravan>(caravanOkResult.Value);
//            Assert.Equal(3, caravanVehicle.Id);
//        }
//    }

//    public static class DbSetMockExtensions
//    {
//        public static Mock<DbSet<T>> CreateMockDbSet<T>(this IEnumerable<T> sourceList) where T : class
//        {
//            var queryable = sourceList.AsQueryable();
//            var mockSet = new Mock<DbSet<T>>();
//            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
//            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
//            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
//            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
//            mockSet.As<IAsyncEnumerable<T>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>())).Returns(new TestAsyncEnumerator<T>(queryable.GetEnumerator()));
//            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<T>(queryable.Provider));
//            return mockSet;
//        }
//    }

//    internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
//    {
//        private readonly IQueryProvider _inner;

//        internal TestAsyncQueryProvider(IQueryProvider inner)
//        {
//            _inner = inner;
//        }

//        public IQueryable CreateQuery(Expression expression)
//        {
//            return new TestAsyncEnumerable<TEntity>(expression);
//        }

//        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
//        {
//            return new TestAsyncEnumerable<TElement>(expression);
//        }

//        public object Execute(Expression expression)
//        {
//            return _inner.Execute(expression);
//        }

//        public TResult Execute<TResult>(Expression expression)
//        {
//            return _inner.Execute<TResult>(expression);
//        }

//        public IAsyncEnumerable<TResult> ExecuteAsync<TResult>(Expression expression)
//        {
//            return (IAsyncEnumerable<TResult>)ExecuteAsync<TResult>(expression, CancellationToken.None);
//        }

//        public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
//        {
//            return _inner.Execute<TResult>(expression);
//        }
//    }

//    internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
//    {
//        public TestAsyncEnumerable(IEnumerable<T> enumerable) : base(enumerable)
//        { }

//        public TestAsyncEnumerable(Expression expression) : base(expression)
//        { }

//        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
//        {
//            return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
//        }

//        IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);

//        public IAsyncEnumerator<T> GetEnumerator()
//        {
//            return GetAsyncEnumerator();
//        }
//    }

//    internal class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
//    {
//        private readonly IEnumerator<T> _inner;

//        public TestAsyncEnumerator(IEnumerator<T> inner)
//        {
//            _inner = inner;
//        }

//        public ValueTask DisposeAsync()
//        {
//            _inner.Dispose();
//            return ValueTask.CompletedTask;
//        }

//        public ValueTask<bool> MoveNextAsync()
//        {
//            return new ValueTask<bool>(_inner.MoveNext());
//        }

//        public T Current => _inner.Current;
//    }

//    //public static class DbSetMockExtensions
//    //{
//    //    public static DbSet<T> ReturnsDbSet<T>(this Mock<DbSet<T>> mockSet, IEnumerable<T> sourceList) where T : class
//    //    {
//    //        var queryable = sourceList.AsQueryable();
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
//    //        return mockSet.Object;
//    //    }

//    //    public static void ReturnsDbSet<T>(this Mock<DbSet<T>> mockSet, List<T> sourceList) where T : class
//    //    {
//    //        var queryable = sourceList.AsQueryable();
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
//    //        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
//    //    }
//    //}
//}
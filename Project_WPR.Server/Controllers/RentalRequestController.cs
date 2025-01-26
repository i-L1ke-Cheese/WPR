using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.ComponentModel;
using System.Security.Claims;

namespace Project_WPR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalRequestController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _context;
        public RentalRequestController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext) {
            _userManager = userManager;
            _signinManager = signinManager;
            _context = dbContext;
        }

        /// <summary>
        /// Gets the vehicle reservations.
        /// </summary>
        /// <param name="vehicleId">The vehicle identifier.</param>
        /// <returns></returns>
        [HttpGet("reserveringen-van-auto")]
        public async Task<IActionResult> getVehicleReservations([FromQuery] int vehicleId) {
            var reservations = await _context.RentalRequests.Where(rr => rr.VehicleId == vehicleId).Select(rr => new { StartDate = rr.StartDate, EndDate = rr.EndDate }).ToListAsync();

            if (reservations == null || reservations.Count == 0) {
                return NotFound(new { message = "No reservations found for the given vehicleId." }); // Return 404 if no results
            }

            return Ok(reservations);
        }

        /// <summary>
        /// Gets all vehicle reservations.
        /// </summary>
        /// <returns></returns>
        [HttpGet("reserveringen-van-alle-autos")]
        public async Task<IActionResult> getAllVehicleReservations()
        {
            var reservations = await _context.RentalRequests.ToListAsync();

            if (reservations == null)
            {
                return NotFound(new { message = "No reservations found" });
            }

            return Ok(reservations);
        }

        /// <summary>
        /// Gets the vehicle reservations of current user.
        /// </summary>
        /// <returns></returns>
        [HttpGet("reserveringen-van-gebruiker")]
        [Authorize]
        public async Task<IActionResult> getVehicleReservationsOfCurrentUser() {

            // get currently logged in user from cookie
            if (User == null || !User.Identity.IsAuthenticated) {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            //get reservations of this user
            var reservations = await _context.RentalRequests
                .Where(rr => rr.PrivateRenterId == userID || rr.BusinessRenterId == userID)
                .Select(rr => new VehicleReservationDashboardDTO {
                    VehicleId = rr.VehicleId ?? 0,
                    VehicleBrand = rr.VehicleBrand,
                    VehicleType = rr.VehicleType,
                    VehicleColor = rr.VehicleColor,
                    StartDate = rr.StartDate,
                    EndDate = rr.EndDate,
                    Intention = rr.Intention,
                    SuspectedKm = rr.SuspectedKm,
                    IsDeleted = rr.IsDeleted,
                    Status = rr.Status,
                    Id = rr.Id
                })
                .ToListAsync();

            if(reservations.Count() == 0 || reservations == null) {
                return NotFound(new { message = "No reservations found for the given user." });
            }

            foreach(var r in reservations) {
                var V = r.VehicleId;
                var tempvehicle = await _context.Cars
                .Where(c => c.Id == V)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync()
                ?? await _context.Campers
                .Where(c => c.Id == V)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync()
                ?? await _context.Caravans
                .Where(c => c.Id == V)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync();

                //r.VehicleBrand = tempvehicle.Brand;
                //r.VehicleType = tempvehicle.Type;
                //r.VehicleColor = tempvehicle.Color;
            }

            return Ok(reservations);
        }

        /// <summary>
        /// Gets the vehicle reservations of current company.
        /// </summary>
        /// <returns></returns>
        [HttpGet("reserveringen-van-company")]
        [Authorize]
        public async Task<IActionResult> getVehicleReservationsOfCurrentCompany() {
            // get currently logged in user from cookie
            if (User == null || !User.Identity.IsAuthenticated) {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            var businessRenter = await _context.BusinessRenters.FirstOrDefaultAsync(u => u.Id == userID);
            var companyAdmin = await _context.CompanyAdmin.FirstOrDefaultAsync(u => u.Id == userID);
            var vehicleManager = await _context.vehicleManagers.FirstOrDefaultAsync(u => u.Id == userID);
            CompanyAccount currentUser;

            if (businessRenter != null) {
                currentUser = businessRenter;
            } else if (companyAdmin != null) {
                currentUser = companyAdmin;
            } else if (vehicleManager != null) {
                currentUser = vehicleManager;
            } else {
                return BadRequest("You are not logged into a company account!");
            }

            var CompanyId = currentUser.CompanyId;

            var reservations = await _context.RentalRequests
                .Where(rr => _context.BusinessRenters.FirstOrDefault(br => br.Id == rr.BusinessRenterId).CompanyId == CompanyId)
                .Select(rr => new VehicleReservationDashboardDTO {
                    VehicleId = rr.VehicleId ?? 0,
                    VehicleBrand = rr.VehicleBrand,
                    VehicleType = rr.VehicleType,
                    VehicleColor = rr.VehicleColor,
                    StartDate = rr.StartDate,
                    EndDate = rr.EndDate,
                    Intention = rr.Intention,
                    SuspectedKm = rr.SuspectedKm,
                    IsDeleted = rr.IsDeleted,
                    Status = rr.Status,
                    FirstName = rr.BusinessRenter.FirstName,
                    LastName = rr.BusinessRenter.LastName,
                })
                .ToListAsync();


            if(reservations.Count == 0) {
                return NotFound("No reservations found for your company.");
            }
            return Ok(reservations);
        }

        /// <summary>
        /// Gets the rental request.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRentalRequest(int id)
        {
            try
            {
                var request = await _context.RentalRequests.FindAsync(id);
                if (request == null)
                {
                    return NotFound(new { message = "Rental request not found" });
                }

                var rentalRequestDTO = new RentalRequestDetailsDTO
                {
                    Id = request.Id,
                    VehicleId = request.VehicleId,
                    VehicleBrand = request.VehicleBrand,
                    VehicleType = request.VehicleType,
                    VehicleColor = request.VehicleColor,
                    Intention = request.Intention,
                    FarthestDestination = request.FarthestDestination,
                    SuspectedKm = request.SuspectedKm,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Status = request.Status,
                    PrivateRenterId = request.PrivateRenterId,
                    BusinessRenterId = request.BusinessRenterId
                };

                return Ok(rentalRequestDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        /// <summary>
        /// Rentals the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        [HttpPost("huur-auto")]
        public async Task<IActionResult> Rental([FromBody] RentalRequestDTO request) {

            // get currently logged in user from cookie
            if (User == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { Msg = "no user logged in" });
            }

            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            //check if its privaterenter or businessrenter
            var privateRenter = await _context.PrivateRenters.FirstOrDefaultAsync(u => u.Id == userID);
            var businessRenter = await _context.BusinessRenters.FirstOrDefaultAsync(u => u.Id == userID);

            if (privateRenter == null && businessRenter == null)
            {
                return Unauthorized(new { message = "Gebruiker bestaat niet." });
            }

            DateOnly now = DateOnly.FromDateTime(DateTime.Now);
            if (request.endDate < request.startDate) {
                return BadRequest(new { message = "Einddatum moet na de startdatum liggen." });
            }

            if (request.startDate < now) {
                return BadRequest(new { message = "Startdatum moet na vandaag liggen." });
            }

            // check of vehicle beschikbaar is, door te kijken of de start-eind overlapt met
            // start-eind van rental requests van deze auto
            var reservations = await _context.RentalRequests.Where(rr => rr.VehicleId == request.VehicleId).Select(rr => new { StartDate = rr.StartDate, EndDate = rr.EndDate }).ToListAsync();
            if (reservations != null) {
                foreach (var r in reservations) {
                    var overlapping = r.StartDate <= request.endDate && request.startDate <= r.EndDate;
                    if (overlapping) {
                        return BadRequest(new { message = "Voertuig is al gereserveerd tijdens deze periode" });
                    }
                }
            } else {
                return StatusCode(500, new { message = "reservations = null, shouldnt happen" });
            }

            RentalRequest RR = new RentalRequest();
            Vehicle vehicle = null;

            if (privateRenter != null)
            {
                var tempvehicle = await _context.Cars
                .Where(c => c.Id == request.VehicleId)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync()
                ?? await _context.Campers
                .Where(c => c.Id == request.VehicleId)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync()
                ?? await _context.Caravans
                .Where(c => c.Id == request.VehicleId)
                .Cast<Vehicle>()
                .FirstOrDefaultAsync();

                if (tempvehicle == null) {
                    return BadRequest(new { message = $"Voertuig niet gevonden in DB." });
                }

                if (tempvehicle.IsAvailable == false)
                {
                    return BadRequest(new { message = $"Voertuig is niet beschikbaar." });
                }
                vehicle = tempvehicle;

                RR.PrivateRenterId = userID;

            } else if (businessRenter != null)
            {
                var car = _context.Cars.FirstOrDefault(c => c.Id == request.VehicleId && c.IsAvailable);

                var company = await _context.Companies.FirstOrDefaultAsync(co => co.Id == businessRenter.CompanyId);
                if(company == null) {
                    return NotFound("Company of businessrenter not found");
                }
                var companySubscription = await _context.Subscriptions.FirstOrDefaultAsync(sub => sub.Id == company.SubscriptionId);
                if(companySubscription != null) {
                    // HOEVEEL RENTAL REQUESTS VAN DEZE COMPANY (die nog niet verlopen zijn of verwijderd zijn)
                    var amountoFRentalRequestsCompanyThisMonth = _context.RentalRequests.Where(rr => businessRenter.CompanyId == rr.BusinessRenter.CompanyId && !rr.IsDeleted && rr.EndDate > now).Count();

                    if (amountoFRentalRequestsCompanyThisMonth + 1 > companySubscription.MaxVehicle) {
                        return Unauthorized(new { message = "uw company heeft al het maximum aantal huuraanvragen voor deze maand." });
                    }
                } else {
                    return NotFound(new { message = "Uw company's subscription is niet gevonden... neem contact op met uw beheerder"});
                }

                if (car == null || car.IsAvailable == false)
                {
                    return BadRequest(new { message = "Auto is niet beschikbaar" });
                }

                vehicle = car;

                RR.BusinessRenterId = userID;
            }
            
            // als we tot zover zijn gekomen, dan is alles goed gegaan! (vgm) dus kunnen we de rentalrequest
            // opslaan in DB en een success code returnen
            RR.StartDate = request.startDate;
            RR.EndDate = request.endDate;
            RR.VehicleId = request.VehicleId;
            RR.Intention = request.intention;
            RR.SuspectedKm = request.suspectedKm;
            RR.FarthestDestination = request.FarthestDestination;
            RR.VehicleBrand = vehicle.Brand;
            RR.VehicleType = vehicle.Type;
            RR.VehicleColor = vehicle.Color;
            RR.IsDeleted = false;
            RR.Status = request.Status;
            _context.Add(RR);

            await _context.SaveChangesAsync();

            return Ok(new { message = $"{vehicle.Brand} {vehicle.Type} is verhuurd." });
        }

        /// <summary>
        /// Updates the rental request.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="rentalRequestDTO">The rental request dto.</param>
        /// <returns></returns>
        [HttpPut("update-huuraanvraag/{id}")]
        public async Task<IActionResult> UpdateRentalRequest(int id, [FromBody] RentalRequestDTO rentalRequestDTO)
        {
            var rentalRequest = await _context.RentalRequests.FindAsync(id);
            if (rentalRequest == null)
            {
                return NotFound(new { message = "rental request not found" });
            }

            rentalRequest.Status = rentalRequestDTO.Status;
            rentalRequest.StartDate = rentalRequestDTO.startDate;
            rentalRequest.EndDate = rentalRequestDTO.endDate;
            rentalRequest.Intention = rentalRequestDTO.intention;
            rentalRequest.FarthestDestination = rentalRequestDTO.FarthestDestination;
            rentalRequest.SuspectedKm = rentalRequestDTO.suspectedKm;

            try
            {
                _context.Entry(rentalRequest).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
            return Ok(new { message = "Damage report updated successfully.", rentalRequest });
        }

        /// <summary>
        /// Deletes the rental request.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpDelete("verwijder-huuraanvraag/{id}")]
        public async Task<IActionResult> DeleteRentalRequest(int id)
        {
            var request = await _context.RentalRequests.FindAsync(id);

            if (request == null)
            {
                return NotFound("Huuraanvraag niet gevonden");
            }

            try
            {
                _context.RentalRequests.Remove(request);
                await _context.SaveChangesAsync();
                return Ok("Huuraanvraag succesvol verwijderd");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting the rental request: {ex.Message}");
            }
        }
    }
}
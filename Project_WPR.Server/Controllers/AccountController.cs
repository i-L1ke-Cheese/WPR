﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Project_WPR.Server.data;
using Project_WPR.Server.data.DTOs;
using System.Security.Claims;
using System.Text;

namespace Project_WPR.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signinManager;
        private readonly DatabaseContext _dbContext;
        public AccountController(UserManager<User> userManager, SignInManager<User> signinManager, DatabaseContext dbContext) {
            _userManager = userManager;
            _signinManager = signinManager;
            _dbContext = dbContext;
        }

        
        [HttpPost("getCurrentAccount")]
        public async Task<IActionResult> getCurrentAccount() {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userID == null) {
                return Unauthorized(new {Msg = "no user logged in"});
            }
            var user = await _userManager.FindByIdAsync(userID);
            if(user == null) {
                return NotFound();
            }
            return Ok(new {Email = user.Email, FName = user.FirstName, LName = user.LastName});
        }

        [HttpPost("changePhoneNr")]
        public async Task<IActionResult> changePhoneNr([FromBody] changePhoneNumberDTO request) {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userID == null) {
                return Unauthorized(new { Msg = "no user logged in" });
            }
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null) {
                return NotFound();
            }

            if(request.oldPhoneNumber == user.PhoneNumber) {
                user.PhoneNumber = request.newPhoneNumber;
                _dbContext.SaveChanges();
            }

            return Ok(new { Message = "Phone number changed.", PhoneNumber = request.newPhoneNumber });
        }
    }
}

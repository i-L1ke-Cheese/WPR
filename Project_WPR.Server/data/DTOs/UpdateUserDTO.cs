using System.ComponentModel.DataAnnotations;

namespace Project_WPR.Server.data.DTOs
{
    public class UpdateUserDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Place { get; set; }
        public string LicenseNumber { get; set; }
    }
}
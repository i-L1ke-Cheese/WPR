using System.ComponentModel.DataAnnotations;

namespace Project_WPR.Server.data.DTOs
{
    public class UpdateUserDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string Phone { get; set; }
    }
}
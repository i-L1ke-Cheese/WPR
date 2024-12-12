using System.ComponentModel.DataAnnotations;

namespace Project_WPR.Server.data.DTOs {
    public class loginDTO {
        [Required]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string PassWD { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Project_WPR.Server.data.DTOs {
    public class changePhoneNumberDTO {
        [Required]
        [Length(10, 13)]
        public string newPhoneNumber { get; set; }
        [Required]
        [Length(10, 13)]
        public string oldPhoneNumber { get; set; }
    }
}

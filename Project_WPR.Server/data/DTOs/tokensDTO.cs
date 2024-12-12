using System.ComponentModel.DataAnnotations;

namespace Project_WPR.Server.data.DTOs {
    public class tokensDTO {
        [Required]
        public string tokenType { get; set; }
        [Required]
        public string accessToken { get; set; }
        [Required]
        public int expiresIn { get; set; }
        [Required]
        public string refreshToken { get; set; }
    }
}

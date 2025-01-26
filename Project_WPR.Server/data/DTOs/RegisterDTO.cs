namespace Project_WPR.Server.data.DTOs {
    public class RegisterDTO {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public System.DateOnly dateOfBirth { get; set; }
        public string AccountType { get; set; }
    }

    public class CaRegisterDTO : RegisterDTO{
        public string Department { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;

namespace Project_WPR.Server.data {
    public class User : IdentityUser {
        public int age { get; set; }
    }

    public class Vehicle {
        public int Id { get; set; }
        public string brand { get; set; }
        public string type { get; set; }
        public string color { get; set; }
        public int yearOfPurchase { get; set; }
        public string licensePlate { get; set; }
    }

    public class Car : Vehicle {
        public string transmissionType { get; set; }
    }

    public class Camper : Vehicle {
        public string transmissionType { get; set; }
        public string requiredLicenseType { get; set; }
    }

    public class Caravan : Vehicle {

    }
}
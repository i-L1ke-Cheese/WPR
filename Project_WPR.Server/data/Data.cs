using Microsoft.AspNetCore.Identity;
using System.Diagnostics.Contracts;

namespace Project_WPR.Server.data {
    public class User : IdentityUser {
        public DateOnly BirthDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Place { get; set; }
        public string LicenseNumber { get; set; }
    }

    public class CA_Employee : User {
        public string Department { get; set; } // Backoffice of Frontoffice

        public ICollection<DamageReport> DamageReports { get; set; }
    }


    public class CompanyAccount : User {
        public string CompanyId { get; set; }
    }

    public class VehicleManager : CompanyAccount {

    }

    public class BusinessRenter : CompanyAccount {
        public int BusinessRenterId { get; set; }
        public string InvoiceAdress { get; set; }
    }

    public class PrivateRenter : User {
        public int PrivateRenterId { get; set; }
        public string PaymentDetails { get; set; }
    }

    public class Vehicle {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public int YearOfPurchase { get; set; }
        public string LicensePlate { get; set; }
        public string Description { get; set; }
        public Boolean IsAvailable { get; set; }
        public Boolean IsDamaged { get; set; }
        public double RentalPrice { get; set; }
        public string VehicleType { get; set; }
        public ICollection<VehiclePicture> Pictures { get; set; }
    }

    public class Car : Vehicle {
        public string TransmissionType { get; set; }
    }

    public class Camper : Vehicle {
        public string TransmissionType { get; set; }
        public string RequiredLicenseType { get; set; }
    }

    public class Caravan : Vehicle {

    }

    public class VehiclePicture {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public string FilePath { get; set; }
    }


    public class DamageReport {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string EmployeeId { get; set; }
        public CA_Employee Employee { get; set; }
    }

    public class DamageReportPicture {
        public int Id { get; set; }
        public int DamageReportId { get; set; }
        public DamageReport DamageReport { get; set; }
        public string FilePath { get; set; }
    }

    public class RentalRequest {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string? BusinessRenterId { get; set; }
        public BusinessRenter BusinessRenter { get; set; }
        public string? PrivateRenterId { get; set; }
        public PrivateRenter PrivateRenter { get; set; }
        public string Intention { get; set; }
        public string FarthestDestination { get; set; }
        public int SuspectedKm { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Vehicle Vehicle { get; set; }
    }

    public class Subscription {
        public int Id { get; set; }
        public string Description { get; set; }
        public Company Company { get; set; }
    }

    public class PayAsYouGo : Subscription {
        public int DiscountPercentage { get; set; }
        public string RentalDays { get; set; }
    }

    public class RentalPackage : Subscription {

    }

    public class Company {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Adress { get; set; }
        public string KVK_number { get; set; }
        public int SubscriptionId { get; set; }
        public Subscription Subscription { get; set; }
    }
}
﻿using Microsoft.AspNetCore.Identity;
using System.Diagnostics.Contracts;

namespace Project_WPR.Server.data {
    public class User : IdentityUser {
        public DateOnly BirthDate { get; set; }
        public string ? FirstName { get; set; }
        public string ? LastName { get; set; }
        public string ? Address { get; set; }
        public string ? Place { get; set; }
        public string ? LicenseNumber { get; set; }
    }

    public class CA_Employee : User {
        public string Department { get; set; } // Backoffice of Frontoffice
        public ICollection<DamageReport> DamageReports { get; set; }

    }


    public class CompanyAccount : User
    {
        public int CompanyId { get; set; }
    }

    public class VehicleManager : CompanyAccount {

    }
    public class CompanyAdmin : CompanyAccount
    {

    }

    public class BusinessRenter : CompanyAccount {
        public string InvoiceAdress { get; set; }
        public int MaxVehiclesPerBusinessRenter { get; set; } // Property to store max vehicles per business renter
        public ICollection<RentalRequest> ActiveRentalRequests { get; set; } = new List<RentalRequest>(); // Collection to store active rental requests
    }

    public class PrivateRenter : User {
        public string ? PaymentDetails { get; set; }
    }

    public class Vehicle {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public int YearOfPurchase { get; set; }
        public string LicensePlate { get; set; }
        public string ? Description { get; set; }
        public Boolean IsAvailable { get; set; }
        public Boolean IsDamaged { get; set; }
        public double RentalPrice { get; set; }
        public string ? VehicleType { get; set; }
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

    public class DamageReport {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateOnly Date { get; set; }
        public string Description { get; set; }
        public string EmployeeId { get; set; }
        public CA_Employee Employee { get; set; }
        public string Status { get; set; }
    }

    public class RentalRequest {
        public int Id { get; set; }
        public int? VehicleId { get; set; }
        public string VehicleBrand { get; set; }
        public string VehicleType { get; set; }
        public string VehicleColor { get; set; }
        public string? BusinessRenterId { get; set; }
        public BusinessRenter BusinessRenter { get; set; }
        public string? PrivateRenterId { get; set; }
        public PrivateRenter PrivateRenter { get; set; }
        public string Intention { get; set; }
        public string FarthestDestination { get; set; }
        public int SuspectedKm { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public Vehicle? Vehicle { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; }
    }

    public class Subscription {
        public int Id { get; set; }
        public string Description { get; set; }
        public int MaxVehicle { get; set;  }
        public decimal Price { get; set; }

    }

    public class PayAsYouGo : Subscription {
        public int DiscountPercentage { get; set; }
        public string RentalDays { get; set; }
    }

    public class RentalPackage : Subscription {

    }

    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Adress { get; set; }
        public string KVK_number { get; set; }
        public int SubscriptionId { get; set; }
        public Subscription Subscription { get; set; }
        public int MaxVehiclesPerCompany { get; set; }
        public string? CompanyPhone { get; set; }
        public ICollection<RentalRequest> ActiveRentalRequests { get; set; } = new List<RentalRequest>();
    }
    public class PrivacyPolicyContent {
        public int Id { get; set; }
        public string Content { get; set; }
    }
}
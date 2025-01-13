namespace Project_WPR.Server.data.DTOs
{
    public class VehicleDTO
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public int YearOfPurchase { get; set; }
        public string LicensePlate { get; set; }
        public string Description { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsDamaged { get; set; }
        public double RentalPrice { get; set; }
        public string VehicleType { get; set; }
        public string? TransmissionType { get; set; }
        public string? RequiredLicenseType { get; set; }
    }
}

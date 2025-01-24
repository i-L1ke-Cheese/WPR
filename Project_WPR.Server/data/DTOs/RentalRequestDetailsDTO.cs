namespace Project_WPR.Server.data.DTOs
{
    public class RentalRequestDetailsDTO
    {
        public int Id { get; set; }
        public int? VehicleId { get; set; }
        public string VehicleBrand { get; set; }
        public string VehicleType { get; set; }
        public string VehicleColor { get; set; }
        public string Intention { get; set; }
        public string FarthestDestination { get; set; }
        public int SuspectedKm { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Status { get; set; }
        public string? PrivateRenterId { get; set; }
        public string? BusinessRenterId { get; set; }

    }
}

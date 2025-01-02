namespace Project_WPR.Server.data.DTOs
{
    public class CreateRentalRequestDTO
    {
        public string BusinessRenterId { get; set; }
        public int VehicleId { get; set; }
        public string Intention { get; set; }
        public string FarthestDestination { get; set; }
        public int SuspectedKm { get; set; }
    }
}

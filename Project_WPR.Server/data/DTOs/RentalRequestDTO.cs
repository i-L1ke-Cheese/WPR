namespace Project_WPR.Server.data.DTOs
{
    public class RentalRequestDTO
    {
        public int VehicleId { get; set; }
        public DateOnly startDate { get; set; }
        public DateOnly endDate { get; set; }
        public string intention { get; set; }
        public int suspectedKm { get; set; }
        public string FarthestDestination { get; set; }
    }
}

namespace Project_WPR.Server.data.DTOs
{
    public class DamageReportDTO
    {
        public int VehicleId { get; set; }
        public DateOnly Date { get; set; }
        public string Description { get; set; }
        public string EmployeeID { get; set; }
        public string Status { get; set; }
    }
}

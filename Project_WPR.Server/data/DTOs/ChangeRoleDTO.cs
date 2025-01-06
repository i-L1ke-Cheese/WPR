namespace Project_WPR.Server.data.DTOs
{
    public class ChangeRoleDTO
    {
        public string UserId { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public int LicenseNumber { get; set; }
        public string InvoiceAdress { get; set; }
        public int MaxVehiclesPerBusinessRenter { get; set; }
        public string PaymentDetails { get; set; }
        public int CompanyId { get; set; }
    }
}

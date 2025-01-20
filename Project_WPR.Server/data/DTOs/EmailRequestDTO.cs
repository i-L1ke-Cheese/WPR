namespace Project_WPR.Server.data.DTOs
{
    public class EmailRequestDTO
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string TemplateId { get; set; }
        public string TemplateData { get; set; }
    }
}

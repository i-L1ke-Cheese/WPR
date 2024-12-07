

using Project_WPR.Server.data;
using System.Text.Json.Serialization;

public class Program {
    public static void Main(String[] args) {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddDbContext<DatabaseContext>();
        builder.Services.AddAuthorization();
        builder.Services.AddControllers()
            .AddJsonOptions(option => option.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        builder.Services.AddDefaultIdentity<User>()
            .AddEntityFrameworkStores<DatabaseContext>();

        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.UseDefaultFiles();
        app.MapStaticAssets();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment()) {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapIdentityApi<User>();
        app.MapFallbackToFile("/index.html");

        app.Run();
    }
}
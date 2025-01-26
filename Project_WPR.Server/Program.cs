using Microsoft.EntityFrameworkCore;
using Project_WPR.Server.data;
using System.Text.Json.Serialization;

public class Program {
    public static void Main(String[] args) {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddDbContext<DatabaseContext>(options =>
            options.UseSqlServer("Server=database-carandall.clee44w6q7vn.eu-north-1.rds.amazonaws.com,1433;Database=database-carandall;User Id=admin;Password=AdminPassword123!;TrustServerCertificate=True;"));

        builder.Services.AddScoped<IDatabaseContext, DatabaseContext>();
        builder.Services.AddAuthorization();
        builder.Services.AddControllers()
            .AddJsonOptions(option => option.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

        builder.Services.AddIdentityApiEndpoints<User>()
            .AddEntityFrameworkStores<DatabaseContext>();

        builder.Services.AddSwaggerGen(options => {

        });

        builder.Services.AddCors(options => {
            options.AddPolicy("Allowvite",
               builder => builder
                   .WithOrigins("https://localhost:50327")
                   .AllowAnyMethod()
                   .AllowCredentials()
                   .AllowAnyHeader());
        });

        builder.Services.AddAuthentication();
        builder.Services.AddLogging();
        builder.Services.AddHttpClient(); // For mail

        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Apply pending migrations
        //using (var scope = app.Services.CreateScope()) {
        //    var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        //    dbContext.Database.Migrate();
        //}

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment()) {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("Allowvite");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.MapIdentityApi<User>();
        app.MapFallbackToFile("/index.html");

        // 1x runnen als de database leeg is
        //using (var scope = app.Services.CreateScope())
        //{
        //    var dbc = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        //    DataSeeder.Run(dbc);
        //}

        app.Run();
    }
}

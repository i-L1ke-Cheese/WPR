using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Reflection.Emit;

namespace Project_WPR.Server.data {
    public interface IDatabaseContext {
        DbSet<CA_Employee> CA_Employees { get; set; }
        DbSet<Car> Cars { get; set; }
        DbSet<Camper> Campers { get; set; }
        DbSet<Caravan> Caravans { get; set; }
        DbSet<Company> Companies { get; set; }
        DbSet<Subscription> Subscriptions { get; set; }
        DbSet<DamageReport> DamageReports { get; set; }
        DbSet<BusinessRenter> BusinessRenters { get; set; }
        DbSet<PrivateRenter> PrivateRenters { get; set; }
        DbSet<RentalRequest> RentalRequests { get; set; }
        DbSet<VehicleManager> vehicleManagers { get; set; }
        DbSet<PrivacyPolicyContent> PrivacyPolicyContent { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        EntityEntry Entry(object entity);
    }
    public class DatabaseContext : IdentityDbContext, IDatabaseContext {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options) {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder b) {
            b.UseSqlServer("Server=database-carandall.clee44w6q7vn.eu-north-1.rds.amazonaws.com,1433;Database=database-carandall;User Id=admin;Password=AdminPassword123!;TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder b) {
            base.OnModelCreating(b);

            b.Entity<DamageReport>()
                .HasOne(dr => dr.Employee)
                .WithMany(e => e.DamageReports)
                .HasForeignKey(dr => dr.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Subscription>()
                .Property(s => s.Price)
                .HasColumnType("decimal(18,2)");

            b.Entity<IdentityRole>(entity =>
            {
                entity.Property(e => e.Id).HasMaxLength(128);
            });

            b.Entity<RentalRequest>()
                .HasOne(rr => rr.Vehicle)
                .WithMany()
                .HasForeignKey(rr => rr.VehicleId)
                .OnDelete(DeleteBehavior.NoAction);

            b.Entity<RentalRequest>()
                .HasOne(rr => rr.BusinessRenter)
                .WithMany(br => br.ActiveRentalRequests)
                .HasForeignKey(rr => rr.BusinessRenterId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<RentalRequest>()
                .HasOne(rr => rr.PrivateRenter)
                .WithMany()
                .HasForeignKey(rr => rr.PrivateRenterId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<User>()
            .HasDiscriminator<string>("UserType")
            .HasValue<CA_Employee>("CA_Employee")
            .HasValue<CompanyAccount>("CompanyAccount")
            .HasValue<PrivateRenter>("PrivateRenter");
        }

        public DbSet<CA_Employee> CA_Employees { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Camper> Campers { get; set; }
        public DbSet<Caravan> Caravans { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<DamageReport> DamageReports { get; set; }
        public DbSet<BusinessRenter> BusinessRenters { get; set; }
        public DbSet<CompanyAdmin> CompanyAdmin { get; set; }
        public DbSet<PrivateRenter> PrivateRenters { get; set; }
        public DbSet<RentalRequest> RentalRequests { get; set; }
        public DbSet<VehicleManager> vehicleManagers { get; set; }
        public DbSet<PrivacyPolicyContent> PrivacyPolicyContent { get; set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) {
            return base.SaveChangesAsync(cancellationToken);
        }

        public EntityEntry Entry(object entity) {
            return base.Entry(entity);
        }
    }
}

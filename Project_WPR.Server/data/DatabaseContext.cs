using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Project_WPR.Server.data {
    public interface IDatabaseContext
    {
        DbSet<CA_Employee> CA_Employees { get; set; }
        DbSet<Car> Cars { get; set; }
        DbSet<Camper> Campers { get; set; }
        DbSet<Caravan> Caravans { get; set; }
        DbSet<Company> Companies { get; set; }
        DbSet<Subscription> Subscriptions { get; set; }
        DbSet<VehiclePicture> VehiclePictures { get; set; }
        DbSet<DamageReport> DamageReports { get; set; }
        DbSet<DamageReportPicture> DamageReportPictures { get; set; }
        DbSet<BusinessRenter> BusinessRenters { get; set; }
        DbSet<PrivateRenter> PrivateRenters { get; set; }
        DbSet<RentalRequest> RentalRequests { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    }

    public class DatabaseContext : IdentityDbContext, IDatabaseContext {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder b) {
            b.UseSqlite("Data Source=database.db");
        }

        protected override void OnModelCreating(ModelBuilder b) { 
            base.OnModelCreating(b);

            b.Entity<Company>()
                .HasOne(c => c.Subscription)
                .WithOne(s => s.Company)
                .HasForeignKey<Company>(c => c.SubscriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Entity<VehiclePicture>()
                .HasOne(vp => vp.Vehicle)
                .WithMany(v => v.Pictures)
                .HasForeignKey(vp => vp.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            b.Entity<DamageReport>()
                .HasOne(dr => dr.Employee)
                .WithMany(e => e.DamageReports)
                .HasForeignKey(dr => dr.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<RentalRequest>()
                .HasOne(rr => rr.Vehicle)
                .WithMany()
                .HasForeignKey(rr => rr.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<RentalRequest>()
                .HasOne(rr => rr.BusinessRenter)
                .WithMany()
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
        public DbSet<VehiclePicture> VehiclePictures { get; set; }
        public DbSet<DamageReport> DamageReports { get; set; }
        public DbSet<DamageReportPicture> DamageReportPictures { get; set; }
        public DbSet<BusinessRenter> BusinessRenters { get; set; }
        public DbSet<PrivateRenter> PrivateRenters { get; set; }
        public DbSet<RentalRequest> RentalRequests { get; set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }

    }

}

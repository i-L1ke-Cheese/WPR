using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Project_WPR.Server.data {
    public class DatabaseContext : IdentityDbContext {
        protected override void OnConfiguring(DbContextOptionsBuilder b) {
            b.UseSqlite("Data Source=database.db");
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Camper> Campers { get; set; }
        public DbSet<Caravan> Caravans { get; set; }
    }

}

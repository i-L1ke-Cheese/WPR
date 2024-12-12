using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_WPR.Server.Migrations
{
    /// <inheritdoc />
    public partial class voertuigTypeToevoegen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VehicleType",
                table: "Vehicle",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VehicleType",
                table: "Vehicle");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_WPR.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrivateRenter_Address",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivateRenter_LicenseNumber",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivateRenter_Place",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "LicenseNumber",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "LicenseNumber",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateRenter_Address",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrivateRenter_LicenseNumber",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateRenter_Place",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);
        }
    }
}

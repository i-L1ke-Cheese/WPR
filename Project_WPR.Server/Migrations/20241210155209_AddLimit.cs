using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_WPR.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BusinessRenterId1",
                table: "RentalRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "RentalRequests",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxVehiclesPerCompany",
                table: "Companies",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxVehiclesPerBusinessRenter",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RentalRequests_BusinessRenterId1",
                table: "RentalRequests",
                column: "BusinessRenterId1");

            migrationBuilder.CreateIndex(
                name: "IX_RentalRequests_CompanyId",
                table: "RentalRequests",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalRequests_AspNetUsers_BusinessRenterId1",
                table: "RentalRequests",
                column: "BusinessRenterId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalRequests_Companies_CompanyId",
                table: "RentalRequests",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalRequests_AspNetUsers_BusinessRenterId1",
                table: "RentalRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_RentalRequests_Companies_CompanyId",
                table: "RentalRequests");

            migrationBuilder.DropIndex(
                name: "IX_RentalRequests_BusinessRenterId1",
                table: "RentalRequests");

            migrationBuilder.DropIndex(
                name: "IX_RentalRequests_CompanyId",
                table: "RentalRequests");

            migrationBuilder.DropColumn(
                name: "BusinessRenterId1",
                table: "RentalRequests");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "RentalRequests");

            migrationBuilder.DropColumn(
                name: "MaxVehiclesPerCompany",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "MaxVehiclesPerBusinessRenter",
                table: "AspNetUsers");
        }
    }
}

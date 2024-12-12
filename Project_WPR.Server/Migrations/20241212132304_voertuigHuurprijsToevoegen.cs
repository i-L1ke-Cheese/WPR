using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_WPR.Server.Migrations
{
    /// <inheritdoc />
    public partial class voertuigHuurprijsToevoegen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentalPrice",
                table: "Vehicle",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "RentalRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "RentalRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentalPrice",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "RentalRequests");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "RentalRequests");
        }
    }
}

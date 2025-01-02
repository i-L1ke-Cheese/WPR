using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project_WPR.Server.Migrations
{
    /// <inheritdoc />
    public partial class placeToevoegen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Place",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateRenter_Place",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Place",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PrivateRenter_Place",
                table: "AspNetUsers");
        }
    }
}

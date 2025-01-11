using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperCheck.Migrations
{
    /// <inheritdoc />
    public partial class Adding_Ordem_To_Items : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "TemplateItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "ChecklistItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "TemplateItems");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "ChecklistItems");
        }
    }
}

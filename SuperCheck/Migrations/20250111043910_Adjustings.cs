using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperCheck.Migrations
{
    /// <inheritdoc />
    public partial class Adjustings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Observacao",
                table: "Checklists",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<string>(
                name: "ObservacaoReprovacao",
                table: "Checklists",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SupervisorId",
                table: "Checklists",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Checklists_SupervisorId",
                table: "Checklists",
                column: "SupervisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checklists_Usuarios_SupervisorId",
                table: "Checklists",
                column: "SupervisorId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checklists_Usuarios_SupervisorId",
                table: "Checklists");

            migrationBuilder.DropIndex(
                name: "IX_Checklists_SupervisorId",
                table: "Checklists");

            migrationBuilder.DropColumn(
                name: "ObservacaoReprovacao",
                table: "Checklists");

            migrationBuilder.DropColumn(
                name: "SupervisorId",
                table: "Checklists");

            migrationBuilder.AlterColumn<string>(
                name: "Observacao",
                table: "Checklists",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }
    }
}

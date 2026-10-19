using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockShoppingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_Stock_TB_Product_ProductId",
                table: "TB_Stock");

            migrationBuilder.DropIndex(
                name: "IX_TB_Stock_ProductId",
                table: "TB_Stock");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "TB_Stock");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TB_Product",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "TB_Product",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "StockId",
                table: "TB_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TB_Product_StockId",
                table: "TB_Product",
                column: "StockId");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_Product_TB_Stock_StockId",
                table: "TB_Product",
                column: "StockId",
                principalTable: "TB_Stock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_Product_TB_Stock_StockId",
                table: "TB_Product");

            migrationBuilder.DropIndex(
                name: "IX_TB_Product_StockId",
                table: "TB_Product");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TB_Product");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "TB_Product");

            migrationBuilder.DropColumn(
                name: "StockId",
                table: "TB_Product");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "TB_Stock",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TB_Stock_ProductId",
                table: "TB_Stock",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_Stock_TB_Product_ProductId",
                table: "TB_Stock",
                column: "ProductId",
                principalTable: "TB_Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

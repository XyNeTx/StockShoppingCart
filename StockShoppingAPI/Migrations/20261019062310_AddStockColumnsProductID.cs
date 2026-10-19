using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockShoppingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddStockColumnsProductID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "TB_Stock",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "TB_Stock");
        }
    }
}

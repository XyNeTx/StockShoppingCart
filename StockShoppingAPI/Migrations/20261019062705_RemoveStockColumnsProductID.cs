using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockShoppingAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStockColumnsProductID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "TB_Stock");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "TB_Stock",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

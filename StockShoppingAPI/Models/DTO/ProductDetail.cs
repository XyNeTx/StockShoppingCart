namespace StockShoppingAPI.Models.DTO;

public record ProductDetail(int Id, string Name, decimal Price, string Description, string ImageUrl, int StockQuantity);

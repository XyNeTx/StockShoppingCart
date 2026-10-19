namespace StockShoppingAPI.Models.DTO;

public record ShoppingCartDTO(
    int ProductId,
    string ProductName,
    decimal ProductPrice,
    int Quantity,
    string ProductImageUrl,
    int StockQuantity
);

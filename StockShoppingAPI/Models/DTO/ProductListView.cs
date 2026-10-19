using System;

namespace StockShoppingAPI.Models.DTO;

public record ProductListView(int Id, string Name, decimal Price, string Description, string ImageUrl);

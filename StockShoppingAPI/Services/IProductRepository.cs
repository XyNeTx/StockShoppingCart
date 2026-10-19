using System;
using StockShoppingAPI.Models.DTO;
using StockShoppingAPI.Repositories;

namespace StockShoppingAPI.Services;

public interface IProductRepository
{
    Task<List<ProductListView>> GetAllProducts();
    Task<ProductDetail?> GetProductById(int id);
}

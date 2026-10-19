using System;
using Microsoft.EntityFrameworkCore;
using StockShoppingAPI.Data;
using StockShoppingAPI.Models.DTO;
using StockShoppingAPI.Models.Entity;
using StockShoppingAPI.Services;

namespace StockShoppingAPI.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductListView>> GetAllProducts()
    {
        Console.WriteLine("Fetching all products from the database...");
        return await _context.Products.Select(p => new ProductListView(p.Id, p.Name, p.Price,p.Description,p.ImageUrl)).ToListAsync();
    }

    public async Task<ProductDetail?> GetProductById(int id)
    {
        var product = await _context.Products
            .Include(p => p.Stock)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
        {
            return null;
        }

        return new ProductDetail(product.Id, product.Name, product.Price, product.Description, product.ImageUrl, product.Stock.Quantity);
    }
}

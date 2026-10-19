using System;
using Microsoft.EntityFrameworkCore;
using StockShoppingAPI.Models.Entity;

namespace StockShoppingAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TB_Product> Products { get; set; }
    public DbSet<TB_Cart> Carts { get; set; }
    public DbSet<TB_Stock> Stocks { get; set; }
}

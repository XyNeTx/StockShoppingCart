using System;
using Microsoft.EntityFrameworkCore;
using StockShoppingAPI.Data;
using StockShoppingAPI.Models.DTO;
using StockShoppingAPI.Models.Entity;
using StockShoppingAPI.Services;

namespace StockShoppingAPI.Repositories;

public class CartRepository : ICartRepository
{
    // ยังไม่มีระบบ login จึงใช้ user "guest" ไปก่อน
    private const string UserId = "guest";

    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddToCart(int productId, int quantity)
    {
        var product = await _context.Products.Include(p => p.Stock).FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new ArgumentException("ไม่พบสินค้า");
        }

        var cartItem = await _context.Carts.FirstOrDefaultAsync(c => c.ProductId == productId && c.UserId == UserId);
        var inCart = cartItem?.Quantity ?? 0;
        var newQuantity = inCart + quantity;
        if (newQuantity > product.Stock.Quantity)
        {
            throw new InvalidOperationException(inCart > 0
                ? $"สินค้า \"{product.Name}\" มีในสต็อก {product.Stock.Quantity} ชิ้น และอยู่ในตะกร้าแล้ว {inCart} ชิ้น เพิ่มได้อีกไม่เกิน {Math.Max(product.Stock.Quantity - inCart, 0)} ชิ้น"
                : $"สินค้า \"{product.Name}\" มีในสต็อกเพียง {product.Stock.Quantity} ชิ้น");
        }

        var now = DateTime.Now;
        if (cartItem != null)
        {
            cartItem.Quantity = newQuantity;
            cartItem.UpdatedAt = now;
        }
        else
        {
            _context.Carts.Add(new TB_Cart
            {
                ProductId = productId,
                Quantity = quantity,
                UserId = UserId,
                CreatedAt = now,
                UpdatedAt = now
            });
        }
        await _context.SaveChangesAsync();
    }

    public async Task<List<ShoppingCartDTO>> GetCartItems()
    {
        var cartItems = await _context.Carts
            .Include(c => c.Product)
            .ThenInclude(p => p.Stock)
            .Where(c => c.UserId == UserId)
            .ToListAsync();

        return cartItems.Select(c => new ShoppingCartDTO(c.ProductId, c.Product.Name, c.Product.Price, c.Quantity, c.Product.ImageUrl, c.Product.Stock.Quantity)).ToList();
    }

    public async Task UpdateQuantity(int productId, int quantity)
    {
        var cartItem = await _context.Carts
            .Include(c => c.Product)
            .ThenInclude(p => p.Stock)
            .FirstOrDefaultAsync(c => c.ProductId == productId && c.UserId == UserId);
        if (cartItem == null)
        {
            throw new ArgumentException("ไม่พบสินค้านี้ในตะกร้า");
        }

        if (quantity <= 0)
        {
            _context.Carts.Remove(cartItem);
        }
        else
        {
            EnsureInStock(cartItem.Product, quantity);
            cartItem.Quantity = quantity;
            cartItem.UpdatedAt = DateTime.Now;
        }
        await _context.SaveChangesAsync();
    }

    public async Task RemoveItem(int productId)
    {
        var cartItem = await _context.Carts.FirstOrDefaultAsync(c => c.ProductId == productId && c.UserId == UserId);
        if (cartItem == null)
        {
            throw new ArgumentException("ไม่พบสินค้านี้ในตะกร้า");
        }

        _context.Carts.Remove(cartItem);
        await _context.SaveChangesAsync();
    }

    public async Task ClearCart()
    {
        await _context.Carts.Where(c => c.UserId == UserId).ExecuteDeleteAsync();
    }

    public async Task CheckOut()
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var cartItems = await _context.Carts
            .Include(c => c.Product)
            .ThenInclude(p => p.Stock)
            .Where(c => c.UserId == UserId)
            .ToListAsync();
        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("ไม่มีสินค้าในตะกร้า");
        }

        // ตัด stock ตามจำนวนในตะกร้า แล้วล้างตะกร้า ถ้ามีรายการไหนสต็อกไม่พอจะไม่ตัดเลยสักรายการ
        var now = DateTime.Now;
        foreach (var item in cartItems)
        {
            EnsureInStock(item.Product, item.Quantity);
            item.Product.Stock.Quantity -= item.Quantity;
            item.Product.Stock.LastUpdated = now;
        }
        _context.Carts.RemoveRange(cartItems);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    private static void EnsureInStock(TB_Product product, int quantity)
    {
        if (quantity > product.Stock.Quantity)
        {
            throw new InvalidOperationException($"สินค้า \"{product.Name}\" มีในสต็อกเพียง {product.Stock.Quantity} ชิ้น");
        }
    }
}

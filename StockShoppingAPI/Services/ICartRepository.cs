using System;
using StockShoppingAPI.Models.DTO;

namespace StockShoppingAPI.Services;

public interface ICartRepository
{
    Task AddToCart(int productId, int quantity);
    Task<List<ShoppingCartDTO>> GetCartItems();
    Task UpdateQuantity(int productId, int quantity);
    Task RemoveItem(int productId);
    Task ClearCart();
    Task CheckOut();
}

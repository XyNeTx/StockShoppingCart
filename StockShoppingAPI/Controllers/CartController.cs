using Microsoft.AspNetCore.Mvc;
using StockShoppingAPI.Models.DTO;
using StockShoppingAPI.Services;

namespace StockShoppingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;

        public CartController(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddCartRequest request)
        {
            try
            {
                await _cartRepository.AddToCart(request.ProductId, request.Quantity);
                return Ok(new { message = "Product added to cart successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCartItems()
        {
            var cartItems = await _cartRepository.GetCartItems();
            return Ok(cartItems);
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateQuantity([FromRoute] int productId, [FromBody] UpdateCartRequest request)
        {
            try
            {
                await _cartRepository.UpdateQuantity(productId, request.Quantity);
                return Ok(new { message = "Cart updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveItem([FromRoute] int productId)
        {
            try
            {
                await _cartRepository.RemoveItem(productId);
                return Ok(new { message = "Item removed from cart." });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            await _cartRepository.ClearCart();
            return Ok(new { message = "Cart cleared." });
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut()
        {
            try
            {
                await _cartRepository.CheckOut();
                return Ok(new { message = "Checkout completed." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

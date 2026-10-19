// API ของตะกร้าสินค้า (app/cart และปุ่ม AddToCartButton)
import { request } from "./client";

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  productImageUrl: string | null;
  stockQuantity: number;
}

// GET /api/Cart
export function getCartItems() {
  return request<CartItem[]>("/api/Cart");
}

// POST /api/Cart
export function addToCart(productId: number, quantity = 1) {
  return request<void>("/api/Cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

// PUT /api/Cart/{productId} — ตั้งจำนวนใหม่ (ไม่เกินสต็อก)
export function updateCartQuantity(productId: number, quantity: number) {
  return request<void>(`/api/Cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

// DELETE /api/Cart/{productId} — ลบสินค้าออกจากตะกร้า
export function removeCartItem(productId: number) {
  return request<void>(`/api/Cart/${productId}`, { method: "DELETE" });
}

// DELETE /api/Cart — ล้างตะกร้าทั้งหมด
export function clearCart() {
  return request<void>("/api/Cart", { method: "DELETE" });
}

// POST /api/Cart/checkout — สั่งซื้อ ตัดสต็อกและล้างตะกร้า
export function checkOut() {
  return request<void>("/api/Cart/checkout", { method: "POST" });
}

// API ของหน้ารายละเอียดสินค้า (app/products/[slug]/page.tsx)
import { ApiError, request } from "./client";

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  stockQuantity: number;
}

// GET /api/Product/{id} — คืน null เมื่อไม่พบสินค้า (404)
export async function getProductById(slug: string) {
  try {
    return await request<ProductDetail>(
      `/api/Product/${encodeURIComponent(slug)}`,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

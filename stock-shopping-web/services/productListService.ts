// API ของหน้ารวมสินค้า (app/page.tsx)
import { request } from "./client";

export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
}

// GET /api/Product
export function getProducts() {
  return request<ProductListItem[]>("/api/Product");
}

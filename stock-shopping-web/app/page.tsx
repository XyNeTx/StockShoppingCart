import Link from "next/link";
import { Suspense } from "react";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import {
  getProducts,
  type ProductListItem,
} from "@/services/productListService";

export default function Home() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        สินค้าทั้งหมด
      </h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </>
  );
}

async function ProductGrid() {
  let products: ProductListItem[];
  try {
    products = await getProducts();
  } catch {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        ไม่สามารถโหลดรายการสินค้าได้ กรุณาตรวจสอบว่า .NET API รันอยู่
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="text-zinc-500">ยังไม่มีสินค้า</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="aspect-square overflow-hidden">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              className="size-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h2 className="font-semibold">{product.name}</h2>
            {product.description && (
              <p className="line-clamp-2 text-sm text-zinc-500">
                {product.description}
              </p>
            )}
            <p className="mt-auto pt-2 text-lg font-semibold">
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="aspect-square animate-pulse bg-zinc-100 dark:bg-zinc-900" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
      ))}
    </div>
  );
}

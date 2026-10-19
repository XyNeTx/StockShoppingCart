import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { getProductById } from "@/services/productDetailService";
import { formatPrice } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductById(slug);
  if (!product) notFound();

  const inStock = product.stockQuantity > 0;

  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-zinc-500 hover:underline"
      >
        ← กลับไปหน้าสินค้า
      </Link>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="size-full"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                inStock
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {inStock ? `มีสินค้า ${product.stockQuantity} ชิ้น` : "สินค้าหมด"}
            </span>
          </div>

          <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          )}

          <AddToCartButton
            productId={product.id}
            stockQuantity={product.stockQuantity}
          />
        </div>
      </div>
    </>
  );
}

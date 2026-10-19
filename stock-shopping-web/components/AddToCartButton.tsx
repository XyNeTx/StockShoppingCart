"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart, getCartItems } from "@/services/cartService";

type Status = "idle" | "loading" | "added" | "error";

export function AddToCartButton({
  productId,
  stockQuantity,
}: {
  productId: number;
  stockQuantity: number;
}) {
  // จำนวนสินค้านี้ที่อยู่ในตะกร้าแล้ว (null = กำลังโหลด)
  const [inCart, setInCart] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    getCartItems()
      .then((items) =>
        setInCart(items.find((i) => i.productId === productId)?.quantity ?? 0),
      )
      // โหลดตะกร้าไม่ได้ก็ยังให้เลือกได้ ฝั่ง API จะเช็กสต็อกให้อีกชั้น
      .catch(() => setInCart(0));
  }, [productId]);

  // เลือกได้ไม่เกิน สต็อก - จำนวนในตะกร้า
  const available = Math.max(stockQuantity - (inCart ?? 0), 0);
  const outOfStock = stockQuantity <= 0;
  const cartFull = !outOfStock && available <= 0;

  function changeQuantity(value: number) {
    if (Number.isNaN(value)) return;
    setQuantity(Math.min(Math.max(Math.trunc(value), 1), Math.max(available, 1)));
  }

  async function handleClick() {
    setStatus("loading");
    try {
      await addToCart(productId, quantity);
      const nextInCart = (inCart ?? 0) + quantity;
      setInCart(nextInCart);
      setQuantity((q) => Math.min(q, Math.max(stockQuantity - nextInCart, 1)));
      setStatus("added");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setStatus("error");
    }
  }

  const stepButton =
    "size-10 rounded-lg border border-zinc-300 text-lg hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-900";

  return (
    <div className="space-y-3">
      {inCart !== null && inCart > 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          มีในตะกร้าแล้ว {inCart} ชิ้น ·{" "}
          <Link href="/cart" className="font-medium underline">
            ไปที่ตะกร้า
          </Link>
        </p>
      )}
      {!outOfStock && !cartFull && (
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="quantity" className="text-sm text-zinc-500">
            จำนวน
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="ลดจำนวน"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className={stepButton}
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={1}
              max={available}
              value={quantity}
              onChange={(e) => changeQuantity(e.target.valueAsNumber)}
              className="h-10 w-16 rounded-lg border border-zinc-300 bg-white text-center text-sm text-zinc-900 [appearance:textfield] focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="เพิ่มจำนวน"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={quantity >= available}
              className={stepButton}
            >
              +
            </button>
          </div>
          <span className="text-sm text-zinc-500">
            เลือกได้อีก {available} ชิ้น
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={
          outOfStock || cartFull || inCart === null || status === "loading"
        }
        className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {outOfStock
          ? "สินค้าหมด"
          : cartFull
            ? "มีในตะกร้าครบจำนวนสต็อกแล้ว"
            : status === "loading"
              ? "กำลังเพิ่ม..."
              : "เพิ่มลงตะกร้า"}
      </button>
      {status === "added" && (
        <p className="text-sm text-green-600 dark:text-green-400">
          เพิ่มลงตะกร้าแล้ว
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

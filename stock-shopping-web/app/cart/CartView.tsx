"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/Navbar";
import { ProductImage } from "@/components/ProductImage";
import {
  checkOut,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
} from "@/services/cartService";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    getCartItems()
      .then(setItems)
      .catch(() => setLoadError(true));
  }, []);

  // อัปเดตหน้าจอทันทีโดยไม่ต้อง get cart ใหม่ ถ้า API error ค่อยคืนค่าเดิม
  async function update(next: CartItem[], action: () => Promise<void>) {
    const previous = items;
    setItems(next);
    setActionError("");
    try {
      await action();
    } catch (err) {
      setItems(previous);
      setActionError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }

  function changeQuantity(item: CartItem, quantity: number) {
    if (!items) return;
    const clamped = Math.min(Math.max(quantity, 0), item.stockQuantity);
    if (clamped === item.quantity) return;
    const next =
      clamped === 0
        ? items.filter((i) => i.productId !== item.productId)
        : items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: clamped } : i,
          );
    update(next, () => updateCartQuantity(item.productId, clamped));
  }

  function removeItem(item: CartItem) {
    if (!items) return;
    update(
      items.filter((i) => i.productId !== item.productId),
      () => removeCartItem(item.productId),
    );
  }

  function handleClear() {
    if (!confirm("ต้องการล้างสินค้าทั้งหมดออกจากตะกร้าใช่ไหม?")) return;
    update([], clearCart);
  }

  async function handleCheckOut() {
    setBusy(true);
    setActionError("");
    try {
      await checkOut();
      setItems([]);
      setCheckedOut(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setBusy(false);
    }
  }

  if (loadError) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        ไม่สามารถโหลดตะกร้าสินค้าได้
      </p>
    );
  }

  if (!items) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  if (checkedOut) {
    return (
      <div className="py-16 text-center">
        <p className="mb-2 text-xl font-semibold text-green-600 dark:text-green-400">
          สั่งซื้อสำเร็จ
        </p>
        <p className="mb-6 text-zinc-500">ขอบคุณที่ใช้บริการ</p>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
        >
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <CartIcon className="mx-auto mb-4 size-12 text-zinc-400" />
        <p className="mb-6 text-zinc-500">ยังไม่มีสินค้าในตะกร้า</p>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
        >
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0);
  const stepButton =
    "size-8 rounded-md border border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-900";

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={busy}
          className="text-sm text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
        >
          ล้างตะกร้าทั้งหมด
        </button>
      </div>

      {actionError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {actionError}
        </p>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <Link
              href={`/products/${item.productId}`}
              className="size-20 shrink-0 overflow-hidden rounded-md"
            >
              <ProductImage
                src={item.productImageUrl}
                alt={item.productName}
                className="size-full text-xs"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.productId}`}
                className="font-medium hover:underline"
              >
                {item.productName}
              </Link>
              <p className="text-sm text-zinc-500">
                {formatPrice(item.productPrice)} · คงเหลือ {item.stockQuantity} ชิ้น
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`ลดจำนวน ${item.productName}`}
                  onClick={() => changeQuantity(item, item.quantity - 1)}
                  disabled={busy}
                  className={stepButton}
                >
                  −
                </button>
                {/* key ผูกกับ quantity เพื่อให้ช่องกรอกรีเซ็ตเมื่อจำนวนเปลี่ยนจากปุ่ม − / + */}
                <QuantityInput
                  key={item.quantity}
                  label={`จำนวน ${item.productName}`}
                  quantity={item.quantity}
                  max={item.stockQuantity}
                  disabled={busy}
                  onCommit={(value) => changeQuantity(item, value)}
                />
                <button
                  type="button"
                  aria-label={`เพิ่มจำนวน ${item.productName}`}
                  onClick={() => changeQuantity(item, item.quantity + 1)}
                  disabled={busy || item.quantity >= item.stockQuantity}
                  className={stepButton}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-semibold">
                {formatPrice(item.productPrice * item.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item)}
                disabled={busy}
                className="text-sm text-zinc-500 hover:text-red-600 hover:underline disabled:opacity-50"
              >
                ลบ
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex justify-between text-lg font-semibold">
          <span>รวมทั้งหมด</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button
          type="button"
          onClick={handleCheckOut}
          disabled={busy}
          className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? "กำลังดำเนินการ..." : "สั่งซื้อสินค้า"}
        </button>
      </div>
    </>
  );
}

// พิมพ์ได้อิสระ แล้วค่อยบันทึกตอนกด Enter หรือออกจากช่อง (เกินสต็อกจะถูกปรับเป็นค่าสูงสุด)
function QuantityInput({
  label,
  quantity,
  max,
  disabled,
  onCommit,
}: {
  label: string;
  quantity: number;
  max: number;
  disabled?: boolean;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(quantity));

  function commit() {
    const value = Number.parseInt(draft, 10);
    if (Number.isNaN(value) || value < 1) {
      setDraft(String(quantity));
      return;
    }
    const clamped = Math.min(value, max);
    setDraft(String(clamped));
    onCommit(clamped);
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      aria-label={label}
      min={1}
      max={max}
      value={draft}
      disabled={disabled}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className="h-8 w-14 rounded-md border border-zinc-300 bg-white text-center text-sm tabular-nums text-zinc-900 [appearance:textfield] focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

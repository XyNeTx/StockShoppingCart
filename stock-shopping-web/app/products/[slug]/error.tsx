"use client";

import Link from "next/link";

export default function ProductError({ retry }: { retry: () => void }) {
  return (
    <div className="py-24 text-center">
      <h1 className="mb-2 text-2xl font-semibold">โหลดข้อมูลสินค้าไม่สำเร็จ</h1>
      <p className="mb-6 text-zinc-500">
        เกิดข้อผิดพลาดจากฝั่ง API กรุณาลองใหม่อีกครั้ง
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
        >
          ลองใหม่
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          กลับไปหน้าสินค้า
        </Link>
      </div>
    </div>
  );
}

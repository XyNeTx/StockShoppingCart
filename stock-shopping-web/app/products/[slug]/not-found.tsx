import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="mb-2 text-2xl font-semibold">ไม่พบสินค้า</h1>
      <p className="mb-6 text-zinc-500">สินค้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
      <Link
        href="/"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        กลับไปหน้าสินค้า
      </Link>
    </div>
  );
}

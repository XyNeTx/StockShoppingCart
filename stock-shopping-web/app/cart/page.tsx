import { CartView } from "./CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        ตะกร้าสินค้า
      </h1>
      <CartView />
    </div>
  );
}

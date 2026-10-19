const formatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

export function formatPrice(price: number) {
  return formatter.format(price);
}

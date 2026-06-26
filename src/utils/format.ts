export function formatPrice(n: number | null | undefined) {
  return `${new Intl.NumberFormat("fa-IR").format(n ?? 0)} تومان`;
}

export function formatNumber(num: number) {
  if (!num) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
}
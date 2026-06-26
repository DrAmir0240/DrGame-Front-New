export function formatPrice(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n || 0);
}
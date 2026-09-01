export function formatPrice(price: number): string {
  if (price === 0) return "Gratis";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}
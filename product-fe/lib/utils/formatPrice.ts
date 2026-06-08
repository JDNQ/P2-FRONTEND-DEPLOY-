export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}tr`
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}k`
  return `${price}đ`
}

export function calcDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

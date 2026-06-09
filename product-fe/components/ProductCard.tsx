'use client'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import type { Product } from '@/lib/types/product'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'flash-sale'
  badge?: string
  soldCount?: number
  remainCount?: number
  onAddToCart?: (e: React.MouseEvent) => void
  onAddToWishlist?: (e: React.MouseEvent) => void
  onQuickView?: (e: React.MouseEvent) => void
}

export default function ProductCard({
  product,
  variant = 'default',
  badge,
  soldCount,
  remainCount,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ProductCardProps) {
  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice
  const discount = maxPrice > minPrice ? Math.round((1 - minPrice / maxPrice) * 100) : 0
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
  const barPercent = Math.min(totalStock * 2, 90)

  if (variant === 'flash-sale') {
    return (
      <div className="card-elevated p-3 relative overflow-hidden group">
        {discount > 0 && (
          <div className="absolute top-2 left-2 flash-sale-gradient text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
            -{discount}%
          </div>
        )}
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-surface-container-low">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.productName}
                title={product.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-5xl">image</span>
              </div>
            )}
          </div>
        </Link>
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-body text-body-md text-on-surface-variant line-clamp-1 hover:text-primary transition-colors">
              {product.productName}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="font-sora font-bold text-price-display text-flash-sale">{formatPrice(minPrice)}</span>
            {discount > 0 && (
              <span className="text-outline text-caption line-through">{formatPrice(maxPrice)}</span>
            )}
          </div>
          {(soldCount !== undefined || remainCount !== undefined) && (
            <div className="pt-1">
              <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
                {soldCount !== undefined && <span className="text-brand-orange">Đã bán {soldCount}</span>}
                {remainCount !== undefined && <span className="text-on-surface-variant">Còn lại {remainCount}</span>}
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full orange-gradient" style={{ width: `${barPercent}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card-elevated overflow-hidden group cursor-pointer">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          {badge && (
            <div className="absolute top-2 left-2 bg-primary-50 text-primary text-[10px] font-bold px-2 py-1 rounded-full z-10">
              {badge}
            </div>
          )}
          {product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.productName}
              title={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline bg-surface-container-low">
              <span className="material-symbols-outlined text-5xl">image</span>
            </div>
          )}
          {(onAddToWishlist || onQuickView) && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              {onAddToWishlist && (
                <button
                  className="bg-white text-on-surface h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-md"
                  onClick={onAddToWishlist}
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              )}
              {onQuickView && (
                <button
                  className="bg-white text-on-surface h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-md"
                  onClick={onQuickView}
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-body text-label-md text-on-surface line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
            {product.productName}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="font-sora font-bold text-headline-sm text-on-surface">{formatPrice(minPrice)}</span>
          {onAddToCart && (
            <button
              className="text-on-surface-variant hover:text-primary p-2 transition-colors"
              onClick={onAddToCart}
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

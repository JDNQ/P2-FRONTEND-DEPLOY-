'use client'
import { useProduct } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice, calcDiscount } from '@/lib/utils/formatPrice'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const productId = parseInt(params.id)
  const { data: product, isLoading } = useProduct(productId)
  const { mutate: addToCart, isPending } = useAddToCart()

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImgIdx, setMainImgIdx] = useState(0)

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId) || null
  const currentPrice = selectedVariant
    ? product!.basePrice + selectedVariant.extraPrice
    : product?.basePrice || 0
  const currentStock = selectedVariant?.stock ?? 0

  const handleAddToCart = () => {
    if (!isAuthenticated) { router.push('/login'); return }
    if (!selectedVariantId) { toast.error('Vui lòng chọn phân loại'); return }
    addToCart({ productId, variantId: selectedVariantId, quantity })
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) { router.push('/login'); return }
    if (!selectedVariantId) { toast.error('Vui lòng chọn phân loại'); return }
    addToCart({ productId, variantId: selectedVariantId, quantity })
    router.push('/cart')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page">
        <div className="max-w-[1280px] mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="aspect-square bg-neutral-200 rounded-xl mb-4" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="w-20 h-20 bg-neutral-200 rounded-lg" />)}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-3/4" />
              <div className="h-6 bg-neutral-200 rounded w-1/4" />
              <div className="h-16 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded w-1/2" />
              <div className="h-12 bg-neutral-200 rounded w-1/3" />
              <div className="h-14 bg-neutral-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-m3-outline-variant">search_off</span>
          <h1 className="text-2xl font-bold text-m3-on-surface">Sản phẩm không tìm thấy</h1>
          <Link href="/products" className="text-m3-primary hover:underline font-semibold inline-block">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs text-m3-on-surface-variant">
          <Link href="/" className="hover:text-m3-primary transition-all">Trang chủ</Link>
          <span className="material-symbols-outlined text-[14px] text-m3-outline-variant">chevron_right</span>
          <Link href="/products" className="hover:text-m3-primary transition-all">Sản phẩm</Link>
          <span className="material-symbols-outlined text-[14px] text-m3-outline-variant">chevron_right</span>
          <span className="text-m3-on-surface font-semibold">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm aspect-square flex items-center justify-center relative group">
              {product.images[mainImgIdx] ? (
                <img
                  src={product.images[mainImgIdx].url}
                  alt={product.productName}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=Product' }}
                />
              ) : (
                <div className="flex items-center justify-center text-m3-outline">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  className={`min-w-[80px] h-20 bg-white rounded-lg border-2 overflow-hidden shadow-sm ${
                    idx === mainImgIdx ? 'border-m3-primary' : 'border-transparent hover:border-m3-outline-variant'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=.' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-m3-on-background mb-2">
                {product.productName}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {i < 4 ? 'star' : 'star'}
                    </span>
                  ))}
                  <span className="text-m3-on-surface-variant text-sm ml-1">(128 đánh giá)</span>
                </div>
                <div className="h-4 w-px bg-m3-outline-variant" />
                <div className="flex items-center gap-1 text-success font-semibold text-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {currentStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-m3-primary-fixed/30 p-4 rounded-xl">
              <span className="text-3xl font-bold text-m3-primary-container block">
                {formatPrice(currentPrice)}
              </span>
              {selectedVariant && selectedVariant.extraPrice > 0 && (
                <>
                  <span className="text-m3-on-surface-variant line-through text-sm">
                    {formatPrice(product.basePrice)}
                  </span>
                  <span className="ml-2 bg-flash-sale text-white px-2 py-0.5 rounded text-xs font-bold">
                    -{calcDiscount(product.basePrice + selectedVariant.extraPrice, product.basePrice)}%
                  </span>
                </>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="font-bold text-m3-on-surface">Phân loại:</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariantId(v.id); setQuantity(1) }}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedVariantId === v.id
                          ? 'border-m3-primary text-m3-primary bg-m3-primary-fixed/20'
                          : 'border-m3-outline-variant text-m3-on-surface-variant hover:border-m3-primary'
                      } ${v.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={v.stock === 0}
                    >
                      {v.variantName}
                      {v.extraPrice > 0 && ` (+${formatPrice(v.extraPrice)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock info */}
            {selectedVariant && (
              <p className={`text-sm font-medium ${currentStock < 10 ? 'text-flash-sale' : 'text-success'}`}>
                {currentStock === 0 ? 'Hết hàng' : currentStock < 10 ? `Chỉ còn ${currentStock} sản phẩm` : `${currentStock} sản phẩm có sẵn`}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-m3-on-surface">Số lượng:</span>
              <div className="flex items-center border border-m3-outline-variant rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-m3-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="w-12 text-center border-none focus:ring-0 font-bold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-m3-surface-variant transition-colors"
                  disabled={currentStock > 0 && quantity >= currentStock}
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isPending || currentStock === 0}
                className="py-4 px-6 border-2 border-m3-primary text-m3-primary font-bold rounded-xl hover:bg-m3-primary-fixed/20 transition-all disabled:opacity-50"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="py-4 px-6 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
                }}
              >
                Mua ngay
              </button>
            </div>

            {/* Quick Services */}
            <div className="grid grid-cols-2 gap-4 border-t border-m3-outline-variant pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <p className="font-bold text-xs">Miễn phí vận chuyển</p>
                  <p className="text-[10px] text-m3-on-surface-variant">Cho đơn hàng từ 2tr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-bold text-xs">Bảo hành 12 tháng</p>
                  <p className="text-[10px] text-m3-on-surface-variant">Chính hãng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <section className="mt-16">
          <div className="border-b border-m3-outline-variant flex gap-6 mb-6 overflow-x-auto">
            <div className="pb-3 px-2 font-bold text-sm border-b-3 border-m3-primary text-m3-primary transition-all">
              Mô tả sản phẩm
            </div>
            <div className="pb-3 px-2 font-bold text-sm text-m3-on-surface-variant transition-all">
              Đánh giá
            </div>
            <div className="pb-3 px-2 font-bold text-sm text-m3-on-surface-variant transition-all">
              Thông số kỹ thuật
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[200px]">
            {product.description ? (
              <div className="text-sm text-m3-on-surface-variant leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            ) : (
              <p className="text-m3-on-surface-variant italic">Chưa có mô tả cho sản phẩm này.</p>
            )}
          </div>
        </section>

        {/* Description section removed inline - moved to tab */}
      </div>
    </div>
  )
}

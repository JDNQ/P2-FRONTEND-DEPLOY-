'use client'
import { useProduct } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAddToWishlist } from '@/lib/hooks/useWishlist'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_80, PLACEHOLDER_600 } from '@/lib/utils/placeholder'
import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { id } = use(params)
  const productId = parseInt(id)
  const { data: product, isLoading } = useProduct(productId)
  const { mutate: addToCart, isPending } = useAddToCart()
  const { mutate: addToWishlist } = useAddToWishlist()

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImgIdx, setMainImgIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId) || null
  const currentPrice = selectedVariant
    ? product!.basePrice + selectedVariant.extraPrice
    : product?.basePrice || 0
  const currentStock = selectedVariant?.stock ?? 0

  const hasImages = product?.images && product.images.length > 0
  const safeMainImgIdx = hasImages ? Math.min(mainImgIdx, product.images.length - 1) : 0

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            <div className="lg:col-span-7">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-20 h-20 bg-surface-container-high rounded-xl" />)}
                </div>
                <div className="flex-1 aspect-square bg-surface-container-high rounded-3xl" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-stack-md">
              <div className="h-8 bg-surface-container-high rounded w-3/4" />
              <div className="h-6 bg-surface-container-high rounded w-1/4" />
              <div className="h-16 bg-surface-container-high rounded-xl" />
              <div className="h-12 bg-surface-container-high rounded w-1/2" />
              <div className="h-12 bg-surface-container-high rounded w-1/3" />
              <div className="h-14 bg-surface-container-high rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
          <h1 className="font-heading text-headline-sm text-on-surface">Sản phẩm không tìm thấy</h1>
          <Link href="/products" className="text-primary hover:underline font-semibold inline-block">Quay lại trang sản phẩm</Link>
        </div>
      </div>
    )
  }

  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-stack-lg font-caption text-caption text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-bold text-on-surface">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg mb-section-gap">
          {/* Product Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1">
              {hasImages ? product.images.slice(0, 4).map((img, idx) => (
                <button key={idx} onClick={() => setMainImgIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    idx === safeMainImgIdx ? 'border-primary ring-2 ring-primary-fixed-dim' : 'border-transparent'
                  }`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_80 }} />
                </button>
              )) : (
                <button className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary-fixed-dim">
                  <img src={PLACEHOLDER_80} alt="" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
            <div className="flex-1 order-1 md:order-2 bg-surface-container-low rounded-3xl overflow-hidden flex items-center justify-center p-6 relative group">
              {hasImages ? (
                <img src={product.images[safeMainImgIdx].url} alt={product.productName}
                  className="max-w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_600 }} />
              ) : (
                <div className="flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}
              <button
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:text-error transition-all hover:scale-110"
                onClick={(e) => {
                  e.preventDefault()
                  if (!isAuthenticated) { router.push('/login?from=/products'); return }
                  addToWishlist(product.id)
                }}>
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <span className="px-3 py-1 bg-primary-50 text-sm font-medium mb-2 inline-block rounded-full text-primary">
                Nổi bật
              </span>
              <h1 className="font-heading text-display-sm text-on-surface mb-1">{product.productName}</h1>
              <div className="flex items-center gap-4 mb-stack-md">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < 4 ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  ))}
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant">(482 đánh giá)</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-price-display text-price-display text-primary">{formatPrice(currentPrice || minPrice)}</span>
                {maxPrice > minPrice && (
                  <span className="text-on-surface-variant line-through font-body-md text-body-md">{formatPrice(maxPrice)}</span>
                )}
              </div>
            </div>

            <div className="space-y-stack-md">
              <div className="flex items-center gap-2 text-green-600 font-label-md text-label-md">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {currentStock > 0 ? 'Còn hàng — Sẵn sàng giao' : 'Hết hàng'}
              </div>

              {product.variants.length > 0 && (
                <div>
                  <p className="font-label-md text-label-md text-on-surface mb-3">
                    Phân loại: <span className="font-bold">{selectedVariant?.variantName || 'Chọn phân loại'}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariantId === v.id
                      return (
                        <button key={v.id} onClick={() => { setSelectedVariantId(v.id); setQuantity(1) }}
                          disabled={v.stock === 0}
                          className={`py-3 px-4 rounded-xl border-2 font-label-md text-label-md transition-all ${
                            isSelected
                              ? 'border-primary text-primary font-bold bg-primary-container/10'
                              : 'border-outline-variant hover:border-primary text-on-surface-variant'
                          } ${v.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {v.variantName}
                          {v.extraPrice > 0 && ` (+${formatPrice(v.extraPrice)})`}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-3">Số lượng</p>
                <div className="flex items-center border border-outline-variant rounded-xl w-fit bg-surface-container-low overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input type="number" value={quantity} readOnly
                    className="w-16 text-center border-none bg-transparent focus:ring-0 font-bold outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-surface-variant transition-colors"
                    disabled={currentStock > 0 && quantity >= currentStock}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-stack-md">
              <button onClick={handleAddToCart} disabled={isPending || currentStock === 0}
                className="flex-1 orange-gradient orange-glow text-white font-label-md py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                <span className="material-symbols-outlined">shopping_cart</span>
                Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} disabled={currentStock === 0}
                className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md py-4 px-8 rounded-xl active:scale-95 transition-all border border-outline-variant/30 disabled:opacity-50">
                Mua ngay
              </button>
            </div>

            {/* Service Icons */}
            <div className="grid grid-cols-2 gap-4 font-caption text-caption text-on-surface-variant pt-stack-md border-t border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Giao hàng nhanh miễn phí
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Bảo hành chính hãng 2 năm
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">assignment_return</span>
                Đổi trả dễ dàng 30 ngày
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shield</span>
                Thanh toán an toàn
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details Tabs */}
        <section className="mb-section-gap">
          <div className="flex border-b border-outline-variant mb-stack-lg overflow-x-auto whitespace-nowrap">
            {['description', 'specifications', 'reviews', 'qa'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 border-b-2 font-label-md text-label-md transition-all ${
                  activeTab === tab
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}>
                {tab === 'description' ? 'Mô tả' :
                 tab === 'specifications' ? 'Thông số' :
                 tab === 'reviews' ? 'Đánh giá (482)' : 'Hỏi đáp'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="grid md:grid-cols-2 gap-stack-lg">
              <div className="space-y-stack-md">
                <h3 className="font-heading text-headline-sm text-on-surface">{product.productName}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {product.description || 'Experience premium quality and cutting-edge design with this TL Market exclusive product. Crafted with precision and built to last.'}
                </p>
                <div className="bg-surface-container-low p-stack-lg rounded-2xl border border-outline-variant">
                  <h4 className="font-label-md text-label-md font-bold text-on-surface mb-stack-md">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {['Premium build quality', 'Latest technology integration', 'Designed for durability', 'Optimized performance'].map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body-md text-body-md">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span className="text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg h-full min-h-[300px] relative bg-surface-container-low">
                {hasImages ? (
                  <img src={product.images[0].url} alt={product.productName} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_600 }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-6xl">image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-stack-lg">
                  <p className="text-white font-bold font-heading text-headline-sm">Premium Design</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="bg-surface-container-low p-stack-lg rounded-2xl">
              <p className="font-body-md text-body-md text-on-surface-variant">Specifications not available for this product.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-surface-container-low p-stack-lg rounded-2xl">
              <p className="font-body-md text-body-md text-on-surface-variant">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="bg-surface-container-low p-stack-lg rounded-2xl">
              <p className="font-body-md text-body-md text-on-surface-variant">No questions yet. Ask the seller a question.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}

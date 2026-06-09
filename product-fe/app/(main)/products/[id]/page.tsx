'use client'
import { useProduct } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice, calcDiscount } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_80, PLACEHOLDER_600 } from '@/lib/utils/placeholder'
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
  const [activeTab, setActiveTab] = useState('description')

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-20 h-20 bg-neutral-200 rounded-xl" />)}
                </div>
                <div className="flex-1 aspect-square bg-neutral-200 rounded-3xl" />
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

  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => product.basePrice + v.extraPrice))
    : product.basePrice

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-xs text-m3-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-m3-on-surface font-bold text-sm">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Product Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    idx === mainImgIdx ? 'active-thumb' : 'border-transparent'
                  }`}
                  style={idx === mainImgIdx ? { borderColor: '#0035d1', boxShadow: '0 0 0 2px #bac3ff' } : {}}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_80 }}
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 order-1 md:order-2 bg-surface-container-low rounded-3xl overflow-hidden flex items-center justify-center p-6 relative group">
              {product.images[mainImgIdx] ? (
                <img
                  src={product.images[mainImgIdx].url}
                  alt={product.productName}
                  className="max-w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_600 }}
                />
              ) : (
                <div className="flex items-center justify-center text-m3-outline">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}
              <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:text-error transition-all hover:scale-110">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <span className="px-3 py-1 bg-primary-fixed-dim text-sm font-medium mb-2 inline-block rounded-full"
                style={{ background: '#bac3ff', color: '#0031c5' }}
              >
                Promoted
              </span>
              <h1 className="text-3xl font-bold text-m3-on-surface mb-2">{product.productName}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < 4 ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="text-sm text-m3-on-surface-variant">(482 Reviews)</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-4xl text-primary">{formatPrice(currentPrice || minPrice)}</span>
                {maxPrice > minPrice && (
                  <span className="text-m3-on-surface-variant line-through text-lg">{formatPrice(maxPrice)}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {currentStock > 0 ? 'In Stock - Ready to ship' : 'Out of Stock'}
              </div>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <>
                  <div>
                    <p className="font-medium text-sm text-m3-on-surface mb-3">
                      Variant: <span className="font-bold">{selectedVariant?.variantName || 'Select a variant'}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariantId === v.id
                        return (
                          <button
                            key={v.id}
                            onClick={() => { setSelectedVariantId(v.id); setQuantity(1) }}
                            disabled={v.stock === 0}
                            className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                              isSelected
                                ? 'border-primary text-primary font-bold'
                                : 'border-outline-variant hover:border-primary text-m3-on-surface-variant'
                            } ${v.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={isSelected ? { background: 'rgba(30, 76, 253, 0.06)' } : {}}
                          >
                            {v.variantName}
                            {v.extraPrice > 0 && ` (+${formatPrice(v.extraPrice)})`}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Quantity */}
              <div>
                <p className="font-medium text-sm text-m3-on-surface mb-3">Quantity</p>
                <div className="flex items-center border border-outline-variant rounded-xl w-fit bg-surface-container-low overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-16 text-center border-none bg-transparent focus:ring-0 font-bold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-surface-variant transition-colors"
                    disabled={currentStock > 0 && quantity >= currentStock}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isPending || currentStock === 0}
                className="flex-1 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                  boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)'
                }}
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="flex-1 bg-surface-container-highest text-m3-on-surface font-bold py-4 px-8 rounded-xl active:scale-95 transition-all border border-outline-variant disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Service Icons */}
            <div className="grid grid-cols-2 gap-4 text-xs text-m3-on-surface-variant pt-4 border-t border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Free Express Delivery
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                2 Year Official Warranty
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">assignment_return</span>
                30-Day Easy Returns
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shield</span>
                Secure Payment
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details Tabs */}
        <section className="mb-16">
          <div className="flex border-b border-outline-variant mb-6 overflow-x-auto whitespace-nowrap">
            {['description', 'specifications', 'reviews', 'qa'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-m3-on-surface-variant hover:text-primary'
                }`}
              >
                {tab === 'description' ? 'Description' :
                 tab === 'specifications' ? 'Specifications' :
                 tab === 'reviews' ? 'Reviews (482)' : 'Q&A'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{product.productName}</h3>
                <p className="text-sm text-m3-on-surface-variant leading-relaxed">
                  {product.description || 'Experience premium quality and cutting-edge design with this TL Market exclusive product. Crafted with precision and built to last.'}
                </p>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
                  <h4 className="font-bold mb-4">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {['Premium build quality', 'Latest technology integration', 'Designed for durability', 'Optimized performance'].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg h-full min-h-[300px] relative bg-surface-container-low">
                {product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-m3-outline">
                    <span className="material-symbols-outlined text-6xl">image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-lg">Premium Design</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <p className="text-sm text-m3-on-surface-variant">Specifications not available for this product.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <p className="text-sm text-m3-on-surface-variant">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <p className="text-sm text-m3-on-surface-variant">No questions yet. Ask the seller a question.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

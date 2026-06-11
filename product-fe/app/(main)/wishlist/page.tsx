'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useWishlist, useRemoveFromWishlist, useAddAllWishlistToCart } from '@/lib/hooks/useWishlist'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function WishlistPage() {
  const router = useRouter()
  const { data: items = [], isLoading } = useWishlist()
  const { mutate: removeItem } = useRemoveFromWishlist()
  const { mutate: addAllToCart } = useAddAllWishlistToCart()

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <header className="mb-stack-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-headline-lg text-on-surface mb-1">Yêu thích</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Quản lý sản phẩm đã lưu và thêm vào giỏ hàng khi bạn sẵn sàng.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => addAllToCart()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-label-md shadow-sm hover:shadow-lg transition-all active:scale-[0.98] orange-gradient orange-glow text-white">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart_checkout</span>
                Thêm tất cả vào giỏ
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Đã sao chép liên kết!') }}
                className="flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-xl hover:bg-surface-variant transition-all font-label-md text-on-surface">
                <span className="material-symbols-outlined">share</span>
                Chia sẻ
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-stack-lg">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse overflow-hidden bg-surface">
                <div className="aspect-square bg-surface-container-high" />
                <div className="p-stack-md space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-section-gap text-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-stack-lg bg-surface-container-low">
              <span className="material-symbols-outlined text-6xl text-outline-variant">favorite</span>
            </div>
            <h2 className="font-heading text-headline-sm text-on-surface mb-1">Danh sách yêu thích trống</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Lưu sản phẩm bạn thích và chúng sẽ xuất hiện tại đây.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary font-heading font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-stack-lg mb-section-gap">
              {items.map((item) => {
                const p = item.product
                const primaryImage = p.images?.find(img => img.isPrimary) || p.images?.[0]
                return (
                <div key={item.id}
                  className="group relative rounded-2xl shadow-sm overflow-hidden border border-neutral-50 transition-all hover:-translate-y-1 hover:shadow-lg bg-white">
                  <div className="aspect-square relative overflow-hidden bg-surface-container-high">
                    <Link href={`/products/${item.productId}`}>
                      <img src={primaryImage?.url || PLACEHOLDER_400} alt={p.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }} />
                    </Link>
                    <button onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all active:scale-90 z-10 bg-white/80 backdrop-blur-sm text-error hover:bg-error hover:text-white">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 p-stack-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 bg-gradient-to-t from-black/50 to-transparent">
                        <button onClick={() => router.push(`/products/${item.productId}`)}
                          className="w-full py-2 rounded-lg font-label-md shadow-lg flex items-center justify-center gap-2 bg-white text-on-surface hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-stack-md">
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-heading text-headline-sm text-on-surface truncate hover:text-primary cursor-pointer">{p.productName}</h3>
                      </Link>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mb-stack-md truncate">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-price-display text-price-display text-primary">{formatPrice(p.basePrice)}</span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>

            {/* Featured Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
              <div className="lg:col-span-8 rounded-3xl overflow-hidden relative min-h-[400px] flex items-center p-12 bg-primary">
                <div className="relative z-10 max-w-md">
                  <span className="inline-block px-4 py-1 rounded-full font-label-md text-label-md mb-stack-lg bg-white/20 backdrop-blur-sm text-white">Exclusive Offer</span>
                  <h2 className="font-heading text-display-lg text-white mb-stack-lg">Level up your setup.</h2>
                  <p className="font-body-md text-body-md mb-stack-lg text-white/90">Get 20% off when you buy 2 or more items from your wishlist today. Limited time only.</p>
                  <button onClick={() => { toast.success('Mã giảm giá 20% đã được lưu vào ví của bạn!') }}
                    className="px-8 py-4 rounded-xl font-label-md shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] bg-surface text-primary">
                    Redeem Discount
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.7,-77.6C58.9,-69.3,69.2,-56.3,77.3,-42.1C85.4,-27.9,91.3,-12.5,91.8,3.2C92.4,18.9,87.6,35,78.2,48.2C68.8,61.4,54.8,71.7,39.8,78.1C24.7,84.5,8.7,87,-7.1,85.6C-22.9,84.1,-38.4,78.7,-52,69.9C-65.6,61,-77.2,48.7,-84.4,34.4C-91.6,20.1,-94.4,3.7,-91.7,-11.9C-89,-27.6,-80.7,-42.6,-69.5,-52.8C-58.4,-63,-44.4,-68.4,-31.1,-76.5C-17.7,-84.6,-5,-95.4,9.2,-96.9C23.4,-98.5,32.4,-85.9,45.7,-77.6Z" fill="#FFFFFF" transform="translate(200 200)" />
                  </svg>
                </div>
              </div>
              <div className="lg:col-span-4 grid grid-rows-2 gap-stack-lg">
                <div className="rounded-3xl p-8 flex flex-col justify-center border border-outline-variant/30 bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary text-4xl mb-stack-md">local_shipping</span>
                  <h4 className="font-heading text-headline-sm text-on-surface mb-1">Fast Delivery</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">Free shipping on orders over $150.</p>
                </div>
                <div className="rounded-3xl p-8 flex flex-col justify-center border border-outline-variant/30 bg-surface-variant">
                  <span className="material-symbols-outlined text-primary text-4xl mb-stack-md">verified_user</span>
                  <h4 className="font-heading text-headline-sm text-on-surface mb-1">Secure Payment</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">We support all major credit cards and digital wallets.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

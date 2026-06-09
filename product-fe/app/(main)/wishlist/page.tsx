'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useWishlist, useRemoveFromWishlist, useAddAllWishlistToCart } from '@/lib/hooks/useWishlist'

export default function WishlistPage() {
  const router = useRouter()
  const { data: items = [], isLoading } = useWishlist()
  const { mutate: removeItem } = useRemoveFromWishlist()
  const { mutate: addAllToCart } = useAddAllWishlistToCart()

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-bold leading-[40px] mb-2">My Favorites</h1>
              <p className="text-[#444656] text-[16px] leading-[24px]">Manage your saved items and add them to your cart whenever you&apos;re ready.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => addAllToCart()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-lg transition-all active:scale-[0.98] text-[14px] leading-[20px] font-medium"
                style={{ backgroundColor: '#1e4cfd', color: '#ffffff' }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart_checkout</span>
                Add All to Cart
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Đã sao chép liên kết chia sẻ danh sách yêu thích!')
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 border rounded-xl hover:bg-[#f5f2ff] transition-all text-[14px] leading-[20px] font-medium"
                style={{ borderColor: '#c4c5d9' }}
              >
                <span className="material-symbols-outlined">share</span>
                Share List
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                <div className="aspect-square bg-[#eeecff]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#eeecff] rounded w-3/4" />
                  <div className="h-4 bg-[#eeecff] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f5f2ff' }}>
              <span className="material-symbols-outlined text-6xl text-[#c4c5d9]">favorite</span>
            </div>
            <h2 className="text-[30px] font-bold leading-[40px] mb-2">Your wishlist is empty</h2>
            <p className="text-[#444656] text-[18px] leading-[28px] mb-8">Save items you love and they will appear here.</p>
            <Link
              href="/products"
              className="px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all text-[14px] leading-[20px] font-medium"
              style={{ backgroundColor: '#0035d1', color: '#ffffff' }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-[#bac3ff] transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: '#eeecff' }}>
                    <Link href={`/products/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                      />
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all active:scale-90 z-10"
                      style={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ba1a1a'; e.currentTarget.style.color = '#ffffff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#ba1a1a' }}
                    >
                      <span className="material-symbols-outlined text-[#ba1a1a]" style={{ color: 'inherit' }}>delete</span>
                    </button>
                    <div
                      className="absolute bottom-0 inset-x-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                    >
                      <button
                        onClick={() => router.push(`/products/${item.productId}`)}
                        className="w-full py-2 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 text-[14px] leading-[20px] font-medium hover:opacity-90 transition-colors"
                        style={{ backgroundColor: '#1e4cfd', color: '#ffffff' }}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-[20px] font-semibold leading-[28px] truncate hover:text-[#1e4cfd] cursor-pointer">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1" style={{ color: '#0035d1' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[14px] leading-[20px] font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-[12px] leading-[16px] text-[#444656] mb-4 truncate">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[20px] font-bold leading-[1]" style={{ color: '#0035d1' }}>{formatPrice(item.price)}</span>
                      </div>
                      {item.colors && item.colors.length > 0 && (
                        <div className="flex gap-1">
                          {item.colors.map((c, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-[#c4c5d9]"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className="lg:col-span-8 rounded-3xl overflow-hidden relative min-h-[400px] flex items-center p-12"
                style={{ backgroundColor: '#1e4cfd' }}
              >
                <div className="relative z-10 max-w-md">
                  <span className="inline-block px-4 py-1 rounded-full text-[14px] leading-[20px] font-medium mb-6 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                    Exclusive Offer
                  </span>
                  <h2 className="text-[48px] font-extrabold leading-[1.2] tracking-tight text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Level up your setup.</h2>
                  <p className="text-[18px] leading-[28px] mb-8" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Get 20% off when you buy 2 or more items from your wishlist today. Limited time only.
                  </p>
                  <button
                    onClick={() => {
                      toast.success('Mã giảm giá 20% đã được lưu vào ví của bạn!')
                    }}
                    className="px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] text-[14px] leading-[20px] font-medium"
                    style={{ backgroundColor: '#ffffff', color: '#0035d1' }}
                  >
                    Redeem Discount
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.7,-77.6C58.9,-69.3,69.2,-56.3,77.3,-42.1C85.4,-27.9,91.3,-12.5,91.8,3.2C92.4,18.9,87.6,35,78.2,48.2C68.8,61.4,54.8,71.7,39.8,78.1C24.7,84.5,8.7,87,-7.1,85.6C-22.9,84.1,-38.4,78.7,-52,69.9C-65.6,61,-77.2,48.7,-84.4,34.4C-91.6,20.1,-94.4,3.7,-91.7,-11.9C-89,-27.6,-80.7,-42.6,-69.5,-52.8C-58.4,-63,-44.4,-68.4,-31.1,-76.5C-17.7,-84.6,-5,-95.4,9.2,-96.9C23.4,-98.5,32.4,-85.9,45.7,-77.6Z" fill="#FFFFFF" transform="translate(200 200)" />
                  </svg>
                </div>
              </div>
              <div className="lg:col-span-4 grid grid-rows-2 gap-6">
                <div className="rounded-3xl p-8 flex flex-col justify-center border" style={{ backgroundColor: '#e8e6ff', borderColor: 'rgba(196,197,217,0.3)' }}>
                  <span className="material-symbols-outlined text-[#0035d1] text-4xl mb-4">local_shipping</span>
                  <h4 className="text-[20px] font-semibold leading-[28px] mb-2">Fast Delivery</h4>
                  <p className="text-[16px] leading-[24px] text-[#444656]">Free shipping on orders over $150.</p>
                </div>
                <div className="rounded-3xl p-8 flex flex-col justify-center border" style={{ backgroundColor: '#dee0ff', borderColor: 'rgba(196,197,217,0.3)' }}>
                  <span className="material-symbols-outlined text-[#4958a9] text-4xl mb-4">verified_user</span>
                  <h4 className="text-[20px] font-semibold leading-[28px] mb-2">Secure Payment</h4>
                  <p className="text-[16px] leading-[24px] text-[#444656]">We support all major credit cards and digital wallets.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useState, useEffect } from 'react'

function CountdownTimer() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' })
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime({
        h: String(23 - now.getHours()).padStart(2, '0'),
        m: String(59 - now.getMinutes()).padStart(2, '0'),
        s: String(59 - now.getSeconds()).padStart(2, '0'),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex gap-2">
      {[time.h, time.m, time.s].map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="bg-m3-on-background text-white p-2 rounded-lg min-w-[40px] text-center font-bold">{v}</div>
          {i < 2 && <span className="font-bold text-m3-on-background">:</span>}
        </div>
      ))}
    </div>
  )
}

const CATEGORIES = [
  { name: 'Điện tử', icon: 'devices', color: 'm3-primary' },
  { name: 'Thời trang', icon: 'checkroom', color: 'm3-tertiary' },
  { name: 'Thể thao', icon: 'fitness_center', color: 'm3-primary' },
  { name: 'Nhà cửa', icon: 'home', color: 'm3-tertiary' },
  { name: 'Làm đẹp', icon: 'airware', color: 'm3-primary' },
  { name: 'Đồ chơi', icon: 'toys', color: 'm3-tertiary' },
]

const TRUST_ITEMS = [
  { icon: 'verified', color: 'text-success', bg: 'bg-success/10', title: 'Hàng chính hãng', desc: 'Cam kết 100% sản phẩm chính hãng, đầy đủ giấy tờ.' },
  { icon: 'local_shipping', color: 'text-info', bg: 'bg-info/10', title: 'Giao nhanh 2h', desc: 'Nhận hàng ngay trong 2 giờ tại các thành phố lớn.' },
  { icon: 'assignment_return', color: 'text-m3-primary', bg: 'bg-primary-fixed', title: 'Đổi trả dễ dàng', desc: 'Đổi trả miễn phí trong vòng 7 ngày nếu không hài lòng.' },
]

export default function HomePage() {
  const { data: products, isLoading } = useProducts()

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
      >
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-6 text-white">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Mua sắm thông minh,<br />Giao nhanh chớp nhoáng
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-md">
              Hàng ngàn sản phẩm chất lượng cao đang chờ bạn khám phá với ưu đãi độc quyền chỉ có tại TL Market.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-m3-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              Shop Now
            </Link>
          </div>
          <div className="hidden lg:block relative">
            <div className="rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 w-full aspect-[4/3] bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-9xl opacity-30">shopping_bag</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-16 max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-flash-sale flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Flash Sale
            </h2>
            <CountdownTimer />
          </div>
          <Link href="/products" className="text-m3-primary font-bold hover:underline flex items-center">
            Xem tất cả <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3">
                <div className="aspect-square bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))
          ) : (
            products?.slice(0, 8).map((product) => {
              const minPrice = product.variants.length > 0
                ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                : product.basePrice
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="min-w-[280px] bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 relative group hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute top-4 left-4 z-10 bg-flash-sale text-white px-3 py-1 rounded-full text-xs font-bold">
                    Sale
                  </div>
                  <div className="aspect-square bg-m3-surface-container-low rounded-xl mb-4 overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/280?text=Product' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-m3-outline">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.productName}</h3>
                  <div className="text-m3-primary font-bold">{formatPrice(minPrice)}</div>
                </Link>
              )
            })
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-m3-surface-container py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="bg-white p-6 rounded-2xl flex flex-col items-center gap-2 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-m3-primary-fixed rounded-full flex items-center justify-center mb-2">
                  <span className={`material-symbols-outlined text-3xl ${cat.color === 'm3-primary' ? 'text-m3-primary' : 'text-m3-tertiary'}`}>
                    {cat.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-m3-on-surface">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Gợi ý hôm nay</h2>
          <div className="hidden md:flex gap-2">
            <span className="px-4 py-2 bg-m3-primary-container text-on-primary rounded-full text-sm font-bold cursor-pointer">Tất cả</span>
            <span className="px-4 py-2 hover:bg-m3-surface-container rounded-full text-sm font-bold cursor-pointer transition-colors">Phổ biến</span>
            <span className="px-4 py-2 hover:bg-m3-surface-container rounded-full text-sm font-bold cursor-pointer transition-colors">Giá rẻ nhất</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3">
                <div className="aspect-square bg-neutral-200 rounded-xl" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-10 bg-neutral-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products?.slice(0, 10).map((product) => {
              const minPrice = product.variants.length > 0
                ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                : product.basePrice
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-square bg-m3-surface-container-low rounded-xl mb-4 overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/280?text=Product' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-m3-outline">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.productName}</h3>
                  <div className="text-m3-primary font-bold mb-4">{formatPrice(minPrice)}</div>
                  <div className="w-full border-2 border-m3-outline-variant text-m3-on-surface font-bold py-2 rounded-xl text-center text-sm hover:bg-m3-primary-container hover:border-m3-primary-container hover:text-on-primary transition-all">
                    Thêm vào giỏ
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="px-12 py-4 bg-m3-surface-container-high text-m3-on-surface font-bold rounded-xl hover:bg-m3-surface-container-highest transition-colors inline-block"
          >
            Xem thêm sản phẩm
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-m3-outline-variant py-16">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center p-6 space-y-3">
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-full flex items-center justify-center mb-2`}>
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-m3-on-surface-variant text-sm max-w-[200px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

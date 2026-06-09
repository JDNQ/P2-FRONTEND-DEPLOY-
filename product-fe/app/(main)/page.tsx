'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useState, useEffect } from 'react'

function CountdownTimer() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' })
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const tomorrow = new Date()
      tomorrow.setHours(24, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      setTime({
        h: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex gap-2 items-center">
      {[
        { value: time.h, label: 'Hrs' },
        { value: time.m, label: 'Min' },
        { value: time.s, label: 'Sec' },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="px-4 py-2 rounded-lg font-bold text-lg min-w-[60px] text-center"
              style={{ background: '#f97316' }}
            >
              {item.value}
            </div>
            <span className="text-[10px] mt-1 uppercase opacity-60">{item.label}</span>
          </div>
          {i < 2 && <span className="font-bold text-lg pt-2">:</span>}
        </div>
      ))}
    </div>
  )
}

const CATEGORIES = [
  { name: 'Electronics', icon: 'devices', color: '#0035d1' },
  { name: 'Fashion', icon: 'styler', color: '#f97316' },
  { name: 'Home Decor', icon: 'chair', color: '#3432c8' },
  { name: 'Fitness', icon: 'fitness_center', color: '#4958a9' },
  { name: 'Beauty', icon: 'face_5', color: '#ba1a1a' },
  { name: 'More', icon: 'more_horiz', color: '#08006c' },
]

const TRUST_ITEMS = [
  { icon: 'verified', title: 'Genuine Products', desc: '100% Quality Guaranteed', color: '#0035d1' },
  { icon: 'bolt', title: '2h Delivery', desc: 'Available in Metro Areas', color: '#f97316' },
  { icon: 'support_agent', title: '24/7 Support', desc: 'Dedicated Assistance', color: '#3432c8' },
  { icon: 'payments', title: 'Secure Pay', desc: 'Multiple Payment Options', color: '#4958a9' },
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const { data: products, isLoading } = useProducts()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') router.replace('/dashboard/admin')
      else if (user?.role === 'MANAGER') router.replace('/dashboard/manager')
    }
  }, [isAuthenticated, user, router])

  return (
    <>
      {/* Hero Section */}
      <section className="px-4 py-6 max-w-[1280px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden h-[500px] flex items-center shadow-2xl">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#08006c]/80 via-[#08006c]/40 to-transparent z-10"></div>
          <div className="relative z-10 px-12 md:px-20 max-w-2xl text-white">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-6 tracking-wider uppercase text-white"
              style={{ background: '#f97316' }}
            >
              Exclusive Launch
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Upgrade Your Lifestyle with <span style={{ color: '#f97316' }}>TL Market</span>
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed">
              Discover thousands of premium products from top global brands, delivered to your doorstep with unmatched speed and care.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95"
                style={{
                  background: '#f97316',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                }}
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border border-white rounded-xl font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-outline-variant/30">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ background: `${item.color}10`, color: item.color }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-m3-on-surface text-sm">{item.title}</h4>
                <p className="text-xs text-m3-on-surface-variant">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="relative overflow-hidden"
        style={{ background: '#08006c' }}
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[400px]">bolt</span>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-3 w-3 rounded-full animate-pulse" style={{ background: '#f97316' }}></span>
                <span className="font-bold uppercase tracking-widest text-sm" style={{ color: '#f97316' }}>Live Event</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">Flash Sale Frenzy</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">Ends in:</span>
              <CountdownTimer />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="h-64 bg-neutral-200 rounded-xl mb-4" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              products?.slice(0, 4).map((product) => {
                const minPrice = product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                  : product.basePrice
                const maxPrice = product.variants.length > 0
                  ? Math.max(...product.variants.map((v) => product.basePrice + v.extraPrice))
                  : product.basePrice
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                const barPercent = Math.min(totalStock, 100)
                const discount = maxPrice > minPrice ? Math.round((1 - minPrice / maxPrice) * 100) : 0
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-2xl p-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
                    style={{ boxShadow: '0 4px 6px -1px rgba(71, 71, 208, 0.1)' }}
                  >
                    <div className="relative rounded-xl overflow-hidden mb-4 h-64 bg-surface-container-low">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-m3-outline">
                          <span className="material-symbols-outlined text-5xl">image</span>
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 text-white font-bold text-xs px-2 py-1 rounded-lg"
                          style={{ background: '#ba1a1a' }}
                        >
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-m3-on-surface truncate mb-2 group-hover:text-primary transition-colors">{product.productName}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-lg" style={{ color: '#f97316' }}>{formatPrice(minPrice)}</span>
                      {discount > 0 && (
                        <span className="text-xs text-outline line-through">{formatPrice(maxPrice)}</span>
                      )}
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 mb-2">
                      <div className="h-1.5 rounded-full" style={{ width: `${barPercent}%`, background: '#f97316' }}></div>
                    </div>
                    <p className="text-[11px] text-m3-on-surface-variant font-medium">{totalStock} items left in stock</p>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold text-m3-on-surface">Explore Categories</h2>
            <p className="text-sm text-m3-on-surface-variant mt-2">Curated selections for every part of your life.</p>
          </div>
          <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-1 group text-sm">
            View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="group cursor-pointer">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-lg"
                style={{ borderColor: 'rgba(196, 197, 217, 0.3)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = cat.color }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 197, 217, 0.3)' }}
              >
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ background: `${cat.color}10`, color: cat.color }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = cat.color
                    el.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = `${cat.color}10`
                    el.style.color = cat.color
                  }}
                >
                  <span className="material-symbols-outlined text-4xl">{cat.icon}</span>
                </div>
                <span className="font-bold text-m3-on-surface text-center text-sm">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-m3-on-surface mb-4">Recommended For You</h2>
          <div className="h-1 w-20 mx-auto rounded-full" style={{ background: '#f97316' }}></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl animate-pulse overflow-hidden border border-outline-variant/20">
                <div className="h-64 bg-neutral-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-8 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 8).map((product) => {
              const minPrice = product.variants.length > 0
                ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                : product.basePrice
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm transition-all duration-300 flex flex-col overflow-hidden group border border-outline-variant/20 hover:-translate-y-1"
                  style={{ boxShadow: '0 4px 6px -1px rgba(71, 71, 208, 0.1)' }}
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-64 overflow-hidden bg-surface-container-low">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-m3-outline">
                          <span className="material-symbols-outlined text-5xl">image</span>
                        </div>
                      )}
                      <button className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-error opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-sm" style={{ color: '#f97316', fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold">4.9</span>
                      <span className="text-xs text-m3-on-surface-variant">(128)</span>
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <h4 className="font-bold text-m3-on-surface mb-1 group-hover:text-primary transition-colors text-sm">{product.productName}</h4>
                      <p className="text-xs text-m3-on-surface-variant mb-4 line-clamp-2">
                        {product.description || 'Premium quality product curated for you.'}
                      </p>
                    </Link>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-lg text-m3-on-surface">{formatPrice(minPrice)}</span>
                      <button
                        className="h-10 w-10 rounded-xl text-white flex items-center justify-center transition-colors active:scale-95"
                        style={{ background: '#0035d1' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f97316' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0035d1' }}
                        onClick={(e) => {
                          e.preventDefault()
                          if (!isAuthenticated) { router.push('/login?from=/products'); return }
                          const firstVariant = product.variants[0]
                          if (firstVariant) {
                            import('@/lib/hooks/useCart').then(({ useAddToCart }) => {
                              const { mutate } = useAddToCart()
                              mutate({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                            })
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAuthStore } from '@/lib/stores/authStore'
import Header from '@/components/Header'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAddToWishlist } from '@/lib/hooks/useWishlist'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useState, useEffect, useRef } from 'react'

function CountdownTimer() {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' })
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const diff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime()
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
      <div className="bg-[#1e4cfd] px-3 py-1.5 rounded-lg min-w-[40px] text-center text-white font-bold">{time.h}</div>
      <span className="text-primary text-xl self-center">:</span>
      <div className="bg-[#1e4cfd] px-3 py-1.5 rounded-lg min-w-[40px] text-center text-white font-bold">{time.m}</div>
      <span className="text-primary text-xl self-center">:</span>
      <div className="bg-[#1e4cfd] px-3 py-1.5 rounded-lg min-w-[40px] text-center text-white font-bold">{time.s}</div>
    </div>
  )
}

const CATEGORIES = [
  { name: 'Điện Tử', icon: 'devices' },
  { name: 'Thời Trang', icon: 'checkroom' },
  { name: 'Gia Dụng', icon: 'kitchen' },
  { name: 'Làm Đẹp', icon: 'face_6' },
  { name: 'Đồ Chơi', icon: 'sports_esports' },
  { name: 'Quà Tặng', icon: 'redeem' },
]

const TRUST_ITEMS = [
  { icon: 'verified_user', title: 'Hàng Chính Hãng', desc: 'Cam kết 100% auth' },
  { icon: 'bolt', title: 'Giao Nhanh 2H', desc: 'Nội thành hỏa tốc' },
  { icon: 'autorenew', title: 'Đổi Trả 7 Ngày', desc: 'Thủ tục nhanh gọn' },
  { icon: 'support_agent', title: 'Hỗ Trợ 24/7', desc: 'Tư vấn tận tâm' },
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const { data: products, isLoading } = useProducts()
  const { mutate: addToCart } = useAddToCart()
  const { mutate: addToWishlist } = useAddToWishlist()

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') router.replace('/dashboard/admin')
      else if (user?.role === 'MANAGER') router.replace('/dashboard/manager')
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-10')
        }
      })
    }, { threshold: 0.1 })
    const sections = document.querySelectorAll('.reveal-section')
    sections.forEach((el) => {
      el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10')
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="orange-gradient text-white py-2 text-center overflow-hidden">
        <p className="font-label-md text-label-md animate-pulse">🔥 FLASH SALE: Giảm tới 50% tất cả mặt hàng điện tử - Duy nhất hôm nay! 🔥</p>
      </div>

      <Header />

      <main className="max-w-container-max mx-auto">
        {/* Hero Banner */}
        <section className="px-gutter pt-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-container to-tertiary h-[500px] flex items-center px-12 lg:px-24">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
            <div className="relative z-10 max-w-xl text-white">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md font-label-md text-label-md mb-6">Mùa Sale Đỉnh Nhất Năm 2024</span>
              <h1 className="font-display-lg text-display-lg mb-4 leading-tight">
                Nâng Tầm Trải Nghiệm <span className="text-[#f97316]">Mua Sắm Việt</span>
              </h1>
              <p className="font-body-lg text-body-lg mb-8 opacity-90">Hàng triệu sản phẩm chính hãng với ưu đãi đặc quyền. Giao hàng thần tốc, bảo hành tận tâm.</p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="orange-gradient orange-glow text-white px-8 py-3.5 rounded-xl font-headline-sm text-headline-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Mua Sắm Ngay
                </Link>
                <Link
                  href="/products"
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-xl font-headline-sm text-headline-sm hover:bg-white/20 transition-all"
                >
                  Khám Phá
                </Link>
              </div>
            </div>
            <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 w-96 h-96 animate-float">
              <div className="w-full h-full flex items-center justify-center text-white/30">
                <span className="material-symbols-outlined text-8xl">shopping_bag</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="px-gutter py-12 reveal-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all">
                <div className="w-12 h-12 rounded-full orange-gradient flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-[16px]">{item.title}</h4>
                  <p className="text-on-surface-variant font-caption text-caption">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Quick Access */}
        <section className="px-gutter py-stack-lg reveal-section">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg">Danh Mục Nổi Bật</h2>
              <p className="text-on-surface-variant">Khám phá thế giới mua sắm đa dạng</p>
            </div>
            <Link href="/products" className="text-primary font-label-md hover:underline flex items-center gap-1">
              Xem tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href="/products" className="group cursor-pointer text-center">
                <div className="aspect-square rounded-3xl bg-surface-container hover:bg-primary-fixed-dim transition-all flex items-center justify-center mb-3 group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-4xl text-primary">{cat.icon}</span>
                </div>
                <span className="font-label-md text-label-md">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale Section */}
        <section className="px-gutter py-section-gap reveal-section">
          <div className="bg-surface-container-high rounded-[32px] p-8 lg:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 orange-gradient blur-[120px] opacity-20"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <h2 className="font-headline-lg text-headline-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-[#f97316]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  Flash Sale
                </h2>
                <CountdownTimer />
              </div>
              <Link href="/products" className="orange-gradient text-white px-6 py-2 rounded-full font-label-md">Khám phá tất cả ưu đãi</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
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
                  const discount = maxPrice > minPrice ? Math.round((1 - minPrice / maxPrice) * 100) : 40
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-lg transition-all border border-outline-variant/30"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          {discount > 0 && (
                            <span className="absolute top-2 left-2 z-20 bg-error text-white text-[12px] font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                          )}
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                            />
                          ) : (
                            <div className="w-full aspect-square flex items-center justify-center text-outline bg-surface-container-low">
                              <span className="material-symbols-outlined text-5xl">image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
                            <span className="orange-gradient text-white px-6 py-2 rounded-full font-label-md transform translate-y-8 group-hover:translate-y-0 transition-transform inline-block">Thêm vào giỏ</span>
                          </div>
                        </div>
                      </Link>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-headline-sm text-[16px] mb-2 truncate">{product.productName}</h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-error font-price-display text-price-display">{formatPrice(minPrice)}</p>
                          {discount > 0 && <p className="text-outline text-caption line-through">{formatPrice(maxPrice)}</p>}
                        </div>
                        <div className="w-20 bg-surface-container-highest rounded-full h-2 relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full orange-gradient" style={{ width: `${barPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="px-gutter pb-24 reveal-section">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="font-headline-lg text-headline-lg">Gợi Ý Hôm Nay</h2>
              <p className="text-on-surface-variant">Sản phẩm được tuyển chọn dành riêng cho bạn</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="px-4 py-2 rounded-full bg-primary text-white font-label-md">Tất cả</button>
              <button className="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-variant transition-colors font-label-md">Theo xu hướng</button>
              <button className="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-variant transition-colors font-label-md">Mới nhất</button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse overflow-hidden border border-outline-variant/20">
                  <div className="aspect-[4/5] bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-1/3" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-8 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products?.slice(0, 10).map((product) => {
                const minPrice = product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                  : product.basePrice
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative overflow-hidden">
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md backdrop-blur-md">Bán chạy</span>
                        </div>
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.productName}
                            className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                          />
                        ) : (
                          <div className="w-full aspect-[4/5] flex items-center justify-center text-outline bg-surface-container-low">
                            <span className="material-symbols-outlined text-5xl">image</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                          <button
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              if (!isAuthenticated) { router.push('/login?from=/products'); return }
                              addToWishlist(product.id)
                            }}
                          >
                            <span className="material-symbols-outlined text-sm">favorite</span>
                          </button>
                          <button
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              router.push(`/products/${product.id}`)
                            }}
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-body-md text-body-md mb-2 h-12 overflow-hidden">{product.productName}</h3>
                      </Link>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="font-price-display text-price-display text-primary">{formatPrice(minPrice)}</p>
                        <button
                          className="w-8 h-8 rounded-lg orange-gradient text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault()
                            if (!isAuthenticated) { router.push('/login?from=/products'); return }
                            const firstVariant = product.variants[0]
                            if (firstVariant) {
                              addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="border-2 border-primary text-primary px-10 py-3 rounded-xl font-headline-sm hover:bg-primary hover:text-white transition-all inline-block"
            >
              Xem Thêm Sản Phẩm
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-section-gap px-gutter py-section-gap max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-1">
            <img alt="TL Market Logo" className="h-10 w-auto mb-6" src="/logo-removebg-preview.png" />
            <p className="text-on-surface-variant font-body-md text-body-md mb-6">Hệ thống bán lẻ hàng đầu Việt Nam, cung cấp giải pháp mua sắm hiện đại và tin cậy.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:orange-gradient hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:orange-gradient hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:orange-gradient hover:text-white transition-all" href="#">
                <span className="material-symbols-outlined">phone_in_talk</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm mb-6">Về TL Market</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">About Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Tin tức công ty</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Cơ hội nghề nghiệp</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Hệ thống cửa hàng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm mb-6">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Contact</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Privacy Policy</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Terms of Service</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm mb-6">Đăng Ký Nhận Tin</h4>
            <p className="text-on-surface-variant font-body-md text-body-md mb-4">Newsletter Signup - Nhận ngay voucher 100k cho đơn hàng đầu tiên.</p>
            <div className="flex gap-2">
              <input className="bg-surface border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary w-full outline-none" placeholder="Email của bạn" type="email" />
              <button className="orange-gradient text-white p-2.5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 py-6 text-center">
          <p className="text-outline font-caption text-caption">© 2024 TL Market. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

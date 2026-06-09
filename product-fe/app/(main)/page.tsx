'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAuthStore } from '@/lib/stores/authStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAddToWishlist } from '@/lib/hooks/useWishlist'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = [
  { name: 'Điện Tử', icon: 'devices' },
  { name: 'Thời Trang', icon: 'apparel' },
  { name: 'Gia Dụng', icon: 'home_app_logo' },
  { name: 'Làm Đẹp', icon: 'spa' },
  { name: 'Đồ Chơi', icon: 'toys' },
  { name: 'Quà Tặng', icon: 'feature_search' },
]

const TRUST_ITEMS = [
  { icon: 'workspace_premium', title: 'Hàng Chính Hãng', desc: 'Cam kết 100% chất lượng' },
  { icon: 'bolt', title: 'Giao Nhanh 2H', desc: 'Nhận hàng tức thì' },
  { icon: 'history', title: 'Đổi Trả 7 Ngày', desc: 'Yên tâm mua sắm' },
  { icon: 'support_agent', title: 'Hỗ Trợ 24/7', desc: 'Luôn lắng nghe bạn' },
]

const BANNERS = [
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832420/af47a55f-c499-43fa-babb-a8274264bf2f_2_w7yx1e.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_1_-_Copy_1_rs2a03.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_ympuvm.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_7_-_Copy_jkravy.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_9_-_Copy_trbcqg.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_6_-_Copy_dceenr.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_8_-_Copy_rrks6a.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_4_-_Copy_mcqjxi.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_2_-_Copy_s0zszz.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_3_-_Copy_tkbhrv.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_5_-_Copy_tb9aok.png',
  'https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_1_ypwnrd.png',
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const { data: products, isLoading } = useProducts()
  const { mutate: addToCart } = useAddToCart()
  const { mutate: addToWishlist } = useAddToWishlist()
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIdx((i) => (i + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

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
      <div className="orange-gradient text-white py-2 text-center overflow-hidden z-[60] relative">
        <p className="font-caption font-medium tracking-wide animate-pulse">
          🔥 FLASH SALE: Giảm tới 50% tất cả mặt hàng điện tử - Duy nhất hôm nay! 🔥
        </p>
      </div>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-gutter py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/10 text-primary-container rounded-full border border-primary-container/20">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-label-md font-bold uppercase tracking-wider">Hàng Chính Hãng 100%</span>
              </div>
              <h1 className="font-heading text-display-lg text-on-surface leading-tight">
                Nâng Tầm Trải Nghiệm <br/><span className="text-primary">Mua Sắm Việt</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg">
                TL Market mang đến cho bạn hàng ngàn lựa chọn đa dạng từ điện tử đến thời trang với cam kết chất lượng chính hãng và tốc độ giao hàng vượt trội.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/products"
                  className="orange-gradient text-white px-8 py-4 rounded-xl font-heading font-bold shadow-lg shadow-brand-orange/25 hover:scale-105 active:scale-95 transition-all"
                >
                  Mua Sắm Ngay
                </Link>
                <Link
                  href="/products"
                  className="bg-white border-2 border-neutral-100 text-on-surface px-8 py-4 rounded-xl font-heading font-bold hover:bg-surface-container transition-all"
                >
                  Khám Phá
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {BANNERS.map((url, i) => (
                  <img
                    key={url}
                    src={url}
                    alt={`Banner ${i + 1}`}
                    className={`w-full h-[500px] object-cover transition-opacity duration-700 ${i === heroIdx ? 'block' : 'hidden'}`}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {BANNERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white py-12 relative -mt-12 mx-gutter rounded-3xl shadow-lg z-20">
          <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-12">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-heading text-label-md text-on-surface">{item.title}</h3>
                  <p className="text-caption text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Quick Access */}
        <section className="max-w-container-max mx-auto px-gutter py-section-gap reveal-section">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-heading text-headline-lg text-on-surface">Danh Mục Nổi Bật</h2>
            <Link href="/products" className="text-primary font-bold hover:underline">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href="/products" className="group text-center space-y-3">
                <div className="aspect-square bg-surface-container rounded-2xl flex items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">{cat.icon}</span>
                </div>
                <p className="font-label-md text-label-md group-hover:text-primary transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section className="bg-surface-container-high py-section-gap reveal-section">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange text-white p-2 rounded-lg animate-bounce">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <h2 className="font-heading text-headline-lg text-on-surface">Flash Sale</h2>
                <CountdownTimer />
              </div>
              <Link href="/products" className="text-brand-orange font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl animate-pulse">
                    <div className="aspect-square bg-surface-container-high rounded-xl mb-4" />
                    <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
                    <div className="h-4 bg-surface-container-high rounded w-1/2" />
                  </div>
                ))
              ) : (
                products?.slice(0, 4).map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="flash-sale"
                    soldCount={[45, 12, 89, 156][idx]}
                    remainCount={[5, 38, 11, 44][idx]}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-container-max mx-auto px-gutter py-section-gap reveal-section">
          <div className="text-center mb-12">
            <h2 className="font-heading text-display-lg text-on-surface mb-4">Gợi Ý Hôm Nay</h2>
            <div className="flex justify-center gap-8 border-b border-neutral-100">
              <button className="pb-4 text-primary font-bold border-b-2 border-primary">Tất cả</button>
              <button className="pb-4 text-outline font-medium hover:text-primary transition-colors">Phổ biến</button>
              <button className="pb-4 text-outline font-medium hover:text-primary transition-colors">Mới nhất</button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-surface rounded-2xl animate-pulse overflow-hidden border border-outline-variant/20">
                  <div className="aspect-[4/5] bg-surface-container-high" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-surface-container-high rounded w-1/3" />
                    <div className="h-4 bg-surface-container-high rounded w-3/4" />
                    <div className="h-8 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products?.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge="Bán chạy"
                  onAddToWishlist={(e) => {
                    e.preventDefault()
                    if (!isAuthenticated) { router.push('/login?from=/products'); return }
                    addToWishlist(product.id)
                  }}
                  onQuickView={(e) => {
                    e.preventDefault()
                    router.push(`/products/${product.id}`)
                  }}
                  onAddToCart={(e) => {
                    e.preventDefault()
                    if (!isAuthenticated) { router.push('/login?from=/products'); return }
                    const firstVariant = product.variants[0]
                    if (firstVariant) {
                      addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                    }
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="px-12 py-4 bg-white border-2 border-primary text-primary font-heading font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              Xem Thêm Sản Phẩm
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

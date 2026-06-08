'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { SkeletonGrid } from '@/components/Skeleton'

import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import Image from 'next/image'

// Mock data - replace with API calls in production
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max - Màn hình 6.7 inch, Camera 48MP',
    price: 29900000,
    salePrice: 25990000,
    rating: 4.8,
    soldCount: 1250,
    image: 'https://images.unsplash.com/photo-1592286927505-1fed5016107c?w=400&h=400&fit=crop',
    badge: 'Hot',
    isFlashSale: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra - 256GB',
    price: 27900000,
    salePrice: 24990000,
    rating: 4.7,
    soldCount: 890,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop',
    badge: 'Bestseller',
  },
  {
    id: '3',
    name: 'MacBook Pro 14 inch M3 - 512GB',
    price: 35900000,
    salePrice: 32490000,
    rating: 4.9,
    soldCount: 567,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    badge: 'New',
  },
  {
    id: '4',
    name: 'iPad Air 11 inch - Apple M2',
    price: 18990000,
    salePrice: 16790000,
    rating: 4.6,
    soldCount: 432,
    image: 'https://images.unsplash.com/photo-1526081715933-8e6aa6c01db3?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5 - Tai nghe chống ồn',
    price: 8990000,
    salePrice: 7490000,
    rating: 4.8,
    soldCount: 2100,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    badge: 'Top Rated',
  },
  {
    id: '6',
    name: 'Canon EOS R5 - Camera chuyên nghiệp',
    price: 45900000,
    salePrice: 42490000,
    rating: 4.9,
    soldCount: 234,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    isFlashSale: true,
  },
  {
    id: '7',
    name: 'DJI Air 3S - Flycam thế hệ mới',
    price: 35900000,
    salePrice: 31990000,
    rating: 4.7,
    soldCount: 456,
    image: 'https://images.unsplash.com/photo-1606833248051-5ce98d1ecf9c?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    name: 'Apple Watch Series 9 - 41mm',
    price: 12990000,
    salePrice: 10990000,
    rating: 4.8,
    soldCount: 1890,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    badge: 'Trending',
  },
  {
    id: '9',
    name: 'AirPods Pro 2 - Tai nghe không dây',
    price: 6990000,
    salePrice: 5890000,
    rating: 4.7,
    soldCount: 3450,
    image: 'https://images.unsplash.com/photo-1606931863979-f5426dda360d?w=400&h=400&fit=crop',
  },
  {
    id: '10',
    name: 'ROG Ally - Máy chơi game cầm tay',
    price: 13990000,
    salePrice: 11990000,
    rating: 4.6,
    soldCount: 678,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a8a07b0a?w=400&h=400&fit=crop',
  },
  {
    id: '11',
    name: 'Samsung Odyssey G9 - Màn hình 49 inch',
    price: 28990000,
    salePrice: 24990000,
    rating: 4.8,
    soldCount: 345,
    image: 'https://images.unsplash.com/photo-1587829191301-ca48e0b06eef?w=400&h=400&fit=crop',
    isFlashSale: true,
  },
  {
    id: '12',
    name: 'RTX 4090 - GPU Gaming cao cấp',
    price: 39990000,
    salePrice: 35990000,
    rating: 4.9,
    soldCount: 567,
    image: 'https://images.unsplash.com/photo-1587829191301-ca48e0b06eef?w=400&h=400&fit=crop',
  },
]

const categories = [
  { id: 1, name: 'Điện thoại', icon: '📱' },
  { id: 2, name: 'Laptop', icon: '💻' },
  { id: 3, name: 'Tablet', icon: '📲' },
  { id: 4, name: 'Tai nghe', icon: '🎧' },
  { id: 5, name: 'Đồng hồ', icon: '⌚' },
  { id: 6, name: 'Camera', icon: '📷' },
  { id: 7, name: 'Gaming', icon: '🎮' },
  { id: 8, name: 'Smart Home', icon: '🏠' },
]

const heroImages = ['/hero-1.png', '/hero-2.png', '/hero-1.png']

export default function HomePage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isLoading] = useState(false)


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Slider */}
      <div className="relative h-80 md:h-96 bg-white overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentHeroIndex * 100}%)` }}>
          {heroImages.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={img}
                alt={`Hero ${idx}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevHero}
          aria-label="Prev"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition z-10"
        >

          <ChevronLeft className="w-6 h-6 text-primary-500" />
        </button>
        <button
          onClick={nextHero}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition z-10"
        >

          <ChevronRight className="w-6 h-6 text-primary-500" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`w-3 h-3 rounded-full transition ${idx === currentHeroIndex ? 'bg-accent-400' : 'bg-white/50'}`}
            />

          ))}
        </div>
      </div>

      {/* Category Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Danh mục</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-accent-400 hover:bg-accent-50 transition"
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <p className="text-xs font-medium line-clamp-2">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Flash Sale Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-accent-400 to-accent-500 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              <div>
                <h2 className="text-2xl font-bold">FLASH SALE</h2>
                <p className="text-sm opacity-90">Các sản phẩm hot bán chỉ có giới hạn</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 bg-white/20 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-bold">23:45:32</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockProducts.filter((p) => p.isFlashSale).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Sản phẩm nổi bật</h2>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          {/* Use Next Link to satisfy lint rule */}
          <Link href="/products" className="text-accent-400 font-medium hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>

      {/* Voucher Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Mã giảm giá</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { code: 'SAVE20', discount: '20% OFF', min: '500K', icon: '🎁' },
            { code: 'FREESHIP', discount: 'Miễn phí vận chuyển', min: '100K', icon: '🚚' },
            { code: 'FLASH50', discount: '50% OFF', min: '1M', icon: '⚡' },
          ].map((voucher) => (
            <div
              key={voucher.code}
              className="bg-white border-2 border-dashed border-accent-400 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{voucher.icon}</span>
                <div>
                  <p className="font-bold text-accent-400">{voucher.discount}</p>
                  <p className="text-xs text-gray-500">Tối thiểu: {voucher.min}</p>
                </div>
              </div>
              <p className="font-mono bg-gray-100 p-2 rounded text-center text-sm font-bold">
                {voucher.code}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">✓</div>
            <h3 className="font-bold mb-1">100% Chính hãng</h3>
            <p className="text-sm text-gray-600">Cam kết hàng chính hãng từ nhà sản xuất</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🚚</div>
            <h3 className="font-bold mb-1">Giao hàng nhanh</h3>
            <p className="text-sm text-gray-600">Miễn phí vận chuyển từ 100K đồng</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-bold mb-1">Hoàn tiền 30 ngày</h3>
            <p className="text-sm text-gray-600">Không hài lòng? Hoàn tiền toàn bộ</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📞</div>
            <h3 className="font-bold mb-1">Hỗ trợ 24/7</h3>
            <p className="text-sm text-gray-600">Tư vấn miễn phí mọi lúc mọi nơi</p>
          </div>
        </div>
      </div>
    </div>
  )
}

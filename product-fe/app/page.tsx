'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { SkeletonGrid } from '@/components/Skeleton'

import { Clock } from 'lucide-react'


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

export default function HomePage() {
  const [bannerSlide, setBannerSlide] = useState(0)
  const mainBanners = [
    "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832420/af47a55f-c499-43fa-babb-a8274264bf2f_2_w7yx1e.png",
    "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_2_-Copy_s0zszz.png",
    "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_5-Copy_tb9aok.png",
    "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_8-_Copy_rrks6a.png",
  ]
  const subBanners = [
    [
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_1_-Copy_1_rs2a03.png",
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_1_ypwnrd.png",
    ],
    [
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_3-Copy_tkbhrv.png",
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_4-Copy_mcqjxi.png",
    ],
    [
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_6-Copy_dceenr.png",
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_7-Copy_jkravy.png",
    ],
    [
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_9-_Copy_trbcqg.png",
      "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_ympuvm.png",
    ],
  ]

  const [isLoading] = useState(false)



  useEffect(() => {
    const t = setInterval(() => setBannerSlide((i) => (i + 1) % 4), 4000)
    return () => clearInterval(t)
  }, [])


  return (
    <div className="bg-gray-50">
      {/* Hero Banner kiểu Tiki */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ position: "relative", height: "280px" }}>
            <div style={{ display: "flex", gap: "8px", height: "100%" }}>
              <div style={{ position: "relative", flex: 1, borderRadius: "16px 0 0 16px", overflow: "hidden", cursor: "pointer" }}>
                {mainBanners.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Banner ${i + 1}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: i === bannerSlide ? 1 : 0,
                      transition: "opacity 0.7s ease",
                    }}
                  />
                ))}
              </div>
              <div style={{ width: "280px", display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                {subBanners[bannerSlide].map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      flex: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      borderRadius: idx === 0 ? "0 16px 0 0" : "0 0 16px 0",
                    }}
                  >
                    <img src={url} alt={`Sub banner ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Prev"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setBannerSlide((i) => (i - 1 + 4) % 4)}
            >
              &#8249;
            </button>
            <button
              type="button"
              aria-label="Next"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setBannerSlide((i) => (i + 1) % 4)}
            >
              &#8250;
            </button>
            <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3].map((idx) => (
                <button
                  type="button"
                  key={idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setBannerSlide(idx)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "9999px",
                    transition: "all 0.3s",
                    background: idx === bannerSlide ? "#f97316" : "rgba(255,255,255,0.7)",
                    width: idx === bannerSlide ? "24px" : "8px",
                    height: "8px",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
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

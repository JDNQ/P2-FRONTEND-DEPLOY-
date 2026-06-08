'use client'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: updateItem } = useUpdateCartItem()
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleRemove = (id: number) => {
    setRemovingIds(prev => [...prev, id])
    setTimeout(() => {
      removeItem(id)
      setRemovingIds(prev => prev.filter(i => i !== id))
    }, 300)
  }

  const handleQty = (id: number, qty: number) => {
    if (qty < 1) return
    updateItem({ id, quantity: qty })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff' }}>
        <div className="max-w-[1280px] mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-[#eeecff] rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-28 bg-[#eeecff] rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 bg-[#eeecff] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-[30px] font-bold leading-[40px] mb-2">Giỏ hàng của bạn</h1>
          <p className="text-[#444656] text-[16px] leading-[24px]">Xem lại sản phẩm trước khi thanh toán.</p>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[80px] text-[#c4c5d9] mb-4">shopping_basket</span>
            <h2 className="text-[24px] font-bold leading-[32px] mb-2">Giỏ hàng trống</h2>
            <p className="text-[#444656] mb-8 text-[16px] leading-[24px]">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
            <Link
              href="/products"
              className="text-white px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all inline-block"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)'
              }}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              {items.map((item, index) => {
                const itemPrice = item.product.basePrice + item.variant.extraPrice
                const isRemoving = removingIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center group rounded-xl p-4 shadow-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(196, 197, 217, 0.3)',
                      opacity: isRemoving ? 0 : 1,
                      transform: isRemoving ? 'translateX(50px)' : 'none',
                      transition: 'opacity 0.3s, transform 0.3s, scale 0.2s',
                      animation: mounted && !isRemoving ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.scale = '1.01' }}
                    onMouseLeave={(e) => { e.currentTarget.style.scale = '1' }}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#eeecff' }}>
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Product' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#747688]">
                          <span className="material-symbols-outlined text-3xl">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[20px] font-semibold leading-[28px]">{item.product.productName}</h3>
                          <p className="text-[#444656] text-[14px] leading-[20px] font-medium">{item.variant.variantName}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-[#747688] hover:text-[#ba1a1a] transition-colors p-1"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: '#eeecff' }}>
                          <button
                            onClick={() => handleQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#e1dfff] rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center font-bold text-[16px] leading-[24px]">{item.quantity}</span>
                          <button
                            onClick={() => handleQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#e1dfff] rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <p className="text-[#0035d1] text-[20px] font-bold leading-[1]">{formatPrice(itemPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="lg:col-span-4 sticky top-28">
              <div
                className="rounded-xl p-6 shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(196, 197, 217, 0.3)'
                }}
              >
                <h2 className="text-[24px] font-bold leading-[32px] mb-6">Tổng đơn hàng</h2>

                <div className="mb-6">
                  <label className="block text-[14px] font-medium leading-[20px] text-[#444656] mb-2">Mã khuyến mãi</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="NHẬP MÃ"
                      className="flex-grow bg-[#f5f2ff] border border-[#c4c5d9] rounded-xl px-4 py-2 text-[16px] leading-[24px] focus:ring-[#0035d1] focus:border-[#0035d1] uppercase tracking-wider outline-none transition-all"
                      style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
                    />
                    <button
                      className="text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-colors"
                      style={{ backgroundColor: '#4958a9' }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[16px] leading-[24px]">
                    <span style={{ color: '#444656' }}>Tạm tính</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[16px] leading-[24px]">
                    <span style={{ color: '#444656' }}>Phí vận chuyển</span>
                    <span className="font-bold" style={{ color: '#3432c8' }}>MIỄN PHÍ</span>
                  </div>
                  <div className="flex justify-between text-[16px] leading-[24px]">
                    <span style={{ color: '#444656' }}>Giảm giá</span>
                    <span className="font-bold" style={{ color: '#ba1a1a' }}>-0đ</span>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: '#c4c5d9' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[20px] font-semibold leading-[28px]">Tổng cộng</span>
                      <span className="text-[#0035d1] text-[28px] font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                    boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)'
                  }}
                >
                  Tiến hành thanh toán
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f5f2ff' }}>
                    <span className="material-symbols-outlined text-[#0035d1]">verified</span>
                    <span className="text-[12px] leading-[16px] text-[#444656]">Thanh toán an toàn với mã hóa.</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f5f2ff' }}>
                    <span className="material-symbols-outlined text-[#0035d1]">local_shipping</span>
                    <span className="text-[12px] leading-[16px] text-[#444656]">Miễn phí vận chuyển cho đơn trên 2.000.000đ.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

'use client'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: updateItem } = useUpdateCartItem()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page">
        <div className="max-w-[1280px] mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 bg-neutral-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="max-w-[1280px] mx-auto px-4 py-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-16">
            <span className="material-symbols-outlined text-8xl text-m3-outline-variant mb-6">shopping_cart_off</span>
            <h2 className="text-2xl font-bold text-m3-on-surface mb-3">Giỏ hàng của bạn đang trống</h2>
            <p className="text-m3-on-surface-variant mb-8">
              Có vẻ như bạn chưa chọn được món đồ nào ưng ý. Hãy dạo quanh TL Market để khám phá thêm nhé!
            </p>
            <Link
              href="/products"
              className="px-10 py-4 text-white font-bold rounded-xl transition-all hover:-translate-y-1 inline-block"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
              }}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-6">
                Giỏ hàng <span className="text-m3-on-surface-variant font-normal text-lg">({items.length} sản phẩm)</span>
              </h1>

              <div className="space-y-4">
                {items.map((item) => {
                  const itemPrice = item.product.basePrice + item.variant.extraPrice
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-m3-outline-variant/30 flex gap-4"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-m3-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Product' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-m3-outline">
                            <span className="material-symbols-outlined text-3xl">image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-m3-on-surface">{item.product.productName}</h3>
                            <p className="text-sm text-m3-on-surface-variant">{item.variant.variantName}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-m3-on-surface-variant hover:text-error transition-colors p-1"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="text-lg font-bold text-m3-primary">
                            {formatPrice(itemPrice * item.quantity)}
                          </div>
                          <div className="flex items-center border border-m3-outline-variant rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                              className="px-3 py-1 hover:bg-m3-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="px-4 py-1 font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                              className="px-3 py-1 hover:bg-m3-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Summary */}
            <aside className="lg:col-span-4 sticky top-24">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-m3-outline-variant/30 space-y-6">
                {/* Voucher Input */}
                <div>
                  <label className="text-sm text-m3-on-surface-variant mb-2 block">Mã khuyến mãi</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã voucher..."
                      className="flex-grow bg-m3-surface-container-low border border-m3-outline-variant rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-m3-primary-container focus:border-m3-primary-container outline-none transition-all"
                    />
                    <button className="bg-m3-on-surface text-on-primary rounded-xl px-6 py-2 font-bold text-sm hover:opacity-90 transition-all">
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Summary Breakdown */}
                <div className="space-y-3 pt-4 border-t border-m3-outline-variant/30">
                  <div className="flex justify-between text-m3-on-surface-variant text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-success text-sm">
                    <span>Giảm giá</span>
                    <span>-0đ</span>
                  </div>
                  <div className="flex justify-between text-m3-on-surface-variant text-sm">
                    <span>Phí vận chuyển</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-m3-outline-variant/30">
                    <span className="font-bold text-m3-on-surface">Tổng cộng</span>
                    <span className="text-2xl font-bold text-m3-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
                  }}
                >
                  Tiến hành thanh toán
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

                <p className="text-center text-xs text-m3-on-surface-variant">
                  Đã bao gồm VAT (nếu có)
                </p>
              </div>

              <div className="mt-4 p-4 bg-info/10 rounded-xl flex items-start gap-3 border border-info/20">
                <span className="material-symbols-outlined text-info">info</span>
                <p className="text-xs leading-tight text-m3-on-surface-variant">
                  Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ. Thời gian giao hàng dự kiến 2-3 ngày.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

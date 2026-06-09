'use client'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_96 } from '@/lib/utils/placeholder'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Header from '@/components/Header'

export default function CartPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { data: cart, isLoading } = useCart(isAuthenticated)
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: updateItem } = useUpdateCartItem()
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)
  const [voucherInput, setVoucherInput] = useState('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login?from=/cart')
    }
  }, [mounted, isAuthenticated, router])

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-stack-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            <div className="lg:col-span-8 space-y-stack-md">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-28 bg-surface-container-high rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 bg-surface-container-high rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">Giỏ hàng của bạn</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Xem lại sản phẩm trước khi thanh toán.</p>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-section-gap text-center">
            <span className="material-symbols-outlined text-[80px] text-outline-variant mb-stack-md">shopping_basket</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Giỏ hàng trống</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl shadow-[0_10px_15px_-3px_rgba(30,76,253,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
            <div className="lg:col-span-8 space-y-stack-md">
              {items.map((item, index) => {
                const itemPrice = item.product.basePrice + item.variant.extraPrice
                const isRemoving = removingIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center group rounded-xl p-stack-md shadow-sm bg-surface/80 backdrop-blur-md border border-outline-variant/30"
                    style={{
                      opacity: isRemoving ? 0 : 1,
                      transform: isRemoving ? 'translateX(50px)' : 'none',
                      transition: 'opacity 0.3s, transform 0.3s',
                    }}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.productName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_96 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-3xl">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.product.productName}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">{item.variant.variantName}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors p-1"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-stack-md">
                        <div className="flex items-center gap-1 rounded-lg p-1 bg-surface-container-high">
                          <button
                            onClick={() => handleQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center font-bold font-body-md text-body-md">{item.quantity}</span>
                          <button
                            onClick={() => handleQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <p className="font-price-display text-price-display text-primary">{formatPrice(itemPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="lg:col-span-4 sticky top-28">
              <div className="rounded-xl p-stack-lg shadow-lg bg-surface/80 backdrop-blur-md border border-outline-variant/30">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg">Tổng đơn hàng</h2>

                <div className="mb-stack-lg">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm">Mã khuyến mãi</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="NHẬP MÃ"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      className="flex-grow bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 font-body-md text-body-md focus:ring-primary focus:border-primary outline-none uppercase tracking-wider"
                    />
                    <button
                      onClick={() => {
                        if (!voucherInput.trim()) { toast.error('Vui lòng nhập mã khuyến mãi'); return }
                        toast.info(`Mã "${voucherInput}" sẽ được áp dụng khi thanh toán`)
                      }}
                      className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label-md hover:brightness-110 transition-all"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                <div className="space-y-stack-md mb-stack-lg">
                  <div className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant">Tạm tính</span>
                    <span className="font-bold text-on-surface">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant">Phí vận chuyển</span>
                    <span className="font-bold text-primary">MIỄN PHÍ</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant">Giảm giá</span>
                    <span className="font-bold text-error">-0đ</span>
                  </div>
                  <div className="pt-stack-md border-t border-outline-variant">
                    <div className="flex justify-between items-center">
                      <span className="font-headline-sm text-headline-sm text-on-surface">Tổng cộng</span>
                      <span className="font-price-display text-price-display text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full orange-gradient orange-glow text-white font-label-md py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Tiến hành thanh toán
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

                <div className="mt-stack-lg flex flex-col gap-stack-sm">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary">verified</span>
                    <span className="font-caption text-caption text-on-surface-variant">Thanh toán an toàn với mã hóa.</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <span className="font-caption text-caption text-on-surface-variant">Miễn phí vận chuyển cho đơn trên 2.000.000đ.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useCart } from '@/lib/hooks/useCart'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_80 } from '@/lib/utils/placeholder'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { voucherApi } from '@/lib/api/voucherApi'
import { toast } from 'sonner'
import Header from '@/components/Header'

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data: cart, isLoading: cartLoading } = useCart(isAuthenticated)
  const { mutate: createOrder, isPending } = useCreateOrder()

  const [voucherCode, setVoucherCode] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [applyingVoucher, setApplyingVoucher] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/checkout')
    }
  }, [isAuthenticated, router])

  const items = cart?.items || []
  const total = cart?.totalPrice || 0
  const finalPrice = Math.max(0, total - appliedDiscount)

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return
    setApplyingVoucher(true)
    try {
      const res = await voucherApi.apply(voucherCode.trim(), total)
      const { discount } = res.data.data
      setAppliedDiscount(discount)
      toast.success('Áp dụng mã giảm giá thành công!')
    } catch {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn')
      setAppliedDiscount(0)
    } finally {
      setApplyingVoucher(false)
    }
  }

  const handleSubmitOrder = () => {
    if (items.length === 0) return
    createOrder({
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      voucherCode: voucherCode || undefined,
      note: [note, fullName ? `Họ tên: ${fullName}` : '', phoneNumber ? `SĐT: ${phoneNumber}` : '', shippingAddress ? `Địa chỉ: ${shippingAddress}` : ''].filter(Boolean).join('\n') || undefined,
    })
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-stack-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            <div className="lg:col-span-7 space-y-stack-lg">
              <div className="h-96 bg-surface-container-high rounded-xl" />
              <div className="h-64 bg-surface-container-high rounded-xl" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-96 bg-surface-container-high rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
          <div className="flex flex-col items-center justify-center py-section-gap text-center">
            <span className="material-symbols-outlined text-[80px] text-outline-variant mb-stack-md">shopping_cart_off</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Giỏ hàng trống</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
            <Link href="/cart" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-stack-lg font-caption text-caption text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-bold text-on-surface">Checkout</span>
        </nav>

        <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-lg">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-7 space-y-stack-lg">
            {/* Shipping */}
            <section className="bg-surface rounded-xl p-stack-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-stack-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Thông tin giao hàng</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Họ và tên</label>
                  <input type="text" placeholder="Nguyen Van A" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Số điện thoại</label>
                  <input type="tel" placeholder="0901234567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Địa chỉ giao hàng</label>
                  <input type="text" placeholder="123 Example Street, District 1, HCMC" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Ghi chú (Không bắt buộc)</label>
                  <textarea placeholder="Ghi chú về đơn hàng của bạn..." value={note} onChange={(e) => setNote(e.target.value)}
                    rows={3} className="p-4 rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-surface rounded-xl p-stack-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-stack-lg">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-stack-md">
                {[
                  { id: 'zalopay', label: 'E-wallet ZaloPay', icon: 'ZP', color: 'bg-blue-500' },
                  { id: 'momo', label: 'E-wallet Momo', icon: 'M', color: 'bg-pink-600' },
                  { id: 'card', label: 'Credit or Debit Card', icon: 'credit_card', isIcon: true },
                  { id: 'cod', label: 'Cash on Delivery (COD)', icon: 'hand_gesture', isIcon: true },
                ].map((pm) => (
                  <label key={pm.id}
                    className={`flex items-center justify-between p-stack-md rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-primary bg-primary-container/10'
                        : 'border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)} className="w-5 h-5 text-primary border-outline-variant focus:ring-primary" />
                      <div className="flex items-center gap-3">
                        {pm.isIcon ? (
                          <span className="material-symbols-outlined text-on-surface-variant text-3xl">{pm.icon}</span>
                        ) : (
                          <div className={`w-10 h-10 rounded-lg ${pm.color} flex items-center justify-center text-white font-bold text-xs`}>{pm.icon}</div>
                        )}
                        <span className="font-label-md text-label-md text-on-surface">{pm.label}</span>
                      </div>
                    </div>
                    {paymentMethod === pm.id && <span className="font-label-md text-label-md text-primary">Đã chọn</span>}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5 sticky top-24">
            <div className="rounded-2xl p-stack-lg shadow-lg bg-primary-container/20 border border-primary/20">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg">Tóm tắt đơn hàng</h2>

              <div className="space-y-stack-lg mb-stack-lg max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c4c5d9 transparent' }}>
                {items.map((item) => {
                  const itemPrice = item.product.basePrice + item.variant.extraPrice
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-surface rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant">
                        {item.product.images[0] ? (
                          <img src={item.product.images[0].url} alt={item.product.productName}
                            className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_80 }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined text-2xl">image</span>
                          </div>
                        )}
                        <span className="absolute top-1 right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold bg-on-surface">{item.quantity}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-label-md text-label-md text-on-surface">{item.product.productName}</h3>
                        <p className="font-caption text-caption text-on-surface-variant">{item.variant.variantName}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-price-display text-price-display text-primary">{formatPrice(itemPrice * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 mb-stack-lg">
                <input type="text" placeholder="Promo code" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-grow h-12 px-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                <button onClick={handleApplyVoucher} disabled={applyingVoucher || !voucherCode.trim()}
                  className="px-6 h-12 border border-primary text-primary rounded-xl hover:bg-primary-container/20 transition-all font-label-md disabled:opacity-50">
                  {applyingVoucher ? '...' : 'Áp dụng'}
                </button>
              </div>

              <div className="space-y-stack-md border-t border-outline-variant pt-stack-lg mb-stack-lg">
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-body-md text-body-md">Tạm tính</span>
                  <span className="font-price-display text-price-display">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-body-md text-body-md">Phí vận chuyển</span>
                  <span className="font-price-display text-price-display text-primary">Miễn phí</span>
                </div>
                <div className="flex justify-between" style={{ color: '#3432c8' }}>
                  <span className="font-body-md text-body-md">Giảm giá</span>
                  <span className="font-price-display text-price-display text-error">{appliedDiscount > 0 ? `-${formatPrice(appliedDiscount)}` : '-0đ'}</span>
                </div>
                <div className="flex justify-between items-center pt-stack-md border-t border-outline-variant">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Tổng cộng</span>
                  <span className="font-price-display text-price-display text-primary">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <button onClick={handleSubmitOrder} disabled={isPending}
                className="w-full orange-gradient orange-glow text-white font-label-md py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                <span>{isPending ? 'Đang xử lý...' : 'Đặt hàng'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <p className="text-center mt-stack-lg font-caption text-caption text-on-surface-variant">
                Bằng cách đặt hàng, bạn đồng ý với{' '}
                <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a> và{' '}
                <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

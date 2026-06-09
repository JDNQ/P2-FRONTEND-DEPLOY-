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
      <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff' }}>
        <div className="max-w-[1280px] mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-[#eeecff] rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div className="h-96 bg-[#eeecff] rounded-xl" />
              <div className="h-64 bg-[#eeecff] rounded-xl" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-96 bg-[#eeecff] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
        <div className="max-w-[1280px] mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[80px] text-[#c4c5d9] mb-4">shopping_cart_off</span>
            <h2 className="text-[24px] font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-[#444656] mb-8 text-[16px]">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
            <Link
              href="/cart"
              className="text-white px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all inline-block"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
                boxShadow: '0 4px 14px 0 rgba(255, 107, 0, 0.3)'
              }}
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-[#444656] text-[12px] leading-[16px]">
          <Link href="/" className="hover:text-[#0035d1] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/cart" className="hover:text-[#0035d1] transition-colors">Shopping Cart</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-medium" style={{ color: '#08006c' }}>Checkout</span>
        </div>

        <h1 className="text-[48px] font-extrabold leading-[1.2] tracking-tight mb-12" style={{ fontFamily: 'Sora, sans-serif' }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-[#c4c5d9]" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#0035d1]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Shipping Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] leading-[20px] font-medium text-[#444656]">Full Name</label>
                  <input
                    type="text"
                    placeholder="Nguyen Van A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-[#c4c5d9] focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none transition-all bg-[#fcf8ff]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] leading-[20px] font-medium text-[#444656]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0901234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-[#c4c5d9] focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none transition-all bg-[#fcf8ff]"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[14px] leading-[20px] font-medium text-[#444656]">Shipping Address</label>
                  <input
                    type="text"
                    placeholder="123 Example Street, District 1, HCMC"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-[#c4c5d9] focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none transition-all bg-[#fcf8ff]"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[14px] leading-[20px] font-medium text-[#444656]">Order Note (Optional)</label>
                  <textarea
                    placeholder="Notes about your order, e.g. special delivery instructions."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="p-4 rounded-xl border border-[#c4c5d9] focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none transition-all bg-[#fcf8ff] resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-[#c4c5d9]" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#0035d1]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Payment Methods</h2>
              </div>
              <div className="space-y-4">
                {/* ZaloPay */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'zalopay'
                      ? 'border-[#0035d1] bg-[#dee1ff]/20'
                      : 'border-[#c4c5d9] hover:bg-[#f5f2ff]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'zalopay'}
                      onChange={() => setPaymentMethod('zalopay')}
                      className="w-5 h-5 text-[#0035d1] border-[#c4c5d9] focus:ring-[#0035d1]"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-xs">ZP</div>
                      <span className="text-[14px] leading-[20px] font-medium">E-wallet ZaloPay</span>
                    </div>
                  </div>
                  <span className={`font-medium text-sm ${paymentMethod === 'zalopay' ? 'text-[#0035d1]' : 'text-[#444656]'}`}>Preferred</span>
                </label>

                {/* Momo */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-[#0035d1] bg-[#dee1ff]/20'
                      : 'border-[#c4c5d9] hover:bg-[#f5f2ff]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="w-5 h-5 text-[#0035d1] border-[#c4c5d9] focus:ring-[#0035d1]"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#A50064] flex items-center justify-center text-white font-bold text-xs">M</div>
                      <span className="text-[14px] leading-[20px] font-medium">E-wallet Momo</span>
                    </div>
                  </div>
                </label>

                {/* Credit Card */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0035d1] bg-[#dee1ff]/20'
                      : 'border-[#c4c5d9] hover:bg-[#f5f2ff]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 text-[#0035d1] border-[#c4c5d9] focus:ring-[#0035d1]"
                    />
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#747688] text-3xl">credit_card</span>
                      <span className="text-[14px] leading-[20px] font-medium">Credit or Debit Card</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-[#eeecff] border border-[#c4c5d9] px-2 py-1 rounded">VISA</span>
                    <span className="text-[10px] bg-[#eeecff] border border-[#c4c5d9] px-2 py-1 rounded">MASTER</span>
                  </div>
                </label>

                {/* COD */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0035d1] bg-[#dee1ff]/20'
                      : 'border-[#c4c5d9] hover:bg-[#f5f2ff]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-5 h-5 text-[#0035d1] border-[#c4c5d9] focus:ring-[#0035d1]"
                    />
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#747688] text-3xl">hand_gesture</span>
                      <span className="text-[14px] leading-[20px] font-medium">Cash on Delivery (COD)</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5 sticky top-24">
            <div className="rounded-2xl p-8 shadow-lg border border-[#1e4cfd]/20" style={{ backgroundColor: '#e1dfff' }}>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>Order Summary</h2>

              {/* Product List */}
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c4c5d9 transparent' }}>
                {items.map((item) => {
                  const itemPrice = item.product.basePrice + item.variant.extraPrice
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-[#c4c5d9]">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.productName}
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_80 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#747688]">
                            <span className="material-symbols-outlined text-2xl">image</span>
                          </div>
                        )}
                        <span className="absolute top-1 right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#08006c' }}>
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold leading-tight mb-1">{item.product.productName}</h3>
                        <p className="text-[12px] leading-[16px] text-[#444656]">{item.variant.variantName}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[20px] font-bold leading-[1] text-[#0035d1]">{formatPrice(itemPrice * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Voucher */}
              <div className="flex gap-2 mb-8">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-grow h-12 px-4 rounded-xl border border-[#c4c5d9] focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none transition-all bg-white"
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={applyingVoucher || !voucherCode.trim()}
                  className="px-6 h-12 text-[14px] leading-[20px] font-medium border border-[#0035d1] text-[#0035d1] rounded-xl hover:bg-[#dee1ff]/20 transition-all font-bold disabled:opacity-50"
                >
                  {applyingVoucher ? '...' : 'Apply'}
                </button>
              </div>

              {/* Pricing */}
              <div className="space-y-4 border-t border-[#c4c5d9] pt-6 mb-8">
                <div className="flex justify-between text-[#444656]">
                  <span className="text-[16px] leading-[24px]">Subtotal</span>
                  <span className="text-[20px] font-bold leading-[1]">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#444656]">
                  <span className="text-[16px] leading-[24px]">Shipping Fee</span>
                  <span className="text-[20px] font-bold leading-[1]">Miễn phí</span>
                </div>
                <div className="flex justify-between" style={{ color: '#3432c8' }}>
                  <span className="text-[16px] leading-[24px]">Voucher Discount</span>
                  <span className="text-[20px] font-bold leading-[1]" style={{ color: '#ba1a1a' }}>{appliedDiscount > 0 ? `-${formatPrice(appliedDiscount)}` : '-0đ'}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#c4c5d9]">
                  <span className="text-xl font-extrabold" style={{ fontFamily: 'Sora, sans-serif' }}>Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#0035d1]" style={{ fontFamily: 'Sora, sans-serif' }}>{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={handleSubmitOrder}
                disabled={isPending}
                className="w-full py-5 text-white rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
                  boxShadow: '0 4px 14px 0 rgba(255, 107, 0, 0.25)',
                  fontFamily: 'Sora, sans-serif'
                }}
                onMouseDown={(e) => { (e.target as HTMLButtonElement).style.scale = '0.98' }}
                onMouseUp={(e) => { (e.target as HTMLButtonElement).style.scale = '1' }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.scale = '1' }}
              >
                <span>{isPending ? 'Processing...' : 'Place Order'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <p className="text-center mt-6 text-[12px] leading-[16px] text-[#444656]">
                By placing your order, you agree to our{' '}
                <a href="#" className="underline hover:text-[#0035d1] transition-colors">Terms of Service</a> and{' '}
                <a href="#" className="underline hover:text-[#0035d1] transition-colors">Privacy Policy</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

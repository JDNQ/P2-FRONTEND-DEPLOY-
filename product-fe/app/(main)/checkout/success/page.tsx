'use client'
import confetti from 'canvas-confetti'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const displayId = orderId ? `#TLM-${orderId}` : '#TLM-000000'

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f97316', '#ea580c', '#22c55e', '#ff2d2d'],
    })
  }, [])

  return (
    <div className="flex items-center justify-center px-gutter py-section-gap relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-primary-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-primary-50" />

      <div className="max-w-2xl w-full text-center space-y-6 z-20">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 animate-check bg-success/10 border-success/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <span
              className="material-symbols-outlined text-[48px] md:text-[64px] text-success"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
            >
              check_circle
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-display-lg-mobile md:text-display-lg text-on-surface">Đặt hàng thành công!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
            Cảm ơn bạn đã mua sắm tại TL Market. Chúng tôi đã nhận đơn hàng và đang chuẩn bị giao cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="p-6 rounded-2xl text-left shadow-sm bg-white border border-border-subtle">
            <span className="font-label-md text-label-md text-on-surface-variant mb-1 block uppercase tracking-wider">Mã đơn hàng</span>
            <div className="flex items-center justify-between">
              <span className="font-heading text-headline-sm text-on-surface">{displayId}</span>
              <button
                className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
                title="Sao chép mã đơn"
                onClick={() => navigator.clipboard.writeText(displayId)}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">content_copy</span>
              </button>
            </div>
          </div>
          <div className="p-6 rounded-2xl text-left shadow-sm bg-white border border-border-subtle">
            <span className="font-label-md text-label-md text-on-surface-variant mb-1 block uppercase tracking-wider">Dự kiến giao hàng</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">local_shipping</span>
              <span className="font-heading text-headline-sm text-on-surface">3-5 ngày làm việc</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/orders"
            className="w-full sm:w-auto px-10 py-4 orange-gradient orange-glow text-white rounded-xl font-bold font-label-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Xem đơn hàng của tôi
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-10 py-4 border-2 border-border-subtle text-on-surface rounded-xl font-bold font-label-md hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="pt-12">
          <div className="h-1 w-24 mx-auto rounded-full mb-8 bg-border-subtle" />
          <p className="font-caption text-caption text-on-surface-variant">
            Email xác nhận đã được gửi đến địa chỉ đăng ký của bạn.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes check-bounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check {
          animation: check-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface-page text-on-surface">
      <Header />
      <Suspense fallback={<div className="flex items-center justify-center py-20 text-on-surface-variant">Đang tải...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
}

'use client'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#0035d1', '#f97316', '#22c55e', '#4958a9'],
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <div className="flex items-center justify-center px-gutter py-section-gap relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-primary/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-tertiary/10" />

        <div className="max-w-2xl w-full text-center space-y-6 z-20">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 animate-check"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)',
              }}
            >
              <span
                className="material-symbols-outlined text-[48px] md:text-[64px]"
                style={{ color: '#22c55e', fontVariationSettings: "'FILL' 1, 'wght' 600" }}
              >
                check_circle
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display-lg text-display-lg text-on-surface">Order Successful!</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
              Thank you for your purchase. We&apos;ve received your order and we&apos;re getting it ready for shipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div className="p-6 rounded-xl text-left shadow-sm bg-surface/80 backdrop-blur-md border border-outline-variant/30">
              <span className="font-label-md text-label-md text-outline mb-1 block uppercase tracking-wider">Order ID</span>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">#TLM-8829410</span>
                <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors" title="Copy Order ID"
                  onClick={() => navigator.clipboard.writeText('TLM-8829410')}>
                  <span className="material-symbols-outlined text-primary text-[20px]">content_copy</span>
                </button>
              </div>
            </div>
            <div className="p-6 rounded-xl text-left shadow-sm bg-surface/80 backdrop-blur-md border border-outline-variant/30">
              <span className="font-label-md text-label-md text-outline mb-1 block uppercase tracking-wider">Estimated Delivery</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">local_shipping</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">3-5 business days</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/orders"
              className="w-full sm:w-auto px-10 py-4 orange-gradient orange-glow text-white rounded-xl font-bold font-label-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              View My Orders
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/products"
              className="w-full sm:w-auto px-10 py-4 border-2 border-outline-variant text-on-surface rounded-xl font-bold font-label-md hover:bg-surface-variant transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">shopping_bag</span>
              Back to Shopping
            </Link>
          </div>

          <div className="pt-12">
            <div className="h-1 w-24 mx-auto rounded-full mb-8 bg-outline-variant" />
            <p className="font-caption text-caption text-outline">A confirmation email has been sent to your registered address.</p>
          </div>
        </div>
      </div>
      <Footer />

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

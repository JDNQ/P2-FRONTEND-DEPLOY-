'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-section-gap flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[100px] text-error mb-stack-md">warning</span>
        <h1 className="font-heading text-display-lg text-on-surface mb-2">Có lỗi xảy ra</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">Vui lòng thử lại sau.</p>
        <div className="flex gap-4">
          <button onClick={reset} className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
            Thử lại
          </button>
          <Link href="/" className="border-2 border-primary text-primary font-label-md px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
            Về trang chủ
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

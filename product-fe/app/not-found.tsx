'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-section-gap flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-[100px] text-outline-variant mb-stack-md">error_outline</span>
        <h1 className="font-heading text-display-lg text-on-surface mb-2">404</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">Trang bạn tìm kiếm không tồn tại.</p>
        <Link href="/" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
          Về trang chủ
        </Link>
      </div>
      <Footer />
    </div>
  )
}

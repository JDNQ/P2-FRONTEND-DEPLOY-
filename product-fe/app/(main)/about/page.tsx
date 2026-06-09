'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-display-lg text-on-surface">Về TL Market</h1>
            <p className="text-body-lg text-on-surface-variant">Giải pháp mua sắm trực tuyến hàng đầu Việt Nam</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-50 space-y-6">
            <div className="space-y-4">
              <h2 className="font-heading text-headline-sm text-on-surface">Câu chuyện của chúng tôi</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                TL Market ra đời với sứ mệnh mang đến trải nghiệm mua sắm trực tuyến tốt nhất cho người Việt. 
                Chúng tôi kết nối hàng ngàn nhà cung cấp uy tín với hàng triệu khách hàng trên khắp cả nước.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="font-heading text-headline-sm text-on-surface">Cam kết của chúng tôi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: 'verified', title: 'Hàng Chính Hãng', desc: 'Cam kết 100% sản phẩm chính hãng từ nhà sản xuất.' },
                  { icon: 'local_shipping', title: 'Giao Hàng Nhanh', desc: 'Giao hàng trong 2 giờ tại nội thành.' },
                  { icon: 'history', title: 'Đổi Trả Dễ Dàng', desc: 'Đổi trả trong 30 ngày nếu sản phẩm lỗi.' },
                  { icon: 'support_agent', title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 p-4 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary mt-1">{item.icon}</span>
                    <div>
                      <h3 className="font-label-md text-label-md font-bold text-on-surface">{item.title}</h3>
                      <p className="font-caption text-caption text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-heading font-bold hover:brightness-110 transition-all">
              Khám phá sản phẩm
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

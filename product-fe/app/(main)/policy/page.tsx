'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-display-lg text-on-surface">Chính sách</h1>
            <p className="text-body-lg text-on-surface-variant">Thông tin về bảo hành, đổi trả và hoàn tiền</p>
          </div>
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-50 space-y-4">
              <h2 className="font-heading text-headline-sm text-on-surface">Chính sách bảo hành</h2>
              <ul className="space-y-3">
                {[
                  'Sản phẩm được bảo hành chính hãng từ 12-24 tháng tùy theo nhà sản xuất.',
                  'Bảo hành áp dụng cho các lỗi từ nhà sản xuất, không bao gồm hư hỏng do người dùng.',
                  'Khách hàng cần giữ lại hóa đơn mua hàng để được bảo hành.',
                  'Thời gian xử lý bảo hành từ 5-7 ngày làm việc.',
                  'Sản phẩm được bảo hành tại tất cả trung tâm bảo hành ủy quyền trên toàn quốc.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-50 space-y-4">
              <h2 className="font-heading text-headline-sm text-on-surface">Đổi trả & Hoàn tiền</h2>
              <ul className="space-y-3">
                {[
                  'Đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng.',
                  'Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và đầy đủ phụ kiện.',
                  'Hoàn tiền 100% giá trị sản phẩm nếu lỗi từ nhà sản xuất.',
                  'Thời gian xử lý hoàn tiền từ 3-5 ngày làm việc sau khi nhận được hàng trả lại.',
                  'Miễn phí vận chuyển cho đơn hàng đổi trả.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

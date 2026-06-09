'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PromotionsPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
            <Header />
            <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
                <h1 className="font-heading text-display-lg text-on-surface mb-stack-lg">Khuyến mãi & Ưu đãi</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-section-gap">
                    Các chương trình khuyến mãi, flash sale và ưu đãi đặc biệt dành riêng cho bạn.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                    {[
                        { title: 'Flash Sale Cuối Tuần', desc: 'Giảm đến 50% cho tất cả mặt hàng điện tử.', badge: 'Đang diễn ra' },
                        { title: 'Miễn phí vận chuyển', desc: 'Miễn phí giao hàng cho đơn từ 200.000đ.', badge: 'Ưu đãi' },
                        { title: 'Mã giảm giá 100K', desc: 'Nhập mã TL100 cho đơn hàng đầu tiên.', badge: 'Mới' },
                        { title: 'Ưu đãi thành viên', desc: 'Tích điểm đổi quà và giảm giá độc quyền.', badge: 'Thành viên' },
                    ].map((promo) => (
                        <div key={promo.title} className="bg-surface-container-low rounded-2xl p-stack-lg border border-outline-variant/20 hover:shadow-lg transition-all cursor-pointer">
                            <span className="px-3 py-1 bg-primary-50 text-primary text-sm font-bold rounded-full mb-stack-md inline-block">{promo.badge}</span>
                            <h3 className="font-heading text-headline-sm text-on-surface mb-stack-sm">{promo.title}</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">{promo.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
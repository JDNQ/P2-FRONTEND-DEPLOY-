'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
            <Header />
            <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
                <h1 className="font-heading text-display-lg text-on-surface mb-stack-lg">Giới thiệu về TL Market</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                    <div className="space-y-stack-md">
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            TL Market là nền tảng thương mại điện tử hàng đầu Việt Nam, cung cấp đa dạng các sản phẩm từ điện tử, thời trang, gia dụng đến mỹ phẩm.
                        </p>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                            Với cam kết hàng chính hãng 100%, giao hàng nhanh chóng và dịch vụ hỗ trợ khách hàng tận tâm, TL Market mang đến trải nghiệm mua sắm tốt nhất cho người Việt.
                        </p>
                    </div>
                    <div className="bg-surface-container-low rounded-2xl p-stack-lg flex items-center justify-center min-h-[300px]">
                        <span className="material-symbols-outlined text-6xl text-outline-variant">storefront</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
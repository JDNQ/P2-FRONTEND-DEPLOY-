'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
            <Header />
            <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
                <h1 className="font-heading text-display-lg text-on-surface mb-stack-lg">Tin tức công nghệ</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-section-gap">
                    Cập nhật những tin tức công nghệ mới nhất, đánh giá sản phẩm và xu hướng thị trường.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
                    {[
                        { title: 'Xu hướng công nghệ 2026', desc: 'Khám phá những công nghệ đột phá sẽ định hình tương lai.' },
                        { title: 'Đánh giá flagship mới nhất', desc: 'Chi tiết về những smartphone đáng mua nhất hiện nay.' },
                        { title: 'Mẹo mua sắm thông minh', desc: 'Cách chọn sản phẩm phù hợp với nhu cầu và ngân sách.' },
                    ].map((article) => (
                        <div key={article.title} className="bg-surface-container-low rounded-2xl p-stack-lg hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-full h-40 bg-surface-container-high rounded-xl mb-stack-md flex items-center justify-center text-outline-variant">
                                <span className="material-symbols-outlined text-4xl">newspaper</span>
                            </div>
                            <h3 className="font-heading text-headline-sm text-on-surface mb-stack-sm">{article.title}</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">{article.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
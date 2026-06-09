'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <main className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-display-lg text-on-surface">Hướng dẫn mua hàng</h1>
            <p className="text-body-lg text-on-surface-variant">Các bước mua sắm đơn giản tại TL Market</p>
          </div>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Tìm kiếm sản phẩm', desc: 'Sử dụng thanh tìm kiếm hoặc duyệt qua danh mục sản phẩm để tìm món hàng bạn yêu thích.' },
              { step: '02', title: 'Chọn phân loại & số lượng', desc: 'Chọn đúng phiên bản, màu sắc, kích thước và số lượng mong muốn.' },
              { step: '03', title: 'Thêm vào giỏ hàng', desc: 'Nhấn "Thêm vào giỏ" để lưu sản phẩm. Bạn có thể tiếp tục mua sắm hoặc vào giỏ để thanh toán.' },
              { step: '04', title: 'Kiểm tra giỏ hàng', desc: 'Xem lại danh sách sản phẩm, số lượng và tổng tiền trước khi thanh toán.' },
              { step: '05', title: 'Điền thông tin giao hàng', desc: 'Nhập địa chỉ nhận hàng, số điện thoại và chọn phương thức vận chuyển.' },
              { step: '06', title: 'Xác nhận & thanh toán', desc: 'Chọn phương thức thanh toán, kiểm tra lại đơn hàng và xác nhận.' },
              { step: '07', title: 'Theo dõi đơn hàng', desc: 'Vào mục "Đơn hàng" để theo dõi trạng thái đơn hàng của bạn.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-neutral-50">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-heading font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-heading text-headline-sm text-on-surface mb-1">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

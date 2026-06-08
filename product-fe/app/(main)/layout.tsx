'use client'
import { useCart } from '@/lib/hooks/useCart'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: cart } = useCart()

  return (
    <div className="min-h-screen bg-surface-page text-on-surface font-body-md antialiased">
      {/* Announcement Bar */}
      <div className="bg-primary text-on-primary py-2 text-center text-sm font-medium tracking-wide">
        Miễn phí vận chuyển đơn từ 500k
      </div>

      {/* Header */}
      <header className="bg-surface sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center px-4 py-4 w-full max-w-[1280px] mx-auto">
          <a href="/">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/products" className="text-m3-on-surface-variant hover:text-m3-primary transition-colors duration-200">
              Sản phẩm
            </a>
            <a href="/cart" className="text-m3-on-surface-variant hover:text-m3-primary transition-colors duration-200">
              Giỏ hàng
            </a>
            <a href="/orders" className="text-m3-on-surface-variant hover:text-m3-primary transition-colors duration-200">
              Đơn hàng
            </a>
            <a href="/profile" className="text-m3-on-surface-variant hover:text-m3-primary transition-colors duration-200">
              Tài khoản
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/profile" className="p-2 hover:bg-m3-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined text-m3-primary">person</span>
            </a>
            <a href="/cart" className="relative p-2 hover:bg-m3-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined text-m3-primary">shopping_cart</span>
              <span className="absolute -top-0.5 -right-0.5 bg-secondary text-on-secondary text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart?.items?.length || 0}
              </span>
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-m3-surface-container-highest border-t border-m3-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-16 max-w-[1280px] mx-auto">
          <div className="space-y-4">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-8 w-auto" />
            <p className="text-m3-on-surface-variant text-sm">
              Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Cung cấp hàng ngàn sản phẩm từ những thương hiệu uy tín nhất.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-semibold text-m3-on-surface">Hỗ trợ khách hàng</h5>
            <ul className="space-y-2 text-m3-on-surface-variant text-sm">
              <li><a href="#" className="hover:text-secondary underline transition-all">About Us</a></li>
              <li><a href="#" className="hover:text-secondary underline transition-all">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-secondary underline transition-all">Contact Support</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-semibold text-m3-on-surface">Chính sách</h5>
            <ul className="space-y-2 text-m3-on-surface-variant text-sm">
              <li><a href="#" className="hover:text-secondary underline transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary underline transition-all">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-semibold text-m3-on-surface">Đăng ký nhận tin</h5>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="bg-surface border border-m3-outline-variant rounded-xl p-3 text-sm"
              />
              <button className="bg-m3-primary text-on-primary font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-m3-outline-variant py-8 text-center text-m3-on-surface-variant text-sm">
          © 2024 TL Market. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

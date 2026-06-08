export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-heading text-2xl font-bold text-primary-600">
            TL Market
          </a>
          <nav className="flex gap-6">
            <a href="/products" className="text-neutral-600 hover:text-primary-500 font-medium">
              Sản phẩm
            </a>
            <a href="/cart" className="text-neutral-600 hover:text-primary-500 font-medium">
              Giỏ hàng
            </a>
            <a href="/orders" className="text-neutral-600 hover:text-primary-500 font-medium">
              Đơn hàng
            </a>
            <a href="/profile" className="text-neutral-600 hover:text-primary-500 font-medium">
              Tài khoản
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-neutral-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-neutral-400">© 2024 TL Market. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
}

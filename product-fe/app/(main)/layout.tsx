'use client'
import { useCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { data: cart } = useCart(isAuthenticated)

  return (
    <div className="min-h-screen bg-surface-page text-on-background font-body antialiased">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-outline-variant shadow-sm"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(252, 248, 255, 0.85)' }}
      >
        <div className="flex justify-between items-center px-4 py-3 w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-8">
            <a href="/">
              <img src="/logo-removebg-preview.png" alt="TL Market" className="h-10 w-auto" />
            </a>
            <div className="hidden md:flex gap-6 text-sm text-m3-on-surface-variant">
              <a href="/products" className="hover:text-primary transition-colors duration-200 font-bold border-b-2 border-primary text-primary">Categories</a>
              <a href="/products" className="hover:text-primary transition-colors duration-200">Flash Sales</a>
              <a href="/products" className="hover:text-primary transition-colors duration-200">New Arrivals</a>
              <a href="/products" className="hover:text-primary transition-colors duration-200">Brands</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              />
              <span className="material-symbols-outlined absolute left-3 text-outline">search</span>
            </div>
            <div className="flex items-center gap-4 text-m3-on-surface-variant">
              <a href="/profile" className="flex items-center hover:text-primary transition-transform active:scale-95">
                <span className="material-symbols-outlined">person</span>
              </a>
              <a href="/cart" className="flex items-center hover:text-primary transition-transform active:scale-95 relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute -top-2 -right-2 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                  style={{ background: '#f97316' }}
                >
                  {cart?.items?.length || 0}
                </span>
              </a>
              <button className="md:hidden flex items-center">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-16 max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-4">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-10 w-auto self-start" />
            <p className="text-xs text-m3-on-surface-variant leading-relaxed">
              The ultimate destination for tech, fashion, and lifestyle. Redefining the e-commerce experience one click at a time.
            </p>
            <div className="flex gap-4 mt-2">
              <a className="h-8 w-8 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined text-sm">public</span></a>
              <a className="h-8 w-8 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface-variant hover:bg-retail-orange hover:text-white transition-all" href="#"><span className="material-symbols-outlined text-sm">alternate_email</span></a>
              <a className="h-8 w-8 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface-variant transition-all" href="#" style={{ '--hover-bg': '#3432c8' } as React.CSSProperties}><span className="material-symbols-outlined text-sm">share</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-m3-on-surface mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="flex flex-col gap-3 text-xs text-m3-on-surface-variant">
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">About Us</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Sustainability</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Careers</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Press Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-m3-on-surface mb-6 uppercase tracking-wider text-xs">Customer Service</h4>
            <ul className="flex flex-col gap-3 text-xs text-m3-on-surface-variant">
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Shipping Policy</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Returns &amp; Refunds</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">Contact Support</a></li>
              <li><a className="hover:text-secondary underline transition-all opacity-80 hover:opacity-100" href="#">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-m3-on-surface mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
            <p className="text-xs text-m3-on-surface-variant mb-4">Get the latest deals and drops directly in your inbox.</p>
            <div className="flex flex-col gap-2">
              <input className="bg-surface rounded-xl border border-outline-variant px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm" placeholder="your@email.com" type="email" />
              <button className="bg-primary text-white font-bold py-2 rounded-xl hover:bg-retail-orange transition-colors text-sm">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant py-8 px-4">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-m3-on-surface-variant">
            <p>© 2024 TL Market. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import Link from 'next/link'
import { useState, type FormEvent, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const { data: cart } = useCart(isAuthenticated)

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/login')
  }

  // Pre-fill search input if on search page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const query = params.get('search') || params.get('searchTerm') || ''
      setSearch(query)
    }
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/products', label: 'Sản phẩm' },
    { href: '/about', label: 'Giới thiệu' },
    { href: '/news', label: 'Tin tức' },
    { href: '/promotions', label: 'Khuyến mãi' },
  ]

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/20 shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center w-full px-gutter py-3.5 max-w-container-max mx-auto">
        {/* Brand & Nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-102">
            <img alt="TL Market Logo" className="h-10 w-auto" src="/logo-removebg-preview.png" />
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-label-md text-label-md transition-all relative py-1 ${isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative group">
            <input
              className="w-full bg-surface-container/60 border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline/60 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/70 group-focus-within:text-primary transition-colors">
              search
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* User Utilities */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-primary relative ${pathname === '/wishlist' ? 'bg-surface-container text-primary' : ''
              }`}
          >
            <span className="material-symbols-outlined font-normal">favorite</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className={`p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-primary relative cursor-pointer group ${pathname === '/cart' ? 'bg-surface-container text-primary' : ''
              }`}
          >
            <span className="material-symbols-outlined font-normal">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 orange-gradient orange-glow text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold transition-transform group-hover:scale-110">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account / Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-surface-container rounded-full transition-all border border-outline-variant/30 text-on-surface hover:border-primary/50 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-white">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-primary uppercase">
                        {user?.username?.charAt(0) || 'T'}
                      </span>
                    )}
                  </div>
                  <span className="font-label-md text-label-md font-semibold hidden sm:block truncate max-w-[100px]">
                    {user?.username || 'Tài khoản'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl p-1">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">Trang cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">Đơn hàng của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="cursor-pointer">Thông báo</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white orange-gradient orange-glow rounded-xl transition-transform active:scale-[0.97]"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
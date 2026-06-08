'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { ShoppingCart, User, Heart, Bell, Search, Menu, X, LogOut, LayoutDashboard, ChevronDown, Settings, FileText, ShieldCheck } from 'lucide-react'
import { useApp } from '@/lib/store'
import { deleteCookie } from '@/lib/api'


export type UserInfo = {
    username?: string
    role?: string
    name?: string
}

interface HeaderProps {
    onToggleSidebar?: () => void
    user?: UserInfo | null
    onLogout?: () => void
}

export default function Header({ onToggleSidebar, user: adminUser, onLogout }: HeaderProps) {
    const router = useRouter()
    const { cart, isLoggedIn, user } = useApp()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isAccountOpen, setIsAccountOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const accountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
                setIsAccountOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        deleteCookie("token", { path: "/" })
        localStorage.removeItem("user")
        setIsAccountOpen(false)
        router.push("/")
    }

    const displayName = user?.name || user?.username || 'Tài khoản'
    const avatarChar = (displayName && displayName !== 'Tài khoản') ? displayName.charAt(0).toUpperCase() : '?'

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = searchQuery.trim()
            if (query) {
                router.push(`/products?search=${encodeURIComponent(query)}`)
            } else {
                router.push('/products')
            }
        }
    }

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const isAdminMode = !!adminUser

    return (
        <>
            {/* Top Promo Bar - Only show in regular user mode */}
            {!isAdminMode && (
                <div style={{ backgroundColor: '#1e3a6e' }} className="text-white text-xs py-2 px-4 text-center">
                    <p>Miễn phí vận chuyển cho đơn hàng từ 100.000 ₫ | Hoàn tiền 30 ngày nếu không hài lòng</p>
                </div>
            )}

            {/* Main Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className={`${isAdminMode ? 'px-6' : 'max-w-7xl mx-auto px-4'} py-3`}>
                    {/* Admin Mode Header */}
                    {isAdminMode && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onToggleSidebar}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                title="Toggle sidebar"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>

                            <div className="flex items-center gap-4">
                                <LayoutDashboard className="w-6 h-6" style={{ color: '#1e3a6e' }} />
                                <span className="font-bold text-lg" style={{ color: '#1e3a6e' }}>Admin Dashboard</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{adminUser?.username}</span>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Regular User Mode Header */}
                    {!isAdminMode && (
                        <>
                            {/* Desktop Header */}
                            <div className="hidden md:flex items-center justify-between gap-4">
                                {/* Logo */}
                                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                                    <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#f97316' }}>
                                        TL
                                    </div>
                                    <span className="font-bold text-lg" style={{ color: '#1e3a6e' }}>Market</span>
                                </Link>

                                {/* Search Bar */}
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearchSubmit}
                                            placeholder="Tìm kiếm sản phẩm..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f97316]"
                                        />

                                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" aria-hidden />

                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-6">
                                    <Link href="/orders" className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition" aria-label="Đơn hàng">
                                        <Bell className="w-6 h-6" />
                                        <span className="text-sm hidden lg:inline">Đơn hàng</span>
                                    </Link>


                                    <Link href="/products" className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition" aria-label="Sản phẩm">
                                        <Heart className="w-6 h-6" />
                                        <span className="text-sm hidden lg:inline">Yêu thích</span>
                                    </Link>

                                    <Link href="/cart" className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition relative">

                                        <ShoppingCart className="w-6 h-6" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ backgroundColor: '#ef4444' }}>
                                                {cartCount}
                                            </span>
                                        )}
                                        <span className="text-sm hidden lg:inline">Giỏ hàng</span>
                                    </Link>

                                    <div className="relative" ref={accountRef}>
                                        {isLoggedIn ? (
                                            <>
                                                <button
                                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                                    className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {avatarChar}
                                                    </div>
                                                    <span className="text-sm hidden lg:inline max-w-[100px] truncate">{displayName}</span>
                                                    <ChevronDown className={`w-4 h-4 hidden lg:block transition ${isAccountOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {isAccountOpen && (
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                                        <div className="px-4 py-3 border-b border-gray-100">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                                            <p className="text-xs text-gray-500">{user?.role || 'Người dùng'}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => { setIsAccountOpen(false); router.push('/orders'); }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                        >
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                            Đơn hàng
                                                        </button>
                                                        <button
                                                            onClick={() => { setIsAccountOpen(false); router.push('/products'); }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                        >
                                                            <Settings className="w-4 h-4 text-gray-400" />
                                                            Cài đặt
                                                        </button>
                                                        {user?.role === "ADMIN" || user?.role === "MANAGER" ? (
                                                            <button
                                                                onClick={() => { setIsAccountOpen(false); router.push('/dashboard'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                            >
                                                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                                                                Dashboard
                                                            </button>
                                                        ) : null}
                                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                                            <button
                                                                onClick={handleLogout}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                                Đăng xuất
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.push('/login')}
                                                    className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition text-sm"
                                                >
                                                    <User className="w-6 h-6" />
                                                    <span className="hidden lg:inline">Đăng nhập</span>
                                                </button>
                                                <span className="text-gray-300 hidden lg:inline">/</span>
                                                <button
                                                    onClick={() => router.push('/register')}
                                                    className="text-sm text-gray-700 hover:text-orange-500 transition hidden lg:inline"
                                                >
                                                    Đăng ký
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Header */}
                            <div className="md:hidden flex items-center justify-between">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>

                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#f97316' }}>
                                        TL
                                    </div>
                                    <span className="font-bold" style={{ color: '#1e3a6e' }}>Market</span>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search" title="Search">

                                        <Search className="w-6 h-6 text-gray-700" />

                                    </button>
                                    <Link href="/cart" className="relative">
                                        <ShoppingCart className="w-6 h-6 text-gray-700" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ backgroundColor: '#ef4444' }}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Search */}
                            {isSearchOpen && (
                                <div className="md:hidden mt-3">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                        placeholder="Tìm kiếm..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-sm focus:border-[#f97316]"
                                    />

                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu - Regular User Mode */}
                {!isAdminMode && isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <nav className="px-4 py-3 space-y-2">
                            <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">
                                Trang chủ
                            </Link>
                            <Link href="/products" className="block px-3 py-2 rounded hover:bg-gray-100">
                                Sản phẩm
                            </Link>
                            <Link href="/products?category=flash-sale" className="block px-3 py-2 rounded hover:bg-gray-100">
                                Flash Sale
                            </Link>
                            {isLoggedIn ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-semibold text-gray-800 border-b border-gray-100">
                                        {displayName}
                                    </div>
                                    <Link href="/orders" className="block px-3 py-2 rounded hover:bg-gray-100">Đơn hàng</Link>
                                    <Link href="/products" className="block px-3 py-2 rounded hover:bg-gray-100">Cài đặt</Link>
                                    {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                                        <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-600">Đăng xuất</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block px-3 py-2 rounded hover:bg-gray-100">Đăng nhập</Link>
                                    <Link href="/register" className="block px-3 py-2 rounded hover:bg-gray-100">Đăng ký</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <nav className="hidden md:flex bg-white border-b border-gray-100 z-30">
                <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="py-3 px-0 border-b-2 border-transparent hover:border-gray-300 transition">
                            Trang chủ
                        </Link>
                        <Link href="/products?category=flash-sale" className="py-3 px-0 border-b-2 text-sm font-medium transition" style={{ color: '#f97316', borderColor: '#f97316' }}>
                            ⚡ Flash Sale
                        </Link>
                        <Link href="/products" className="py-3 px-0 border-b-2 border-transparent hover:border-gray-300 transition">
                            Sản phẩm
                        </Link>
                                        <Link href="/products?voucher=true" className="py-3 px-0 border-b-2 border-transparent hover:border-gray-300 transition">
                                            Mã giảm giá
                                        </Link>
                        <Link href="/products?authentic=true" className="py-3 px-0 border-b-2 border-transparent hover:border-gray-300 transition">
                            Hàng chính hãng
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

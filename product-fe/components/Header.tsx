'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="bg-surface sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center w-full px-gutter py-stack-md max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex-shrink-0">
            <img alt="TL Market Logo" className="h-10 w-auto" src="/logo-removebg-preview.png" />
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/products" className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md">Electronics</Link>
            <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Fashion</Link>
            <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Home</Link>
            <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Gifts</Link>
            <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">Deals</Link>
          </div>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <input
              className="w-full bg-surface-container border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          </div>
        </form>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <Link href="/cart" className="relative p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant cursor-pointer group">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-0 right-0 bg-error text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
          </Link>
          <Link
            href={isAuthenticated ? '/profile' : '/login'}
            className="flex items-center gap-2 p-1.5 pr-3 hover:bg-surface-container rounded-full transition-colors border border-outline-variant"
          >
            <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-primary">person</span>
            </div>
            <span className="font-label-md text-label-md hidden sm:block">{isAuthenticated ? (user?.username || 'Tài khoản') : 'Tài khoản'}</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

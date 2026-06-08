'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, LogOut } from 'lucide-react'
import type { UserInfo } from '@/components/Header'

interface SidebarProps {
    open: boolean
    user: UserInfo | null
    onLogout: () => void
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
    const pathname = usePathname()

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/products', label: 'Sản phẩm', icon: Package },
        { href: '/dashboard/admin/users', label: 'Người dùng', icon: Users },
    ]

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Logo */}
            <div className="border-b border-gray-200 px-6 py-4">
                <Link href="/" className="text-2xl font-bold" style={{ color: '#1e3a6e' }}>
                    TL Market
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname.startsWith(link.href)
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition"
                            style={isActive ? { backgroundColor: '#f97316', color: 'white' } : { color: '#4b5563' }}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Tài khoản</p>
                    <p className="font-medium text-gray-800 text-sm">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition"
                    style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}

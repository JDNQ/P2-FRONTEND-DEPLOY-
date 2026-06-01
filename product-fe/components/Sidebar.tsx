"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarProps = {
    open: boolean;
    onToggle?: () => void;
    user?: {
        username: string;
        role: string;
    };
    onLogout?: () => void;
};

function NavItem(props: { href: string; label: string; active?: boolean }) {
    return (
        <Link
            href={props.href}
            className={
                props.active
                    ? "rounded-md bg-[#1e3a6e] px-3 py-2 text-sm font-semibold text-white"
                    : "rounded-md px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
            }
        >
            {props.label}
        </Link>
    );
}

export default function Sidebar({ open, user, onLogout }: SidebarProps) {
    const pathname = usePathname();

    const navItems = user
        ? user.role === "ADMIN"
            ? [
                { href: "/dashboard/admin", label: "Tổng quan" },
                { href: "/dashboard/admin#users", label: "Quản lý Users" },
                { href: "/dashboard/admin#shops", label: "Quản lý Shops" },
                { href: "/products", label: "Sản phẩm" },
            ]
            : user.role === "MANAGER"
                ? [
                    { href: "/dashboard/manager", label: "Tổng quan" },
                    { href: "/dashboard/manager#shops", label: "Shop của tôi" },
                    { href: "/products", label: "Sản phẩm" },
                ]
                : [
                    { href: "/dashboard/user", label: "Tổng quan" },
                    { href: "/products", label: "Sản phẩm" },
                ]
        : [
            { href: "/", label: "Tổng quan" },
            { href: "/products", label: "Sản phẩm" },
        ];

    return (
        <aside className="h-screen bg-[#0f172a] text-white shadow-lg" aria-hidden="true">
            <div className={open ? "block" : "hidden"}>
                <div className="flex h-full flex-col">
                    <div className="px-4 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                                <span className="text-sm font-bold">TL</span>
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">TL Market</div>
                                <div className="text-base font-bold">Product Manager</div>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-2 flex-1 space-y-2 px-3">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                active={pathname === item.href || pathname.startsWith(item.href)}
                            />
                        ))}
                    </nav>

                    <div className="border-t border-white/10 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-white/10" />
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">{user?.username ?? "Guest"}</div>
                                <div className="truncate text-xs text-white/60">{user?.role ?? "Khách"}</div>
                            </div>
                        </div>

                        {onLogout ? (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="mt-3 w-full rounded-md bg-white/10 px-2 py-2 text-left text-xs font-semibold text-white transition hover:bg-white/20"
                            >
                                Đăng xuất
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </aside>
    );
}



// === SIDEBAR.TSX - CẢI TIẾN SCROLL ===

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/useTranslations";
import { LayoutDashboard, LogOut, Package, Store, Users } from "lucide-react";

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
    const Icon =
        props.href === "/products"
            ? Package
            : props.href.includes("/users") || props.href.includes("/manager#shops")
                ? Users
                : props.href.includes("/shops")
                    ? Store
                    : LayoutDashboard;

    return (
        <Link
            href={props.href}
            className={
                props.active
                    ? "flex items-center gap-3 rounded-r-lg border-l-2 border-blue-400 bg-white/10 py-2.5 pl-3 pr-3 text-sm font-semibold text-white transition-all"
                    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            }
        >
            <Icon className="h-4 w-4 shrink-0" />
            {props.label}
        </Link>
    );
}

export default function Sidebar({ open, user, onLogout }: SidebarProps) {
    const t = useTranslations("nav");
    const pathname = usePathname();

    const initials = user?.username?.charAt(0).toUpperCase() ?? "G";
    const roleBadge =
        user?.role === "ADMIN"
            ? "bg-red-500/15 text-red-300 ring-red-500/20"
            : user?.role === "MANAGER"
                ? "bg-orange-500/15 text-orange-300 ring-orange-500/20"
                : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20";

    const navItems = user
        ? user.role === "ADMIN"
            ? [
                { href: "/dashboard/admin", label: t("overview") },
                { href: "/dashboard/admin/users", label: t("manageUsers") },
                { href: "/dashboard/admin/shops", label: t("manageShops") },
                { href: "/products", label: t("products") },
            ]
            : user.role === "MANAGER"
                ? [
                    { href: "/dashboard/manager", label: t("overview") },
                    { href: "/dashboard/manager#shops", label: t("myShop") },
                    { href: "/products", label: t("products") },
                ]
                : [
                    { href: "/dashboard/user", label: t("overview") },
                    { href: "/products", label: t("products") },
                ]
        : [
            { href: "/", label: t("overview") },
            { href: "/products", label: t("products") },
        ];

    return (
        <aside
            className={`h-screen border-r border-white/5 bg-gradient-to-b from-slate-900 to-[#0a0f1e] text-white shadow-2xl transition-all duration-300 overflow-hidden ${open ? "w-64" : "w-0"
                }`}
        >
            <div className={open ? "flex h-full w-64 flex-col" : "hidden"}>
                <div className="flex h-full flex-col overflow-hidden">
                    {/* Logo */}
                    <div className="px-5 py-6 shrink-0">
                        <img src="/logo.png" alt="TL Market" className="h-12 w-auto" />
                    </div>

                    {/* Navigation - Có scroll nếu quá dài */}
                    <nav className="mt-2 flex-1 space-y-1 px-3 overflow-y-auto">
                        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">MENU</div>
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>

                    {/* User info + Logout */}
                    <div className="border-t border-white/10 px-4 py-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-950/30">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-white">{user?.username ?? "Guest"}</div>
                                <div className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${roleBadge}`}>
                                    {user?.role ?? t("guest")}
                                </div>
                            </div>
                        </div>

                        {onLogout && (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400"
                            >
                                <LogOut className="h-4 w-4" />
                                {t("logout")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
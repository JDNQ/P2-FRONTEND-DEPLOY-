"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarProps = {
    open: boolean;
    onToggle?: () => void;
};

function NavItem(props: {
    href: string;
    label: string;
    active?: boolean;
}) {
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

export default function Sidebar({ open }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className="h-screen bg-[#0f172a] text-white shadow-lg"
            aria-hidden="true"
        >
            <div className={open ? "block" : "hidden"}>
                <div className="flex h-full flex-col">
                    <div className="px-4 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                                <span className="text-sm font-bold">DX</span>
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                                    DX FutureTech
                                </div>
                                <div className="text-base font-bold">Product Manager</div>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-2 flex-1 space-y-2 px-3">
                        <NavItem href="/" label="Tổng quan" active={pathname === "/"} />
                        <NavItem href="/products" label="Sản phẩm" active={pathname?.startsWith("/products")} />
                    </nav>

                    <div className="border-t border-white/10 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-white/10" />
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">User</div>
                                <div className="truncate text-xs text-white/60">Admin</div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Link
                                href="/settings"
                                className="block rounded-md px-2 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white"
                            >
                                Cài đặt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}



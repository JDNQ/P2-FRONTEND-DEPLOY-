"use client";

import React from "react";
import Link from "next/link";

import { Bell, ChevronDown, Menu, Search, User } from "lucide-react";

export type HeaderProps = {
    onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProps) {
    return (
        <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-50"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-800" />
                </button>

                <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="h-4 w-4" />
                    </span>
                    <input
                        className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#1e3a6e]"
                        placeholder="Search products..."
                    />
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    <div className="rounded-md border border-gray-200 bg-white p-1">
                        <span className="sr-only">Language</span>
                        <button
                            type="button"
                            className="rounded-sm bg-[#1e3a6e] px-3 py-1 text-xs font-semibold text-white"
                        >
                            EN
                        </button>
                        <button
                            type="button"
                            className="ml-1 rounded-sm px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            VI
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-50"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 text-gray-800" />
                </button>

                <div className="flex items-center gap-2 rounded-md px-2 py-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-4 w-4 text-gray-700" />
                    </div>
                    <div className="hidden min-w-0 flex-col sm:flex">
                        <div className="truncate text-sm font-semibold text-gray-900">User</div>
                        <div className="truncate text-xs text-gray-500">Admin</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                <div className="sm:hidden">
                    <Link href="/" className="h-10 w-10" aria-label="Home" />
                </div>
            </div>
        </header>
    );
}


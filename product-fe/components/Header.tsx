// === HEADER.TSX - XÓA NÚT LOGOUT Ở ĐÂY ===

"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useTranslations";
import { Bell, ChevronDown, Menu, User } from "lucide-react";

export type UserInfo = {
    username: string;
    role: string;
};

export type HeaderProps = {
    onToggleSidebar: () => void;
    user?: UserInfo;
    onLogout?: () => void;   // vẫn giữ prop này để sau này dùng nếu cần
};

export default function Header({ onToggleSidebar, user }: HeaderProps) {
    const { locale, setLocale } = useLocale();

    return (
        <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-50"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-800" />
                </button>

                <div className="flex-1" />

                <div className="hidden items-center gap-2 sm:flex">
                    <div className="rounded-md border border-gray-200 bg-white p-1">
                        <span className="sr-only">Language</span>
                        <button
                            type="button"
                            onClick={() => setLocale("en")}
                            className={`rounded-sm px-3 py-1 text-xs font-semibold ${locale === "en"
                                ? "bg-[#1e3a6e] text-white"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            EN
                        </button>
                        <button
                            type="button"
                            onClick={() => setLocale("vi")}
                            className={`ml-1 rounded-sm px-3 py-1 text-xs font-semibold ${locale === "vi"
                                ? "bg-[#1e3a6e] text-white"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
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

                <div className="flex items-center gap-2 rounded-md px-2 py-1 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-4 w-4 text-gray-700" />
                    </div>
                    <div className="hidden min-w-0 flex-col sm:flex">
                        <div className="truncate text-sm font-semibold text-gray-900">{user?.username ?? "Guest"}</div>
                        <div className="truncate text-xs text-gray-500">{user?.role ?? "N/A"}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {/* === ĐÃ XÓA NÚT LOGOUT === */}

                <div className="sm:hidden">
                    <Link href="/" className="h-10 w-10" aria-label="Home" />
                </div>
            </div>
        </header>
    );
}
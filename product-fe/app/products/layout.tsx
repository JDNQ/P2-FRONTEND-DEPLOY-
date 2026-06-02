"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { deleteCookie } from "@/lib/api";

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();

    const [user] = useState(() => {
        if (typeof window === "undefined") return undefined;
        const raw = localStorage.getItem("user");
        if (!raw) return undefined;
        try {
            const parsed = JSON.parse(raw) as { username?: string; role?: string };
            if (parsed?.username && parsed?.role) return { username: parsed.username, role: parsed.role };
        } catch {}
        return undefined;
    });

    const handleLogout = () => {
        deleteCookie("token", { path: "/" });
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900">
            <div className="flex">
                <div className={sidebarOpen ? "w-64 shrink-0 transition-[width] duration-300" : "w-0 shrink-0 overflow-hidden transition-[width] duration-300"}>
                    <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} user={user} onLogout={handleLogout} />
                    <main className="flex-1 bg-[#f8fafc] p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

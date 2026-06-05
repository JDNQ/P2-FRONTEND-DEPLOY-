"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { deleteCookie } from "@/lib/api";
import type { UserInfo } from "@/components/Header";

export default function ProductsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") {
            setLoading(false);
            return;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const parsed = JSON.parse(raw) as { username?: string; role?: string };
            if (parsed?.username && parsed?.role) {
                setUser({ username: parsed.username, role: parsed.role });
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        deleteCookie("token", { path: "/" });
        localStorage.removeItem("user");
        router.push("/");
    };

    if (loading) return null;

    const role = user?.role?.toUpperCase();

    // USER hoặc chưa đăng nhập: không render dashboard layout
    if (!user || role === "USER") {
        return <>{children}</>;
    }

    // ADMIN hoặc MANAGER: render layout dashboard
    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
            <div
                className={`shrink-0 border-r border-slate-200 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                    }`}
            >
                <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    onToggleSidebar={() => setSidebarOpen((v) => !v)}
                    user={user}
                    onLogout={handleLogout}
                />
                <main className="flex-1 overflow-auto bg-[#f8fafc] p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}


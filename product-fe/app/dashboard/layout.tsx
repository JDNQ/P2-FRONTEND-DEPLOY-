"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header, { UserInfo } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { deleteCookie } from "@/lib/api";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user từ localStorage (chỉ chạy 1 lần)
    useEffect(() => {
        const initializeUser = () => {
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
                if (!parsed?.username || !parsed?.role) {
                    setUser(null);
                } else {
                    setUser({ username: parsed.username, role: parsed.role });
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    // Redirect nếu không có user sau khi load xong
    useEffect(() => {
        if (!loading && user === null) {
            localStorage.removeItem("user");
            router.replace("/");
        }
    }, [loading, user, router]);

    const handleLogout = () => {
        deleteCookie("token", { path: "/" });
        localStorage.removeItem("user");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-gray-700">
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    // Không render layout nếu chưa có user (đang redirect)
    if (!user) {
        return null;
    }

    return (
        <div className="flex h-dvh overflow-hidden bg-[#f8fafc]">
            {/* Sidebar */}
            <aside
                className={`shrink-0 border-r border-slate-200 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
            >
                <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col min-w-0">
                <Header
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
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
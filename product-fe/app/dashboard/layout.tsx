"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header, { UserInfo } from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) {
            router.replace("/login");
            return;
        }

        try {
            const parsed = JSON.parse(raw) as { username?: string; role?: string };
            if (!parsed?.username || !parsed?.role) {
                throw new Error("Invalid user");
            }
            setUser({ username: parsed.username, role: parsed.role });
            setLoading(false);
        } catch {
            localStorage.removeItem("user");
            router.replace("/login");
        }
    }, [router]);

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0";
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-gray-700">
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900">
            <div className="flex">
                <div
                    className={
                        sidebarOpen
                            ? "w-[220px] shrink-0 transition-[width] duration-300"
                            : "w-0 shrink-0 overflow-hidden transition-[width] duration-300"
                    }
                >
                    <Sidebar open={sidebarOpen} user={user ?? undefined} onLogout={handleLogout} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header onToggleSidebar={() => setSidebarOpen((value) => !value)} user={user ?? undefined} onLogout={handleLogout} />
                    <main className="flex-1 bg-[#f8fafc] p-6 sm:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}

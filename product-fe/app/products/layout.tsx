"use client";

import React, { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ProductsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900">
            <div className="flex">
                <div
                    className={
                        sidebarOpen
                            ? "w-[200px] shrink-0 transition-[width] duration-300"
                            : "w-0 shrink-0 overflow-hidden transition-[width] duration-300"
                    }
                >
                    {/* Sidebar bản thân không fixed để transition width nằm ở layout */}
                    <Sidebar open={sidebarOpen} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
                    <main className="flex-1 bg-[#f8fafc] p-6 sm:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}


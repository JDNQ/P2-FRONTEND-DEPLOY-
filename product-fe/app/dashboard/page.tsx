"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) {
            router.replace("/login");
            return;
        }

        try {
            const user = JSON.parse(raw) as { role?: string };
            if (user.role === "ADMIN") {
                router.replace("/dashboard/admin");
            } else if (user.role === "MANAGER") {
                router.replace("/dashboard/manager");
            } else if (user.role === "USER") {
                router.replace("/dashboard/user");
            } else {
                router.replace("/login");
            }
        } catch {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-gray-700">
            Chuyển hướng về trang dashboard...
        </div>
    );
}

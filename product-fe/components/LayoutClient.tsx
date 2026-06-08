"use client"
import { usePathname } from 'next/navigation'
import { AppProvider } from "@/lib/store"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Toast from "@/components/Toast"

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const hideHeader =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/dashboard")

    return (
        <AppProvider>
            {!hideHeader && <Header />}
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toast />
        </AppProvider>
    )
}


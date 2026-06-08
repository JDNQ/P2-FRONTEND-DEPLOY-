"use client"
import { AppProvider } from "@/lib/store"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Toast from "@/components/Toast"

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toast />
        </AppProvider>
    )
}


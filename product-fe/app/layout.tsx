import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { AppProvider } from "@/lib/store"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Toast from "@/components/Toast"



const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TL Market - Mua sắm trực tuyến hàng chính hãng",
  description:
    "TL Market - Nền tảng mua sắm trực tuyến uy tín với hàng triệu sản phẩm chính hãng, giá tốt nhất",
  keywords: "mua sắm online, thương mại điện tử, hàng chính hãng, giá rẻ",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a6e",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toast />
          {process.env.NODE_ENV === "production" && <Analytics />}
        </AppProvider>
      </body>
    </html>
  )
}
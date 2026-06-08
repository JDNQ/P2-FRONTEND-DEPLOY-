import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Sora } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'TL Market — Mua sắm thông minh', template: '%s | TL Market' },
  description: 'Nền tảng thương mại điện tử uy tín — Hàng chính hãng, giao nhanh, đổi trả dễ dàng',
  keywords: ['mua sắm online', 'thương mại điện tử', 'TL Market'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'TL Market',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className="bg-white">
      <body className={`${beVietnamPro.variable} ${sora.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

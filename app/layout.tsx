import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { CartTrigger } from "@/components/cart/CartTrigger"
import { Footer } from "@/components/footer"
import { NetworkStatus } from "@/components/NetworkStatus"

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  themeColor: '#FDFBF7', // Matches our cream background
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'ОЛТУОЛ — Ветеринарные защитные воротники оптом',
  description: 'Прямые поставки профессиональных ветеринарных защитных воротников для клиник по всей Беларуси. Оптовые цены, быстрая доставка.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ОЛТУОЛ',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <NetworkStatus />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <CartTrigger />
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neetrino - AI-Powered Solutions',
  description: 'Инновационные AI решения для будущего. Мы создаем технологии будущего, используя искусственный интеллект и машинное обучение.',
  keywords: 'AI, искусственный интеллект, машинное обучение, нейронные сети, разработка, технологии',
  authors: [{ name: 'Neetrino Team' }],
  creator: 'Neetrino',
  publisher: 'Neetrino',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neetrino.com',
    title: 'Neetrino - AI-Powered Solutions',
    description: 'Инновационные AI решения для будущего',
    siteName: 'Neetrino',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neetrino - AI-Powered Solutions',
    description: 'Инновационные AI решения для будущего',
    creator: '@neetrino',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00D1FF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

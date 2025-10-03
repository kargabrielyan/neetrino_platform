import type { Metadata, Viewport } from 'next'
import { inter } from './fonts'
import './globals.css'
import AuthSessionProvider from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'Neetrino - AI-Powered Solutions',
  description: 'Инновационные AI решения для будущего. Мы создаем технологии будущего, используя искусственный интеллект и машинное обучение.',
  keywords: 'AI, искусственный интеллект, машинное обучение, нейронные сети, разработка, технологии',
  authors: [{ name: 'Neetrino Team' }],
  creator: 'Neetrino',
  publisher: 'Neetrino',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}

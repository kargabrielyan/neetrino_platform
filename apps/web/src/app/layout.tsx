import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Neetrino Platform - Демо-каталог',
  description: 'Современная платформа для поиска и просмотра демо-сайтов',
  keywords: ['демо', 'сайты', 'каталог', 'дизайн', 'шаблоны'],
  authors: [{ name: 'Neetrino Team' }],
  openGraph: {
    title: 'Neetrino Platform',
    description: 'Современная платформа для поиска и просмотра демо-сайтов',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}

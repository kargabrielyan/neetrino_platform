import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neetrino Platform',
  description: 'Современная платформа для поиска и просмотра демо-сайтов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Neetrino Platform
              </Link>
              <div className="flex space-x-4">
                <Link 
                  href="/catalog" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Каталог
                </Link>
                <Link 
                  href="/admin" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Админ
                </Link>
                <Link 
                  href="http://localhost:3001/api/docs" 
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  API Docs
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

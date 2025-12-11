'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BarMenu from './BarMenu';
import ThemeProvider from './ThemeProvider';
import LiveChat from './LiveChat';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

/**
 * Общий Layout компонент для всех страниц
 * Включает Navbar и опционально Footer
 */
export default function Layout({ 
  children, 
  showFooter = true, 
  className = '' 
}: LayoutProps) {
  return (
    <ThemeProvider>
      <main className={`min-h-screen ${className}`}>
        {/* Навигация */}
        <Navbar />
        
        {/* Основной контент с отступом для header и нижнего меню */}
        <div className="relative z-10 pt-24 pb-20">
          {children}
        </div>
        
        {/* Футер (опционально) */}
        {showFooter && <Footer />}
        
        {/* Нижнее меню для мобильных и планшетов */}
        <BarMenu />
        
        {/* Live Chat Widget */}
        <LiveChat />
      </main>
    </ThemeProvider>
  );
}



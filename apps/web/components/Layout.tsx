'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

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
    <main className={`min-h-screen bg-bg ${className}`}>
      {/* Навигация */}
      <Navbar />
      
      {/* Основной контент */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Футер (опционально) */}
      {showFooter && <Footer />}
    </main>
  );
}



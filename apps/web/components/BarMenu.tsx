'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, User, Menu } from 'lucide-react';

const menuItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/catalog',
    label: 'Catalog',
    icon: Grid,
  },
  {
    href: '/profile',
    label: 'My account',
    icon: User,
    disabled: true, // Пока не работает
  },
];

export default function BarMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isIPad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isTabletDevice = /Android.*Tablet|iPad|Kindle|Silk|PlayBook|BB10/.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const screenWidth = window.innerWidth;
      
      // Показываем BarMenu на мобильных, планшетах и iPad Pro
      const shouldShow = isIPad || isTabletDevice || (isTouchDevice && screenWidth < 1200);
      setIsTablet(shouldShow);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <>
      {/* Bottom Bar Menu - для мобильных и планшетов */}
      {isTablet && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass border-t border-ink/20 shadow-lg">
          <div className="flex items-center justify-around px-4 py-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              
              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    className="flex flex-col items-center justify-center p-2 text-ink/30 cursor-not-allowed pointer-events-none"
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
                    isActive
                      ? 'text-a1'
                      : 'text-ink/60 hover:text-ink hover:glass-strong'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        </div>
      )}

      {/* Floating Action Button для дополнительных действий */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 glass-strong rounded-full flex items-center justify-center text-ink hover:glass transition-all duration-200 shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Дополнительное меню */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-40 md:hidden">
          <div className="glass rounded-2xl p-4 space-y-3 min-w-[200px]">
            <Link
              href="/catalog/website"
              className="flex items-center gap-3 p-2 rounded-lg hover:glass-strong transition-all duration-200 text-ink/70 hover:text-ink"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-2 h-2 bg-a1 rounded-full"></div>
              <span className="text-sm font-medium">Website Demos</span>
            </Link>
            <Link
              href="/catalog/app"
              className="flex items-center gap-3 p-2 rounded-lg hover:glass-strong transition-all duration-200 text-ink/70 hover:text-ink"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-2 h-2 bg-a1 rounded-full"></div>
              <span className="text-sm font-medium">App Demos</span>
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-3 p-2 rounded-lg hover:glass-strong transition-all duration-200 text-ink/70 hover:text-ink"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-2 h-2 bg-a1 rounded-full"></div>
              <span className="text-sm font-medium">Portfolio</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 p-2 rounded-lg hover:glass-strong transition-all duration-200 text-ink/70 hover:text-ink"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-2 h-2 bg-a1 rounded-full"></div>
              <span className="text-sm font-medium">Contact</span>
            </Link>
          </div>
        </div>
      )}

      {/* Overlay для закрытия меню */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

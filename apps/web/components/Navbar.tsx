'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'programs', label: 'Catalog', href: '/catalog' },
    { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { key: 'blog', label: 'Blog', href: '/blog' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold text-white">
              NEETRINO
            </span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          </motion.div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActivePage(item.href)
                      ? 'text-primary'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  
                  {/* Анимированная подчеркивающая линия */}
                  {isActivePage(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Мобильное меню */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={handleNavClick}
                className={`block px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActivePage(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

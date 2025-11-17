'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMounted } from '../lib/use-mounted';
import NavDroplet from './NavDroplet';
import ThemeToggle from './ThemeToggle';
import AuthSidebar from './AuthSidebar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
  const isMounted = useMounted();
  const pathname = usePathname();

  const menuItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'programs', label: 'Catalog', href: '/catalog' },
    { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
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
      animate={isMounted ? { y: 0 } : { y: -100 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-6 left-4 right-4 md:left-8 md:right-8 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`glass sticky top-6 mx-4 md:mx-8 p-3 transition-all duration-300 rounded-3xl ${
        isScrolled ? 'glass-strong' : 'glass'
      }`}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2 focus-ring rounded-lg p-1">
              <span className="text-2xl font-bold text-ink">
                NEETRINO
              </span>
              <div className="w-2 h-2 rounded-full bg-a4 animate-pulse"></div>
            </Link>
          </motion.div>

          {/* Desktop navigation with water droplet - скрыто на мобильных и планшетах */}
          <div className="hidden lg:block">
            <NavDroplet />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAuthSidebarOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-ink font-medium rounded-full transition-all duration-200 focus-ring"
            >
              <User className="w-4 h-4" />
              Sign In
            </motion.button>

            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-ink/70 hover:text-ink transition-colors rounded-full p-2 hover:bg-glass/50 focus-ring"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile and tablet menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 px-4">
            <NavDroplet />
            
            {/* Mobile Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthSidebarOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-ink font-medium rounded-full transition-all duration-200 focus-ring"
            >
              <User className="w-4 h-4" />
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Auth Sidebar */}
      <AuthSidebar 
        isOpen={isAuthSidebarOpen} 
        onClose={() => setIsAuthSidebarOpen(false)} 
      />
    </motion.nav>
  );
}
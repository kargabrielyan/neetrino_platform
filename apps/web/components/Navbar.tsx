'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Heart, LogOut, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useMounted } from '../lib/use-mounted';
import { useTheme } from '../lib/use-theme';
import NavDroplet from './NavDroplet';
import ThemeToggle from './ThemeToggle';
import AuthSidebar from './AuthSidebar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isMounted = useMounted();
  const pathname = usePathname();
  const { isDark, isLoaded } = useTheme();
  const { data: session, status } = useSession();

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart');
        if (cart) {
          try {
            const items = JSON.parse(cart);
            setCartCount(Array.isArray(items) ? items.length : 0);
          } catch (e) {
            setCartCount(0);
          }
        } else {
          setCartCount(0);
        }
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const menuItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'programs', label: 'Shop', href: '/catalog' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'team', label: 'Team', href: '/team' },
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
      animate={{ y: 0 }}
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
            {/* User Menu or Sign In Button */}
            {status === 'loading' ? (
              <div className="hidden md:flex items-center gap-2 px-4 py-2">
                <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin"></div>
              </div>
            ) : session?.user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/my-account"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-ink font-medium rounded-full transition-all duration-200 focus-ring"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">
                    {session.user.name || session.user.email?.split('@')[0] || 'Account'}
                  </span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Clear cart when signing out
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('cart');
                      window.dispatchEvent(new Event('cartUpdated'));
                    }
                    signOut({ callbackUrl: '/' });
                  }}
                  className="p-2 rounded-full text-ink/70 hover:text-ink hover:bg-white/10 transition-all duration-200 focus-ring"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthSidebarOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-ink font-medium rounded-full transition-all duration-200 focus-ring"
              >
                <User className="w-4 h-4" />
                Sign In
              </motion.button>
            )}

            {/* Cart button */}
            <Link
              href="/cart"
              className="hidden md:flex relative p-2 rounded-full text-ink/70 hover:text-ink transition-colors focus-ring hover:bg-white/10"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-a1 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist button */}
            {isLoaded ? (
              <Link
                href="/my-account/wishlist"
                className="hidden md:flex p-2 rounded-full text-red-500 transition-colors focus-ring hover:text-red-600"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </Link>
            ) : (
              <div className="hidden md:flex p-2 rounded-full text-red-500">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            )}

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
            
            {/* Mobile Cart and Wishlist */}
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative flex items-center justify-center p-3 rounded-full text-ink/70 hover:text-ink hover:bg-white/10 transition-colors focus-ring"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-a1 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/my-account/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center p-3 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors focus-ring"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </Link>
            </div>

            {/* Mobile User Menu or Sign In Button */}
            {status === 'loading' ? (
              <div className="w-full flex items-center justify-center gap-2 px-4 py-3">
                <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin"></div>
              </div>
            ) : session?.user ? (
              <div className="space-y-2">
                <Link
                  href="/my-account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-ink font-medium rounded-full transition-all duration-200 focus-ring"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate">
                    {session.user.name || session.user.email?.split('@')[0] || 'Account'}
                  </span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Clear cart when signing out
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('cart');
                      window.dispatchEvent(new Event('cartUpdated'));
                    }
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-full transition-all duration-200 focus-ring"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </div>
            ) : (
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
            )}
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
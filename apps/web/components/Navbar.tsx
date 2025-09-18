'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMounted } from '../lib/use-mounted';
import NavDroplet from './NavDroplet';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMounted = useMounted();
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

          {/* Desktop navigation with water droplet */}
          <div className="hidden md:block">
            <NavDroplet />
          </div>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-ink/70 hover:text-ink transition-colors rounded-full p-2 hover:bg-glass/50 focus-ring"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 px-4">
            <NavDroplet />
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
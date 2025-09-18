'use client';

import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { useMounted } from '../lib/use-mounted';

interface FooterProps {}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
];

const menuItems = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'contact', href: '/contact' },
];

export default function Footer({}: FooterProps) {
  const isMounted = useMounted();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <footer className="relative w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Один большой отсек с 4 отдельными отсеками внутри */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-ink">
                  NEETRINO
                </span>
                <div className="w-2 h-2 rounded-full bg-a4 animate-pulse"></div>
              </div>
              
              <p className="text-ink/70 leading-relaxed">
                We create future technologies using artificial intelligence and machine learning.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 glass-subtle rounded-full flex items-center justify-center text-ink/70 hover:text-a1 transition-colors focus-ring"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Menu */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-ink">
                Menu
              </h3>
              
              <ul className="space-y-3">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-ink/70 hover:text-ink transition-colors focus-ring rounded-lg p-1"
                    >
                      {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-ink">
                Contact
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-a1" />
                  <span className="text-ink/70">Yerevan, Armenia</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-a1" />
                  <a 
                    href="mailto:info@neetrino.com" 
                    className="text-ink/70 hover:text-ink transition-colors focus-ring rounded-lg p-1"
                  >
                    info@neetrino.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-a1" />
                  <a 
                    href="tel:+37444343000" 
                    className="text-ink/70 hover:text-ink transition-colors focus-ring rounded-lg p-1"
                  >
                    +374 44 343 000
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-a1" />
                  <span className="text-ink/70">Mon-Fri: 9:00 - 18:00</span>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-semibold text-ink">
                Newsletter
              </h3>
              
              <p className="text-ink/70 leading-relaxed">
                Subscribe to our newsletter for the latest updates and insights.
              </p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 glass rounded-full text-ink placeholder-ink/50 focus-ring"
                />
                <button 
                  onClick={() => alert('Thank you for subscribing!')}
                  className="w-full glass-strong px-4 py-3 rounded-full text-ink font-medium hover:bg-white/10 transition-colors focus-ring"
                >
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>

          {/* Copyright внутри большого отсека */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-glass-border"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-ink/60 text-sm">
                © 2025 Neetrino. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6">
                <a 
                  href="#" 
                  className="text-ink/60 hover:text-ink text-sm transition-colors focus-ring rounded-lg p-1"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="text-ink/60 hover:text-ink text-sm transition-colors focus-ring rounded-lg p-1"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
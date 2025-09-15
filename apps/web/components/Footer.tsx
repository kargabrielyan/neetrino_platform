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
import { getTranslations, type Locale } from '../lib/i18n';

interface FooterProps {
  locale: Locale;
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
];

const menuItems = [
  { key: 'about', href: '#about' },
  { key: 'team', href: '#team' },
  { key: 'programs', href: '#programs' },
  { key: 'portfolio', href: '#portfolio' },
];

export default function Footer({ locale }: FooterProps) {
  const t = getTranslations(locale);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <footer className="relative bg-gradient-to-t from-bg to-bg/50 border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* О компании */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                NEETRINO
              </span>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            </div>
            
            <p className="text-white/70 leading-relaxed">
              Մենք ստեղծում ենք ապագայի տեխնոլոգիաները՝ օգտագործելով արհեստական բանականությունը և մեքենայական ուսուցումը:
            </p>
            
            {/* Социальные сети */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center text-white/60 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Меню */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              {t.footer.menu}
            </h3>
            
            <ul className="space-y-3">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {t.nav[item.key as keyof typeof t.nav]}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Контакты */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              {t.footer.contacts}
            </h3>
            
            <div className="space-y-4">
              {/* Адрес */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white/70">
                  {t.footer.address}
                </span>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@neetrino.com"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  {t.footer.email}
                </a>
              </div>
              
              {/* Телефон */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+37444343000"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  {t.footer.phone}
                </a>
              </div>
              
              {/* Часы работы */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-white/70">
                  {t.footer.hours}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Нижняя полоса */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              {t.footer.copyright}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#privacy"
                className="text-white/60 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-white/60 hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-primary/5 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-accent/5 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </footer>
  );
}

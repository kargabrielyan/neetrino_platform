'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  Smartphone, 
  Brain, 
  TrendingUp, 
  Shield, 
  Cloud 
} from 'lucide-react';
import { getTranslations, type Locale } from '../lib/i18n';

interface ServicesGridProps {
  locale: Locale;
}

const services = [
  {
    icon: Globe,
    key: 'web_development',
    description: 'Современные веб-приложения с использованием последних технологий',
  },
  {
    icon: Smartphone,
    key: 'mobile_apps',
    description: 'Нативные и кроссплатформенные мобильные приложения',
  },
  {
    icon: Brain,
    key: 'ai_integration',
    description: 'Интеграция AI и машинного обучения в ваши проекты',
  },
  {
    icon: TrendingUp,
    key: 'digital_marketing',
    description: 'Комплексный цифровой маркетинг и продвижение',
  },
  {
    icon: Shield,
    key: 'cybersecurity',
    description: 'Защита данных и кибербезопасность на всех уровнях',
  },
  {
    icon: Cloud,
    key: 'cloud_solutions',
    description: 'Облачные решения и DevOps для масштабирования',
  },
];

export default function ServicesGrid({ locale }: ServicesGridProps) {
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
    hidden: { opacity: 0, y: 30 },
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
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            {t.services.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="card-glass group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-6 group-hover:glow transition-all duration-300">
                  <service.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t.services[service.key as keyof typeof t.services]}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-accent/10 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}

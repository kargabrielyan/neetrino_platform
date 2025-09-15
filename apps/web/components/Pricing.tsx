'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { getTranslations, type Locale } from '../lib/i18n';
import { formatCurrency } from '../lib/format';

interface PricingProps {
  locale: Locale;
}

const plans = [
  {
    name: 'platform',
    price: 100000,
    maxPrice: 500000,
    features: [
      'Базовые AI модели',
      'До 10 проектов',
      'Email поддержка',
      'Базовая аналитика',
      'API доступ',
    ],
    popular: false,
  },
  {
    name: 'business',
    price: 600000,
    maxPrice: 900000,
    features: [
      'Продвинутые AI модели',
      'До 50 проектов',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'Полный API доступ',
      'Интеграции',
      'Персональный менеджер',
    ],
    popular: true,
  },
  {
    name: 'premium',
    price: 900000,
    maxPrice: null,
    features: [
      'Все AI модели',
      'Неограниченные проекты',
      '24/7 поддержка',
      'Полная аналитика',
      'Белый лейбл',
      'Все интеграции',
      'Персональная команда',
      'Кастомные решения',
    ],
    popular: false,
  },
];

export default function Pricing({ locale }: PricingProps) {
  const t = getTranslations(locale);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            {t.pricing.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className={`relative card-glass ${
                plan.popular 
                  ? 'border-2 border-primary/50 glow' 
                  : 'border border-white/10'
              }`}
            >
              {/* Популярный бейдж */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 glass rounded-full border border-primary/50">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {t.pricing.recommended}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-center">
                {/* Название плана */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t.pricing[plan.name as keyof typeof t.pricing]}
                </h3>

                {/* Цена */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatCurrency(plan.price)}
                  </div>
                  {plan.maxPrice && (
                    <div className="text-white/60">
                      до {formatCurrency(plan.maxPrice)}
                    </div>
                  )}
                  {!plan.maxPrice && (
                    <div className="text-white/60">
                      2+ ամիս
                    </div>
                  )}
                </div>

                {/* Список функций */}
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Кнопка заказа */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {t.pricing.order}
                </motion.button>
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

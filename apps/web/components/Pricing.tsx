'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import { useMounted } from '../lib/use-mounted';

const plans = [
  {
    name: 'Platform',
    price: 100000,
    maxPrice: 500000,
    features: [
      'Basic AI models',
      'Up to 10 projects',
      'Email support',
      'Basic analytics',
      'API access',
    ],
    popular: false,
  },
  {
    name: 'Business',
    price: 600000,
    maxPrice: 900000,
    features: [
      'Advanced AI models',
      'Up to 50 projects',
      'Priority support',
      'Advanced analytics',
      'Full API access',
      'Integrations',
      'Personal manager',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 900000,
    maxPrice: null,
    features: [
      'All AI models',
      'Unlimited projects',
      '24/7 support',
      'Full analytics',
      'White label',
      'All integrations',
      'Personal team',
      'Custom solutions',
    ],
    popular: false,
  },
];

export default function Pricing() {
  const isMounted = useMounted();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      },
    },
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="glass p-8 rounded-3xl">
            <h2 className="heading-lg text-ink mb-4">
              Our Pricing Plans
            </h2>
            <p className="text-xl text-ink/70 max-w-3xl mx-auto">
              Choose the perfect plan for your business needs
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }}
              className={`relative glass p-6 rounded-3xl hover:scale-[1.01] transition-transform focus-ring ${
                plan.popular ? 'border-2 border-a1' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="glass-subtle text-ink px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-ink mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-a1">
                    {formatCurrency(plan.price)}
                  </span>
                  {plan.maxPrice && (
                    <span className="text-ink/60 ml-2">
                      up to {formatCurrency(plan.maxPrice)}
                    </span>
                  )}
                </div>
                
                <p className="text-ink/70">
                  {plan.maxPrice ? 'Monthly' : 'Custom pricing'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-a1 flex-shrink-0" />
                    <span className="text-ink/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = '/contact'}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 focus-ring ${
                  plan.popular
                    ? 'glass-subtle text-ink hover:bg-white/10'
                    : 'glass text-ink hover:bg-white/10'
                }`}
              >
                Order Now
              </button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Globe, 
  Smartphone, 
  Brain, 
  TrendingUp, 
  Shield, 
  Cloud 
} from 'lucide-react';
import { useMounted } from '../lib/use-mounted';

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Modern web applications using the latest technologies',
    href: '/services/web-development',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications',
    href: '/services/mobile-development',
  },
  {
    icon: Brain,
    title: 'AI Integration',
    description: 'Integrate artificial intelligence into your projects',
    href: '/services/ai-integration',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing strategies',
    href: '/services/digital-marketing',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protect your data with security solutions',
    href: '/services/cybersecurity',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and DevOps',
    href: '/services/cloud-solutions',
  },
];

export default function ServicesGrid() {
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
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-ink">
              Our Innovative Services
            </h2>
            <p className="text-xl text-ink/70 max-w-3xl mx-auto">
              We provide comprehensive technology solutions to help your business grow and succeed
            </p>
          </div>
        </motion.div>

        {/* Сетка услуг */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }}
              className="glass p-6 text-center group cursor-pointer hover:scale-[1.01] transition-transform rounded-3xl focus-ring"
            >
              {/* Иконка */}
              <div className="w-16 h-16 bg-a1/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-a1/30 transition-colors">
                <service.icon className="w-8 h-8 text-a1" />
              </div>

              {/* Заголовок */}
              <h3 className="text-xl font-semibold text-ink mb-4">
                {service.title}
              </h3>

              {/* Описание */}
              <p className="text-ink/70 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Learn More Button */}
              <Link
                href={service.href}
                className="inline-block glass px-5 py-3 rounded-full font-medium text-ink hover:glass-strong transition-all duration-200 focus-ring"
              >
                Learn More
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
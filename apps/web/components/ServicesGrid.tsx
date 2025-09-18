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
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00d1ff] via-[#228cfb] via-[#9968e6] via-[#e54397] via-[#ff3f47] to-[#ff7b15] bg-clip-text text-transparent">
            Our Innovative Services
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We provide comprehensive technology solutions to help your business grow and succeed
          </p>
        </motion.div>

        {/* Сетка услуг */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,209,255,0.1)'
              }}
              className="glass rounded-2xl p-8 text-center group cursor-pointer"
            >
              {/* Иконка */}
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors">
                <service.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Заголовок */}
              <h3 className="text-xl font-semibold text-white mb-4">
                {service.title}
              </h3>

              {/* Описание */}
              <p className="text-white/70 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Learn More Button */}
              <Link
                href={service.href}
                className="inline-block px-6 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
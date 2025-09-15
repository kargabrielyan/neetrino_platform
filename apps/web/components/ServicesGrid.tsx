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

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Modern web applications using the latest technologies',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications',
  },
  {
    icon: Brain,
    title: 'AI Integration',
    description: 'Integrate artificial intelligence into your projects',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing strategies',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protect your data with security solutions',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and DevOps',
  },
];

export default function ServicesGrid() {
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
          <h2 className="heading-lg text-white mb-4">
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
          whileInView="visible"
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
              <p className="text-white/70 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
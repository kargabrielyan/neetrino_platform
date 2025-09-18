'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { formatNumber } from '../lib/format';
import { useMounted } from '../lib/use-mounted';

const stats = [
  { value: 50, suffix: '+', label: 'AI Models' },
  { value: 100, suffix: '+', label: 'Neural Networks' },
  { value: 1000000, suffix: '+', label: 'Data Points' },
  { value: 99.9, suffix: '%', label: 'Processing Speed' },
];

export default function Hero() {
  const isMounted = useMounted();

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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Фоновые частицы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-bg/80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Бейдж с градиентным текстом */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/30 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-bold text-[#00d1ff]">
              AI-POWERED SOLUTIONS
            </span>
          </motion.div>

          {/* Главный заголовок */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00d1ff] via-[#228cfb] via-[#9968e6] via-[#e54397] via-[#ff3f47] to-[#ff7b15] bg-clip-text text-transparent leading-tight"
          >
            Future Technologies with Artificial Intelligence
          </motion.h1>

          {/* Подзаголовок */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            We create future technologies using artificial intelligence and machine learning.
          </motion.p>

          {/* Кнопки */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,209,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline flex items-center gap-2 group"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Request Consultation
            </motion.button>
          </motion.div>

          {/* Статистика */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {!isMounted 
                    ? `${stat.value}${stat.suffix}` 
                    : stat.value < 1000 
                      ? `${stat.value}${stat.suffix}` 
                      : `${formatNumber(stat.value)}${stat.suffix}`
                  }
                </div>
                <div className="text-sm text-white/60 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border border-primary/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-accent/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary/30 rounded-full animate-float"></div>
    </section>
  );
}

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
        ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          className="text-center max-w-7xl mx-auto"
        >
          {/* Badge with glass effect */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 glass-subtle rounded-full mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-a1 animate-pulse"></div>
            <span className="text-sm font-semibold text-ink/80">
              AI-POWERED SOLUTIONS
            </span>
          </motion.div>

          {/* Main heading with proper line break and gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-center font-semibold leading-tight tracking-tight text-hero-gradient text-5xl md:text-7xl mb-6"
          >
            Future Technologies with Artificial<br/>
            Intelligence
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-ink/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            We create future technologies using artificial intelligence and machine learning.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-strong px-6 py-3 rounded-full flex items-center gap-2 group focus-ring"
            >
              <span className="font-medium">Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-6 py-3 rounded-full flex items-center gap-2 group focus-ring"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Our Innovative Services</span>
            </motion.button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-a1 mb-2">
                  {!isMounted 
                    ? `${stat.value}${stat.suffix}` 
                    : stat.value < 1000 
                      ? `${stat.value}${stat.suffix}` 
                      : `${formatNumber(stat.value)}${stat.suffix}`
                  }
                </div>
                <div className="text-sm text-ink/60 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border border-a1/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-a4/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-a2/30 rounded-full animate-float"></div>
    </section>
  );
}
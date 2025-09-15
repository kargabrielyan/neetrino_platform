'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Brain, TrendingUp } from 'lucide-react';
import { getTranslations, type Locale } from '../lib/i18n';
import { formatPercentage } from '../lib/format';
import NNArchitecture from './NNArchitecture';

interface AIDashboardProps {
  locale: Locale;
}

const tabs = [
  { id: 'neural', label: 'Neural Networks', icon: Brain },
  { id: 'data', label: 'Data Processing', icon: Database },
  { id: 'ml', label: 'Machine Learning', icon: Activity },
];

const metrics = [
  { label: 'Accuracy', value: 98.7, color: 'from-green-400 to-emerald-500' },
  { label: 'Processing', value: 85.2, color: 'from-blue-400 to-cyan-500' },
  { label: 'Uptime', value: 99.9, color: 'from-purple-400 to-violet-500' },
  { label: 'Efficiency', value: 94.2, color: 'from-orange-400 to-red-500' },
];

export default function AIDashboard({ locale }: AIDashboardProps) {
  const t = getTranslations(locale);
  const [activeTab, setActiveTab] = useState('neural');

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
    <section id="dashboard" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            {t.dashboard.title}
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            {t.dashboard.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        </motion.div>

        {/* Вкладки */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              variants={itemVariants}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'glass border border-primary/50 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Контент вкладок */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Метрики */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                {activeTab === 'neural' && t.dashboard.neural_networks}
                {activeTab === 'data' && t.dashboard.data_processing}
                {activeTab === 'ml' && t.dashboard.machine_learning}
              </h3>
              
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-glass"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/80 font-medium">
                      {metric.label}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPercentage(metric.value)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-full bg-gradient-to-r ${metric.color} rounded-full relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Диаграмма архитектуры */}
            <div className="card-glass">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">
                Neural Network Architecture
              </h4>
              <NNArchitecture />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-10 right-20 w-40 h-40 border border-primary/5 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-20 w-28 h-28 border border-accent/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
    </section>
  );
}

'use client';

// Updated: Removed all translation references
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Brain, TrendingUp } from 'lucide-react';
import { formatPercentage } from '../lib/format';
import NNArchitecture from './NNArchitecture';
import { useMounted } from '../lib/use-mounted';

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

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState('neural');
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-white mb-4">
            AI Dashboard
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            Real-time monitoring of our AI systems and machine learning processes
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-black'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Metrics */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Performance Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">{metric.label}</h4>
                      <motion.span 
                        className="text-2xl font-bold text-primary"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {formatPercentage(metric.value)}
                      </motion.span>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${metric.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-white/60">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Neural Network Visualization */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Neural Network Architecture
              </h3>
              <NNArchitecture />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
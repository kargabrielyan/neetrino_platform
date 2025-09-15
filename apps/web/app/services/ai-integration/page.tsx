'use client';

import { motion } from 'framer-motion';
import { useMounted } from '../../../lib/use-mounted';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Brain, Cpu, Database, BarChart3, MessageSquare, Eye, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'Machine Learning Models',
    description: 'Custom ML models tailored to your specific business needs',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language Processing',
    description: 'AI-powered chatbots and language understanding systems',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description: 'Image recognition, object detection, and visual analysis',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'Data-driven insights and future trend predictions',
  },
  {
    icon: Cpu,
    title: 'AI Automation',
    description: 'Intelligent automation of business processes',
  },
];

const technologies = [
  'Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'Scikit-learn',
  'Pandas', 'NumPy', 'Keras', 'Transformers', 'LangChain', 'OpenCV'
];

const aiServices = [
  { 
    name: 'Chatbots & Virtual Assistants', 
    icon: '🤖', 
    description: 'Intelligent conversational AI for customer support and automation' 
  },
  { 
    name: 'Data Analysis & Insights', 
    icon: '📊', 
    description: 'AI-powered analytics to uncover hidden patterns in your data' 
  },
  { 
    name: 'Image & Video Processing', 
    icon: '📷', 
    description: 'Computer vision solutions for visual content analysis' 
  },
  { 
    name: 'Predictive Modeling', 
    icon: '🔮', 
    description: 'Machine learning models to predict future outcomes' 
  },
];

export default function AIIntegration() {
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

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/70 mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            AI Integration
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            Harness the power of artificial intelligence to transform your business. 
            From machine learning models to intelligent automation, we integrate AI 
            solutions that drive real results.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Explore AI Solutions
            </button>
            <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
              View Case Studies
            </button>
          </motion.div>
        </motion.div>

        {/* AI Services */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            AI Services We Offer
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-white/70">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Our AI Capabilities
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            AI Technologies We Use
          </motion.h2>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Process */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Our AI Development Process
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Data Analysis', description: 'Analyze your data and define AI objectives' },
              { step: '02', title: 'Model Design', description: 'Design and train custom AI models' },
              { step: '03', title: 'Integration', description: 'Integrate AI into your existing systems' },
              { step: '04', title: 'Optimization', description: 'Monitor and optimize AI performance' },
            ].map((process, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{process.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {process.title}
                </h3>
                <p className="text-white/70">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isMounted ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Integrate AI into Your Business?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Let's explore how AI can transform your business processes and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start AI Project
              </button>
              <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

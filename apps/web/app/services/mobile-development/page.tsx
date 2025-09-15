'use client';

import { motion } from 'framer-motion';
import { useMounted } from '../../../lib/use-mounted';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Smartphone, Code, Database, Cloud, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Smartphone,
    title: 'Cross-Platform Development',
    description: 'Single codebase for iOS and Android using React Native and Flutter',
  },
  {
    icon: Code,
    title: 'Native Performance',
    description: 'Optimized native apps with platform-specific features',
  },
  {
    icon: Database,
    title: 'Offline Support',
    description: 'Apps that work seamlessly without internet connection',
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Seamless integration with cloud services and APIs',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Built-in security measures and data protection',
  },
];

const technologies = [
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS',
  'Xcode', 'Android Studio', 'Expo', 'Redux', 'GraphQL', 'TypeScript'
];

const platforms = [
  { name: 'iOS', icon: '🍎', features: ['Native iOS Development', 'Swift/Objective-C', 'App Store Optimization'] },
  { name: 'Android', icon: '🤖', features: ['Native Android Development', 'Kotlin/Java', 'Google Play Optimization'] },
  { name: 'Cross-Platform', icon: '🔄', features: ['React Native', 'Flutter', 'Single Codebase'] },
];

export default function MobileDevelopment() {
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
            <Smartphone className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Mobile App Development
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            Create powerful mobile applications for iOS and Android. From native apps to 
            cross-platform solutions, we build mobile experiences that users love.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Start Your App
            </button>
            <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
              View Portfolio
            </button>
          </motion.div>
        </motion.div>

        {/* Platform Options */}
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
            Choose Your Platform
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {platform.name}
                </h3>
                <ul className="space-y-2">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
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
            What We Offer
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
            Technologies We Use
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
            Our Development Process
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Planning', description: 'Define requirements and create wireframes' },
              { step: '02', title: 'Design', description: 'Create UI/UX designs and prototypes' },
              { step: '03', title: 'Development', description: 'Build your app with clean, scalable code' },
              { step: '04', title: 'Testing', description: 'Quality assurance and app store submission' },
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
              Ready to Build Your Mobile App?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Let's discuss your mobile app idea and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start Your Project
              </button>
              <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
                Schedule a Call
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

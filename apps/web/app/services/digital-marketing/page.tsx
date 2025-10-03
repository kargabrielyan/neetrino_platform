'use client';

import { motion } from 'framer-motion';
import { useMounted } from '../../../lib/use-mounted';
import Layout from '../../../components/Layout';
import Navbar from '../../../components/Navbar';
import { TrendingUp, Search, Share2, Mail, BarChart3, Target, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Search,
    title: 'SEO Optimization',
    description: 'Improve your search engine rankings and organic visibility',
  },
  {
    icon: Share2,
    title: 'Social Media Marketing',
    description: 'Engage your audience across all social platforms',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Build relationships and drive conversions through email',
  },
  {
    icon: Target,
    title: 'PPC Advertising',
    description: 'Targeted paid advertising campaigns for maximum ROI',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Data-driven insights to optimize your marketing efforts',
  },
];

const technologies = [
  'Google Analytics', 'Facebook Ads', 'Google Ads', 'HubSpot', 'Mailchimp',
  'Hootsuite', 'SEMrush', 'Ahrefs', 'Canva', 'Buffer', 'LinkedIn Ads', 'Twitter Ads'
];

const marketingServices = [
  { 
    name: 'Search Engine Optimization', 
    icon: '🔍', 
    description: 'Improve your website\'s visibility in search results' 
  },
  { 
    name: 'Social Media Management', 
    icon: '📱', 
    description: 'Professional social media presence and engagement' 
  },
  { 
    name: 'Content Marketing', 
    icon: '📝', 
    description: 'Create valuable content that attracts and converts' 
  },
  { 
    name: 'Paid Advertising', 
    icon: '💰', 
    description: 'Strategic paid campaigns across multiple platforms' 
  },
];

export default function DigitalMarketing() {
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
    <Layout>
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
            <TrendingUp className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Digital Marketing
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            Grow your business with comprehensive digital marketing strategies. 
            From SEO to social media, we help you reach and engage your target audience 
            across all digital channels.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Start Marketing Campaign
            </button>
            <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
              View Case Studies
            </button>
          </motion.div>
        </motion.div>

        {/* Marketing Services */}
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
            Marketing Services We Offer
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketingServices.map((service, index) => (
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
            Our Marketing Capabilities
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
            Marketing Tools We Use
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
            Our Marketing Process
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Strategy', description: 'Develop comprehensive marketing strategy' },
              { step: '02', title: 'Implementation', description: 'Execute campaigns across all channels' },
              { step: '03', title: 'Monitoring', description: 'Track performance and optimize results' },
              { step: '04', title: 'Reporting', description: 'Provide detailed analytics and insights' },
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
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Let's create a digital marketing strategy that drives real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start Marketing Campaign
              </button>
              <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
                Get Free Consultation
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

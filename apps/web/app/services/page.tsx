'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { 
  Globe, 
  Smartphone, 
  Brain, 
  TrendingUp, 
  Shield, 
  Cloud,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Services() {

  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern web applications using the latest technologies and frameworks',
      href: '/services/web-development',
      features: [
        'Responsive Design',
        'Progressive Web Apps',
        'E-commerce Solutions',
        'CMS Development',
        'API Integration',
        'Performance Optimization'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      href: '/services/mobile-development',
      features: [
        'Native iOS Development',
        'Native Android Development',
        'Cross-platform Solutions',
        'App Store Optimization',
        'Push Notifications',
        'Offline Functionality'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']
    },
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Integrate artificial intelligence and machine learning into your projects',
      href: '/services/ai-integration',
      features: [
        'Machine Learning Models',
        'Natural Language Processing',
        'Computer Vision',
        'Predictive Analytics',
        'Chatbots & Virtual Assistants',
        'Data Analysis & Insights'
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face']
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategies to grow your business',
      href: '/services/digital-marketing',
      features: [
        'SEO Optimization',
        'Social Media Marketing',
        'Content Marketing',
        'PPC Advertising',
        'Email Marketing',
        'Analytics & Reporting'
      ],
      technologies: ['Google Analytics', 'Facebook Ads', 'Google Ads', 'HubSpot', 'Mailchimp']
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Protect your data and systems with comprehensive security solutions',
      href: '/services/cybersecurity',
      features: [
        'Security Audits',
        'Penetration Testing',
        'Data Encryption',
        'Access Control',
        'Security Monitoring',
        'Compliance Management'
      ],
      technologies: ['OWASP', 'NIST', 'ISO 27001', 'GDPR', 'SOC 2']
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and DevOps solutions for your business',
      href: '/services/cloud-solutions',
      features: [
        'Cloud Migration',
        'Infrastructure as Code',
        'CI/CD Pipelines',
        'Container Orchestration',
        'Monitoring & Logging',
        'Disaster Recovery'
      ],
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes']
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-ink mb-4">Our Services</h1>
          <p className="text-xl text-ink/70 max-w-3xl mx-auto">
            We provide comprehensive technology solutions to help your business grow and succeed in the digital world
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 hover:glass-strong transition-all duration-300 group"
            >
              {/* Icon and Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-ink mb-2">{service.title}</h3>
                  <p className="text-ink/70">{service.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-ink font-semibold mb-3">Key Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-a1 flex-shrink-0" />
                      <span className="text-ink/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-ink font-semibold mb-3">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-a1/20 text-a1 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Link 
                href={service.href}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 glass-strong text-ink rounded-xl font-semibold hover:glass transition-colors group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="glass rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-ink mb-8 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We understand your needs and goals' },
              { step: '02', title: 'Planning', description: 'We create a detailed project roadmap' },
              { step: '03', title: 'Development', description: 'We build your solution with care' },
              { step: '04', title: 'Launch', description: 'We deploy and support your project' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-a1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-a1 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-ink font-semibold mb-2">{item.title}</h3>
                <p className="text-ink/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-ink mb-4">Ready to Start Your Project?</h2>
            <p className="text-ink/70 mb-6 max-w-2xl mx-auto">
              Let's discuss your requirements and create something amazing together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="px-8 py-3 glass-strong text-ink rounded-full font-semibold hover:glass transition-all duration-200 focus-ring group flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                href="/portfolio"
                className="px-8 py-3 glass text-ink rounded-full hover:glass-strong transition-all duration-200 focus-ring group flex items-center justify-center gap-2"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

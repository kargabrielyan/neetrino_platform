'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, Target, Award, Lightbulb } from 'lucide-react';

export default function About() {

  const team = [
    {
      name: 'Արամ Մկրտչյան',
      role: 'CEO & Founder',
      image: '/api/placeholder/200/200',
    },
    {
      name: 'Սարա Ջոնսոն',
      role: 'CTO',
      image: '/api/placeholder/200/200',
    },
    {
      name: 'Միքայել Պետրոսյան',
      role: 'Lead Developer',
      image: '/api/placeholder/200/200',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Determination',
      description: 'We always strive to achieve the best results for our clients',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We use cutting-edge technologies and creative solutions',
    },
    {
      icon: Users,
      title: 'Team',
      description: 'Our team is our strength and the foundation of success',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We ensure high quality in all our projects',
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About Company</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Neetrino is an innovative IT company specializing in creating 
            modern web solutions using artificial intelligence
          </p>
        </div>

        {/* О компании */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Founded in 2020, Neetrino quickly became a leading IT company 
                  in Armenia. We specialize in web application development, 
                  mobile applications, and AI solution integration.
                </p>
                <p>
                  Our team consists of experienced developers, designers, and 
                  machine learning specialists who work together 
                  to create innovative products.
                </p>
                <p>
                  We are proud to help our clients achieve their goals 
                  with cutting-edge technologies and creative solutions.
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Our Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">50+ successful projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">30+ satisfied clients</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">5 years of experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/80">100% quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-white/70 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Photo</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
            <p className="text-white/70 mb-6">
              Contact us to discuss your project
            </p>
            <button className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
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
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="glass p-8 rounded-3xl">
            <h1 className="text-4xl font-bold text-ink mb-4">About Company</h1>
            <p className="text-xl text-ink/70 max-w-3xl mx-auto">
              Neetrino is an innovative IT company specializing in creating 
              modern web solutions using artificial intelligence
            </p>
          </div>
        </div>

        {/* О компании */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="glass p-6 rounded-3xl">
              <h2 className="text-2xl font-bold text-ink mb-6">Our Story</h2>
              <div className="space-y-4 text-ink/80 leading-relaxed">
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
            
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-xl font-semibold text-ink mb-4">Our Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-a1 rounded-full"></div>
                  <span className="text-ink/80">50+ successful projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-a1 rounded-full"></div>
                  <span className="text-ink/80">30+ satisfied clients</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-a1 rounded-full"></div>
                  <span className="text-ink/80">5 years of experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-a1 rounded-full"></div>
                  <span className="text-ink/80">100% quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="glass p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-a1/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-a1" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">{value.title}</h3>
                  <p className="text-ink/70 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div key={index} className="glass p-6 rounded-2xl text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-a1/20 to-a4/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-ink/50 text-sm">Photo</span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-1">{member.name}</h3>
                  <p className="text-a1 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-ink mb-4">Ready to Start Your Project?</h2>
            <p className="text-ink/70 mb-6">
              Contact us to discuss your project
            </p>
            <button className="glass-strong px-6 py-3 rounded-full text-ink font-semibold hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

'use client';

import { useState } from 'react';
import { type Locale } from '../lib/i18n';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ParticlesCanvas from '../components/ParticlesCanvas';
import ServicesGrid from '../components/ServicesGrid';
import AIDashboard from '../components/AIDashboard';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <main className="relative min-h-screen">
      {/* Фоновые частицы */}
      <ParticlesCanvas className="fixed inset-0 z-0" />
      
      {/* Навигация */}
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      {/* Основной контент */}
      <div className="relative z-10">
        <Hero locale={locale} />
        <ServicesGrid locale={locale} />
        <AIDashboard locale={locale} />
        <Pricing locale={locale} />
        <Testimonials locale={locale} />
        <Footer locale={locale} />
      </div>
    </main>
  );
}

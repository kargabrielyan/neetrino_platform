'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ParticlesCanvas from '../components/ParticlesCanvas';
import ServicesGrid from '../components/ServicesGrid';
import AIDashboard from '../components/AIDashboard';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Фоновые частицы */}
      <ParticlesCanvas className="fixed inset-0 z-0" />
      
      {/* Навигация */}
      <Navbar />
      
      {/* Основной контент */}
      <div className="relative z-10">
        <Hero />
        <ServicesGrid />
        <AIDashboard />
        <Pricing />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}

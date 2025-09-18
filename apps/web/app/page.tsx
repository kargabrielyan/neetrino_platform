'use client';

import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ParticlesCanvas from '../components/ParticlesCanvas';
import ServicesGrid from '../components/ServicesGrid';
import AIDashboard from '../components/AIDashboard';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import NoSSR from '../components/NoSSR';

export default function Home() {
  return (
    <>
      {/* Фоновые частицы */}
      <NoSSR fallback={<div className="fixed inset-0 z-0" />}>
        <ParticlesCanvas className="fixed inset-0 z-0" />
      </NoSSR>
      
      <Layout>
        <Hero />
        <ServicesGrid />
        <AIDashboard />
        <Pricing />
        <Testimonials />
      </Layout>
    </>
  );
}

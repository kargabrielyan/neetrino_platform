'use client';

import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import AIDashboard from '../components/AIDashboard';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ServicesGrid />
      <AIDashboard />
      <Pricing />
      <Testimonials />
    </Layout>
  );
}

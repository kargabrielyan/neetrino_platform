'use client';

import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import BestOfferings from '../components/BestOfferings';
import BestSellers from '../components/BestSellers';
import FeaturedWebsites from '../components/FeaturedWebsites';
import ChooseWebsite from '../components/ChooseWebsite';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ServicesGrid />
      <BestOfferings />
      <BestSellers />
      <FeaturedWebsites />
      <ChooseWebsite />
      <Testimonials />
    </Layout>
  );
}

'use client';

import { Suspense } from 'react';
import Layout from '../../components/Layout';
import { usePortfolioFilters } from '../../lib/use-portfolio-filters';
import PortfolioGrid from '../../components/portfolio/PortfolioGrid';
import PortfolioCTA from '../../components/portfolio/PortfolioCTA';

function PortfolioContent() {
  const filters = usePortfolioFilters();

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Projects Grid */}
        <PortfolioGrid filters={filters} />
        
        {/* CTA Section */}
        <PortfolioCTA />
      </div>
    </Layout>
  );
}

export default function Portfolio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <PortfolioContent />
    </Suspense>
  );
}

'use client';

import Layout from '../../components/Layout';
import { usePortfolioFilters } from '../../lib/use-portfolio-filters';
import PortfolioGrid from '../../components/portfolio/PortfolioGrid';
import PortfolioCTA from '../../components/portfolio/PortfolioCTA';

export default function Portfolio() {
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

'use client';

import { projects } from '@/lib/portfolio-data';

interface PortfolioHeroProps {
  className?: string;
}

export default function PortfolioHero({ className = '' }: PortfolioHeroProps) {
  const totalProjects = projects.length;
  const uniqueClients = new Set(projects.map(p => p.client)).size;
  const uniqueTechnologies = new Set(projects.flatMap(p => p.tech)).size;

  return (
    <section className={`text-center py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="glass p-8 rounded-3xl max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore our best projects and solutions we've created for our clients
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-subtle p-6 rounded-2xl">
              <div className="text-3xl font-bold text-a1 mb-2">{totalProjects}</div>
              <div className="text-ink/70 font-medium">Projects</div>
            </div>
            <div className="glass-subtle p-6 rounded-2xl">
              <div className="text-3xl font-bold text-a2 mb-2">{uniqueClients}</div>
              <div className="text-ink/70 font-medium">Clients</div>
            </div>
            <div className="glass-subtle p-6 rounded-2xl">
              <div className="text-3xl font-bold text-a3 mb-2">{uniqueTechnologies}</div>
              <div className="text-ink/70 font-medium">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

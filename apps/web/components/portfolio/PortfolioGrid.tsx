'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/portfolio-data';
import { UsePortfolioFiltersReturn } from '@/lib/use-portfolio-filters';
import ProjectCard from './ProjectCard';

interface PortfolioGridProps {
  filters: UsePortfolioFiltersReturn;
  className?: string;
}

// Skeleton component for loading state
function ProjectCardSkeleton() {
  return (
    <div className="glass rounded-3xl overflow-hidden animate-pulse">
      <div className="h-48 bg-ink/10"></div>
      <div className="p-6">
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-ink/10 rounded w-20"></div>
          <div className="h-4 bg-ink/10 rounded w-16"></div>
        </div>
        <div className="h-6 bg-ink/10 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-ink/10 rounded w-full mb-2"></div>
        <div className="h-4 bg-ink/10 rounded w-2/3 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-ink/10 rounded-full w-16"></div>
          <div className="h-6 bg-ink/10 rounded-full w-20"></div>
          <div className="h-6 bg-ink/10 rounded-full w-14"></div>
        </div>
        <div className="h-10 bg-ink/10 rounded-full"></div>
      </div>
    </div>
  );
}

export default function PortfolioGrid({ filters, className = '' }: PortfolioGridProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDisplayedProjects(filters.filteredProjects);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.filteredProjects]);

  // Show loading skeletons
  if (isLoading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (displayedProjects.length === 0) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="glass p-12 rounded-3xl max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-ink mb-2">No projects found</h3>
            <p className="text-ink/70 mb-6">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
              onClick={filters.resetFilters}
              className="px-6 py-3 glass-strong text-ink rounded-full font-medium hover:glass transition-all duration-200 focus-ring"
            >
              Reset filters
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Portfolio Title */}
        <div className="text-center mb-20 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-ink">
            Portfolio
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 3} // Priority loading for first 3 images
            />
          ))}
        </div>

        {/* Load More Button */}
        {filters.filters.page < filters.totalPages && (
          <div className="text-center mt-12">
            <button
              onClick={filters.loadMore}
              className="px-8 py-3 glass-strong text-ink rounded-full font-medium hover:glass transition-all duration-200 focus-ring"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

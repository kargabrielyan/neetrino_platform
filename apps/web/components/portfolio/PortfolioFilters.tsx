'use client';

import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { categories, technologies } from '@/lib/portfolio-data';
import { UsePortfolioFiltersReturn } from '@/lib/use-portfolio-filters';

interface PortfolioFiltersProps {
  filters: UsePortfolioFiltersReturn;
  className?: string;
}

export default function PortfolioFilters({ filters, className = '' }: PortfolioFiltersProps) {
  const [showTechFilter, setShowTechFilter] = useState(false);

  const handleTechToggle = (tech: string) => {
    const newTechs = filters.filters.technologies.includes(tech)
      ? filters.filters.technologies.filter(t => t !== tech)
      : [...filters.filters.technologies, tech];
    filters.updateTechnologies(newTechs);
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={filters.filters.searchQuery}
              onChange={(e) => filters.updateSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-2xl text-ink placeholder-ink/50 focus:glass-strong transition-all duration-200 focus-ring"
            />
            {filters.filters.searchQuery && (
              <button
                onClick={() => filters.updateSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => filters.updateCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 focus-ring ${
                filters.filters.category === category.id
                  ? 'glass-strong text-ink'
                  : 'glass text-ink/70 hover:text-ink hover:glass-strong'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Technology Filter Toggle */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowTechFilter(!showTechFilter)}
            className="inline-flex items-center gap-2 px-4 py-2 glass text-ink/70 hover:text-ink hover:glass-strong rounded-full transition-all duration-200 focus-ring"
          >
            <Filter className="w-4 h-4" />
            Filter by technologies
            {filters.filters.technologies.length > 0 && (
              <span className="bg-a1 text-white text-xs px-2 py-1 rounded-full">
                {filters.filters.technologies.length}
              </span>
            )}
          </button>
        </div>

        {/* Technology Filters */}
        {showTechFilter && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="glass p-6 rounded-2xl">
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 focus-ring ${
                      filters.filters.technologies.includes(tech)
                        ? 'glass-strong text-ink'
                        : 'glass-subtle text-ink/70 hover:text-ink hover:glass'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset Filters */}
        {filters.hasActiveFilters && (
          <div className="text-center">
            <button
              onClick={filters.resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 glass text-ink/70 hover:text-ink hover:glass-strong rounded-full transition-all duration-200 focus-ring"
            >
              <X className="w-4 h-4" />
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

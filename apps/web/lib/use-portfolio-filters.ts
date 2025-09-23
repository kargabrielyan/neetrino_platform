'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects, Project } from './portfolio-data';

export interface PortfolioFilters {
  category: string;
  technologies: string[];
  searchQuery: string;
  page: number;
  itemsPerPage: number;
}

export interface UsePortfolioFiltersReturn {
  filters: PortfolioFilters;
  filteredProjects: Project[];
  totalPages: number;
  hasActiveFilters: boolean;
  updateCategory: (category: string) => void;
  updateTechnologies: (technologies: string[]) => void;
  updateSearchQuery: (query: string) => void;
  updatePage: (page: number) => void;
  resetFilters: () => void;
  loadMore: () => void;
}

const ITEMS_PER_PAGE = 9;

export function usePortfolioFilters(): UsePortfolioFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<PortfolioFilters>({
    category: searchParams.get('category') || 'all',
    technologies: searchParams.get('tech')?.split(',').filter(Boolean) || [],
    searchQuery: searchParams.get('q') || '',
    page: parseInt(searchParams.get('page') || '1'),
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: PortfolioFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.category !== 'all') {
      params.set('category', newFilters.category);
    }
    
    if (newFilters.technologies.length > 0) {
      params.set('tech', newFilters.technologies.join(','));
    }
    
    if (newFilters.searchQuery) {
      params.set('q', newFilters.searchQuery);
    }
    
    if (newFilters.page > 1) {
      params.set('page', newFilters.page.toString());
    }
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : '';
    
    router.replace(`/portfolio${newURL}`, { scroll: false });
  }, [router]);

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    // Filter by technologies (AND logic - project must have ALL selected technologies)
    if (filters.technologies.length > 0) {
      filtered = filtered.filter(project =>
        filters.technologies.every(tech => project.tech.includes(tech))
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query)) ||
        project.tech.some(tech => tech.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [filters.category, filters.technologies, filters.searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / filters.itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredProjects.slice(0, endIndex);
  }, [filteredProjects, filters.page, filters.itemsPerPage]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== 'all' ||
      filters.technologies.length > 0 ||
      filters.searchQuery !== ''
    );
  }, [filters.category, filters.technologies, filters.searchQuery]);

  // Update functions
  const updateCategory = useCallback((category: string) => {
    const newFilters = { ...filters, category, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  const updateTechnologies = useCallback((technologies: string[]) => {
    const newFilters = { ...filters, technologies, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  const updateSearchQuery = useCallback((searchQuery: string) => {
    const newFilters = { ...filters, searchQuery, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  const updatePage = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  const resetFilters = useCallback(() => {
    const newFilters = {
      category: 'all',
      technologies: [],
      searchQuery: '',
      page: 1,
      itemsPerPage: ITEMS_PER_PAGE,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [updateURL]);

  const loadMore = useCallback(() => {
    if (filters.page < totalPages) {
      const newFilters = { ...filters, page: filters.page + 1 };
      setFilters(newFilters);
      updateURL(newFilters);
    }
  }, [filters, totalPages, updateURL]);

  return {
    filters,
    filteredProjects: paginatedProjects,
    totalPages,
    hasActiveFilters,
    updateCategory,
    updateTechnologies,
    updateSearchQuery,
    updatePage,
    resetFilters,
    loadMore,
  };
}

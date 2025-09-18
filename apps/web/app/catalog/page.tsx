'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMounted } from '../../lib/use-mounted';
import Layout from '../../components/Layout';
import { Search, Filter, Grid, List, ExternalLink, Eye } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  screenshotUrl: string;
  viewCount: number;
  isAccessible: boolean;
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  createdAt: string;
}

interface SearchFilters {
  q: string;
  vendors: string[];
  categories: string[];
  subcategories: string[];
  sortBy: 'relevance' | 'createdAt' | 'viewCount' | 'title';
  sortOrder: 'ASC' | 'DESC';
}

interface SearchResponse {
  data: Demo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  suggestions: string[];
  filters: {
    vendors: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    subcategories: Array<{ name: string; count: number }>;
  };
}

export default function Catalog() {
  const isMounted = useMounted();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    vendors: [],
    categories: [],
    subcategories: [],
    sortBy: 'relevance',
    sortOrder: 'DESC',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Функция для выполнения поиска
  const performSearch = useCallback(async (searchFilters: SearchFilters, page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchFilters.q.trim()) params.append('q', searchFilters.q.trim());
      if (searchFilters.vendors.length > 0) {
        searchFilters.vendors.forEach(vendor => params.append('vendors', vendor));
      }
      if (searchFilters.categories.length > 0) {
        searchFilters.categories.forEach(category => params.append('categories', category));
      }
      if (searchFilters.subcategories.length > 0) {
        searchFilters.subcategories.forEach(subcategory => params.append('subcategories', subcategory));
      }
      params.append('sortBy', searchFilters.sortBy);
      params.append('sortOrder', searchFilters.sortOrder);
      params.append('page', page.toString());
      params.append('limit', '20');

      // Try to fetch from API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch(`http://localhost:3001/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data: SearchResponse = await response.json();
        setSearchData(data);
        setCurrentPage(page);
        setIsUsingFallback(false);
        return; // Success, exit early
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.warn('API fetch failed, using fallback data:', fetchError);
        throw fetchError; // Re-throw to trigger fallback
      }
    } catch (error) {
      console.warn('Search error, using fallback data:', error);
      // Fallback to mock data
      const fallbackDemos = [
        {
          id: '1',
          title: 'E-commerce Store',
          description: 'Modern e-commerce platform with advanced features and AI-powered recommendations',
          url: 'https://demo-store.neetrino.com',
          category: 'E-commerce',
          subcategory: 'Online Store',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 150,
          isAccessible: true,
          vendor: {
            id: '1',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: '2',
          title: 'Portfolio Website',
          description: 'Creative portfolio website with modern design and smooth animations',
          url: 'https://demo-portfolio.neetrino.com',
          category: 'Portfolio',
          subcategory: 'Creative',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 89,
          isAccessible: true,
          vendor: {
            id: '2',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
        {
          id: '3',
          title: 'Blog Platform',
          description: 'Content management system for bloggers with AI content suggestions',
          url: 'https://demo-blog.neetrino.com',
          category: 'Blog',
          subcategory: 'CMS',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 234,
          isAccessible: true,
          vendor: {
            id: '3',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        },
        {
          id: '4',
          title: 'AI Dashboard',
          description: 'Real-time analytics dashboard with machine learning insights',
          url: 'https://demo-ai.neetrino.com',
          category: 'AI Solutions',
          subcategory: 'Analytics',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 312,
          isAccessible: true,
          vendor: {
            id: '4',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        },
        {
          id: '5',
          title: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication',
          url: 'https://demo-banking.neetrino.com',
          category: 'Mobile Apps',
          subcategory: 'Finance',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 178,
          isAccessible: true,
          vendor: {
            id: '5',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        },
        {
          id: '6',
          title: 'Learning Management System',
          description: 'Online education platform with AI-powered course recommendations',
          url: 'https://demo-lms.neetrino.com',
          category: 'Education',
          subcategory: 'E-Learning',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 267,
          isAccessible: true,
          vendor: {
            id: '6',
            name: 'Neetrino',
            website: 'https://neetrino.com',
            logoUrl: 'https://neetrino.com/logo.png',
          },
          createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        },
      ];

      // Применяем фильтры к fallback данным
      let filteredDemos = fallbackDemos;

      if (searchFilters.q.trim()) {
        const searchTerm = searchFilters.q.toLowerCase();
        filteredDemos = filteredDemos.filter(demo => 
          demo.title.toLowerCase().includes(searchTerm) ||
          demo.description.toLowerCase().includes(searchTerm) ||
          demo.vendor.name.toLowerCase().includes(searchTerm)
        );
      }

      if (searchFilters.vendors.length > 0) {
        filteredDemos = filteredDemos.filter(demo => 
          searchFilters.vendors.includes(demo.vendor.id)
        );
      }

      if (searchFilters.categories.length > 0) {
        filteredDemos = filteredDemos.filter(demo => 
          searchFilters.categories.includes(demo.category)
        );
      }

      if (searchFilters.subcategories.length > 0) {
        filteredDemos = filteredDemos.filter(demo => 
          searchFilters.subcategories.includes(demo.subcategory)
        );
      }

      // Пагинация
      const limit = 20;
      const skip = (page - 1) * limit;
      const paginatedDemos = filteredDemos.slice(skip, skip + limit);

      setSearchData({
        data: paginatedDemos,
        total: filteredDemos.length,
        page,
        limit,
        totalPages: Math.ceil(filteredDemos.length / limit),
        query: searchFilters.q,
        suggestions: [],
        filters: { 
          vendors: [
            { id: '1', name: 'Neetrino', count: 6 },
          ], 
          categories: [
            { name: 'E-commerce', count: 1 },
            { name: 'Portfolio', count: 1 },
            { name: 'Blog', count: 1 },
            { name: 'AI Solutions', count: 1 },
            { name: 'Mobile Apps', count: 1 },
            { name: 'Education', count: 1 },
          ], 
          subcategories: [
            { name: 'Online Store', count: 1 },
            { name: 'Creative', count: 1 },
            { name: 'CMS', count: 1 },
            { name: 'Analytics', count: 1 },
            { name: 'Finance', count: 1 },
            { name: 'E-Learning', count: 1 },
          ] 
        }
      });
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Выполняем поиск при изменении фильтров
  useEffect(() => {
    if (isMounted) {
      performSearch(filters, 1);
    }
  }, [filters, isMounted, performSearch]);

  // Обработчики для фильтров
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, q: value }));
  };

  const handleVendorFilter = (vendorId: string) => {
    setFilters(prev => ({
      ...prev,
      vendors: prev.vendors.includes(vendorId)
        ? prev.vendors.filter(id => id !== vendorId)
        : [...prev.vendors, vendorId]
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(cat => cat !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setFilters(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(sub => sub !== subcategory)
        : [...prev.subcategories, subcategory]
    }));
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handlePageChange = (page: number) => {
    performSearch(filters, page);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      vendors: [],
      categories: [],
      subcategories: [],
      sortBy: 'relevance',
      sortOrder: 'DESC',
    });
  };

  if (!isMounted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="glass p-6 rounded-3xl">
            <h1 className="text-3xl font-bold text-ink mb-2">Demo Catalog</h1>
            <p className="text-ink/70">Find the perfect design for your project</p>
            {isUsingFallback && (
              <div className="mt-4 p-3 glass-subtle rounded-2xl border border-a4/30">
                <p className="text-sm text-ink/80">
                  <span className="text-a4 font-medium">ℹ️ Demo Mode:</span> Showing sample projects. 
                  API server is not available, but you can still explore our demo catalog.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
              <input
                type="text"
                placeholder="Search by name or vendor..."
                value={filters.q}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-subtle rounded-full text-ink placeholder-ink/50 focus-ring"
              />
            </div>
            
            {/* Кнопка фильтров */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 focus-ring ${
                showFilters || filters.vendors.length > 0 || filters.categories.length > 0 || filters.subcategories.length > 0
                  ? 'glass-strong text-ink'
                  : 'glass text-ink/70 hover:text-ink hover:glass-strong'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.vendors.length + filters.categories.length + filters.subcategories.length) > 0 && (
                <span className="glass-strong text-ink text-xs px-2 py-1 rounded-full">
                  {filters.vendors.length + filters.categories.length + filters.subcategories.length}
                </span>
              )}
            </button>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && searchData && (
            <div className="glass p-4 rounded-3xl space-y-4">
              {/* Сортировка */}
              <div>
                <label className="block text-ink/70 text-sm mb-2">Sort by</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
                  className="w-full px-3 py-2 glass-subtle rounded-full text-ink focus-ring"
                >
                  <option value="relevance" className="text-ink">Relevance</option>
                  <option value="createdAt" className="text-ink">Date Created</option>
                  <option value="viewCount" className="text-ink">Most Popular</option>
                  <option value="title" className="text-ink">Title</option>
                </select>
              </div>

              {/* Вендоры */}
              {searchData.filters.vendors.length > 0 && (
                <div>
                  <label className="block text-ink/70 text-sm mb-2">Vendors</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.vendors.map(vendor => (
                      <button
                        key={vendor.id}
                        onClick={() => handleVendorFilter(vendor.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus-ring ${
                          filters.vendors.includes(vendor.id)
                            ? 'glass-strong text-ink'
                            : 'glass text-ink/70 hover:text-ink hover:glass-strong'
                        }`}
                      >
                        {vendor.name} ({vendor.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Категории */}
              {searchData.filters.categories.length > 0 && (
                <div>
                  <label className="block text-ink/70 text-sm mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.categories.map(category => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryFilter(category.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus-ring ${
                          filters.categories.includes(category.name)
                            ? 'glass-strong text-ink'
                            : 'glass text-ink/70 hover:text-ink hover:glass-strong'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Подкатегории */}
              {searchData.filters.subcategories.length > 0 && (
                <div>
                  <label className="block text-ink/70 text-sm mb-2">Subcategories</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.subcategories.map(subcategory => (
                      <button
                        key={subcategory.name}
                        onClick={() => handleSubcategoryFilter(subcategory.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 focus-ring ${
                          filters.subcategories.includes(subcategory.name)
                            ? 'glass-strong text-ink'
                            : 'glass text-ink/70 hover:text-ink hover:glass-strong'
                        }`}
                      >
                        {subcategory.name} ({subcategory.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Очистить фильтры */}
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-ink/70 hover:text-ink transition-colors focus-ring rounded-lg"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Статистика и переключатель вида */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-ink/70 text-sm">Searching...</span>
              ) : (
                <span className="text-ink/70 text-sm">
                  Found: {searchData?.total || 0} demos
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all duration-200 focus-ring ${
                  viewMode === 'grid' 
                    ? 'glass-strong text-ink' 
                    : 'glass text-ink/50 hover:text-ink hover:glass-strong'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all duration-200 focus-ring ${
                  viewMode === 'list' 
                    ? 'glass-strong text-ink' 
                    : 'glass text-ink/50 hover:text-ink hover:glass-strong'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Результаты поиска */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-ink/70">Loading demos...</div>
          </div>
        ) : searchData && searchData.data.length > 0 ? (
          <>
            {/* Сетка демо */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {searchData.data.map((demo) => (
                <div
                  key={demo.id}
                  className={`glass rounded-3xl overflow-hidden hover:glass-strong transition-all duration-200 focus-ring ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Изображение */}
                  <div className={`bg-a1/10 ${
                    viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'
                  }`}>
                    {demo.screenshotUrl ? (
                      <img
                        src={demo.screenshotUrl}
                        alt={demo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-a1/10 flex items-center justify-center">
                        <span className="text-ink/50 text-sm">Preview</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Контент */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-ink font-semibold">{demo.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-ink/60 text-xs">
                          <Eye className="w-3 h-3" />
                          {demo.viewCount}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          demo.isAccessible 
                            ? 'glass-subtle text-green-600' 
                            : 'glass-subtle text-red-600'
                        }`}>
                          {demo.isAccessible ? 'Live' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-ink/60 text-sm mb-3">
                      <div>Vendor: {demo.vendor.name}</div>
                      <div>Category: {demo.category}</div>
                      {demo.subcategory && <div>Subcategory: {demo.subcategory}</div>}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(demo.url, '_blank')}
                        className="flex-1 px-3 py-2 glass-strong text-ink rounded-full text-sm font-medium hover:glass transition-all duration-200 focus-ring group flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 glass text-ink rounded-full text-sm hover:glass-strong transition-all duration-200 focus-ring flex items-center gap-1 group"
                      >
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {searchData.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-ink/50 hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring rounded-lg"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, searchData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-full transition-all duration-200 focus-ring ${
                          currentPage === page
                            ? 'glass-strong text-ink'
                            : 'glass text-ink/50 hover:text-ink hover:glass-strong'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === searchData.totalPages}
                    className="px-3 py-2 text-ink/50 hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-ink/70 mb-4">No demos found</div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 glass-strong text-ink rounded-full hover:glass transition-all duration-200 focus-ring"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
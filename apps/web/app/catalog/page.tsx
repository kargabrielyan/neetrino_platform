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

      const response = await fetch(`http://localhost:3001/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data: SearchResponse = await response.json();
      setSearchData(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      const fallbackDemos = [
        {
          id: '1',
          title: 'E-commerce Store',
          description: 'Modern e-commerce platform with advanced features',
          url: 'https://example-store.com',
          category: 'E-commerce',
          subcategory: 'Online Store',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 150,
          isAccessible: true,
          vendor: {
            id: '1',
            name: 'Shopify',
            website: 'https://shopify.com',
            logoUrl: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-logo.png',
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Portfolio Website',
          description: 'Creative portfolio website with modern design',
          url: 'https://example-portfolio.com',
          category: 'Portfolio',
          subcategory: 'Creative',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 89,
          isAccessible: true,
          vendor: {
            id: '2',
            name: 'Webflow',
            website: 'https://webflow.com',
            logoUrl: 'https://uploads-ssl.webflow.com/5d3e265ac8bcb6bc2f86b3c6/5d5595354c65721b5a0b8e0c_webflow-logo.png',
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Blog Platform',
          description: 'Content management system for bloggers',
          url: 'https://example-blog.com',
          category: 'Blog',
          subcategory: 'CMS',
          imageUrl: 'https://api.placeholder.com/400/300',
          screenshotUrl: 'https://api.placeholder.com/800/600',
          viewCount: 234,
          isAccessible: true,
          vendor: {
            id: '3',
            name: 'WordPress',
            website: 'https://wordpress.org',
            logoUrl: 'https://s.w.org/images/wmark.png',
          },
          createdAt: new Date().toISOString(),
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
            { id: '1', name: 'Shopify', count: 1 },
            { id: '2', name: 'Webflow', count: 1 },
            { id: '3', name: 'WordPress', count: 1 },
          ], 
          categories: [
            { name: 'E-commerce', count: 1 },
            { name: 'Portfolio', count: 1 },
            { name: 'Blog', count: 1 },
          ], 
          subcategories: [
            { name: 'Online Store', count: 1 },
            { name: 'Creative', count: 1 },
            { name: 'CMS', count: 1 },
          ] 
        }
      });
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/70 mt-4">Loading...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Demo Catalog</h1>
          <p className="text-white/70">Find the perfect design for your project</p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by name or vendor..."
                value={filters.q}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            
            {/* Кнопка фильтров */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                showFilters || filters.vendors.length > 0 || filters.categories.length > 0 || filters.subcategories.length > 0
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.vendors.length + filters.categories.length + filters.subcategories.length) > 0 && (
                <span className="bg-primary text-black text-xs px-2 py-1 rounded-full">
                  {filters.vendors.length + filters.categories.length + filters.subcategories.length}
                </span>
              )}
            </button>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && searchData && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
              {/* Сортировка */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Sort by</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="relevance" className="text-black">Relevance</option>
                  <option value="createdAt" className="text-black">Date Created</option>
                  <option value="viewCount" className="text-black">Most Popular</option>
                  <option value="title" className="text-black">Title</option>
                </select>
              </div>

              {/* Вендоры */}
              {searchData.filters.vendors.length > 0 && (
                <div>
                  <label className="block text-white/70 text-sm mb-2">Vendors</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.vendors.map(vendor => (
                      <button
                        key={vendor.id}
                        onClick={() => handleVendorFilter(vendor.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.vendors.includes(vendor.id)
                            ? 'bg-primary text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
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
                  <label className="block text-white/70 text-sm mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.categories.map(category => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryFilter(category.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.categories.includes(category.name)
                            ? 'bg-primary text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
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
                  <label className="block text-white/70 text-sm mb-2">Subcategories</label>
                  <div className="flex flex-wrap gap-2">
                    {searchData.filters.subcategories.map(subcategory => (
                      <button
                        key={subcategory.name}
                        onClick={() => handleSubcategoryFilter(subcategory.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.subcategories.includes(subcategory.name)
                            ? 'bg-primary text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
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
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
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
                <span className="text-white/70 text-sm">Searching...</span>
              ) : (
                <span className="text-white/70 text-sm">
                  Found: {searchData?.total || 0} demos
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-white/50 hover:text-white'
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
            <div className="text-white/70">Loading demos...</div>
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
                  className={`bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Изображение */}
                  <div className={`bg-white/5 ${
                    viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'
                  }`}>
                    {demo.screenshotUrl ? (
                      <img
                        src={demo.screenshotUrl}
                        alt={demo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-white/50 text-sm">Preview</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Контент */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold">{demo.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-white/60 text-xs">
                          <Eye className="w-3 h-3" />
                          {demo.viewCount}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          demo.isAccessible 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {demo.isAccessible ? 'Live' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-white/60 text-sm mb-3">
                      <div>Vendor: {demo.vendor.name}</div>
                      <div>Category: {demo.category}</div>
                      {demo.subcategory && <div>Subcategory: {demo.subcategory}</div>}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        View
                      </button>
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
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
                    className="px-3 py-2 text-white/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, searchData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-black'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === searchData.totalPages}
                    className="px-3 py-2 text-white/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/70 mb-4">No demos found</div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
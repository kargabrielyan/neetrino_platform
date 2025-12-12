'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMounted } from '../../../lib/use-mounted';
import Layout from '../../../components/Layout';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '../../../components/ProductCard';

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
  regularPrice: number;
  salePrice?: number;
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
  sortBy: 'relevance' | 'createdAt' | 'viewCount' | 'title' | 'price_asc' | 'price_desc';
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

export default function AppCatalog() {
  const router = useRouter();
  const isMounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    vendors: [],
    categories: ['App'], // Фиксированная категория - только приложения
    subcategories: [],
    sortBy: 'relevance',
    sortOrder: 'DESC',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [allDemos, setAllDemos] = useState<Demo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Загружаем избранное из localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist_ids');
    if (savedWishlist) {
      try {
        setWishlistIds(new Set(JSON.parse(savedWishlist)));
      } catch (e) {
        console.error('Ошибка загрузки избранного:', e);
      }
    }
  }, []);

  // Сохраняем избранное в localStorage
  const saveWishlist = (ids: Set<string>) => {
    localStorage.setItem('wishlist_ids', JSON.stringify(Array.from(ids)));
    setWishlistIds(ids);
  };

  // Переключить избранное
  const toggleWishlist = async (demoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlistLoading(demoId);
    
    try {
      const newIds = new Set(wishlistIds);
      if (newIds.has(demoId)) {
        newIds.delete(demoId);
        console.log('💔 Удалено из избранного:', demoId);
      } else {
        newIds.add(demoId);
        console.log('❤️ Добавлено в избранное:', demoId);
      }
      saveWishlist(newIds);
    } finally {
      setWishlistLoading(null);
    }
  };

  // Функция для выполнения поиска
  const performSearch = useCallback(async (searchFilters: SearchFilters, page: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    
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

      // Try to fetch from Next.js API first (more reliable)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch(`/api/search?${params.toString()}`, {
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
        
        if (append) {
          // Добавляем новые демо к существующим, убирая дубликаты
          setAllDemos(prev => {
            const existingIds = new Set(prev.map(demo => demo.id));
            const newDemos = data.data.filter(demo => !existingIds.has(demo.id));
            return [...prev, ...newDemos];
          });
          setSearchData(prev => prev ? {
            ...prev,
            data: [...prev.data, ...data.data],
            page: data.page
          } : data);
        } else {
          // Заменяем все демо
          setAllDemos(data.data);
          setSearchData(data);
        }
        
        setCurrentPage(page);
        setHasMore(data.page < data.totalPages);
        setIsUsingFallback(false);
        return; // Success, exit early
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.warn('Next.js API failed, trying NestJS API:', fetchError);
        
        // Try NestJS API as fallback
        try {
          const nestResponse = await fetch(`http://localhost:3001/search?${params.toString()}`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (nestResponse.ok) {
            const nestData: SearchResponse = await nestResponse.json();
            
            if (append) {
              setAllDemos(prev => {
                const existingIds = new Set(prev.map(demo => demo.id));
                const newDemos = nestData.data.filter(demo => !existingIds.has(demo.id));
                return [...prev, ...newDemos];
              });
              setSearchData(prev => prev ? {
                ...prev,
                data: [...prev.data, ...nestData.data],
                page: nestData.page
              } : nestData);
            } else {
              setAllDemos(nestData.data);
              setSearchData(nestData);
            }
            
            setCurrentPage(page);
            setHasMore(nestData.page < nestData.totalPages);
            setIsUsingFallback(false);
            return;
          }
        } catch (nestError) {
          console.warn('NestJS API also failed:', nestError);
        }
        
        throw fetchError; // Re-throw to trigger fallback
      }
    } catch (error) {
      console.error('Search error:', error);
      // No fallback - show empty state
      if (!append) {
        setSearchData({
          data: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
          query: searchFilters.q || '',
          suggestions: [],
          filters: {
            vendors: [],
            categories: [],
            subcategories: []
          }
        });
        setAllDemos([]);
        setCurrentPage(1);
        setHasMore(false);
        setIsUsingFallback(false);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Выполняем поиск при изменении фильтров
  useEffect(() => {
    if (isMounted) {
      performSearch(filters, 1, false);
    }
  }, [filters, isMounted, performSearch]);

  // Функция для загрузки следующих страниц
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && searchData) {
      performSearch(filters, currentPage + 1, true);
    }
  }, [isLoadingMore, hasMore, searchData, filters, currentPage, performSearch]);

  // Обработчик прокрутки для бесконечной загрузки
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight * 0.8) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

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
    performSearch(filters, page, false);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      vendors: [],
      categories: ['App'], // Всегда только приложения
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
            <h1 className="text-3xl font-bold text-ink mb-2">App Catalog</h1>
            <p className="text-ink/70">Find the perfect mobile app design for your project</p>
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
                placeholder="Search app demos..."
                value={filters.q}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-subtle rounded-full text-ink placeholder-ink/50 focus-ring"
              />
            </div>
            
            {/* Кнопка фильтров */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 focus-ring ${
                showFilters || filters.vendors.length > 0 || filters.subcategories.length > 0
                  ? 'glass-strong text-ink'
                  : 'glass text-ink/70 hover:text-ink hover:glass-strong'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.vendors.length + filters.subcategories.length) > 0 && (
                <span className="glass-strong text-ink text-xs px-2 py-1 rounded-full">
                  {filters.vendors.length + filters.subcategories.length}
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
                  <option value="relevance" className="text-ink">Default sorting</option>
                  <option value="viewCount" className="text-ink">Sort by popularity</option>
                  <option value="createdAt" className="text-ink">Sort by latest</option>
                  <option value="price_asc" className="text-ink">Sort by price: low to high</option>
                  <option value="price_desc" className="text-ink">Sort by price: high to low</option>
                  <option value="title" className="text-ink">Sort by name</option>
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

          {/* Статистика, сортировка и переключатель вида */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-ink/70 text-sm">Searching...</span>
              ) : (
                <span className="text-ink/70 text-sm">
                  Found: {searchData?.total || 0} app demos
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Быстрая сортировка */}
              <div className="flex items-center gap-2">
                <label className="text-white text-sm whitespace-nowrap font-medium">Sort:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance" className="text-gray-900">Default</option>
                  <option value="viewCount" className="text-gray-900">Popularity</option>
                  <option value="createdAt" className="text-gray-900">Latest</option>
                  <option value="price_asc" className="text-gray-900">Price: Low to High</option>
                  <option value="price_desc" className="text-gray-900">Price: High to Low</option>
                  <option value="title" className="text-gray-900">Name</option>
                </select>
              </div>
              
              {/* Переключатель вида */}
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
        </div>

        {/* Результаты поиска */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-ink/70">Loading demos...</div>
          </div>
        ) : searchData && allDemos.length > 0 ? (
          <>
            {/* Сетка демо */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allDemos.map((demo, index) => (
                <ProductCard key={`${demo.id}-${index}`} demo={demo} index={index} />
              ))}
            </div>

            {/* Кнопка загрузки еще */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-3 glass-strong text-ink rounded-full hover:glass transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    'Load More Demos'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-ink/70 mb-4">No app demos found</div>
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
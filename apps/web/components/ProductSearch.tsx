'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { useMounted } from '../lib/use-mounted';

interface Product {
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

interface SearchResponse {
  data: Product[];
  total: number;
  query: string;
  suggestions: string[];
}

export default function ProductSearch() {
  const isMounted = useMounted();
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [totalResults, setTotalResults] = useState(0);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Задержка в 1 секунду перед показом полнофункционального поиска
  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      setTotalResults(0);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('q', searchQuery.trim());
      params.append('limit', '8'); // Limit results for homepage
      params.append('sortBy', 'relevance');

      const response = await fetch(`/api/search?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: SearchResponse = await response.json();
        setResults(data.data);
        setSuggestions(data.suggestions || []);
        setTotalResults(data.total);
        setShowResults(true);
        setSelectedIndex(-1);
      } else {
        // Fallback to NestJS API
        const nestResponse = await fetch(`http://localhost:3001/search?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (nestResponse.ok) {
          const nestData: SearchResponse = await nestResponse.json();
          setResults(nestData.data);
          setSuggestions(nestData.suggestions || []);
          setTotalResults(nestData.total);
          setShowResults(true);
          setSelectedIndex(-1);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSuggestions([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    const totalItems = results.length + suggestions.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          // Navigate to product
          const product = results[selectedIndex];
          window.open(product.url, '_blank');
        } else if (selectedIndex >= results.length && selectedIndex < totalItems) {
          // Use suggestion
          const suggestion = suggestions[selectedIndex - results.length];
          setQuery(suggestion);
          performSearch(suggestion);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setTotalResults(0);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  if (!isMounted || !isReady) {
    return (
      <div className="w-4/5 mx-auto relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50 z-10 pointer-events-none" />
          <div className="w-full h-14 pl-12 pr-12 glass-subtle rounded-full animate-pulse"></div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm text-ink/50">
            Discover AI-powered solutions and innovative technologies
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      ref={searchRef} 
      className="w-4/5 mx-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50 z-10 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, services, or technologies..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && (results.length > 0 || suggestions.length > 0)) {
              setShowResults(true);
            }
          }}
          className="w-full h-14 pl-12 pr-12 glass-subtle rounded-full text-ink placeholder-ink/50 focus-ring text-lg font-medium backdrop-blur-xl transition-all duration-300 focus:shadow-lg focus:shadow-a1/20 focus:border-a1/30"
        />
        
        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Loader2 className="w-5 h-5 text-ink/50 animate-spin" />
          </div>
        ) : query ? (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-ink/50 hover:text-ink transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Search Hint */}
      <div className="mt-3 text-center">
        <p className="text-sm text-ink/50">
          Discover AI-powered solutions and innovative technologies
        </p>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (results.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-ink/10 backdrop-blur-xl">
              {/* Results */}
              {results.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-ink/60 border-b border-ink/10">
                    Products ({totalResults > 8 ? `8 of ${totalResults}` : totalResults})
                  </div>
                  {results.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedIndex === index
                          ? 'glass-strong'
                          : 'hover:glass-subtle'
                      }`}
                      onClick={() => window.open(product.url, '_blank')}
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 bg-a1/10 rounded-lg flex-shrink-0 overflow-hidden">
                        {product.screenshotUrl ? (
                          <img
                            src={product.screenshotUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-a1/20 to-a1/5 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-a1/60" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink text-sm truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-ink/60 truncate">
                          {product.vendor.name} • {product.category}
                        </p>
                        {product.regularPrice > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {product.salePrice && product.salePrice > 0 ? (
                              <>
                                <span className="text-xs text-ink/50 line-through">
                                  {product.regularPrice.toLocaleString()} ֏
                                </span>
                                <span className="text-xs font-semibold text-a1">
                                  {product.salePrice.toLocaleString()} ֏
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-semibold text-ink">
                                {product.regularPrice.toLocaleString()} ֏
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* External Link Icon */}
                      <ExternalLink className="w-4 h-4 text-ink/40 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2 border-t border-ink/10">
                  <div className="px-3 py-2 text-xs font-medium text-ink/60">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (results.length + index) * 0.05 }}
                      className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedIndex === results.length + index
                          ? 'glass-strong'
                          : 'hover:glass-subtle'
                      }`}
                      onClick={() => {
                        setQuery(suggestion);
                        performSearch(suggestion);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3 h-3 text-ink/40" />
                        <span className="text-sm text-ink/80">{suggestion}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* View All Results */}
              {totalResults > 8 && (
                <div className="p-2 border-t border-ink/10">
                  <button
                    onClick={() => window.location.href = `/catalog?q=${encodeURIComponent(query)}`}
                    className="w-full px-3 py-2 text-sm font-medium text-a1 hover:text-a1/80 transition-colors"
                  >
                    View all {totalResults} results →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { type Locale } from '../../lib/i18n';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function Catalog() {
  const [locale, setLocale] = useState<Locale>('en');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Моковые данные для демо
  const demos = [
    {
      id: 1,
      title: 'E-commerce Platform',
      vendor: 'Shopify',
      category: 'E-commerce',
      status: 'active',
      url: 'https://example.com',
      image: '/api/placeholder/300/200',
    },
    {
      id: 2,
      title: 'Portfolio Website',
      vendor: 'Webflow',
      category: 'Portfolio',
      status: 'active',
      url: 'https://example.com',
      image: '/api/placeholder/300/200',
    },
    {
      id: 3,
      title: 'Blog Platform',
      vendor: 'WordPress',
      category: 'Blog',
      status: 'draft',
      url: 'https://example.com',
      image: '/api/placeholder/300/200',
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Demo Catalog</h1>
          <p className="text-white/70">Find the perfect design for your project</p>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by name or vendor..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            
            {/* Фильтры */}
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                <option value="">All Categories</option>
                <option value="ecommerce">E-commerce</option>
                <option value="portfolio">Portfolio</option>
                <option value="blog">Blog</option>
              </select>
              
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                <option value="">All Vendors</option>
                <option value="shopify">Shopify</option>
                <option value="webflow">Webflow</option>
                <option value="wordpress">WordPress</option>
              </select>
            </div>
          </div>

          {/* Переключатель вида */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">Found: {demos.length} demos</span>
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

        {/* Сетка демо */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {demos.map((demo) => (
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
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Preview</span>
                </div>
              </div>
              
              {/* Контент */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{demo.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    demo.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {demo.status}
                  </span>
                </div>
                
                <div className="text-white/60 text-sm mb-3">
                  <div>Vendor: {demo.vendor}</div>
                  <div>Category: {demo.category}</div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    View
                  </button>
                  <button className="px-3 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition-colors">
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 bg-primary text-black rounded-lg font-medium">
              1
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              2
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              3
            </button>
            <button className="px-3 py-2 text-white/50 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMounted } from '../lib/use-mounted';
import { ArrowRight } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

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

const categories = [
  { id: 'Online Shop', label: 'ONLINE SHOP' },
  { id: 'Business Card', label: 'BUSINESS CARD' },
  { id: 'Company', label: 'COMPANY' },
  { id: 'Landing', label: 'LANDING' },
  { id: 'Platform', label: 'PLATFORM' },
  { id: 'Blog', label: 'BLOG' },
  { id: 'Personal', label: 'PERSONAL' },
];

export default function ChooseWebsite() {
  const isMounted = useMounted();
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Online Shop');

  // Загрузка товаров по категории
  useEffect(() => {
    const fetchDemos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('categories', 'Website');
        params.append('subcategories', activeCategory);
        params.append('sortBy', 'relevance');
        params.append('sortOrder', 'DESC');
        params.append('page', '1');
        params.append('limit', '12'); // 4x3 = 12 карточек

        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (response.ok) {
          const result = await response.json();
          setDemos(result.data || []);
        }
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchDemos();
    }
  }, [isMounted, activeCategory]);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-ink">
            Choose a Website for Your Business
          </h2>
          <p className="text-lg text-ink/70 mb-6">
            Explore our latest websites.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/catalog/website')}
            className="bg-a1 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:bg-a1/90 transition-all duration-200"
          >
            View All Websites
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Табы категорий */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-a1 text-white'
                  : 'glass text-ink hover:glass-strong'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Карточки товаров 4x3 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              // Скелетоны загрузки
              Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : demos.length === 0 ? (
              <div className="col-span-4 flex justify-center items-center py-12">
                <div className="text-ink/70">No websites available in this category</div>
              </div>
            ) : (
              demos.slice(0, 12).map((demo, index) => (
                <ProductCard key={demo.id} demo={demo} index={index} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}


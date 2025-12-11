'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMounted } from '../lib/use-mounted';
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

export default function FeaturedWebsites() {
  const isMounted = useMounted();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('sortBy', 'createdAt');
        params.append('sortOrder', 'DESC');
        params.append('page', '1');
        params.append('limit', '6');

        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (response.ok) {
          const result = await response.json();
          let demosData = result.data || [];
          demosData = demosData.filter((demo: any) => demo && demo.id && demo.title);
          setDemos(demosData);
        } else {
          setDemos([]);
        }
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        setDemos([]);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchDemos();
    }
  }, [isMounted]);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12 items-center">
          {/* Левая часть - Заголовок и описание */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-ink">
                Featured Websites
              </h2>
              <p className="text-xl text-ink/70 leading-relaxed">
                Explore our latest websites, carefully selected each week by our team for their exceptional design and functionality.
              </p>
            </div>
          </motion.div>

          {/* Правая часть - Карточки товаров 3x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : !demos || demos.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center py-12">
                <div className="text-ink/70">No websites available</div>
              </div>
            ) : (
              demos.slice(0, 6).map((demo, index) => (
                <ProductCard key={demo.id} demo={demo} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

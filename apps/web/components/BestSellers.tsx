'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function BestSellers() {
  const isMounted = useMounted();
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('sortBy', 'viewCount');
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
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-ink">
            Best Sellers
          </h2>
          <p className="text-lg text-ink/70 mb-6 max-w-3xl mx-auto">
            Explore our top-rated website and app packages, designed for quality, speed, and reliability, with premium features and dedicated support.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/catalog')}
            className="bg-a1 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:bg-a1/90 transition-all duration-200"
          >
            View Best Selling Websites
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Карточки товаров 2x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : demos.length === 0 ? (
            <div className="col-span-3 flex justify-center items-center py-12">
              <div className="text-ink/70">No best sellers available</div>
            </div>
          ) : (
            demos.slice(0, 6).map((demo, index) => (
              <ProductCard key={demo.id} demo={demo} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

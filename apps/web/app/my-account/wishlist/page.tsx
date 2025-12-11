'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  screenshotUrl: string;
  regularPrice: number;
  salePrice?: number;
  vendor?: {
    name: string;
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Загружаем wishlist из localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      
      // Получаем ID из localStorage
      const savedWishlist = localStorage.getItem('wishlist_ids');
      if (!savedWishlist) {
        setLoading(false);
        return;
      }

      try {
        const ids: string[] = JSON.parse(savedWishlist);
        setWishlistIds(new Set(ids));

        if (ids.length === 0) {
          setLoading(false);
          return;
        }

        // Загружаем данные о товарах через search API
        const response = await fetch(`/api/search?limit=100`);
        const data = await response.json();

        if (data.data) {
          // Фильтруем только товары из wishlist
          const wishlistDemos = data.data.filter((demo: Demo) => ids.includes(demo.id));
          setDemos(wishlistDemos);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки избранного:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Удалить из избранного
  const removeFromWishlist = (demoId: string) => {
    const newIds = new Set(wishlistIds);
    newIds.delete(demoId);
    setWishlistIds(newIds);
    localStorage.setItem('wishlist_ids', JSON.stringify(Array.from(newIds)));
    setDemos(demos.filter(d => d.id !== demoId));
    console.log('💔 Удалено из избранного:', demoId);
  };

  // Clear all wishlist
  const clearWishlist = () => {
    if (!confirm('Clear entire wishlist?')) return;
    setWishlistIds(new Set());
    localStorage.setItem('wishlist_ids', JSON.stringify([]));
    setDemos([]);
    console.log('🗑️ Избранное очищено');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/my-account')}
              className="p-2 glass rounded-xl hover:glass-strong transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
                Wishlist
              </h1>
              <p className="text-ink/60 text-sm">
                {demos.length} {demos.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          
          {demos.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 glass text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Загрузка */}
        {loading && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading wishlist...</p>
          </div>
        )}

        {/* Пустое избранное */}
        {!loading && demos.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center">
            <Heart className="w-16 h-16 text-ink/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">Wishlist is Empty</h2>
            <p className="text-ink/60 mb-6">
              Add items to your wishlist by clicking the heart icon
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Catalog
            </button>
          </div>
        )}

        {/* Список товаров */}
        {!loading && demos.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {demos.map((demo) => {
              const fullPrice = demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice;
              const monthlyPrice = Math.round(fullPrice / 10);

              return (
                <div key={demo.id} className="glass rounded-2xl p-4 hover:glass-strong transition-all">
                  <div className="flex gap-4">
                    {/* Изображение */}
                    <div className="w-28 h-28 bg-a1/10 rounded-xl overflow-hidden flex-shrink-0 relative">
                      {demo.screenshotUrl ? (
                        <img
                          src={demo.screenshotUrl}
                          alt={demo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-a1/50 text-xs">
                          No image
                        </div>
                      )}
                      {/* Кнопка удаления */}
                      <button
                        onClick={() => removeFromWishlist(demo.id)}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink truncate mb-1">{demo.title}</h3>
                      <p className="text-ink/50 text-sm mb-2">{demo.category}</p>
                      
                      {/* Цена */}
                      {fullPrice > 0 && (
                        <div className="mb-3">
                          <span className="text-lg font-bold text-a1">{monthlyPrice.toLocaleString()} ֏</span>
                          <span className="text-sm text-ink/60">/мес × 10</span>
                        </div>
                      )}

                      {/* Кнопки */}
                      <div className="flex gap-2">
                        <a
                          href={`/subscribe/${demo.id}`}
                          className="flex-1 px-3 py-2 bg-a1 text-white rounded-lg text-sm font-medium hover:bg-a1/90 transition-all text-center"
                        >
                          Subscribe
                        </a>
                        <a
                          href={demo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 glass text-ink rounded-lg text-sm font-medium hover:glass-strong transition-all"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}


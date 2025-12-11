'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Copy, Check, ShoppingCart } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description?: string;
  url: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  screenshotUrl?: string;
  viewCount?: number;
  isAccessible?: boolean;
  regularPrice: number;
  salePrice?: number;
  vendor?: {
    id: string;
    name: string;
    website?: string;
    logoUrl?: string;
  };
  createdAt?: string;
}

interface ProductCardProps {
  demo: Demo;
  index?: number;
  onAddToCart?: (demo: Demo) => void;
}

export default function ProductCard({ demo, index = 0, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Загрузка корзины из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          setCartItems(new Set(ids));
        } catch (e) {
          console.error('Ошибка загрузки корзины:', e);
        }
      }
    }
  }, []);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(demo.id);
    setCopiedId(demo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      const newCartItems = new Set(cartItems);
      
      // Если товар уже в корзине - удаляем, иначе добавляем
      if (newCartItems.has(demo.id)) {
        newCartItems.delete(demo.id);
      } else {
        newCartItems.add(demo.id);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(Array.from(newCartItems)));
        // Отправляем событие для обновления корзины в других компонентах
        window.dispatchEvent(new Event('cartUpdated'));
      }
      setCartItems(newCartItems);
      
      if (onAddToCart && !newCartItems.has(demo.id)) {
        onAddToCart(demo);
      }
    } finally {
      setTimeout(() => setIsAddingToCart(false), 300);
    }
  };

  const isInCart = cartItems.has(demo.id);
  const discountPercent = demo.salePrice && demo.regularPrice > 0
    ? Math.round((1 - demo.salePrice / demo.regularPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass rounded-2xl overflow-hidden hover:glass-strong transition-all duration-200 group"
    >
      {/* Изображение */}
      <div 
        className="relative h-48 bg-a1/10 cursor-pointer overflow-hidden"
        onClick={() => router.push(`/catalog/${demo.id}`)}
      >
        {/* Бейдж скидки */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-a1 text-white px-3 py-1 rounded-md text-sm font-bold z-10">
            -{discountPercent}%
          </div>
        )}
        
        {demo.screenshotUrl ? (
          <img
            src={demo.screenshotUrl}
            alt={demo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex bg-a1/10 flex-col items-center justify-center">
            <div className="w-12 h-12 bg-a1/20 rounded-full flex items-center justify-center mb-2">
              <Eye className="w-6 h-6 text-a1/60" />
            </div>
            <span className="text-a1/70 text-sm font-medium">No Preview</span>
          </div>
        )}
      </div>
      
      {/* Контент */}
      <div className="p-4">
        <h3 
          className="text-ink font-semibold text-base mb-3 line-clamp-1 cursor-pointer hover:text-a1 transition-colors"
          onClick={() => router.push(`/catalog/${demo.id}`)}
        >
          {demo.title}
        </h3>
        
        {/* Цена подписки */}
        {demo.regularPrice > 0 && (
          <div className="mb-4">
            {(() => {
              const totalPrice = demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice;
              const monthlyPrice = Math.round(totalPrice / 10);
              return (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-a1">
                    {monthlyPrice.toLocaleString()} ֏
                  </span>
                  <span className="text-sm text-ink/60">
                    / month
                  </span>
                </div>
              );
            })()}
          </div>
        )}
        
        {/* Кнопки */}
        <div className="flex gap-2">
          {/* View */}
          <a
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 p-2.5 bg-a1 text-white rounded-lg hover:bg-a1/90 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            title="View"
          >
            <Eye className="w-5 h-5" />
            View
          </a>
          
          {/* Copy ID */}
          <button
            onClick={copyToClipboard}
            className="p-2.5 glass text-ink rounded-lg hover:glass-strong transition-all duration-200 flex items-center justify-center"
            title="Copy ID"
          >
            {copiedId === demo.id ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          
          {/* Toggle Cart */}
          <button
            onClick={toggleCart}
            disabled={isAddingToCart}
            className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
              isInCart
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'glass text-ink hover:glass-strong'
            } ${isAddingToCart ? 'opacity-50 cursor-wait' : ''}`}
            title={isInCart ? 'Remove from cart' : 'Add to cart'}
          >
            <ShoppingCart className={`w-5 h-5 ${isInCart ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Скелетон для загрузки
export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-a1/10"></div>
      <div className="p-4">
        <div className="h-5 bg-a1/10 rounded mb-3 w-3/4"></div>
        <div className="h-6 bg-a1/10 rounded mb-4 w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-a1/10 rounded flex-1"></div>
          <div className="h-10 bg-a1/10 rounded w-10"></div>
          <div className="h-10 bg-a1/10 rounded w-10"></div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { 
  ArrowLeft, 
  Eye, 
  Copy,
  Check,
  ShoppingCart,
  Facebook,
  Twitter,
  Linkedin,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { useMounted } from '../../../lib/use-mounted';

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


export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useMounted();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [similarDemos, setSimilarDemos] = useState<Demo[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Декодируем ID из URL
  const rawId = params?.id ? String(params.id) : null;
  const productId = rawId ? decodeURIComponent(rawId).trim() : null;
  
  console.log('🔍 [ProductPage] Загрузка продукта, ID:', productId);


  // Загружаем данные товара
  useEffect(() => {
    const fetchDemo = async () => {
      setLoading(true);
      setError(null);
      
      if (!productId) {
        console.error('❌ Product ID is missing');
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const encodedId = encodeURIComponent(productId);
        const apiUrl = `/api/demos/${encodedId}`;
        console.log('[ProductPage] 🔄 Fetching demo:', apiUrl);
        console.log('[ProductPage] productId:', productId);
        
        const response = await fetch(apiUrl);
        console.log('[ProductPage] Response status:', response.status);
        console.log('[ProductPage] Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[ProductPage] ✅ Demo loaded');
          console.log('[ProductPage] data:', {
            id: data.id,
            sku: data.sku,
            title: data.title,
            hasTitle: !!data.title,
            hasId: !!data.id
          });
          
          // Проверяем, что данные валидны
          if (!data || (!data.id && !data.sku)) {
            console.error('[ProductPage] ❌ Invalid data structure:', data);
            setError('Invalid product data format');
            return;
          }
          
          setDemo(data);
          
          // Загружаем похожие товары
          fetchSimilarDemos(data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('[ProductPage] ❌ Error response:', {
            status: response.status,
            errorData
          });
          setError(errorData.message || 'Product not found');
        }
      } catch (err: any) {
        console.error('❌ Error fetching demo:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchDemo();
    }
  }, [productId]);

  // SEO мета-теги
  useEffect(() => {
    if (!demo) return;

    // Обновляем title
    document.title = `${demo.title} | Neetrino Platform`;

    // Создаем или обновляем мета-теги
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Основные мета-теги
    updateMetaTag('description', demo.description || `${demo.title} - доступен для подписки на Neetrino Platform`);
    updateMetaTag('keywords', `${demo.title}, ${demo.category}, ${demo.subcategory}, демо, шаблон, сайт`);
    
    // Open Graph
    updateMetaTag('og:title', demo.title, true);
    updateMetaTag('og:description', demo.description || `${demo.title} - доступен для подписки`, true);
    updateMetaTag('og:type', 'product', true);
    updateMetaTag('og:url', window.location.href, true);
    if (demo.screenshotUrl) {
      updateMetaTag('og:image', demo.screenshotUrl, true);
    }
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', demo.title);
    updateMetaTag('twitter:description', demo.description || `${demo.title} - доступен для подписки`);
    if (demo.screenshotUrl) {
      updateMetaTag('twitter:image', demo.screenshotUrl);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // JSON-LD структурированные данные
    let jsonLd = document.querySelector('script[type="application/ld+json"]#product-schema');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.setAttribute('id', 'product-schema');
      document.head.appendChild(jsonLd);
    }
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: demo.title,
      description: demo.description || '',
      image: demo.screenshotUrl || demo.imageUrl || '',
      sku: demo.id,
      category: demo.category,
      offers: {
        '@type': 'Offer',
        price: demo.regularPrice,
        priceCurrency: 'AMD',
        availability: demo.isAccessible ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: window.location.href
      },
      brand: demo.vendor ? {
        '@type': 'Brand',
        name: demo.vendor.name
      } : undefined
    };
    
    jsonLd.textContent = JSON.stringify(schema);

    // Cleanup при размонтировании
    return () => {
      document.title = 'Neetrino Platform';
    };
  }, [demo]);

  // Загружаем похожие товары
  const fetchSimilarDemos = async (currentDemo: Demo) => {
    setLoadingSimilar(true);
    try {
      const searchParams = new URLSearchParams();
      if (currentDemo.category) {
        searchParams.append('categories', currentDemo.category);
      }
      if (currentDemo.vendor?.id) {
        searchParams.append('vendors', currentDemo.vendor.id);
      }
      searchParams.append('limit', '4');
      searchParams.append('sortBy', 'relevance');
      
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Исключаем текущий товар
        const similar = data.data?.filter((d: Demo) => d.id !== currentDemo.id).slice(0, 4) || [];
        setSimilarDemos(similar);
      }
    } catch (err) {
      console.error('Ошибка загрузки похожих товаров:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };


  // Поделиться в соцсетях
  const shareToSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(demo?.title || '');
    const text = encodeURIComponent(demo?.description || '');

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };


  if (!isMounted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex justify-center items-center py-20">
            <div className="text-ink/70">Загрузка продукта...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !demo) {
    console.log('[ProductPage] ❌ Rendering error state');
    console.log('[ProductPage] error:', error);
    console.log('[ProductPage] demo:', demo);
    console.log('[ProductPage] loading:', loading);
    
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-ink mb-4">
              {error || 'Товар не найден'}
            </h1>
            {productId && (
              <p className="text-ink/60 mb-4">
                ID товара: <code className="bg-ink/10 px-2 py-1 rounded">{productId}</code>
              </p>
            )}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 glass rounded-lg text-left text-sm">
                <p><strong>Debug info:</strong></p>
                <p>Error: {error || 'null'}</p>
                <p>Demo: {demo ? 'exists' : 'null'}</p>
                <p>Loading: {loading ? 'true' : 'false'}</p>
                <p>ProductId: {productId || 'null'}</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/catalog')}
                className="px-6 py-3 glass rounded-full text-ink hover:glass-strong transition-all"
              >
                Вернуться в каталог
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const monthlyPrice = Math.round((demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice) / 10);
  const totalPrice = demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice;
  const discount = demo.salePrice && demo.salePrice > 0 
    ? Math.round((1 - demo.salePrice / demo.regularPrice) * 100) 
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-ink/60">
          <Link href="/" className="hover:text-ink transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-ink transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-ink">{demo.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-ink/70 hover:text-ink transition-colors focus-ring"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ink">{demo.title}</h1>
        </div>

        <div className="flex gap-8 lg:gap-12 mb-12 items-start">
          {/* Left Column - Image */}
          <div className="overflow-hidden flex-shrink-0">
            {/* Image */}
            <div className="relative glass rounded-2xl overflow-hidden scale-[1.0] origin-top-left group cursor-pointer">
              <a
                href={`/demo-viewer?url=${encodeURIComponent(demo.url)}&sku=${encodeURIComponent(demo.id)}&product_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + pathname : pathname)}&fullscreen=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {demo.screenshotUrl ? (
                  <img
                    src={demo.screenshotUrl}
                    alt={demo.title}
                    className="w-full h-auto object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75"
                  />
                ) : demo.imageUrl ? (
                  <img
                    src={demo.imageUrl}
                    alt={demo.title}
                    className="w-full h-auto object-cover rounded-2xl transition-all duration-300 group-hover:brightness-75"
                  />
                ) : (
                  <div className="w-full aspect-video bg-a1/10 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 bg-a1/20 rounded-full flex items-center justify-center mb-4">
                      <Eye className="w-12 h-12 text-a1/60" />
                    </div>
                    <span className="text-a1/70 text-lg font-medium">No Preview</span>
                    <span className="text-a1/50 text-sm mt-2">Available</span>
                  </div>
                )}
                
                {/* Hover overlay with eye icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl">
                  <div className="bg-white/90 p-4 rounded-full">
                    <Eye className="w-8 h-8 text-a1" />
                  </div>
                </div>
              </a>
              
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-a1 text-white px-3 py-1.5 rounded-full text-sm font-bold z-10">
                  -{discount}%
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price, Buttons, Share, Description */}
          <div className="space-y-6 relative z-10 w-[500px] ml-auto">
            {/* Price */}
            {demo.regularPrice > 0 && (
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-a1">
                    {monthlyPrice.toLocaleString()} ֏
                  </span>
                  <span className="text-lg text-ink/60">
                    / month
                  </span>
                </div>
              </div>
            )}

            {/* Features block */}
            <div className="glass p-6 rounded-2xl">
              <div className="space-y-3">
                <div className="text-ink font-medium">UI/UX Industry-Standard</div>
                <div className="text-ink font-medium">SEO Friendly</div>
                <div className="text-ink font-medium">100% Money-Back Guarantee</div>
              </div>
            </div>

            {/* Buttons: Watch, Add to Cart, Copy ID */}
            <div className="flex flex-row gap-3">
              <a
                href={`/demo-viewer?url=${encodeURIComponent(demo.url)}&sku=${encodeURIComponent(demo.id)}&product_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + pathname : pathname)}&fullscreen=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-a1 text-white rounded-lg font-semibold hover:bg-a1/90 transition-all duration-200 focus-ring"
              >
                <Eye className="w-5 h-5" />
                Watch
              </a>
              
              <button
                onClick={() => {
                  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                  if (!cartItems.includes(demo.id)) {
                    cartItems.push(demo.id);
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-a1 text-white rounded-lg font-semibold hover:bg-a1/90 transition-all duration-200 focus-ring whitespace-nowrap"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(demo.id);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 glass text-ink rounded-lg font-semibold hover:glass-strong transition-all duration-200 focus-ring whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy ID
                  </>
                )}
              </button>
            </div>

            {/* Share */}
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">Share:</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 transition-all"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1DA1F2]/90 transition-all"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#0077B5]/90 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">Description</h3>
              <p className="text-ink/70 leading-relaxed">{demo.description || 'Описание отсутствует.'}</p>
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        {similarDemos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-ink mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarDemos.map((similarDemo) => (
                <Link
                  key={similarDemo.id}
                  href={`/catalog/${encodeURIComponent(similarDemo.id)}`}
                  className="glass rounded-2xl overflow-hidden hover:glass-strong transition-all duration-200 focus-ring block"
                >
                  <div className="relative h-48 bg-a1/10">
                    {similarDemo.screenshotUrl ? (
                      <img
                        src={similarDemo.screenshotUrl}
                        alt={similarDemo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-a1/10">
                        <Eye className="w-12 h-12 text-a1/60" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-ink font-semibold mb-2 line-clamp-2">{similarDemo.title}</h3>
                    {similarDemo.regularPrice > 0 && (
                      <div className="text-a1 font-bold">
                        {Math.round((similarDemo.salePrice && similarDemo.salePrice > 0 ? similarDemo.salePrice : similarDemo.regularPrice) / 10).toLocaleString()} ֏/мес
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}


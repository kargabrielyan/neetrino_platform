'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Monitor, Tablet, Smartphone, Copy, Check, X, Home } from 'lucide-react';
import Link from 'next/link';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportConfigs: Record<ViewportSize, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

export default function DemoViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const demoUrl = searchParams.get('url') || '';
  const sku = searchParams.get('sku') || '';
  const productUrl = searchParams.get('product_url') || '';
  const fullscreen = searchParams.get('fullscreen') === '1';
  const viewportParam = searchParams.get('viewport') as ViewportSize | null;

  useEffect(() => {
    if (viewportParam && ['desktop', 'tablet', 'mobile'].includes(viewportParam)) {
      setViewportSize(viewportParam);
    }
    if (demoUrl) {
      setLoading(false);
    }
  }, [demoUrl, viewportParam]);

  const handleViewportChange = (size: ViewportSize) => {
    setViewportSize(size);
    // Обновляем URL с новым viewport параметром
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('viewport', size);
      window.history.pushState({}, '', url.toString());
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!demoUrl) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-ink/5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Demo URL не указан</h1>
          <Link href="/" className="text-a1 hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const config = viewportConfigs[viewportSize];

  return (
    <div className="fixed inset-0 flex flex-col bg-ink/5 overflow-hidden">
      {/* Iframe container - полный размер с возможностью изменения размера */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-auto">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/5">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-a1 mx-auto mb-4"></div>
              <p className="text-ink/70">Загрузка демо...</p>
            </div>
          </div>
        ) : (
          <div
            className="relative bg-white shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: `${config.width}px`,
              height: `${config.height}px`,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              src={demoUrl}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation"
              title="Demo Preview"
              onLoad={() => setLoading(false)}
              style={{
                width: `${config.width}px`,
                height: `${config.height}px`
              }}
            />
          </div>
        )}
      </div>

      {/* Viewport size switchers - слева снизу */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-50">
        <button
          onClick={() => handleViewportChange('desktop')}
          className="p-3 rounded-lg bg-black text-white"
          title="Desktop (1920x1080px)"
        >
          <Monitor className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleViewportChange('tablet')}
          className="p-3 rounded-lg bg-black text-white"
          title="Tablet (768x1024px)"
        >
          <Tablet className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleViewportChange('mobile')}
          className="p-3 rounded-lg bg-black text-white"
          title="Mobile (375x667px)"
        >
          <Smartphone className="w-6 h-6" />
        </button>
      </div>

      {/* Дополнительные кнопки - справа снизу */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={copyToClipboard}
          className="p-3 bg-black rounded-lg text-white"
          title="Copy URL"
        >
          {copied ? (
            <Check className="w-6 h-6 text-green-400" />
          ) : (
            <Copy className="w-6 h-6" />
          )}
        </button>
        {productUrl && (
          <Link
            href={productUrl}
            className="p-3 bg-black rounded-lg text-white"
            title="Вернуться к товару"
          >
            <Home className="w-6 h-6" />
          </Link>
        )}
        <button
          onClick={() => router.back()}
          className="p-3 bg-black rounded-lg text-white"
          title="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}


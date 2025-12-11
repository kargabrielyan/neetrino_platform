/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3001',
  },
  // Оптимизация производительности
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Отключаем prefetch для ускорения навигации (можно включить обратно если нужно)
  // poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content-Security-Policy настроен более гибко для Next.js
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:3001 https:",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      // HSTS только для HTTPS (в продакшене)
      ...(process.env.NODE_ENV === 'production' ? [{
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      }] : []),
    ];
  },
  async rewrites() {
    // Исключаем /api/auth/* и /api/demos/* из rewrites
    // /api/demos/* обрабатывается Next.js API routes (apps/web/app/api/demos/[id]/route.ts)
    // которые проксируют запросы в NestJS API
    const rewrites = [];
    
    // Перенаправляем только не-auth API запросы на внешний API
    // НЕ включаем /api/demos, так как у нас есть Next.js API route для этого
    
    rewrites.push({
      source: '/api/orders/:path*',
      destination: `${process.env.API_URL || 'http://localhost:3001'}/api/orders/:path*`,
    });
    
    rewrites.push({
      source: '/api/vendors/:path*',
      destination: `${process.env.API_URL || 'http://localhost:3001'}/api/vendors/:path*`,
    });
    
    rewrites.push({
      source: '/api/search/:path*',
      destination: `${process.env.API_URL || 'http://localhost:3001'}/api/search/:path*`,
    });
    
    return rewrites;
  },
};

module.exports = nextConfig;

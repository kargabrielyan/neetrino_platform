/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    PARSING_ENABLED: process.env.PARSING_ENABLED === 'true',
    CHECKING_ENABLED: process.env.CHECKING_ENABLED === 'true',
  },
}

module.exports = nextConfig

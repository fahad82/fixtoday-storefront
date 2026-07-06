// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

     domains: [
      'images.unsplash.com',
      'ik.imagekit.io',
      'localhost',
      'api.fixtoday.co.uk',
      'cdn.jsdelivr.net',
      'upload.wikimedia.org'
    ],
    // Remove deprecated domains array
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Compress responses
  compress: true,
  // Add trailing slash for consistent routing
  trailingSlash: false,
};

module.exports = nextConfig;
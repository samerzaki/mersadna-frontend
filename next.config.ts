import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Turbopack configuration (default in Next.js 16)
  // Empty config allows Turbopack to use its default module resolution
  turbopack: {},

  // Webpack configuration (used when --webpack flag is passed)
  webpack: (config) => {
    // Ensure webpack resolves modules from the project root, not parent directories
    const projectRoot = path.resolve(__dirname);

    // Set resolve modules to prioritize project's node_modules
    config.resolve.modules = [
      path.resolve(projectRoot, "node_modules"),
      ...(config.resolve.modules || []),
    ];

    // Ensure context is set to project root
    config.context = projectRoot;

    return config;
  },

  // SEO Optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ta3weem.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

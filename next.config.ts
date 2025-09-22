import type {NextConfig} from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      // Firebase Studio preview hosts (adjust to your exact cluster IDs)
      'http://0.0.0.0:9002',
      'http://localhost:9002',
      /\.cloudworkstations\.dev$/,
    ],
    optimizePackageImports: [
      'react', 'react-dom',
      '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'
    ],
    viewTransition: true,
  },
  
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.join(process.cwd(), '.next', 'cache', 'webpack-dev-stable'),
      };
    }
    return config;
  },

  typescript: {
    
  },
  eslint: {
    
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) return [];
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: [
            "default-src 'self'",
            "img-src 'self' data: blob: https://picsum.photos https://images.unsplash.com",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://cdn.plaid.com https://*.plaid.com",
            "frame-src https://cdn.plaid.com https://*.plaid.com"
          ].join('; ') },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ];
  },
};

export default nextConfig;

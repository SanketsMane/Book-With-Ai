import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    CLERK_SECRET_KEY: 'sk_test_azIl6yHG8Bs0MdA0f6qKUYhcIkEcbD6Ce12Co6l7oK',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_ZGFyaW5nLXJvb3N0ZXItNDYuY2xlcmsuYWNjb3VudHMuZGV2JA',
  },
  reactStrictMode: false,

  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Silence Turbopack/Webpack conflict warning
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },

  // Suppress hydration warnings in development
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan semua hostname HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Mengizinkan semua hostname HTTP
      },
    ],
  },
};

export default nextConfig;

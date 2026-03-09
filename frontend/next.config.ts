import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Penting untuk production deployment
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header untuk keamanan
};

export default nextConfig;

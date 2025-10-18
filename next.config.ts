import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production, proxy API requests through Next.js to avoid CORS/cookie issues
    // This makes frontend and backend appear on the same domain
    if (process.env.NODE_ENV === 'production' && process.env.BACKEND_INTERNAL_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_INTERNAL_URL}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

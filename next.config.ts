import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com' // For Google profile pictures if you're using Google Auth
    ],
  },
  experimental: {
    turbo: {
      // Explicitly set the project root to the current directory
      root: __dirname,
    },
  },
};

export default nextConfig;

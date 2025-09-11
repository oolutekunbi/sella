import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com' // For Google profile pictures if you're using Google Auth
    ],
  },
};

export default nextConfig;

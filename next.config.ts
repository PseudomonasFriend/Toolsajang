import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

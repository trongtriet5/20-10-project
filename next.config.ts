import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: true, // For data URLs from QR code generation
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

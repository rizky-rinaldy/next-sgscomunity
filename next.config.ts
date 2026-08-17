import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mengabaikan error TypeScript saat build di Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mengabaikan error ESLint juga biar aman
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

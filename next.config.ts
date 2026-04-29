import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress workspace root warning when running in a monorepo
  turbopack: {
    root: __dirname,
  },
  // Hide Next.js development indicators
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;

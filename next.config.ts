import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress workspace root warning when running in a monorepo
  turbopack: {
    root: __dirname,
  },
  // Hide Next.js development indicators
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  // Environment variables
  env: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    MAX_FILE_SIZE_MB: process.env.MAX_FILE_SIZE_MB,
  },
};

export default nextConfig;

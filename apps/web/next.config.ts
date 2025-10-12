import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo configuration for Vercel deployment
  transpilePackages: ["@vantage/shared"],
  
  // Ensure proper output configuration
  output: "standalone",
  
  // Handle monorepo dependencies
  experimental: {
    externalDir: true,
  },
  
  // Webpack configuration for monorepo
  webpack: (config, { isServer }) => {
    // Handle shared package resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@vantage/shared": require("path").resolve(__dirname, "../../packages/shared/src/generated"),
    };
    
    return config;
  },
  
  // Environment variables for build
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

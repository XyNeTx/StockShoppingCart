import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5202";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // proxy /api/* ไปที่ .NET API เพื่อให้ฝั่ง browser เรียกได้โดยไม่ติด CORS
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

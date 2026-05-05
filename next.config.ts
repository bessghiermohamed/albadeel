import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  basePath: "/albadeel",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["21.0.3.249"],
};

export default nextConfig;

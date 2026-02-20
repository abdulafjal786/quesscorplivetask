import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  // output: "export",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://humhai.in/:path*",
      },
    ];
  },
};

export default nextConfig;
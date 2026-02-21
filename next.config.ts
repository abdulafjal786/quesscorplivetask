import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  output: "export",
  // trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.233.178.226/:path*",
      },
    ];
  },
};

export default nextConfig;
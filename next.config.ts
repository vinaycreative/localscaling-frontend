import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard/business-information",
        permanent: false,
      },
    ];
  },
  eslint: {
    // Prevent build failures if local ESLint deps/rules are missing
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

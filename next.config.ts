import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle PDF libraries that should only run on client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Exclude PDF libraries from server-side bundle
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "jspdf",
        "jspdf-autotable",
      ];
    }

    return config;
  },
};

export default nextConfig;

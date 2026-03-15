import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is configured via CLI flag (--turbopack in dev script)
  // React strict mode for catching potential issues early
  reactStrictMode: true,

  // Image optimization - allow external domains if needed
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Experimental features for Next.js 15
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c34.radioboss.fm",
      },
    ],
  },
};

export default nextConfig;

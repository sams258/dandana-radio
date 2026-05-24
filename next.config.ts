import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "c34.radioboss.fm" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "pub-*.r2.dev" },
      {
        protocol: "https",
        hostname: new URL(process.env.R2_PUBLIC_URL || "https://placeholder.r2.dev").hostname,
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 800],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

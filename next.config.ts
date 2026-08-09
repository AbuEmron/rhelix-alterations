import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The existing Ferganza platform (AWINK) serves every route with a trailing
  // slash. Indexed links, ads and social posts all carry it — keep it.
  trailingSlash: true,
  images: {
    // Product/collection photography stays on the existing Ferganza asset
    // hosts; the sync script records absolute URLs. Allow any https host so a
    // platform CDN move never breaks image rendering. Assets are optimized in
    // transit (AVIF/WebP, responsive sizes) — source files are never altered.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

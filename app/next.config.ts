import type { NextConfig } from "next";

// Static export for Cloudflare Pages. Everything is client-side (wallet + chain
// reads), so no server runtime is needed. The turbopack rule keeps Tailwind v4
// utility generation working in the production build.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure workspace packages are transpiled for Next.js app
  // See: https://nextjs.org/docs/messages/transpilePackages
  transpilePackages: ["@repo/ui", "@merke/brand"],
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;

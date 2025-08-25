import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure workspace packages are transpiled for Next.js app
  experimental: {
    // Transpile shared UI and brand packages used by apps
    // Note: keep package names matching workspace package.json names
    // @repo/ui and @merke/brand are used in the app
    // Other packages can be added here later if needed
    // See: https://nextjs.org/docs/messages/transpilePackages
    // @ts-expect-error - property exists in Next.js config types
    transpilePackages: ["@repo/ui", "@merke/brand"],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;

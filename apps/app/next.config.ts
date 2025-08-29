import type { NextConfig } from "next";

// Build a Content Security Policy (Report-Only) aligned with Reown/AppKit guidance
// Ref: https://docs.reown.com/advanced/security/content-security-policy
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
let convexOrigin = "";
try {
  convexOrigin = convexUrl ? new URL(convexUrl).origin : "";
} catch {
  convexOrigin = "";
}

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self'",
  // Include self so local stylesheets load; add Google Fonts domain per AppKit docs
  "style-src 'self' https://fonts.googleapis.com",
  // Allow common wallet/media sources and ipfs; retain data/blob for inline assets
  "img-src * 'self' data: blob: https://walletconnect.org https://walletconnect.com https://secure.walletconnect.com https://secure.walletconnect.org https://tokens-data.1inch.io https://tokens.1inch.io https://ipfs.io https://cdn.zerion.io",
  "font-src 'self' https://fonts.gstatic.com",
  [
    "connect-src",
    "'self'",
    // WalletConnect / AppKit endpoints
    "https://rpc.walletconnect.com",
    "https://rpc.walletconnect.org",
    "https://relay.walletconnect.com",
    "https://relay.walletconnect.org",
    "wss://relay.walletconnect.com",
    "wss://relay.walletconnect.org",
    "https://pulse.walletconnect.com",
    "https://pulse.walletconnect.org",
    "https://api.web3modal.com",
    "https://api.web3modal.org",
    "https://keys.walletconnect.com",
    "https://keys.walletconnect.org",
    "https://notify.walletconnect.com",
    "https://notify.walletconnect.org",
    "https://echo.walletconnect.com",
    "https://echo.walletconnect.org",
    "https://push.walletconnect.com",
    "https://push.walletconnect.org",
    "wss://www.walletlink.org",
    // Convex backend (if configured)
    convexOrigin
  ].filter(Boolean).join(" "),
  "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://secure.walletconnect.com https://secure.walletconnect.org"
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      },
    ],
  },
  // Ensure workspace packages are transpiled for Next.js app
  // See: https://nextjs.org/docs/messages/transpilePackages
  transpilePackages: ["@repo/ui", "@merke/brand"],
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  experimental: {
    reactCompiler: true,
  },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspDirectives
          }
        ]
      }
    ])
  }
};

export default nextConfig;

import type { NextConfig } from "next"
import createBundleAnalyzer from "@next/bundle-analyzer"
import { withAxiom } from "next-axiom"

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com https://va.vercel-scripts.com https://plausible.io https://pagead2.googlesyndication.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.plain.tools",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://translate.googleapis.com https://www.gstatic.com https://*.clerk.accounts.dev https://*.clerk.com",
  "connect-src 'self' https://api.anthropic.com https://translate.googleapis.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://plausible.io https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.clerk.accounts.dev https://*.clerk.com https://api.stripe.com",
  "worker-src 'self' blob:",
  "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ")

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
]

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Canonical tool slugs.
      {
        source: "/tools/local-signer",
        destination: "/tools/plain-local-cryptographic-signer",
        permanent: true,
      },
      {
        source: "/tools/metadata-purge",
        destination: "/tools/plain-metadata-purge",
        permanent: true,
      },
      {
        source: "/tools/password-breaker",
        destination: "/tools/plain-password-breaker",
        permanent: true,
      },
      {
        source: "/tools/webgpu-organiser",
        destination: "/tools/plain-webgpu-page-organiser",
        permanent: true,
      },
      {
        source: "/tools/batch-engine",
        destination: "/tools/plain-hardware-accelerated-batch-engine",
        permanent: true,
      },

      // Consolidate legacy comparison routes.
      {
        source: "/comparisons",
        destination: "/compare",
        permanent: true,
      },
      {
        source: "/comparisons/plain-vs-ilovepdf",
        destination: "/compare/plain-vs-ilovepdf",
        permanent: true,
      },
      {
        source: "/comparisons/plain-vs-online-pdf-tools",
        destination: "/compare/offline-vs-online-pdf-tools",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      // Exclude /api and /api/* since API CORS headers are managed separately.
      {
        source: "/((?!api(?:/|$)).*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default withAxiom(withBundleAnalyzer(nextConfig))

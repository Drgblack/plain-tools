import type { NextConfig } from "next"
import createBundleAnalyzer from "@next/bundle-analyzer"
import { withAxiom } from "next-axiom"

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.googleapis.com https://translate.google.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://translate.googleapis.com https://www.gstatic.com",
  "connect-src 'self' https://api.anthropic.com https://translate.googleapis.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "worker-src 'self' blob:",
  "frame-src 'none'",
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

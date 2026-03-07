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

const legacyBlogSlugRedirects = [
  {
    source: "/blog/adobe-acrobat-alternative-free",
    destination: "/blog/offline-vs-online-tools-privacy",
    permanent: true,
  },
  {
    source: "/blog/ai-training-user-files-adobe-ethical-risk",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/breach-fears-free-converters-air-gap-tools",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/browser-memory-management-large-pdfs",
    destination: "/blog/large-pdf-files-kill-browser-tools-heres-why",
    permanent: true,
  },
  {
    source: "/blog/building-zero-knowledge-pdf-utility-rust",
    destination: "/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    permanent: true,
  },
  {
    source: "/blog/choosing-pdf-tool-decision-framework",
    destination: "/blog/offline-vs-online-tools-privacy",
    permanent: true,
  },
  {
    source: "/blog/client-side-vs-server-side-speed-large-pdfs",
    destination: "/blog/large-pdf-files-kill-browser-tools-heres-why",
    permanent: true,
  },
  {
    source: "/blog/data-as-liability-not-asset",
    destination: "/blog/why-we-open-sourced-our-privacy-claims",
    permanent: true,
  },
  {
    source: "/blog/delete-after-24-hours-myth",
    destination: "/blog/what-happens-when-you-upload-a-pdf",
    permanent: true,
  },
  {
    source: "/blog/education-student-records-ferpa",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/ethical-ai-document-processing",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/financial-services-document-security",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/gdpr-article-32-local-processing-security",
    destination: "/blog/why-we-open-sourced-our-privacy-claims",
    permanent: true,
  },
  {
    source: "/blog/gdpr-by-architecture-not-policy",
    destination: "/blog/why-we-open-sourced-our-privacy-claims",
    permanent: true,
  },
  {
    source: "/blog/healthcare-phi-document-handling",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/hidden-cost-free-converters-data-product",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/ilovepdf-alternative-privacy-focused",
    destination: "/blog/offline-vs-online-tools-privacy",
    permanent: true,
  },
  {
    source: "/blog/journalism-source-protection",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/legal-discovery-public-cloud-risk",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/legal-document-redaction-compliance",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/local-vs-cloud-pdf-tools-comparison",
    destination: "/blog/offline-vs-online-tools-privacy",
    permanent: true,
  },
  {
    source: "/blog/minimalist-pdf-tools-replacing-bloated-suites",
    destination: "/blog/why-we-built-plain",
    permanent: true,
  },
  {
    source: "/blog/optimising-client-side-computations-performance-security",
    destination: "/blog/large-pdf-files-kill-browser-tools-heres-why",
    permanent: true,
  },
  {
    source: "/blog/password-protected-pdf-hipaa-compliant",
    destination: "/blog/the-legal-professionals-guide-to-pdf-privacy",
    permanent: true,
  },
  {
    source: "/blog/pdf-rendering-canvas-webgl",
    destination: "/blog/browser-pdf-processing-explained",
    permanent: true,
  },
  {
    source: "/blog/plain-vs-adobe-cloud-ai-data-harvesting",
    destination: "/blog/the-pdf-tools-that-betrayed-you",
    permanent: true,
  },
  {
    source: "/blog/service-worker-offline-architecture",
    destination: "/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    permanent: true,
  },
  {
    source: "/blog/smallpdf-alternative-comparison",
    destination: "/blog/offline-vs-online-tools-privacy",
    permanent: true,
  },
  {
    source: "/blog/transparent-monetisation-adsense-model",
    destination: "/blog/why-we-built-plain",
    permanent: true,
  },
  {
    source: "/blog/true-local-processing-technical-checklist",
    destination: "/blog/how-to-verify-privacy-claims-yourself",
    permanent: true,
  },
  {
    source: "/blog/verify-privacy-claims-yourself",
    destination: "/blog/how-to-verify-privacy-claims-yourself",
    permanent: true,
  },
  {
    source: "/blog/wasm-sandbox-files-never-leave-browser",
    destination: "/blog/why-we-open-sourced-our-privacy-claims",
    permanent: true,
  },
  {
    source: "/blog/webassembly-pdf-processing-deep-dive",
    destination: "/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    permanent: true,
  },
  {
    source: "/blog/webassembly-vs-javascript-binary-formats-pdf-merging",
    destination: "/blog/large-pdf-files-kill-browser-tools-heres-why",
    permanent: true,
  },
  {
    source: "/blog/webgl-vs-webgpu-high-density-rendering",
    destination: "/blog/browser-pdf-processing-explained",
    permanent: true,
  },
  {
    source: "/blog/webgpu-ai-inference-browser",
    destination: "/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    permanent: true,
  },
  {
    source: "/blog/webgpu-compute-shaders-local-ocr",
    destination: "/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    permanent: true,
  },
  {
    source: "/blog/zero-knowledge-ethics-professional-integrity",
    destination: "/blog/why-we-open-sourced-our-privacy-claims",
    permanent: true,
  },
] as const

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Existing codebase currently carries known type debt; keep production builds unblocked.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force metadata to be included in the initial HTML for all user agents.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [
      { source: "/pdf-tools/tools", destination: "/tools", permanent: true },
      { source: "/pdf-tools/tools/:path*", destination: "/tools/:path*", permanent: true },
      // Canonical comparison route migration.
      {
        source: "/compare/plain-vs-adobe-acrobat",
        destination: "/compare/plain-tools-vs-adobe-acrobat-online",
        permanent: true,
      },
      {
        source: "/compare/plain-vs-smallpdf",
        destination: "/compare/plain-tools-vs-smallpdf",
        permanent: true,
      },
      {
        source: "/compare/plain-vs-ilovepdf",
        destination: "/compare/plain-tools-vs-ilovepdf",
        permanent: true,
      },
      {
        source: "/compare/plain-tools-vs-adobe-online",
        destination: "/compare/plain-tools-vs-adobe-acrobat-online",
        permanent: true,
      },
      {
        source: "/compare/plain-vs-adobe-acrobat-online",
        destination: "/compare/plain-tools-vs-adobe-acrobat-online",
        permanent: true,
      },
      {
        source: "/compare/plain-vs-pdf24",
        destination: "/compare/plain-tools-vs-pdf24",
        permanent: true,
      },
      {
        source: "/compare/plain-vs-sejda",
        destination: "/compare/plain-tools-vs-sejda",
        permanent: true,
      },
      {
        source: "/learn/wasm-vs-cloud-security",
        destination: "/learn/is-offline-pdf-processing-secure",
        permanent: true,
      },
      {
        source: "/learn/hardware-acceleration",
        destination: "/learn/webassembly-pdf-processing-explained",
        permanent: true,
      },
      {
        source: "/learn/ram-optimisation",
        destination: "/learn/why-offline-compression-has-limits",
        permanent: true,
      },
      {
        source: "/learn/local-ai-processing",
        destination: "/learn/ocr-pdf-without-cloud",
        permanent: true,
      },
      {
        source: "/learn/redaction-guide",
        destination: "/learn/how-pdf-redaction-really-works",
        permanent: true,
      },
      {
        source: "/learn/offline-workflows",
        destination: "/learn/no-uploads-explained",
        permanent: true,
      },
      {
        source: "/learn/encryption-best-practices",
        destination: "/learn/is-offline-pdf-processing-secure",
        permanent: true,
      },

      // Canonical root SEO routes.
      {
        source: "/pdf-tools/learn",
        destination: "/learn",
        permanent: true,
      },
      {
        source: "/pdf-tools/learn/:path*",
        destination: "/learn/:path*",
        permanent: true,
      },
      {
        source: "/pdf-tools/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/pdf-tools/blog/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
      {
        source: "/pdf-tools/compare",
        destination: "/compare",
        permanent: true,
      },
      {
        source: "/pdf-tools/compare/:path*",
        destination: "/compare/:path*",
        permanent: true,
      },
      {
        source: "/verify",
        destination: "/verify-claims",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/sitemap",
        destination: "/html-sitemap",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/support",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/pdf-tools/verify",
        destination: "/verify-claims",
        permanent: true,
      },
      {
        source: "/pdf-tools/verify-claims",
        destination: "/verify-claims",
        permanent: true,
      },
      {
        source: "/pdf-tools/robots.txt",
        destination: "/robots.txt",
        permanent: true,
      },
      {
        source: "/pdf-tools/sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },

      // Legacy blog slug migrations to canonical published posts.
      ...legacyBlogSlugRedirects,

      // Canonical tool slugs.
      {
        source: "/tools/plain-local-cryptographic-signer",
        destination: "/tools/local-signer",
        permanent: true,
      },
      {
        source: "/tools/plain-metadata-purge",
        destination: "/tools/metadata-purge",
        permanent: true,
      },
      {
        source: "/tools/plain-password-breaker",
        destination: "/tools/password-breaker",
        permanent: true,
      },
      {
        source: "/tools/plain-webgpu-page-organiser",
        destination: "/tools/webgpu-organiser",
        permanent: true,
      },
      {
        source: "/tools/plain-hardware-accelerated-batch-engine",
        destination: "/tools/batch-engine",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-word",
        destination: "/tools/pdf-to-word",
        permanent: true,
      },
      {
        source: "/file-converters/word-to-pdf",
        destination: "/tools/word-to-pdf",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-ppt",
        destination: "/tools/pdf-to-ppt",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-jpg",
        destination: "/tools/pdf-to-jpg",
        permanent: true,
      },
      {
        source: "/file-converters/jpg-to-pdf",
        destination: "/tools/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-excel",
        destination: "/tools/pdf-to-excel",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-image",
        destination: "/tools/pdf-to-jpg",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-png",
        destination: "/tools/pdf-to-jpg",
        permanent: true,
      },
      {
        source: "/file-converters/png-to-pdf",
        destination: "/tools/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/file-converters/image-to-pdf",
        destination: "/tools/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/file-converters/excel-to-pdf",
        destination: "/file-converters",
        permanent: true,
      },
      {
        source: "/file-converters/ppt-to-pdf",
        destination: "/file-converters",
        permanent: true,
      },
      {
        source: "/file-converters/heic-to-pdf",
        destination: "/file-converters",
        permanent: true,
      },
      {
        source: "/file-converters/pdf-to-heic",
        destination: "/file-converters",
        permanent: true,
      },
      {
        source: "/file-converters/tiff-to-pdf",
        destination: "/file-converters",
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
        destination: "/compare/plain-tools-vs-ilovepdf",
        permanent: true,
      },
      {
        source: "/comparisons/plain-vs-online-pdf-tools",
        destination: "/compare/offline-vs-online-pdf-tools",
        permanent: true,
      },
      {
        source: "/comparisons/:path*",
        destination: "/compare/:path*",
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



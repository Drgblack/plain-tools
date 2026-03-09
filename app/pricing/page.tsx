import type { Metadata } from "next"

import PricingPageClient from "@/components/pricing/pricing-page-client"
import { buildPageMetadata } from "@/lib/page-metadata"

const baseMetadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Review Plain Tools pricing, free core-tool access, and upgrade details for AI features and support. This page is hidden from search results.",
  path: "/pricing",
  image: "/og/default.png",
})

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: "https://plain.tools/",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0,
    },
  },
}

export default function PricingPage() {
  return <PricingPageClient />
}

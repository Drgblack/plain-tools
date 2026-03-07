import type { Metadata } from "next"

import PricingPageClient from "@/components/pricing/pricing-page-client"
import { buildPageMetadata } from "@/lib/page-metadata"

const baseMetadata = buildPageMetadata({
  title: "Pricing",
  description:
    "See Plain Pro pricing, free core-tool access, and local-first billing details. Compare plan limits and upgrade only when advanced AI workflows are needed.",
  path: "/pricing",
  image: "/og/default.png",
})

export const metadata: Metadata = {
  ...baseMetadata,
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

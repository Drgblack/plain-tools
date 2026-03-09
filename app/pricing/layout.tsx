import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

const pricingMetadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Review Plain Tools pricing, free core-tool access, and upgrade details for AI features and support. This page is hidden from search results.",
  path: "/pricing",
  image: "/og/default.png",
})

export const metadata: Metadata = {
  ...pricingMetadata,
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

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import type { Metadata } from "next"

import PricingPageClient from "@/components/pricing/pricing-page-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "See Plain Pro pricing, free core-tool access, and local-first billing details. Compare plan limits and upgrade only when advanced AI workflows are needed.",
  path: "/pricing",
  image: "/og/default.png",
})

export default function PricingPage() {
  return <PricingPageClient />
}

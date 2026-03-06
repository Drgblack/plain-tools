import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "See Plain Pro pricing and free-core plan details for local browser workflows, optional AI features, and practical support for sensitive document handling.",
  path: "/pricing",
  image: "/og/default.png",
})

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

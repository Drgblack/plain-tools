import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "See Plain Pro pricing, free core-tool access, and local-first upgrade options. Compare plans, AI limits, billing, and upgrade timing before you commit.",
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

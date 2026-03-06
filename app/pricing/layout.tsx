import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Plain Pro Pricing - Unlimited AI PDF Tools | Plain Tools",
  description:
    "See Plain Pro pricing for unlimited AI PDF workflows. Core local tools stay free, with private browser-first processing and no file uploads.",
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

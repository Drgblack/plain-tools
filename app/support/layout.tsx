import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Support",
  description:
    "Contact Plain Tools support through our privacy-first email workflow, with direct help routes for tools, pricing, verification guidance, and practical onboarding.",
  path: "/support",
  image: "/og/default.png",
})

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

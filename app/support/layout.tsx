import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Support - Plain Tools",
  description:
    "Contact Plain Tools support with a privacy-first, email-first workflow. Find help routes for tools, learning guides, pricing, and verification.",
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

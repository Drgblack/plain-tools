import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Support - Plain Tools",
  description:
    "Get support for Plain Tools with troubleshooting guidance, system checks, and direct contact options for privacy-first browser workflows.",
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

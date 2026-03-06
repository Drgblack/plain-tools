import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Compare tools",
  description:
    "Compare Plain Tools with common PDF platforms using clear criteria on privacy handling, upload requirements, workflow speed, and practical fit.",
  path: "/compare",
  image: "/og/compare.png",
})

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



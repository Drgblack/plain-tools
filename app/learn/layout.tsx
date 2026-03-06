import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Learn",
  description:
    "Read practical Plain Tools guides for local PDF workflows, no-upload verification, and privacy-first browser processing decisions.",
  path: "/learn",
  image: "/og/learn.png",
})

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

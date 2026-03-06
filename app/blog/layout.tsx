import { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Read Plain Tools articles on local PDF processing, upload risks, trust verification, and practical workflow guidance for sensitive documents.",
  path: "/blog",
  image: "/og/default.png",
})

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


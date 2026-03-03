import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plain Metadata Purge",
  description: "Inspect and remove PDF metadata locally, including XMP and Info Dictionary fields, before sharing files outside your trusted environment. Built for private.",
  openGraph: {
    title: "Plain Metadata Purge",
    description:
      "Remove hidden PDF metadata locally with no upload exposure and clear before/after visibility for safer document release workflows.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/plain-metadata-purge",
  },
}

export default function MetadataPurgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



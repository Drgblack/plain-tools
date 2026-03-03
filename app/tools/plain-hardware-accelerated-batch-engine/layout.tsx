import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plain Hardware-Accelerated Batch Engine",
  description: "Process multiple PDF files in parallel local workers for batch merge, split, compress, and convert jobs without uploading documents to servers. Built for.",
  openGraph: {
    title: "Plain Hardware-Accelerated Batch Engine",
    description:
      "Run parallel local batch PDF workflows in your browser with per-file progress tracking and private no-upload architecture.",
  },
  alternates: {
    canonical: "https://plain.tools/tools/plain-hardware-accelerated-batch-engine",
  },
}

export default function HardwareBatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



import type { Metadata } from "next"

import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"

export const metadata: Metadata = {
  title: {
    default: "Plain Tools - PDF Tools",
    template: "%s | Plain Tools PDF Tools",
  },
  description:
    "Plain processes PDF files locally in your browser. Files are never uploaded to a server.",
}

export default function PdfToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <PdfToolsSubnav />
      <div data-legacy-plain className="pt-8 md:pt-10">
        {children}
      </div>
    </>
  )
}

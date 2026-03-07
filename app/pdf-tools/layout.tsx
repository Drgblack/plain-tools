import type { ReactNode } from "react"
import type { Metadata } from "next"
import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function PdfToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div data-pdf-tools-theme>
      <PdfToolsSubnav />
      {children}
    </div>
  )
}

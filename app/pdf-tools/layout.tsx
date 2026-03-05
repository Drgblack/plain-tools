import type { ReactNode } from "react"
import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"

export default function PdfToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div data-pdf-tools-theme>
      <PdfToolsSubnav />
      {children}
    </div>
  )
}

"use client"

import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"

type AppShellChromeProps = {
  children: React.ReactNode
}

export function AppShellChrome({ children }: AppShellChromeProps) {
  const pathname = usePathname()
  const showCanonicalHubSubnav =
    pathname?.startsWith("/learn") ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/compare")

  return (
    <>
      <Navigation />
      {showCanonicalHubSubnav ? <PdfToolsSubnav /> : null}
      <main className="flex-1">{children}</main>
      <Footer />
      <Analytics />
    </>
  )
}

"use client"

import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"

import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

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
      <SiteHeader />
      {showCanonicalHubSubnav ? <PdfToolsSubnav /> : null}
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Analytics />
    </>
  )
}

"use client"

import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

type AppShellChromeProps = {
  children: React.ReactNode
}

export function AppShellChrome({ children }: AppShellChromeProps) {
  const pathname = usePathname()
  const isPdfToolsRoute = pathname?.startsWith("/pdf-tools")

  return (
    <>
      {!isPdfToolsRoute ? <SiteHeader /> : null}
      <main className="flex-1">{children}</main>
      {!isPdfToolsRoute ? <SiteFooter /> : null}
      <Analytics />
    </>
  )
}

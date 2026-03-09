"use client"

import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { GoogleTranslateWidget } from "@/components/google-translate-widget"
import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"
import { GlobalPageBreadcrumbs } from "@/components/seo/global-page-breadcrumbs"
import { RouteStructuredData } from "@/components/seo/route-structured-data"
import { TranslationProtection } from "@/components/translation-protection"

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
      <TranslationProtection />
      <RouteStructuredData />
      <Navigation />
      <GlobalPageBreadcrumbs />
      {showCanonicalHubSubnav ? <PdfToolsSubnav /> : null}
      <main className="flex-1">{children}</main>
      <Footer />
      <GoogleTranslateWidget />
      <Analytics />
    </>
  )
}

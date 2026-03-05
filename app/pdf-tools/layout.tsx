import type { Metadata } from "next"
import Script from "next/script"
import { Inter, JetBrains_Mono, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PdfToolsSubnav } from "@/components/pdf-tools-subnav"
import { HydrationLoader } from "@/components/legacy/hydration-loader"
import { CommandPaletteProvider } from "@/components/legacy/command-palette-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

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
    <CommandPaletteProvider>
      <Script id="pdf-tools-context" strategy="beforeInteractive">
        {`window.__PLAIN_PDF_TOOLS__ = true;`}
      </Script>
      <div
        data-legacy-plain
        className={`${inter.variable} ${jetBrainsMono.variable} ${lora.variable} flex min-h-screen flex-col`}
      >
        <SiteHeader />
        <PdfToolsSubnav />
        <HydrationLoader />
        <div className="flex-1 pt-8 md:pt-10">{children}</div>
        <SiteFooter />
        <Analytics />
      </div>
    </CommandPaletteProvider>
  )
}

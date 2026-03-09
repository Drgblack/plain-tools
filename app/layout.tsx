import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AdsenseScript } from '@/components/ads/adsense-script'
import { AppShellChrome } from '@/components/app-shell-chrome'
import { JsonLd } from '@/components/seo/json-ld'
import { combineJsonLd, buildOrganizationSchema, buildWebSiteSchema } from '@/lib/structured-data'
import { buildSiteVerificationMetadata } from "@/lib/seo-monitoring"
import { buildThemeInitScript } from '@/lib/theme-bootstrap'
import { buildPageMetadata } from '@/lib/page-metadata'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const themeInitScript = buildThemeInitScript()
const safeThemeInitScript = `
try {
${themeInitScript}
} catch (_themeBootstrapError) {
  try {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  } catch {}
}
`
const rootSchema = combineJsonLd([
  buildWebSiteSchema({
    name: "Plain Tools",
    url: "https://plain.tools",
    description:
      "Trust-first utility platform for PDF workflows, file tasks, network diagnostics, and site availability checks.",
  }),
  buildOrganizationSchema({
    name: "Plain Tools",
    url: "https://plain.tools",
    logoUrl: "https://plain.tools/icon-512x512.png",
    contactEmail: "hello@plain.tools",
    sameAs: ["https://github.com/Drgblack/plain-tools"],
  }),
])
const siteVerificationMetadata = buildSiteVerificationMetadata()
const baseMetadata = buildPageMetadata({
  title: "Plain Tools - Local utility hub for PDF, file and network workflows",
  description:
    "Private browser tools for PDF, file conversion, network checks, and status monitoring. Local processing where supported, with no uploads for core workflows.",
  path: "/",
  image: "/og/default.png",
})

export const metadata: Metadata = {
  ...baseMetadata,
  generator: "Plain Tools",
  keywords: [
    "offline PDF tools",
    "private PDF tools",
    "client-side PDF processing",
    "no upload PDF",
    "local processing",
    "WebAssembly PDF",
  ],
  authors: [{ name: "Plain Tools" }],
  creator: "Plain Tools",
  metadataBase: new URL("https://plain.tools"),
  verification: siteVerificationMetadata,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      data-theme="dark"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WMDZKHTSJG" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WMDZKHTSJG', {
    anonymize_ip: true
  });
`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: safeThemeInitScript }} />
        <script defer data-domain="plain.tools" src="https://plausible.io/js/script.js" />
        <AdsenseScript />
        {rootSchema ? <JsonLd id="global-website-schema" schema={rootSchema} /> : null}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen flex flex-col bg-background font-sans antialiased text-foreground`}>
        <AppShellChrome>{children}</AppShellChrome>
      </body>
    </html>
  )
}

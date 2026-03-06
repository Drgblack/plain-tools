import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppShellChrome } from '@/components/app-shell-chrome'
import { buildStandardPageTitle } from '@/lib/page-title'
import { buildThemeInitScript } from '@/lib/theme-bootstrap'
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

export const metadata: Metadata = {
  title: buildStandardPageTitle("Plain Tools"),
  description:
    "Plain Tools offers privacy-first browser utilities for PDF workflows and practical file tasks. Files are processed locally with no upload requirement.",
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://plain.tools",
    siteName: "Plain Tools",
    title: "Plain Tools - Offline PDF Tools | 100% Local, No Uploads",
    description:
      "Private PDF and file workflows that run locally in your browser. No uploads for core local tools.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Plain Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plain Tools - Offline PDF Tools | 100% Local, No Uploads",
    description:
      "Private PDF and file workflows that run locally in your browser. No uploads for core local tools.",
    images: ["/og/default.png"],
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: safeThemeInitScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen flex flex-col bg-background font-sans antialiased text-foreground`}>
        <AppShellChrome>{children}</AppShellChrome>
      </body>
    </html>
  )
}

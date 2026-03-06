import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppShellChrome } from '@/components/app-shell-chrome'
import { buildThemeInitScript } from '@/lib/theme-bootstrap'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const themeInitScript = buildThemeInitScript()

export const metadata: Metadata = {
  title: {
    default: "Plain.tools - Private Browser PDF Tools",
    template: "%s | Plain.tools",
  },
  description:
    "Plain.tools offers privacy-first browser utilities for PDF workflows and practical file tasks. Files are processed locally with no upload requirement.",
  generator: "plain.tools",
  keywords: [
    "offline PDF tools",
    "private PDF tools",
    "client-side PDF processing",
    "no upload PDF",
    "local processing",
    "WebAssembly PDF",
  ],
  authors: [{ name: "Plain.tools" }],
  creator: "Plain.tools",
  metadataBase: new URL("https://plain.tools"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://plain.tools",
    siteName: "Plain.tools",
    title: "Plain.tools - Private Browser PDF Tools",
    description:
      "Private PDF and file workflows that run locally in your browser. No uploads for core local tools.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Plain.tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plain.tools - Private Browser PDF Tools",
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
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.jpg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen flex flex-col bg-background font-sans antialiased text-foreground`}>
        <AppShellChrome>{children}</AppShellChrome>
      </body>
    </html>
  )
}

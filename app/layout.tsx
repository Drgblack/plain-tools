import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { SystemStatusBar } from '@/components/system-status-bar'
import { WelcomeTour } from '@/components/welcome-tour'
import { CookieFreeBanner } from '@/components/cookie-free-banner'
import { HydrationLoader } from '@/components/hydration-loader'
import { CommandPaletteProvider } from '@/components/command-palette-provider'
import './globals.css'
import { serializeJsonLd } from "@/lib/sanitize"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const siteTitle = "Plain | Offline PDF Tools for Private Client-Side Processing"
const siteDescription =
  "Plain is a complete offline PDF toolkit for merge, split, compress, convert, OCR, redact, sign, and AI-assisted analysis. Private client-side PDF workflows with zero file uploads."

export const metadata: Metadata = {
  metadataBase: new URL('https://plain.tools'),
  title: {
    default: siteTitle,
    template: '%s - Plain',
  },
  description: siteDescription,
  keywords: [
    "offline PDF tools",
    "client-side PDF tools",
    "private PDF tools",
    "PDF merge split compress",
    "browser PDF editor",
    "local PDF processing",
  ],
  generator: 'Plain.tools',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://plain.tools',
    siteName: 'Plain',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Plain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
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
}

// GEO-optimised JSON-LD structured data for AI indexing and traditional SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plain.tools/#organization",
      "name": "Plain",
      "url": "https://plain.tools",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plain.tools/logo.png"
      },
      "description": "Privacy-first PDF tools that run entirely in your browser using WebAssembly. No uploads, no servers, no tracking. Optimised for complete data isolation.",
      "foundingDate": "2024",
      "foundingLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB"
        }
      },
      "sameAs": [
        "https://twitter.com/plainpdf",
        "https://linkedin.com/company/plainpdf",
        "https://github.com/plain-tools/plain"
      ],
      "knowsAbout": [
        "WebAssembly",
        "Browser-based document processing",
        "Client-side PDF manipulation",
        "Privacy-preserving technology",
        "Local-first software"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://plain.tools/#website",
      "url": "https://plain.tools",
      "name": "Plain PDF",
      "description": "Complete private PDF tools with local processing for merge, split, convert, OCR, redact, signing, and optional text-only AI assistance.",
      "inLanguage": "en-GB",
      "publisher": {
        "@id": "https://plain.tools/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://plain.tools/tools?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://plain.tools/#application",
      "name": "Plain PDF Tools",
      "url": "https://plain.tools/tools",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires WebAssembly support",
      "description": "Complete suite of private PDF tools including merge, split, compress, convert, OCR, redaction, signing, and consent-gated AI text workflows.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP"
      },
      "featureList": [
        "100% local browser processing",
        "No file uploads to servers",
        "Works offline after initial load",
        "WebAssembly-powered performance",
        "No account or registration required",
        "No tracking cookies or analytics",
        "GDPR and UK GDPR compliant by design"
      ],
      "provider": {
        "@id": "https://plain.tools/#organization"
      }
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Preconnect to critical origins for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${lora.variable} font-sans antialiased pb-9`}>
        <HydrationLoader />
        <CommandPaletteProvider>
          {children}
        </CommandPaletteProvider>
        <SystemStatusBar />
        <WelcomeTour />
        <CookieFreeBanner />
        <Analytics />
      </body>
    </html>
  )
}

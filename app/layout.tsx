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

export const metadata: Metadata = {
  metadataBase: new URL('https://plain.tools'),
  title: {
    default: 'Plain - Offline PDF Tools',
    template: '%s - Plain',
  },
  description: 'Plain processes PDF files locally in your browser. Files are never uploaded to a server.',
  generator: 'Plain.tools',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://plain.tools',
    siteName: 'Plain',
    title: 'Plain - Offline PDF Tools',
    description: 'Plain processes PDF files locally in your browser. Files are never uploaded to a server.',
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
    title: 'Plain - Offline PDF Tools',
    description: 'Plain processes PDF files locally in your browser. Files are never uploaded to a server.',
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
      "@id": "https://plainpdf.com/#organization",
      "name": "Plain",
      "url": "https://plainpdf.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plainpdf.com/logo.png"
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
      "@id": "https://plainpdf.com/#website",
      "url": "https://plainpdf.com",
      "name": "Plain PDF",
      "description": "Professional PDF tools with complete privacy. All processing happens locally in your browser using WebAssembly technology. No file uploads, no server processing, no data collection.",
      "inLanguage": "en-GB",
      "publisher": {
        "@id": "https://plainpdf.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://plainpdf.com/tools?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://plainpdf.com/#application",
      "name": "Plain PDF Tools",
      "url": "https://plainpdf.com/tools",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires WebAssembly support",
      "description": "Suite of privacy-first PDF tools including merge, split, compress, redact, and AI-powered analysis. All processing occurs locally using WebAssembly.",
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
        "@id": "https://plainpdf.com/#organization"
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
        {/* Preconnect to critical origins for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical Wasm module for faster LCP */}
        <link 
          rel="modulepreload" 
          href="/_next/static/chunks/pages/_app.js"
        />
        
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

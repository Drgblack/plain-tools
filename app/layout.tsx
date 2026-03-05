import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppShellChrome } from '@/components/app-shell-chrome'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Plain Tools - Fast, Private Browser Tools',
    template: '%s | Plain Tools',
  },
  description: 'Plain Tools is a privacy-first collection of browser utilities for file conversion, networking diagnostics, and developer tools. All tools run locally on your device without uploading files to external servers.',
  generator: 'plain.tools',
  keywords: ['privacy tools', 'browser tools', 'file converter', 'PDF tools', 'network tools', 'no upload', 'local processing', 'WebAssembly'],
  authors: [{ name: 'Plain Tools' }],
  creator: 'Plain Tools',
  metadataBase: new URL('https://plain.tools'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://plain.tools',
    siteName: 'Plain Tools',
    title: 'Plain Tools - Fast, Private Browser Tools',
    description: 'Fast, private tools that run locally in your browser. No uploads, no tracking, just tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plain Tools - Fast, Private Browser Tools',
    description: 'Fast, private tools that run locally in your browser. No uploads, no tracking, just tools.',
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
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AppShellChrome>{children}</AppShellChrome>
      </body>
    </html>
  )
}

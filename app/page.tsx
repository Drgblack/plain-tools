import type { Metadata } from "next"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { LazyHomepageDemo } from "@/components/lazy-homepage-demo"
import { TrustStrip } from "@/components/trust-strip"
import { ToolsSection } from "@/components/tools-section"
import { WhyPlainExists } from "@/components/why-plain-exists"
import { PrivacyManifesto } from "@/components/privacy-manifesto"
import { HowItWorks } from "@/components/how-it-works"
import { PrivacySection } from "@/components/privacy-section"
import { SeoContent } from "@/components/seo-content"
import { TechnicalFaq } from "@/components/technical-faq"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Plain | Offline PDF Tools That Keep Files on Your Device",
  description:
    "Use Plain for offline PDF merge, split, compress, convert, OCR, redaction, signing, and AI-assisted analysis with private client-side processing.",
  alternates: {
    canonical: "https://plain.tools/",
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <LazyHomepageDemo />
        <ToolsSection />
        <WhyPlainExists />
        <PrivacyManifesto />
        <HowItWorks />
        <PrivacySection />
        <SeoContent />
        <TechnicalFaq />
      </main>
      <Footer />
    </div>
  )
}


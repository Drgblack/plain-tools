import { Header } from "@/components/legacy/header"
import { Hero } from "@/components/legacy/hero"
import { TrustStrip } from "@/components/legacy/trust-strip"
import { ToolsSection } from "@/components/legacy/tools-section"
import { PrivacyManifesto } from "@/components/legacy/privacy-manifesto"
import { HowItWorks } from "@/components/legacy/how-it-works"
import { PrivacySection } from "@/components/legacy/privacy-section"
import { SeoContent } from "@/components/legacy/seo-content"
import { TechnicalFaq } from "@/components/legacy/technical-faq"
import { Footer } from "@/components/legacy/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <ToolsSection />
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


import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TrustStrip } from "@/components/trust-strip"
import { ToolsSection } from "@/components/tools-section"
import { PrivacyManifesto } from "@/components/privacy-manifesto"
import { HowItWorks } from "@/components/how-it-works"
import { PrivacySection } from "@/components/privacy-section"
import { SeoContent } from "@/components/seo-content"
import { TechnicalFaq } from "@/components/technical-faq"
import { Footer } from "@/components/footer"

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

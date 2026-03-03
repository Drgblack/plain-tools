import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VerifyClaimsContent } from "@/components/verify-claims-content"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "Verify Plain's Claims - No Uploads, Runs Locally",
  description: "Learn how to verify that Plain processes PDFs locally in your browser - no uploads, no servers, and offline support.",
}

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://plain.tools/verify-claims",
      "url": "https://plain.tools/verify-claims",
      "name": "Verify Plain's Claims - No Uploads, Runs Locally",
      "description": "Learn how to verify that Plain processes PDFs locally in your browser - no uploads, no servers, and offline support.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Plain",
        "url": "https://plain.tools"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does Plain upload my PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Plain processes PDFs locally in your browser. Your files are not uploaded for processing."
          }
        },
        {
          "@type": "Question",
          "name": "Can I verify this myself?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Use your browser's Developer Tools (Network tab) while running a tool. You should not see requests containing your PDF data."
          }
        },
        {
          "@type": "Question",
          "name": "Does Plain work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Plain can work offline after the site has loaded. If you refresh while offline, loading depends on your browser cache."
          }
        }
      ]
    }
  ]
}

export default function VerifyClaimsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Header />
      <main className="overflow-x-hidden">
        <div className="[&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:whitespace-nowrap sm:[&_table]:table">
          <VerifyClaimsContent />
        </div>
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from "next"
import { VerifyClaimsContent } from "@/components/verify-claims-content"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "We Dare You to Catch Us Uploading Your Files",
  description: "Interactive proof page showing exactly how to verify Plain's zero-upload privacy claims in DevTools. Built for private, offline-first PDF workflows with clear.",
}

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://plain.tools/verify-claims",
      "url": "https://plain.tools/verify-claims",
      "name": "We Dare You to Catch Us Uploading Your Files",
      "description": "Interactive proof page showing exactly how to verify Plain's zero-upload privacy claims in DevTools.",
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
      <main className="overflow-x-hidden">
        <VerifyClaimsContent />
      </main>
    </>
  )
}



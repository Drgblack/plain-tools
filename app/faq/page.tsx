import { Metadata } from "next"
import Script from "next/script"
import Link from "next/link"
import { serializeJsonLd } from "@/lib/sanitize"
import { applyIndexationPolicy } from "@/lib/seo/indexation-policy"
import { buildPageMetadata } from "@/lib/page-metadata"

const baseMetadata = buildPageMetadata({
  title: "FAQ",
  description:
    "Plain answers common questions about offline PDF processing, file privacy, and how browser-based tools work. Built for private, offline-first PDF workflows.",
  path: "/faq",
  image: "/og/default.png",
})

export const metadata: Metadata = applyIndexationPolicy(
  {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      title: "FAQ - Plain",
      description: "Plain answers common questions about offline PDF processing and file privacy.",
    },
  },
  "/faq"
)

const faqs = [
  {
    question: "Can I merge PDFs without uploading them?",
    answer:
      "Yes. Plain allows you to merge PDF files entirely in your browser. Files are processed locally and are never uploaded to a server.",
  },
  {
    question: "Does Plain upload my files?",
    answer:
      "No. Plain does not upload files. All PDF processing happens locally in your browser, and files never leave your device.",
  },
  {
    question: "Does Plain work offline?",
    answer:
      "Yes. Once the page is loaded, Plain works offline. You can disconnect from the internet and continue using the tools.",
  },
  {
    question: "How does Plain process PDF files?",
    answer:
      "Plain uses client-side browser technology to process PDF files locally. No server-side processing is involved.",
  },
  {
    question: "Is Plain safe for confidential documents?",
    answer:
      "Because files are never uploaded to external servers, Plain is suitable for confidential documents where uploading files is not acceptable.",
  },
  {
    question: "How is Plain different from iLovePDF or Smallpdf?",
    answer:
      "Unlike online PDF services that upload files to external servers for processing, Plain processes PDF files locally in the browser and does not upload files.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. Plain does not require user accounts or sign-ups.",
  },
  {
    question: "Can I verify that no uploads occur?",
    answer:
      "Yes. Users can inspect network activity in browser developer tools or use Plain offline to verify that no file uploads take place.",
  },
  {
    question: "Does Plain use cookies or tracking?",
    answer: "Plain does not require cookies or tracking to function.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>

          <div className="mt-12 space-y-10">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-8 last:border-0">
                <h2 className="text-lg font-medium text-foreground">
                  {faq.question}
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plain provides private PDF utilities that work entirely in your browser. 
              Whether you need to merge PDF without upload, use offline PDF tools, or 
              require client-side PDF processing for sensitive documents, Plain offers 
              browser-based PDF tools that keep your files on your device.
            </p>
            <div className="mt-6 flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



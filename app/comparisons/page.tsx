import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Script from "next/script"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "Comparisons",
  description:
    "Plain compares offline and online PDF tools with factual, neutral analysis of architecture and privacy differences.",
  openGraph: {
    title: "Comparisons - Plain",
    description: "Plain compares offline and online PDF tools with factual analysis.",
  },
  alternates: {
    canonical: "https://plain.tools/comparisons",
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plain.tools/" },
    { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://plain.tools/comparisons" }
  ]
}

const comparisons = [
  {
    title: "Plain vs Online PDF Tools",
    description: "A neutral comparison between offline, client-side PDF tools like Plain and traditional online, server-based PDF services.",
    href: "/comparisons/plain-vs-online-pdf-tools",
  },
  {
    title: "Plain vs iLovePDF",
    description: "A factual comparison between Plain and iLovePDF. Understand the differences in architecture, privacy model, and usage patterns.",
    href: "/comparisons/plain-vs-ilovepdf",
  },
]

export default function ComparisonsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Comparisons
            </h1>
            <p className="mt-4 text-muted-foreground">
              Neutral comparisons between Plain and other PDF tools to help you understand the differences.
            </p>

            <div className="mt-10 space-y-4">
              {comparisons.map((comparison) => (
                <Link key={comparison.href} href={comparison.href}>
                  <Card className="group transition-colors hover:border-accent/50 hover:bg-secondary/50">
                    <CardContent className="flex items-center justify-between p-5">
                      <div>
                        <h2 className="font-medium text-foreground">
                          {comparison.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {comparison.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

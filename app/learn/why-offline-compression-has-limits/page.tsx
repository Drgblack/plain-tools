import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, Info } from "lucide-react"
import { ArticleShareRow } from "@/components/share-button"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "Why Offline PDF Compression Has Limits – Plain",
  description: "Understanding the technical limitations of browser-based PDF compression compared to server-based tools. What affects compression results and when to expect.",
  openGraph: {
    title: "Why Offline PDF Compression Has Limits – Plain",
    description: "Understanding the technical limitations of browser-based PDF compression.",
  },
  alternates: {
    canonical: "https://plain.tools/learn/why-offline-compression-has-limits",
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Why Offline PDF Compression Has Limits",
  "description": "Understanding the technical limitations of browser-based PDF compression compared to server-based tools.",
  "author": {
    "@type": "Organization",
    "name": "Plain",
    "url": "https://plain.tools"
  },
  "publisher": {
    "@id": "https://plain.tools/#organization"
  },
  "datePublished": "2026-02-27",
  "dateModified": "2026-02-27",
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://plain.tools/" },
    { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://plain.tools/learn" },
    { "@type": "ListItem", "position": 3, "name": "Why Offline Compression Has Limits", "item": "https://plain.tools/learn/why-offline-compression-has-limits" }
  ]
}

export default function WhyOfflineCompressionHasLimitsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      

      <main className="flex-1 px-4 py-16 md:py-24">
        <article className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/learn" className="flex items-center gap-1 transition-colors hover:text-accent">
              <ArrowLeft className="h-3.5 w-3.5" />
              Learn
            </Link>
            <span>/</span>
            <span className="text-foreground/70">Why Offline Compression Has Limits</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20">
                Technical
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why Offline PDF Compression Has Limits
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Browser-based PDF compression works differently than server-based tools. 
              Understanding these differences helps set realistic expectations.
            </p>
          </header>

          {/* Key point box */}
          <div className="mb-12 rounded-xl bg-[oklch(0.17_0.008_250)] p-6 ring-1 ring-accent/15">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Key Point</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Offline compression prioritizes privacy over maximum size reduction. Your files 
              stay on your device, but compression results depend heavily on how the original 
              PDF was created.
            </p>
          </div>

          {/* Content */}
          <div className="prose-plain space-y-10">
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                What Affects Compression Results
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                PDF compression results vary significantly based on the source document. 
                Several factors determine how much a file can be reduced:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Image quality and format</strong> — 
                    PDFs with uncompressed or lightly compressed images offer the most potential savings.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Embedded fonts</strong> — 
                    Documents with multiple embedded fonts contain more data that cannot be easily reduced.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">Existing compression</strong> — 
                    PDFs already optimized or compressed by other tools have limited room for improvement.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong className="font-medium text-foreground">PDF structure</strong> — 
                    Some PDFs contain unused objects or redundant data that can be removed.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Browser vs Server Compression
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Server-based PDF tools can achieve greater compression because they have access to:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>Powerful image resampling and re-encoding algorithms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>Font subsetting and optimization libraries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>Lossy compression that reduces quality to save space</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>More computational resources</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                Browser-based compression focuses on lossless techniques: removing unused objects, 
                optimizing the PDF structure, and applying object streams. This preserves quality 
                but limits maximum reduction.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                When Offline Compression Works Well
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Offline compression is effective when:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>The PDF was created by software that doesn't optimize by default</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>The document has been edited multiple times, accumulating unused data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>You need any reduction without uploading sensitive files</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>Privacy is more important than maximum file size reduction</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Setting Realistic Expectations
              </h2>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                If Plain's compression shows minimal or no reduction, it typically means:
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>The PDF is already well-optimized</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>Images are already compressed with efficient codecs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>Further reduction would require quality loss</span>
                </li>
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
                This is a trade-off we accept to ensure your files never leave your device.
              </p>
            </section>

            <section className="border-t border-accent/10 pt-8">
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Offline compression provides privacy-preserving size reduction. For documents 
                that don't contain sensitive information and require maximum compression, 
                server-based tools may be more appropriate.
              </p>
            </section>
          </div>

          {/* Related links */}
          <div className="mt-16 border-t border-accent/10 pt-10">
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
              Related
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/tools/compress-pdf"
                className="group rounded-lg bg-[oklch(0.16_0.006_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
                  Compress PDF Tool
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/70">
                  Try offline compression
                </p>
              </Link>
              <Link
                href="/compare/offline-vs-online-pdf-tools"
                className="group rounded-lg bg-[oklch(0.16_0.006_250)] p-4 ring-1 ring-accent/10 transition-all duration-200 hover:ring-accent/25"
              >
                <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
                  Offline vs Online Tools
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/70">
                  Compare processing approaches
                </p>
              </Link>
            </div>
          </div>

          {/* Share */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <ArticleShareRow />
          </div>

          {/* Back to learn */}
          <div className="mt-8">
            <Link
              href="/learn"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to Learning Center
            </Link>
          </div>
        </article>
      </main>

      
    </div>
  )
}


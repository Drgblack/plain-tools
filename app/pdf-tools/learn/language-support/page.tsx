import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Globe, FolderTree, Link2, Languages } from "lucide-react"
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/legacy/schema"

export const metadata: Metadata = {
  title: "Language Support & Localization",
  description:
    "Learn about Plain's language support roadmap, including why we launched in English first, when German and French will be added, and our technical approach to multilingual SEO.",
  alternates: {
    canonical: "https://plain.tools/learn/language-support",
  },
}

// Article schema
const articleSchema = generateArticleSchema({
  title: "Language Support & Localization",
  description:
    "An explanation of Plain's language support roadmap and multilingual SEO strategy.",
  slug: "language-support",
  datePublished: "2026-02-01",
  dateModified: "2026-02-27",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Language Support", slug: "language-support" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "What languages does Plain support?",
    answer:
      "Plain currently supports English as the primary language. German (DE) and French (FR) support is planned and the technical infrastructure is in place for multilingual content.",
  },
  {
    question: "Will Plain be available in other languages?",
    answer:
      "Yes. German and French are the first planned additions. The routing and content structure supports adding more languages in the future.",
  },
  {
    question: "Do the PDF tools work with non-English documents?",
    answer:
      "Yes. The PDF processing tools work with documents in any language. The language settings only affect the Plain interface, not the documents you process.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function LanguageSupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-accent/10 bg-[oklch(0.12_0.004_250)] px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <nav className="flex items-center gap-2 text-[12px] text-muted-foreground/60">
              <Link href="/pdf-tools/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/pdf-tools/learn" className="hover:text-foreground transition-colors">
                Learn
              </Link>
              <span>/</span>
              <span className="text-foreground/80">Language Support</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <section className="border-b border-accent/10 bg-[oklch(0.125_0.004_250)] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 text-accent mb-4">
              <Globe className="h-5 w-5" />
              <span className="text-[12px] font-medium uppercase tracking-wider">Roadmap</span>
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Language Support & Localization
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground/80">
              A transparent overview of Plain&apos;s language roadmap and our technical 
              approach to multilingual support without compromising SEO.
            </p>
          </div>
        </section>

        {/* Article Content */}
        <article className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            {/* In Simple Terms */}
            <div className="mb-12 rounded-xl border border-accent/15 bg-[oklch(0.16_0.007_250)] p-6">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent">
                In Simple Terms
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
                Plain launches in English first to establish a solid foundation. German and 
                French support will follow using a subdirectory approach (/de, /fr) with 
                proper hreflang tags and canonical URLs to avoid duplicate content issues.
              </p>
            </div>

            {/* Why English First */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Languages className="h-4 w-4" />
                </span>
                Why English First
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  We chose to launch Plain in English for several practical reasons:
                </p>
                <ul className="ml-4 space-y-2 list-disc marker:text-accent/50">
                  <li>
                    <strong className="text-foreground/90">Broader initial reach</strong> — English 
                    allows us to gather feedback from the widest possible audience during our 
                    early development phase.
                  </li>
                  <li>
                    <strong className="text-foreground/90">Technical documentation</strong> — Most 
                    developer resources and libraries we rely on are documented in English, making 
                    it easier to maintain consistency.
                  </li>
                  <li>
                    <strong className="text-foreground/90">Quality over speed</strong> — Rather than 
                    launching with machine-translated content, we want to ensure each language 
                    version meets our quality standards.
                  </li>
                  <li>
                    <strong className="text-foreground/90">SEO foundation</strong> — Establishing 
                    strong English content first allows us to properly implement internationalization 
                    without retrofitting.
                  </li>
                </ul>
              </div>
            </section>

            {/* Timeline for German and French */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                When German and French Will Be Added
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  German and French are our priority languages for expansion, based on user 
                  requests and regional privacy regulations (GDPR awareness is particularly 
                  high in these markets).
                </p>
                <div className="mt-6 rounded-lg border border-accent/10 bg-[oklch(0.14_0.005_250)] p-5">
                  <h3 className="text-[13px] font-semibold text-foreground">Planned Timeline</h3>
                  <ul className="mt-3 space-y-3 text-[13px]">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-accent/60" />
                      <div>
                        <strong className="text-foreground/90">German (/de)</strong>
                        <span className="text-muted-foreground/70"> — Q2 2026</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-accent/40" />
                      <div>
                        <strong className="text-foreground/90">French (/fr)</strong>
                        <span className="text-muted-foreground/70"> — Q3 2026</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <p className="mt-4 text-[13px] text-muted-foreground/70">
                  These timelines are estimates and may shift based on development priorities 
                  and community feedback.
                </p>
              </div>
            </section>

            {/* Translation Approach */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                How Translations Will Be Done
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  We will use a hybrid approach combining professional translation with 
                  native speaker review:
                </p>
                <ul className="ml-4 space-y-2 list-disc marker:text-accent/50">
                  <li>
                    <strong className="text-foreground/90">UI strings</strong> — Professional 
                    translation with context notes for translators
                  </li>
                  <li>
                    <strong className="text-foreground/90">Educational content</strong> — Human 
                    translation by native speakers familiar with PDF/privacy terminology
                  </li>
                  <li>
                    <strong className="text-foreground/90">Legal/privacy pages</strong> — Professional 
                    legal translation to ensure accuracy
                  </li>
                </ul>
                <p className="mt-4">
                  We explicitly avoid bulk machine translation. Each piece of content will be 
                  reviewed by a native speaker before publication.
                </p>
              </div>
            </section>

            {/* Subdirectory Approach */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <FolderTree className="h-4 w-4" />
                </span>
                Subdirectory Approach
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  We use subdirectories rather than subdomains or separate domains for 
                  language versions:
                </p>
                <div className="mt-4 rounded-lg border border-accent/10 bg-[oklch(0.14_0.005_250)] p-5 font-mono text-[13px]">
                  <div className="space-y-1 text-muted-foreground/80">
                    <p><span className="text-accent">plain.tools</span> — English (default)</p>
                    <p><span className="text-accent">plain.tools/de</span> — German</p>
                    <p><span className="text-accent">plain.tools/fr</span> — French</p>
                  </div>
                </div>
                <p className="mt-4">
                  <strong className="text-foreground/90">Why subdirectories?</strong>
                </p>
                <ul className="ml-4 space-y-2 list-disc marker:text-accent/50">
                  <li>Domain authority is consolidated under one domain</li>
                  <li>Simpler infrastructure and deployment</li>
                  <li>Easier SSL certificate management</li>
                  <li>Clear URL structure for users and search engines</li>
                </ul>
              </div>
            </section>

            {/* hreflang Strategy */}
            <section className="mb-12">
              <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Link2 className="h-4 w-4" />
                </span>
                hreflang Strategy
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  To help search engines serve the correct language version to users, we 
                  implement hreflang tags on every page:
                </p>
                <div className="mt-4 rounded-lg border border-accent/10 bg-[oklch(0.14_0.005_250)] p-5 overflow-x-auto">
                  <pre className="text-[12px] text-muted-foreground/80">
{`<link rel="alternate" hreflang="en" href="https://plain.tools/tools/merge-pdf" />
<link rel="alternate" hreflang="de" href="https://plain.tools/de/tools/merge-pdf" />
<link rel="alternate" hreflang="fr" href="https://plain.tools/fr/tools/merge-pdf" />
<link rel="alternate" hreflang="x-default" href="https://plain.tools/tools/merge-pdf" />`}
                  </pre>
                </div>
                <p className="mt-4">
                  The <code className="rounded bg-accent/10 px-1.5 py-0.5 text-[13px] text-accent">x-default</code> tag 
                  tells search engines which version to show when no specific language match 
                  exists — in our case, English.
                </p>
              </div>
            </section>

            {/* Canonical Handling */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Canonical Handling
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  Each language version has its own canonical URL pointing to itself, not to 
                  the English version. This is the correct approach for true translations:
                </p>
                <div className="mt-4 rounded-lg border border-accent/10 bg-[oklch(0.14_0.005_250)] p-5 overflow-x-auto">
                  <pre className="text-[12px] text-muted-foreground/80">
{`<!-- On /de/tools/merge-pdf -->
<link rel="canonical" href="https://plain.tools/de/tools/merge-pdf" />

<!-- On /fr/tools/merge-pdf -->
<link rel="canonical" href="https://plain.tools/fr/tools/merge-pdf" />`}
                  </pre>
                </div>
                <p className="mt-4">
                  <strong className="text-foreground/90">Avoiding SEO duplication:</strong> The 
                  combination of self-referencing canonicals and proper hreflang implementation 
                  signals to search engines that these are equivalent pages in different 
                  languages — not duplicate content.
                </p>
              </div>
            </section>

            {/* Technical Implementation */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Technical Implementation
              </h2>
              <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  Our Next.js implementation will use:
                </p>
                <ul className="ml-4 space-y-2 list-disc marker:text-accent/50">
                  <li>
                    <strong className="text-foreground/90">next-intl</strong> or similar — For 
                    managing translations and locale routing
                  </li>
                  <li>
                    <strong className="text-foreground/90">Middleware-based locale detection</strong> — 
                    Respecting Accept-Language headers while allowing manual override
                  </li>
                  <li>
                    <strong className="text-foreground/90">Separate JSON translation files</strong> — 
                    Organized by locale for maintainability
                  </li>
                  <li>
                    <strong className="text-foreground/90">Locale-aware metadata</strong> — Titles, 
                    descriptions, and Open Graph tags in each language
                  </li>
                </ul>
              </div>
            </section>

            {/* Summary */}
            <section className="border-t border-accent/10 pt-10">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Summary
              </h2>
              <div className="mt-5 text-[14px] leading-relaxed text-muted-foreground/85">
                <p>
                  Language expansion is a priority, but we&apos;re taking a measured approach to 
                  ensure quality. By using subdirectories, proper hreflang tags, and 
                  self-referencing canonicals, we&apos;ll provide localized experiences without 
                  SEO penalties or duplicate content issues.
                </p>
              </div>
            </section>

            {/* Related Links */}
            <div className="mt-12 border-t border-accent/10 pt-10">
              <h2 className="text-[14px] font-semibold text-foreground">Related</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/pdf-tools/learn"
                  className="rounded-lg border border-accent/10 bg-[oklch(0.16_0.006_250)] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-accent/25 hover:text-foreground"
                >
                  Learning Center
                </Link>
                <Link
                  href="/pdf-tools/learn/how-plain-works"
                  className="rounded-lg border border-accent/10 bg-[oklch(0.16_0.006_250)] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-accent/25 hover:text-foreground"
                >
                  How Plain Works
                </Link>
                <Link
                  href="/pdf-tools/"
                  className="rounded-lg border border-accent/10 bg-[oklch(0.16_0.006_250)] px-4 py-2 text-[13px] text-muted-foreground transition-all hover:border-accent/25 hover:text-foreground"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}




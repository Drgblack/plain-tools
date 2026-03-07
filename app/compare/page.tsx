import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Gauge, ShieldCheck, Users } from "lucide-react"
import { AdsensePlaceholder } from "@/components/ads/adsense-placeholder"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { FIRST_WAVE_COMPARE_PAGES } from "@/lib/seo/first-wave-pages"

export const metadata: Metadata = buildPageMetadata({
  title: "Compare PDF tools",
  description:
    "Compare Plain Tools with major PDF platforms on privacy handling, upload requirements, workflow speed, and practical fit for sensitive documents.",
  path: "/compare",
  image: "/og/compare.png",
})

const comparisonLinks = [
  {
    href: "/compare/plain-tools-vs-smallpdf",
    title: "Plain Tools vs Smallpdf",
    summary: "Compare upload workflow, privacy model, and day-to-day handling for common PDF tasks.",
  },
  {
    href: "/compare/plain-tools-vs-ilovepdf",
    title: "Plain Tools vs iLovePDF",
    summary: "Compare local processing against cloud processing for practical privacy-sensitive work.",
  },
  {
    href: "/compare/plain-tools-vs-adobe-acrobat-online",
    title: "Plain Tools vs Adobe Acrobat Online",
    summary: "Compare document-control trade-offs when handling sensitive internal or client files.",
  },
  {
    href: "/compare/plain-tools-vs-pdf24",
    title: "Plain Tools vs PDF24",
    summary: "A practical side-by-side focused on workflow clarity, upload risk, and portability.",
  },
  {
    href: "/compare/plain-tools-vs-sejda",
    title: "Plain Tools vs Sejda",
    summary: "Evaluate processing model, operational controls, and suitability for private workflows.",
  },
  {
    href: "/compare/plain-vs-docusign",
    title: "Plain Tools vs DocuSign",
    summary: "Compare local visual signing workflows with hosted signing models and account requirements.",
  },
]

const comparisonSummary = [
  {
    criterion: "Upload required for core workflow",
    plain: "No. Local browser processing.",
    typicalCloud: "Usually yes. Server-side processing.",
  },
  {
    criterion: "Works after initial load without internet",
    plain: "Yes for local tools.",
    typicalCloud: "Usually no.",
  },
  {
    criterion: "Privacy verification path",
    plain: "DevTools verification available.",
    typicalCloud: "Varies by service.",
  },
  {
    criterion: "Best fit",
    plain: "Sensitive documents and controlled workflows.",
    typicalCloud: "Account-centric collaboration workflows.",
  },
]

const comparisonToolLinks = [
  { label: "Merge PDF locally", href: "/tools/merge-pdf" },
  { label: "Split PDF by pages locally", href: "/tools/split-pdf" },
  { label: "Compress PDF without uploading", href: "/tools/compress-pdf" },
  { label: "Convert PDF to Word locally", href: "/tools/pdf-to-word" },
  { label: "Sign PDF locally in browser", href: "/tools/sign-pdf" },
]

const firstWaveComparisons = FIRST_WAVE_COMPARE_PAGES

const compareHubSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Compare PDF tools",
    description:
      "Neutral comparisons of Plain Tools against upload-based PDF platforms on privacy, speed, and workflow fit.",
    url: "https://plain.tools/compare",
  }),
  buildCollectionPageSchema({
    name: "Plain Tools comparison hub",
    description:
      "Structured comparison pages for privacy-sensitive PDF workflows and practical operational trade-offs.",
    url: "https://plain.tools/compare",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Compare", url: "https://plain.tools/compare" },
  ]),
])

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {compareHubSchema ? <JsonLd id="compare-hub-schema" schema={compareHubSchema} /> : null}

      <main className="flex-1 px-4 py-14 md:py-16">
        <div className="mx-auto max-w-6xl space-y-12">
          <section className="space-y-5">
            <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Compare PDF tools with practical, privacy-first criteria
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This section gives neutral comparisons between Plain Tools and common alternatives.
              Core processing on Plain Tools runs locally in your browser. No uploads are required
              for local workflows.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/verify-claims"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Verify claims
              </Link>
              <Link
                href="/tools"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Browse tools
              </Link>
              <Link
                href="/learn"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Read guides
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card/35 p-4">
              <h2 className="text-sm font-semibold text-foreground">Relevant tools to try while comparing</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {comparisonToolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-accent transition hover:border-accent/40 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <AdsensePlaceholder slot="1100000002" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Comparison framework</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card/45 p-3.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <p className="mt-2 text-sm font-semibold text-foreground">Privacy comparison</p>
                <p className="mt-1 text-xs text-muted-foreground">Upload behaviour, processing model, and technical verification path.</p>
              </div>
              <div className="rounded-xl border border-border bg-card/45 p-3.5">
                <Gauge className="h-4 w-4 text-accent" />
                <p className="mt-2 text-sm font-semibold text-foreground">Workflow and speed</p>
                <p className="mt-1 text-xs text-muted-foreground">Operational friction, transfer steps, and practical execution time.</p>
              </div>
              <div className="rounded-xl border border-border bg-card/45 p-3.5">
                <Users className="h-4 w-4 text-accent" />
                <p className="mt-2 text-sm font-semibold text-foreground">Best for</p>
                <p className="mt-1 text-xs text-muted-foreground">Which workflows suit local-first handling versus hosted account models.</p>
              </div>
            </div>

            <div className="grid gap-3 md:hidden">
              {comparisonSummary.map((row) => (
                <div
                  key={row.criterion}
                  className={`rounded-xl border p-3 ${row.criterion.toLowerCase().includes("upload") ? "border-blue-500/35 bg-blue-500/10" : "border-border bg-card/45"}`}
                >
                  <p className="text-sm font-semibold text-foreground">{row.criterion}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Plain Tools:</span> {row.plain}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Typical upload tools:</span> {row.typicalCloud}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card/20 md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Criterion</th>
                    <th className="px-4 py-3 font-semibold">Plain Tools</th>
                    <th className="px-4 py-3 font-semibold">Typical upload-based tools</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonSummary.map((row) => (
                    <tr
                      key={row.criterion}
                      className={`border-t border-border ${row.criterion.toLowerCase().includes("upload") ? "bg-blue-500/[0.06]" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.criterion}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.plain}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.typicalCloud}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {comparisonLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-border bg-card/50 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent">
                  Read comparison
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </section>

          <section className="rounded-xl border border-border bg-card/30 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-foreground">First-wave comparison pages</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These three pages target the highest-intent alternative queries first.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {firstWaveComparisons.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="rounded-lg border border-border bg-background/60 px-4 py-3 text-sm font-medium text-accent transition hover:border-accent/40 hover:underline"
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/30 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-foreground">How to evaluate fairly</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Check whether core operations require upload.</li>
              <li>Run one real workflow and inspect the Network panel in DevTools.</li>
              <li>Compare practical steps, not only feature checklists.</li>
              <li>Choose based on document sensitivity and operational requirements.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}


import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Best Smallpdf Alternative - Private PDF Tools",
  description:
    "Looking for a Smallpdf alternative? Compare local-first Plain Tools with upload-based workflows on privacy, speed, and practical document handling.",
  path: "/compare/smallpdf-alternative",
  image: "/og/compare.png",
})

const comparisonRows = [
  {
    feature: "Core workflow model",
    plain: "Local-first browser processing for core PDF tasks",
    alternative: "Commonly upload-first online workflow",
  },
  {
    feature: "Sensitive file handling",
    plain: "No upload step required for core local tools",
    alternative: "Depends on provider processing and retention policy",
  },
  {
    feature: "Startup friction",
    plain: "Open tool and run",
    alternative: "Upload, process, then download",
  },
  {
    feature: "Verification method",
    plain: "Inspectable in browser DevTools",
    alternative: "Relies on external trust statements",
  },
]

const faqs = [
  {
    question: "What makes a good Smallpdf alternative for private files?",
    answer:
      "Look for a local-first workflow, clear no-upload behaviour for core tasks, and a practical verification path you can run yourself.",
  },
  {
    question: "Is Plain Tools always better than Smallpdf?",
    answer:
      "Not always. Plain Tools is usually stronger for privacy-sensitive workflows, while cloud-first tools may suit account-centric collaboration needs.",
  },
  {
    question: "Which tools should I test first before switching?",
    answer:
      "Start with merge, compress, and OCR workflows using real sample files, then compare speed, output quality, and process friction.",
  },
]

const schema = combineJsonLd([
  buildWebPageSchema({
    name: "Best Smallpdf Alternative - Private PDF Tools",
    description:
      "Comparison landing page for users searching Smallpdf alternatives with stronger local-processing and privacy controls.",
    url: "https://plain.tools/compare/smallpdf-alternative",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Compare", url: "https://plain.tools/compare" },
    {
      name: "Best Smallpdf Alternative",
      url: "https://plain.tools/compare/smallpdf-alternative",
    },
  ]),
  buildFaqPageSchema(faqs),
  buildItemListSchema(
    "Smallpdf alternative tool tests",
    [
      { name: "Merge PDF locally", url: "https://plain.tools/tools/merge-pdf" },
      { name: "Compress PDF without uploading", url: "https://plain.tools/tools/compress-pdf" },
      { name: "Run OCR PDF locally", url: "https://plain.tools/tools/ocr-pdf" },
    ],
    "https://plain.tools/compare/smallpdf-alternative"
  ),
])

export default function SmallpdfAlternativePage() {
  return (
    <main className="px-4 py-12 sm:py-14">
      {schema ? <JsonLd id="smallpdf-alternative-schema" schema={schema} /> : null}
      <article className="mx-auto max-w-5xl space-y-8">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Compare", href: "/compare" },
            { label: "Best Smallpdf Alternative" },
          ]}
        />

        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Best Smallpdf Alternative - Private PDF Tools
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            If you are searching for a Smallpdf alternative, the real question is usually not just feature count.
            It is whether your workflow can stay fast while handling sensitive files with less transfer risk. Plain
            Tools focuses on local browser processing for core PDF operations, so merge, split, compress, convert, and
            related tasks can run without a mandatory upload step. That makes it easier to keep routine document work
            inside your own device context and verify behaviour directly in DevTools. Cloud-first tools can still be
            useful for account-led collaboration, but they introduce different operational assumptions around transfer,
            policy, and retention. This page gives a practical comparison framework so you can decide based on privacy
            requirements, workflow speed, and day-to-day usability rather than marketing claims.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick comparison table</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-card/35">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Criterion</th>
                  <th className="px-4 py-3 font-semibold">Plain Tools</th>
                  <th className="px-4 py-3 font-semibold">Typical upload-first alternative</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.plain}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.alternative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Privacy and workflow differences</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Plain Tools prioritises local execution for core tasks, which reduces transfer surface for day-to-day
            document processing. That is especially useful for internal policies where teams need predictable handling
            and quick verification. Cloud workflows may still fit scenarios where shared accounts and hosted routing
            are the top priority.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            In practice, the better choice depends on your constraint set: privacy-first local handling, or
            cloud-centric collaboration convenience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Verdict</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Choose Plain Tools when you want private, no-upload core workflows and straightforward in-browser
            verification. Choose cloud-first alternatives when your organisation depends on hosted account features and
            central cloud administration. For most sensitive document operations, local-first processing is the safer
            default starting point.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <RelatedLinks
          sections={[
            {
              title: "Related tools",
              links: [
                { label: "Compress PDF without uploading", href: "/tools/compress-pdf" },
                { label: "Merge PDF locally", href: "/tools/merge-pdf" },
                { label: "Run OCR PDF locally", href: "/tools/ocr-pdf" },
              ],
            },
            {
              title: "Related guides",
              links: [
                { label: "Why uploading PDFs can be risky", href: "/learn/why-pdf-uploads-are-risky" },
                { label: "No uploads explained", href: "/learn/no-uploads-explained" },
              ],
            },
            {
              title: "Related status pages",
              links: [{ label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" }],
            },
          ]}
        />

        <div className="text-sm text-muted-foreground">
          Want a broader comparison?{" "}
          <Link href="/compare/plain-tools-vs-smallpdf" className="font-medium text-accent hover:underline">
            See Plain Tools vs Smallpdf
          </Link>
          .
        </div>
      </article>
    </main>
  )
}


import type { ComponentType } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import CompressPdfTool from "@/components/tools/compress-pdf-tool"
import ExtractPdfTool from "@/components/tools/extract-pdf-tool"
import JpgToPdfTool from "@/components/tools/jpg-to-pdf-tool"
import MergePdfTool from "@/components/tools/merge-pdf-tool"
import PdfToJpgTool from "@/components/tools/pdf-to-jpg-tool"
import PdfToWordTool from "@/components/tools/pdf-to-word-tool"
import RotatePdfTool from "@/components/tools/rotate-pdf-tool"
import SplitPdfTool from "@/components/tools/split-pdf-tool"
import WordToPdfTool from "@/components/tools/word-to-pdf-tool"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { getPdfIntentPage, pdfIntentPathFor, type PdfIntentToolKey } from "@/lib/pdf-intent-pages"

type PdfIntentPageProps = {
  slug: string
}

const TOOL_COMPONENTS: Record<PdfIntentToolKey, ComponentType> = {
  "compress-pdf": CompressPdfTool,
  "merge-pdf": MergePdfTool,
  "pdf-to-word": PdfToWordTool,
  "word-to-pdf": WordToPdfTool,
  "split-pdf": SplitPdfTool,
  "rotate-pdf": RotatePdfTool,
  "extract-pdf": ExtractPdfTool,
  "pdf-to-jpg": PdfToJpgTool,
  "jpg-to-pdf": JpgToPdfTool,
}

export function PdfIntentPage({ slug }: PdfIntentPageProps) {
  const page = getPdfIntentPage(slug)
  if (!page) {
    notFound()
  }

  const ToolComponent = TOOL_COMPONENTS[page.toolKey]
  const route = pdfIntentPathFor(page.slug)
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.h1,
      description: page.metaDescription,
      url: `https://plain.tools${route}`,
    }),
    buildFaqPageSchema(page.faqs),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: page.h1, url: `https://plain.tools${route}` },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id={`pdf-intent-schema-${page.slug}`} schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: page.h1 },
            ]}
            className="mb-4"
          />

          <section className="max-w-4xl">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {page.h1}
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">{page.intro}</p>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tool Interface
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This page runs the same underlying workflow as{" "}
                  <Link href={page.canonicalToolHref} className="font-medium text-accent hover:underline">
                    {page.canonicalToolLabel}
                  </Link>
                  .
                </p>
              </div>
            </div>
            <ToolComponent />
          </section>

          <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How It Works</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              {page.howItWorks.map((step, index) => (
                <li key={step} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                  <span className="font-semibold text-foreground">{index + 1}. </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Why Use Local PDF Tools
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>
                Local PDF tools keep the core workflow inside your browser, which reduces exposure for private files and removes the usual upload delay. That matters when you are handling work documents, invoices, forms, statements, or drafts that should stay under your control until you decide to share the output.
              </p>
              <p>
                Browser-based processing is also more direct for many everyday tasks. You open the file, run the operation, and download the result without waiting for remote processing queues or handing the document to a third-party storage layer.
              </p>
              <p>
                If you want to inspect these claims yourself, review{" "}
                <Link href="/verify-claims" className="font-medium text-accent hover:underline">
                  Verify Claims
                </Link>
                . You can also read{" "}
                <Link href={page.learnLinks[0].href} className="font-medium text-accent hover:underline">
                  {page.learnLinks[0].label}
                </Link>{" "}
                and{" "}
                <Link href={page.learnLinks[1].href} className="font-medium text-accent hover:underline">
                  {page.learnLinks[1].label}
                </Link>{" "}
                for deeper technical context.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related Tools</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {page.relatedTools.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm font-medium text-accent transition-colors hover:border-accent/35 hover:text-accent/90"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <RelatedLinks
              heading="Learn more"
              sections={[
                { title: "Learn guides", links: page.learnLinks },
                { title: "Verification", links: [{ label: "Verify Claims", href: "/verify-claims" }] },
                { title: "Canonical tool", links: [{ label: page.canonicalToolLabel, href: page.canonicalToolHref }] },
              ]}
            />
          </div>

          <div className="mt-10">
            <FaqBlock faqs={page.faqs} />
          </div>
        </div>
      </main>
    </div>
  )
}

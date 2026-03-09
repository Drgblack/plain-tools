import type { ComponentType } from "react"
import Link from "next/link"

import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { VerifyLocalProcessing } from "@/components/verify-local-processing"
import AnnotatePdfTool from "@/components/tools/annotate-pdf-tool"
import ComparePdfTool from "@/components/tools/compare-pdf-tool"
import CompressPdfTool from "@/components/tools/compress-pdf-tool"
import ExtractPdfTool from "@/components/tools/extract-pdf-tool"
import FillPdfTool from "@/components/tools/fill-pdf-tool"
import HtmlToPdfTool from "@/components/tools/html-to-pdf-tool"
import JpgToPdfTool from "@/components/tools/jpg-to-pdf-tool"
import LocalSignerTool from "@/components/tools/local-signer-tool"
import MergePdfTool from "@/components/tools/merge-pdf-tool"
import OcrPdfTool from "@/components/tools/ocr-pdf-tool"
import OfflineOcrTool from "@/components/tools/ocr-tool"
import PdfToExcelTool from "@/components/tools/pdf-to-excel-tool"
import PdfToHtmlTool from "@/components/tools/pdf-to-html-tool"
import PdfToJpgTool from "@/components/tools/pdf-to-jpg-tool"
import PdfToMarkdownTool from "@/components/tools/pdf-to-markdown-tool"
import PdfToPptTool from "@/components/tools/pdf-to-ppt-tool"
import PdfToWordTool from "@/components/tools/pdf-to-word-tool"
import ProtectPdfTool from "@/components/tools/protect-pdf-tool"
import RotatePdfTool from "@/components/tools/rotate-pdf-tool"
import SignPdfTool from "@/components/tools/sign-pdf-tool"
import SplitPdfTool from "@/components/tools/split-pdf-tool"
import TextToPdfTool from "@/components/tools/text-to-pdf-tool"
import UnlockPdfTool from "@/components/tools/unlock-pdf-tool"
import WatermarkPdfTool from "@/components/tools/watermark-pdf-tool"
import WebgpuOrganiserTool from "@/components/tools/webgpu-organiser-tool"
import WordToPdfTool from "@/components/tools/word-to-pdf-tool"
import { buildCanonicalUrl } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { getToolBySlug } from "@/lib/tools-catalogue"

type IntentLink = {
  label: string
  href: string
}

type IntentFaq = {
  question: string
  answer: string
}

type ToolIntentPageProps = {
  slug: string
  title: string
  metaDescription: string
  toolSlug: string
  intro: string
  howItWorks: string[]
  limitations: string[]
  faq: IntentFaq[]
  relatedTools: IntentLink[]
  relatedGuides: IntentLink[]
}

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "annotate-pdf": AnnotatePdfTool,
  "compare-pdf": ComparePdfTool,
  "compress-pdf": CompressPdfTool,
  "extract-pdf": ExtractPdfTool,
  "fill-pdf": FillPdfTool,
  "html-to-pdf": HtmlToPdfTool,
  "jpg-to-pdf": JpgToPdfTool,
  "local-signer": LocalSignerTool,
  "merge-pdf": MergePdfTool,
  "ocr-pdf": OcrPdfTool,
  "offline-ocr": OfflineOcrTool,
  "pdf-to-excel": PdfToExcelTool,
  "pdf-to-html": PdfToHtmlTool,
  "pdf-to-jpg": PdfToJpgTool,
  "pdf-to-markdown": PdfToMarkdownTool,
  "pdf-to-ppt": PdfToPptTool,
  "pdf-to-word": PdfToWordTool,
  "protect-pdf": ProtectPdfTool,
  "reorder-pdf": WebgpuOrganiserTool,
  "rotate-pdf": RotatePdfTool,
  "sign-pdf": SignPdfTool,
  "split-pdf": SplitPdfTool,
  "text-to-pdf": TextToPdfTool,
  "unlock-pdf": UnlockPdfTool,
  "watermark-pdf": WatermarkPdfTool,
  "word-to-pdf": WordToPdfTool,
}

const VERIFY_LOCAL_PROCESSING_SLUGS = new Set([
  "compress-pdf-online",
  "merge-pdf-files",
  "convert-pdf-to-word",
  "jpg-to-pdf",
  "pdf-to-jpg",
])

function FallbackToolWorkspace() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
      The tool workspace for this page is not available yet. Use the canonical tool page instead.
    </div>
  )
}

export function ToolIntentPage({
  slug,
  title,
  metaDescription,
  toolSlug,
  intro,
  howItWorks,
  limitations,
  faq,
  relatedTools,
  relatedGuides,
}: ToolIntentPageProps) {
  const tool = getToolBySlug(toolSlug)
  const canonical = buildCanonicalUrl(`/${slug}`)
  const toolHref = `/tools/${toolSlug}`
  const ToolComponent = TOOL_COMPONENTS[toolSlug] ?? FallbackToolWorkspace
  const showVerifyLocalProcessing = VERIFY_LOCAL_PROCESSING_SLUGS.has(slug)
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: title,
      description: metaDescription,
      url: canonical,
    }),
    buildSoftwareApplicationSchema({
      name: title,
      description: metaDescription,
      url: canonical,
      featureList: [
        tool?.description ?? `${title} runs locally in your browser.`,
        "Core file handling stays on-device in local browser memory",
        "No upload step is required for the main workflow",
        "Download the processed output directly after review",
      ],
    }),
    buildHowToSchema(
      title,
      metaDescription,
      howItWorks.map((step, index) => ({
        name: `Step ${index + 1}`,
        text: step,
      }))
    ),
    buildFaqPageSchema(faq),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
      { name: title, url: canonical },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id={`tool-intent-schema-${slug}`} schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: title },
            ]}
            className="mb-4"
          />

          <section className="max-w-4xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                What this tool does
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {tool?.description ?? metaDescription}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                This landing page uses the same underlying workflow as{" "}
                <Link href={toolHref} className="font-medium text-accent hover:underline">
                  {tool?.name ?? "the canonical tool page"}
                </Link>
                . The core operation runs locally in your browser, so the file stays on your
                device during processing.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Step-by-step instructions
              </h2>
              <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {howItWorks.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-card text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tool workspace
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open the live tool here or jump to{" "}
                  <Link href={toolHref} className="font-medium text-accent hover:underline">
                    {tool?.name ?? "the canonical tool page"}
                  </Link>
                  .
                </p>
              </div>
            </div>
            <ToolComponent />
          </section>

          {showVerifyLocalProcessing ? (
            <VerifyLocalProcessing />
          ) : (
            <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Why Plain.tools is private
              </h2>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                  <h3 className="text-sm font-semibold text-foreground">No upload step</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The core file workflow on this page runs in your browser, so the document does
                    not need to be sent to a Plain.tools server to complete the task.
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Easy to verify</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    You can inspect browser network requests yourself while using the tool and confirm
                    whether file bytes are being transmitted.
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/60 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Built for task flow</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The aim is to let you finish a PDF job quickly without account friction, upload
                    queues, or hidden processing steps that are hard to audit.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Limitations and checks
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {limitations.map((item) => (
                <li key={item} className="rounded-xl border border-border/70 bg-background/60 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10">
            <FaqBlock faqs={faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              heading="Related tools and guides"
              sections={[
                { title: "Related tools", links: relatedTools },
                { title: "Related guides", links: relatedGuides },
                {
                  title: "Verification",
                  links: [
                    { label: "Verify claims", href: "/verify-claims" },
                    { label: "Browse all PDF tools", href: "/tools" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

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
import JpgToPdfTool from "@/components/tools/jpg-to-pdf-tool"
import MergePdfTool from "@/components/tools/merge-pdf-tool"
import OcrPdfTool from "@/components/tools/ocr-pdf-tool"
import PdfToExcelTool from "@/components/tools/pdf-to-excel-tool"
import PdfToJpgTool from "@/components/tools/pdf-to-jpg-tool"
import PdfToPptTool from "@/components/tools/pdf-to-ppt-tool"
import PdfToWordTool from "@/components/tools/pdf-to-word-tool"
import ProtectPdfTool from "@/components/tools/protect-pdf-tool"
import RotatePdfTool from "@/components/tools/rotate-pdf-tool"
import SignPdfTool from "@/components/tools/sign-pdf-tool"
import SplitPdfTool from "@/components/tools/split-pdf-tool"
import UnlockPdfTool from "@/components/tools/unlock-pdf-tool"
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

type ToolProblemFaq = {
  question: string
  answer: string
}

type ToolProblemPageProps = {
  toolSlug: string
  problemVariant: string
  slug: string
  title: string
  metaDescription: string
  h1: string
  introText: string
  howItWorks: string[]
  limitations: string[]
  faq: ToolProblemFaq[]
  relatedTools: string[]
  relatedGuides: string[]
}

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "annotate-pdf": AnnotatePdfTool,
  "compare-pdf": ComparePdfTool,
  "compress-pdf": CompressPdfTool,
  "extract-pdf": ExtractPdfTool,
  "fill-pdf": FillPdfTool,
  "jpg-to-pdf": JpgToPdfTool,
  "merge-pdf": MergePdfTool,
  "ocr-pdf": OcrPdfTool,
  "pdf-to-excel": PdfToExcelTool,
  "pdf-to-jpg": PdfToJpgTool,
  "pdf-to-ppt": PdfToPptTool,
  "pdf-to-word": PdfToWordTool,
  "protect-pdf": ProtectPdfTool,
  "reorder-pdf": WebgpuOrganiserTool,
  "rotate-pdf": RotatePdfTool,
  "sign-pdf": SignPdfTool,
  "split-pdf": SplitPdfTool,
  "unlock-pdf": UnlockPdfTool,
  "word-to-pdf": WordToPdfTool,
}

const GUIDE_LABELS: Record<string, string> = {
  "/learn/how-to-merge-pdfs-offline": "How to merge PDFs offline",
  "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files":
    "How to verify a PDF tool does not upload your files",
  "/learn/no-uploads-explained": "No uploads explained",
  "/learn/how-pdf-compression-works": "How PDF compression works",
  "/learn/why-offline-compression-has-limits": "Why offline compression has limits",
  "/learn/how-to-protect-a-pdf-with-a-password": "How to protect a PDF with a password",
  "/learn/how-to-sign-a-pdf-without-uploading-it": "How to sign a PDF without uploading it",
  "/learn/how-to-split-a-pdf-by-pages": "How to split a PDF by pages",
  "/learn/how-to-extract-pages-from-a-pdf": "How to extract pages from a PDF",
  "/learn/how-ocr-works-on-scanned-pdfs": "How OCR works on scanned PDFs",
  "/learn/ocr-pdf-without-cloud": "OCR PDF without cloud",
  "/learn/workflows/make-scanned-pdf-searchable-for-records":
    "Make scanned PDF searchable for records",
  "/learn/workflows/password-protect-pdf-before-emailing":
    "Password-protect PDF before emailing",
  "/learn/how-pdfs-work": "How PDFs work",
  "/learn/what-happens-when-you-upload-a-pdf": "What happens when you upload a PDF",
}

function formatGuideLabel(path: string) {
  return (
    GUIDE_LABELS[path] ??
    path
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ??
    path
  )
}

function getVariantSummary(problemVariant: string, toolName: string) {
  const summaries: Record<string, string> = {
    mac: `${toolName} on Mac should feel like a browser task, not a software-install chore. This route is written for people using Safari, Chrome, Edge, or Firefox on macOS who want to finish the job quickly without a native app or a server upload step.`,
    windows: `${toolName} on Windows is usually a quick browser job, but many people still end up in slow upload tools or office-suite prompts. This route keeps the task closer to the actual user need: open the page, process the document locally, and download the result.`,
    offline: `${toolName} is often needed when you are travelling, working on an unstable connection, or simply do not want to depend on an upload queue. This route focuses on a browser-first workflow that keeps the document on your device during the core task.`,
    secure: `${toolName} is often searched by people handling contracts, HR records, financial documents, or other files that should not be passed around casually. This page explains the privacy-first workflow clearly before you start the tool itself.`,
    "large-files": `Large-file workflows behave differently from quick one-page jobs. This route explains what to expect when your PDF is image-heavy, long, or memory-intensive so you can use the tool with realistic expectations and fewer failed attempts.`,
    scanned: `Scanned PDFs behave differently from digital-text PDFs because the pages are often image-based, heavier, and less flexible. This page explains that constraint up front and shows where the tool is useful and where OCR or extra cleanup may be needed.`,
    online: `${toolName} “online” usually means people want to start immediately in a browser tab. This page answers that intent directly while keeping the actual processing local for the core workflow.`,
    password: `${toolName} with a password focus usually comes from people trying to share or open documents more safely. This page keeps the explanation practical and avoids pretending the route does more than it really does.`,
    form: `${toolName} for form work is less about flashy features and more about finishing the task cleanly. This route is written for users who need editable fields, a clear export path, and a privacy-first explanation before they begin.`,
    pages: `${toolName} for page-level work is usually part of a larger document-cleanup job. This route explains the exact workflow so you can move through the task without bouncing between unrelated pages.`,
    searchable: `${toolName} for searchable output is a common records-management task. This route explains how local OCR and searchable output work, what the limits are, and how to check the result before relying on it.`,
    free: `${toolName} queries that include “free” usually mean the user wants a straightforward answer about access and limits. This page makes the workflow and expectations clear without turning the route into marketing filler.`,
    "no-upload": `${toolName} with a “no upload” angle is really a trust question. This route explains how the local browser workflow works, why that matters, and how to verify the claim with your own browser tools.`,
  }

  return (
    summaries[problemVariant] ??
    `${toolName} is most useful when you need a direct, privacy-first browser workflow for a specific document problem and want the constraints explained before you start.`
  )
}

function FallbackToolWorkspace() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
      The live tool for this route is not available yet. Open the main tool page instead.
    </div>
  )
}

export function ToolProblemPage({
  toolSlug,
  problemVariant,
  slug,
  title,
  metaDescription,
  h1,
  introText,
  howItWorks,
  limitations,
  faq,
  relatedTools,
  relatedGuides,
}: ToolProblemPageProps) {
  const tool = getToolBySlug(toolSlug)
  const canonical = buildCanonicalUrl(`/tools/${slug}`)
  const ToolComponent = TOOL_COMPONENTS[toolSlug] ?? FallbackToolWorkspace
  const toolHref = `/tools/${toolSlug}`
  const variantSummary = getVariantSummary(problemVariant, tool?.name ?? h1)
  const relatedToolLinks = relatedTools
    .map((slugValue) => {
      const relatedTool = getToolBySlug(slugValue)
      if (!relatedTool) return null
      return {
        label: relatedTool.name,
        href: `/tools/${relatedTool.slug}`,
      }
    })
    .filter(Boolean) as Array<{ label: string; href: string }>

  const relatedGuideLinks = relatedGuides.map((href) => ({
    label: formatGuideLabel(href),
    href,
  }))

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: title,
      description: metaDescription,
      url: canonical,
    }),
    buildSoftwareApplicationSchema({
      name: h1,
      description: metaDescription,
      url: canonical,
      featureList: [
        tool?.description ?? `${h1} runs in your browser for the core workflow.`,
        "Core file handling stays on your device during the main task",
        "No upload is required for the local processing path",
        "Download output directly after review",
      ],
    }),
    buildHowToSchema(
      `How to use ${h1}`,
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
      { name: h1, url: canonical },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id={`tool-problem-schema-${slug}`} schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: h1 },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {h1}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">{introText}</p>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                How it works locally
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {variantSummary}
              </p>
              <div className="mt-4 space-y-3">
                {howItWorks.map((step, index) => (
                  <article
                    key={step}
                    className="rounded-xl border border-border/70 bg-background/60 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                When this route is useful
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use this page when the intent is more specific than the generic tool route. People
                searching for “{h1.toLowerCase()}” usually want the task explained in plain language
                before they touch the interface.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The tool below is the same live workflow used on the canonical tool page, but this
                route gives more context about fit, privacy, and the practical checks worth doing
                after the output is generated.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If your job changes mid-flow, you can move to{" "}
                <Link href={toolHref} className="font-medium text-accent hover:underline">
                  {tool?.name ?? "the main tool page"}
                </Link>{" "}
                or a related workflow without losing the privacy-first structure.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Tool workspace
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start the task here or open{" "}
                <Link href={toolHref} className="font-medium text-accent hover:underline">
                  the canonical tool page
                </Link>
                .
              </p>
            </div>
            <ToolComponent />
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Step-by-step guide using {tool?.name ?? "the tool"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The safest way to use this workflow is to start with the smallest useful file set,
              review the output once, and only then share or archive the result. That keeps the
              task practical and makes it easier to spot any formatting or content issue before the
              file leaves your control.
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {howItWorks.map((step, index) => (
                <li key={`${slug}-guide-${index}`} className="rounded-xl border border-border/70 bg-background/60 p-4">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-card text-xs font-semibold text-foreground">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <VerifyLocalProcessing />

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Limitations and caveats
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Privacy-first does not mean magic. Local processing is useful because it removes the
              upload step for the core task, but output quality, browser memory, source formatting,
              and document complexity still shape what the result looks like in practice.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {limitations.map((item) => (
                <li key={item} className="rounded-xl border border-border/70 bg-background/60 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              What to check before you move on
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Review the output for page order, formatting, searchability, image quality, or field
              behaviour depending on the workflow you ran. If the result is good, download and
              share it. If not, adjust settings and rerun while the file is still local and easy to
              inspect.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For highly sensitive files, use the verification links below to confirm the no-upload
              claim yourself with browser network tools rather than taking any privacy promise on
              faith.
            </p>
          </section>

          <div className="mt-10">
            <FaqBlock faqs={faq} />
          </div>

          <div className="mt-10">
            <RelatedLinks
              heading="Related tools and guides"
              sections={[
                { title: "Related tools", links: relatedToolLinks },
                { title: "Related guides", links: relatedGuideLinks },
                {
                  title: "Trust and navigation",
                  links: [
                    { label: "Verify claims", href: "/verify-claims" },
                    { label: "Browse all tools", href: "/tools" },
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

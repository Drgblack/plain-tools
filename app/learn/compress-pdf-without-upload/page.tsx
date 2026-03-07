import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Compress a PDF Without Uploading It",
  description:
    "Learn how to compress a PDF without uploading it using local browser tools, practical settings, and privacy-first workflow checks.",
  path: "/learn/compress-pdf-without-upload",
  image: "/og/learn.png",
})

const faqs = [
  {
    question: "Can I compress a PDF privately without uploading?",
    answer:
      "Yes. Use a local browser workflow where the compression engine runs in your device memory instead of sending file content to a server.",
  },
  {
    question: "Will compression always keep perfect quality?",
    answer:
      "Not always. Strong compression can reduce visual fidelity, so you should review readability and file appearance before sharing.",
  },
  {
    question: "Why can uploading PDFs be risky?",
    answer:
      "Uploads introduce transfer and storage exposure. For sensitive documents, local processing reduces that risk surface.",
  },
]

const howToSteps = [
  {
    name: "Open a local PDF compression tool",
    text: "Use a browser tool that clearly states local processing and no upload requirement for core workflows.",
  },
  {
    name: "Select your PDF and choose compression level",
    text: "Start with light or medium compression, then increase strength only if file size remains too large.",
  },
  {
    name: "Run compression and download output",
    text: "Process the file locally, download the output, and keep the original unchanged for reference.",
  },
  {
    name: "Validate quality and readability",
    text: "Check text clarity, image detail, page order, and form elements before sending the file.",
  },
]

const schema = combineJsonLd([
  buildArticleSchema({
    headline: "How to Compress a PDF Without Uploading It",
    description:
      "Step-by-step guide to local PDF compression with privacy-first handling and practical quality checks.",
    url: "https://plain.tools/learn/compress-pdf-without-upload",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Learn", url: "https://plain.tools/learn" },
    {
      name: "How to Compress a PDF Without Uploading It",
      url: "https://plain.tools/learn/compress-pdf-without-upload",
    },
  ]),
  buildHowToSchema(
    "How to compress a PDF without uploading it",
    "A practical local-first workflow for PDF compression with privacy and quality checks.",
    howToSteps
  ),
  buildFaqPageSchema(faqs),
])

export default function CompressPdfWithoutUploadPage() {
  return (
    <main className="px-4 py-12 sm:py-14">
      {schema ? <JsonLd id="learn-compress-without-upload-schema" schema={schema} /> : null}

      <article className="mx-auto max-w-5xl space-y-8">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: "How to Compress a PDF Without Uploading It" },
          ]}
        />

        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How to Compress a PDF Without Uploading It
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            If you need smaller PDF files but cannot risk sending sensitive content to third-party servers, use a
            local compression workflow in your browser. This approach keeps file bytes on your device and removes the
            upload step for core processing tasks. It is especially useful for contracts, legal paperwork, internal
            finance documents, and HR files where transfer exposure should be minimised. The process is straightforward:
            choose a local tool, select compression level, run optimisation, then validate output quality before
            sharing. The key point is practical balance. Over-aggressive compression can damage readability, while very
            light compression may not reduce size enough for portals or email limits. This guide shows a repeatable
            method that prioritises privacy first, then output quality, so you can compress confidently without relying
            on random upload-based utilities.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Why avoid uploads for compression</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload-based compression tools can be convenient, but they add transfer and possible retention surfaces for
            sensitive files. Local processing does not make risk zero, but it removes a major external handling step
            and gives you direct visibility into what the browser is doing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Step-by-step workflow</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {howToSteps.map((step) => (
              <li key={step.name}>
                <span className="font-medium text-foreground">{step.name}:</span> {step.text}
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">What to expect</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Image-heavy PDFs usually shrink more than text-heavy PDFs.</li>
            <li>Strong compression can reduce visual quality and, in some modes, flatten text layers.</li>
            <li>Always keep the original file so you can retry with different settings.</li>
          </ul>
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
                { label: "Split PDF by pages", href: "/tools/split-pdf" },
              ],
            },
            {
              title: "Related guides",
              links: [
                { label: "Why PDF uploads are risky", href: "/learn/why-pdf-uploads-are-risky" },
                { label: "No uploads explained", href: "/learn/no-uploads-explained" },
              ],
            },
            {
              title: "Related status pages",
              links: [{ label: "Check whether youtube.com is down", href: "/status/youtube.com" }],
            },
          ]}
        />
      </article>
    </main>
  )
}


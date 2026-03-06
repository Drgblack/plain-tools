import type { Metadata } from "next"
import Link from "next/link"
import { Gauge, HardDrive, Lock, Radio, SearchCheck, Server, Shield, Wifi, Globe } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { ToolsSection } from "@/components/tools-section"
import { ProofStrip } from "@/components/proof-strip"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { TOOL_CATALOGUE } from "@/lib/tools-catalogue"

export const metadata: Metadata = buildPageMetadata({
  title: "PDF Tools",
  description:
    "Browse Plain Tools PDF workflows for merge, split, compress, convert, OCR, and signing. Core tools run in your browser with no upload step.",
  path: "/tools",
  image: "/og/tools.png",
})

export default function ToolsPage() {
  const popularTools = [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "PDF to Word", href: "/tools/pdf-to-word" },
    { label: "Word to PDF", href: "/tools/word-to-pdf" },
    { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    { label: "Sign PDF", href: "/tools/sign-pdf" },
  ]

  const groupedLinks = [
    {
      title: "Convert",
      links: [
        { label: "PDF to Word", href: "/tools/pdf-to-word" },
        { label: "Word to PDF", href: "/tools/word-to-pdf" },
        { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
        { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
      ],
    },
    {
      title: "Organise",
      links: [
        { label: "Merge PDF", href: "/tools/merge-pdf" },
        { label: "Split PDF", href: "/tools/split-pdf" },
        { label: "Reorder PDF", href: "/tools/reorder-pdf" },
        { label: "Extract PDF", href: "/tools/extract-pdf" },
      ],
    },
    {
      title: "Secure",
      links: [
        { label: "Sign PDF", href: "/tools/sign-pdf" },
        { label: "Protect PDF", href: "/tools/protect-pdf" },
        { label: "Unlock PDF", href: "/tools/unlock-pdf" },
        { label: "Metadata Purge", href: "/tools/metadata-purge" },
      ],
    },
    {
      title: "Optimise and OCR",
      links: [
        { label: "Compress PDF", href: "/tools/compress-pdf" },
        { label: "Compression Preview", href: "/tools/compression-preview" },
        { label: "OCR PDF", href: "/tools/ocr-pdf" },
        { label: "Offline OCR", href: "/tools/offline-ocr" },
      ],
    },
  ]

  const networkDiagnostics = [
    {
      label: "Site Status Checker",
      description: "Check if a domain is currently up or down with live response timing.",
      href: "/site-status",
      icon: Wifi,
      group: "Status",
    },
    {
      label: "DNS Lookup",
      description: "Inspect A, AAAA, MX, TXT, NS, and CNAME records for any domain.",
      href: "/dns-lookup",
      icon: Server,
      group: "DNS",
    },
    {
      label: "What is My IP",
      description: "View your current public IP and basic routing context.",
      href: "/what-is-my-ip",
      icon: Globe,
      group: "IP",
    },
    {
      label: "Ping Test",
      description: "Measure endpoint latency to troubleshoot reachability and speed.",
      href: "/ping-test",
      icon: Radio,
      group: "Latency",
    },
  ]

  const crawlableToolSlugs = [
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "pdf-to-word",
    "word-to-pdf",
    "jpg-to-pdf",
    "pdf-to-jpg",
    "pdf-to-excel",
    "pdf-to-ppt",
    "sign-pdf",
    "protect-pdf",
    "unlock-pdf",
    "ocr-pdf",
  ] as const

  const crawlableToolDirectory = crawlableToolSlugs
    .map((slug) => TOOL_CATALOGUE.find((tool) => tool.slug === slug && tool.available))
    .filter((tool): tool is NonNullable<(typeof TOOL_CATALOGUE)[number]> => Boolean(tool))

  const toolsProofPoints = [
    {
      icon: HardDrive,
      title: "Local processing",
      detail: "Core PDF operations run in your browser on your device.",
    },
    {
      icon: Shield,
      title: "No uploads for core tools",
      detail: "No file transfer step for local workflows in this catalogue.",
    },
    {
      icon: Lock,
      title: "Sensitive-file friendly",
      detail: "Designed for practical workflows where document control matters.",
    },
    {
      icon: SearchCheck,
      title: "Verifiable behaviour",
      detail: "Network inspection can validate no-upload processing claims.",
    },
    {
      icon: Gauge,
      title: "Fast workflow",
      detail: "Open a tool and process immediately without upload queue delays.",
    },
  ]

  const subtleCtas = [
    { label: "Verify claims", href: "/verify-claims" },
    { label: "Read practical guides", href: "/learn" },
    { label: "Compare alternatives", href: "/compare" },
  ]

  const relatedGuides = [
    {
      label: "Compress PDF without losing quality",
      href: "/learn/compress-pdf-without-losing-quality",
      description: "Practical steps for balancing PDF size reduction and readable output.",
    },
    {
      label: "How to verify a PDF tool does not upload your files",
      href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      description: "Use DevTools and repeatable checks to validate local processing claims.",
    },
    {
      label: "No uploads explained",
      href: "/learn/no-uploads-explained",
      description: "Understand what no-upload processing means in real browser workflows.",
    },
    {
      label: "How to merge PDFs offline",
      href: "/learn/how-to-merge-pdfs-offline",
      description: "A straightforward merge workflow for sensitive document handling.",
    },
  ]

  const toolsHubSchema = combineJsonLd([
    buildWebPageSchema({
      name: "Plain Tools PDF hub",
      description:
        "Browse practical PDF workflows for merge, split, compress, conversion, OCR, and secure handling with local processing.",
      url: "https://plain.tools/tools",
    }),
    buildCollectionPageSchema({
      name: "Plain Tools PDF Hub",
      description:
        "Collection of privacy-first PDF tools that run in your browser with local processing and no uploads.",
      url: "https://plain.tools/tools",
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Tools", url: "https://plain.tools/tools" },
    ]),
    buildWebApplicationSchema({
      name: "Plain Tools PDF Hub",
      description:
        "Browser-based PDF processing tools for conversion, organisation, OCR, and secure document workflows.",
      url: "https://plain.tools/tools",
      featureList: [
        "Core tools process files locally in your browser",
        "No file upload step for local workflows",
        "Practical options for conversion, optimisation, and signing",
      ],
    }),
    buildItemListSchema(
      "Major Plain Tools",
      crawlableToolDirectory.map((tool) => ({
        name: tool.name,
        description: tool.description,
        url: `https://plain.tools/tools/${tool.slug}`,
      })),
      "https://plain.tools/tools"
    ),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {toolsHubSchema ? (
        <JsonLd id="tools-hub-schema" schema={toolsHubSchema} />
      ) : null}
      <main className="flex-1">
        <section className="border-b border-border px-4 py-14 md:py-16">
          <div className="mx-auto max-w-6xl space-y-4">
            <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              PDF tools for sensitive workflows
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is the PDF category inside Plain Tools. Use practical workflows for conversion,
              organisation, signing, and privacy checks. Core local tools process files in-browser
              with no upload step.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="/network-tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Network tools
              </Link>
              <Link href="/site-status" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Site status checker
              </Link>
              <Link href="/file-tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                File tools
              </Link>
            </div>
            <h2 className="text-sm font-semibold text-foreground">Popular PDF tools</h2>
            <div className="flex flex-wrap gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
            <form action="/tools" method="get" className="mt-4 rounded-xl border border-border/70 bg-card/35 p-4">
              <label htmlFor="tool-search-hint" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Find a tool quickly
              </label>
              <input
                id="tool-search-hint"
                name="q"
                type="search"
                placeholder="Search by task, for example merge, split, OCR"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Press <kbd className="rounded border border-border px-1 py-0.5">Ctrl</kbd>/<kbd className="rounded border border-border px-1 py-0.5">Cmd</kbd> + <kbd className="rounded border border-border px-1 py-0.5">K</kbd> for command search.
              </p>
            </form>
          </div>
        </section>

        <section className="border-b border-border px-4 py-6 md:py-8">
          <div className="mx-auto max-w-6xl">
            <ProofStrip points={toolsProofPoints} />
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Browse by workflow</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {groupedLinks.map((group) => (
                <div key={group.title} className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs text-muted-foreground transition hover:text-accent hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Network diagnostics</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Plain Tools also includes a network diagnostics category for uptime checks, DNS inspection, and connectivity triage.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {networkDiagnostics.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition hover:border-accent/40"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {tool.group}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground transition group-hover:text-accent">
                      {tool.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {tool.description}
                    </p>
                    <span className="mt-3 inline-flex text-xs font-medium text-accent group-hover:underline">
                      Open tool
                    </span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/status/chatgpt.com" className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Example: chatgpt.com status
              </Link>
              <Link href="/status/reddit.com" className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Example: reddit.com status
              </Link>
              <Link href="/network-tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Open network tools hub
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Tool directory</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              This server-rendered list keeps core tools visible and crawlable. All links below are
              standard anchors to individual tool pages.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {crawlableToolDirectory.map((tool) => (
                <li key={tool.slug} className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    <Link href={`/tools/${tool.slug}`} className="hover:text-accent hover:underline">
                      {tool.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="mt-3 inline-flex text-xs font-medium text-accent hover:underline"
                  >
                    Open tool
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Related guides</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Use these practical guides to choose the right tool settings, verify local processing,
              and avoid common PDF workflow mistakes.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <li key={guide.href} className="rounded-lg border border-border bg-card/40 p-4">
                  <Link href={guide.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                    {guide.label}
                  </Link>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{guide.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ToolsSection />

        <section className="border-t border-border px-4 py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
            {subtleCtas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}


import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Radio, Server, Wifi } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolCard } from "@/components/tool-card"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Network tools",
  description:
    "Browser-run network diagnostics for IP, DNS, site status, and latency. Requests go directly to the target endpoint or public API you choose.",
  path: "/network-tools",
  image: "/og/default.png",
})

const networkTools = [
  {
    name: "What is My IP",
    description: "View your public IP and browser-reported connection context with a direct public endpoint request.",
    href: "/tools/what-is-my-ip",
    tags: ["IP", "Client-side"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query Cloudflare DNS-over-HTTPS for A, AAAA, and MX records without a Plain Tools proxy.",
    href: "/tools/dns-lookup",
    tags: ["DNS", "DoH"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Site Status Checker",
    description: "Run a direct browser HEAD check and review status code plus response timing.",
    href: "/tools/site-status-checker",
    tags: ["Status", "HEAD"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test / Latency",
    description: "Measure WebSocket connect and echo timing through public echo endpoints from your browser.",
    href: "/tools/ping-test",
    tags: ["Latency", "WebSocket"],
    icon: <Radio className="h-4 w-4" />,
  },
]

const networkToolsSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Network Tools - Plain Tools",
    description:
      "Network diagnostics hub for IP lookup, DNS checks, uptime status, and latency testing.",
    url: "https://plain.tools/network-tools",
  }),
  buildCollectionPageSchema({
    name: "Network Tools",
    description:
      "Collection of practical network diagnostics tools for status checks, DNS inspection, and IP visibility.",
    url: "https://plain.tools/network-tools",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Network Tools", url: "https://plain.tools/network-tools" },
  ]),
  buildItemListSchema(
    "Network diagnostics tools",
    networkTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      url: `https://plain.tools${tool.href}`,
    })),
    "https://plain.tools/network-tools"
  ),
])

export default function NetworkToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {networkToolsSchema ? <JsonLd id="network-tools-schema" schema={networkToolsSchema} /> : null}
      <main className="flex-1">
        <section className="border-b border-border px-4 py-14 md:py-16">
          <div className="mx-auto max-w-6xl space-y-4">
            <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Network Tools" }]} />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Network Tools
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Use this hub to reach the network checks that sit alongside the PDF catalogue:
              public IP lookup, DNS-over-HTTPS inspection, browser-side status checks, and
              WebSocket latency measurement. These tools do not upload documents or require an
              account, but they do contact the target endpoint or public API needed for the check.
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Start here when you need quick diagnostics before escalating: verify resolver output,
              confirm what public IP is exposed, test whether a URL answers a HEAD request, or
              compare WebSocket latency across public echo endpoints.
            </p>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Available network diagnostics</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {networkTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  tags={tool.tags}
                  icon={tool.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">How to use this hub</h2>
            <ol className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <li className="rounded-lg border border-border bg-card/40 p-4">
                <span className="block font-medium text-foreground">1. Pick a check</span>
                Start with IP, DNS, status, or latency based on the issue you are troubleshooting.
              </li>
              <li className="rounded-lg border border-border bg-card/40 p-4">
                <span className="block font-medium text-foreground">2. Enter your domain or host</span>
                Use a clean hostname like <code>example.com</code>, a full URL for HEAD checks, or a WebSocket endpoint for latency tests.
              </li>
              <li className="rounded-lg border border-border bg-card/40 p-4">
                <span className="block font-medium text-foreground">3. Verify and retry</span>
                Run checks again to confirm transient failures and compare against a known healthy site.
              </li>
            </ol>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Privacy model for network checks</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">No document uploads</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  These are network diagnostics, not file tools. Nothing here uploads PDFs or local files.
                </p>
              </article>
              <article className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Direct endpoint requests</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Checks run from your browser against the public IP, DNS, HTTP, or WebSocket endpoint required for the result.
                </p>
              </article>
              <article className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">Honest limitations</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Browser CORS rules and endpoint policies can block some checks. When that happens, the tool reports the limitation instead of inventing a result.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Common status checks</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link href="/status/chatgpt.com" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Check whether chatgpt.com is down
              </Link>
              <Link href="/status/reddit.com" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Check whether reddit.com is down
              </Link>
              <Link href="/status/discord.com" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Check whether discord.com is down
              </Link>
              <Link href="/tools/site-status-checker" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Open browser HEAD checker
              </Link>
              <Link href="/tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Browse PDF and file tools
              </Link>
              <Link href="/status/trending" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                View trending status checks
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}


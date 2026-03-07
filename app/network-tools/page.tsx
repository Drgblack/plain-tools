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
    "Run practical network diagnostics for IP lookup, DNS records, uptime checks, and latency testing. Fast browser workflows with clear results on Plain Tools.",
  path: "/network-tools",
  image: "/og/default.png",
})

const networkTools = [
  {
    name: "What is My IP",
    description: "View your public IP and basic browser-reported connection context instantly.",
    href: "/what-is-my-ip",
    tags: ["IP", "Diagnostics"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query A, AAAA, MX, TXT, NS, and CNAME records for a domain in seconds.",
    href: "/dns-lookup",
    tags: ["DNS", "Records"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Site Status Checker",
    description: "Check if a website is up or down with response code, response time, and retry checks.",
    href: "/site-status",
    tags: ["Status", "Uptime"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test / Latency",
    description: "Measure endpoint latency to troubleshoot connectivity and performance issues quickly.",
    href: "/ping-test",
    tags: ["Latency", "RTT"],
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
              Client-side network diagnostics - no data sent to servers. Use this hub to check
              public IP, inspect DNS records, test website availability, and measure latency.
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These tools are built for practical troubleshooting: confirm if a site is down,
              inspect domain records, and gather fast network context without signing in.
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
                Use a clean hostname like <code>example.com</code> for clearer and more stable results.
              </li>
              <li className="rounded-lg border border-border bg-card/40 p-4">
                <span className="block font-medium text-foreground">3. Verify and retry</span>
                Run checks again to confirm transient failures and compare against a known healthy site.
              </li>
            </ol>
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
              <Link href="/tools" className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:border-accent/40 hover:text-accent">
                Browse PDF and file tools
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

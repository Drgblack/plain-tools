import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import type { StatusLandingPageConfig } from "@/lib/status-landing-pages"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

import { StatusDynamicClient } from "./[site]/client"

export function buildStatusLandingMetadata(page: StatusLandingPageConfig): Metadata {
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/status/${page.slug}`,
    image: "/og/default.png",
  })
}

type StatusLandingPageTemplateProps = {
  page: StatusLandingPageConfig
}

const RELATED_TOOLS = [
  { label: "Run DNS lookup for this domain", href: "/dns-lookup" },
  { label: "Measure latency with ping test", href: "/ping-test" },
  { label: "Check your current public IP", href: "/what-is-my-ip" },
]

const RELATED_GUIDES = [
  {
    label: "How to check if a website is down",
    href: "/learn/is-it-down-for-everyone-or-just-me",
  },
  {
    label: "What response time means in an uptime check",
    href: "/learn/what-response-time-means-in-uptime-check",
  },
]

export function StatusLandingPageTemplate({ page }: StatusLandingPageTemplateProps) {
  const pageUrl = `https://plain.tools/status/${page.slug}`
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: pageUrl,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Network Tools", url: "https://plain.tools/network-tools" },
      { name: "Site Status", url: "https://plain.tools/site-status" },
      { name: page.title, url: pageUrl },
    ]),
    buildHowToSchema(
      `How to check whether ${page.domain} is down`,
      `Practical local-versus-global troubleshooting steps for ${page.domain} outages.`,
      page.troubleshootingSteps.map((step, index) => ({
        name: `Step ${index + 1}`,
        text: step,
      }))
    ),
    buildFaqPageSchema(page.faqs),
    buildItemListSchema(
      `Related status checks for ${page.domain}`,
      page.relatedStatuses.map((slug) => ({
        name: `Is ${slug} down right now?`,
        url: `https://plain.tools/status/${slug}`,
      })),
      pageUrl
    ),
  ])

  return (
    <main className="px-4 py-12 md:py-14">
      {schema ? <JsonLd id={`status-landing-schema-${page.slug}`} schema={schema} /> : null}

      <article className="mx-auto max-w-6xl space-y-8">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Site Status", href: "/site-status" },
            { label: page.title },
          ]}
        />

        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <p className="max-w-5xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {page.intro}
          </p>
        </header>

        <section className="rounded-xl border border-border/70 bg-card/45 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Live status check for {page.domain}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The panel below includes the current signal, response time, and last checked timestamp.
          </p>
          <div className="mt-4">
            <StatusDynamicClient site={page.domain} siteName={page.domain} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Common outage patterns</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {page.outageTypes.map((item) => (
              <article key={item.title} className="rounded-lg border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Troubleshooting steps
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {page.troubleshootingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <div className="flex flex-wrap gap-2">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related guides</h2>
          <div className="flex flex-wrap gap-2">
            {RELATED_GUIDES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Related status pages</h2>
          <div className="flex flex-wrap gap-2">
            {page.relatedStatuses.map((slug) => (
              <Link
                key={slug}
                href={`/status/${slug}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                Is {slug} down right now?
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-border/70 bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}

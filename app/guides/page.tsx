import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import { getProfessionalWorkflowIndustryHubs } from "@/lib/professional-workflows-expanded"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Professional PDF workflow guides",
  description:
    "Browse industry-specific PDF workflow guides for legal, finance, HR, healthcare, operations, and regulated document handoffs on Plain Tools.",
  path: "/guides",
  image: "/og/tools.png",
  type: "article",
})

const industryHubs = getProfessionalWorkflowIndustryHubs()

const schema = combineJsonLd([
  buildWebPageSchema({
    name: "Professional PDF workflow guides",
    description:
      "Industry-specific workflow hubs that connect high-intent professional guide pages with the matching local PDF tools.",
    url: "https://plain.tools/guides",
  }),
  buildCollectionPageSchema({
    name: "Professional PDF workflow guides",
    description:
      "Cluster hubs for legal, finance, HR, healthcare, real-estate, and operations PDF workflows.",
    url: "https://plain.tools/guides",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Guides", url: "https://plain.tools/guides" },
  ]),
  buildItemListSchema(
    "Industry workflow hubs",
    industryHubs.map((hub) => ({
      name: hub.label,
      description: hub.description,
      url: `https://plain.tools${hub.canonicalPath}`,
    })),
    "https://plain.tools/guides"
  ),
])

export default function GuidesHubPage() {
  return (
    <main className="px-4 py-12 sm:py-16">
      {schema ? <JsonLd id="guides-hub-schema" schema={schema} /> : null}
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Professional PDF workflow guides
          </h1>
          <p className="max-w-4xl text-base leading-relaxed text-muted-foreground">
            This hub groups professional workflow pages by industry so users and crawlers can move
            from a high-level cluster into the exact task page, then into the matching local tool.
            It is designed to shorten click depth for legal, finance, HR, healthcare, operations,
            and other document-heavy teams.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industryHubs.map((hub) => (
            <article
              key={hub.slug}
              className="rounded-2xl border border-border/70 bg-card/45 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{hub.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {hub.description}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {hub.workflowCount} workflows
              </p>
              <ul className="mt-4 space-y-2">
                {hub.featuredWorkflows.slice(0, 4).map((workflow) => (
                  <li key={workflow.href}>
                    <Link href={workflow.href} className="text-sm font-medium text-accent hover:underline">
                      {workflow.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={hub.canonicalPath}
                className="mt-4 inline-flex text-sm font-medium text-accent transition hover:underline"
              >
                Browse {hub.label.toLowerCase()} guides
              </Link>
            </article>
          ))}
        </section>

        <RelatedLinks
          heading="Continue to adjacent hubs"
          sections={[
            {
              title: "Core tool hubs",
              links: [
                { label: "Browse all PDF tools", href: "/tools" },
                { label: "Browse file conversion hubs", href: "/file-converters" },
                { label: "Browse status and uptime hubs", href: "/status" },
              ],
            },
            {
              title: "Support content",
              links: [
                { label: "Browse learn guides", href: "/learn" },
                { label: "Compare privacy-first alternatives", href: "/compare" },
                { label: "Verify local-processing claims", href: "/verify-claims" },
              ],
            },
          ]}
        />
      </div>
    </main>
  )
}

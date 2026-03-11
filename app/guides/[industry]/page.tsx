import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  getProfessionalWorkflowIndustryHub,
  getProfessionalWorkflowIndustryHubs,
} from "@/lib/professional-workflows-expanded"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type PageProps = {
  params: Promise<{ industry: string }>
}

export const revalidate = 86400

export function generateStaticParams() {
  return getProfessionalWorkflowIndustryHubs().map((hub) => ({ industry: hub.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params
  const hub = getProfessionalWorkflowIndustryHub(industry)

  if (!hub) {
    return buildPageMetadata({
      title: "Professional workflow hub not found",
      description:
        "The requested professional workflow hub is not available. Browse Plain Tools guides, tools, and comparisons instead.",
      path: "/guides",
      image: "/og/tools.png",
      type: "article",
    })
  }

  return buildPageMetadata({
    title: `${hub.label} PDF workflow guides`,
    description: hub.description,
    path: hub.canonicalPath,
    image: "/og/tools.png",
    type: "article",
  })
}

export default async function IndustryGuidesHubPage({ params }: PageProps) {
  const { industry } = await params
  const hub = getProfessionalWorkflowIndustryHub(industry)

  if (!hub) {
    notFound()
  }

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `${hub.label} PDF workflow guides`,
      description: hub.description,
      url: `https://plain.tools${hub.canonicalPath}`,
    }),
    buildCollectionPageSchema({
      name: `${hub.label} PDF workflow guides`,
      description: hub.description,
      url: `https://plain.tools${hub.canonicalPath}`,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Guides", url: "https://plain.tools/guides" },
      { name: hub.label, url: `https://plain.tools${hub.canonicalPath}` },
    ]),
    buildItemListSchema(
      `${hub.label} workflow pages`,
      hub.featuredWorkflows.map((workflow) => ({
        name: workflow.title,
        description: workflow.description,
        url: `https://plain.tools${workflow.href}`,
      })),
      `https://plain.tools${hub.canonicalPath}`
    ),
  ])

  return (
    <main className="px-4 py-12 sm:py-16">
      {schema ? <JsonLd id={`guides-industry-schema-${hub.slug}`} schema={schema} /> : null}
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: hub.label },
            ]}
          />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {hub.label} PDF workflow guides
          </h1>
          <p className="max-w-4xl text-base leading-relaxed text-muted-foreground">
            {hub.description}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {hub.featuredWorkflows.map((workflow) => (
            <article
              key={workflow.href}
              className="rounded-2xl border border-border/70 bg-card/45 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {workflow.toolName}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                <Link href={workflow.href} className="hover:text-accent">
                  {workflow.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {workflow.description}
              </p>
              <Link
                href={workflow.href}
                className="mt-4 inline-flex text-sm font-medium text-accent transition hover:underline"
              >
                Open this workflow guide
              </Link>
            </article>
          ))}
        </section>

        <RelatedLinks
          heading="Continue with tools and adjacent hubs"
          sections={[
            {
              title: "Matching tools",
              links: hub.relatedToolLinks,
            },
            {
              title: "Adjacent hubs",
              links: [
                { label: "Browse all professional guides", href: "/guides" },
                { label: "Browse learn guides", href: "/learn" },
                { label: "Read the closest comparison", href: hub.comparePath },
              ],
            },
          ]}
        />
      </div>
    </main>
  )
}

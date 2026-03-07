import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Gauge, Users } from "lucide-react"

import { ArticleLayout } from "@/components/seo/article-layout"
import { CompareFrameworkBlock } from "@/components/seo/compare-framework-block"
import { FaqBlock } from "@/components/seo/faq-block"
import { RelatedLinks } from "@/components/seo/related-links"
import { TrustBox } from "@/components/seo/trust-box"
import { getCompareSeoLinks } from "@/lib/seo/tranche1-link-map"
import type { TrancheComparePage } from "@/lib/seo/tranche1-content"
import { getToolBySlug } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"

export function buildComparePageMetadata(page: TrancheComparePage): Metadata {
  const canonical = `${BASE_URL}/compare/${page.slug}`
  const title = page.metaTitle.replace("Plain.tools", "Plain Tools")
  return {
    title,
    description: page.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: page.metaDescription,
      url: canonical,
      type: "article",
      images: [
        {
          url: "/og/compare.png",
          width: 1200,
          height: 630,
          alt: `${page.title} comparison`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.metaDescription,
      images: ["/og/compare.png"],
    },
  }
}

function buildCompareSchema(page: TrancheComparePage) {
  const toolSchemas = page.toolHrefs
    .map((href) => {
      const slug = href.replace("/tools/", "")
      const tool = getToolBySlug(slug)
      if (!tool) return null
      return {
        "@type": ["SoftwareApplication", "WebApplication"],
        name: tool.name,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any - web browser",
        isAccessibleForFree: true,
        url: `${BASE_URL}${href}`,
      }
    })
    .filter(Boolean)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.metaDescription,
        author: {
          "@type": "Organization",
          name: "Plain Team",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/compare/${page.slug}`,
        },
        url: `${BASE_URL}/compare/${page.slug}`,
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE_URL}/compare` },
          {
            "@type": "ListItem",
            position: 3,
            name: page.title,
            item: `${BASE_URL}/compare/${page.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      ...toolSchemas,
    ],
  }
}

type ComparePageTemplateProps = {
  page: TrancheComparePage
}

export function ComparePageTemplate({ page }: ComparePageTemplateProps) {
  const schema = buildCompareSchema(page)
  const links = getCompareSeoLinks(page.slug)
  const toolLinks =
    links?.relatedTools.length
      ? links.relatedTools
      : page.toolHrefs.map((href) => ({
          label: `Use ${getToolBySlug(href.replace("/tools/", ""))?.name ?? href.replace("/tools/", "").replace(/-/g, " ")} locally`,
          href,
        }))
  const uploadRow = page.comparisonRows.find((row) =>
    row.feature.toLowerCase().includes("upload")
  )

  return (
    <ArticleLayout
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Compare", href: "/compare" },
        { label: page.title, href: `/compare/${page.slug}` },
      ]}
      jsonLd={schema}
      disclaimer={page.disclaimer}
      trustBox={
        <TrustBox
          localProcessing={page.trustBox.localProcessing}
          noUploads={page.trustBox.noUploads}
          noTracking={page.trustBox.noTracking}
          verifyHref={page.trustBox.verifyHref}
        />
      }
      topContent={
        <section className="space-y-4">
          <CompareFrameworkBlock page={page} toolLinks={toolLinks} />

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick comparison</h2>
            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              High-level view
            </span>
          </div>

          {uploadRow ? (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm">
              <p className="font-medium text-foreground">Uploads files?</p>
              <p className="mt-1 text-muted-foreground">
                Plain Tools: {uploadRow.plain} | {page.competitorName}: {uploadRow.competitor}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 md:hidden">
            {page.comparisonRows.map((row) => {
              const isUploadRow = row.feature.toLowerCase().includes("upload")
              return (
                <div
                  key={row.feature}
                  className={`rounded-xl border p-3 ${
                    isUploadRow
                      ? "border-blue-500/35 bg-blue-500/10"
                      : "border-border bg-card/50"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{row.feature}</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Plain Tools:</span> {row.plain}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{page.competitorName}:</span>{" "}
                      {row.competitor}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold">Plain Tools</th>
                  <th className="px-4 py-3 font-semibold">{page.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => {
                  const isUploadRow = row.feature.toLowerCase().includes("upload")
                  return (
                    <tr
                      key={row.feature}
                      className={`border-t border-border ${isUploadRow ? "bg-blue-500/[0.06]" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.plain}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.competitor}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/45 p-3">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <p className="mt-2 text-sm font-semibold text-foreground">Privacy comparison</p>
              <p className="mt-1 text-xs text-muted-foreground">How data is handled and what you can verify directly.</p>
            </div>
            <div className="rounded-xl border border-border bg-card/45 p-3">
              <Gauge className="h-4 w-4 text-accent" />
              <p className="mt-2 text-sm font-semibold text-foreground">Workflow and speed</p>
              <p className="mt-1 text-xs text-muted-foreground">Day-to-day execution cost, upload friction, and practical throughput.</p>
            </div>
            <div className="rounded-xl border border-border bg-card/45 p-3">
              <Users className="h-4 w-4 text-accent" />
              <p className="mt-2 text-sm font-semibold text-foreground">Best fit</p>
              <p className="mt-1 text-xs text-muted-foreground">Where Plain Tools or {page.competitorName} tends to suit better.</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/45 p-3.5">
            <h3 className="text-sm font-semibold text-foreground">Relevant tools you can try now</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {toolLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent/40 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      }
      faq={<FaqBlock faqs={page.faqs} />}
      relatedLinks={
        <RelatedLinks
          heading="Next steps"
          sections={[
            {
              title: "Trust and privacy",
              links: links
                ? [links.verify, { label: "No uploads explained", href: "/learn/no-uploads-explained" }]
                : [
                    { label: "Verify Claims", href: "/verify-claims" },
                    { label: "No uploads explained", href: "/learn/no-uploads-explained" },
                  ],
            },
            {
              title: "Relevant tools",
              links: toolLinks.slice(0, 3),
            },
            {
              title: "Learn",
              links: links ? links.relatedLearn : page.nextSteps.filter((step) => step.href.startsWith("/learn/")).slice(0, 2),
            },
            {
              title: "Status and network checks",
              links: [
                { label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" },
                { label: "Browse network diagnostics", href: "/network-tools" },
              ],
            },
          ]}
        />
      }
    />
  )
}


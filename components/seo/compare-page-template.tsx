import type { Metadata } from "next"

import { ArticleLayout } from "@/components/seo/article-layout"
import { FaqBlock } from "@/components/seo/faq-block"
import { RelatedLinks } from "@/components/seo/related-links"
import { TrustBox } from "@/components/seo/trust-box"
import { getCompareSeoLinks } from "@/lib/seo/tranche1-link-map"
import type { TrancheComparePage } from "@/lib/seo/tranche1-content"
import { getToolBySlug } from "@/lib/tools-catalogue"

const BASE_URL = "https://plain.tools"

function titleCase(value: string) {
  return value
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

export function buildComparePageMetadata(page: TrancheComparePage): Metadata {
  const canonical = `${BASE_URL}/compare/${page.slug}`
  const title = `${titleCase(page.primaryQuery)} - Offline & Private | Plain.tools`
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.metaDescription,
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
        <section className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Plain</th>
                <th className="px-4 py-3 font-semibold">{page.competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {page.comparisonRows.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">{row.feature}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.plain}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      }
      faq={<FaqBlock faqs={page.faqs} />}
      relatedLinks={
        <RelatedLinks
          heading="Next steps"
          sections={[
            {
              title: "Verify",
              links: links ? [links.verify] : [{ label: "Verify Claims", href: "/verify-claims" }],
            },
            {
              title: "Tool",
              links: links ? links.relatedTools.slice(0, 2) : page.nextSteps.filter((step) => step.href.startsWith("/tools/")).slice(0, 2),
            },
            {
              title: "Learn",
              links: links ? links.relatedLearn : page.nextSteps.filter((step) => step.href.startsWith("/learn/")).slice(0, 2),
            },
          ]}
        />
      }
    />
  )
}

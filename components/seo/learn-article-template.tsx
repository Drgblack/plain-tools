import type { Metadata } from "next"
import Link from "next/link"

import { ArticleLayout } from "@/components/seo/article-layout"
import { FaqBlock } from "@/components/seo/faq-block"
import {
  LearnHowToFramework,
  LearnTrustExplainerFramework,
} from "@/components/seo/learn-intent-framework"
import { RelatedLinks } from "@/components/seo/related-links"
import { TrustBox } from "@/components/seo/trust-box"
import { buildStandardPageTitle, normalizeBrandCapitalization } from "@/lib/page-title"
import type { TrancheLearnArticle } from "@/lib/seo/tranche1-content"
import { getLearnSeoLinks } from "@/lib/seo/tranche1-link-map"
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  combineJsonLd,
} from "@/lib/structured-data"

const BASE_URL = "https://plain.tools"

function titleCase(value: string) {
  return value
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

type LearnTemplateOptions = {
  basePath?: string
}

export function buildLearnArticleMetadata(
  article: TrancheLearnArticle,
  options?: LearnTemplateOptions
): Metadata {
  const basePath = options?.basePath ?? "/learn"
  const canonical = `${BASE_URL}${basePath}/${article.slug}`
  const title = buildStandardPageTitle(
    normalizeBrandCapitalization(article.title || titleCase(article.primaryQuery))
  )
  return {
    title,
    description: article.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: article.metaDescription,
      url: canonical,
      type: "article",
      images: [
        {
          url: "/og/learn.png",
          width: 1200,
          height: 630,
          alt: `${article.title} guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.metaDescription,
      images: ["/og/learn.png"],
    },
  }
}

function buildLearnSchema(article: TrancheLearnArticle, basePath: string, sectionLabel: string) {
  const pageUrl = `${BASE_URL}${basePath}/${article.slug}`
  const schemas = [
    buildArticleSchema({
      headline: article.title,
      description: article.metaDescription,
      url: pageUrl,
    }),
    buildBreadcrumbList([
      { name: "Home", url: BASE_URL },
      { name: sectionLabel, url: `${BASE_URL}${basePath}` },
      { name: article.title, url: pageUrl },
    ]),
    buildFaqPageSchema(
      article.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))
    ),
  ]

  const howToSteps = article.sections
    .slice(0, 6)
    .map((section) => ({
      name: section.heading,
      text:
        section.paragraphs[0] ??
        section.bullets?.[0] ??
        "Follow this step in sequence for a local no-upload workflow.",
    }))

  if (article.intent === "how-to" && howToSteps.length > 0) {
    schemas.push(
      buildHowToSchema(article.title, article.metaDescription, howToSteps)
    )
  }

  return combineJsonLd(schemas) ?? schemas[0]
}

type LearnArticleTemplateProps = {
  article: TrancheLearnArticle
  routeBase?: string
  routeLabel?: string
  relatedLabel?: string
}

export function LearnArticleTemplate({
  article,
  routeBase = "/learn",
  routeLabel = "Learn",
  relatedLabel = "Related workflows and guides",
}: LearnArticleTemplateProps) {
  const schema = buildLearnSchema(article, routeBase, routeLabel)
  const links = getLearnSeoLinks(article.slug)
  const primaryToolLink =
    links?.primaryTool ??
    article.nextSteps.find((step) => step.href.startsWith("/tools/")) ?? {
      label: "Use a matching tool locally",
      href: article.toolHref,
    }
  const compareLink =
    article.nextSteps.find((step) => step.href.startsWith("/compare")) ?? {
      label: "Compare Plain Tools with cloud alternatives",
      href: "/compare/offline-vs-online-pdf-tools",
    }

  return (
    <ArticleLayout
      title={article.title}
      intro={article.intro}
      sections={article.sections}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: routeLabel, href: routeBase },
        { label: article.title, href: `${routeBase}/${article.slug}` },
      ]}
      jsonLd={schema}
      disclaimer={article.disclaimer}
      trustBox={
        <TrustBox
          localProcessing={article.trustBox.localProcessing}
          noUploads={article.trustBox.noUploads}
          noTracking={article.trustBox.noTracking}
          verifyHref={article.trustBox.verifyHref}
        />
      }
      topContent={
        <div className="space-y-4">
          {article.intent === "how-to" ? (
            <LearnHowToFramework
              article={article}
              primaryToolLink={primaryToolLink}
              compareLink={compareLink}
            />
          ) : (
            <LearnTrustExplainerFramework
              article={article}
              primaryToolLink={primaryToolLink}
              compareLink={compareLink}
            />
          )}

          <section className="rounded-xl border border-border/70 bg-card/45 p-4 md:p-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Contextual links</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Apply this guide directly:{" "}
              <Link href={primaryToolLink.href} className="font-medium text-accent hover:underline">
                {primaryToolLink.label}
              </Link>
              , then{" "}
              <Link href={compareLink.href} className="font-medium text-accent hover:underline">
                {compareLink.label}
              </Link>{" "}
              and{" "}
              <Link href="/verify-claims" className="font-medium text-accent hover:underline">
                verify no-upload claims yourself
              </Link>
              . If your issue is service availability,{" "}
              <Link href="/site-status" className="font-medium text-accent hover:underline">
                run a quick site-status check
              </Link>{" "}
              before deeper troubleshooting.
            </p>
          </section>
        </div>
      }
      introAdPlacement="guide_content_top"
      midAdPlacement="guide_content_mid"
      bottomAdPlacement="guide_content_bottom"
      faq={<FaqBlock faqs={article.faqs} />}
      relatedLinks={
        <RelatedLinks
          heading="Next steps"
          sections={[
            {
              title: "Tool",
              links: [primaryToolLink],
            },
            {
              title: relatedLabel,
              links: links ? links.relatedLearn : article.nextSteps.filter((step) => step.href.startsWith("/learn/")).slice(0, 2),
            },
            {
              title: "Privacy guides",
              links: [
                { label: "No Uploads Explained", href: "/learn/no-uploads-explained" },
                { label: "Why PDF Uploads Are Risky", href: "/learn/why-pdf-uploads-are-risky" },
              ],
            },
            {
              title: "Verify",
              links: links ? [links.verify] : [{ label: "Verify Claims", href: "/verify-claims" }],
            },
            {
              title: "Compare",
              links: [compareLink],
            },
            {
              title: "Status and network checks",
              links: [
                { label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" },
                { label: "Run DNS lookup for a domain", href: "/dns-lookup" },
              ],
            },
            {
              title: "PDF tools hub",
              links: [{ label: "Browse all PDF tools", href: "/tools" }],
            },
            {
              title: "Learn hub",
              links: [{ label: "Browse all learn guides", href: "/learn" }],
            },
          ]}
        />
      }
    />
  )
}


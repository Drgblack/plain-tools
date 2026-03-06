import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { buildStandardPageTitle } from "@/lib/page-title"
import {
  combineSchemas,
  generateFAQSchema,
  generateHowToSchema,
  generateTechArticleSchema,
} from "@/lib/schema"
import { serializeJsonLd } from "@/lib/sanitize"
import { getToolBySlug } from "@/lib/tools-catalogue"

const SITE_URL = "https://plain.tools"

export type LearnArticleSection = {
  heading: string
  paragraphs: string[]
  subSections?: {
    heading: string
    paragraphs: string[]
  }[]
}

export type LearnArticleData = {
  slug: string
  title: string
  description: string
  published?: string
  updated: string
  readTime: string
  keywords: string[]
  intro: string[]
  sections: LearnArticleSection[]
  customContent?: ReactNode
  faqs: {
    question: string
    answer: string
  }[]
  relatedLearn: {
    label: string
    href: string
  }[]
  cta: {
    label: string
    href: string
    text: string
  }
  basePath?: string
  sectionLabel?: string
  extraSchemas?: Record<string, unknown>[]
}

type MetadataOptions = {
  basePath?: string
}

export const buildLearnArticleMetadata = (
  article: LearnArticleData,
  options?: MetadataOptions
): Metadata => {
  const basePath = options?.basePath ?? article.basePath ?? "/learn"
  const canonicalUrl = `${SITE_URL}${basePath}/${article.slug}`
  const standardTitle = buildStandardPageTitle(article.title)
  const socialImage =
    basePath === "/compare"
      ? "/og/compare.png"
      : basePath === "/file-converters"
        ? "/og/tools.png"
        : "/og/learn.png"

  return {
    title: standardTitle,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        de: canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title: standardTitle,
      description: article.description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: standardTitle,
      description: article.description,
      images: [socialImage],
    },
  }
}

function buildBreadcrumbSchema(
  sectionLabel: string,
  sectionPath: string,
  articleTitle: string,
  canonicalUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionLabel,
        item: `${SITE_URL}${sectionPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: canonicalUrl,
      },
    ],
  }
}

export function LearnSeoArticlePage({ article }: { article: LearnArticleData }) {
  const publishedIso = article.published ?? "2026-03-03"
  const modifiedIso = "2026-03-03"
  const basePath = article.basePath ?? "/learn"
  const sectionLabel = article.sectionLabel ?? "Learn"
  const canonicalUrl = `${SITE_URL}${basePath}/${article.slug}`

  const ctaSlug = article.cta.href.startsWith("/tools/")
    ? article.cta.href.replace("/tools/", "")
    : null
  const ctaTool = ctaSlug ? getToolBySlug(ctaSlug) : undefined
  const ctaButtonLabel = ctaTool
    ? `Try ${ctaTool.name} — free, no upload required \u2192`
    : `${article.cta.label} \u2192`

  const schemas: (Record<string, unknown> | null)[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      author: {
        "@type": "Person",
        name: "Plain Team",
      },
      datePublished: publishedIso,
      dateModified: modifiedIso,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      url: canonicalUrl,
    },
    buildBreadcrumbSchema(sectionLabel, basePath, article.title, canonicalUrl),
    generateFAQSchema(article.faqs),
  ]

  if (basePath === "/learn") {
    schemas.splice(
      1,
      0,
      generateTechArticleSchema({
        title: article.title,
        description: article.description,
        slug: article.slug,
        datePublished: publishedIso,
        dateModified: modifiedIso,
        proficiencyLevel: "Beginner",
      }) as Record<string, unknown>
    )
  }

  if (article.sections.length > 0) {
    const howToSteps = article.sections.slice(0, 6).map((section) => ({
      name: section.heading,
      text:
        section.paragraphs[0] ??
        section.subSections?.[0]?.paragraphs?.[0] ??
        "Follow this step and verify output before sharing.",
    }))

    schemas.push(
      generateHowToSchema({
        name: article.title,
        description: article.description,
        steps: howToSteps,
      }) as Record<string, unknown>
    )
  }

  if (article.extraSchemas && article.extraSchemas.length > 0) {
    schemas.push(...article.extraSchemas)
  }

  const schema = combineSchemas(schemas)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id={`learn-schema-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <main className="flex-1 px-4 py-16 sm:py-20">
        <article className="mx-auto max-w-3xl space-y-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href={basePath} className="hover:text-foreground">
              {sectionLabel}
            </Link>
            <span>/</span>
            <span className="text-foreground">{article.title}</span>
          </nav>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Updated: {article.updated} · {article.readTime}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {article.title}
            </h1>
            <div className="space-y-4">
              {article.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </header>

          {article.customContent ? (
            <section className="space-y-6 text-base leading-relaxed text-muted-foreground">
              {article.customContent}
            </section>
          ) : (
            article.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.subSections?.map((subSection) => (
                  <div key={subSection.heading} className="space-y-3 rounded-lg border border-white/[0.08] p-4">
                    <h3 className="text-lg font-semibold text-foreground">{subSection.heading}</h3>
                    {subSection.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </section>
            ))
          )}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">FAQ</h2>
            <div className="space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-white/[0.08] p-4">
                  <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Related Resources
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {article.relatedLearn.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-white/[0.08] bg-muted/20 p-4 text-sm font-medium text-foreground hover:border-accent/40 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-accent/30 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-foreground">{article.cta.label}</h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {article.cta.text}
            </p>
            <div className="mt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href={article.cta.href}>{ctaButtonLabel}</Link>
              </Button>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}

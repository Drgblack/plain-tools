import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { combineSchemas, generateBreadcrumbSchema, generateFAQSchema, generateTechArticleSchema } from "@/lib/schema"
import { serializeJsonLd } from "@/lib/sanitize"
import { getToolBySlug } from "@/lib/tools-catalogue"

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
}

export const buildLearnArticleMetadata = (article: LearnArticleData): Metadata => ({
  title: `${article.title} - Plain Learn`,
  description: article.description,
  keywords: article.keywords,
  alternates: {
    canonical: `https://plain.tools/learn/${article.slug}`,
    languages: {
      en: `https://plain.tools/learn/${article.slug}`,
      de: `https://plain.tools/learn/${article.slug}`,
      "x-default": `https://plain.tools/learn/${article.slug}`,
    },
  },
  openGraph: {
    title: `${article.title} - Plain`,
    description: article.description,
    url: `https://plain.tools/learn/${article.slug}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `${article.title} - Plain`,
    description: article.description,
  },
})

export function LearnSeoArticlePage({ article }: { article: LearnArticleData }) {
  const publishedIso = article.published ?? "2026-03-03"
  const modifiedIso = "2026-03-03"
  const ctaSlug = article.cta.href.startsWith("/tools/")
    ? article.cta.href.replace("/tools/", "")
    : null
  const ctaTool = ctaSlug ? getToolBySlug(ctaSlug) : undefined
  const ctaButtonLabel = ctaTool
    ? `Try ${ctaTool.name} — free, no upload required \u2192`
    : `${article.cta.label} \u2192`

  const schema = combineSchemas([
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
        "@id": `https://plain.tools/learn/${article.slug}`,
      },
    },
    generateTechArticleSchema({
      title: article.title,
      description: article.description,
      slug: article.slug,
      datePublished: publishedIso,
      dateModified: modifiedIso,
      proficiencyLevel: "Beginner",
    }),
    generateBreadcrumbSchema([{ name: article.title, slug: article.slug }]),
    generateFAQSchema(article.faqs),
  ])

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
            <Link href="/learn" className="hover:text-foreground">
              Learn
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

          {article.sections.map((section) => (
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
          ))}

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
              Related Learn Articles
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


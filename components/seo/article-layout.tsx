import Link from "next/link"

import { AdSlot } from "@/components/ads/ad-slot"
import { type AdPlacement } from "@/lib/ads"
import { serializeJsonLd } from "@/lib/sanitize"

type ArticleSection = {
  id: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

type Crumb = {
  label: string
  href: string
}

type ArticleLayoutProps = {
  title: string
  intro: string[]
  sections: ArticleSection[]
  breadcrumbs: Crumb[]
  jsonLd: object | object[]
  disclaimer?: string
  trustBox: React.ReactNode
  faq: React.ReactNode
  relatedLinks: React.ReactNode
  topContent?: React.ReactNode
  introAdPlacement?: AdPlacement
  midAdPlacement?: AdPlacement
}

export function ArticleLayout({
  title,
  intro,
  sections,
  breadcrumbs,
  jsonLd,
  disclaimer,
  trustBox,
  faq,
  relatedLinks,
  topContent,
  introAdPlacement,
  midAdPlacement,
}: ArticleLayoutProps) {
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  const midpointIndex =
    sections.length > 2 ? Math.max(1, Math.floor(sections.length / 2) - 1) : -1

  return (
    <main className="px-4 py-12 sm:py-16">
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <article className="mx-auto max-w-5xl space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span>/</span> : null}
              {index < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </header>

        {trustBox}

        {introAdPlacement ? <AdSlot placement={introAdPlacement} /> : null}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Table of contents</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:text-foreground hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {topContent}

        {disclaimer ? (
          <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p>{disclaimer}</p>
          </section>
        ) : null}

        {sections.map((section, index) => (
          <div key={section.id} className="space-y-10">
            <section id={section.id} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>

            {midAdPlacement && index === midpointIndex ? <AdSlot placement={midAdPlacement} /> : null}
          </div>
        ))}

        {faq}
        {relatedLinks}
      </article>
    </main>
  )
}

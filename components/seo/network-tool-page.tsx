import type { ReactNode } from "react"
import Link from "next/link"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { RelatedLinks } from "@/components/seo/related-links"

type NetworkToolPageProps = {
  title: string
  intro: string[]
  howItWorks: string[]
  caveats: string[]
  relatedTools: Array<{ label: string; href: string }>
  relatedGuides: Array<{ label: string; href: string }>
  children: ReactNode
}

export function NetworkToolPage({
  title,
  intro,
  howItWorks,
  caveats,
  relatedTools,
  relatedGuides,
  children,
}: NetworkToolPageProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: title },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            {intro.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-muted-foreground md:text-[1.02rem]"
              >
                {paragraph}
              </p>
            ))}
          </header>

          <section className="mt-8 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Open the tool
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This page embeds the live network workflow directly, so there is no extra click
                  between the explanation and the check.
                </p>
              </div>
              <Link
                href="/network-tools"
                className="text-sm font-medium text-accent transition hover:underline"
              >
                Back to Network Tools
              </Link>
            </div>
            {children}
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                How this check works
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {howItWorks.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    <span className="font-medium text-foreground">{index + 1}. </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <aside className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Limitations and privacy notes
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {caveats.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <div className="mt-10">
            <RelatedLinks
              heading="Related network resources"
              sections={[
                { title: "Related tools", links: relatedTools },
                { title: "Relevant guides", links: relatedGuides },
                {
                  title: "Next steps",
                  links: [
                    { label: "Browse Network Tools", href: "/network-tools" },
                    { label: "Browse all tools", href: "/tools" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

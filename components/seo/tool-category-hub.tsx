import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { ToolCard, type ToolCardProps } from "@/components/tool-card"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type GuideLink = {
  label: string
  href: string
  description: string
}

type HubLink = {
  label: string
  href: string
  description: string
}

type ToolCategoryHubProps = {
  title: string
  path: string
  intro: string
  tools: ToolCardProps[]
  guides: GuideLink[]
  featuredTasks?: HubLink[]
  relatedHubs?: HubLink[]
}

export function ToolCategoryHub({
  title,
  path,
  intro,
  tools,
  guides,
  featuredTasks = [],
  relatedHubs = [],
}: ToolCategoryHubProps) {
  const url = `https://plain.tools${path}`
  const schema = combineJsonLd([
    buildWebPageSchema({
      name: `${title} - Plain Tools`,
      description: intro,
      url,
    }),
    buildCollectionPageSchema({
      name: title,
      description: intro,
      url,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: title, url },
    ]),
    buildItemListSchema(
      `${title} tools`,
      tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        url: `https://plain.tools${tool.href}`,
      })),
      url
    ),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {schema ? <JsonLd id={`${path.replace(/\//g, "-")}-schema`} schema={schema} /> : null}
      <main className="flex-1">
        <section className="border-b border-border px-4 py-14 md:py-16">
          <div className="mx-auto max-w-6xl space-y-4">
            <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-4xl text-sm leading-8 text-muted-foreground md:text-base">
              {intro}
            </p>
          </div>
        </section>

        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Browse tools in this category</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {featuredTasks.length > 0 ? (
          <section className="border-b border-border px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-lg font-semibold text-foreground">Popular tasks in this cluster</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Start with the closest matching workflow route, then move into related guides if you
                need more context on privacy, quality limits, or follow-up steps.
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredTasks.map((task) => (
                  <li key={task.href} className="rounded-lg border border-border bg-card/40 p-4">
                    <Link href={task.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                      {task.label}
                    </Link>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {task.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground">Relevant guides</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Use these guides to choose the right workflow, verify privacy claims, and move between
              related tasks without extra trial and error.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {guides.map((guide) => (
                <li key={guide.href} className="rounded-lg border border-border bg-card/40 p-4">
                  <Link href={guide.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                    {guide.label}
                  </Link>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {guide.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {relatedHubs.length > 0 ? (
          <section className="border-t border-border px-4 py-12">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-lg font-semibold text-foreground">Related clusters</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Move across adjacent Plain Tools sections when your job shifts from conversion to
                editing, OCR, privacy verification, or troubleshooting.
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedHubs.map((hub) => (
                  <li key={hub.href} className="rounded-lg border border-border bg-card/40 p-4">
                    <Link href={hub.href} className="text-sm font-semibold text-foreground hover:text-accent hover:underline">
                      {hub.label}
                    </Link>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {hub.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

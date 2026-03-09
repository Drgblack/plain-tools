import Link from "next/link"
import { ToolCard, type ToolCardProps } from "@/components/tool-card"
import { JsonLd } from "@/components/seo/json-ld"
import { Surface } from "@/components/surface"
import {
  buildFaqPageSchema,
  buildSoftwareApplicationSchema,
  combineJsonLd,
} from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buildStandardToolIntro } from "@/lib/tool-intro"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { NoTranslate } from "@/components/no-translate"

interface FAQ {
  question: string
  answer: string
}

interface Example {
  label: string
  href: string
}

export type CategoryType = 'network' | 'pdf' | 'image' | 'developer' | 'calculator' | 'file'

interface ToolShellProps {
  name: string
  description: string
  category: {
    name: string
    href: string
    type?: CategoryType
  }
  tags?: string[]
  children: React.ReactNode
  explanation?: string
  faqs?: FAQ[]
  relatedTools?: ToolCardProps[]
  /** Canonical route path for structured data, e.g. "/tools/merge-pdf". */
  schemaPath?: string
  /** Optional feature list override for SoftwareApplication schema. */
  schemaFeatureList?: string[]
  /** Example links to show in "Try these examples" section */
  examples?: Example[]
}

// Map category types to CSS classes
const categoryClasses: Record<CategoryType, string> = {
  network: 'category-network',
  pdf: 'category-pdf',
  image: 'category-image',
  developer: 'category-developer',
  calculator: 'category-calculator',
  file: 'category-file',
}

function buildSchemaUrl(schemaPath?: string): string | undefined {
  if (!schemaPath) return undefined
  const path = schemaPath.startsWith("/") ? schemaPath : `/${schemaPath}`
  return `https://plain.tools${path}`
}

function buildDefaultFeatureList(categoryType?: CategoryType): string[] {
  if (categoryType === "network") {
    return [
      "Live diagnostics for domains, hosts, and response timing",
      "No account required for day-to-day checks",
      "Shareable result routes for repeat checks",
    ]
  }

  return [
    "Local browser processing where supported",
    "No account required for core workflows",
    "Download results directly to your device",
  ]
}

function generateToolSchema(props: {
  name: string
  description: string
  categoryType?: CategoryType
  schemaPath?: string
  schemaFeatureList?: string[]
  faqs?: FAQ[]
}) {
  const url = buildSchemaUrl(props.schemaPath)
  const featureList =
    props.schemaFeatureList && props.schemaFeatureList.length > 0
      ? props.schemaFeatureList
      : buildDefaultFeatureList(props.categoryType)

  const schemas = []
  if (url) {
    schemas.push(
      buildSoftwareApplicationSchema({
        name: props.name,
        description: props.description,
        url,
        featureList,
      })
    )
  }

  if (props.faqs && props.faqs.length > 0) {
    schemas.push(buildFaqPageSchema(props.faqs))
  }

  return combineJsonLd(schemas)
}

export function ToolShell({
  name,
  description,
  category,
  tags,
  children,
  explanation,
  faqs,
  relatedTools,
  schemaPath,
  schemaFeatureList,
  examples,
}: ToolShellProps) {
  const schema = generateToolSchema({
    name,
    description,
    categoryType: category.type,
    schemaPath,
    schemaFeatureList,
    faqs,
  })
  const categoryClass = category.type ? categoryClasses[category.type] : ''
  const introText = buildStandardToolIntro(
    description,
    category.type === "network" ? "network" : category.type === "developer" ? "local" : "local"
  )
  
  return (
    <>
      {schema ? <JsonLd id={`${name.toLowerCase().replace(/\s+/g, "-")}-schema`} schema={schema} /> : null}
      
      <article className={cn("mx-auto max-w-6xl px-4 py-8", categoryClass)}>
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: category.name, href: category.href },
            { label: name },
          ]}
          className="mb-6"
        />

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            <NoTranslate>{name}</NoTranslate>
          </h1>
          <p className="mt-2 text-muted-foreground">{introText}</p>

          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Tool features">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Tool Interface */}
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <div className="order-2 lg:order-1">
            {/* Try These Examples */}
            {examples && examples.length > 0 && (
              <section className="mb-8" aria-labelledby="examples-heading">
                <h2 id="examples-heading" className="mb-3 text-lg font-medium text-foreground">
                  Try these examples
                </h2>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <Link
                      key={example.href}
                      href={example.href}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {example.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Explanation Section */}
            {explanation && (
              <section className="mb-8" aria-labelledby="how-it-works">
                <h2 id="how-it-works" className="mb-3 text-lg font-medium text-foreground">
                  How it works
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {explanation}
                </p>
              </section>
            )}

            {/* FAQs */}
            {faqs && faqs.length > 0 && (
              <section className="mb-8" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="mb-3 text-lg font-medium text-foreground">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-sm text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Related Tools */}
            {relatedTools && relatedTools.length > 0 && (
              <section aria-labelledby="related-tools">
                <h2 id="related-tools" className="mb-4 text-lg font-medium text-foreground">
                  Related Tools
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedTools.map((tool) => (
                    <ToolCard key={tool.href} {...tool} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Tool Panel */}
          <div className="order-1 lg:order-2">
            <Surface className="sticky top-20 p-6 notranslate" data-plain-tool-shell translate="no">
              {children}
            </Surface>
          </div>
        </div>
      </article>
    </>
  )
}

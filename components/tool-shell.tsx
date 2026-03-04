import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ToolCard, type ToolCardProps } from "@/components/tool-card"
import { Surface } from "@/components/surface"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

// Generate JSON-LD schema for tool pages
function generateToolSchema(props: {
  name: string
  description: string
  explanation?: string
  faqs?: FAQ[]
}) {
  const schemas: object[] = []
  
  // WebApplication schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: props.name,
    description: props.description,
    url: `https://plain.tools/${props.name.toLowerCase().replace(/\s+/g, '-')}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'No file uploads required',
      'Runs entirely in browser',
      'No tracking or analytics',
      'Privacy-first design',
    ],
  })
  
  // FAQPage schema if FAQs exist
  if (props.faqs && props.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: props.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }
  
  return schemas
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
  examples,
}: ToolShellProps) {
  const schemas = generateToolSchema({ name, description, explanation, faqs })
  const categoryClass = category.type ? categoryClasses[category.type] : ''
  
  return (
    <>
      {/* JSON-LD Schemas */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      <article className={cn("mx-auto max-w-6xl px-4 py-8", categoryClass)}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href={category.href} className="hover:text-foreground">
            {category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground" aria-current="page">{name}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {name}
          </h1>
          <p className="mt-2 text-muted-foreground">{description}</p>

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
            <Surface className="sticky top-20 p-6">
              {children}
            </Surface>
          </div>
        </div>
      </article>
    </>
  )
}

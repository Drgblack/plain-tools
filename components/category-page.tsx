import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ToolCard, type ToolCardProps } from "@/components/tool-card"
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

interface HowItWorks {
  title: string
  description: string
}

interface CategoryPageProps {
  name: string
  description: string
  icon: React.ReactNode
  tools: ToolCardProps[]
  howItWorks?: HowItWorks[]
  faqs?: FAQ[]
}

export function CategoryPage({
  name,
  description,
  icon,
  tools,
  howItWorks,
  faqs,
}: CategoryPageProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground">{name}</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] text-foreground ring-1 ring-white/[0.12]">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {name}
                </h1>
                <p className="mt-1 text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Available Tools
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        {howItWorks && howItWorks.length > 0 && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="mb-6 text-lg font-medium text-foreground">
                How it works
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {howItWorks.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-semibold text-foreground ring-1 ring-white/[0.12]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <section>
            <div className="mx-auto max-w-6xl px-4 py-12">
              <h2 className="mb-6 text-lg font-medium text-foreground">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="w-full max-w-2xl"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}
    </div>
  )
}

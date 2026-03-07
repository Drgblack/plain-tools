import type { Metadata } from 'next'
import Link from "next/link"
import { Globe, Wifi, Radio, ChevronRight } from "lucide-react"
import { InvalidParam } from '@/components/invalid-param'
import { Surface } from '@/components/surface'
import { ToolCard } from '@/components/tool-card'
import { generateDynamicToolMetadata, isValidDomain } from '@/lib/seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DNSDynamicClient } from './client'

interface Props {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const isValid = isValidDomain(decodedDomain)
  
  return generateDynamicToolMetadata({
    toolName: 'DNS Lookup',
    param: decodedDomain,
    paramType: 'domain',
    isValid,
  })
}

const faqs = [
  {
    question: `What DNS records will I find?`,
    answer: "DNS records include A (IPv4 addresses), AAAA (IPv6), MX (mail servers), TXT (verification and SPF records), NS (nameservers), and CNAME (aliases). Each serves a different purpose in routing internet traffic.",
  },
  {
    question: "How long does DNS propagation take?",
    answer: "DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. This depends on TTL (Time To Live) values and how DNS caches are configured.",
  },
  {
    question: "Why might DNS records differ between lookups?",
    answer: "Large sites often use multiple DNS records for load balancing and geographic distribution. Different queries may return different IP addresses from the same pool.",
  },
  {
    question: "What does TTL mean in DNS?",
    answer: "TTL (Time To Live) specifies how long a DNS record should be cached before being refreshed. Lower TTL means faster updates but more DNS queries.",
  },
  {
    question: "Is this DNS lookup private?",
    answer: "Yes. Plain Tools does not log DNS queries. The lookup is performed through our edge network and results are returned directly to your browser without storage.",
  },
]

const relatedTools = [
  {
    name: "What is My IP",
    description: "View your public IP address and location",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"] as const,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Site Status",
    description: "Check if a website is up or down",
    href: "/site-status",
    tags: ["Edge"] as const,
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"] as const,
    icon: <Radio className="h-4 w-4" />,
  },
]

export default async function DNSDomainPage({ params }: Props) {
  const { domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  const isValid = isValidDomain(decodedDomain)
  
  if (!isValid) {
    return (
      <InvalidParam 
        paramType="domain"
        value={decodedDomain}
        toolHref="/dns-lookup"
        toolName="DNS Lookup"
      />
    )
  }
  
  return (
    <article className="category-network">
      {/* Breadcrumb */}
      <nav className="border-b border-border/50" aria-label="Breadcrumb">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link href="/network-tools" className="hover:text-foreground">Network Tools</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link href="/dns-lookup" className="hover:text-foreground">DNS Lookup</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground">{decodedDomain}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* H1 Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            DNS Records for {decodedDomain}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            View DNS records including A, AAAA, MX, TXT, NS, and CNAME for {decodedDomain}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Result Panel */}
            <Surface as="section">
              <h2 className="text-lg font-semibold text-foreground mb-4">DNS Lookup Results</h2>
              <DNSDynamicClient domain={decodedDomain} />
            </Surface>

            {/* Explanation Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">What This Means</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  DNS (Domain Name System) records for <strong className="text-foreground">{decodedDomain}</strong> tell 
                  internet browsers and email servers where to find this domain. The A record points to the server&apos;s 
                  IPv4 address, while MX records handle email routing. TXT records often contain verification codes 
                  for services like Google Workspace or email authentication (SPF, DKIM).
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  These records are queried in real-time from authoritative DNS servers. Results may vary slightly 
                  due to DNS caching and geographic load balancing used by large websites.
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
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
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Try Another Domain */}
            <Surface>
              <h3 className="font-semibold text-foreground mb-3">Try Another Domain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Look up DNS records for any domain
              </p>
              <Link 
                href="/dns-lookup"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Go to DNS Lookup Tool
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Surface>

            {/* Related Tools */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Related Tools</h3>
              <div className="space-y-3">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.href} {...tool} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

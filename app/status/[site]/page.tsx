import type { Metadata } from 'next'
import Link from "next/link"
import { Globe, Server, Wifi, Radio, ChevronRight } from "lucide-react"
import { InvalidParam } from '@/components/invalid-param'
import { Surface } from '@/components/surface'
import { ToolCard } from '@/components/tool-card'
import { generateDynamicToolMetadata, isValidSite } from '@/lib/seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StatusDynamicClient } from './client'

interface Props {
  params: Promise<{ site: string }>
}

// Helper to format site name for display
function formatSiteName(site: string): string {
  return site
    .replace(/^is-/, '')
    .replace(/-down$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const decodedSite = decodeURIComponent(site)
  const isValid = isValidSite(decodedSite)
  const siteName = formatSiteName(decodedSite)
  
  return generateDynamicToolMetadata({
    toolName: `Is ${siteName} Down`,
    param: decodedSite,
    paramType: 'site',
    isValid,
  })
}

const faqs = [
  {
    question: "How does this status check work?",
    answer: "We send an HTTP request from our global edge network and measure the response. If the server responds with a success code (200-399), the site is considered up.",
  },
  {
    question: "Why might the site be down for me but up here?",
    answer: "Regional outages, ISP blocks, or geo-restrictions can cause a site to be accessible from our servers but not from your location. The reverse can also happen.",
  },
  {
    question: "What does response time indicate?",
    answer: "Response time shows how long the server took to respond from our edge location. Your actual experience may vary based on your geographic proximity to the server.",
  },
  {
    question: "Can I check any website?",
    answer: "Yes, you can check any publicly accessible website. Sites behind authentication or firewalls may show as down even if they're working for authorized users.",
  },
  {
    question: "How often is the status updated?",
    answer: "Each check is performed fresh when you request it. There's no caching - you always get real-time status information.",
  },
]

const relatedTools = [
  {
    name: "DNS Lookup",
    description: "Query DNS records for any domain",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"] as const,
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "What is My IP",
    description: "View your public IP address",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"] as const,
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"] as const,
    icon: <Radio className="h-4 w-4" />,
  },
]

// Popular sites to check
const popularSites = [
  { name: "Google", slug: "google" },
  { name: "YouTube", slug: "youtube" },
  { name: "Twitter/X", slug: "twitter" },
  { name: "Reddit", slug: "reddit" },
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "Discord", slug: "discord" },
]

export default async function SiteStatusDynamicPage({ params }: Props) {
  const { site } = await params
  const decodedSite = decodeURIComponent(site)
  const isValid = isValidSite(decodedSite)
  const siteName = formatSiteName(decodedSite)
  
  if (!isValid) {
    return (
      <InvalidParam 
        paramType="site"
        value={decodedSite}
        toolHref="/site-status"
        toolName="Site Status Checker"
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
            <li><Link href="/site-status" className="hover:text-foreground">Site Status</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground">{siteName}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* H1 Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Is {siteName} Down?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Check the current status of {siteName} from our global edge network
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Result Panel */}
            <Surface as="section">
              <h2 className="text-lg font-semibold text-foreground mb-4">Current Status</h2>
              <StatusDynamicClient site={decodedSite} siteName={siteName} />
            </Surface>

            {/* Explanation Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">What This Means</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  This page checks whether <strong className="text-foreground">{siteName}</strong> is accessible from 
                  our global edge network. If the site responds successfully, it&apos;s marked as &quot;Up&quot;. If it fails 
                  to respond or returns an error, it&apos;s marked as &quot;Down&quot;.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Keep in mind that even if a site shows as up here, you might still have trouble accessing it 
                  due to local network issues, ISP problems, or geographic restrictions. The reverse can also 
                  happen - a site might be down from our servers but working for you.
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
            {/* Check Other Sites */}
            <Surface>
              <h3 className="font-semibold text-foreground mb-3">Check Other Sites</h3>
              <div className="space-y-2">
                {popularSites.filter(s => s.slug !== decodedSite.replace('is-', '').replace('-down', '')).slice(0, 5).map((s) => (
                  <Link 
                    key={s.slug}
                    href={`/status/is-${s.slug}-down`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Is {s.name} Down?
                  </Link>
                ))}
              </div>
              <Link 
                href="/site-status"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Check Any Site
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

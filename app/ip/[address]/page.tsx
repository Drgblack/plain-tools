import type { Metadata } from 'next'
import Link from "next/link"
import { Globe, Server, Wifi, Radio, ChevronRight } from "lucide-react"
import { InvalidParam } from '@/components/invalid-param'
import { Surface } from '@/components/surface'
import { ToolCard } from '@/components/tool-card'
import { generateDynamicToolMetadata, isValidIPAddress } from '@/lib/seo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { IPDynamicClient } from './client'

interface Props {
  params: Promise<{ address: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params
  const decodedAddress = decodeURIComponent(address)
  const isValid = isValidIPAddress(decodedAddress)
  
  return generateDynamicToolMetadata({
    toolName: 'IP Lookup',
    param: decodedAddress,
    paramType: 'ip',
    isValid,
  })
}

const faqs = [
  {
    question: "What information can be determined from an IP address?",
    answer: "An IP address can reveal approximate geographic location (country, region, city), the Internet Service Provider (ISP), and sometimes the organization that owns the IP range.",
  },
  {
    question: "How accurate is IP geolocation?",
    answer: "IP geolocation is typically accurate to the city level but can be off by many miles. It often shows the ISP's registered location rather than the user's physical location.",
  },
  {
    question: "What's the difference between public and private IPs?",
    answer: "Public IPs are globally routable on the internet. Private IPs (like 192.168.x.x, 10.x.x.x) are used within local networks and can't be reached directly from the internet.",
  },
  {
    question: "Can an IP address identify a specific person?",
    answer: "An IP address alone can't identify a person. It typically identifies a network or household. ISPs keep records that could link an IP to a subscriber, but this requires legal process to access.",
  },
  {
    question: "Why do some IPs show as 'reserved' or 'private'?",
    answer: "Certain IP ranges are reserved for special purposes: private networks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback (127.0.0.0/8), and documentation (192.0.2.0/24).",
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

// Well-known IPs
const wellKnownIPs = [
  { ip: "8.8.8.8", name: "Google DNS" },
  { ip: "1.1.1.1", name: "Cloudflare DNS" },
  { ip: "208.67.222.222", name: "OpenDNS" },
  { ip: "9.9.9.9", name: "Quad9 DNS" },
]

export default async function IPAddressPage({ params }: Props) {
  const { address } = await params
  const decodedAddress = decodeURIComponent(address)
  const isValid = isValidIPAddress(decodedAddress)
  
  if (!isValid) {
    return (
      <InvalidParam 
        paramType="ip"
        value={decodedAddress}
        toolHref="/what-is-my-ip"
        toolName="IP Lookup"
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
            <li><Link href="/what-is-my-ip" className="hover:text-foreground">IP Lookup</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-mono">{decodedAddress}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* H1 Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            IP Address {decodedAddress}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Geolocation and network information for {decodedAddress}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Result Panel */}
            <Surface as="section">
              <h2 className="text-lg font-semibold text-foreground mb-4">IP Information</h2>
              <IPDynamicClient address={decodedAddress} />
            </Surface>

            {/* Explanation Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">What This Means</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  The IP address <strong className="text-foreground font-mono">{decodedAddress}</strong> is 
                  a unique identifier assigned to a device or network on the internet. The geolocation data 
                  shown above is derived from IP registration databases and may not reflect the exact physical 
                  location of the device using this IP.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  The ISP (Internet Service Provider) information shows who owns or manages this IP address range. 
                  For residential connections, this is typically the home internet provider. For servers and 
                  cloud services, it may show the hosting company or data center operator.
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
            {/* Lookup Other IPs */}
            <Surface>
              <h3 className="font-semibold text-foreground mb-3">Look Up Other IPs</h3>
              <div className="space-y-2">
                {wellKnownIPs.filter(i => i.ip !== decodedAddress).map((item) => (
                  <Link 
                    key={item.ip}
                    href={`/ip/${item.ip}`}
                    className="flex justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="font-mono">{item.ip}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              <Link 
                href="/what-is-my-ip"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--category-accent,var(--accent))] hover:underline"
              >
                Check Your IP Address
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

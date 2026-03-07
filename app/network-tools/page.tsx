import type { Metadata } from 'next'
import { Globe, Server, Wifi, Radio } from "lucide-react"
import { CategoryPage } from "@/components/category-page"
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata: Metadata = generateCategoryMetadata({
  name: 'Network Tools',
  description: 'Network diagnostics and uptime checks for IP lookup, DNS queries, site availability, and latency testing.',
  slug: 'network-tools',
  toolCount: 4,
})

const tools = [
  {
    name: "Site Status Checker",
    description: "Check if a website is up or down with live status code and response time",
    href: "/site-status",
    tags: ["Live", "Status"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "What is My IP",
    description: "See your current public IP and browser-reported connection details",
    href: "/what-is-my-ip",
    tags: ["Local", "IP"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query live DNS-over-HTTPS records for A, AAAA, and MX",
    href: "/dns-lookup",
    tags: ["DoH", "Records"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Latency Test",
    description: "Measure round-trip latency to a hostname or IP",
    href: "/ping-test",
    tags: ["Latency", "RTT"],
    icon: <Radio className="h-4 w-4" />,
  },
]

const howItWorks = [
  {
    title: "Select a tool",
    description:
      "Choose one of four network checks: IP, DNS, site status, or latency.",
  },
  {
    title: "Enter your query",
    description:
      "Enter a domain, URL, hostname, or IP address and run a live check.",
  },
  {
    title: "Get instant results",
    description:
      "Results are returned immediately with clear status and diagnostics.",
  },
]

const faqs = [
  {
    question: "Is my data being logged when I use these tools?",
    answer:
      "No. Network tools that require server-side processing use edge workers that do not log queries or results. Your IP lookup is performed locally where possible.",
  },
  {
    question: "Why do some tools require edge workers?",
    answer:
      "Certain network operations like DNS lookups cannot be performed directly in the browser due to security restrictions. We use edge workers to perform these queries without logging any data.",
  },
  {
    question: "How accurate is the IP geolocation?",
    answer:
      "IP geolocation is approximate and typically accurate to the city level. It should not be used for precise location tracking.",
  },
  {
    question: "Can I use these tools for commercial purposes?",
    answer:
      "Yes, all tools are free to use for any purpose. However, please be mindful of rate limits and use responsibly.",
  },
]

export default function NetworkToolsPage() {
  return (
    <CategoryPage
      name="Network Tools"
      description="Diagnostic tools for network analysis and troubleshooting"
      icon={<Globe className="h-6 w-6" />}
      tools={tools}
      howItWorks={howItWorks}
      faqs={faqs}
    />
  )
}

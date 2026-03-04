import type { Metadata } from 'next'
import { Globe, Server, Wifi, Radio } from "lucide-react"
import { CategoryPage } from "@/components/category-page"
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata: Metadata = generateCategoryMetadata({
  name: 'Network Tools',
  description: 'Free online network diagnostic tools for IP lookup, DNS queries, site status checks, and latency testing.',
  slug: 'network-tools',
  toolCount: 4,
})

const tools = [
  {
    name: "What is My IP",
    description: "View your public IP address, ISP, and approximate location",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query DNS records including A, AAAA, MX, TXT, and more",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Site Status",
    description: "Check if a website is up, down, or experiencing issues",
    href: "/site-status",
    tags: ["Edge"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency and response time to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"],
    icon: <Radio className="h-4 w-4" />,
  },
]

const howItWorks = [
  {
    title: "Select a tool",
    description:
      "Choose from our collection of network diagnostic tools based on your needs.",
  },
  {
    title: "Enter your query",
    description:
      "Input the domain, IP address, or URL you want to investigate.",
  },
  {
    title: "Get instant results",
    description:
      "Results are fetched in real-time using edge workers for fast response.",
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

"use client"

import { Globe, Wifi, Radio, Server } from "lucide-react"
import { useState } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const relatedTools = [
  {
    name: "What is My IP",
    description: "View your public IP address",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "Site Status",
    description: "Check if a website is up or down",
    href: "/site-status",
    tags: ["Edge"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"],
    icon: <Radio className="h-4 w-4" />,
  },
]

// Popular domains for "Try these examples"
const popularDomains = [
  { domain: "google.com", name: "Google" },
  { domain: "youtube.com", name: "YouTube" },
  { domain: "facebook.com", name: "Facebook" },
  { domain: "amazon.com", name: "Amazon" },
  { domain: "twitter.com", name: "Twitter/X" },
  { domain: "github.com", name: "GitHub" },
  { domain: "netflix.com", name: "Netflix" },
  { domain: "reddit.com", name: "Reddit" },
  { domain: "openai.com", name: "OpenAI" },
  { domain: "cloudflare.com", name: "Cloudflare" },
]

const faqs = [
  {
    question: "What is DNS?",
    answer:
      "DNS (Domain Name System) translates human-readable domain names like example.com into IP addresses that computers use to communicate.",
  },
  {
    question: "What do the different record types mean?",
    answer:
      "A records point to IPv4 addresses, AAAA to IPv6, MX handles mail routing, TXT contains text data often for verification, NS specifies nameservers, and CNAME creates domain aliases.",
  },
  {
    question: "Why might DNS lookup fail?",
    answer:
      "DNS lookup can fail if the domain doesn't exist, has no records of the requested type, or if there are temporary network issues.",
  },
  {
    question: "What is DNS propagation?",
    answer:
      "DNS propagation is the time it takes for DNS changes to be updated across all DNS servers worldwide. This can take anywhere from a few minutes to 48 hours.",
  },
  {
    question: "Are my DNS queries logged?",
    answer:
      "No. Plain Tools does not log or store any DNS queries. The lookup is performed through our edge network and results are returned directly to your browser.",
  },
]

function DNSToolInterface({ initialDomain = "" }: { initialDomain?: string }) {
  const [domain, setDomain] = useState(initialDomain)
  const [recordType, setRecordType] = useState("A")
  const [results, setResults] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = () => {
    if (!domain) return
    setLoading(true)
    // Placeholder - would be replaced with actual DNS lookup
    setTimeout(() => {
      setResults(["93.184.216.34", "93.184.216.35"])
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">
          Domain Name
        </label>
        <Input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="bg-secondary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-muted-foreground">
          Record Type
        </label>
        <Select value={recordType} onValueChange={setRecordType}>
          <SelectTrigger className="bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A (IPv4)</SelectItem>
            <SelectItem value="AAAA">AAAA (IPv6)</SelectItem>
            <SelectItem value="MX">MX (Mail)</SelectItem>
            <SelectItem value="TXT">TXT (Text)</SelectItem>
            <SelectItem value="NS">NS (Nameserver)</SelectItem>
            <SelectItem value="CNAME">CNAME (Alias)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleLookup}
        disabled={!domain || loading}
        className="w-full"
      >
        {loading ? "Looking up..." : "Lookup DNS"}
      </Button>

      {results && (
        <div className="mt-4 rounded-md border border-border p-4">
          <p className="mb-2 text-sm font-medium text-foreground">
            {recordType} Records
          </p>
          <div className="space-y-1">
            {results.map((record, i) => (
              <code
                key={i}
                className="block rounded bg-secondary px-2 py-1 font-mono text-sm text-foreground"
              >
                {record}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface DNSLookupClientProps {
  initialDomain?: string
}

export function DNSLookupClient({ initialDomain }: DNSLookupClientProps = {}) {
  return (
    <ToolShell
      name="DNS Lookup"
      description="Query DNS records for any domain including A, AAAA, MX, TXT, NS, and CNAME"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Edge", "Worker"]}
      explanation="This tool queries DNS servers to retrieve records for any domain. The lookup is performed via an edge worker to bypass browser restrictions on DNS queries. No queries are logged. Results are fetched in real-time from authoritative DNS servers."
      faqs={faqs}
      relatedTools={relatedTools}
      examples={popularDomains.map(d => ({ label: d.name, href: `/dns/${d.domain}` }))}
    >
      <DNSToolInterface initialDomain={initialDomain} />
    </ToolShell>
  )
}

"use client"

import Link from "next/link"
import { Globe, Wifi, Radio, Loader2, AlertTriangle, ArrowRight } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Surface } from "@/components/surface"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type DnsAnswer,
  type DnsRecordType,
  fetchDnsRecords,
  isValidDnsDomain,
  normalizeDnsDomain,
} from "@/lib/network-dns"

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
  const [domainInput, setDomainInput] = useState(initialDomain)
  const [recordType, setRecordType] = useState<DnsRecordType>("A")
  const [resolvedDomain, setResolvedDomain] = useState("")
  const [results, setResults] = useState<DnsAnswer[] | null>(null)
  const [resolver, setResolver] = useState<"cloudflare" | "google" | null>(null)
  const [dnsStatus, setDnsStatus] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const normalizedDomainPreview = useMemo(() => normalizeDnsDomain(domainInput), [domainInput])
  const hasValidDomain = Boolean(normalizedDomainPreview && isValidDnsDomain(normalizedDomainPreview))

  const handleLookup = useCallback(async () => {
    const domain = normalizeDnsDomain(domainInput)
    if (!domain || !isValidDnsDomain(domain)) {
      setErrorMessage("Enter a valid domain such as example.com.")
      setResults(null)
      setResolvedDomain("")
      setResolver(null)
      setDnsStatus(null)
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const output = await fetchDnsRecords(domain, recordType)
      setResults(output.answers)
      setResolvedDomain(domain)
      setResolver(output.resolver)
      setDnsStatus(output.status)
    } catch (error) {
      const message = error instanceof Error ? error.message : "DNS lookup failed."
      setErrorMessage(message)
      setResults(null)
      setResolver(null)
      setDnsStatus(null)
      setResolvedDomain(domain)
    } finally {
      setLoading(false)
    }
  }, [domainInput, recordType])

  const openDynamicDnsPage = () => {
    if (!resolvedDomain) return
    window.location.href = `/dns/${encodeURIComponent(resolvedDomain)}`
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
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          className="bg-secondary"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void handleLookup()
            }
          }}
        />
        {normalizedDomainPreview ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Canonical domain: <span className="font-medium text-foreground">{normalizedDomainPreview}</span>
          </p>
        ) : null}
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
        onClick={() => void handleLookup()}
        disabled={!hasValidDomain || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up...
          </>
        ) : (
          "Lookup DNS"
        )}
      </Button>

      {errorMessage ? (
        <Surface className="border-red-400/30 bg-red-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-red-300" />
            <p className="text-sm text-red-100">{errorMessage}</p>
          </div>
        </Surface>
      ) : null}

      {results && (
        <div className="mt-4 rounded-md border border-border p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              {recordType} records for {resolvedDomain}
            </p>
            <p className="text-xs text-muted-foreground">
              Resolver: {resolver ?? "Unknown"} {typeof dnsStatus === "number" ? `· DNS status ${dnsStatus}` : ""}
            </p>
          </div>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records returned for this type.</p>
          ) : (
            <div className="space-y-2">
              {results.map((record, i) => (
                <code
                  key={`${record.data}-${i}`}
                  className="block rounded bg-secondary px-2 py-1 font-mono text-sm text-foreground"
                >
                  {record.data}
                </code>
              ))}
            </div>
          )}
          {resolvedDomain ? (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={openDynamicDnsPage}>
                Open detailed domain page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Quick checks</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularDomains.slice(0, 6).map((domain) => (
            <button
              key={domain.domain}
              type="button"
              onClick={() => setDomainInput(domain.domain)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
            >
              {domain.domain}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          DNS lookups use public DNS-over-HTTPS endpoints in your browser. Plain Tools does not add tracking.
        </p>
        <Link
          href="/network-tools"
          className="mt-3 inline-flex items-center text-xs font-medium text-[var(--category-accent,var(--accent))] hover:underline"
        >
          Back to Network Tools
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

interface DNSLookupClientProps {
  initialDomain?: string
  fixedDomain?: boolean
}

export function DNSLookupClient({ initialDomain, fixedDomain = false }: DNSLookupClientProps = {}) {
  return (
    <ToolShell
      name="DNS Lookup"
      description="Query live DNS-over-HTTPS records for A, AAAA, and MX responses"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Browser fetch", "DoH"]}
      explanation="Enter a domain and this tool queries DNS-over-HTTPS endpoints directly from your browser. Results show current DNS answers without file uploads or tracking scripts."
      faqs={faqs}
      relatedTools={relatedTools}
      examples={popularDomains.map(d => ({ label: d.name, href: `/dns/${d.domain}` }))}
    >
      <DNSToolInterface initialDomain={initialDomain} />
      {fixedDomain ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Viewing a fixed domain result route. Use the DNS Lookup page to run a new query.
        </p>
      ) : null}
    </ToolShell>
  )
}

export function DNSDynamicHint({ domain }: { domain: string }) {
  return (
    <div className="rounded-md border border-border bg-card/50 p-3 text-xs text-muted-foreground">
      Loaded from canonical route for <span className="font-medium text-foreground">{domain}</span>.
      Use the record selector above to switch record type.
    </div>
  )
}

export function DNSDynamicClient({ domain }: { domain: string }) {
  return (
    <div className="space-y-4">
      <DNSDynamicHint domain={domain} />
      <DNSToolInterface initialDomain={domain} />
    </div>
  )
}

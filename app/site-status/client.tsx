"use client"

import { Globe, Server, Radio, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const relatedTools = [
  {
    name: "What is My IP",
    description: "View your public IP address",
    href: "/what-is-my-ip",
    tags: ["Local", "Edge"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query DNS records for any domain",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Test latency to any hostname",
    href: "/ping-test",
    tags: ["Edge", "Worker"],
    icon: <Radio className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "What does this tool check?",
    answer:
      "This tool sends an HTTP request to the specified URL and reports whether it responds successfully. It checks from our edge network, not your local connection.",
  },
  {
    question: "Why might a site appear down to me but up on this tool?",
    answer:
      "If a site is blocking your IP, region, or ISP, it may work for our edge workers but not for you. The reverse can also occur if there's a regional outage.",
  },
  {
    question: "Does this tool check HTTPS certificates?",
    answer:
      "Yes, if you check an HTTPS URL, the tool will report certificate issues as failures.",
  },
  {
    question: "How often can I check a site?",
    answer:
      "You can check as often as you need. Each check is performed fresh from our edge network with no caching.",
  },
]

// Popular sites for "Try these examples"
const popularStatusChecks = [
  { name: "ChatGPT", slug: "is-chatgpt-down" },
  { name: "Reddit", slug: "is-reddit-down" },
  { name: "Twitter/X", slug: "is-twitter-down" },
  { name: "Discord", slug: "is-discord-down" },
  { name: "YouTube", slug: "is-youtube-down" },
  { name: "Instagram", slug: "is-instagram-down" },
  { name: "Netflix", slug: "is-netflix-down" },
  { name: "Spotify", slug: "is-spotify-down" },
  { name: "GitHub", slug: "is-github-down" },
  { name: "AWS", slug: "is-aws-down" },
]

type Status = "idle" | "loading" | "up" | "down"

function SiteStatusToolInterface({ initialSite = "" }: { initialSite?: string }) {
  const [url, setUrl] = useState(initialSite)
  const [status, setStatus] = useState<Status>("idle")
  const [responseTime, setResponseTime] = useState<number | null>(null)

  useEffect(() => {
    if (initialSite) {
      handleCheck()
    }
  }, [])

  const handleCheck = () => {
    if (!url) return
    setStatus("loading")
    // Placeholder - would be replaced with actual check
    setTimeout(() => {
      setStatus("up")
      setResponseTime(142)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">
          Website URL
        </label>
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-secondary"
        />
      </div>

      <Button
        onClick={handleCheck}
        disabled={!url || status === "loading"}
        className="w-full bg-[var(--category-accent,var(--accent))] text-[var(--accent-foreground)] hover:bg-[var(--category-accent,var(--accent))]/90"
      >
        {status === "loading" ? "Checking..." : "Check Status"}
      </Button>

      {status !== "idle" && status !== "loading" && (
        <div className="mt-4 rounded-md border border-border p-6 text-center">
          {status === "up" ? (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-3 text-lg font-medium text-foreground">
                Site is Up
              </p>
              {responseTime && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Response time: {responseTime}ms
                </p>
              )}
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-3 text-lg font-medium text-foreground">
                Site is Down
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Could not connect to the server
              </p>
            </>
          )}
        </div>
      )}

      {status === "loading" && (
        <div className="mt-4 flex items-center justify-center rounded-md border border-border p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

interface SiteStatusClientProps {
  initialSite?: string
}

export function SiteStatusClient({ initialSite }: SiteStatusClientProps = {}) {
  return (
    <ToolShell
      name="Site Status"
      description="Check if a website is up, down, or experiencing issues"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Edge"]}
      explanation="This tool checks website availability from our global edge network. It sends an HTTP request and reports the response status. Note that results may differ from your local experience if there are regional issues or blocks."
      faqs={faqs}
      relatedTools={relatedTools}
      examples={popularStatusChecks.map(s => ({ label: `Is ${s.name} Down?`, href: `/status/${s.slug}` }))}
    >
      <SiteStatusToolInterface initialSite={initialSite} />
    </ToolShell>
  )
}

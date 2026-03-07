"use client"

import { Globe, Server, Radio, ArrowRight } from "lucide-react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  normalizeSiteInput,
  STATUS_EXAMPLE_SITES,
  STATUS_TRAFFIC_SITES,
  statusPathFor,
  type SiteStatusCheckResult,
} from "@/lib/site-status"

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
    question: "What does this checker test?",
    answer:
      "It performs a live HTTP probe to the domain and reports Up, Down, or Invalid website based on the response.",
  },
  {
    question: "Why is there a dedicated status page per domain?",
    answer:
      "Each domain gets a canonical route, such as /status/chatgpt.com, so you can share and revisit checks directly.",
  },
  {
    question: "Can I enter a URL instead of a domain?",
    answer:
      "Yes. Protocols, paths, and query strings are normalized. For example, https://www.google.com/search becomes google.com.",
  },
  {
    question: "Does this upload my files?",
    answer:
      "No files are uploaded. This tool only checks domain availability and response behaviour.",
  },
]

function SiteStatusToolInterface() {
  const router = useRouter()
  const [siteInput, setSiteInput] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<SiteStatusCheckResult | null>(null)

  const normalizedPreview = useMemo(() => normalizeSiteInput(siteInput), [siteInput])

  const runCheck = async (site: string) => {
    setIsChecking(true)
    setErrorMessage("")
    try {
      const response = await fetch(`/api/site-status?site=${encodeURIComponent(site)}`, {
        method: "GET",
        cache: "no-store",
      })
      const payload = (await response.json()) as SiteStatusCheckResult
      setResult(payload)
      if (!response.ok && payload.status === "invalid") {
        setErrorMessage("Invalid website. Enter a domain such as chatgpt.com")
      }
    } catch {
      setErrorMessage("Status check failed. Try again.")
      setResult(null)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = async () => {
    const normalized = normalizeSiteInput(siteInput)
    if (!normalized) {
      setErrorMessage("Enter a valid website such as chatgpt.com")
      setResult(null)
      return
    }

    setErrorMessage("")
    await runCheck(normalized)
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="status-site-input" className="mb-2 block text-sm text-muted-foreground">
          Website or domain
        </label>
        <Input
          id="status-site-input"
          type="text"
          placeholder="chatgpt.com or https://chatgpt.com"
          value={siteInput}
          onChange={(event) => setSiteInput(event.target.value)}
          className="bg-secondary"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              handleSubmit()
            }
          }}
        />
        {normalizedPreview ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Canonical domain: <span className="font-medium text-foreground">{normalizedPreview}</span>
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
        ) : null}
      </div>

      <Button
        onClick={() => void handleSubmit()}
        className="w-full bg-[var(--category-accent,var(--accent))] text-[var(--accent-foreground)] hover:bg-[var(--category-accent,var(--accent))]/90"
      >
        {isChecking ? "Checking..." : "Check Status"}
      </Button>

      {result ? (
        <div className="rounded-md border border-border bg-card/70 p-4">
          <h3 className="text-sm font-semibold text-foreground">Latest result</h3>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-md border border-border/60 bg-card/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
              <p className="mt-1 font-medium text-foreground">
                {result.status === "up" ? "Up" : result.status === "down" ? "Down" : "Invalid website"}
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-card/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">HTTP status</p>
              <p className="mt-1 font-medium text-foreground">{result.httpStatus ?? "N/A"}</p>
            </div>
            <div className="rounded-md border border-border/60 bg-card/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Response time</p>
              <p className="mt-1 font-medium text-foreground">
                {typeof result.responseTimeMs === "number" ? `${result.responseTimeMs} ms` : "N/A"}
              </p>
            </div>
            <div className="rounded-md border border-border/60 bg-card/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Last checked</p>
              <p className="mt-1 font-medium text-foreground">
                {result.checkedAt ? new Date(result.checkedAt).toLocaleTimeString() : "N/A"}
              </p>
            </div>
          </div>
          {normalizedPreview ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(statusPathFor(normalizedPreview))}
              >
                Open dedicated status page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">How to read the result</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Up</span>: the host responded to the latest probe.
          </li>
          <li>
            <span className="font-medium text-foreground">Down</span>: timeout or unavailable response at check time.
          </li>
          <li>
            <span className="font-medium text-foreground">Response time</span>: latest round-trip latency in milliseconds.
          </li>
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          A site can be up globally but still fail locally due to resolver, ISP routing, or firewall conditions.
        </p>
      </div>

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Popular checks</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {STATUS_EXAMPLE_SITES.map((site) => (
            <Link
              key={site}
              href={statusPathFor(site)}
              className="inline-flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
            >
              <span>Is {site} down?</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">High-demand status pages</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_TRAFFIC_SITES.map((site) => (
            <Link
              key={site}
              href={statusPathFor(site)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
            >
              Is {site} down?
            </Link>
          ))}
          <Link
            href="/status/trending"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground"
          >
            View trending checks
          </Link>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Network diagnostics</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Need more than uptime? Jump into DNS, IP, and latency checks in the same network toolkit.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/network-tools" className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground">
            Network tools hub
          </Link>
          <Link href="/dns-lookup" className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground">
            DNS lookup
          </Link>
          <Link href="/what-is-my-ip" className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground">
            What is my IP
          </Link>
          <Link href="/ping-test" className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[var(--category-accent,var(--accent))]/40 hover:text-foreground">
            Ping test
          </Link>
        </div>
      </div>
    </div>
  )
}

export function SiteStatusClient() {
  return (
    <ToolShell
      name="Site Status"
      description="Check whether a website is up, down, or invalid using a live availability probe."
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Edge", "Live check"]}
      explanation="Enter any domain and this tool normalizes it to a canonical status route. Checks run live and return current reachability plus response timing."
      faqs={faqs}
      relatedTools={relatedTools}
      examples={STATUS_EXAMPLE_SITES.map((site) => ({ label: `Is ${site} down?`, href: statusPathFor(site) }))}
    >
      <SiteStatusToolInterface />
    </ToolShell>
  )
}


"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Check,
  Copy,
  Globe,
  Loader2,
  Radio,
  RefreshCw,
  Server,
  Wifi,
} from "lucide-react"

import { Surface } from "@/components/surface"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidDnsDomain, normalizeDnsDomain } from "@/lib/network-dns"

type NetworkCardLink = {
  name: string
  description: string
  href: string
  tags: string[]
  icon: React.ReactNode
}

type DnsGroup = "A" | "AAAA" | "MX"

type DnsResultGroup = Record<DnsGroup, string[]>

type SiteStatusResult = {
  checkedUrl: string
  status: number
  ok: boolean
  responseTimeMs: number
}

type PingSample = {
  attempt: number
  connectMs: number
  roundTripMs?: number
}

const networkToolLinks: NetworkCardLink[] = [
  {
    name: "What Is My IP",
    description: "See the public IP your browser presents to public services.",
    href: "/tools/what-is-my-ip",
    tags: ["Browser", "Public API"],
    icon: <Globe className="h-4 w-4" />,
  },
  {
    name: "DNS Lookup",
    description: "Query Cloudflare DNS-over-HTTPS for A, AAAA, and MX records.",
    href: "/tools/dns-lookup",
    tags: ["DoH", "Cloudflare"],
    icon: <Server className="h-4 w-4" />,
  },
  {
    name: "Site Status Checker",
    description: "Run a direct browser HEAD request and measure response timing.",
    href: "/tools/site-status-checker",
    tags: ["HEAD", "Browser fetch"],
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    name: "Ping Test",
    description: "Measure WebSocket connect and echo timing to a public echo service.",
    href: "/tools/ping-test",
    tags: ["WebSocket", "Latency"],
    icon: <Radio className="h-4 w-4" />,
  },
]

const ipFaqs = [
  {
    question: "What does this tool send over the network?",
    answer:
      "It makes a simple request from your browser to public IP endpoints such as ipify to read the public IP they see. Plain Tools does not proxy or store the result.",
  },
  {
    question: "Is the result my exact location?",
    answer:
      "No. Your IP only reflects the public network address exposed by your ISP, VPN, or gateway. It does not reveal exact physical position on its own.",
  },
  {
    question: "Why might the value change?",
    answer:
      "Your public IP can change when you switch networks, reconnect through a different ISP route, or enable a VPN or mobile hotspot.",
  },
] as const

const dnsFaqs = [
  {
    question: "Which records does this page fetch?",
    answer:
      "This tool checks A, AAAA, and MX records through Cloudflare DNS-over-HTTPS so you can see address and mail-routing results together.",
  },
  {
    question: "Does Plain Tools run its own DNS resolver here?",
    answer:
      "No. Your browser sends the DoH requests directly to Cloudflare. Plain Tools does not add a server-side proxy for these lookups.",
  },
  {
    question: "Why might one record type be empty?",
    answer:
      "Many domains do not publish every record type. It is common to see A records but no AAAA records, or no MX records for domains that do not receive mail.",
  },
] as const

const siteStatusFaqs = [
  {
    question: "How does this status check work?",
    answer:
      "It sends a browser-side HEAD request to the URL you provide, measures elapsed time, and reports the status code if the target allows the request.",
  },
  {
    question: "Why do some websites fail even when they are up?",
    answer:
      "Many sites block cross-origin browser probes or do not allow HEAD requests. In those cases the tool shows a browser error rather than pretending the site is down.",
  },
  {
    question: "What should I test if I want a guaranteed result?",
    answer:
      "Use a same-origin path such as your current app origin, or a CORS-friendly endpoint such as httpbin. That verifies the tool and gives you a reliable baseline.",
  },
] as const

const pingFaqs = [
  {
    question: "Is this a real ICMP ping?",
    answer:
      "No. Browsers cannot send raw ICMP packets. This tool measures WebSocket connect time and, when available, echo round trips to a public WebSocket endpoint.",
  },
  {
    question: "What does the round-trip number mean?",
    answer:
      "If the endpoint echoes a message back, the round-trip value estimates how long one tiny WebSocket message takes to go out and return to your browser.",
  },
  {
    question: "Why might I only see connect times?",
    answer:
      "Some endpoints accept WebSocket connections but do not echo messages. In that case the tool still reports the connection handshake latency.",
  },
] as const

const ipExamples = ["8.8.8.8", "1.1.1.1", "9.9.9.9"] as const
const dnsExamples = ["plain.tools", "openai.com", "cloudflare.com"] as const
const siteStatusExamples = [
  "/site.webmanifest",
  "https://httpbin.org/status/204",
  "https://example.com",
] as const
const websocketExamples = [
  "wss://ws.postman-echo.com/raw",
  "wss://echo.websocket.events",
  "wss://ws.ifelse.io",
] as const

const DEFAULT_PING_ENDPOINTS = [...websocketExamples]

function buildRelatedTools(currentHref: string) {
  return networkToolLinks.filter((tool) => tool.href !== currentHref)
}

function parseConnectionInfo() {
  if (typeof navigator === "undefined") return null

  const rawConnection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string
        downlink?: number
        rtt?: number
        saveData?: boolean
      }
      mozConnection?: {
        effectiveType?: string
        downlink?: number
        rtt?: number
        saveData?: boolean
      }
      webkitConnection?: {
        effectiveType?: string
        downlink?: number
        rtt?: number
        saveData?: boolean
      }
    }
  ).connection ??
    (navigator as Navigator & { mozConnection?: unknown }).mozConnection ??
    (navigator as Navigator & { webkitConnection?: unknown }).webkitConnection

  if (!rawConnection || typeof rawConnection !== "object") return null

  const connection = rawConnection as {
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }

  return {
    effectiveType: connection.effectiveType ?? "Unknown",
    downlink:
      typeof connection.downlink === "number" ? `${connection.downlink} Mbps` : "Unknown",
    rtt: typeof connection.rtt === "number" ? `${connection.rtt} ms` : "Unknown",
    saveData: connection.saveData ? "Enabled" : "Disabled",
  }
}

function formatDnsAnswers(rawAnswers: unknown) {
  if (!Array.isArray(rawAnswers)) return []

  return rawAnswers
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null
      const record = entry as Record<string, unknown>
      return typeof record.data === "string" ? record.data : null
    })
    .filter((record): record is string => Boolean(record))
}

function normalizeStatusUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""

  if (trimmed.startsWith("/") && typeof window !== "undefined") {
    try {
      return new URL(trimmed, window.location.origin).toString()
    } catch {
      return ""
    }
  }

  const withProtocol = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(withProtocol)
    if (!/^https?:$/.test(parsed.protocol)) return ""
    return parsed.toString()
  } catch {
    return ""
  }
}

function normalizeWebSocketUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""

  if (/^wss?:\/\//i.test(trimmed)) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/^http/i, "ws")
  return `wss://${trimmed}`
}

async function measurePingSample(endpoint: string, timeoutMs = 5000) {
  return await new Promise<PingSample>((resolve, reject) => {
    const socket = new WebSocket(endpoint)
    const startedAt = performance.now()
    let connectMs: number | null = null
    let settled = false
    let echoTimer = 0

    const cleanup = () => {
      window.clearTimeout(timeoutHandle)
      if (echoTimer) {
        window.clearTimeout(echoTimer)
      }
      try {
        socket.close()
      } catch {}
    }

    const finish = (sample: PingSample) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(sample)
    }

    const fail = (message: string) => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(message))
    }

    const timeoutHandle = window.setTimeout(() => {
      fail("Timed out while waiting for the WebSocket endpoint.")
    }, timeoutMs)

    socket.addEventListener("open", () => {
      connectMs = Math.round(performance.now() - startedAt)
      const pingStartedAt = performance.now()

      try {
        socket.send(`plain-tools-ping:${Date.now()}`)
        echoTimer = window.setTimeout(() => {
          finish({
            attempt: 0,
            connectMs: connectMs ?? Math.round(performance.now() - startedAt),
          })
        }, 900)
      } catch {
        finish({
          attempt: 0,
          connectMs: connectMs ?? Math.round(performance.now() - startedAt),
        })
      }

      socket.addEventListener(
        "message",
        () => {
          finish({
            attempt: 0,
            connectMs: connectMs ?? Math.round(performance.now() - startedAt),
            roundTripMs: Math.round(performance.now() - pingStartedAt),
          })
        },
        { once: true }
      )
    })

    socket.addEventListener("error", () => {
      fail("The WebSocket endpoint rejected the connection.")
    })
  })
}

function WhatIsMyIPInterface() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [checkedAt, setCheckedAt] = useState("")
  const [connectionInfo, setConnectionInfo] = useState<ReturnType<typeof parseConnectionInfo>>(null)

  useEffect(() => {
    setConnectionInfo(parseConnectionInfo())
  }, [])

  const runLookup = useCallback(async () => {
    setLoading(true)
    setErrorMessage("")

    const controller = new AbortController()
    const timeoutHandle = window.setTimeout(() => controller.abort(), 8000)

    try {
      const endpoints = [
        "https://api.ipify.org?format=json",
        "https://api64.ipify.org?format=json",
      ]

      let detectedIp = ""
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          })
          if (!response.ok) continue

          const payload = (await response.json()) as { ip?: string }
          if (typeof payload.ip === "string" && payload.ip.length > 0) {
            detectedIp = payload.ip
            break
          }
        } catch {
          // Try the next public endpoint.
        }
      }

      if (!detectedIp) {
        throw new Error("Public IP lookup failed on the available public endpoints.")
      }

      setIp(detectedIp)
      setCheckedAt(new Date().toISOString())
    } catch (error) {
      const message = error instanceof Error ? error.message : "Public IP lookup failed."
      setErrorMessage(message)
      setIp("")
    } finally {
      window.clearTimeout(timeoutHandle)
      setLoading(false)
    }
  }, [])

  const copyIp = useCallback(async () => {
    if (!ip) return
    await navigator.clipboard.writeText(ip)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }, [ip])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Public IP address</p>
        <Button variant="outline" size="sm" onClick={() => void runLookup()} disabled={loading}>
          {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-md border border-border bg-secondary px-4 py-3 font-mono text-lg text-foreground">
          {loading ? "Detecting..." : ip || "Not checked yet"}
        </code>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0"
          onClick={() => void copyIp()}
          disabled={!ip}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {errorMessage ? (
        <Surface className="border-red-400/30 bg-red-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-red-300" />
            <p className="text-sm text-red-100">{errorMessage}</p>
          </div>
        </Surface>
      ) : null}

      <div className="space-y-3 rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Browser-reported connection hints</h3>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-border/60 bg-card/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Network type</p>
            <p className="mt-1 text-foreground">{connectionInfo?.effectiveType ?? "Unknown"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-card/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Downlink</p>
            <p className="mt-1 text-foreground">{connectionInfo?.downlink ?? "Unknown"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-card/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">RTT hint</p>
            <p className="mt-1 text-foreground">{connectionInfo?.rtt ?? "Unknown"}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-card/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Save-Data</p>
            <p className="mt-1 text-foreground">{connectionInfo?.saveData ?? "Unknown"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Related IP examples</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {ipExamples.map((example) => (
            <Link
              key={example}
              href={`/ip/${example}`}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              {example}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This tool makes a direct request from your browser to public IP services. No Plain Tools server proxy is involved.
        </p>
        {checkedAt ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Last checked: {new Date(checkedAt).toLocaleTimeString()}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function DNSLookupInterface() {
  const [domainInput, setDomainInput] = useState("")
  const [resolvedDomain, setResolvedDomain] = useState("")
  const [results, setResults] = useState<DnsResultGroup | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const normalizedDomain = useMemo(() => normalizeDnsDomain(domainInput), [domainInput])
  const validDomain = normalizedDomain && isValidDnsDomain(normalizedDomain)

  const runLookup = useCallback(async () => {
    if (!validDomain) {
      setErrorMessage("Enter a valid domain such as plain.tools.")
      setResults(null)
      setResolvedDomain("")
      return
    }

    setLoading(true)
    setErrorMessage("")

    const controller = new AbortController()
    const timeoutHandle = window.setTimeout(() => controller.abort(), 8000)

    try {
      const recordTypes: DnsGroup[] = ["A", "AAAA", "MX"]
      const responses = await Promise.all(
        recordTypes.map(async (recordType) => {
          const response = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(normalizedDomain)}&type=${recordType}`,
            {
              method: "GET",
              headers: {
                accept: "application/dns-json",
              },
              cache: "no-store",
              signal: controller.signal,
            }
          )

          if (!response.ok) {
            throw new Error(`Cloudflare DNS lookup failed with status ${response.status}.`)
          }

          const payload = (await response.json()) as { Answer?: unknown }
          return [recordType, formatDnsAnswers(payload.Answer)] as const
        })
      )

      const nextResults = responses.reduce<DnsResultGroup>(
        (accumulator, [recordType, answers]) => ({
          ...accumulator,
          [recordType]: answers,
        }),
        {
          A: [],
          AAAA: [],
          MX: [],
        }
      )

      setResults(nextResults)
      setResolvedDomain(normalizedDomain)
    } catch (error) {
      const message = error instanceof Error ? error.message : "DNS lookup failed."
      setErrorMessage(message)
      setResults(null)
      setResolvedDomain(normalizedDomain)
    } finally {
      window.clearTimeout(timeoutHandle)
      setLoading(false)
    }
  }, [normalizedDomain, validDomain])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="dns-domain-input" className="mb-2 block text-sm text-muted-foreground">
          Domain
        </label>
        <Input
          id="dns-domain-input"
          type="text"
          placeholder="plain.tools"
          value={domainInput}
          onChange={(event) => setDomainInput(event.target.value)}
          className="bg-secondary"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void runLookup()
            }
          }}
        />
        {normalizedDomain ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Normalised domain: <span className="font-medium text-foreground">{normalizedDomain}</span>
          </p>
        ) : null}
      </div>

      <Button onClick={() => void runLookup()} disabled={!validDomain || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up records
          </>
        ) : (
          "Lookup A, AAAA, and MX"
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

      {results ? (
        <div className="space-y-3 rounded-md border border-border bg-card/60 p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Cloudflare DoH results</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Showing A, AAAA, and MX records for <span className="font-medium text-foreground">{resolvedDomain}</span>.
            </p>
          </div>
          {(["A", "AAAA", "MX"] as const).map((recordType) => (
            <div key={recordType} className="rounded-md border border-border/60 bg-card/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{recordType} records</p>
                <span className="text-xs text-muted-foreground">{results[recordType].length} found</span>
              </div>
              <div className="mt-3 space-y-2">
                {results[recordType].length > 0 ? (
                  results[recordType].map((answer) => (
                    <code
                      key={`${recordType}-${answer}`}
                      className="block rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {answer}
                    </code>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No {recordType} records returned.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Quick domains</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {dnsExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setDomainInput(example)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Your browser sends the lookup directly to Cloudflare DNS-over-HTTPS. Plain Tools does not add its own DNS proxy here.
        </p>
      </div>
    </div>
  )
}

function SiteStatusInterface() {
  const [urlInput, setUrlInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [result, setResult] = useState<SiteStatusResult | null>(null)

  const normalizedUrl = useMemo(() => normalizeStatusUrl(urlInput), [urlInput])

  const runCheck = useCallback(async () => {
    if (!normalizedUrl) {
      setErrorMessage("Enter a valid http:// or https:// URL.")
      setResult(null)
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const startedAt = performance.now()
      const response = await fetch(normalizedUrl, {
        method: "HEAD",
        cache: "no-store",
      })

      setResult({
        checkedUrl: normalizedUrl,
        status: response.status,
        ok: response.ok,
        responseTimeMs: Math.round(performance.now() - startedAt),
      })
    } catch {
      setResult(null)
      setErrorMessage(
        "Browser HEAD request failed. The target may block cross-origin probes or HEAD requests. Try a same-origin URL or a CORS-friendly endpoint."
      )
    } finally {
      setLoading(false)
    }
  }, [normalizedUrl])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="site-status-input" className="mb-2 block text-sm text-muted-foreground">
          URL to check
        </label>
        <Input
          id="site-status-input"
          type="text"
          placeholder="https://example.com"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          className="bg-secondary"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void runCheck()
            }
          }}
        />
        {normalizedUrl ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Normalised URL: <span className="font-medium text-foreground">{normalizedUrl}</span>
          </p>
        ) : null}
      </div>

      <Button onClick={() => void runCheck()} disabled={!normalizedUrl || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking status
          </>
        ) : (
          "Run HEAD check"
        )}
      </Button>

      {errorMessage ? (
        <Surface className="border-amber-400/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
            <p className="text-sm text-amber-100">{errorMessage}</p>
          </div>
        </Surface>
      ) : null}

      {result ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Surface className="border-border/60 bg-card/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{result.status}</p>
          </Surface>
          <Surface className="border-border/60 bg-card/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Availability</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{result.ok ? "Reachable" : "Error response"}</p>
          </Surface>
          <Surface className="border-border/60 bg-card/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Response time</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{result.responseTimeMs} ms</p>
          </Surface>
          <div className="sm:col-span-3 rounded-md border border-border bg-card/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Checked URL</p>
            <code className="mt-2 block rounded bg-secondary px-3 py-2 font-mono text-xs text-foreground">
              {result.checkedUrl}
            </code>
          </div>
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Quick endpoints</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {siteStatusExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setUrlInput(example)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This tool only performs a browser-side HEAD request. If a site blocks CORS or HEAD, the browser will stop the check before any reliable status result is exposed.
        </p>
      </div>
    </div>
  )
}

function PingTestInterface() {
  const [endpointInput, setEndpointInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeEndpoint, setActiveEndpoint] = useState("")
  const [samples, setSamples] = useState<PingSample[]>([])

  const normalizedEndpoint = useMemo(() => normalizeWebSocketUrl(endpointInput), [endpointInput])

  const runPing = useCallback(async () => {
    setLoading(true)
    setErrorMessage("")
    setSamples([])

    const candidates =
      normalizedEndpoint.length > 0 ? [normalizedEndpoint] : DEFAULT_PING_ENDPOINTS

    try {
      let resolvedEndpoint = ""
      const nextSamples: PingSample[] = []

      for (const candidate of candidates) {
        try {
          for (let attempt = 1; attempt <= 4; attempt += 1) {
            const sample = await measurePingSample(candidate)
            nextSamples.push({
              ...sample,
              attempt,
            })
          }
          resolvedEndpoint = candidate
          break
        } catch {
          nextSamples.length = 0
        }
      }

      if (!resolvedEndpoint || nextSamples.length === 0) {
        throw new Error("No WebSocket endpoint responded. Try one of the example echo services.")
      }

      setActiveEndpoint(resolvedEndpoint)
      setSamples(nextSamples)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Latency measurement failed."
      setErrorMessage(message)
      setActiveEndpoint("")
      setSamples([])
    } finally {
      setLoading(false)
    }
  }, [normalizedEndpoint])

  const averageConnect =
    samples.length > 0
      ? Math.round(samples.reduce((sum, sample) => sum + sample.connectMs, 0) / samples.length)
      : null

  const roundTripSamples = samples.filter((sample) => typeof sample.roundTripMs === "number")
  const averageRoundTrip =
    roundTripSamples.length > 0
      ? Math.round(
          roundTripSamples.reduce((sum, sample) => sum + (sample.roundTripMs ?? 0), 0) /
            roundTripSamples.length
        )
      : null

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="ping-endpoint-input" className="mb-2 block text-sm text-muted-foreground">
          WebSocket endpoint
        </label>
        <Input
          id="ping-endpoint-input"
          type="text"
          placeholder="Leave blank to use public echo defaults"
          value={endpointInput}
          onChange={(event) => setEndpointInput(event.target.value)}
          className="bg-secondary"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void runPing()
            }
          }}
        />
        {normalizedEndpoint ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Normalised endpoint: <span className="font-medium text-foreground">{normalizedEndpoint}</span>
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Default fallback order: {DEFAULT_PING_ENDPOINTS.join(" → ")}
          </p>
        )}
      </div>

      <Button onClick={() => void runPing()} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Measuring latency
          </>
        ) : (
          "Run WebSocket test"
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

      {samples.length > 0 ? (
        <div className="space-y-3 rounded-md border border-border bg-card/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Latest WebSocket run</h3>
              <p className="mt-1 text-xs text-muted-foreground">{activeEndpoint}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border px-3 py-1 text-foreground">
                Avg connect: {averageConnect} ms
              </span>
              {averageRoundTrip !== null ? (
                <span className="rounded-full border border-border px-3 py-1 text-foreground">
                  Avg round trip: {averageRoundTrip} ms
                </span>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            {samples.map((sample) => (
              <div
                key={`${sample.attempt}-${sample.connectMs}-${sample.roundTripMs ?? "none"}`}
                className="grid grid-cols-3 gap-3 rounded-md border border-border/60 bg-card/50 px-3 py-2 text-xs"
              >
                <span className="text-muted-foreground">Attempt {sample.attempt}</span>
                <span className="text-foreground">Connect {sample.connectMs} ms</span>
                <span className="text-foreground">
                  {typeof sample.roundTripMs === "number"
                    ? `Echo ${sample.roundTripMs} ms`
                    : "No echo response"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-card/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Public echo endpoints</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {websocketExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setEndpointInput(example)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This is a browser-side latency estimate based on WebSocket handshake and, when possible, an echoed message. It is not raw ICMP.
        </p>
      </div>
    </div>
  )
}

export function WhatIsMyIPToolClient() {
  return (
    <ToolShell
      name="What Is My IP"
      description="Fetch your public IP from public endpoints and show browser-reported connection hints."
      category={{ name: "Tools", href: "/tools", type: "network" }}
      tags={["Client-side", "Public API", "No account"]}
      explanation="This tool runs entirely in your browser. It queries public IP endpoints directly, then displays the result alongside any connection metadata your browser already exposes."
      faqs={[...ipFaqs]}
      relatedTools={buildRelatedTools("/tools/what-is-my-ip")}
      schemaPath="/tools/what-is-my-ip"
      schemaFeatureList={[
        "Direct public IP lookup from the browser",
        "Optional browser connection hints when supported",
        "Copyable IP result with no Plain Tools server proxy",
      ]}
    >
      <WhatIsMyIPInterface />
    </ToolShell>
  )
}

export function DNSLookupToolClient() {
  return (
    <ToolShell
      name="DNS Lookup"
      description="Query Cloudflare DNS-over-HTTPS for A, AAAA, and MX records without leaving the browser."
      category={{ name: "Tools", href: "/tools", type: "network" }}
      tags={["DoH", "A / AAAA / MX", "Client-side"]}
      explanation="Enter a domain and your browser requests A, AAAA, and MX records directly from Cloudflare DNS-over-HTTPS. Plain Tools does not proxy or store those DNS queries."
      faqs={[...dnsFaqs]}
      relatedTools={buildRelatedTools("/tools/dns-lookup")}
      schemaPath="/tools/dns-lookup"
      schemaFeatureList={[
        "Direct browser DNS-over-HTTPS requests",
        "Grouped A, AAAA, and MX results in one run",
        "No server-side proxy added by Plain Tools",
      ]}
    >
      <DNSLookupInterface />
    </ToolShell>
  )
}

export function SiteStatusCheckerToolClient() {
  return (
    <ToolShell
      name="Site Status Checker"
      description="Run a direct browser HEAD request, then review HTTP status and response timing."
      category={{ name: "Tools", href: "/tools", type: "network" }}
      tags={["HEAD", "Response timing", "Privacy-first"]}
      explanation="This checker performs a direct browser HEAD request to the URL you enter. It is private by design because there is no Plain Tools proxy, but that also means sites can block the check through CORS or HEAD restrictions."
      faqs={[...siteStatusFaqs]}
      relatedTools={buildRelatedTools("/tools/site-status-checker")}
      schemaPath="/tools/site-status-checker"
      schemaFeatureList={[
        "Direct browser HEAD requests",
        "Status code and response-time display",
        "No server-side relay by Plain Tools",
      ]}
    >
      <SiteStatusInterface />
    </ToolShell>
  )
}

export function PingTestToolClient() {
  return (
    <ToolShell
      name="Ping Test"
      description="Measure WebSocket connect latency and echo round trips from your browser."
      category={{ name: "Tools", href: "/tools", type: "network" }}
      tags={["WebSocket", "Latency", "Browser-only"]}
      explanation="Browsers cannot send raw ICMP. This tool uses public WebSocket echo endpoints to estimate latency with connection-handshake timing and optional echo round trips, all from your browser."
      faqs={[...pingFaqs]}
      relatedTools={buildRelatedTools("/tools/ping-test")}
      schemaPath="/tools/ping-test"
      schemaFeatureList={[
        "WebSocket connect timing from the browser",
        "Optional echo round-trip timing when supported",
        "Fallback across public echo endpoints",
      ]}
    >
      <PingTestInterface />
    </ToolShell>
  )
}

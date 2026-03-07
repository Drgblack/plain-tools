"use client"

import { Server, Wifi, Radio, Copy, Check, Loader2, RefreshCw, AlertTriangle } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { Surface } from "@/components/surface"

const relatedTools = [
  {
    name: "DNS Lookup",
    description: "Query DNS records for any domain",
    href: "/dns-lookup",
    tags: ["Edge", "Worker"],
    icon: <Server className="h-4 w-4" />,
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

const faqs = [
  {
    question: "What is an IP address?",
    answer:
      "An IP address is a unique identifier assigned to your device when you connect to the internet. It allows other devices and servers to know where to send data you request.",
  },
  {
    question: "Is my IP address private?",
    answer:
      "Your public IP address is visible to any website you visit. This tool shows what websites see when you connect. Use a VPN if you want to mask your real IP.",
  },
  {
    question: "Why does my location look wrong?",
    answer:
      "IP geolocation is approximate and based on database lookups. It may show your ISP's location rather than your actual physical location.",
  },
  {
    question: "What is the difference between IPv4 and IPv6?",
    answer:
      "IPv4 addresses use 32 bits (e.g., 192.168.1.1), while IPv6 uses 128 bits (e.g., 2001:0db8:85a3::8a2e:0370:7334). IPv6 was created to address the exhaustion of IPv4 addresses.",
  },
  {
    question: "Can websites track me using my IP address?",
    answer:
      "Yes, websites can use your IP address to approximate your location and potentially identify your ISP. For enhanced privacy, consider using a VPN or Tor browser.",
  },
]

// Well-known IPs for "Try these examples"
const wellKnownIPs = [
  { ip: "8.8.8.8", name: "Google DNS" },
  { ip: "1.1.1.1", name: "Cloudflare DNS" },
  { ip: "208.67.222.222", name: "OpenDNS" },
  { ip: "9.9.9.9", name: "Quad9 DNS" },
  { ip: "1.0.0.1", name: "Cloudflare DNS Secondary" },
  { ip: "8.8.4.4", name: "Google DNS Secondary" },
]

function IPToolInterface() {
  const [publicIp, setPublicIp] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [checkedAt, setCheckedAt] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const connectionInfo = useMemo(() => {
    if (typeof navigator === "undefined") return null
    const connection = (
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

    if (!connection || typeof connection !== "object") return null
    const value = connection as {
      effectiveType?: string
      downlink?: number
      rtt?: number
      saveData?: boolean
    }

    return {
      effectiveType: value.effectiveType ?? "Unknown",
      downlink: typeof value.downlink === "number" ? `${value.downlink} Mbps` : "Unknown",
      rtt: typeof value.rtt === "number" ? `${value.rtt} ms` : "Unknown",
      saveData: value.saveData === true ? "Enabled" : "Disabled",
    }
  }, [])

  const fetchPublicIp = useCallback(async () => {
    setLoading(true)
    setErrorMessage("")

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const endpoints = [
        "https://api.ipify.org?format=json",
        "https://api64.ipify.org?format=json",
      ]

      let resolvedIp: string | null = null

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          })
          if (!response.ok) continue
          const payload = (await response.json()) as { ip?: string }
          if (typeof payload.ip === "string" && payload.ip) {
            resolvedIp = payload.ip
            break
          }
        } catch {
          // Try the next endpoint.
        }
      }

      if (!resolvedIp) {
        throw new Error("Could not detect your public IP right now.")
      }

      setPublicIp(resolvedIp)
      setCheckedAt(new Date().toISOString())
    } catch (error) {
      const message = error instanceof Error ? error.message : "IP lookup failed."
      setErrorMessage(message)
      setPublicIp(null)
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchPublicIp()
  }, [fetchPublicIp])

  const handleCopy = () => {
    if (!publicIp) return
    navigator.clipboard.writeText(publicIp)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Your public IP address</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchPublicIp()}
            disabled={loading}
            className="h-8"
          >
            {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-secondary px-4 py-3 font-mono text-lg text-foreground">
            {loading ? "Detecting..." : publicIp ?? "Unavailable"}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="h-12 w-12 shrink-0"
            disabled={!publicIp}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <Surface className="border-red-400/30 bg-red-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-red-300" />
            <p className="text-sm text-red-100">{errorMessage}</p>
          </div>
        </Surface>
      ) : null}

      <div className="space-y-3 rounded-md border border-border p-4">
        <h3 className="text-sm font-medium text-foreground">Connection details (when available)</h3>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Network type</span>
          <span className="text-sm text-foreground">{connectionInfo?.effectiveType ?? "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Downlink</span>
          <span className="text-sm text-foreground">{connectionInfo?.downlink ?? "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">RTT</span>
          <span className="text-sm text-foreground">{connectionInfo?.rtt ?? "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Save-Data</span>
          <span className="text-sm text-foreground">{connectionInfo?.saveData ?? "Unknown"}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        This checks your public IP through a lightweight endpoint and shows optional connection hints from your browser. No tracking is added.
      </p>
      {checkedAt ? (
        <p className="text-xs text-muted-foreground">Last checked: {new Date(checkedAt).toLocaleTimeString()}</p>
      ) : null}
    </div>
  )
}

interface IPLookupClientProps {
  initialAddress?: string
}

export function WhatIsMyIPClient() {
  return (
    <ToolShell
      name="What Is My IP Address"
      description="View your public IP address and basic browser-provided connection details"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Local", "Edge"]}
      explanation="This tool fetches your public IP from a simple IP endpoint and displays network details your browser already exposes (if supported). No files are involved and no tracking scripts are added."
      faqs={faqs}
      relatedTools={relatedTools}
      examples={wellKnownIPs.map(i => ({ label: `${i.ip} (${i.name})`, href: `/ip/${i.ip}` }))}
    >
      <IPToolInterface />
    </ToolShell>
  )
}

// Export for dynamic route usage
export function IPLookupClient({ initialAddress }: IPLookupClientProps = {}) {
  return (
    <ToolShell
      name={initialAddress ? `IP Address ${initialAddress}` : "IP Lookup"}
      description={initialAddress ? `Information about IP address ${initialAddress}` : "Look up information about any IP address"}
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Local", "Edge"]}
      explanation="This tool provides information about IP addresses including geolocation data derived from IP databases. The location is approximate and may show the ISP's location rather than the actual physical location of the device."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <IPToolInterface />
    </ToolShell>
  )
}

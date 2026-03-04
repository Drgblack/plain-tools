"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Loader2 } from "lucide-react"

interface IPDynamicClientProps {
  address: string
}

interface IPInfo {
  ip: string
  city: string
  region: string
  country: string
  isp: string
  org: string
  asn: string
  type: string
}

export function IPDynamicClient({ address }: IPDynamicClientProps) {
  const [loading, setLoading] = useState(true)
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading IP info
    setTimeout(() => {
      // Mock data based on well-known IPs
      const mockData: Record<string, IPInfo> = {
        "8.8.8.8": {
          ip: "8.8.8.8",
          city: "Mountain View",
          region: "California",
          country: "United States",
          isp: "Google LLC",
          org: "Google Public DNS",
          asn: "AS15169",
          type: "Anycast DNS",
        },
        "1.1.1.1": {
          ip: "1.1.1.1",
          city: "San Francisco",
          region: "California",
          country: "United States",
          isp: "Cloudflare, Inc.",
          org: "Cloudflare DNS",
          asn: "AS13335",
          type: "Anycast DNS",
        },
      }

      setIpInfo(mockData[address] || {
        ip: address,
        city: "Unknown",
        region: "Unknown",
        country: "Unknown",
        isp: "Unknown ISP",
        org: "Unknown Organization",
        asn: "Unknown",
        type: "Unknown",
      })
      setLoading(false)
    }, 600)
  }, [address])

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ipInfo) return null

  return (
    <div className="space-y-4">
      {/* IP Address with copy */}
      <div className="flex items-center gap-3">
        <code className="flex-1 rounded-md bg-secondary px-4 py-3 font-mono text-lg text-foreground">
          {address}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="h-12 w-12 shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Location Info */}
      <div className="space-y-3 rounded-md border border-border p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">City</span>
          <span className="text-sm text-foreground">{ipInfo.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Region</span>
          <span className="text-sm text-foreground">{ipInfo.region}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Country</span>
          <span className="text-sm text-foreground">{ipInfo.country}</span>
        </div>
        <div className="border-t border-border my-2" />
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">ISP</span>
          <span className="text-sm text-foreground">{ipInfo.isp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Organization</span>
          <span className="text-sm text-foreground">{ipInfo.org}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">ASN</span>
          <span className="text-sm text-foreground font-mono">{ipInfo.asn}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm text-foreground">{ipInfo.type}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Location data is approximate and based on IP geolocation databases.
      </p>
    </div>
  )
}

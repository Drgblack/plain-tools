"use client"

import { Globe, Server, Wifi, Radio, Copy, Check } from "lucide-react"
import { useState } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"

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
  const [copied, setCopied] = useState(false)
  // Placeholder IP data - would be replaced with actual detection
  const ipData = {
    ip: "192.168.1.1",
    city: "San Francisco",
    region: "California",
    country: "United States",
    isp: "Example ISP",
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(ipData.ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Your IP Address</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-md bg-secondary px-4 py-3 font-mono text-lg text-foreground">
            {ipData.ip}
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
      </div>

      <div className="space-y-3 rounded-md border border-border p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">City</span>
          <span className="text-sm text-foreground">{ipData.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Region</span>
          <span className="text-sm text-foreground">{ipData.region}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Country</span>
          <span className="text-sm text-foreground">{ipData.country}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">ISP</span>
          <span className="text-sm text-foreground">{ipData.isp}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Location data is approximate and based on IP geolocation databases.
      </p>
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
      description="View your public IP address and approximate location information"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Local", "Edge"]}
      explanation="This tool detects your public IP address using a lightweight edge function. Your IP is the address assigned to your connection by your ISP and is visible to any website you visit. The location data is derived from IP geolocation databases and is approximate. No data is stored or logged."
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

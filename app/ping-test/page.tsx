"use client"

import { Globe, Server, Wifi } from "lucide-react"
import { useState } from "react"
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
    name: "Site Status",
    description: "Check if a website is up or down",
    href: "/site-status",
    tags: ["Edge"],
    icon: <Wifi className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "What does ping measure?",
    answer:
      "Ping measures the round-trip time (RTT) for data to travel from our servers to the target host and back. Lower values indicate faster connections.",
  },
  {
    question: "Why can't browsers send ICMP pings directly?",
    answer:
      "For security reasons, browsers cannot send ICMP packets. This tool uses edge workers to perform the ping and report results.",
  },
  {
    question: "What is considered a good ping time?",
    answer:
      "Under 50ms is excellent, 50-100ms is good, 100-200ms is acceptable, and over 200ms may feel slow for interactive applications.",
  },
]

interface PingResult {
  seq: number
  time: number
}

function PingToolInterface() {
  const [host, setHost] = useState("")
  const [results, setResults] = useState<PingResult[]>([])
  const [running, setRunning] = useState(false)

  const handlePing = () => {
    if (!host) return
    setRunning(true)
    setResults([])

    // Placeholder - simulates multiple ping results
    let seq = 1
    const interval = setInterval(() => {
      setResults((prev) => [
        ...prev,
        { seq, time: Math.floor(Math.random() * 50) + 20 },
      ])
      seq++
      if (seq > 4) {
        clearInterval(interval)
        setRunning(false)
      }
    }, 500)
  }

  const avgTime =
    results.length > 0
      ? Math.round(results.reduce((a, b) => a + b.time, 0) / results.length)
      : null

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">
          Hostname or IP
        </label>
        <Input
          type="text"
          placeholder="example.com or 1.1.1.1"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="bg-secondary"
        />
      </div>

      <Button
        onClick={handlePing}
        disabled={!host || running}
        className="w-full"
      >
        {running ? "Pinging..." : "Start Ping"}
      </Button>

      {results.length > 0 && (
        <div className="mt-4 rounded-md border border-border p-4">
          <div className="space-y-1 font-mono text-sm">
            {results.map((result) => (
              <div
                key={result.seq}
                className="flex justify-between text-muted-foreground"
              >
                <span>seq={result.seq}</span>
                <span className="text-foreground">{result.time}ms</span>
              </div>
            ))}
          </div>

          {!running && avgTime !== null && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average</span>
                <span className="font-medium text-foreground">{avgTime}ms</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PingTestPage() {
  return (
    <ToolShell
      name="Ping Test"
      description="Test latency and response time to any hostname or IP address"
      category={{ name: "Network Tools", href: "/network-tools", type: "network" }}
      tags={["Edge", "Worker"]}
      explanation="This tool measures the round-trip time (RTT) to a target host. Since browsers cannot send ICMP packets directly, the ping is performed from our edge network and results are streamed back to you."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <PingToolInterface />
    </ToolShell>
  )
}

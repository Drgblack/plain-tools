import type { Metadata } from "next"

import { NetworkToolPage } from "@/components/seo/network-tool-page"
import { PingTestToolClient } from "@/components/tools/network-tools-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Ping test tool",
  description:
    "Measure browser-side WebSocket latency with public echo endpoints, including connect timing and optional round-trip results.",
  path: "/tools/ping-test",
  image: "/og/default.png",
})

export default function PingTestToolPage() {
  return (
    <NetworkToolPage
      title="Ping Test"
      intro={[
        "Use this page when you need a quick browser-friendly latency check rather than a raw command-line ping. Browsers cannot send ICMP packets directly, so the live tool measures WebSocket connection time and, when the endpoint echoes a message, the round trip for that tiny exchange. That still makes it useful for comparing endpoints, checking whether a route feels unusually slow, or getting a rough latency baseline before you escalate to system-level diagnostics.",
        "The workflow is direct and transparent. Your browser connects to a public WebSocket echo service, measures the handshake, and optionally measures the time taken for one message to return. Plain Tools does not proxy or store the traffic. The result is not the same thing as a terminal ping, but it is often good enough to answer the practical question users actually have: is the connection feeling normal, slower than expected, or failing entirely from this device and network right now?",
      ]}
      howItWorks={[
        "Leave the endpoint blank to use the built-in public echo endpoints, or enter your own WebSocket server.",
        "Run several connection attempts so the page can show more than a single lucky or unlucky measurement.",
        "Compare average connect time and optional echo round trip before deciding whether to retry, switch endpoints, or investigate a broader network issue.",
      ]}
      caveats={[
        "This is not raw ICMP ping because browsers do not expose that capability.",
        "Some WebSocket endpoints accept connections but do not echo messages back, so you may only see connect timing.",
        "The quality of the result depends on the public echo service used, your current route, and any browser or network policies in between.",
      ]}
      relatedTools={[
        { label: "Site Status Checker", href: "/tools/site-status-checker" },
        { label: "DNS Lookup", href: "/tools/dns-lookup" },
        { label: "What Is My IP", href: "/tools/what-is-my-ip" },
      ]}
      relatedGuides={[
        {
          label: "What response time means in uptime check",
          href: "/learn/what-response-time-means-in-uptime-check",
        },
        {
          label: "Is it down for everyone or just me?",
          href: "/learn/is-it-down-for-everyone-or-just-me",
        },
      ]}
    >
      <PingTestToolClient />
    </NetworkToolPage>
  )
}

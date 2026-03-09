import type { Metadata } from "next"

import { NetworkToolPage } from "@/components/seo/network-tool-page"
import { WhatIsMyIPToolClient } from "@/components/tools/network-tools-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "What is my IP tool",
  description:
    "Check the public IP your browser exposes, then review browser-reported connection hints. Runs client-side with direct public endpoint requests only.",
  path: "/tools/what-is-my-ip",
  image: "/og/default.png",
})

export default function WhatIsMyIPToolPage() {
  return (
    <NetworkToolPage
      title="What Is My IP"
      intro={[
        "This page is the direct browser route for checking what public IP address your current network exposes to external services. It is useful when you need to confirm whether a VPN is active, compare office and home connections, verify what address a firewall or allow-list should expect, or simply see whether your network identity changed after reconnecting. The result comes from a public endpoint that your browser queries directly, so the check stays simple and transparent.",
        "Unlike a file workflow, an IP check only works by making a real network request. That means the endpoint you query can see the same public IP that any public site would see, but Plain Tools does not proxy the request or store the result. The page also shows the connection hints your browser exposes, such as effective network type and estimated round-trip time, which helps when you are troubleshooting from a laptop or mobile hotspot and need a quick baseline before moving on to a DNS or status check.",
      ]}
      howItWorks={[
        "Run the check and let your browser request a public IP endpoint such as ipify directly.",
        "Review the returned address and compare it with what you expected from your ISP, VPN, office gateway, or mobile network.",
        "Use the browser-reported connection hints below the result if you also need a quick sense of network type, RTT, or data-saver behaviour.",
      ]}
      caveats={[
        "This page reveals the public address seen by the external endpoint, not a precise physical location.",
        "The returned IP can change when you switch networks, reconnect through a different route, or enable a VPN.",
        "Plain Tools does not proxy the request, but the public endpoint you contact will naturally see your IP because that is what it is reporting back to you.",
      ]}
      relatedTools={[
        { label: "DNS Lookup", href: "/tools/dns-lookup" },
        { label: "Site Status Checker", href: "/tools/site-status-checker" },
        { label: "Ping Test", href: "/tools/ping-test" },
      ]}
      relatedGuides={[
        { label: "How DNS lookup works", href: "/learn/how-dns-lookup-works" },
        {
          label: "Is it down for everyone or just me?",
          href: "/learn/is-it-down-for-everyone-or-just-me",
        },
      ]}
    >
      <WhatIsMyIPToolClient />
    </NetworkToolPage>
  )
}

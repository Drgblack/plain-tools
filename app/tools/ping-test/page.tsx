import type { Metadata } from "next"

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
  return <PingTestToolClient />
}

import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Ping test",
  description:
    "Run practical latency checks for hostnames and IPs, then compare results with DNS and status diagnostics across the Plain Tools network toolkit.",
  path: "/ping-test",
  image: "/og/default.png",
})

export default function PingTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

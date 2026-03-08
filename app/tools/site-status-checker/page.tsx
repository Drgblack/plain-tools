import type { Metadata } from "next"

import { SiteStatusCheckerToolClient } from "@/components/tools/network-tools-client"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Site status checker tool",
  description:
    "Run a direct browser HEAD check for a URL, then review HTTP status and response timing. No Plain Tools relay; some sites may block browser probes.",
  path: "/tools/site-status-checker",
  image: "/og/default.png",
})

export default function SiteStatusCheckerToolPage() {
  return <SiteStatusCheckerToolClient />
}

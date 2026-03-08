import type { Metadata } from "next"

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
  return <WhatIsMyIPToolClient />
}

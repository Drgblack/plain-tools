"use client"

import { DNSDynamicClient as SharedDNSDynamicClient } from "@/app/dns-lookup/client"

interface DNSDynamicClientProps {
  domain: string
}

export function DNSDynamicClient({ domain }: DNSDynamicClientProps) {
  return <SharedDNSDynamicClient domain={domain} />
}

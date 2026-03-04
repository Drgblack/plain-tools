import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/seo'
import { DNSLookupClient } from './client'

export const metadata: Metadata = generateToolMetadata({
  name: 'DNS Lookup',
  description: 'Query DNS records for any domain including A, AAAA, MX, TXT, NS, and CNAME records.',
  slug: 'dns-lookup',
})

export default function DNSLookupPage() {
  return <DNSLookupClient />
}

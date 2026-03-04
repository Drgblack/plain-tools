import type { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/seo'
import { SiteStatusClient } from './client'

export const metadata: Metadata = generateToolMetadata({
  name: 'Site Status',
  description: 'Check if a website is up, down, or experiencing issues. Free website availability checker with response time monitoring.',
  slug: 'site-status',
  category: 'Network Tools',
})

export default function SiteStatusPage() {
  return <SiteStatusClient />
}

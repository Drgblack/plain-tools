import { Metadata } from 'next'
import { generateToolMetadata } from '@/lib/seo'
import { WhatIsMyIPClient } from './client'

export const metadata: Metadata = generateToolMetadata({
  name: 'What Is My IP Address',
  description: 'Find your public IP address instantly and view approximate location information.',
  slug: 'what-is-my-ip',
})

export default function WhatIsMyIPPage() {
  return <WhatIsMyIPClient />
}

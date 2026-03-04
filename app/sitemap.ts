import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://plain.tools'
  const lastModified = new Date()
  
  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }
  
  // Category pages (high priority - main navigation)
  const categoryPages = [
    { slug: 'network-tools', priority: 0.9 },
    { slug: 'file-tools', priority: 0.9 },
    { slug: 'pdf-tools', priority: 0.9 },
  ].map(({ slug, priority }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority,
  }))
  
  // Tool pages (medium-high priority - main content)
  const toolPages = [
    // Network Tools
    'what-is-my-ip',
    'dns-lookup',
    'site-status',
    'ping-test',
    // PDF Tools
    'compress-pdf',
    'pdf-to-word',
    'pdf-merge',
    // File Tools
    'file-converters',
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Static pages (lower priority)
  const staticPages = [
    { slug: 'about', priority: 0.5 },
    { slug: 'privacy', priority: 0.3 },
    { slug: 'verify', priority: 0.6 },
  ].map(({ slug, priority }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority,
  }))
  
  // Note: Dynamic pages (/dns/[domain], /status/[site], /ip/[address]) 
  // are NOT included in sitemap as they are infinite.
  // They are discoverable via internal links from the main tool pages.
  
  return [
    homepage,
    ...categoryPages,
    ...toolPages,
    ...staticPages,
  ]
}

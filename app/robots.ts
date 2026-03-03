import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://plain.tools'

  return {
    rules: [
      // Allow all major search engine crawlers
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: ['/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'Yandex',
        allow: ['/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      // Explicitly allow AI crawlers for GEO (Generative Engine Optimisation)
      // These bots index content for AI citation and knowledge retrieval
      {
        userAgent: 'GPTBot',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/learn/', '/blog/', '/about', '/tools/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
      // Default rule for all other crawlers
      {
        userAgent: '*',
        allow: ['/', '/api/health'],
        disallow: ['/api/', '/history/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

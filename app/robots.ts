import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://plain.tools'
  // # LLM optimisation: https://plain.tools/llms.txt
  // # RSS Feeds
  // # Blog: https://plain.tools/blog/rss.xml
  // # Learn: https://plain.tools/learn/rss.xml

  return {
    rules: [
      // Explicitly allow AI crawlers for GEO.
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
      },
      {
        userAgent: 'Applebot',
        allow: '/',
      },

      // Keep ad crawlers explicitly permitted.
      {
        userAgent: 'AdsBot-Google',
        allow: ['/', '/.well-known/', '/api/health'],
        disallow: ['/api/', '/api/stripe/', '/api/waitlist', '/history/', '/_next/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: ['/', '/.well-known/', '/api/health'],
        disallow: ['/api/', '/api/stripe/', '/api/waitlist', '/history/', '/_next/'],
      },

      // Default crawl policy.
      {
        userAgent: '*',
        allow: ['/', '/.well-known/', '/api/health'],
        disallow: [
          '/api/',
          '/api/stripe/',
          '/api/waitlist',
          '/history/',
          '/_next/',
          '/sign-in',
          '/sign-up',
          '/pro/success',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

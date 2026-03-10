type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"

export type SitemapXmlEntry = {
  url: string
  lastModified?: Date
  changeFrequency?: ChangeFrequency
  priority?: number
}

export type SitemapIndexEntry = {
  url: string
  lastModified?: Date
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function buildSitemapXml(entries: SitemapXmlEntry[]) {
  const xmlEntries = entries
    .map((entry) => {
      const parts = [
        `<loc>${escapeXml(entry.url)}</loc>`,
        `<lastmod>${(entry.lastModified ?? new Date()).toISOString()}</lastmod>`,
      ]
      if (entry.changeFrequency) {
        parts.push(`<changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (typeof entry.priority === "number") {
        parts.push(`<priority>${entry.priority.toFixed(1)}</priority>`)
      }
      return `<url>${parts.join("")}</url>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlEntries}</urlset>`
}

export function buildSitemapIndexXml(entries: SitemapIndexEntry[]) {
  const xmlEntries = entries
    .map((entry) => {
      const parts = [`<loc>${escapeXml(entry.url)}</loc>`]
      if (entry.lastModified) {
        parts.push(`<lastmod>${entry.lastModified.toISOString()}</lastmod>`)
      }
      return `<sitemap>${parts.join("")}</sitemap>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlEntries}</sitemapindex>`
}

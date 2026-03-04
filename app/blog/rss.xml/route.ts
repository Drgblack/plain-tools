import fs from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

import { posts } from "@/lib/blog-data"

const SITE_URL = "https://plain.tools"

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const blogPageExists = (slug: string): boolean => {
  const pageFile = path.join(process.cwd(), "app", "blog", slug, "page.tsx")
  return fs.existsSync(pageFile)
}

export async function GET() {
  const publishedPosts = posts
    .filter((post) => blogPageExists(post.slug))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Plain PDF Tools — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Technical insights and privacy analysis from the Plain PDF Tools team.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${publishedPosts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

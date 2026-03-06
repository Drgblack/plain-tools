import { NextResponse } from "next/server"

import { CHANGELOG_ITEMS } from "@/lib/changelog-data"

const SITE_URL = "https://plain.tools"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Plain Tools Changelog</title>
    <link>${SITE_URL}/changelog</link>
    <description>Shipped updates and reliability improvements for Plain Tools.</description>
    <language>en-GB</language>
    <atom:link href="${SITE_URL}/changelog/rss.xml" rel="self" type="application/rss+xml"/>
    ${CHANGELOG_ITEMS.map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/changelog</link>
      <description>${escapeXml(item.summary)}</description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <guid>${SITE_URL}/changelog#${item.date}</guid>
    </item>`
    ).join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

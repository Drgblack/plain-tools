import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { NextResponse } from "next/server"

import { learnFeedArticles } from "@/lib/learn-data"

const SITE_URL = "https://plain.tools"

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const getLearnPageFile = (href: string): string | null => {
  const segments = href.replace(/^\//, "").split("/").filter(Boolean)
  if (segments.length < 2 || segments[0] !== "learn") return null

  const tsxPath = path.join(process.cwd(), "app", ...segments, "page.tsx")
  if (fs.existsSync(tsxPath)) return tsxPath

  const tsPath = path.join(process.cwd(), "app", ...segments, "page.ts")
  if (fs.existsSync(tsPath)) return tsPath

  return null
}

const getLastModified = (filePath: string): string => {
  try {
    const relativePath = path.relative(process.cwd(), filePath)
    const gitIso = execFileSync(
      "git",
      ["log", "-1", "--format=%aI", "--", relativePath],
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim()

    return gitIso || fs.statSync(filePath).mtime.toISOString()
  } catch {
    return fs.statSync(filePath).mtime.toISOString()
  }
}

export async function GET() {
  const articles = learnFeedArticles
    .map((article) => {
      const pageFile = getLearnPageFile(article.href)
      if (!pageFile) return null

      return {
        ...article,
        publishedAt: getLastModified(pageFile),
      }
    })
    .filter((article): article is NonNullable<typeof article> => article !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Plain PDF Tools — Learn Centre</title>
    <link>${SITE_URL}/learn</link>
    <description>Guides on private, offline, browser-based PDF workflows and architecture.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/learn/rss.xml" rel="self" type="application/rss+xml"/>
${articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}${article.href}</link>
      <description>${escapeXml(article.summary)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <guid>${SITE_URL}${article.href}</guid>
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

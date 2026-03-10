import { NextResponse } from "next/server"

import { buildSitemapChunks, buildSitemapEntries } from "@/lib/sitemap-data"

export async function GET() {
  const entries = buildSitemapEntries(new Date())
  const chunks = buildSitemapChunks(new Date())

  return NextResponse.json(
    {
      chunkCount: chunks.length,
      count: entries.length,
      exists: entries.length > 0,
      sampleUrls: entries.slice(0, 10).map((entry) => entry.url),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}

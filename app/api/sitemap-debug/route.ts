import { NextResponse } from "next/server"

import { buildSitemapChunks, buildSitemapEntries } from "@/lib/sitemap-data"

export async function GET() {
  try {
    const entries = buildSitemapEntries(new Date())
    const chunks = buildSitemapChunks(new Date())

    return NextResponse.json(
      {
        chunkCount: chunks.length,
        sample: entries.slice(0, 10).map((entry) => entry.url),
        status: "ok" as const,
        totalUrls: entries.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unknown sitemap error",
        sample: [],
        status: "error" as const,
        totalUrls: 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
        status: 500,
      }
    )
  }
}

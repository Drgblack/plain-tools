import { NextResponse } from "next/server"

import { buildSitemapChunks } from "@/lib/sitemap-data"
import { buildSitemapIndexXml, buildSitemapXml } from "@/lib/seo/sitemap-xml"

const BASE_URL = "https://www.plain.tools"
const XML_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  "Content-Type": "application/xml; charset=utf-8",
}

export async function GET() {
  const generatedAt = new Date()
  const chunks = buildSitemapChunks(generatedAt)

  if (chunks.length <= 1) {
    return new NextResponse(buildSitemapXml(chunks[0] ?? []), {
      headers: XML_HEADERS,
      status: 200,
    })
  }

  const indexXml = buildSitemapIndexXml(
    chunks.map((_chunk, id) => ({
      lastModified: generatedAt,
      url: `${BASE_URL}/sitemap/${id}.xml`,
    }))
  )

  return new NextResponse(indexXml, {
    headers: XML_HEADERS,
    status: 200,
  })
}

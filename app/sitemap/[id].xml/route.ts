import { NextResponse } from "next/server"

import { buildSitemapChunks } from "@/lib/sitemap-data"
import { buildSitemapXml } from "@/lib/seo/sitemap-xml"

type RouteProps = {
  params: Promise<{ id: string }>
}

const XML_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": "application/xml; charset=utf-8",
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params
  const index = Number.parseInt(id, 10)

  if (!Number.isInteger(index) || index < 0) {
    return new NextResponse("Not found", { status: 404 })
  }

  const chunks = buildSitemapChunks(new Date())
  const entries = chunks[index]

  if (!entries) {
    return new NextResponse("Not found", { status: 404 })
  }

  return new NextResponse(buildSitemapXml(entries), {
    headers: XML_HEADERS,
    status: 200,
  })
}

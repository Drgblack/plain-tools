import { NextRequest, NextResponse } from "next/server"

import {
  getStatusObservabilityStorageInfo,
  getStatusTrends,
  incrementStatusTrend,
} from "@/lib/status-trending"
import type { StatusTrendSegment } from "@/lib/status-domains"

export async function GET(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit")
  const rawDay = request.nextUrl.searchParams.get("day")
  const rawSegment = request.nextUrl.searchParams.get("segment")
  const limit = Number.parseInt(rawLimit ?? "10", 10)
  const allowedSegments: StatusTrendSegment[] = [
    "all",
    "consumer",
    "developer",
    "social",
    "streaming",
    "saas",
  ]
  const segment = allowedSegments.includes((rawSegment ?? "all") as StatusTrendSegment)
    ? ((rawSegment ?? "all") as StatusTrendSegment)
    : "all"
  const storage = getStatusObservabilityStorageInfo()
  const day = rawDay && /^\d{4}-\d{2}-\d{2}$/.test(rawDay) ? rawDay : undefined

  return NextResponse.json({
    trends: await getStatusTrends({
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 10,
      day,
      segment,
    }),
    day,
    segment,
    storage,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { domain?: string } | null
  const domain = body?.domain ?? ""
  const normalized = await incrementStatusTrend(domain)

  if (!normalized) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, domain: normalized })
}

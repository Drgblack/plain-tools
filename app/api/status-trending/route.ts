import { NextRequest, NextResponse } from "next/server"

import { getStatusTrends, incrementStatusTrend } from "@/lib/status-trending-store"

export async function GET(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit")
  const limit = Number.parseInt(rawLimit ?? "10", 10)

  return NextResponse.json({
    trends: getStatusTrends(Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 25) : 10),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { domain?: string } | null
  const domain = body?.domain ?? ""
  const normalized = incrementStatusTrend(domain)

  if (!normalized) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, domain: normalized })
}

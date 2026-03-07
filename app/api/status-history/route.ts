import { NextRequest, NextResponse } from "next/server"

import { normalizeSiteInput } from "@/lib/site-status"
import {
  getStatusHistorySummary,
  getStatusObservabilityStorageInfo,
} from "@/lib/status-trending"

export async function GET(request: NextRequest) {
  const rawDomain = request.nextUrl.searchParams.get("domain") ?? ""
  const rawHours = request.nextUrl.searchParams.get("hours")
  const rawRecentLimit = request.nextUrl.searchParams.get("recentLimit")

  const domain = normalizeSiteInput(rawDomain)
  if (!domain) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
  }

  const hours = Number.parseInt(rawHours ?? "24", 10)
  const recentLimit = Number.parseInt(rawRecentLimit ?? "8", 10)
  const summary = await getStatusHistorySummary(domain, {
    hours: Number.isFinite(hours) ? hours : 24,
    recentLimit: Number.isFinite(recentLimit) ? recentLimit : 8,
  })

  if (!summary) {
    return NextResponse.json({ error: "Unable to build history" }, { status: 500 })
  }

  return NextResponse.json({
    history: summary,
    storage: getStatusObservabilityStorageInfo(),
  })
}

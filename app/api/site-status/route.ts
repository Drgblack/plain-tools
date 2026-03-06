import { NextRequest, NextResponse } from "next/server"

import {
  normalizeSiteInput,
  type SiteStatusCheckResult,
} from "@/lib/site-status"

const REQUEST_TIMEOUT_MS = 8000

async function probeSite(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const startedAt = Date.now()

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    })

    const responseTimeMs = Date.now() - startedAt

    if (response.status === 405 || response.status === 501) {
      const fallbackStartedAt = Date.now()
      const fallback = await fetch(url, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      })
      return {
        status: fallback.status,
        responseTimeMs: Date.now() - fallbackStartedAt,
      }
    }

    return {
      status: response.status,
      responseTimeMs,
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("site") ?? ""
  const normalized = normalizeSiteInput(input)

  if (!normalized) {
    const invalidResult: SiteStatusCheckResult = {
      site: input,
      status: "invalid",
      responseTimeMs: null,
      checkedAt: new Date().toISOString(),
      httpStatus: null,
      errorMessage: "Invalid website",
    }
    return NextResponse.json(invalidResult, { status: 400 })
  }

  const urlsToTry = [`https://${normalized}`, `http://${normalized}`]
  let httpStatus: number | null = null
  let responseTimeMs: number | null = null
  let errorMessage: string | undefined

  for (const url of urlsToTry) {
    try {
      const probe = await probeSite(url)
      httpStatus = probe.status
      responseTimeMs = probe.responseTimeMs
      errorMessage = undefined
      break
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Network check failed"
    }
  }

  const isUp = httpStatus !== null && httpStatus < 500
  const result: SiteStatusCheckResult = {
    site: normalized,
    status: isUp ? "up" : "down",
    responseTimeMs,
    checkedAt: new Date().toISOString(),
    httpStatus,
    errorMessage,
  }

  return NextResponse.json(result, { status: 200 })
}

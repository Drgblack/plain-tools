import "server-only"

import type { NextRequest } from "next/server"

const DEFAULT_PRIMARY_ORIGIN = "https://plain.tools"
const PROD_ALLOWED_ORIGINS = ["https://plain.tools", "https://www.plain.tools"]
const DEV_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

const normaliseOrigin = (origin: string) => origin.trim().replace(/\/+$/, "")

const toWwwVariant = (origin: string) => {
  try {
    const url = new URL(origin)
    if (url.hostname.startsWith("www.")) {
      return origin
    }
    return `${url.protocol}//www.${url.host}`
  } catch {
    return origin
  }
}

const getAllowedOrigins = () => {
  const configuredPrimary = normaliseOrigin(
    process.env.ALLOWED_ORIGIN || DEFAULT_PRIMARY_ORIGIN
  )
  const configuredWww = normaliseOrigin(toWwwVariant(configuredPrimary))
  const isProduction = process.env.NODE_ENV === "production"

  const allowedOrigins = new Set<string>([
    ...PROD_ALLOWED_ORIGINS,
    configuredPrimary,
    configuredWww,
  ])

  if (!isProduction) {
    for (const origin of DEV_ALLOWED_ORIGINS) {
      allowedOrigins.add(origin)
    }
  }

  return allowedOrigins
}

export const isOriginAllowed = (request: NextRequest) => {
  const origin = request.headers.get("origin")
  if (!origin) {
    return true
  }
  return getAllowedOrigins().has(origin)
}

export const buildCorsHeaders = (request: NextRequest) => {
  const allowedOrigins = getAllowedOrigins()
  const origin = request.headers.get("origin")
  const fallbackOrigin = normaliseOrigin(
    process.env.ALLOWED_ORIGIN || DEFAULT_PRIMARY_ORIGIN
  )
  const allowOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : fallbackOrigin

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  }
}

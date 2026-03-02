import "server-only"

import type { NextRequest } from "next/server"

const DEFAULT_ALLOWED_ORIGINS = [
  "https://plain.tools",
  "https://www.plain.tools",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

const getAllowedOrigins = () => {
  const configured = process.env.ALLOWED_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS)
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
  const allowOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : DEFAULT_ALLOWED_ORIGINS[0]

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  }
}


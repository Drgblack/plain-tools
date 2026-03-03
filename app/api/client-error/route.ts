import { NextResponse } from "next/server"

import { logger } from "@/lib/logger"

type ClientErrorPayload = {
  context?: string
  message?: string
  stack?: string
  componentStack?: string
  path?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientErrorPayload
    const message = body.message || "Unknown client render error"

    logger.error("client.error_boundary", message, {
      context: body.context ?? "unknown",
      path: body.path ?? "unknown",
      stack: body.stack ?? null,
      componentStack: body.componentStack ?? null,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    logger.error("client.error_boundary.route", error)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}

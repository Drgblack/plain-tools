import { APIError, RateLimitError } from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

import { summarizeTextWithClaude } from "@/lib/anthropic-client"
import { buildCorsHeaders, isOriginAllowed } from "@/lib/api-cors"

export const runtime = "nodejs"

const WARNING_TEXT = "This sends text to server."
const MAX_INPUT_CHARS = 120_000

export function OPTIONS(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request)
  if (!isOriginAllowed(request)) {
    return NextResponse.json(
      { error: "Origin not allowed.", warning: WARNING_TEXT },
      { status: 403, headers: corsHeaders }
    )
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request)
  if (!isOriginAllowed(request)) {
    return NextResponse.json(
      { error: "Origin not allowed.", warning: WARNING_TEXT },
      { status: 403, headers: corsHeaders }
    )
  }

  try {
    const body = await request.json()
    const text = typeof body?.text === "string" ? body.text.trim() : ""
    const summaryInstruction =
      typeof body?.summaryInstruction === "string"
        ? body.summaryInstruction.trim().slice(0, 500)
        : ""

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for summarisation." },
        { status: 400, headers: corsHeaders }
      )
    }

    const truncatedText = text.slice(0, MAX_INPUT_CHARS)
    const summary = await summarizeTextWithClaude(truncatedText, {
      model: process.env.ANTHROPIC_MODEL,
      maxTokens: 700,
      instruction: summaryInstruction || undefined,
    })

    return NextResponse.json(
      {
        summary,
        warning: WARNING_TEXT,
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please retry shortly.",
          warning: WARNING_TEXT,
        },
        { status: 429, headers: corsHeaders }
      )
    }

    if (error instanceof APIError && (error.status === 429 || error.status === 529)) {
      return NextResponse.json(
        {
          error: "Anthropic is rate limiting requests. Please retry shortly.",
          warning: WARNING_TEXT,
        },
        { status: 429, headers: corsHeaders }
      )
    }

    const message =
      error instanceof Error ? error.message : "Summarisation failed on the server."
    return NextResponse.json(
      {
        error: message,
        warning: WARNING_TEXT,
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

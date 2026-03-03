import { APIError, RateLimitError } from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { suggestEditsWithClaude } from "@/lib/anthropic-client"
import { buildCorsHeaders, isOriginAllowed } from "@/lib/api-cors"
import { logger } from "@/lib/logger"
import {
  AI_MONTHLY_LIMIT_ERROR,
  enforceAiMonthlyLimit,
  enforceRateLimit,
  RATE_LIMIT_ERROR_MESSAGE,
} from "@/lib/rate-limit"

export const runtime = "nodejs"

const WARNING_TEXT = "This sends text to server."
const MAX_INPUT_CHARS = 30_000
const MAX_INSTRUCTION_CHARS = 500

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

  const { userId } = await auth()

  const rateLimit = await enforceRateLimit(request, "api:ai:suggest-edits")
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: RATE_LIMIT_ERROR_MESSAGE },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(rateLimit.retryAfter),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const text = typeof body?.text === "string" ? body.text.trim() : ""
    const instruction = typeof body?.instruction === "string" ? body.instruction.trim() : ""

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for edit suggestions." },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "No rewrite instruction provided." },
        { status: 400, headers: corsHeaders }
      )
    }

    const aiMonthlyLimit = await enforceAiMonthlyLimit(
      request,
      "api:ai:suggest-edits",
      userId
    )
    if (!aiMonthlyLimit.success) {
      return NextResponse.json(
        {
          error: AI_MONTHLY_LIMIT_ERROR,
          message: aiMonthlyLimit.message,
          reset_date: aiMonthlyLimit.resetDate,
          upgrade_url: aiMonthlyLimit.upgradeUrl,
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(aiMonthlyLimit.retryAfter),
          },
        }
      )
    }

    const suggestions = await suggestEditsWithClaude(
      text.slice(0, MAX_INPUT_CHARS),
      instruction.slice(0, MAX_INSTRUCTION_CHARS),
      {
        model: process.env.ANTHROPIC_MODEL,
        maxTokens: 700,
      }
    )

    return NextResponse.json(
      {
        suggestions,
        warning: WARNING_TEXT,
      },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    logger.error("api.ai.suggest_edits.failed", error, {
      route: "/api/ai/suggest-edits",
    })

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

    const message = error instanceof Error ? error.message : "Edit suggestion request failed."
    return NextResponse.json(
      {
        error: message,
        warning: WARNING_TEXT,
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

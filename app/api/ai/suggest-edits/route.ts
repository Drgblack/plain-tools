import { APIError, RateLimitError } from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

import { suggestEditsWithClaude } from "@/lib/anthropic-client"

export const runtime = "nodejs"

const WARNING_TEXT = "This sends text to server."
const MAX_INPUT_CHARS = 30_000
const MAX_INSTRUCTION_CHARS = 500

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const text = typeof body?.text === "string" ? body.text.trim() : ""
    const instruction = typeof body?.instruction === "string" ? body.instruction.trim() : ""

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for edit suggestions." },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "No rewrite instruction provided." },
        { status: 400, headers: CORS_HEADERS }
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
      { status: 200, headers: CORS_HEADERS }
    )
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please retry shortly.",
          warning: WARNING_TEXT,
        },
        { status: 429, headers: CORS_HEADERS }
      )
    }

    if (error instanceof APIError && (error.status === 429 || error.status === 529)) {
      return NextResponse.json(
        {
          error: "Anthropic is rate limiting requests. Please retry shortly.",
          warning: WARNING_TEXT,
        },
        { status: 429, headers: CORS_HEADERS }
      )
    }

    const message = error instanceof Error ? error.message : "Edit suggestion request failed."
    return NextResponse.json(
      {
        error: message,
        warning: WARNING_TEXT,
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}


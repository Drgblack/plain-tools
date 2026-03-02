import { APIError, RateLimitError } from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

import { answerPdfQuestionWithClaude } from "@/lib/anthropic-client"

export const runtime = "nodejs"

const WARNING_TEXT = "This sends text to server."
const MAX_INPUT_CHARS = 120_000

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
    const question = typeof body?.question === "string" ? body.question.trim() : ""

    if (!text) {
      return NextResponse.json(
        { error: "No text provided for PDF QA." },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (!question) {
      return NextResponse.json(
        { error: "No question provided for PDF QA." },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const answer = await answerPdfQuestionWithClaude(
      text.slice(0, MAX_INPUT_CHARS),
      question.slice(0, 1000),
      {
        model: process.env.ANTHROPIC_MODEL,
        maxTokens: 700,
      }
    )

    return NextResponse.json(
      {
        answer,
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

    const message = error instanceof Error ? error.message : "PDF QA failed on the server."
    return NextResponse.json(
      {
        error: message,
        warning: WARNING_TEXT,
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}


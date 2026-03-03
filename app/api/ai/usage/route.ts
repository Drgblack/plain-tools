import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { buildCorsHeaders, isOriginAllowed } from "@/lib/api-cors"
import { getAiUsage } from "@/lib/rate-limit"

export const runtime = "nodejs"

const WARNING_TEXT = "This sends text to server."

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

export async function GET(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request)
  if (!isOriginAllowed(request)) {
    return NextResponse.json(
      { error: "Origin not allowed.", warning: WARNING_TEXT },
      { status: 403, headers: corsHeaders }
    )
  }

  const { userId } = await auth()
  const usage = await getAiUsage(request, userId)

  return NextResponse.json(
    {
      used: usage.used,
      limit: usage.limit,
      reset_date: usage.resetDate,
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  )
}

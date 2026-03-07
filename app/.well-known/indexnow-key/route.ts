import { NextResponse } from "next/server"

import { getIndexNowKey } from "@/lib/seo-monitoring"

export const revalidate = 3600

export function GET() {
  const key = getIndexNowKey()
  if (!key) {
    return new NextResponse("IndexNow key is not configured.\n", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  return new NextResponse(`${key}\n`, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}


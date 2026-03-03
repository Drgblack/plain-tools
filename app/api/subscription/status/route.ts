import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { isPro } from "@/lib/subscription"

export const runtime = "nodejs"

const clerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
)

export async function GET() {
  if (!clerkConfigured) {
    return NextResponse.json({ isPro: false }, { status: 200 })
  }

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ isPro: false }, { status: 200 })
    }

    const pro = await isPro(userId)
    return NextResponse.json({ isPro: pro }, { status: 200 })
  } catch {
    return NextResponse.json({ isPro: false }, { status: 200 })
  }
}

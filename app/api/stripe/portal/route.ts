import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { logger } from "@/lib/logger"
import { getStripe } from "@/lib/stripe"
import { getStripeCustomerIdFromUser } from "@/lib/subscription"

export const runtime = "nodejs"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://plain.tools"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stripeCustomerId = await getStripeCustomerIdFromUser(userId)
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this account." },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/pricing`,
    })

    return NextResponse.json({ url: portalSession.url }, { status: 200 })
  } catch (error) {
    logger.error("api.stripe.portal.failed", error, {
      route: "/api/stripe/portal",
    })
    const message =
      error instanceof Error ? error.message : "Failed to create Stripe customer portal session."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

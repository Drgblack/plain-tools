import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { logger } from "@/lib/logger"
import { getStripe } from "@/lib/stripe"
import { getStripeCustomerIdFromUser, getUserPrimaryEmail } from "@/lib/subscription"

export const runtime = "nodejs"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://plain.tools"

const getAllowedPriceIds = () => {
  const monthly = process.env.STRIPE_PRO_MONTHLY_PRICE_ID
  const annual = process.env.STRIPE_PRO_ANNUAL_PRICE_ID
  return new Set([monthly, annual].filter((value): value is string => Boolean(value)))
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json().catch(() => null)) as
      | { priceId?: string; billingPeriod?: "monthly" | "annual" }
      | null
    const priceId = typeof body?.priceId === "string" ? body.priceId : ""
    const billingPeriod = body?.billingPeriod === "annual" ? "annual" : "monthly"

    const allowedPriceIds = getAllowedPriceIds()
    if (!priceId || !allowedPriceIds.has(priceId)) {
      return NextResponse.json({ error: "Invalid price id." }, { status: 400 })
    }

    const email = await getUserPrimaryEmail(userId)
    if (!email) {
      return NextResponse.json(
        { error: "No primary email was found for this account." },
        { status: 400 }
      )
    }

    const stripeCustomerId = await getStripeCustomerIdFromUser(userId)
    const stripe = getStripe()
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: true },
      ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: email }),
      metadata: {
        clerkUserId: userId,
        billingPeriod,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
          billingPeriod,
        },
      },
      success_url: `${baseUrl}/pro/success`,
      cancel_url: `${baseUrl}/`,
      allow_promotion_codes: true,
    })

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe checkout session URL is unavailable." },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 })
  } catch (error) {
    logger.error("api.stripe.checkout.failed", error, {
      route: "/api/stripe/checkout",
    })
    const message =
      error instanceof Error ? error.message : "Failed to create Stripe checkout session."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

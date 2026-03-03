import { NextRequest, NextResponse } from "next/server"
import { BrevoClient } from "@getbrevo/brevo"
import Stripe from "stripe"

import { logger } from "@/lib/logger"
import { getStripe } from "@/lib/stripe"
import {
  clearUserProSubscription,
  findUserIdByStripeCustomerId,
  setUserProSubscription,
} from "@/lib/subscription"

export const runtime = "nodejs"

const DEFAULT_SUPPORT_EMAIL = "your-support@email.com"
const DEFAULT_SENDER_EMAIL = "no-reply@plain.tools"

const getClerkUserIdFromMetadata = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return null
  }
  const candidate = value as Record<string, unknown>
  return typeof candidate.clerkUserId === "string" ? candidate.clerkUserId : null
}

const getIsoFromUnixSeconds = (unixSeconds: number | null | undefined) => {
  if (!unixSeconds || !Number.isFinite(unixSeconds)) {
    return null
  }
  return new Date(unixSeconds * 1000).toISOString()
}

const getSubscriptionValidUntil = (subscription: Stripe.Subscription) => {
  const itemPeriodEnds = (subscription.items?.data || [])
    .map((item) => item.current_period_end)
    .filter((value) => Number.isFinite(value))
  if (!itemPeriodEnds.length) {
    return null
  }

  const latestPeriodEnd = Math.max(...itemPeriodEnds)
  return getIsoFromUnixSeconds(latestPeriodEnd)
}

const sendPaymentFailedEmail = async (invoice: Stripe.Invoice) => {
  const brevoApiKey = process.env.BREVO_API_KEY
  if (!brevoApiKey) {
    logger.warn("api.stripe.invoice_payment_failed.brevo_missing", "BREVO_API_KEY missing", {
      route: "/api/stripe/webhook",
      invoiceId: invoice.id,
    })
    return
  }

  const supportEmail = process.env.SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL
  const senderEmail = process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || "unknown"

  const brevo = new BrevoClient({
    apiKey: brevoApiKey,
    maxRetries: 2,
  })

  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: supportEmail }],
    sender: { email: senderEmail, name: "Plain Billing Bot" },
    subject: "Stripe invoice payment failed",
    textContent: [
      "A Stripe invoice payment failed.",
      "",
      `Invoice ID: ${invoice.id}`,
      `Customer ID: ${customerId}`,
      `Amount Due: ${invoice.amount_due}`,
      `Currency: ${invoice.currency}`,
      `Hosted Invoice URL: ${invoice.hosted_invoice_url || "n/a"}`,
    ].join("\n"),
  })
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured." }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 })
  }

  const payload = await request.text()
  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    logger.warn("api.stripe.webhook.invalid_signature", "Invalid webhook signature", {
      route: "/api/stripe/webhook",
    })
    const message =
      error instanceof Error ? error.message : "Webhook signature verification failed."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null
      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id || ""
      let clerkUserId = getClerkUserIdFromMetadata(session.metadata)
      let validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      if (subscriptionId) {
        const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
        const subscription = (
          "data" in subscriptionResponse ? subscriptionResponse.data : subscriptionResponse
        ) as Stripe.Subscription
        clerkUserId = clerkUserId || getClerkUserIdFromMetadata(subscription.metadata)
        const subscriptionValidUntil = getSubscriptionValidUntil(subscription)
        if (subscriptionValidUntil) {
          validUntil = subscriptionValidUntil
        }
      }

      if (!clerkUserId && stripeCustomerId) {
        clerkUserId = await findUserIdByStripeCustomerId(stripeCustomerId)
      }

      if (clerkUserId && stripeCustomerId) {
        await setUserProSubscription(clerkUserId, {
          stripeCustomerId,
          validUntil,
        })
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id || ""
      let clerkUserId = getClerkUserIdFromMetadata(subscription.metadata)

      if (!clerkUserId && stripeCustomerId) {
        clerkUserId = await findUserIdByStripeCustomerId(stripeCustomerId)
      }

      if (clerkUserId) {
        await clearUserProSubscription(clerkUserId, stripeCustomerId || undefined)
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice
      logger.warn("api.stripe.invoice_payment_failed", "Stripe invoice payment failed", {
        route: "/api/stripe/webhook",
        invoiceId: invoice.id,
      })
      await sendPaymentFailedEmail(invoice)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    logger.error("api.stripe.webhook.handler_failed", error, {
      route: "/api/stripe/webhook",
      eventType: event.type,
    })
    const message = error instanceof Error ? error.message : "Stripe webhook handling failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

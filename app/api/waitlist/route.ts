import { createHash } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { BrevoClient } from "@getbrevo/brevo"

import { logger } from "@/lib/logger"
import { enforceRateLimit, RATE_LIMIT_ERROR_MESSAGE } from "@/lib/rate-limit"

export const runtime = "nodejs"

const DEFAULT_WAITLIST_EMAIL = "your-support@email.com"
const DEFAULT_SENDER_EMAIL = "no-reply@plain.tools"

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const hashEmail = (value: string) =>
  createHash("sha256").update(value.toLowerCase()).digest("hex").slice(0, 16)

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await enforceRateLimit(request, "api:waitlist")
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: RATE_LIMIT_ERROR_MESSAGE },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      )
    }

    const body = (await request.json().catch(() => null)) as
      | { email?: string; website?: string }
      | null
    const honeypot = typeof body?.website === "string" ? body.website.trim() : ""
    if (honeypot) {
      logger.warn("api.waitlist.honeypot_triggered", "Waitlist honeypot triggered")
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 160) : ""
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const brevoApiKey = process.env.BREVO_API_KEY
    if (!brevoApiKey) {
      logger.warn("api.waitlist.brevo_missing", "BREVO_API_KEY missing; logging waitlist signup", {
        emailHash: hashEmail(email),
      })
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const waitlistEmail =
      process.env.WAITLIST_EMAIL || process.env.SUPPORT_EMAIL || DEFAULT_WAITLIST_EMAIL
    const senderEmail = process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL

    const brevo = new BrevoClient({
      apiKey: brevoApiKey,
      maxRetries: 2,
    })

    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: waitlistEmail }],
      sender: { email: senderEmail, name: "Plain Waitlist Bot" },
      subject: "Plain Pro Waitlist Signup",
      textContent: [
        "New Plain Pro waitlist signup",
        "",
        `Email: ${email}`,
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    logger.error("api.waitlist.submit_failed", error, {
      route: "/api/waitlist",
    })
    const message =
      error instanceof Error ? error.message : "Could not process waitlist submission."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


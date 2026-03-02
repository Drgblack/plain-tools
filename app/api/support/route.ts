import { NextRequest, NextResponse } from "next/server"
import { BrevoClient } from "@getbrevo/brevo"

export const runtime = "nodejs"

const DEFAULT_SUPPORT_EMAIL = "your-support@email.com"
const DEFAULT_SENDER_EMAIL = "no-reply@plain.tools"

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { name?: string; email?: string; message?: string }
      | null

    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : ""
    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 160) : ""
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 10_000) : ""

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const brevoApiKey = process.env.BREVO_API_KEY
    if (!brevoApiKey) {
      return NextResponse.json(
        { error: "BREVO_API_KEY is not configured on the server." },
        { status: 500 }
      )
    }

    const supportEmail = process.env.SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL
    const senderEmail = process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL

    const brevo = new BrevoClient({
      apiKey: brevoApiKey,
      maxRetries: 2,
    })

    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: supportEmail }],
      sender: { email: senderEmail, name: "Plain Support Bot" },
      replyTo: { email, name },
      subject: "Support Query",
      textContent: [
        "New support request from plain.tools",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send support email."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

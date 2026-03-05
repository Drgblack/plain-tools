"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Loader2, Sparkles } from "lucide-react"
import Script from "next/script"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { serializeJsonLd } from "@/lib/sanitize"

const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || ""
const annualPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || ""

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you store my documents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Document processing remains local-first and your files are not uploaded for paid subscriptions.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can cancel from the Stripe customer portal at any time.",
      },
    },
    {
      "@type": "Question",
      name: "Is my payment data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Payment details are handled by Stripe and never stored by Plain.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when my Pro plan ends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your account reverts to the free tier AI cap of 5 requests per month.",
      },
    },
  ],
}

type BillingPeriod = "monthly" | "annual"

export default function PricingPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  const [activePlan, setActivePlan] = useState<BillingPeriod | null>(null)

  const annualSavings = useMemo(() => {
    return "Save €25/year"
  }, [])

  const startCheckout = async (billingPeriod: BillingPeriod) => {
    const priceId = billingPeriod === "monthly" ? monthlyPriceId : annualPriceId
    if (!priceId) {
      toast.error("Stripe price is not configured.")
      return
    }

    if (!clerkEnabled) {
      toast.error("Sign-in is not configured for this environment.")
      return
    }

    setActivePlan(billingPeriod)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          billingPeriod,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null

      if (response.status === 401) {
        window.location.href = "/sign-in?redirect_url=/pricing"
        return
      }

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Could not start Stripe checkout.")
      }

      window.location.href = payload.url
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start Stripe checkout."
      toast.error(message)
      setActivePlan(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster richColors position="top-right" />
      <Script
        id="pricing-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <main className="flex-1 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Plain Pro</h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
              Upgrade when your free-tier AI usage cap is reached. Stripe handles billing and
              tax, while document processing remains local-first.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Flexible monthly billing</CardDescription>
                <p className="text-3xl font-semibold">€7<span className="text-base text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => void startCheckout("monthly")}
                  disabled={activePlan !== null}
                >
                  {activePlan === "monthly" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Get Plain Pro"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Annual</CardTitle>
                  <Badge>{annualSavings}</Badge>
                </div>
                <CardDescription>Best value for ongoing usage</CardDescription>
                <p className="text-3xl font-semibold">€59<span className="text-base text-muted-foreground">/yr</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => void startCheckout("annual")}
                  disabled={activePlan !== null}
                >
                  {activePlan === "annual" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Get Plain Pro"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free Tier (stays free)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground">
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Core PDF tools stay free forever
                </p>
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />5 AI requests per month
                </p>
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No document uploads
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pro Tier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground">
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Unlimited AI requests
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Advanced OCR languages
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  PDF form filling
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Priority support
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Do you store my documents?</p>
                <p className="text-muted-foreground">
                  No. Document data remains local-first and is not uploaded for Pro subscriptions.
                </p>
              </div>
              <div>
                <p className="font-medium">Can I cancel anytime?</p>
                <p className="text-muted-foreground">
                  Yes. You can manage and cancel from the Stripe customer portal.
                </p>
              </div>
              <div>
                <p className="font-medium">Is my payment data secure?</p>
                <p className="text-muted-foreground">
                  Stripe processes payment data securely. Plain never stores card details.
                </p>
              </div>
              <div>
                <p className="font-medium">What happens when my Pro plan ends?</p>
                <p className="text-muted-foreground">
                  Your account returns to the free tier and monthly AI cap.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


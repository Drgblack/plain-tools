import type { Metadata } from "next"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { Lock, Sparkles } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import FillPdfTool from "@/components/tools/fill-pdf-tool"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isPro } from "@/lib/subscription"

export const metadata: Metadata = {
  title: "Fill PDF Forms",
  description:
    "Fill AcroForm PDF fields locally in your browser, choose flattened or editable output, and download without uploads. Plain Pro feature.",
  alternates: {
    canonical: "https://plain.tools/tools/fill-pdf",
  },
  openGraph: {
    title: "Fill PDF Forms - Plain",
    description:
      "Fill text fields, checkboxes, radio buttons, and dropdowns locally with optional flattening. Available with Plain Pro.",
    url: "https://plain.tools/tools/fill-pdf",
  },
}

const clerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
)

export default async function FillPdfPage() {
  let userId: string | null = null
  let proAccess = false

  if (clerkConfigured) {
    try {
      const authResult = await auth()
      userId = authResult.userId
      if (userId) {
        proAccess = await isPro(userId)
      }
    } catch {
      userId = null
      proAccess = false
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="space-y-2 text-center sm:space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Fill PDF Forms
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Fill AcroForm fields fully locally, then export flattened or editable output.
            </p>
          </section>

          {proAccess ? (
            <FillPdfTool />
          ) : (
            <Card className="border-amber-500/30 bg-amber-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Lock className="h-5 w-5 text-amber-300" />
                  Plain Pro Feature
                </CardTitle>
                <CardDescription className="text-amber-100/90">
                  PDF form filling is available with Plain Pro.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-amber-100/90">
                  Fill text inputs, checkboxes, radio groups, dropdowns, and signature placeholders
                  in standard AcroForm PDFs with local-first processing.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/pricing">
                      <Sparkles className="h-4 w-4" />
                      Upgrade To Plain Pro
                    </Link>
                  </Button>
                  {!userId ? (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/sign-in?redirect_url=/tools/fill-pdf">Sign In</Link>
                    </Button>
                  ) : null}
                </div>
                {!clerkConfigured ? (
                  <p className="text-xs text-amber-200/90">
                    Authentication is not configured in this environment, so Pro access checks are
                    unavailable.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

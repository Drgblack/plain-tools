import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Plain Pro Success",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Subscription active
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
                Welcome to Plain Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Your Pro plan is now active. Unlimited AI requests are unlocked, plus advanced
                OCR languages, PDF form filling, and priority support.
              </p>
              <div className="grid gap-2 text-sm text-foreground">
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Unlimited AI summarise, QA, and edit suggestions
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Advanced OCR languages
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  PDF form filling and priority support
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/tools/summarize-pdf">Go To AI Summariser</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/tools/pdf-qa">Go To PDF Q&A</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
    </div>
  )
}


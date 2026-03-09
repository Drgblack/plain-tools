"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ExternalLink, Github, Linkedin, Share2, ShieldCheck, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { trackEvent } from "@/lib/analytics"

type VerificationStep = {
  id: string
  title: string
  description: string
}

const shareMessage =
  "I just verified that Plain PDF tools genuinely don't upload my files. Here's how you can check too: plain.tools/verify-claims"

const steps: VerificationStep[] = [
  {
    id: "open-devtools",
    title: "Open DevTools",
    description: "Use Cmd+Option+I on Mac or F12 on Windows.",
  },
  {
    id: "network-filter",
    title: "Go to the Network tab and filter by 'XHR' and 'Fetch'.",
    description: "Turn on Preserve log if you want to keep results visible.",
  },
  {
    id: "run-tool",
    title: "Upload any PDF and use any tool.",
    description: "Merge, split, redact, convert, or OCR all work for this check.",
  },
  {
    id: "observe-zero-uploads",
    title: "Observe zero network requests containing your file.",
    description: "You should only see normal app assets and API calls unrelated to PDF bytes.",
  },
]

const claimsRegistry = [
  {
    claim: "Files never leave your device",
    verification: "Open DevTools > Network and inspect requests while running a tool.",
  },
  {
    claim: "No ad-tech trackers",
    verification:
      "Open DevTools > Sources and Network. You should only see the Plausible privacy-first analytics script, not ad/retargeting trackers.",
  },
  {
    claim: "Works offline after load",
    verification: "Load the app, enable Airplane mode, then run a tool.",
  },
  {
    claim: "No accounts required for free local tools",
    verification: "Use core tools (merge/split/compress/redact) without registration or login.",
  },
  {
    claim: "No cookies required",
    verification: "Open DevTools > Application > Cookies and verify tool usage does not depend on cookies.",
  },
]

const githubUrl = "https://github.com/Drgblack/plain-tools"
const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`
const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareMessage)}`

export function VerifyClaimsContent() {
  const [doneSteps, setDoneSteps] = useState<Record<string, boolean>>({})
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    const platform =
      typeof navigator !== "undefined" ? navigator.platform.toLowerCase() : ""
    setIsMac(platform.includes("mac"))
  }, [])

  const completedCount = useMemo(
    () => steps.filter((step) => doneSteps[step.id]).length,
    [doneSteps]
  )

  const stepOneDescription = isMac
    ? "Use Cmd+Option+I on Mac."
    : "Use F12 on Windows."

  return (
    <div className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-accent/30 bg-[oklch(0.14_0.01_250)] p-6 sm:p-10">
          <div className="absolute inset-0 hero-grid-pattern opacity-15" />
          <div className="absolute left-1/2 top-0 h-44 w-[28rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative space-y-5 text-center">
            <Badge variant="outline" className="border-accent/45 bg-accent/10 text-white">
              Verification First
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              We Dare You to Catch Us Uploading Your Files.
            </h2>
            <p className="mx-auto max-w-3xl text-base text-white/80 sm:text-lg">
              Every privacy claim we make is technically verifiable. Here&apos;s exactly how to
              check.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Verification Guide</CardTitle>
              <CardDescription>
                Tick each step as you complete it. Completed: {completedCount}/{steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => {
                const description =
                  index === 0 ? stepOneDescription : step.description
                return (
                  <label
                    key={step.id}
                    htmlFor={`step-${step.id}`}
                    className="flex min-h-[44px] cursor-pointer gap-3 rounded-lg border border-border/70 bg-muted/20 p-3 transition-colors hover:border-accent/40"
                  >
                    <Checkbox
                      id={`step-${step.id}`}
                      checked={Boolean(doneSteps[step.id])}
                      onCheckedChange={(checked) => {
                        setDoneSteps((current) => ({
                          ...current,
                          [step.id]: checked === true,
                        }))
                      }}
                      aria-label={`Mark ${step.title} as done`}
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {index + 1}. {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                      {doneSteps[step.id] ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Done
                        </span>
                      ) : null}
                    </div>
                  </label>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annotated Network Check</CardTitle>
              <CardDescription>
                Step 4 target state: no request carrying your PDF file bytes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border/70">
                <Image
                  src="/verify/network-empty.svg"
                  alt="Annotated example of an empty Fetch/XHR network panel while using a tool"
                  width={960}
                  height={580}
                  className="h-auto w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You can compare this against your own browser while processing a real document.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Claims Registry</CardTitle>
            <CardDescription>
              Every claim below maps to a concrete, repeatable verification method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="overflow-x-auto rounded-lg border border-border/70"
              tabIndex={0}
              role="region"
              aria-label="Verification claims table"
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Claim</th>
                    <th className="px-4 py-3">How to verify</th>
                  </tr>
                </thead>
                <tbody>
                  {claimsRegistry.map((row) => (
                    <tr key={row.claim} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{row.claim}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.verification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Open Source Challenge</CardTitle>
              <CardDescription>
                Don&apos;t trust us? Read the code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full sm:w-auto">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share the Proof</CardTitle>
              <CardDescription>
                Satisfied we&apos;re telling the truth? Share this page with someone who uses
                Smallpdf or Adobe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href={xShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("Share Click", { location: "verify-claims" })}
                  >
                    <X className="h-4 w-4" />
                    Share on X
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("Share Click", { location: "verify-claims" })}
                  >
                    <Linkedin className="h-4 w-4" />
                    Share on LinkedIn
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share text is prefilled with: &ldquo;{shareMessage}&rdquo;
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Want a deeper walkthrough? Use the full verification guide.
            </p>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/learn/verify-offline-processing">
                <Share2 className="h-4 w-4" />
                Open Technical Walkthrough
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

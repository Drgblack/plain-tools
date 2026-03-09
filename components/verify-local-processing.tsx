import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function VerifyLocalProcessing() {
  const steps = [
    "Open your browser Developer Tools.",
    "Switch to the Network tab before you add any file.",
    "Upload a file into the tool and complete the action you need.",
    "Watch for outgoing requests and confirm there is no file upload payload leaving the browser.",
  ]

  return (
    <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge
            variant="outline"
            className="border-accent/30 bg-accent/10 text-foreground"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Files stay on your device
          </Badge>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Verify local processing
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Core PDF workflows on Plain.tools are designed to run locally in your browser.
              That means the file is processed on your device rather than being uploaded to a
              remote processing server. If you want to confirm that claim yourself, you can do it
              with standard browser Developer Tools in a minute or two.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <h3 className="text-sm font-semibold text-foreground">What you should see</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            You may still notice normal page requests such as analytics, scripts, or static assets,
            but the file itself should not be sent as an upload request during the core tool flow.
            The practical check is whether your PDF, image, or document bytes leave the browser as
            part of the action you are running.
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {steps.map((step, index) => (
              <li key={step} className="rounded-xl border border-border/70 bg-card/50 p-3">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/70 bg-background text-xs font-semibold text-foreground">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <h3 className="text-sm font-semibold text-foreground">Continue the trust check</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            If you want the full walkthrough, Plain.tools publishes a dedicated verification page
            explaining what to inspect, what counts as a real upload, and how to repeat the test
            with confidence.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <Link href="/verify-claims" className="block font-medium text-accent hover:underline">
              See detailed verification instructions
            </Link>
            <Link href="/privacy" className="block font-medium text-accent hover:underline">
              Read the privacy policy
            </Link>
            <Link href="/tools" className="block font-medium text-accent hover:underline">
              Browse all PDF tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

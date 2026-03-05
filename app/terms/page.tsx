import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Plain covering free tier usage, Pro subscriptions, cancellation, prohibited use, and governing law.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tools
          </Link>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
            <p className="text-base text-muted-foreground">Last updated: March 3, 2026.</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-medium sm:text-2xl">Free Tier Terms</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Plain free tools are available without account registration for standard local PDF
              processing. Processing is local-first in your browser and provided on an "as is" and
              "as available" basis without warranties of uninterrupted or error-free service.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Fair use applies. You may not abuse, overload, reverse engineer, or otherwise misuse
              the service or infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium sm:text-2xl">Plain Pro Subscription Terms</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Plain Pro is a recurring subscription billed by Stripe. You can cancel at any time via
              the billing portal. Cancellation stops future renewals; access remains active until the
              end of the paid billing period.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base text-muted-foreground">
              <li>Monthly plans are non-refundable for partially used billing periods.</li>
              <li>
                Annual plans are refundable within 14 days in line with applicable EU consumer
                protection rules.
              </li>
              <li>Plain does not process or store payment card details directly.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium sm:text-2xl">Prohibited Use</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              You must not use Plain to process documents you do not own or are not authorised to
              process. You are responsible for legal compliance, confidentiality obligations, and
              lawful handling of document content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium sm:text-2xl">Limitation of Liability</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              To the maximum extent permitted by law, Plain is not liable for indirect, incidental,
              special, consequential, or punitive damages, including data loss, business interruption,
              or loss of profits arising from use of the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium sm:text-2xl">Governing Law and Jurisdiction</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              These terms are governed by German law. The place of jurisdiction is Frankfurt am Main,
              Germany, unless mandatory consumer protection law provides otherwise.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}


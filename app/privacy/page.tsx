import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy policy for Plain. Covers local processing, AI opt-in handling, Pro billing data, processors, GDPR rights, and retention periods.",
  openGraph: {
    title: "Privacy - Plain",
    description:
      "Privacy policy for Plain covering local tool usage, Pro subscriptions, processors, rights, and retention.",
  },
  alternates: {
    canonical: "https://plain.tools/privacy",
  },
}

const SUPPORT_EMAIL = "support@plain.tools"
const DPO_CONTACT = "privacy@plain.tools"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-16 [&_p]:text-base [&_li]:text-base">
        <div className="mx-auto max-w-3xl space-y-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Privacy
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Plain is designed for local-first document processing. This policy explains what data is
            processed for free usage, what changes for Plain Pro billing and accounts, and your rights.
          </p>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">
              What We Collect (Free Tier)
            </h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>No personal data is required for local PDF tool usage.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  Plausible Analytics records anonymous pageview/event metrics only, with no cookies
                  and no personal identifiers.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Support form submissions include email address and message content only.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  AI opt-in tools send extracted text to Anthropic only when you explicitly enable
                  server processing. Plain does not store this text. Anthropic policy:{" "}
                  <a
                    href="https://www.anthropic.com/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    anthropic.com/legal/privacy
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  Abuse prevention uses hashed IP values for rate limiting. Hashes are not linked to
                  account identity.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">
              What We Collect (Plain Pro Accounts)
            </h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Email address via Clerk authentication.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  Stripe customer ID and subscription metadata. Payment card details are processed by
                  Stripe and are never visible to Plain.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>Subscription status and validity timestamps.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>AI usage counters for free-tier/pro enforcement.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>No document content is stored by Plain.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">
              Data Processors
            </h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Anthropic (AI features, opt-in only)</li>
              <li>Stripe (payment processing)</li>
              <li>Clerk (authentication)</li>
              <li>Axiom (server log monitoring)</li>
              <li>Plausible (privacy-first analytics)</li>
              <li>Brevo (transactional email)</li>
              <li>Upstash (rate-limit counters using hashed IPs)</li>
              <li>Vercel (hosting and infrastructure)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">Your GDPR Rights</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You may request access, correction, or deletion of your account-related data. Contact{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
                {SUPPORT_EMAIL}
              </a>
              . For data protection requests in Germany, contact{" "}
              <a href={`mailto:${DPO_CONTACT}`} className="underline underline-offset-2">
                {DPO_CONTACT}
              </a>
              . You may also lodge a complaint with a competent Datenschutzbehorde.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">Data Retention</h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Account data: retained while account is active plus 30 days after deletion.</li>
              <li>Support messages: retained for 90 days.</li>
              <li>Rate-limit counters: retained for a rolling 30-day period.</li>
              <li>
                Payment records: retained for 7 years to satisfy German commercial and tax record
                requirements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground sm:text-2xl">How Files Are Handled</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              PDF processing is local-first in the browser. Document bytes are not uploaded to Plain
              infrastructure during standard tool operations.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: March 3, 2026.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}


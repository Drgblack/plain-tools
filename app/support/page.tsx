import type { Metadata } from "next"
import Link from "next/link"
import { Mail, ShieldCheck, Wrench, BookOpen, Scale, SearchCheck } from "lucide-react"

import { SupportForm } from "@/components/support-form"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbList, buildWebPageSchema, combineJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Support",
  description:
    "Get practical support for Plain Tools workflows, privacy questions, and troubleshooting. Contact options are lightweight and privacy-first.",
  path: "/support",
  image: "/og/default.png",
})

const supportPageSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Support - Plain Tools",
    description:
      "Support options and troubleshooting routes for Plain Tools, with privacy-first contact guidance.",
    url: "https://plain.tools/support",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Support", url: "https://plain.tools/support" },
  ]),
])

const helpfulLinks = [
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Compare", href: "/compare", icon: Scale },
  { label: "Verify claims", href: "/verify-claims", icon: SearchCheck },
  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
]

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-14 md:py-16">
      {supportPageSchema ? <JsonLd id="support-page-schema" schema={supportPageSchema} /> : null}
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Support
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Support is intentionally lightweight and privacy-first. We do not run a third-party ticket
          platform. You can contact us by email, or use the form below, and we reply as quickly as possible
          with practical next steps.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-border bg-card/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-accent" />
              <h2 className="text-base font-semibold">Contact options</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Email support at{" "}
              <a
                href="mailto:support@plain.tools"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                support@plain.tools
              </a>
              . For product, privacy, and process questions, include relevant details so we can help quickly.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Response style: concise, practical, and privacy-aware. No outsourced support scripts.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <h2 className="text-base font-semibold">Before contacting support</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Check the relevant tool page disclaimer and options first.</li>
              <li>- Review privacy verification steps in the verification guide.</li>
              <li>- For workflow questions, check Learn guides for step-by-step help.</li>
            </ul>
          </section>
        </div>

        <section className="mt-8">
          <SupportForm />
        </section>

        <section className="mt-10 rounded-xl border border-border bg-card/40 p-5">
          <h2 className="text-base font-semibold text-foreground">Helpful links</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Jump to the right section for faster answers and clearer context.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {helpfulLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

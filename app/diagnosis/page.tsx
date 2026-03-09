import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { DiagnosisTool } from "@/components/DiagnosisTool"
import { FaqBlock } from "@/components/seo/faq-block"
import { JsonLd } from "@/components/seo/json-ld"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  DIAGNOSIS_FAQS,
  getPopularDiagnosisLinks,
} from "@/lib/diagnosis-rules"
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildHowToSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const revalidate = 86400

export const metadata: Metadata = buildPageMetadata({
  title: "PDF Problem Diagnosis - Fix Large Files, Won't Open, Password Issues",
  description:
    "Diagnose PDF and file problems in plain language, then get the best private Plain Tools route for large files, locked PDFs, scans, and conversions.",
  path: "/diagnosis",
  image: "/og/tools.png",
})

export default function DiagnosisPage() {
  const popularLinks = getPopularDiagnosisLinks()

  const schema = combineJsonLd([
    buildWebPageSchema({
      name: "PDF Problem Diagnosis",
      description:
        "Diagnose PDF and file issues in plain language, then jump to the most relevant local Plain Tools workflow.",
      url: "https://plain.tools/diagnosis",
    }),
    buildFaqPageSchema(DIAGNOSIS_FAQS.map((faq) => ({ ...faq }))),
    buildHowToSchema("How to diagnose a PDF problem", metadata.description as string, [
      {
        name: "Describe the issue",
        text: "Pick the closest file type, problem, device, and goal, then add optional detail in plain language.",
      },
      {
        name: "Review the diagnosis",
        text: "Read the recommended routes and why each one fits the problem you described.",
      },
      {
        name: "Open the best route",
        text: "Start with the top recommendation, review the output, then step back into the diagnosis flow if you still need another pass.",
      },
    ]),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Diagnosis", url: "https://plain.tools/diagnosis" },
    ]),
  ])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {schema ? <JsonLd id="diagnosis-schema" schema={schema} /> : null}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
          <PageBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Diagnosis" },
            ]}
            className="mb-4"
          />

          <header className="max-w-4xl space-y-5">
            <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Problem diagnosis
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Diagnose a PDF or file problem in plain language
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-[1.03rem]">
              If you know the symptom but not the right route, this page shortens the gap. Many
              file problems sound simple on the surface: the PDF is too large, the scan is hard to
              edit, the file will not open, the portal keeps rejecting it, or the document needs to
              be shared without adding more privacy risk. The harder part is deciding which tool is
              actually the best fit. A generic tools directory helps if you already know the answer.
              A diagnosis layer helps when you do not.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground md:text-[1.03rem]">
              Plain Tools is built around practical local workflows, so the diagnosis flow is honest
              about what happens next. It does not pretend every issue has one magic fix. Instead it
              maps the symptom, device, and goal to the most relevant main tool or tool-variant
              route. That matters because “compress PDF” is not the same job as “compress PDF for
              email”, and “make a scanned PDF searchable” is not the same job as “convert PDF to
              Word so I can edit the wording”.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground md:text-[1.03rem]">
              The diagnosis itself stays local in the browser. Your free-text explanation is used to
              rank recommendations on-device, not sent to Plain Tools. Once you open a recommended
              route, the core local workflow keeps file bytes on your device for the supported tools
              that genuinely work that way. That makes this page useful both as a triage layer and
              as a trust signal for privacy-conscious users who want more than a grid of buttons.
            </p>
          </header>

          <section className="mt-10">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-border/80 bg-card/60 p-5 text-sm text-muted-foreground shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
                  Loading the diagnosis tool...
                </div>
              }
            >
              <DiagnosisTool />
            </Suspense>
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                How the diagnosis works
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  The rule engine combines the obvious signals first: file type, main problem,
                  device, and goal. Then it uses your free-text description to catch the language
                  people actually use, such as “too large for email”, “password locked”, “scan
                  needs editing”, or “job portal rejects my PDF”. That lets the page recommend
                  routes that feel more specific than a generic category page without inventing a
                  fake AI answer or sending the text to a remote classifier.
                </p>
                <p>
                  The strongest matches usually point to a tool-variant page because the modifier is
                  where user intent becomes clearer. For example, a user trying to compress a file
                  for email usually needs a different outcome from someone compressing a file for
                  archive storage. The same principle applies to merging on Mac, making scanned PDFs
                  searchable, or preparing a password-protected file for sharing. Diagnosis is most
                  useful when it helps you start on the right route first time.
                </p>
              </div>
            </div>

            <aside className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Popular diagnosis routes
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {popularLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-xl border border-border/70 bg-background/70 px-3 py-2 transition hover:border-accent/40 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Trust and next steps
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-border/70 bg-background/70 p-4">
                <h3 className="text-sm font-semibold text-foreground">Local diagnosis</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The diagnosis form ranks routes in your browser. It does not send your typed issue
                  description to Plain Tools.
                </p>
              </article>
              <article className="rounded-xl border border-border/70 bg-background/70 p-4">
                <h3 className="text-sm font-semibold text-foreground">Core local workflows</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The recommended routes prioritise tools where the main processing path stays on
                  your device with no file upload step to Plain Tools.
                </p>
              </article>
              <article className="rounded-xl border border-border/70 bg-background/70 p-4">
                <h3 className="text-sm font-semibold text-foreground">Verify if you want proof</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Open{" "}
                  <Link href="/verify-claims" className="font-medium text-accent hover:underline">
                    Verify Claims
                  </Link>{" "}
                  to inspect the behaviour in DevTools and confirm the local-processing promise for
                  yourself.
                </p>
              </article>
            </div>
          </section>

          <div className="mt-10">
            <FaqBlock faqs={DIAGNOSIS_FAQS.map((faq) => ({ ...faq }))} />
          </div>
        </div>
      </main>
    </div>
  )
}

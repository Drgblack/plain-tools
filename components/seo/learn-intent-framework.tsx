import Link from "next/link"

import { LEARN_GEO_OVERRIDES } from "@/lib/seo/geo-overrides"
import type { RouteLink } from "@/lib/seo/tranche1-link-map"
import type { TrancheLearnArticle } from "@/lib/seo/tranche1-content"

type LearnIntentFrameworkProps = {
  article: TrancheLearnArticle
  primaryToolLink: RouteLink
  compareLink: RouteLink
}

function pickSectionParagraph(article: TrancheLearnArticle, sectionId: string, fallback = "") {
  return article.sections.find((section) => section.id === sectionId)?.paragraphs[0] ?? fallback
}

function pickSectionBullets(article: TrancheLearnArticle, sectionId: string, fallback: string[]) {
  return article.sections.find((section) => section.id === sectionId)?.bullets ?? fallback
}

export function LearnHowToFramework({ article, primaryToolLink, compareLink }: LearnIntentFrameworkProps) {
  const override = LEARN_GEO_OVERRIDES[article.slug]
  const summary =
    override?.summary ??
    article.intro[0] ??
    "Use this workflow locally and verify output quality before sharing."

  const whenToUse =
    override?.whenToUse ?? [
      pickSectionParagraph(article, "quick-answer", "You need a predictable local workflow for sensitive files."),
      pickSectionParagraph(article, "quality-checks", "You need a repeatable review process before sharing output."),
    ]

  const steps =
    override?.steps ??
    pickSectionBullets(article, "step-by-step", [
      "Prepare the source file(s) and expected output scope.",
      "Run the local operation in your browser.",
      "Review the result and export the final file.",
    ])

  const limitations =
    override?.limitations ?? [
      pickSectionParagraph(article, "quality-checks", "Output quality depends on source file quality and device performance."),
      "Very large files may be constrained by browser memory.",
      "Always re-check critical pages before sharing externally.",
    ]

  const privacyNote =
    override?.privacyNote ??
    `Local processing: ${article.trustBox.localProcessing} ${article.trustBox.noUploads}`

  const relatedQuestions =
    override?.relatedQuestions ?? article.faqs.slice(0, 4).map((faq) => faq.question)

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/45 p-4 md:p-5">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">How-to framework</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">When to use this tool</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Step-by-step instructions</h3>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Limitations and caveats</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Privacy note</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{privacyNote}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Related tools and comparisons</h3>
        <div className="flex flex-wrap gap-2">
          {[primaryToolLink, compareLink, { label: "Verify claims", href: "/verify-claims" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent/40 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Related questions</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {relatedQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function LearnTrustExplainerFramework({ article, primaryToolLink, compareLink }: LearnIntentFrameworkProps) {
  const override = LEARN_GEO_OVERRIDES[article.slug]
  const summary =
    override?.summary ??
    article.intro[0] ??
    "Use this explainer to validate claims with technical checks, not marketing language."

  const whenToUse =
    override?.whenToUse ?? [
      "You need to validate privacy claims before adopting a document tool.",
      "You are handling sensitive files and require no-upload controls.",
      "You need practical trade-offs between local and hosted workflows.",
    ]

  const steps =
    override?.steps ?? [
      "Run one representative workflow and inspect network traffic in DevTools.",
      "Document what is verifiable versus what is policy-only.",
      "Choose the processing model that matches your risk class.",
    ]

  const limitations =
    override?.limitations ?? [
      "Local-first processing reduces exposure but is not a full security programme.",
      "Device security, access control, and governance still matter.",
      "Tool behaviour can change over time and should be re-verified.",
    ]

  const privacyNote =
    override?.privacyNote ??
    `Local processing: ${article.trustBox.localProcessing} ${article.trustBox.noUploads}`

  const relatedQuestions =
    override?.relatedQuestions ?? article.faqs.slice(0, 4).map((faq) => faq.question)

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/45 p-4 md:p-5">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">Trust explainer framework</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">When this explainer helps</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Verification workflow</h3>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Trade-offs and caveats</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Privacy note</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{privacyNote}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Related tools and comparisons</h3>
        <div className="flex flex-wrap gap-2">
          {[primaryToolLink, compareLink, { label: "Browse all tools", href: "/tools" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent/40 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Related questions</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {relatedQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

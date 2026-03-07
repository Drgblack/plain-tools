import Link from "next/link"

import { COMPARE_GEO_OVERRIDES } from "@/lib/seo/geo-overrides"
import type { RouteLink } from "@/lib/seo/tranche1-link-map"
import type { TrancheComparePage } from "@/lib/seo/tranche1-content"

type CompareFrameworkBlockProps = {
  page: TrancheComparePage
  toolLinks: RouteLink[]
}

function sectionParagraphs(page: TrancheComparePage, id: string, fallback: string[] = []) {
  return page.sections.find((section) => section.id === id)?.paragraphs ?? fallback
}

export function CompareFrameworkBlock({ page, toolLinks }: CompareFrameworkBlockProps) {
  const override = COMPARE_GEO_OVERRIDES[page.slug]
  const quickAnswer =
    override?.quickAnswer ??
    sectionParagraphs(page, "quick-summary", [
      "Use this comparison to evaluate privacy model, workflow friction, and fit for sensitive document handling.",
    ])[0]

  const privacyDifferences =
    override?.privacyDifferences ??
    sectionParagraphs(page, "privacy-comparison", [
      "Compare where file bytes are processed and what is directly verifiable.",
      "Use DevTools checks for no-upload claims when handling sensitive data.",
    ])

  const workflowDifferences =
    override?.workflowDifferences ??
    sectionParagraphs(page, "workflow-speed-comparison", [
      "Compare upload/download steps against local execution speed and consistency.",
      "Assess throughput using your own typical file sizes and connectivity.",
    ])

  const bestFor =
    override?.bestFor ??
    sectionParagraphs(page, "best-for", [
      "Choose based on document sensitivity, policy obligations, and operational workflow needs.",
    ])

  const whenPlainBetter =
    override?.whenPlainBetter ??
    sectionParagraphs(page, "when-plain", [
      "No-upload handling and local verification are mandatory for your workflow.",
    ])

  const whenOtherBetter =
    override?.whenOtherBetter ??
    sectionParagraphs(page, "when-other", [
      "Hosted collaboration and account administration are your primary requirements.",
    ])

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/45 p-4 md:p-5">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">Comparison framework</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{quickAnswer}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Privacy differences</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {privacyDifferences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Workflow differences</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {workflowDifferences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Best for</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {bestFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-border/60 bg-background/35 p-3">
          <h3 className="text-sm font-semibold text-foreground">When Plain Tools is the better fit</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {whenPlainBetter.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 rounded-lg border border-border/60 bg-background/35 p-3">
          <h3 className="text-sm font-semibold text-foreground">When another tool may suit better</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {whenOtherBetter.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Related tools</h3>
        <div className="flex flex-wrap gap-2">
          {toolLinks.slice(0, 4).map((link) => (
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
    </section>
  )
}

import type { Metadata } from "next"
import Link from "next/link"

import { buildPageMetadata } from "@/lib/page-metadata"
import {
  CALCULATOR_CATEGORY_LABELS,
  CALCULATOR_PUBLIC_CATEGORY_ORDER,
  generateCategoryCalculatorParams,
} from "@/lib/calculator-financial-deep"

export const metadata: Metadata = buildPageMetadata({
  title: "Financial calculator hub | Plain Tools",
  description:
    "Browse browser-only financial calculators for mortgages, paychecks, 401(k)s, IRAs, auto loans, student loans, savings growth, CDs, debt ratios, tax checks, and debt payoff planning.",
  path: "/calculators",
  image: "/og/default.png",
})

export default function CalculatorsHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Browser only
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Financial calculator hub
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Every calculator route on Plain Tools keeps the math in the browser. Open a category,
          jump into an exact-match scenario, and compare nearby inputs without uploading anything
          or sending financial numbers to a server.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CALCULATOR_PUBLIC_CATEGORY_ORDER.map((category) => {
          const examples = generateCategoryCalculatorParams(category, 3)
          return (
            <article
              key={category}
              className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)]"
            >
              <Link
                href={`/calculators/${category}`}
                className="text-lg font-semibold text-foreground hover:text-accent hover:underline"
              >
                {CALCULATOR_CATEGORY_LABELS[category]}
              </Link>
              <div className="mt-4 space-y-2 text-sm">
                {examples.map((entry) => (
                  <Link
                    key={entry.expression}
                    href={`/calculators/${category}/${entry.expression}`}
                    className="block text-muted-foreground hover:text-accent hover:underline"
                  >
                    {entry.expression.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

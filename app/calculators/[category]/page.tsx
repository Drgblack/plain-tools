import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { buildPageMetadata } from "@/lib/page-metadata"
import {
  CALCULATOR_CATEGORY_LABELS,
  CALCULATOR_PUBLIC_CATEGORY_ORDER,
  generateCategoryCalculatorParams,
  isCalculatorCategory,
} from "@/lib/calculator-financial-deep"

type Props = {
  params: Promise<{ category: string }>
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "basic-loan-payment":
    "Monthly payment estimates for exact principal, APR, and term combinations.",
  "compound-interest-basic":
    "Introductory growth scenarios with annual, quarterly, and monthly compounding.",
  "credit-card-payoff":
    "Debt payoff pages that compare balance, APR, monthly payment, and timeline.",
  percentage:
    "Exact-match percentage routes for discounts, commissions, grades, and quick math checks.",
  "retirement-savings-intro":
    "Recurring-contribution savings pages for fast first-pass retirement planning.",
  "salary-to-hourly":
    "Compensation conversion pages for offer comparison and take-home planning.",
  "savings-goal":
    "Goal-timeline pages for target amount, monthly contribution, and interest-rate scenarios.",
  "simple-interest":
    "Linear interest pages for classroom, business, and first-pass finance calculations.",
  "tax-estimate-simple":
    "Quick effective-rate tax estimate pages for gross-to-net comparisons.",
  "tip-calculator":
    "Tip pages for bill total, gratuity amount, and simple split scenarios.",
}

export function generateStaticParams() {
  return CALCULATOR_PUBLIC_CATEGORY_ORDER.map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params

  if (
    !isCalculatorCategory(category) ||
    !CALCULATOR_PUBLIC_CATEGORY_ORDER.includes(category as (typeof CALCULATOR_PUBLIC_CATEGORY_ORDER)[number])
  ) {
    return {
      ...buildPageMetadata({
        title: "Calculator category not found | Plain Tools",
        description: "The requested calculator category does not exist.",
        path: `/calculators/${category}`,
        image: "/og/default.png",
      }),
      robots: { follow: false, index: false },
    }
  }

  return buildPageMetadata({
    title: `${CALCULATOR_CATEGORY_LABELS[category]} | Plain Tools`,
    description: CATEGORY_DESCRIPTIONS[category] ?? "Browse exact-match financial calculator scenarios.",
    path: `/calculators/${category}`,
    image: "/og/default.png",
  })
}

export default async function CalculatorCategoryHubPage({ params }: Props) {
  const { category } = await params

  if (
    !isCalculatorCategory(category) ||
    !CALCULATOR_PUBLIC_CATEGORY_ORDER.includes(category as (typeof CALCULATOR_PUBLIC_CATEGORY_ORDER)[number])
  ) {
    notFound()
  }

  const examples = generateCategoryCalculatorParams(category, 36)

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl space-y-4">
        <Link href="/calculators" className="text-sm text-accent hover:underline">
          Financial calculator hub
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {CALCULATOR_CATEGORY_LABELS[category]}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {CATEGORY_DESCRIPTIONS[category]} Every route in this cluster keeps calculations local in
          the browser and links into nearby scenarios instead of resetting the user back to a blank
          form.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Popular exact-match pages
        </h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {examples.map((entry) => (
            <Link
              key={entry.expression}
              href={`/calculators/${category}/${entry.expression}`}
              className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
            >
              {entry.expression.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

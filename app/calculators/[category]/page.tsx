import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/seo/json-ld"
import { LinkGridSection } from "@/components/seo/link-grid-section"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  CALCULATOR_CATEGORY_LABELS,
  CALCULATOR_PUBLIC_CATEGORY_ORDER,
  generateCategoryCalculatorParams,
  isCalculatorCategory,
} from "@/lib/calculator-financial-deep"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  combineJsonLd,
} from "@/lib/structured-data"

type Props = {
  params: Promise<{ category: string }>
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "401k-growth":
    "Retirement-growth pages for salary, contribution rate, employer match, return, and time horizon.",
  "apy-calculator":
    "Savings-growth pages for deposit amount, annual yield, compounding, and time horizon.",
  "auto-loan-payment":
    "Vehicle-financing pages for price, APR, term length, down payment, and monthly payment checks.",
  "basic-loan-payment":
    "Monthly payment estimates for exact principal, APR, and term combinations.",
  "break-even-calculator":
    "Break-even pages for fixed costs, price, unit cost, and revenue-threshold planning.",
  "cd-calculator":
    "Certificate-of-deposit pages for deposit size, rate, term length, and maturity value checks.",
  "compound-interest-basic":
    "Introductory growth scenarios with annual, quarterly, and monthly compounding.",
  "credit-card-payoff":
    "Debt payoff pages that compare balance, APR, monthly payment, and timeline.",
  "debt-to-income":
    "Qualification-style ratio pages for annual income, monthly debt, and housing payment assumptions.",
  "emergency-fund":
    "Reserve-target pages for monthly expenses and emergency-fund coverage length.",
  "ira-growth":
    "IRA-growth pages for annual contribution, return, account type, and time horizon.",
  "mortgage-payment":
    "Home-finance pages for property price, rate, term, and down-payment scenarios.",
  percentage:
    "Exact-match percentage routes for discounts, commissions, grades, and quick math checks.",
  "paycheck-estimate":
    "Gross-to-net paycheck estimate pages by salary, pay frequency, and state context.",
  "refinance-savings":
    "Refinance pages that compare current rate, new rate, balance, and projected savings.",
  "retirement-savings-intro":
    "Recurring-contribution savings pages for fast first-pass retirement planning.",
  "salary-to-hourly":
    "Compensation conversion pages for offer comparison and take-home planning.",
  "savings-goal":
    "Goal-timeline pages for target amount, monthly contribution, and interest-rate scenarios.",
  "simple-interest":
    "Linear interest pages for classroom, business, and first-pass finance calculations.",
  "student-loan-payment":
    "Student-debt pages for balance, APR, term, extra payments, and payoff timeline comparisons.",
  "tax-estimate-simple":
    "Quick effective-rate tax estimate pages for gross-to-net comparisons.",
  "tip-calculator":
    "Tip pages for bill total, gratuity amount, and simple split scenarios.",
}

const CATEGORY_GUIDES: Record<string, Array<{ description: string; href: string; label: string }>> = {
  default: [
    {
      label: "How we verify no-upload claims",
      href: "/blog/how-we-verify-no-upload-claims",
      description: "Review how Plain Tools documents local processing and trust claims.",
    },
    {
      label: "How to verify a tool does not upload your files",
      href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      description: "Apply the same browser-verification workflow to other utility categories.",
    },
    {
      label: "Topical map",
      href: "/topics",
      description: "Jump into adjacent clusters such as status checks, file converters, and guides.",
    },
  ],
  "mortgage-payment": [
    {
      label: "Break-even calculator hub",
      href: "/calculators/break-even-calculator",
      description: "Compare fixed-cost thresholds when a housing or business decision needs a quick revenue line.",
    },
    {
      label: "Refinance savings hub",
      href: "/calculators/refinance-savings",
      description: "Move from purchase scenarios into refinance comparisons for the same balance range.",
    },
    {
      label: "Financial calculator hub",
      href: "/calculators",
      description: "Return to the wider calculator cluster when the task shifts to savings, paychecks, or debt.",
    },
  ],
  "paycheck-estimate": [
    {
      label: "Salary to hourly hub",
      href: "/calculators/salary-to-hourly",
      description: "Move from gross-to-net estimates into compensation comparison math.",
    },
    {
      label: "Tax estimate hub",
      href: "/calculators/tax-estimate-simple",
      description: "Use a quick effective-rate check when the main question is taxes rather than payroll cadence.",
    },
    {
      label: "Financial calculator hub",
      href: "/calculators",
      description: "Browse other money-planning clusters without leaving the local-calculation environment.",
    },
  ],
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
  const siblingCategories = CALCULATOR_PUBLIC_CATEGORY_ORDER.filter((entry) => entry !== category)
    .slice(0, 6)
    .map((entry) => ({
      label: CALCULATOR_CATEGORY_LABELS[entry],
      href: `/calculators/${entry}`,
      description: CATEGORY_DESCRIPTIONS[entry],
    }))
  const guideLinks = CATEGORY_GUIDES[category] ?? CATEGORY_GUIDES.default
  const categorySchema = combineJsonLd([
    buildCollectionPageSchema({
      name: CALCULATOR_CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category] ?? "Browse exact-match calculator scenarios.",
      url: `https://plain.tools/calculators/${category}`,
    }),
    buildBreadcrumbList([
      { name: "Home", url: "https://plain.tools/" },
      { name: "Calculators", url: "https://plain.tools/calculators" },
      { name: CALCULATOR_CATEGORY_LABELS[category], url: `https://plain.tools/calculators/${category}` },
    ]),
    buildItemListSchema(
      `${CALCULATOR_CATEGORY_LABELS[category]} scenarios`,
      examples.map((entry) => ({
        name: entry.expression.replace(/-/g, " "),
        url: `https://plain.tools/calculators/${category}/${entry.expression}`,
      })),
      `https://plain.tools/calculators/${category}`
    ),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {categorySchema ? <JsonLd id={`calculator-category-${category}-schema`} schema={categorySchema} /> : null}
      <header className="max-w-3xl space-y-4">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Calculators", href: "/calculators" },
            { label: CALCULATOR_CATEGORY_LABELS[category] },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {CALCULATOR_CATEGORY_LABELS[category]}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {CATEGORY_DESCRIPTIONS[category]} Every route in this cluster keeps calculations local in
          the browser and links into nearby scenarios instead of resetting the user back to a blank
          form.
        </p>
      </header>

      <div className="mt-10 grid gap-6">
        <LinkGridSection
          title="Related calculator categories"
          description="Keep the cluster shallow by moving between nearby finance intents instead of restarting from the main directory each time."
          items={siblingCategories}
          columns="3"
        />
      </div>

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

      <div className="mt-10 grid gap-6">
        <LinkGridSection
          title="Support pages for this calculator cluster"
          description="These links reinforce the privacy model, hub structure, and nearby finance sections without diluting the intent of the category itself."
          items={guideLinks}
          columns="3"
        />
      </div>
    </main>
  )
}

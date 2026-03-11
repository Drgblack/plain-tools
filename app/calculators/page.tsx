import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/seo/json-ld"
import { LinkGridSection } from "@/components/seo/link-grid-section"
import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  CALCULATOR_CATEGORY_LABELS,
  CALCULATOR_PUBLIC_CATEGORY_ORDER,
  generateCategoryCalculatorParams,
} from "@/lib/calculator-financial-deep"
import {
  buildBreadcrumbList,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
  combineJsonLd,
} from "@/lib/structured-data"

export const metadata: Metadata = buildPageMetadata({
  title: "Financial calculator hub | Plain Tools",
  description:
    "Browse browser-only financial calculators for mortgages, paychecks, 401(k)s, IRAs, auto loans, student loans, savings growth, CDs, debt ratios, tax checks, and debt payoff planning.",
  path: "/calculators",
  image: "/og/default.png",
})

const featuredCategories = [
  {
    label: "Mortgage payment calculators",
    href: "/calculators/mortgage-payment",
    description: "Home-price, rate, term, and down-payment scenarios for first-pass housing math.",
  },
  {
    label: "Paycheck estimate calculators",
    href: "/calculators/paycheck-estimate",
    description: "Salary, pay frequency, and state-level gross-to-net checks for take-home planning.",
  },
  {
    label: "401(k) growth calculators",
    href: "/calculators/401k-growth",
    description: "Contribution, match, return, and time-horizon scenarios for retirement planning.",
  },
  {
    label: "Auto loan payment calculators",
    href: "/calculators/auto-loan-payment",
    description: "Vehicle price, APR, term, and down-payment combinations for monthly cost checks.",
  },
  {
    label: "Debt-to-income calculators",
    href: "/calculators/debt-to-income",
    description: "Qualification-style DTI pages for income, housing, and debt obligations.",
  },
  {
    label: "APY and CD calculators",
    href: "/calculators/apy-calculator",
    description: "Savings and CD growth pages for deposit size, compounding, and term planning.",
  },
]

const trustAndSupportLinks = [
  {
    label: "How we verify no-upload claims",
    href: "/blog/how-we-verify-no-upload-claims",
    description: "See how Plain Tools documents privacy claims and browser-side processing behaviour.",
  },
  {
    label: "How to verify a tool does not upload your files",
    href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    description: "Apply the same verification mindset to other utility workflows and browser tooling.",
  },
  {
    label: "Topical map",
    href: "/topics",
    description: "Jump from calculators into the broader utility, guide, status, and conversion clusters.",
  },
]

const calculatorsHubSchema = combineJsonLd([
  buildWebPageSchema({
    name: "Financial calculator hub | Plain Tools",
    description:
      "Browser-only financial calculators for mortgages, paychecks, 401(k)s, IRAs, loans, CDs, savings growth, and debt planning.",
    url: "https://plain.tools/calculators",
  }),
  buildCollectionPageSchema({
    name: "Financial calculator hub",
    description:
      "Collection of local browser calculators for budgeting, debt, savings, and simple finance planning.",
    url: "https://plain.tools/calculators",
  }),
  buildBreadcrumbList([
    { name: "Home", url: "https://plain.tools/" },
    { name: "Calculators", url: "https://plain.tools/calculators" },
  ]),
  buildItemListSchema(
    "Calculator categories",
    CALCULATOR_PUBLIC_CATEGORY_ORDER.map((category) => ({
      name: CALCULATOR_CATEGORY_LABELS[category],
      url: `https://plain.tools/calculators/${category}`,
    })),
    "https://plain.tools/calculators"
  ),
])

export default function CalculatorsHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {calculatorsHubSchema ? <JsonLd id="calculators-hub-schema" schema={calculatorsHubSchema} /> : null}
      <header className="max-w-3xl space-y-4">
        <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators" }]} />
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

      <div className="mt-10 grid gap-6">
        <LinkGridSection
          title="Top calculator clusters"
          description="Start with a category hub when you want nearby scenarios, stronger internal linking, and a clearer path into the exact-match long tail."
          items={featuredCategories}
          columns="3"
        />
      </div>

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

      <div className="mt-10 grid gap-6">
        <LinkGridSection
          title="Trust, privacy, and related clusters"
          description="These supporting pages explain the privacy model behind browser-based workflows and connect the calculator hub to the rest of the site architecture."
          items={trustAndSupportLinks}
          columns="3"
        />
      </div>
    </main>
  )
}

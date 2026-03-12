import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import type { ToolDefinition } from "@/lib/tools-catalogue"

export type PercentageCalculatorRouteParams = {
  expression: string
}

type PercentageSeed = {
  base: number
  percent: number
}

type PercentageCalculatorPage = {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  description: string
  expression: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  liveToolDescription: string
  page: ProgrammaticPageData
  siloLinks: Array<{ href: string; label: string }>
  title: string
}

const percentageTool: ToolDefinition = {
  available: true,
  category: "Utility",
  description:
    "Calculate percentage questions locally with a browser-only calculator, shareable canonical URLs, and no upload or account step.",
  id: "percentage-calculator",
  name: "Percentage Calculator",
  slug: "percentage-calculator",
}

const PERCENT_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 22, 25, 30, 33, 35, 40, 45, 50,
  60, 65, 70, 75, 80, 85, 90, 95,
] as const

const BASE_VALUES = [
  10, 12, 15, 18, 20, 24, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90, 100, 120, 125,
  150, 175, 180, 200, 225, 240, 250, 300, 350, 400, 450, 500, 600,
] as const

export const CALCULATOR_PERCENTAGE_SEEDS: PercentageSeed[] = PERCENT_VALUES.flatMap((percent) =>
  BASE_VALUES.map((base) => ({ base, percent }))
)

export function percentageExpressionFor(percent: number, base: number) {
  return `what-is-${percent}-percent-of-${base}`
}

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function roundNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

function parseNumberish(value: string) {
  const normalized = value.replace(/-/g, " ")
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function parsePercentageExpression(expression: string) {
  const decoded = decodeURIComponent(expression).trim().toLowerCase()
  const match = /^what-is-([0-9]+(?:\.[0-9]+)*)-percent-of-([0-9]+(?:\.[0-9]+)*)$/.exec(
    decoded
  )
  if (!match) return null

  const percent = parseNumberish(match[1] ?? "")
  const base = parseNumberish(match[2] ?? "")
  if (percent === null || base === null || percent < 0 || base < 0) return null

  return {
    base,
    expression: percentageExpressionFor(percent, base),
    percent,
    result: (percent / 100) * base,
  }
}

function relatedTools(percent: number, base: number): ProgrammaticRelatedTool[] {
  const nearby = [
    { base, percent: Math.max(1, percent - 5) },
    { base, percent: percent + 5 },
    { base: Math.max(10, base - 50), percent },
    { base: base + 50, percent },
  ]

  return [
    ...nearby.map((entry) => ({
      description: `Check ${entry.percent}% of ${entry.base} on its own canonical calculator page.`,
      href: `/calculators/percentage/${percentageExpressionFor(entry.percent, entry.base)}`,
      name: `${entry.percent}% of ${entry.base}`,
    })),
    {
      description: "Compare privacy-first PDF utilities if the percentage page is part of a document workflow.",
      href: "/compare/plain-tools-vs-smallpdf",
      name: "PDF tool comparison",
    },
    {
      description: "Open the full PDF tools hub for adjacent document tasks.",
      href: "/tools",
      name: "PDF tools",
    },
  ].slice(0, 6)
}

export function getCalculatorPaths() {
  return CALCULATOR_PERCENTAGE_SEEDS.map((seed) =>
    `/calculators/percentage/${percentageExpressionFor(seed.percent, seed.base)}`
  )
}

export function generatePercentageCalculatorParams(limit = CALCULATOR_PERCENTAGE_SEEDS.length) {
  return CALCULATOR_PERCENTAGE_SEEDS.slice(0, limit).map((seed) => ({
    expression: percentageExpressionFor(seed.percent, seed.base),
  }))
}

export function getPercentageCalculatorPage(
  expression: string
): PercentageCalculatorPage | null {
  const parsed = parsePercentageExpression(expression)
  if (!parsed) return null

  const { base, percent, result } = parsed
  const resultLabel = roundNumber(result)
  const canonicalPath = `/calculators/percentage/${parsed.expression}`
  const title = `What is ${percent}% of ${base}? – Free Percentage Calculator | Plain Tools`
  const description = buildMetaDescription(
    `Calculate what ${percent}% of ${base} is with a browser-based percentage calculator. Plain Tools keeps the calculation local, fast, and shareable with no upload or account step.`
  )
  const intro = [
    `Searches like "what is ${percent}% of ${base}" are common because people usually need the answer inside a real workflow, not as a math exercise. It might be a discount, markup, tax estimate, payout split, budget adjustment, grade calculation, or document review threshold. The useful page is the one that gives the answer instantly, explains the formula clearly, and stays lightweight enough to reuse without friction.`,
    `Plain Tools treats calculator pages the same way it treats the rest of the programmatic stack: a canonical URL, a live tool, useful surrounding explanation, and no account, upload, or tracking-heavy detour. For this route, ${percent}% of ${base} equals ${resultLabel}. The rest of the page explains why that matters and how to reuse the calculation safely in common business and admin contexts.`,
  ]
  const whyUsersNeedThis = [
    `Percentage queries are high-volume because they sit inside everyday work. Teams use them for pricing reviews, revenue checks, grant calculations, project reporting, pay adjustments, quota tracking, and invoice validation. A route like this earns its place when it does more than print one number and disappear.`,
    `That is why this page explains the formula, the common use cases, and the practical interpretation of the result. For ${percent}% of ${base}, the answer is ${resultLabel}, but the user often also needs to know how to verify the number or compare it with nearby percentage scenarios.`,
  ]
  const howItWorks = [
    "The embedded calculator below runs fully in the browser. Change the percentage or base value, and the route can open the matching canonical page immediately without any upload or account step.",
    "That local, browser-only approach is simple, but it still matters. It keeps the page fast, reusable, and safe to use in internal admin workflows where users want a quick answer rather than a bloated calculator portal.",
  ]
  const howToSteps: ProgrammaticHowToStep[] = [
    { name: "Identify the percentage value", text: `Here the percentage is ${percent}, which means ${percent} parts out of every 100.` },
    { name: "Identify the base value", text: `The base in this expression is ${base}, which is the total amount you are taking the percentage from.` },
    { name: "Multiply and divide by 100", text: `${percent} multiplied by ${base}, then divided by 100, gives ${resultLabel}.` },
    { name: "Check the business meaning", text: "Once the raw number is correct, interpret it in context: discount, tax, fee, quota, score, or share." },
  ]
  const explanationBlocks: ProgrammaticExplanationBlock[] = [
    {
      paragraphs: [
        `The core formula is straightforward: percentage x base / 100. For this page that means ${percent} x ${base} / 100 = ${resultLabel}.`,
        "The value of a good calculator page is not hiding the formula. It is showing the answer quickly, then giving enough context that users can trust and reuse it.",
      ],
      title: "Formula breakdown",
    },
    {
      paragraphs: [
        `A result like ${resultLabel} commonly appears in pricing, payroll, grading, commissions, margin reviews, savings estimates, and basic forecasting.`,
        "That is why percentage pages can support high-intent organic traffic even though the math itself is simple. The surrounding explanation and internal links make the route more useful than a bare calculator box.",
      ],
      title: "Where this calculation shows up",
    },
    {
      paragraphs: [
        "Plain Tools keeps calculator pages aligned with the wider privacy-first site posture: local processing, no upload, no account, and direct internal links to adjacent tasks.",
        "For calculators, the privacy angle is mostly about low-friction execution. The page does not need extra data to answer a simple percentage question.",
      ],
      title: "Why this route is intentionally lightweight",
    },
  ]
  const privacyNote = [
    "This calculator runs entirely in the browser. There is no upload step, no document handoff, and no account requirement attached to the route.",
    "That matters because even simple admin calculations are often part of broader business workflows. Plain Tools keeps the page quick and local so the user gets the answer without extra friction.",
  ]
  const faq: ProgrammaticFaq[] = [
    {
      answer: `${percent}% of ${base} is ${resultLabel}.`,
      question: `What is ${percent}% of ${base}?`,
    },
    {
      answer: `Multiply ${base} by ${percent}, then divide by 100. That gives ${resultLabel}.`,
      question: "How do I calculate it manually?",
    },
    {
      answer:
        "Yes. Change either input in the embedded calculator and open the matching canonical route for the new expression.",
      question: "Can I change the numbers on this page?",
    },
    {
      answer:
        "Percentage calculations appear in discounts, commissions, taxes, budget changes, grades, and conversion-rate style reporting.",
      question: "When would I use a page like this?",
    },
    {
      answer:
        "Yes. The math runs locally in the browser, so the page stays fast and does not need any uploaded data or account setup.",
      question: "Does this calculator work locally?",
    },
    {
      answer:
        "Open one of the related calculator pages or adjust the inputs in the live calculator to move into the next expression.",
      question: "What should I do if I need a different percentage?",
    },
  ]
  const wordCount = countWords([
    title,
    description,
    ...intro,
    ...whyUsersNeedThis,
    ...howItWorks,
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...explanationBlocks.flatMap((block) => [block.title, ...block.paragraphs]),
    ...privacyNote,
    ...faq.flatMap((item) => [item.question, item.answer]),
  ])

  return {
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/calculators", label: "Calculators" },
      { href: "/calculators/percentage", label: "Percentage Calculator" },
      { label: `${percent}% of ${base}` },
    ],
    canonicalPath,
    description,
    expression: parsed.expression,
    featureList: [
      "Browser-only percentage calculation",
      "Canonical URL for each expression",
      "Internal links to nearby percentage questions and PDF utilities",
    ],
    heroBadges: ["calculator", "local browser", "no upload", "privacy-first"],
    h1: `What is ${percent}% of ${base}?`,
    liveToolDescription:
      "Adjust the percentage or base number below and open the matching canonical calculator page instantly.",
    page: {
      canonicalPath,
      description,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      paramLabel: `${percent}% of ${base}`,
      paramSlug: parsed.expression,
      privacyNote,
      relatedTools: relatedTools(percent, base),
      title,
      tool: percentageTool,
      whyUsersNeedThis,
      wordCount,
    },
    siloLinks: [
      { href: "/calculators/percentage/what-is-10-percent-of-100", label: "Common percentage example" },
      { href: "/compare/plain-tools-vs-smallpdf", label: "Privacy-first PDF comparison" },
      { href: "/tools", label: "PDF tools hub" },
      { href: "/convert/pdf-to-word/offline", label: "Offline converter example" },
    ],
    title,
  }
}

export const CALCULATOR_METADATA_EXAMPLES = [
  getPercentageCalculatorPage("what-is-15-percent-of-200"),
  getPercentageCalculatorPage("what-is-25-percent-of-400"),
  getPercentageCalculatorPage("what-is-75-percent-of-120"),
]
  .filter((entry): entry is PercentageCalculatorPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

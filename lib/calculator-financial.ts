import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import type { ToolDefinition } from "@/lib/tools-catalogue"

export type PublicCalculatorCategory =
  | "percentage"
  | "tip"
  | "salary-to-hourly"
  | "basic-loan"
  | "simple-interest"
  | "retirement-basic"

export type LegacyCalculatorCategory =
  | "compound-interest-intro"
  | "retirement-savings-basic"

export type CalculatorCategory =
  | PublicCalculatorCategory
  | LegacyCalculatorCategory

export type CalculatorRouteParams = {
  category: CalculatorCategory
  expression: string
}

type CalculatorEntry = {
  category: CalculatorCategory
  description: string
  expression: string
  keywords: string[]
  title: string
}

export type CalculatorPage = {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  category: CalculatorCategory
  description: string
  expression: string
  featureList: string[]
  heroBadges: string[]
  h1: string
  initialValues: Record<string, number | string>
  keywords: string[]
  liveToolDescription: string
  page: ProgrammaticPageData
  relatedLinks: Array<{ href: string; title: string }>
  siloLinks: Array<{ href: string; label: string }>
  summaryRows: Array<{ label: string; value: string }>
  title: string
}

type ParsedPercentage = {
  base: number
  category: "percentage"
  expression: string
  percent: number
  result: number
}

type ParsedTip = {
  bill: number
  category: "tip"
  expression: string
  split: number
  tipAmount: number
  tipPercent: number
  totalBill: number
  totalPerPerson: number
}

type ParsedSalary = {
  annualSalary: number
  category: "salary-to-hourly"
  expression: string
  hourlyRate: number
  hoursPerWeek: number
  monthlySalary: number
  weeksPerYear: number
}

type ParsedBasicLoan = {
  annualRate: number
  category: "basic-loan"
  expression: string
  monthlyPayment: number
  principal: number
  termYears: number
  totalInterest: number
  totalPaid: number
}

type ParsedSimpleInterest = {
  annualRate: number
  category: "simple-interest"
  expression: string
  interest: number
  principal: number
  totalAmount: number
  years: number
}

type ParsedCompoundInterestIntro = {
  annualRate: number
  category: "compound-interest-intro"
  expression: string
  futureValue: number
  principal: number
  totalGrowth: number
  years: number
}

type ParsedRetirementBasic = {
  annualRate: number
  category: "retirement-basic"
  expression: string
  futureValue: number
  monthlyContribution: number
  totalContributions: number
  years: number
}

type ParsedCalculator =
  | ParsedBasicLoan
  | ParsedCompoundInterestIntro
  | ParsedPercentage
  | ParsedRetirementBasic
  | ParsedSalary
  | ParsedSimpleInterest
  | ParsedTip

const calculatorTool: ToolDefinition = {
  available: true,
  category: "Utility",
  description:
    "Browser-first financial calculators with local computation, privacy-first routes, and exact-match long-tail pages.",
  id: "financial-calculators",
  name: "Financial Calculators",
  slug: "financial-calculator",
}

const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  "basic-loan": "Basic Loan Calculator",
  "compound-interest-intro": "Compound Interest Calculator",
  percentage: "Percentage Calculator",
  "retirement-basic": "Basic Retirement Savings Calculator",
  "retirement-savings-basic": "Retirement Savings Calculator",
  "salary-to-hourly": "Salary to Hourly Calculator",
  "simple-interest": "Simple Interest Calculator",
  tip: "Tip Calculator",
}

const PUBLIC_CATEGORY_ORDER: PublicCalculatorCategory[] = [
  "percentage",
  "tip",
  "salary-to-hourly",
  "basic-loan",
  "simple-interest",
  "retirement-basic",
]

const CATEGORY_ORDER: CalculatorCategory[] = [
  ...PUBLIC_CATEGORY_ORDER,
  "compound-interest-intro",
  "retirement-savings-basic",
]

const PUBLIC_CATEGORY_SET = new Set<PublicCalculatorCategory>(PUBLIC_CATEGORY_ORDER)

const PERCENT_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 22, 25, 27, 30, 33, 35, 40,
  45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 110, 125, 150, 175, 200,
] as const
const PERCENT_BASE_VALUES = [
  10, 12, 15, 18, 20, 24, 25, 30, 35, 40, 45, 50, 60, 72, 75, 80, 90, 100, 120,
  125, 150, 175, 180, 200, 225, 240, 250, 275, 300, 350, 400, 450, 500, 600,
] as const
const TIP_BILLS = [20, 25, 35, 50, 60, 75, 90, 100, 120, 135, 150, 180, 200, 225, 250, 300, 400, 500] as const
const TIP_PERCENTS = [10, 12, 15, 18, 20, 22, 25, 30, 35] as const
const SALARY_VALUES = [30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 80000, 90000, 100000, 110000, 120000, 140000, 150000, 175000, 200000] as const
const SALARY_HOURS = [30, 32, 35, 37.5, 40, 45] as const
const LOAN_PRINCIPALS = [1000, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 35000, 40000, 50000] as const
const LOAN_RATES = [3, 4, 5, 6, 7, 8, 9] as const
const LOAN_TERMS = [1, 2, 3, 5] as const
const INTEREST_PRINCIPALS = [1000, 2500, 5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000] as const
const INTEREST_RATES = [2, 3, 4, 5, 6, 7, 8] as const
const INTEREST_YEARS = [1, 2, 3, 4, 5] as const
const COMPOUND_PRINCIPALS = [1000, 2500, 5000, 10000, 15000, 25000, 50000, 75000] as const
const COMPOUND_RATES = [3, 4, 5, 6] as const
const COMPOUND_YEARS = [3, 5, 10] as const
const RETIREMENT_MONTHLY = [100, 150, 200, 300, 400, 500, 750, 1000, 1250, 1500, 2000, 2500] as const
const RETIREMENT_RATES = [4, 5, 6, 7, 8, 9] as const
const RETIREMENT_YEARS = [10, 15, 20, 30] as const

const EXTERNAL_OVERLAP_NOTE =
  "Plain Tools keeps these pages focused on quick first-pass calculations and browser-local convenience, while deeper planning models remain outside this cluster."

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)
}

function formatPercent(value: number) {
  return `${formatNumber(value)}%`
}

function monthlyPayment(principal: number, annualRate: number, termYears: number) {
  const monthlyRate = annualRate / 100 / 12
  const months = termYears * 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

function futureValueCompound(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12
  return principal * (1 + monthlyRate) ** (years * 12)
}

function futureValueRetirement(monthlyContribution: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  if (monthlyRate === 0) return monthlyContribution * months
  return monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate)
}

function parseNumberToken(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function percentageExpressionFor(percent: number, base: number) {
  return `what-is-${percent}-percent-of-${base}`
}

function tipExpressionFor(bill: number, tipPercent: number) {
  return `tip-calculator-${bill}-${tipPercent}`
}

function salaryExpressionFor(annualSalary: number, hoursPerWeek: number) {
  return `salary-to-hourly-${annualSalary}-${hoursPerWeek}`
}

function basicLoanExpressionFor(principal: number, annualRate: number, termYears: number) {
  return `loan-payment-${principal}-${annualRate}-${termYears}-years`
}

function simpleInterestExpressionFor(principal: number, annualRate: number, years: number) {
  return `simple-interest-${principal}-${annualRate}-${years}`
}

function compoundExpressionFor(principal: number, annualRate: number, years: number) {
  return `compound-interest-${principal}-${annualRate}-${years}`
}

function retirementExpressionFor(
  monthlyContribution: number,
  annualRate: number,
  years: number
) {
  return `retirement-savings-${monthlyContribution}-monthly-${annualRate}-${years}-years`
}

export function isCalculatorCategory(value: string): value is CalculatorCategory {
  return CATEGORY_ORDER.includes(value as CalculatorCategory)
}

export function buildCalculatorPath(category: CalculatorCategory, expression: string) {
  const canonicalCategory =
    category === "retirement-savings-basic" ? "retirement-basic" : category
  return `/calculators/${canonicalCategory}/${expression}`
}

export function buildCalculatorExpression(
  category: CalculatorCategory,
  rawValues: Record<string, number | string>
) {
  const readNumber = (key: string) => {
    const value = rawValues[key]
    const parsed =
      typeof value === "number" ? value : Number.parseFloat(String(value ?? ""))
    return Number.isFinite(parsed) ? parsed : null
  }

  switch (category) {
    case "percentage": {
      const percent = readNumber("percent")
      const base = readNumber("base")
      if (percent === null || base === null || percent < 0 || base < 0) return null
      return percentageExpressionFor(percent, base)
    }
    case "tip": {
      const bill = readNumber("bill")
      const tipPercent = readNumber("tipPercent")
      if (bill === null || tipPercent === null || bill < 0 || tipPercent < 0) return null
      return tipExpressionFor(bill, tipPercent)
    }
    case "salary-to-hourly": {
      const annualSalary = readNumber("annualSalary")
      const hoursPerWeek = readNumber("hoursPerWeek")
      if (
        annualSalary === null ||
        hoursPerWeek === null ||
        annualSalary < 0 ||
        hoursPerWeek <= 0
      ) {
        return null
      }
      return salaryExpressionFor(annualSalary, hoursPerWeek)
    }
    case "basic-loan": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const termYears = readNumber("termYears")
      if (
        principal === null ||
        annualRate === null ||
        termYears === null ||
        principal <= 0 ||
        annualRate < 0 ||
        termYears <= 0
      ) {
        return null
      }
      return basicLoanExpressionFor(principal, annualRate, termYears)
    }
    case "simple-interest": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (
        principal === null ||
        annualRate === null ||
        years === null ||
        principal <= 0 ||
        annualRate < 0 ||
        years <= 0
      ) {
        return null
      }
      return simpleInterestExpressionFor(principal, annualRate, years)
    }
    case "compound-interest-intro": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (
        principal === null ||
        annualRate === null ||
        years === null ||
        principal <= 0 ||
        annualRate < 0 ||
        years <= 0
      ) {
        return null
      }
      return compoundExpressionFor(principal, annualRate, years)
    }
    case "retirement-basic":
    case "retirement-savings-basic": {
      const monthlyContribution = readNumber("monthlyContribution")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (
        monthlyContribution === null ||
        annualRate === null ||
        years === null ||
        monthlyContribution < 0 ||
        annualRate < 0 ||
        years <= 0
      ) {
        return null
      }
      return retirementExpressionFor(monthlyContribution, annualRate, years)
    }
  }
}

function parseCalculatorExpression(
  category: CalculatorCategory,
  expression: string
): ParsedCalculator | null {
  const decoded = decodeURIComponent(expression).trim().toLowerCase()

  if (category === "percentage") {
    const match = /^what-is-([0-9]+(?:\.[0-9]+)*)-percent-of-([0-9]+(?:\.[0-9]+)*)$/.exec(
      decoded
    )
    if (!match) return null
    const percent = parseNumberToken(match[1] ?? "")
    const base = parseNumberToken(match[2] ?? "")
    if (percent === null || base === null || percent < 0 || base < 0) return null
    return {
      base,
      category,
      expression: percentageExpressionFor(percent, base),
      percent,
      result: (percent / 100) * base,
    }
  }

  if (category === "tip") {
    const match = /^tip-calculator-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)$/.exec(
      decoded
    )
    if (!match) return null
    const bill = parseNumberToken(match[1] ?? "")
    const tipPercent = parseNumberToken(match[2] ?? "")
    if (bill === null || tipPercent === null || bill < 0 || tipPercent < 0) return null
    const split = 2
    const tipAmount = (bill * tipPercent) / 100
    const totalBill = bill + tipAmount
    return {
      bill,
      category,
      expression: tipExpressionFor(bill, tipPercent),
      split,
      tipAmount,
      tipPercent,
      totalBill,
      totalPerPerson: totalBill / split,
    }
  }

  if (category === "salary-to-hourly") {
    const match = /^salary-to-hourly-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)$/.exec(
      decoded
    )
    if (!match) return null
    const annualSalary = parseNumberToken(match[1] ?? "")
    const hoursPerWeek = parseNumberToken(match[2] ?? "")
    if (
      annualSalary === null ||
      hoursPerWeek === null ||
      annualSalary < 0 ||
      hoursPerWeek <= 0
    ) {
      return null
    }
    const weeksPerYear = 52
    return {
      annualSalary,
      category,
      expression: salaryExpressionFor(annualSalary, hoursPerWeek),
      hourlyRate: annualSalary / (hoursPerWeek * weeksPerYear),
      hoursPerWeek,
      monthlySalary: annualSalary / 12,
      weeksPerYear,
    }
  }

  if (category === "basic-loan") {
    const match = /^loan-payment-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years$/.exec(
      decoded
    )
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termYears = parseNumberToken(match[3] ?? "")
    if (
      principal === null ||
      annualRate === null ||
      termYears === null ||
      principal <= 0 ||
      annualRate < 0 ||
      termYears <= 0
    ) {
      return null
    }
    const payment = monthlyPayment(principal, annualRate, termYears)
    const totalPaid = payment * termYears * 12
    return {
      annualRate,
      category,
      expression: basicLoanExpressionFor(principal, annualRate, termYears),
      monthlyPayment: payment,
      principal,
      termYears,
      totalInterest: totalPaid - principal,
      totalPaid,
    }
  }

  if (category === "simple-interest") {
    const match = /^simple-interest-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)$/.exec(decoded)
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    if (
      principal === null ||
      annualRate === null ||
      years === null ||
      principal <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null
    }
    const interest = principal * (annualRate / 100) * years
    return {
      annualRate,
      category,
      expression: simpleInterestExpressionFor(principal, annualRate, years),
      interest,
      principal,
      totalAmount: principal + interest,
      years,
    }
  }

  if (category === "compound-interest-intro") {
    const match = /^compound-interest-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)$/.exec(decoded)
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    if (
      principal === null ||
      annualRate === null ||
      years === null ||
      principal <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null
    }
    const futureValue = futureValueCompound(principal, annualRate, years)
    return {
      annualRate,
      category,
      expression: compoundExpressionFor(principal, annualRate, years),
      futureValue,
      principal,
      totalGrowth: futureValue - principal,
      years,
    }
  }

  const match =
    /^retirement-savings-([0-9]+)-monthly-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years$/.exec(
      decoded
    )
  if (!match) return null
  const monthlyContribution = parseNumberToken(match[1] ?? "")
  const annualRate = parseNumberToken(match[2] ?? "")
  const years = parseNumberToken(match[3] ?? "")
  if (
    monthlyContribution === null ||
    annualRate === null ||
    years === null ||
    monthlyContribution < 0 ||
    annualRate < 0 ||
    years <= 0
  ) {
    return null
  }
  const futureValue = futureValueRetirement(monthlyContribution, annualRate, years)
  return {
    annualRate,
    category: "retirement-basic",
    expression: retirementExpressionFor(monthlyContribution, annualRate, years),
    futureValue,
    monthlyContribution,
    totalContributions: monthlyContribution * years * 12,
    years,
  }
}

function percentageEntries(): CalculatorEntry[] {
  return PERCENT_VALUES.flatMap((percent) =>
    PERCENT_BASE_VALUES.map((base) => ({
      category: "percentage" as const,
      description: buildMetaDescription(
        `Calculate what ${percent}% of ${base} is instantly with a local browser calculator on Plain Tools.`
      ),
      expression: percentageExpressionFor(percent, base),
      keywords: [
        `what is ${percent}% of ${base}`,
        `${percent} percent of ${base}`,
        "percentage calculator",
        "instant percentage calculator",
        "local browser calculator",
      ],
      title: `What Is ${percent}% of ${base}? – Free Instant Percentage Calculator | Plain Tools`,
    }))
  )
}

function tipEntries(): CalculatorEntry[] {
  return TIP_BILLS.flatMap((bill) =>
    TIP_PERCENTS.map((tipPercent) => ({
      category: "tip" as const,
      description: buildMetaDescription(
        `Calculate a ${tipPercent}% tip on ${formatCurrency(bill)} instantly with a private browser-based tip calculator on Plain Tools.`
      ),
      expression: tipExpressionFor(bill, tipPercent),
      keywords: [
        `tip calculator ${bill} ${tipPercent}`,
        `${tipPercent} percent tip on ${bill}`,
        "tip calculator",
        "restaurant tip calculator",
      ],
      title: `Tip on ${formatCurrency(bill)} at ${tipPercent}% – Free Tip Calculator | Plain Tools`,
    }))
  )
}

function salaryEntries(): CalculatorEntry[] {
  return SALARY_VALUES.flatMap((annualSalary) =>
    SALARY_HOURS.map((hoursPerWeek) => ({
      category: "salary-to-hourly" as const,
      description: buildMetaDescription(
        `Convert ${formatCurrency(annualSalary)} salary to an hourly rate using ${hoursPerWeek} hours per week with local browser calculation on Plain Tools.`
      ),
      expression: salaryExpressionFor(annualSalary, hoursPerWeek),
      keywords: [
        `salary to hourly ${annualSalary} ${hoursPerWeek}`,
        `${annualSalary} salary hourly`,
        "salary to hourly calculator",
        "annual salary to hourly rate",
      ],
      title: `${formatCurrency(annualSalary)} Salary to Hourly at ${hoursPerWeek} Hours – Free Calculator | Plain Tools`,
    }))
  )
}

function basicLoanEntries(): CalculatorEntry[] {
  return LOAN_PRINCIPALS.flatMap((principal) =>
    LOAN_RATES.flatMap((annualRate) =>
      LOAN_TERMS.map((termYears) => ({
        category: "basic-loan" as const,
        description: buildMetaDescription(
          `Estimate the payment on a ${formatCurrency(principal)} basic loan at ${annualRate}% over ${termYears} years with a local browser calculator on Plain Tools.`
        ),
        expression: basicLoanExpressionFor(principal, annualRate, termYears),
        keywords: [
          `loan payment ${principal} ${annualRate} ${termYears} years`,
          "basic loan calculator",
          "loan payment calculator",
          "monthly loan payment estimate",
        ],
        title: `Loan Payment for ${formatCurrency(principal)} at ${annualRate}% for ${termYears} Years | Plain Tools`,
      }))
    )
  )
}

function simpleInterestEntries(): CalculatorEntry[] {
  return INTEREST_PRINCIPALS.flatMap((principal) =>
    INTEREST_RATES.flatMap((annualRate) =>
      INTEREST_YEARS.map((years) => ({
        category: "simple-interest" as const,
        description: buildMetaDescription(
          `Estimate simple interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} years with a browser-first calculator on Plain Tools.`
        ),
        expression: simpleInterestExpressionFor(principal, annualRate, years),
        keywords: [
          `simple interest ${principal} ${annualRate} ${years}`,
          "simple interest calculator",
          "interest amount calculator",
          "basic interest estimate",
        ],
        title: `Simple Interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} Years | Plain Tools`,
      }))
    )
  )
}

function compoundEntries(): CalculatorEntry[] {
  return COMPOUND_PRINCIPALS.flatMap((principal) =>
    COMPOUND_RATES.flatMap((annualRate) =>
      COMPOUND_YEARS.map((years) => ({
        category: "compound-interest-intro" as const,
        description: buildMetaDescription(
          `Project compound interest on ${formatCurrency(principal)} at ${annualRate}% over ${years} years with a local browser calculator on Plain Tools.`
        ),
        expression: compoundExpressionFor(principal, annualRate, years),
        keywords: [
          `compound interest ${principal} ${annualRate} ${years}`,
          "compound interest calculator",
          "compound growth calculator",
          "intro compound interest calculator",
        ],
        title: `Compound Interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} Years | Plain Tools`,
      }))
    )
  )
}

function retirementEntries(): CalculatorEntry[] {
  return RETIREMENT_MONTHLY.flatMap((monthlyContribution) =>
    RETIREMENT_RATES.flatMap((annualRate) =>
      RETIREMENT_YEARS.map((years) => ({
        category: "retirement-basic" as const,
        description: buildMetaDescription(
          `Estimate retirement savings from ${formatCurrency(monthlyContribution)} per month at ${annualRate}% over ${years} years with a local browser calculator on Plain Tools.`
        ),
        expression: retirementExpressionFor(monthlyContribution, annualRate, years),
        keywords: [
          `retirement savings ${monthlyContribution} monthly ${annualRate} ${years}`,
          "retirement savings calculator",
          "basic retirement calculator",
          "monthly savings growth",
        ],
        title: `Retirement Savings for ${formatCurrency(monthlyContribution)}/Month at ${annualRate}% for ${years} Years | Plain Tools`,
      }))
    )
  )
}

const CALCULATOR_TEMPLATES: CalculatorEntry[] = [
  ...percentageEntries(),
  ...tipEntries(),
  ...salaryEntries(),
  ...basicLoanEntries(),
  ...simpleInterestEntries(),
  ...compoundEntries(),
  ...retirementEntries(),
]

const PUBLIC_CALCULATOR_TEMPLATES = CALCULATOR_TEMPLATES.filter((entry) =>
  PUBLIC_CATEGORY_SET.has(entry.category as PublicCalculatorCategory)
)

const CALCULATOR_ENTRY_MAP = new Map(
  CALCULATOR_TEMPLATES.map((entry) => [`${entry.category}/${entry.expression}`, entry])
)

function getCalculatedRelatedLinks(parsed: ParsedCalculator) {
  switch (parsed.category) {
    case "percentage":
      return [
        { href: buildCalculatorPath("percentage", percentageExpressionFor(15, parsed.base)), title: `What is 15% of ${formatNumber(parsed.base)}?` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(20, parsed.base)), title: `What is 20% of ${formatNumber(parsed.base)}?` },
        { href: buildCalculatorPath("tip", tipExpressionFor(Math.max(20, parsed.base), 18)), title: "Tip calculator example" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(60000, 40)), title: "Salary to hourly example" },
      ]
    case "tip":
      return [
        { href: buildCalculatorPath("tip", tipExpressionFor(parsed.bill, 15)), title: `${formatCurrency(parsed.bill)} at 15% tip` },
        { href: buildCalculatorPath("tip", tipExpressionFor(parsed.bill, 20)), title: `${formatCurrency(parsed.bill)} at 20% tip` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(parsed.tipPercent, parsed.bill)), title: "Percentage breakdown of the bill" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(50000, 40)), title: "Salary to hourly example" },
      ]
    case "salary-to-hourly":
      return [
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 35)), title: `${formatCurrency(parsed.annualSalary)} at 35 hours/week` },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 40)), title: `${formatCurrency(parsed.annualSalary)} at 40 hours/week` },
        { href: buildCalculatorPath("basic-loan", basicLoanExpressionFor(10000, 5, 3)), title: "Basic loan payment example" },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(10000, 4, 3)), title: "Simple interest example" },
      ]
    case "basic-loan":
      return [
        { href: buildCalculatorPath("basic-loan", basicLoanExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.termYears)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("basic-loan", basicLoanExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.termYears)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate, parsed.termYears)), title: "Compare with simple interest" },
        { href: buildCalculatorPath("retirement-basic", retirementExpressionFor(300, Math.max(1, parsed.annualRate), Math.max(10, parsed.termYears * 2))), title: "Basic retirement savings example" },
      ]
    case "simple-interest":
      return [
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("basic-loan", basicLoanExpressionFor(parsed.principal, parsed.annualRate, Math.max(1, parsed.years))), title: "Basic loan payment example" },
        { href: buildCalculatorPath("retirement-basic", retirementExpressionFor(250, Math.max(2, parsed.annualRate), Math.max(10, parsed.years * 4))), title: "Basic retirement savings example" },
      ]
    case "compound-interest-intro":
      return [
        { href: buildCalculatorPath("compound-interest-intro", compoundExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("compound-interest-intro", compoundExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate, parsed.years)), title: "Simple interest comparison" },
        { href: buildCalculatorPath("retirement-basic", retirementExpressionFor(500, parsed.annualRate, Math.max(10, parsed.years))), title: "Retirement savings example" },
      ]
    case "retirement-basic":
      return [
        { href: buildCalculatorPath("retirement-basic", retirementExpressionFor(parsed.monthlyContribution, Math.max(1, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("retirement-basic", retirementExpressionFor(parsed.monthlyContribution, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(10000, Math.max(1, parsed.annualRate - 1), Math.max(1, Math.round(parsed.years / 5)))), title: "Simple interest example" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(90000, 40)), title: "Salary to hourly example" },
      ]
  }
}

function buildCommonBlocks(
  categoryLabel: string,
  scenarioText: string,
  categorySpecificTitle: string,
  categorySpecificParagraphs: string[]
) {
  return [
    {
      title: categorySpecificTitle,
      paragraphs: categorySpecificParagraphs,
    },
    {
      title: "Why the page is more useful than a one-line answer",
      paragraphs: [
        `A strong ${categoryLabel.toLowerCase()} page should do more than show one number. It should explain the assumptions behind the answer, show how to rerun the scenario, and link to the most likely follow-up calculations.`,
        `That is what this route does around ${scenarioText}. It gives the answer, keeps the tool embedded, and makes the next step easy without pushing the user into a generic finance article.`,
      ],
    },
    {
      title: "Why Plain Tools keeps it browser-first",
      paragraphs: [
        "Every calculation on this page runs locally in the browser. No spreadsheet upload, account connection, or server-side processing is required to get the answer.",
        "That local workflow matters even on simple calculators because it keeps the route fast, privacy-first, and usable on a shared or locked-down work device.",
      ],
    },
    {
      title: "How this fits a larger decision",
      paragraphs: [
        "Users usually do not stop at one number. They test a nearby rate, amount, contribution, or workload assumption and compare the difference immediately.",
        "That is why the page includes related calculator links, nearby examples, and adjacent Plain Tools utility routes instead of acting like a dead-end result page.",
      ],
    },
  ] satisfies ProgrammaticExplanationBlock[]
}

function relatedToolsForCalculator(parsed: ParsedCalculator): ProgrammaticRelatedTool[] {
  return [
    { description: "Run another local calculator scenario.", href: buildCalculatorPath(parsed.category, parsed.expression), name: CATEGORY_LABELS[parsed.category] },
    { description: "Open privacy-first PDF tools.", href: "/pdf-tools", name: "PDF tools" },
    { description: "Browse file converters.", href: "/file-converters", name: "File converters" },
    { description: "Compare privacy-first alternatives.", href: "/compare/plain-tools-vs-smallpdf", name: "Privacy-first comparisons" },
    { description: "Use a PDF workflow guide.", href: "/guides/legal/compress-shared-pdfs", name: "Professional guides" },
    { description: "Check another browser-first utility tool.", href: "/tools", name: "Tool directory" },
  ]
}

function buildCalculatorPageData(entry: CalculatorEntry, parsed: ParsedCalculator): CalculatorPage {
  const canonicalPath = buildCalculatorPath(entry.category, parsed.expression)
  const pageRelatedLinks = [
    ...getCalculatedRelatedLinks(parsed),
    { href: "/pdf-tools", title: "Browse PDF tools" },
    { href: "/file-converters", title: "Browse file converters" },
    { href: "/compare/plain-tools-vs-smallpdf", title: "Privacy-first comparisons" },
    { href: "/guides/legal/compress-shared-pdfs", title: "Professional workflow guides" },
  ].slice(0, 8)

  let intro: string[] = []
  let whyUsersNeedThis: string[] = []
  let howItWorks: string[] = []
  let howToSteps: ProgrammaticHowToStep[] = []
  let explanationBlocks: ProgrammaticExplanationBlock[] = []
  let privacyNote: string[] = []
  let faq: ProgrammaticFaq[] = []
  let summaryRows: Array<{ label: string; value: string }> = []
  let initialValues: Record<string, number | string> = {}
  let h1 = entry.title.replace(" | Plain Tools", "")

  switch (parsed.category) {
    case "percentage": {
      const scenarioText = `${formatPercent(parsed.percent)} of ${formatNumber(parsed.base)}`
      intro = [
        `People search exact percentage expressions because they want a direct answer, not a broad math lesson. This route answers ${scenarioText} immediately and keeps the calculation local in the browser.`,
        `${formatPercent(parsed.percent)} of ${formatNumber(parsed.base)} is ${formatNumber(parsed.result)}. That solves the headline query, but a useful page also shows how to test nearby percentages, compare common rates, and move into related calculator scenarios without losing context.`,
        EXTERNAL_OVERLAP_NOTE,
      ]
      whyUsersNeedThis = [
        "Percentage pages capture very broad utility demand because the same math shows up in discounts, tips, grades, commissions, budgets, and quick business calculations.",
        "A good percentage route should also explain why the exact-match slug is useful. The user can bookmark the page, share the scenario, and quickly open the next variant without typing the whole expression again.",
      ]
      howItWorks = [
        "The embedded tool multiplies the base number by the percentage and divides by 100. Adjust either field and the page can open the canonical route for the next exact expression.",
        "All computation stays inside the browser, which keeps the page lightweight and aligned with the local, no-upload positioning across plain.tools.",
      ]
      howToSteps = [
        { name: "Confirm the percentage", text: `This route uses ${formatPercent(parsed.percent)}.` },
        { name: "Confirm the base number", text: `This route uses ${formatNumber(parsed.base)} as the base.` },
        { name: "Read the result", text: `${formatPercent(parsed.percent)} of ${formatNumber(parsed.base)} equals ${formatNumber(parsed.result)}.` },
        { name: "Open a nearby scenario", text: "Use the embedded calculator or related links to compare another rate or base amount." },
      ]
      explanationBlocks = buildCommonBlocks(
        CATEGORY_LABELS[parsed.category],
        scenarioText,
        "Where this exact percentage shows up in real work",
        [
          "Exact percentage expressions are common in discounts, sales commissions, invoice markups, test scores, and budget checks. That is why these pages attract broad search demand despite using a very simple formula.",
          "The page becomes more useful when it connects the exact answer to nearby scenarios rather than pretending the user will never change the inputs.",
        ]
      )
      privacyNote = [
        "All calculations happen locally in the browser. No data is sent, stored, or synced while you use this percentage calculator.",
        "That makes the route fast for quick math and keeps the workflow aligned with Plain Tools' privacy-first positioning.",
      ]
      faq = [
        { question: `What is ${parsed.percent}% of ${parsed.base}?`, answer: `${parsed.percent}% of ${parsed.base} is ${formatNumber(parsed.result)}.` },
        { question: "How do you calculate a percentage of a number?", answer: "Multiply the base number by the percentage and divide by 100." },
        { question: "Can I test another percentage quickly?", answer: "Yes. Use the local calculator form on the page to open the exact canonical route for the next scenario." },
        { question: "Does this page send my numbers to a server?", answer: "No. The calculation runs locally in the browser with no data sent anywhere." },
        { question: "Why use a dedicated route for one percentage expression?", answer: "Because exact-match routes are easier to bookmark, share, and compare than a generic calculator with no scenario context." },
        { question: "What should I check next?", answer: "Tip, salary, loan, and simple-interest pages are common next steps when the percentage is part of a broader decision." },
      ]
      summaryRows = [
        { label: "Percentage", value: formatPercent(parsed.percent) },
        { label: "Base number", value: formatNumber(parsed.base) },
        { label: "Result", value: formatNumber(parsed.result) },
      ]
      initialValues = { percent: parsed.percent, base: parsed.base }
      h1 = `What Is ${parsed.percent}% of ${parsed.base}?`
      break
    }
    case "tip": {
      const scenarioText = `${formatPercent(parsed.tipPercent)} on ${formatCurrency(parsed.bill)}`
      intro = [
        `Tip calculator pages work because the user usually wants an immediate answer at the table or while checking a receipt. This route calculates ${scenarioText} instantly and keeps the math local in the browser.`,
        `On a ${formatCurrency(parsed.bill)} bill, a ${formatPercent(parsed.tipPercent)} tip is ${formatCurrency(parsed.tipAmount)}. That brings the total to ${formatCurrency(parsed.totalBill)}, or ${formatCurrency(parsed.totalPerPerson)} each if split two ways.`,
        EXTERNAL_OVERLAP_NOTE,
      ]
      whyUsersNeedThis = [
        "This search intent is simple but high frequency. Users want the tip amount, the new total, and often a rough per-person figure without opening a bulky finance app.",
        "A useful route also explains the difference between the tip amount and the total bill, because many users are really checking the final cost, not just the percentage itself.",
      ]
      howItWorks = [
        "The embedded calculator multiplies the bill by the chosen tip rate and then adds that amount back to the original total. The page also shows a simple split example so the result is easier to act on immediately.",
        "Nothing is uploaded or stored. The browser performs the calculation on-device and the page stays useful even for quick mobile checks.",
      ]
      howToSteps = [
        { name: "Enter the bill amount", text: `This example starts with ${formatCurrency(parsed.bill)}.` },
        { name: "Choose the tip rate", text: `This route uses a ${formatPercent(parsed.tipPercent)} tip.` },
        { name: "Read the tip amount", text: `The tip amount is ${formatCurrency(parsed.tipAmount)}.` },
        { name: "Check the total bill", text: `After tip, the total is ${formatCurrency(parsed.totalBill)}.` },
      ]
      explanationBlocks = buildCommonBlocks(
        CATEGORY_LABELS[parsed.category],
        scenarioText,
        "Why tip pages can still be useful long-tail utilities",
        [
          "Tip pages work when they solve the actual user problem: not just a percentage figure, but the final bill impact. That makes them practical in the moment and safer to scale than thin one-line stubs.",
          "They also create natural follow-up links into percentage and salary pages without straying into advanced finance territory.",
        ]
      )
      privacyNote = [
        "All calculations stay local in the browser. No bill amount, tip selection, or restaurant data is sent anywhere.",
        "That keeps the calculator fast, private, and convenient for quick real-world use.",
      ]
      faq = [
        { question: `What is a ${parsed.tipPercent}% tip on ${formatCurrency(parsed.bill)}?`, answer: `It is ${formatCurrency(parsed.tipAmount)}.` },
        { question: "How do you calculate the total after tip?", answer: "Add the tip amount to the original bill total." },
        { question: "Can I test 15%, 18%, and 20% quickly?", answer: "Yes. Use the local calculator or the related links to jump to nearby tip rates." },
        { question: "Does the page store my bill amount?", answer: "No. All calculations happen locally in the browser." },
        { question: "Why is there a split example?", answer: "Because many users need the final per-person figure, not just the tip amount by itself." },
        { question: "What should I check next?", answer: "Percentage and salary pages are common follow-up routes after a quick tip calculation." },
      ]
      summaryRows = [
        { label: "Bill amount", value: formatCurrency(parsed.bill) },
        { label: "Tip percentage", value: formatPercent(parsed.tipPercent) },
        { label: "Tip amount", value: formatCurrency(parsed.tipAmount) },
        { label: "Total bill", value: formatCurrency(parsed.totalBill) },
        { label: "Two-way split", value: formatCurrency(parsed.totalPerPerson) },
      ]
      initialValues = { bill: parsed.bill, split: parsed.split, tipPercent: parsed.tipPercent }
      break
    }
    case "salary-to-hourly": {
      const scenarioText = `${formatCurrency(parsed.annualSalary)} salary at ${parsed.hoursPerWeek} hours per week`
      intro = [
        `Salary-to-hourly routes capture strong practical intent because people use them to compare offers, sanity-check part-time arrangements, or translate annual compensation into an hourly number they can actually compare.`,
        `For ${scenarioText}, the hourly equivalent is about ${formatCurrency(parsed.hourlyRate)}, with a monthly salary equivalent of ${formatCurrency(parsed.monthlySalary)} based on a ${parsed.weeksPerYear}-week year.`,
        EXTERNAL_OVERLAP_NOTE,
      ]
      whyUsersNeedThis = [
        "The key benefit is speed. Users want a quick gross-pay comparison without building a spreadsheet or opening a larger finance tool.",
        "These pages also monetize well because the intent overlaps with job offers, payroll, budgeting, and compensation research, which tend to attract stronger advertiser demand than generic hobby traffic.",
      ]
      howItWorks = [
        "The calculator divides annual salary by total annual working hours. This version uses hours per week as the variable input and keeps weeks per year at a standard 52 for a simple first-pass comparison.",
        "The calculation remains local in the browser, so the user can compare scenarios without uploading pay documents or sharing compensation details.",
      ]
      howToSteps = [
        { name: "Enter annual salary", text: `This route starts from ${formatCurrency(parsed.annualSalary)} per year.` },
        { name: "Set weekly hours", text: `The current assumption is ${parsed.hoursPerWeek} hours each week.` },
        { name: "Read the hourly equivalent", text: `That produces roughly ${formatCurrency(parsed.hourlyRate)} per hour.` },
        { name: "Compare another workload", text: "Open a nearby 35-hour or 40-hour scenario to see how the hourly figure changes." },
      ]
      explanationBlocks = buildCommonBlocks(
        CATEGORY_LABELS[parsed.category],
        scenarioText,
        "Why weekly hours matter more than people expect",
        [
          "The same annual salary can look materially different when weekly hours change. That is why salary-to-hourly pages are useful: they expose the work schedule assumption instead of hiding it.",
          "A narrow, exact-match route is especially helpful for compensation comparisons because users usually arrive with one specific salary figure in mind.",
        ]
      )
      privacyNote = [
        "All calculations happen locally in the browser. No pay information is uploaded, synced, or shared while you use this page.",
        "That makes the route practical for quick private offer checks on work devices or shared machines.",
      ]
      faq = [
        { question: `What is ${formatCurrency(parsed.annualSalary)} per year at ${parsed.hoursPerWeek} hours per week?`, answer: `It is about ${formatCurrency(parsed.hourlyRate)} per hour before tax.` },
        { question: "How is salary converted to hourly?", answer: "The page divides annual salary by hours per week times weeks per year." },
        { question: "Why does the page assume 52 weeks?", answer: "This cluster is intentionally simple and first-pass. More advanced schedule modeling is outside this capped calculator set." },
        { question: "Can I compare 35 and 40 hours quickly?", answer: "Yes. The related links are built around nearby hour assumptions." },
        { question: "Does this include tax deductions?", answer: "No. This page is a gross-pay conversion, not a take-home pay calculator." },
        { question: "Does the calculator send salary data anywhere?", answer: "No. It runs locally in the browser." },
      ]
      summaryRows = [
        { label: "Annual salary", value: formatCurrency(parsed.annualSalary) },
        { label: "Hours per week", value: `${parsed.hoursPerWeek}` },
        { label: "Weeks per year", value: `${parsed.weeksPerYear}` },
        { label: "Hourly rate", value: formatCurrency(parsed.hourlyRate) },
        { label: "Monthly salary", value: formatCurrency(parsed.monthlySalary) },
      ]
      initialValues = { annualSalary: parsed.annualSalary, hoursPerWeek: parsed.hoursPerWeek }
      break
    }
    default:
      break
  }

  if (parsed.category === "basic-loan") {
    const scenarioText = `${formatCurrency(parsed.principal)} at ${formatPercent(parsed.annualRate)} for ${parsed.termYears} years`
    intro = [
      "Basic loan calculator pages work well for search because users often want a quick payment estimate before they open a larger finance workflow. They want the shape of the payment, not a full underwriting model.",
      `For ${scenarioText}, the estimated monthly payment is ${formatCurrency(parsed.monthlyPayment)}, with total interest around ${formatCurrency(parsed.totalInterest)} across the full term.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This page is intentionally capped at basic payment math. It helps users compare straightforward borrowing scenarios without drifting into deep refinance, amortization, or mortgage-planning territory.",
      "That narrower scope makes the content safer for long-tail SEO while still serving lending-adjacent intent that tends to carry strong RPM.",
    ]
    howItWorks = [
      "The embedded calculator uses the standard amortized monthly payment formula. Adjust principal, rate, or term and the page can open the exact next route.",
      "The calculation stays local in the browser so the user can test borrowing scenarios quickly without entering personal lending data into an online service.",
    ]
    howToSteps = [
      { name: "Enter the principal", text: `This route uses ${formatCurrency(parsed.principal)} as the borrowed amount.` },
      { name: "Set the annual rate", text: `The current annual rate is ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the term", text: `The example uses a ${parsed.termYears}-year repayment term.` },
      { name: "Review payment and total cost", text: `Monthly payment is ${formatCurrency(parsed.monthlyPayment)} and total paid is about ${formatCurrency(parsed.totalPaid)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why basic loan routes can stay high value without getting too deep",
      [
        "Users frequently search exact loan scenarios long before they are ready for a full lender comparison or advanced amortization table. That makes basic payment pages a strong first-pass utility cluster.",
        "The guardrail here is scope. The page should stay useful and exact, but it should not try to impersonate a full lending platform or advanced finance suite.",
      ]
    )
    privacyNote = [
      "All calculations happen locally in the browser. No personal lending data, credit details, or account information is sent anywhere.",
      "That local workflow makes the page practical for quick pre-application comparisons and employer-device use.",
    ]
    faq = [
      { question: `What is the payment on ${formatCurrency(parsed.principal)} at ${parsed.annualRate}% for ${parsed.termYears} years?`, answer: `About ${formatCurrency(parsed.monthlyPayment)} per month.` },
      { question: "Does this include fees or insurance?", answer: "No. This route is intentionally limited to a basic payment estimate." },
      { question: "Why use a basic loan page instead of a full finance app?", answer: "Because many users only need a fast directional answer before deciding whether to research the scenario further." },
      { question: "Can I compare another interest rate quickly?", answer: "Yes. Use the related links or the embedded calculator to open the next exact route." },
      { question: "Does the page send loan values to a server?", answer: "No. The computation stays local in the browser." },
      { question: "What should I check next?", answer: "Simple interest, compound interest, and salary comparison pages are common next steps after a quick loan estimate." },
    ]
    summaryRows = [
      { label: "Principal", value: formatCurrency(parsed.principal) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Term", value: `${parsed.termYears} years` },
      { label: "Monthly payment", value: formatCurrency(parsed.monthlyPayment) },
      { label: "Total interest", value: formatCurrency(parsed.totalInterest) },
      { label: "Total paid", value: formatCurrency(parsed.totalPaid) },
    ]
    initialValues = { annualRate: parsed.annualRate, principal: parsed.principal, termYears: parsed.termYears }
  }

  if (parsed.category === "simple-interest") {
    const scenarioText = `${formatCurrency(parsed.principal)} at ${formatPercent(parsed.annualRate)} for ${parsed.years} years`
    intro = [
      "Simple interest pages work when the user needs a fast educational or first-pass answer without getting pulled into more advanced growth models. They are especially useful for clean classroom, business, and intro-finance queries.",
      `For ${scenarioText}, simple interest comes to ${formatCurrency(parsed.interest)}, bringing the total amount to ${formatCurrency(parsed.totalAmount)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The value of the page is clarity. It shows what simple interest means, how it differs from compounding, and why the result is linear instead of exponential.",
      "That keeps the route useful for students, quick business checks, and anyone comparing a basic formula against a more realistic compound-growth model.",
    ]
    howItWorks = [
      "The page multiplies principal by annual rate and then by time in years. That produces the interest amount, which is added back to principal for the final total.",
      "Because the calculation is local and browser-only, users can test alternative assumptions instantly without exporting data or leaving the route.",
    ]
    howToSteps = [
      { name: "Enter principal", text: `This route starts with ${formatCurrency(parsed.principal)}.` },
      { name: "Set the annual rate", text: `The current annual rate is ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the time period", text: `The example uses ${parsed.years} years.` },
      { name: "Read interest and total amount", text: `Interest is ${formatCurrency(parsed.interest)} and total amount is ${formatCurrency(parsed.totalAmount)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why simple interest still deserves its own routes",
      [
        "Simple interest is often searched as its own concept, not just as a stepping stone toward compound interest. Users want the formula, the result, and a comparison path when they are learning or checking a straightforward scenario.",
        "That is why the page pairs the answer with nearby compound-interest links instead of trying to be the final word on investing or lending.",
      ]
    )
    privacyNote = [
      "All calculations happen locally in the browser. No personal finance data or uploaded documents are required.",
      "That local-first approach keeps the page quick and low-friction for educational and work use alike.",
    ]
    faq = [
      { question: `How much simple interest does ${formatCurrency(parsed.principal)} earn at ${parsed.annualRate}% for ${parsed.years} years?`, answer: `${formatCurrency(parsed.interest)}.` },
      { question: "How is simple interest calculated?", answer: "Principal multiplied by annual rate multiplied by time." },
      { question: "How is this different from compound interest?", answer: "Simple interest grows linearly, while compound interest earns growth on previous growth." },
      { question: "Can I compare this with compound interest?", answer: "Yes. The related links include nearby compound-growth routes." },
      { question: "Does the page send my numbers anywhere?", answer: "No. All computation stays local in the browser." },
      { question: "What should I check next?", answer: "Compound interest and basic loan pages are common next steps after a simple-interest check." },
    ]
    summaryRows = [
      { label: "Principal", value: formatCurrency(parsed.principal) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Interest", value: formatCurrency(parsed.interest) },
      { label: "Total amount", value: formatCurrency(parsed.totalAmount) },
    ]
    initialValues = { annualRate: parsed.annualRate, principal: parsed.principal, years: parsed.years }
  }

  if (parsed.category === "compound-interest-intro") {
    const scenarioText = `${formatCurrency(parsed.principal)} at ${formatPercent(parsed.annualRate)} for ${parsed.years} years`
    intro = [
      "Compound interest pages are strong long-tail utilities because users want a quick sense of how growth accelerates over time. This cluster keeps the calculation intentionally introductory rather than turning it into a full portfolio-planning product.",
      `For ${scenarioText}, the projected value is about ${formatCurrency(parsed.futureValue)}, which means total growth of ${formatCurrency(parsed.totalGrowth)} under the simple compounding assumptions on this page.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The page explains the core intuition behind compounding while still answering one exact scenario. That makes it more useful than a blank calculator and more focused than a broad investing guide.",
      "It also creates healthy internal links into salary, simple-interest, and retirement-savings pages without pushing beyond the capped scope of this cluster.",
    ]
    howItWorks = [
      "The calculator compounds the starting amount monthly using the annual rate entered on the page. It is a practical intro model, not an advanced planning tool with taxes, fees, or asset allocation assumptions.",
      "All computation stays on-device in the browser, so the user can test growth scenarios without sending numbers to a remote service.",
    ]
    howToSteps = [
      { name: "Enter the starting amount", text: `This route starts with ${formatCurrency(parsed.principal)}.` },
      { name: "Set the annual return", text: `The example uses ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the time horizon", text: `The growth window here is ${parsed.years} years.` },
      { name: "Review projected value", text: `Projected value is ${formatCurrency(parsed.futureValue)} with growth of ${formatCurrency(parsed.totalGrowth)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why an introductory compound-interest layer is enough here",
      [
        "Most searchers landing on an exact compound-interest expression want a fast directional answer, not an all-in-one planning suite. That makes an intro-focused route appropriate and safer to scale.",
        "The page still needs enough explanation to differentiate itself: what is compounding, why time matters, and what the nearby next comparisons should be.",
      ]
    )
    privacyNote = [
      "All calculations happen locally in the browser. No account sync, portfolio import, or personal data submission is required.",
      "That makes the route useful for quick private planning without turning Plain Tools into a deep finance product.",
    ]
    faq = [
      { question: `What does ${formatCurrency(parsed.principal)} grow to at ${parsed.annualRate}% for ${parsed.years} years?`, answer: `About ${formatCurrency(parsed.futureValue)} under the assumptions used here.` },
      { question: "What does compound interest mean?", answer: "It means growth can earn additional growth over time, not just interest on the original principal." },
      { question: "Is this a full investing calculator?", answer: "No. It is intentionally an introductory growth model for first-pass comparisons." },
      { question: "Can I compare simple and compound interest?", answer: "Yes. The related links include simple-interest scenarios for the same kind of inputs." },
      { question: "Does the page send investment values anywhere?", answer: "No. All computation stays local in the browser." },
      { question: "What should I check next?", answer: "Simple interest and retirement savings pages are common next steps after this route." },
    ]
    summaryRows = [
      { label: "Starting amount", value: formatCurrency(parsed.principal) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Projected value", value: formatCurrency(parsed.futureValue) },
      { label: "Total growth", value: formatCurrency(parsed.totalGrowth) },
    ]
    initialValues = { annualRate: parsed.annualRate, principal: parsed.principal, years: parsed.years }
  }

  if (parsed.category === "retirement-basic") {
    const scenarioText = `${formatCurrency(parsed.monthlyContribution)} per month at ${formatPercent(parsed.annualRate)} for ${parsed.years} years`
    intro = [
      "Retirement savings pages can still fit this capped cluster when they stay simple and first-pass. The goal here is to estimate how recurring monthly savings might grow, not to replace a full retirement planning platform.",
      `For ${scenarioText}, projected value is about ${formatCurrency(parsed.futureValue)}, versus direct contributions of ${formatCurrency(parsed.totalContributions)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This kind of route captures practical intent from users who want a quick savings-growth answer before they move into deeper planning. That makes it a strong browser-first utility page without crowding the more advanced finance territory elsewhere.",
      "The page also helps users understand the relationship between monthly contributions, time, and rate without requiring them to upload spreadsheets or create accounts.",
    ]
    howItWorks = [
      "The embedded calculator compounds monthly contributions using the selected annual rate and time horizon. It is intentionally simple, which keeps the route easy to use and easy to understand.",
      "Everything runs locally in the browser, so the user can test scenarios privately and open the next canonical route immediately.",
    ]
    howToSteps = [
      { name: "Enter monthly savings", text: `This route starts with ${formatCurrency(parsed.monthlyContribution)} each month.` },
      { name: "Set the annual rate", text: `The example uses ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the timeline", text: `The horizon on this route is ${parsed.years} years.` },
      { name: "Compare contributions and projected value", text: `Contributions total ${formatCurrency(parsed.totalContributions)} and projected value is about ${formatCurrency(parsed.futureValue)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why a basic retirement savings page is still useful",
      [
        "Many users simply want to know what a monthly savings habit could look like over time. That is a narrower intent than full retirement planning, and it is appropriate for a capped utility cluster like this one.",
        "The important guardrail is to stay basic: monthly savings, time, rate, and an easy comparison path into related first-pass finance pages.",
      ]
    )
    privacyNote = [
      "All calculations happen locally in the browser. No savings data, plan details, or uploaded files are sent anywhere.",
      "That keeps the route private and aligned with the browser-first, no-upload positioning of Plain Tools.",
    ]
    faq = [
      { question: `How much could ${formatCurrency(parsed.monthlyContribution)} per month grow at ${parsed.annualRate}% over ${parsed.years} years?`, answer: `About ${formatCurrency(parsed.futureValue)} under the assumptions used on this page.` },
      { question: "Is this a full retirement planner?", answer: "No. This route is intentionally basic and designed for fast first-pass savings estimates." },
      { question: "Why compare projected value with contributions?", answer: "It helps the user separate what they put in from what growth adds over time." },
      { question: "Can I test another monthly contribution quickly?", answer: "Yes. The local calculator and related links open nearby scenarios immediately." },
      { question: "Does the page send savings values anywhere?", answer: "No. The calculation stays local in the browser." },
      { question: "What should I check next?", answer: "Salary comparison and simple-interest pages are common next steps after a basic retirement-savings estimate." },
    ]
    summaryRows = [
      { label: "Monthly contribution", value: formatCurrency(parsed.monthlyContribution) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Total contributions", value: formatCurrency(parsed.totalContributions) },
      { label: "Projected value", value: formatCurrency(parsed.futureValue) },
    ]
    initialValues = { annualRate: parsed.annualRate, monthlyContribution: parsed.monthlyContribution, years: parsed.years }
  }

  const wordCount = countWords([
    entry.title,
    entry.description,
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
      { href: `/calculators/${entry.category}`, label: CATEGORY_LABELS[entry.category] },
      { label: entry.expression.replace(/-/g, " ") },
    ],
    canonicalPath,
    category: entry.category,
    description: entry.description,
    expression: parsed.expression,
    featureList: [
      `${CATEGORY_LABELS[entry.category]} with a canonical long-tail route`,
      "All calculations run locally in your browser - nothing is sent anywhere",
      "Privacy-first utility page with no uploads or account requirement",
      "Strong internal links into nearby calculator and utility pages",
    ],
    heroBadges: ["local calculation", "browser-first", "no uploads", "privacy-first"],
    h1,
    initialValues,
    keywords: entry.keywords,
    liveToolDescription:
      "Adjust the inputs below to open the exact next calculator route. All calculations run locally in your browser - nothing is sent anywhere.",
    page: {
      canonicalPath,
      description: entry.description,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      paramLabel: CATEGORY_LABELS[entry.category],
      paramSlug: parsed.expression,
      privacyNote,
      relatedTools: relatedToolsForCalculator(parsed),
      title: entry.title,
      tool: calculatorTool,
      whyUsersNeedThis,
      wordCount,
    },
    relatedLinks: pageRelatedLinks,
    siloLinks: [
      { href: "/calculators", label: "Calculator hub" },
      { href: "/pdf-tools", label: "PDF tools" },
      { href: "/file-converters", label: "File converters" },
      { href: "/compare/plain-tools-vs-smallpdf", label: "Privacy-first comparisons" },
    ],
    summaryRows,
    title: entry.title,
  }
}

export function getCalculatorPage(
  category: CalculatorCategory,
  expression: string
): CalculatorPage | null {
  const parsed = parseCalculatorExpression(category, expression)
  if (!parsed) return null
  const entry = CALCULATOR_ENTRY_MAP.get(`${parsed.category}/${parsed.expression}`)
  if (!entry) return null
  return buildCalculatorPageData(entry, parsed)
}

export function getCalculatorPaths() {
  return PUBLIC_CALCULATOR_TEMPLATES.map((entry) =>
    buildCalculatorPath(entry.category, entry.expression)
  )
}

export function generateCategoryCalculatorParams(
  category: CalculatorCategory,
  limit?: number
) {
  const entries = PUBLIC_CALCULATOR_TEMPLATES.filter((entry) => entry.category === category)
  const slice = typeof limit === "number" ? entries.slice(0, limit) : entries
  return slice.map((entry) => ({ category, expression: entry.expression }))
}

export function generateCalculatorParams(limit?: number) {
  const entries =
    typeof limit === "number"
      ? PUBLIC_CALCULATOR_TEMPLATES.slice(0, limit)
      : PUBLIC_CALCULATOR_TEMPLATES
  return entries.map((entry) => ({ category: entry.category, expression: entry.expression }))
}

export function generateNonPercentageCalculatorParams(limit?: number) {
  const entries = PUBLIC_CALCULATOR_TEMPLATES.filter(
    (entry) => entry.category !== "percentage"
  )
  const slice = typeof limit === "number" ? entries.slice(0, limit) : entries
  return slice.map((entry) => ({ category: entry.category, expression: entry.expression }))
}

export function getPrebuildCalculatorParams(limit = 400) {
  const perCategory: Record<PublicCalculatorCategory, number> = {
    "basic-loan": 64,
    percentage: 260,
    "retirement-basic": 44,
    "salary-to-hourly": 36,
    "simple-interest": 52,
    tip: 64,
  }

  const staged = PUBLIC_CATEGORY_ORDER.flatMap((category) =>
    generateCategoryCalculatorParams(category, perCategory[category])
  )
  return staged.slice(0, limit)
}

export const CALCULATOR_FINANCIAL_METADATA_EXAMPLES = [
  getCalculatorPage("percentage", "what-is-20-percent-of-500"),
  getCalculatorPage("tip", "tip-calculator-150-18"),
  getCalculatorPage("salary-to-hourly", "salary-to-hourly-60000-40"),
  getCalculatorPage("basic-loan", "loan-payment-10000-5-3-years"),
  getCalculatorPage("simple-interest", "simple-interest-10000-5-3"),
  getCalculatorPage("retirement-basic", "retirement-savings-500-monthly-6-20-years"),
]
  .filter((entry): entry is CalculatorPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

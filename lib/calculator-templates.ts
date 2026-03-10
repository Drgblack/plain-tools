import { buildMetaDescription } from "@/lib/page-metadata"
import type {
  ProgrammaticExplanationBlock,
  ProgrammaticFaq,
  ProgrammaticHowToStep,
  ProgrammaticPageData,
  ProgrammaticRelatedTool,
} from "@/lib/programmatic-content"
import type { ToolDefinition } from "@/lib/tools-catalogue"

export type CalculatorCategory =
  | "percentage"
  | "loan"
  | "mortgage"
  | "compound-interest"
  | "retirement"
  | "tax-estimate"
  | "tip"
  | "salary-to-hourly"

export type CalculatorRouteParams = {
  category: CalculatorCategory
  expression: string
}

type CalculatorEntry = {
  category: CalculatorCategory
  desc: string
  expression: string
  keywords: string[]
  title: string
}

type TaxFilingStatus = "head-of-household" | "married" | "single"
type TaxState = "california" | "florida" | "illinois" | "new-york" | "texas" | "washington"

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

type ParsedCalculator =
  | {
      category: "percentage"
      base: number
      expression: string
      percent: number
      result: number
    }
  | {
      annualRate: number
      category: "loan" | "mortgage"
      expression: string
      monthlyPayment: number
      principal: number
      termYears: number
      totalInterest: number
      totalPaid: number
    }
  | {
      annualRate: number
      category: "compound-interest"
      expression: string
      futureValue: number
      principal: number
      totalGrowth: number
      years: number
    }
  | {
      annualRate: number
      category: "retirement"
      expression: string
      futureValue: number
      monthlyContribution: number
      totalContributions: number
      years: number
    }
  | {
      category: "tax-estimate"
      effectiveRate: number
      estimatedTax: number
      expression: string
      filingStatus: TaxFilingStatus
      income: number
      keepAfterTax: number
      state: TaxState
    }
  | {
      bill: number
      category: "tip"
      expression: string
      split: number
      tipAmount: number
      tipPercent: number
      totalBill: number
      totalPerPerson: number
    }
  | {
      annualSalary: number
      category: "salary-to-hourly"
      expression: string
      hourlyRate: number
      hoursPerWeek: number
      monthlySalary: number
      weeksPerYear: number
    }

const calculatorTool: ToolDefinition = {
  available: true,
  category: "Utility",
  description:
    "Run financial calculations locally in the browser with no upload, no account, and canonical long-tail calculator routes.",
  id: "financial-calculator",
  name: "Financial Calculator",
  slug: "financial-calculator",
}

const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  "compound-interest": "Compound Interest",
  loan: "Loan Payment",
  mortgage: "Mortgage Payment",
  percentage: "Percentage",
  retirement: "Retirement",
  "salary-to-hourly": "Salary to Hourly",
  "tax-estimate": "Tax Estimate",
  tip: "Tip",
}

export const CALCULATOR_CATEGORY_LIST = Object.keys(
  CATEGORY_LABELS
) as CalculatorCategory[]

const CATEGORY_PREBUILD_ORDER: CalculatorCategory[] = [
  "percentage",
  "loan",
  "mortgage",
  "compound-interest",
  "retirement",
  "tax-estimate",
  "tip",
  "salary-to-hourly",
]

const PERCENT_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 22, 25, 30, 33, 35, 40, 45, 50,
  60, 65, 70, 75, 80, 85, 90, 95,
] as const

const PERCENT_BASE_VALUES = [
  10, 15, 20, 24, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90, 100, 120, 125,
  150, 175, 180, 200, 225, 240, 250, 300, 350, 400, 450, 500, 600,
] as const

const LOAN_PRINCIPALS = [5000, 10000, 15000, 20000, 25000, 30000, 50000, 75000, 100000, 150000, 200000, 250000] as const
const LOAN_RATES = [4, 5, 6, 7] as const
const LOAN_TERMS = [3, 5, 7] as const

const MORTGAGE_AMOUNTS = [150000, 200000, 250000, 300000, 350000, 400000, 500000, 600000] as const
const MORTGAGE_RATES = [4, 5, 6] as const
const MORTGAGE_TERMS = [15, 20, 30] as const

const COMPOUND_PRINCIPALS = [1000, 5000, 10000, 25000, 50000, 75000] as const
const COMPOUND_RATES = [4, 5, 6, 7] as const
const COMPOUND_YEARS = [5, 10, 15] as const

const RETIREMENT_MONTHLY = [200, 300, 500, 750, 1000, 1500] as const
const RETIREMENT_RATES = [5, 6, 7] as const
const RETIREMENT_YEARS = [10, 20, 30] as const

const TAX_INCOMES = [30000, 50000, 75000, 100000, 150000, 200000] as const
const TAX_FILING_STATUSES: TaxFilingStatus[] = ["single", "married", "head-of-household"]
const TAX_STATES: TaxState[] = ["california", "new-york", "illinois", "texas", "florida", "washington"]

const TIP_BILLS = [20, 35, 50, 75, 100, 150] as const
const TIP_PERCENTS = [15, 18, 20, 25] as const
const TIP_SPLITS = [1, 2, 4] as const

const SALARY_VALUES = [35000, 40000, 50000, 60000, 75000, 90000, 100000, 120000, 150000] as const
const SALARY_HOURS = [35, 37.5, 40] as const
const SALARY_WEEKS = [50, 52] as const

const TAX_STATUS_LABELS: Record<TaxFilingStatus, string> = {
  "head-of-household": "Head of Household",
  married: "Married Filing Jointly",
  single: "Single",
}

const TAX_STATE_LABELS: Record<TaxState, string> = {
  california: "California",
  florida: "Florida",
  illinois: "Illinois",
  "new-york": "New York",
  texas: "Texas",
  washington: "Washington",
}

const TAX_STATE_RATES: Record<TaxState, number> = {
  california: 0.065,
  florida: 0,
  illinois: 0.04,
  "new-york": 0.058,
  texas: 0,
  washington: 0,
}

const TAX_FEDERAL_BASE: Record<TaxFilingStatus, Array<{ min: number; rate: number }>> = {
  "head-of-household": [
    { min: 0, rate: 0.11 },
    { min: 50000, rate: 0.16 },
    { min: 100000, rate: 0.2 },
    { min: 150000, rate: 0.24 },
  ],
  married: [
    { min: 0, rate: 0.1 },
    { min: 50000, rate: 0.15 },
    { min: 100000, rate: 0.19 },
    { min: 150000, rate: 0.23 },
  ],
  single: [
    { min: 0, rate: 0.12 },
    { min: 50000, rate: 0.17 },
    { min: 100000, rate: 0.21 },
    { min: 150000, rate: 0.25 },
  ],
}

export function buildCalculatorPath(
  category: CalculatorCategory,
  expression: string
) {
  return `/calculators/${category}/${expression}`
}

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

function formatPercentValue(value: number) {
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
  const months = years * 12
  return principal * (1 + monthlyRate) ** months
}

function futureValueRetirement(monthlyContribution: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  if (monthlyRate === 0) return monthlyContribution * months
  return monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate)
}

function taxEffectiveRate(income: number, filingStatus: TaxFilingStatus, state: TaxState) {
  const federalTable = TAX_FEDERAL_BASE[filingStatus]
  const federal =
    [...federalTable].reverse().find((entry) => income >= entry.min)?.rate ??
    federalTable[0].rate
  return federal + TAX_STATE_RATES[state]
}

function parseNumberToken(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function percentageExpressionFor(percent: number, base: number) {
  return `what-is-${percent}-percent-of-${base}`
}

function loanExpressionFor(principal: number, annualRate: number, termYears: number) {
  return `loan-payment-${principal}-${annualRate}-${termYears}-years`
}

function mortgageExpressionFor(principal: number, annualRate: number, termYears: number) {
  return `mortgage-payment-${principal}-${annualRate}-${termYears}-years`
}

function compoundExpressionFor(principal: number, annualRate: number, years: number) {
  return `compound-interest-${principal}-${annualRate}-${years}`
}

function retirementExpressionFor(monthlyContribution: number, annualRate: number, years: number) {
  return `retirement-${monthlyContribution}-monthly-${annualRate}-${years}-years`
}

function taxExpressionFor(income: number, filingStatus: TaxFilingStatus, state: TaxState) {
  return `tax-estimate-${income}-${filingStatus}-${state}`
}

function tipExpressionFor(bill: number, tipPercent: number, split: number) {
  return `tip-${bill}-${tipPercent}-${split}-way-split`
}

function salaryExpressionFor(annualSalary: number, hoursPerWeek: number, weeksPerYear: number) {
  return `salary-${annualSalary}-${hoursPerWeek}-hours-${weeksPerYear}-weeks`
}

export function isCalculatorCategory(value: string): value is CalculatorCategory {
  return CALCULATOR_CATEGORY_LIST.includes(value as CalculatorCategory)
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

  const readString = (key: string) => String(rawValues[key] ?? "").trim().toLowerCase()

  switch (category) {
    case "percentage": {
      const percent = readNumber("percent")
      const base = readNumber("base")
      if (percent === null || base === null || percent < 0 || base < 0) return null
      return percentageExpressionFor(percent, base)
    }
    case "loan": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const termYears = readNumber("termYears")
      if (principal === null || annualRate === null || termYears === null) return null
      return loanExpressionFor(principal, annualRate, termYears)
    }
    case "mortgage": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const termYears = readNumber("termYears")
      if (principal === null || annualRate === null || termYears === null) return null
      return mortgageExpressionFor(principal, annualRate, termYears)
    }
    case "compound-interest": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (principal === null || annualRate === null || years === null) return null
      return compoundExpressionFor(principal, annualRate, years)
    }
    case "retirement": {
      const monthlyContribution = readNumber("monthlyContribution")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (
        monthlyContribution === null ||
        annualRate === null ||
        years === null
      ) {
        return null
      }
      return retirementExpressionFor(monthlyContribution, annualRate, years)
    }
    case "tax-estimate": {
      const income = readNumber("income")
      const filingStatus = readString("filingStatus") as TaxFilingStatus
      const state = readString("state") as TaxState
      if (
        income === null ||
        !TAX_FILING_STATUSES.includes(filingStatus) ||
        !TAX_STATES.includes(state)
      ) {
        return null
      }
      return taxExpressionFor(income, filingStatus, state)
    }
    case "tip": {
      const bill = readNumber("bill")
      const tipPercent = readNumber("tipPercent")
      const split = readNumber("split")
      if (bill === null || tipPercent === null || split === null) return null
      return tipExpressionFor(bill, tipPercent, split)
    }
    case "salary-to-hourly": {
      const annualSalary = readNumber("annualSalary")
      const hoursPerWeek = readNumber("hoursPerWeek")
      const weeksPerYear = readNumber("weeksPerYear")
      if (
        annualSalary === null ||
        hoursPerWeek === null ||
        weeksPerYear === null
      ) {
        return null
      }
      return salaryExpressionFor(annualSalary, hoursPerWeek, weeksPerYear)
    }
  }
}

function parseCalculatorExpression(
  category: CalculatorCategory,
  expression: string
): ParsedCalculator | null {
  const decoded = decodeURIComponent(expression).trim().toLowerCase()

  if (category === "percentage") {
    const match = /^what-is-([0-9]+(?:\.[0-9]+)*)-percent-of-([0-9]+(?:\.[0-9]+)*)$/.exec(decoded)
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

  if (category === "loan" || category === "mortgage") {
    const prefix = category === "loan" ? "loan-payment" : "mortgage-payment"
    const match = new RegExp(`^${prefix}-([0-9]+)-([0-9]+(?:\\.[0-9]+)*)-([0-9]+)-years$`).exec(decoded)
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termYears = parseNumberToken(match[3] ?? "")
    if (!principal || annualRate === null || !termYears) return null
    const payment = monthlyPayment(principal, annualRate, termYears)
    const totalPaid = payment * termYears * 12
    return {
      annualRate,
      category,
      expression: category === "loan" ? loanExpressionFor(principal, annualRate, termYears) : mortgageExpressionFor(principal, annualRate, termYears),
      monthlyPayment: payment,
      principal,
      termYears,
      totalInterest: totalPaid - principal,
      totalPaid,
    }
  }

  if (category === "compound-interest") {
    const match = /^compound-interest-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)$/.exec(decoded)
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    if (!principal || annualRate === null || !years) return null
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

  if (category === "retirement") {
    const match = /^retirement-([0-9]+)-monthly-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years$/.exec(decoded)
    if (!match) return null
    const monthlyContribution = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    if (!monthlyContribution || annualRate === null || !years) return null
    const futureValue = futureValueRetirement(monthlyContribution, annualRate, years)
    return {
      annualRate,
      category,
      expression: retirementExpressionFor(monthlyContribution, annualRate, years),
      futureValue,
      monthlyContribution,
      totalContributions: monthlyContribution * years * 12,
      years,
    }
  }

  if (category === "tax-estimate") {
    const match = /^tax-estimate-([0-9]+)-(single|married|head-of-household)-(california|florida|new-york|texas|washington|illinois)$/.exec(decoded)
    if (!match) return null
    const income = parseNumberToken(match[1] ?? "")
    const filingStatus = match[2] as TaxFilingStatus
    const state = match[3] as TaxState
    if (!income) return null
    const effectiveRate = taxEffectiveRate(income, filingStatus, state)
    const estimatedTax = income * effectiveRate
    return {
      category,
      effectiveRate,
      estimatedTax,
      expression: taxExpressionFor(income, filingStatus, state),
      filingStatus,
      income,
      keepAfterTax: income - estimatedTax,
      state,
    }
  }

  if (category === "tip") {
    const match = /^tip-([0-9]+)-([0-9]+)-([0-9]+)-way-split$/.exec(decoded)
    if (!match) return null
    const bill = parseNumberToken(match[1] ?? "")
    const tipPercent = parseNumberToken(match[2] ?? "")
    const split = parseNumberToken(match[3] ?? "")
    if (!bill || tipPercent === null || !split) return null
    const tipAmount = (bill * tipPercent) / 100
    const totalBill = bill + tipAmount
    return {
      bill,
      category,
      expression: tipExpressionFor(bill, tipPercent, split),
      split,
      tipAmount,
      tipPercent,
      totalBill,
      totalPerPerson: totalBill / split,
    }
  }

  if (category === "salary-to-hourly") {
    const match = /^salary-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-hours-([0-9]+)-weeks$/.exec(decoded)
    if (!match) return null
    const annualSalary = parseNumberToken(match[1] ?? "")
    const hoursPerWeek = parseNumberToken(match[2] ?? "")
    const weeksPerYear = parseNumberToken(match[3] ?? "")
    if (!annualSalary || !hoursPerWeek || !weeksPerYear) return null
    return {
      annualSalary,
      category,
      expression: salaryExpressionFor(annualSalary, hoursPerWeek, weeksPerYear),
      hourlyRate: annualSalary / (hoursPerWeek * weeksPerYear),
      hoursPerWeek,
      monthlySalary: annualSalary / 12,
      weeksPerYear,
    }
  }

  return null
}

function percentageEntries(): CalculatorEntry[] {
  return PERCENT_VALUES.flatMap((percent) =>
    PERCENT_BASE_VALUES.map((base) => ({
      category: "percentage" as const,
      desc: buildMetaDescription(`Calculate what ${percent}% of ${base} is instantly with a local browser percentage calculator on Plain Tools.`),
      expression: percentageExpressionFor(percent, base),
      keywords: [`what is ${percent}% of ${base}`, `${percent} percent of ${base}`, "percentage calculator", "local calculator"],
      title: `What Is ${percent}% of ${base}? – Instant Percentage Calculator | Plain Tools`,
    }))
  )
}

function loanEntries(): CalculatorEntry[] {
  return LOAN_PRINCIPALS.flatMap((principal) =>
    LOAN_RATES.flatMap((annualRate) =>
      LOAN_TERMS.map((termYears) => ({
        category: "loan" as const,
        desc: buildMetaDescription(`Estimate the monthly payment on a ${formatCurrency(principal)} loan at ${annualRate}% over ${termYears} years with a browser-only calculator on Plain Tools.`),
        expression: loanExpressionFor(principal, annualRate, termYears),
        keywords: [`loan payment ${principal} ${annualRate} ${termYears} years`, `${principal} loan payment calculator`, "loan payment calculator", "monthly payment calculator"],
        title: `Loan Payment for ${formatCurrency(principal)} at ${annualRate}% for ${termYears} Years | Plain Tools`,
      }))
    )
  )
}

function mortgageEntries(): CalculatorEntry[] {
  return MORTGAGE_AMOUNTS.flatMap((principal) =>
    MORTGAGE_RATES.flatMap((annualRate) =>
      MORTGAGE_TERMS.map((termYears) => ({
        category: "mortgage" as const,
        desc: buildMetaDescription(`Estimate the monthly payment on a ${formatCurrency(principal)} mortgage at ${annualRate}% over ${termYears} years with local browser computation on Plain Tools.`),
        expression: mortgageExpressionFor(principal, annualRate, termYears),
        keywords: [`mortgage payment ${principal} ${annualRate} ${termYears} years`, `${principal} mortgage calculator`, "mortgage payment calculator", "monthly mortgage estimate"],
        title: `Mortgage Payment for ${formatCurrency(principal)} at ${annualRate}% for ${termYears} Years | Plain Tools`,
      }))
    )
  )
}

function compoundEntries(): CalculatorEntry[] {
  return COMPOUND_PRINCIPALS.flatMap((principal) =>
    COMPOUND_RATES.flatMap((annualRate) =>
      COMPOUND_YEARS.map((years) => ({
        category: "compound-interest" as const,
        desc: buildMetaDescription(`Estimate compound interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} years with an in-browser calculator on Plain Tools.`),
        expression: compoundExpressionFor(principal, annualRate, years),
        keywords: [`compound interest ${principal} ${annualRate} ${years}`, "compound interest calculator", "investment growth calculator", "future value calculator"],
        title: `Compound Interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} Years | Plain Tools`,
      }))
    )
  )
}

function retirementEntries(): CalculatorEntry[] {
  return RETIREMENT_MONTHLY.flatMap((monthlyContribution) =>
    RETIREMENT_RATES.flatMap((annualRate) =>
      RETIREMENT_YEARS.map((years) => ({
        category: "retirement" as const,
        desc: buildMetaDescription(`Estimate retirement growth for ${formatCurrency(monthlyContribution)} monthly contributions at ${annualRate}% for ${years} years with local computation on Plain Tools.`),
        expression: retirementExpressionFor(monthlyContribution, annualRate, years),
        keywords: [`retirement calculator ${monthlyContribution} monthly ${annualRate} ${years} years`, "retirement savings calculator", "monthly contribution calculator", "future retirement value"],
        title: `Retirement Growth for ${formatCurrency(monthlyContribution)}/Month at ${annualRate}% for ${years} Years | Plain Tools`,
      }))
    )
  )
}

function taxEntries(): CalculatorEntry[] {
  return TAX_INCOMES.flatMap((income) =>
    TAX_FILING_STATUSES.flatMap((filingStatus) =>
      TAX_STATES.map((state) => ({
        category: "tax-estimate" as const,
        desc: buildMetaDescription(`Estimate taxes on ${formatCurrency(income)} for ${TAX_STATUS_LABELS[filingStatus].toLowerCase()} filers in ${TAX_STATE_LABELS[state]} with a browser-only tax estimate calculator on Plain Tools.`),
        expression: taxExpressionFor(income, filingStatus, state),
        keywords: [`tax estimate ${income} ${filingStatus} ${state}`, "tax estimate calculator", "after tax salary estimate", "income tax estimate"],
        title: `Tax Estimate for ${formatCurrency(income)} – ${TAX_STATUS_LABELS[filingStatus]}, ${TAX_STATE_LABELS[state]} | Plain Tools`,
      }))
    )
  )
}

function tipEntries(): CalculatorEntry[] {
  return TIP_BILLS.flatMap((bill) =>
    TIP_PERCENTS.flatMap((tipPercent) =>
      TIP_SPLITS.map((split) => ({
        category: "tip" as const,
        desc: buildMetaDescription(`Calculate a ${tipPercent}% tip on a ${formatCurrency(bill)} bill and split it ${split} ways with a local browser tip calculator on Plain Tools.`),
        expression: tipExpressionFor(bill, tipPercent, split),
        keywords: [`tip ${bill} ${tipPercent} split ${split}`, "tip calculator", "bill split calculator", "restaurant tip calculator"],
        title: `${tipPercent}% Tip on ${formatCurrency(bill)} Split ${split} Ways | Plain Tools`,
      }))
    )
  )
}

function salaryEntries(): CalculatorEntry[] {
  return SALARY_VALUES.flatMap((annualSalary) =>
    SALARY_HOURS.flatMap((hoursPerWeek) =>
      SALARY_WEEKS.map((weeksPerYear) => ({
        category: "salary-to-hourly" as const,
        desc: buildMetaDescription(`Convert ${formatCurrency(annualSalary)} salary to hourly pay using ${hoursPerWeek} hours per week and ${weeksPerYear} working weeks with a local calculator on Plain Tools.`),
        expression: salaryExpressionFor(annualSalary, hoursPerWeek, weeksPerYear),
        keywords: [`salary to hourly ${annualSalary} ${hoursPerWeek} ${weeksPerYear}`, "salary to hourly calculator", "annual salary to hourly pay", "hourly wage estimate"],
        title: `${formatCurrency(annualSalary)} Salary to Hourly at ${hoursPerWeek} Hours/Week | Plain Tools`,
      }))
    )
  )
}

export const CALCULATOR_TEMPLATES: CalculatorEntry[] = [
  ...percentageEntries(),
  ...loanEntries(),
  ...mortgageEntries(),
  ...compoundEntries(),
  ...retirementEntries(),
  ...taxEntries(),
  ...tipEntries(),
  ...salaryEntries(),
]

const CALCULATOR_ENTRY_MAP = new Map(
  CALCULATOR_TEMPLATES.map((entry) => [`${entry.category}/${entry.expression}`, entry])
)

function relatedCalculatorLinks(parsed: ParsedCalculator): Array<{ href: string; title: string }> {
  switch (parsed.category) {
    case "percentage":
      return [
        { href: buildCalculatorPath("percentage", percentageExpressionFor(Math.max(1, parsed.percent - 5), parsed.base)), title: `${Math.max(1, parsed.percent - 5)}% of ${parsed.base}` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(parsed.percent + 5, parsed.base)), title: `${parsed.percent + 5}% of ${parsed.base}` },
        { href: buildCalculatorPath("loan", loanExpressionFor(200000, 5, 30)), title: "Loan payment calculator" },
        { href: buildCalculatorPath("mortgage", mortgageExpressionFor(350000, 6, 30)), title: "Mortgage payment calculator" },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(100000, "single", "california")), title: "Tax estimate calculator" },
        { href: "/compare/plain-tools-vs-smallpdf", title: "Privacy-first comparisons" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/convert/pdf-to-word/offline", title: "Offline converters" },
      ]
    case "loan":
      return [
        { href: buildCalculatorPath("loan", loanExpressionFor(parsed.principal, Math.max(0, parsed.annualRate - 1), parsed.termYears)), title: `${formatCurrency(parsed.principal)} loan at ${Math.max(0, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("loan", loanExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.termYears)), title: `${formatCurrency(parsed.principal)} loan at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("mortgage", mortgageExpressionFor(Math.max(150000, parsed.principal), parsed.annualRate, 30)), title: "Mortgage payment comparison" },
        { href: buildCalculatorPath("compound-interest", compoundExpressionFor(10000, 7, 10)), title: "Compound interest calculator" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(90000, 40, 52)), title: "Salary to hourly calculator" },
        { href: "/guides/accounting/merge-document-packets", title: "Accounting workflows" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/compare/plain-tools-vs-adobe-acrobat-online", title: "Tool comparisons" },
      ]
    case "mortgage":
      return [
        { href: buildCalculatorPath("mortgage", mortgageExpressionFor(parsed.principal, Math.max(0, parsed.annualRate - 1), parsed.termYears)), title: `${formatCurrency(parsed.principal)} mortgage at ${Math.max(0, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("mortgage", mortgageExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.termYears)), title: `${formatCurrency(parsed.principal)} mortgage at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("loan", loanExpressionFor(50000, 6, 5)), title: "Loan payment calculator" },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(150000, "married", "texas")), title: "Tax estimate calculator" },
        { href: buildCalculatorPath("retirement", retirementExpressionFor(500, 7, 30)), title: "Retirement calculator" },
        { href: "/guides/real-estate/prepare-client-evidence-bundles", title: "Real-estate workflows" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/compare/plain-tools-vs-pdf24", title: "Privacy-first comparisons" },
      ]
    case "compound-interest":
      return [
        { href: buildCalculatorPath("compound-interest", compoundExpressionFor(parsed.principal, Math.max(0, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.principal)} at ${Math.max(0, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("compound-interest", compoundExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("retirement", retirementExpressionFor(750, parsed.annualRate, Math.max(10, parsed.years))), title: "Retirement contribution calculator" },
        { href: buildCalculatorPath("loan", loanExpressionFor(100000, 6, 7)), title: "Loan payment calculator" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(120000, 40, 52)), title: "Salary to hourly calculator" },
        { href: "/compare/plain-tools-vs-smallpdf", title: "Privacy-first comparisons" },
        { href: "/file-converters", title: "File converters" },
        { href: "/pdf-tools", title: "PDF tools" },
      ]
    case "retirement":
      return [
        { href: buildCalculatorPath("retirement", retirementExpressionFor(parsed.monthlyContribution, Math.max(0, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${Math.max(0, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("retirement", retirementExpressionFor(parsed.monthlyContribution, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("compound-interest", compoundExpressionFor(10000, parsed.annualRate, 10)), title: "Compound interest calculator" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(100000, 40, 52)), title: "Salary to hourly calculator" },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(100000, "single", "california")), title: "Tax estimate calculator" },
        { href: "/guides/executive/mark-approval-drafts", title: "Executive workflows" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/compare/plain-tools-vs-sejda", title: "Tool comparisons" },
      ]
    case "tax-estimate":
      return [
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(parsed.income, parsed.filingStatus, "texas")), title: `${formatCurrency(parsed.income)} tax estimate in Texas` },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(parsed.income, parsed.filingStatus, "california")), title: `${formatCurrency(parsed.income)} tax estimate in California` },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.income, 40, 52)), title: "Salary to hourly calculator" },
        { href: buildCalculatorPath("loan", loanExpressionFor(50000, 6, 5)), title: "Loan payment calculator" },
        { href: buildCalculatorPath("retirement", retirementExpressionFor(500, 7, 30)), title: "Retirement calculator" },
        { href: "/guides/accounting/merge-document-packets", title: "Accounting workflows" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/compare/plain-tools-vs-smallpdf", title: "Privacy-first comparisons" },
      ]
    case "tip":
      return [
        { href: buildCalculatorPath("tip", tipExpressionFor(parsed.bill, 18, parsed.split)), title: `18% tip on ${formatCurrency(parsed.bill)}` },
        { href: buildCalculatorPath("tip", tipExpressionFor(parsed.bill, 20, parsed.split)), title: `20% tip on ${formatCurrency(parsed.bill)}` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(parsed.tipPercent, parsed.bill)), title: "Percentage calculator" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(60000, 40, 52)), title: "Salary to hourly calculator" },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(75000, "single", "illinois")), title: "Tax estimate calculator" },
        { href: "/compare/plain-tools-vs-pdf24", title: "Privacy-first comparisons" },
        { href: "/file-converters", title: "File converters" },
        { href: "/pdf-tools", title: "PDF tools" },
      ]
    case "salary-to-hourly":
      return [
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 35, parsed.weeksPerYear)), title: `${formatCurrency(parsed.annualSalary)} at 35 hours/week` },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 40, parsed.weeksPerYear)), title: `${formatCurrency(parsed.annualSalary)} at 40 hours/week` },
        { href: buildCalculatorPath("tax-estimate", taxExpressionFor(parsed.annualSalary, "single", "new-york")), title: "Tax estimate calculator" },
        { href: buildCalculatorPath("retirement", retirementExpressionFor(500, 7, 30)), title: "Retirement calculator" },
        { href: buildCalculatorPath("loan", loanExpressionFor(50000, 6, 5)), title: "Loan payment calculator" },
        { href: "/guides/hr/sign-final-copy", title: "HR workflows" },
        { href: "/pdf-tools", title: "PDF tools" },
        { href: "/compare/plain-tools-vs-ilovepdf", title: "Tool comparisons" },
      ]
  }
}

function relatedTools(parsed: ParsedCalculator): ProgrammaticRelatedTool[] {
  return relatedCalculatorLinks(parsed).slice(0, 6).map((link) => ({
    description: `Open ${link.title.toLowerCase()} on its canonical Plain Tools route.`,
    href: link.href,
    name: link.title,
  }))
}

function buildCalculatorPageData(entry: CalculatorEntry, parsed: ParsedCalculator): CalculatorPage {
  const canonicalPath = buildCalculatorPath(entry.category, parsed.expression)
  const relatedLinks = relatedCalculatorLinks(parsed)

  let intro: string[] = []
  let whyUsersNeedThis: string[] = []
  let howItWorks: string[] = []
  let howToSteps: ProgrammaticHowToStep[] = []
  let explanationBlocks: ProgrammaticExplanationBlock[] = []
  let privacyNote: string[] = []
  let faq: ProgrammaticFaq[] = []
  let summaryRows: Array<{ label: string; value: string }> = []
  let initialValues: Record<string, number | string> = {}

  switch (parsed.category) {
    case "percentage": {
      intro = [
        `Searches like "what is ${parsed.percent}% of ${parsed.base}" usually happen inside a real money or planning task. Someone may be checking a discount, markup, tax add-on, fee split, commission, budget change, or score threshold and wants the answer immediately.`,
        `That is why Plain Tools treats percentage pages as full programmatic routes instead of disposable snippets. This page gives the answer, keeps the math local in the browser, and links into adjacent finance and utility workflows so the user can keep moving once the number lands.`,
      ]
      whyUsersNeedThis = [
        `For this route, ${parsed.percent}% of ${parsed.base} equals ${formatNumber(parsed.result)}. The useful part is not just the answer itself. It is the context around whether the number represents a tax amount, discount, budget slice, or reporting threshold.`,
        "Strong percentage pages are useful because they expose the formula, reduce calculation errors, and give the user clean adjacent scenarios without bouncing them into another heavy finance portal.",
      ]
      howItWorks = [
        "The embedded calculator below runs entirely in the browser. Adjust the percentage or base amount and Plain Tools opens the exact canonical route for that scenario instantly.",
        "That local-computation model keeps the page fast, privacy-first, and shareable without any upload, account, or tracking-heavy workflow.",
      ]
      howToSteps = [
        { name: "Identify the percentage", text: `${parsed.percent}% means ${parsed.percent} parts out of every 100.` },
        { name: "Identify the base amount", text: `${parsed.base} is the amount the percentage applies to.` },
        { name: "Run the formula", text: `${parsed.percent} x ${parsed.base} / 100 = ${formatNumber(parsed.result)}.` },
        { name: "Interpret the business meaning", text: "Decide whether the result is being used as a discount, fee, tax, commission, or target number before acting on it." },
      ]
      explanationBlocks = [
        {
          title: "Why percentage pages still drive search demand",
          paragraphs: [
            "Percentage questions show up everywhere in pricing, payroll, taxes, commissions, and budgeting. The search volume is driven by live tasks, not by people looking for a math lesson.",
            "That makes percentage routes commercially meaningful and operationally useful at the same time.",
          ],
        },
        {
          title: "How to sanity-check the output",
          paragraphs: [
            `A quick gut-check helps. Ten percent of ${parsed.base} would be ${formatNumber(parsed.base / 10)}, so ${parsed.percent}% should feel proportionally close to that benchmark.`,
            "Good calculator pages should make the answer easy to verify instead of hiding the arithmetic.",
          ],
        },
        {
          title: "Why Plain Tools keeps this lightweight",
          paragraphs: [
            "A percentage calculator does not need uploaded files or synced financial data to be useful. The route stays browser-only, fast, and canonical so it can support both search and repeat usage cleanly.",
            "That approach also keeps the page aligned with the site's privacy-first positioning even for simple calculations.",
          ],
        },
      ]
      privacyNote = [
        "This calculation runs locally in the browser. No data is sent anywhere, no files are uploaded, and there is no account requirement attached to the route.",
        "That local-computation model is intentionally simple because calculator users usually want speed, clarity, and privacy rather than another heavy financial portal.",
      ]
      faq = [
        { question: `What is ${parsed.percent}% of ${parsed.base}?`, answer: `${parsed.percent}% of ${parsed.base} is ${formatNumber(parsed.result)}.` },
        { question: "How do I calculate this manually?", answer: `Multiply ${parsed.base} by ${parsed.percent} and divide by 100.` },
        { question: "Can I change the numbers here?", answer: "Yes. The live calculator updates in the browser and opens the exact canonical route for the new expression." },
        { question: "When do people use percentage calculators?", answer: "Common uses include discounts, tax add-ons, commissions, budget changes, grade thresholds, and reporting metrics." },
        { question: "Does this calculator send data anywhere?", answer: "No. The computation is local in the browser with no upload or account requirement." },
        { question: "What should I check next?", answer: "Move into loan, mortgage, tax, retirement, or salary calculators if the percentage question is part of a broader financial decision." },
      ]
      summaryRows = [
        { label: "Expression", value: `${parsed.percent}% of ${parsed.base}` },
        { label: "Formula", value: `(${parsed.percent} / 100) x ${parsed.base}` },
        { label: "Result", value: formatNumber(parsed.result) },
      ]
      initialValues = { base: parsed.base, percent: parsed.percent }
      break
    }
    case "loan":
    case "mortgage": {
      const noun = parsed.category === "loan" ? "loan" : "mortgage"
      intro = [
        `${CATEGORY_LABELS[parsed.category]} pages capture high-value traffic because users are usually close to a real borrowing decision. They are comparing affordability, checking how rates change the payment, or preparing for a bank, dealership, or housing conversation.`,
        `For this route, a ${formatCurrency(parsed.principal)} ${noun} at ${parsed.annualRate}% over ${parsed.termYears} years produces an estimated monthly payment of ${formatCurrency(parsed.monthlyPayment)}. Plain Tools keeps that estimate local and wraps it in enough explanation to stay useful and index-safe.`,
      ]
      whyUsersNeedThis = [
        "Loan and mortgage routes tend to monetize well because the underlying searches sit close to lending, insurance, refinancing, and personal-finance decision-making.",
        `A better calculator page shows the monthly payment, total paid, and total interest together. Here the estimated total interest is ${formatCurrency(parsed.totalInterest)}, which is often the number users forget to compare.`,
      ]
      howItWorks = [
        "The calculator uses a standard amortization formula with monthly periods. Update principal, rate, or term in the widget and the canonical route updates to match.",
        "Because the computation happens entirely in the browser, there is no data submission step. The route stays quick, private, and easy to reuse while the user compares scenarios.",
      ]
      howToSteps = [
        { name: "Enter the principal", text: `The principal here is ${formatCurrency(parsed.principal)}.` },
        { name: "Set the annual rate", text: `This page uses an annual rate of ${parsed.annualRate}%.` },
        { name: "Choose the repayment term", text: `The route assumes a ${parsed.termYears}-year term.` },
        { name: "Compare payment and total cost", text: `The monthly payment is ${formatCurrency(parsed.monthlyPayment)}, while the total paid over time is ${formatCurrency(parsed.totalPaid)}.` },
      ]
      explanationBlocks = [
        {
          title: "Why a one-point rate change matters",
          paragraphs: [
            "When the borrowing amount is large, even a one-point rate move can change the payment meaningfully. That is why nearby comparison links are so useful for real borrowing research.",
            "This is also one reason finance calculators tend to have stronger RPM than generic utility pages: the user is much closer to a money decision.",
          ],
        },
        {
          title: "Monthly payment vs long-run cost",
          paragraphs: [
            "A payment can look manageable while the long-run interest burden still feels high. Good pages make that trade-off visible instead of hiding it behind one monthly number.",
            "That is why Plain Tools shows both the recurring payment and the total-interest framing on the same route.",
          ],
        },
        {
          title: "Why local computation still matters here",
          paragraphs: [
            "Financial estimate pages do not need uploaded data to be useful. Plain Tools keeps the logic local in the browser so the route stays private and easy to trust.",
            "That lightweight model also makes the page faster to revisit while comparing financing scenarios.",
          ],
        },
      ]
      privacyNote = [
        "This calculation runs locally in the browser. No financial documents are uploaded and no account is required.",
        "That privacy-first posture is deliberately simple: input values stay on-device and the result appears instantly on a canonical route you can revisit later.",
      ]
      faq = [
        { question: "How is the monthly payment calculated?", answer: "The page uses a standard amortized-payment formula based on principal, annual rate, and term converted into monthly periods." },
        { question: "Is this an exact lender quote?", answer: "No. It is a planning estimate. Taxes, insurance, fees, and lender-specific adjustments can change the real payment." },
        { question: "Why show total interest too?", answer: "Because many users compare monthly affordability first and only later realize the long-term borrowing cost matters just as much." },
        { question: "Can I compare nearby rate scenarios?", answer: "Yes. The related links open adjacent canonical routes so you can compare different financing assumptions quickly." },
        { question: "Does this calculator send my numbers anywhere?", answer: "No. The computation is local in the browser with no upload or account step." },
        { question: "What should I check after this?", answer: "Tax, salary, retirement, and related borrowing calculators are common next steps after a loan or mortgage estimate." },
      ]
      summaryRows = [
        { label: "Principal", value: formatCurrency(parsed.principal) },
        { label: "Annual rate", value: formatPercentValue(parsed.annualRate) },
        { label: "Term", value: `${parsed.termYears} years` },
        { label: "Monthly payment", value: formatCurrency(parsed.monthlyPayment) },
        { label: "Total interest", value: formatCurrency(parsed.totalInterest) },
        { label: "Total paid", value: formatCurrency(parsed.totalPaid) },
      ]
      initialValues = { principal: parsed.principal, annualRate: parsed.annualRate, termYears: parsed.termYears }
      break
    }
    case "compound-interest": {
      intro = [
        `Compound interest routes are strong because the user usually wants to understand whether a savings or investment scenario reaches a meaningful target. That puts the search much closer to financial planning intent than a generic calculator page.`,
        `In this example, ${formatCurrency(parsed.principal)} compounding at ${parsed.annualRate}% for ${parsed.years} years grows to roughly ${formatCurrency(parsed.futureValue)}. Plain Tools keeps that estimate local and easy to compare with adjacent scenarios.`,
      ]
      whyUsersNeedThis = [
        "Compound-growth pages work well because they turn a vague rate and timeline into a concrete future-value estimate. That is useful for both SEO and the actual user decision.",
        `The real question is often not just “what is the future value?” but “does the total growth of ${formatCurrency(parsed.totalGrowth)} materially change my plan?” That is why the page highlights both numbers.`,
      ]
      howItWorks = [
        "This route uses a monthly compounding assumption to estimate future value. Change principal, rate, or years in the embedded calculator and Plain Tools opens the matching canonical route.",
        "The computation stays local in the browser, which keeps the page fast, private, and reusable while comparing scenarios.",
      ]
      howToSteps = [
        { name: "Set the starting amount", text: `The principal in this scenario is ${formatCurrency(parsed.principal)}.` },
        { name: "Choose the annual return", text: `The annual return assumption is ${parsed.annualRate}%.` },
        { name: "Choose the horizon", text: `This route uses a ${parsed.years}-year timeframe.` },
        { name: "Compare growth with starting capital", text: `The projected future value is ${formatCurrency(parsed.futureValue)}, representing ${formatCurrency(parsed.totalGrowth)} above the starting amount.` },
      ]
      explanationBlocks = [
        {
          title: "Why time can matter as much as rate",
          paragraphs: [
            "Many searchers focus on the return percentage first, but compounding has more room to work when the timeline is long. That is why nearby scenario pages often matter as much as the first result.",
            "A useful calculator route helps users compare those timelines instead of treating one estimate as final truth.",
          ],
        },
        {
          title: "Why this estimate is directional",
          paragraphs: [
            "A compound-interest estimate assumes a smooth return path, while real savings products and markets move unevenly. The page is best used for planning scenarios, not guaranteed outcomes.",
            "Even so, the estimate is valuable because it converts abstract percentages into a number that users can act on.",
          ],
        },
        {
          title: "Why Plain Tools keeps the route lightweight",
          paragraphs: [
            "The page does not need uploaded statements or synced accounts to be useful. Plain Tools keeps the logic browser-only and canonical so the route stays simple to trust and easy to revisit.",
            "That approach fits the broader privacy-first product positioning without making the page feel sparse.",
          ],
        },
      ]
      privacyNote = [
        "This compound-interest calculation runs locally in the browser. No account, uploaded document, or external sync is required.",
        "The route is designed for fast planning scenarios with minimal data exposure.",
      ]
      faq = [
        { question: "How is compound interest calculated here?", answer: "This page uses a monthly compounding assumption based on the principal, annual rate, and number of years." },
        { question: "Is the result guaranteed?", answer: "No. It is a planning estimate, not a guaranteed investment or savings outcome." },
        { question: "Why show total growth separately?", answer: "Because users usually want to know how much of the future value comes from returns rather than the original principal." },
        { question: "Can I compare a different rate or duration?", answer: "Yes. Use the embedded calculator or the related links to open nearby canonical scenarios." },
        { question: "Does this page send financial data anywhere?", answer: "No. The calculation is local in the browser with no upload or account requirement." },
        { question: "What should I check next?", answer: "Retirement, salary, tax, and borrowing calculators are common follow-up routes after a compound-interest estimate." },
      ]
      summaryRows = [
        { label: "Starting principal", value: formatCurrency(parsed.principal) },
        { label: "Annual rate", value: formatPercentValue(parsed.annualRate) },
        { label: "Years", value: `${parsed.years}` },
        { label: "Future value", value: formatCurrency(parsed.futureValue) },
        { label: "Total growth", value: formatCurrency(parsed.totalGrowth) },
      ]
      initialValues = { principal: parsed.principal, annualRate: parsed.annualRate, years: parsed.years }
      break
    }
    case "retirement": {
      intro = [
        "Retirement calculators carry strong commercial intent because the searcher is usually comparing contribution plans, checking whether a target feels realistic, or deciding how aggressive a savings path needs to be.",
        `For this scenario, saving ${formatCurrency(parsed.monthlyContribution)} per month at ${parsed.annualRate}% for ${parsed.years} years produces an estimated future value of ${formatCurrency(parsed.futureValue)}. Plain Tools keeps that estimate local and transparent.`,
      ]
      whyUsersNeedThis = [
        "Retirement routes combine high-intent personal-finance traffic with strong advertiser demand. They also work well programmatically because users frequently search exact monthly-contribution and time-horizon combinations.",
        `This page shows both the projected final value and the fact that total contributions would be ${formatCurrency(parsed.totalContributions)}. That makes it easier to separate deposits from growth.`,
      ]
      howItWorks = [
        "The calculator uses a monthly contribution model with monthly compounding. Users can adjust contribution size, annual return, or years and open the matching canonical route instantly.",
        "Everything runs locally in the browser, so the route stays fast and private while still being shareable for later comparison.",
      ]
      howToSteps = [
        { name: "Set the monthly contribution", text: `This example uses ${formatCurrency(parsed.monthlyContribution)} per month.` },
        { name: "Choose an annual return", text: `The return assumption is ${parsed.annualRate}% annually.` },
        { name: "Choose the timeline", text: `The route uses a ${parsed.years}-year horizon.` },
        { name: "Compare deposits with projected value", text: `Total contributions would be ${formatCurrency(parsed.totalContributions)}, while the projected final value is ${formatCurrency(parsed.futureValue)}.` },
      ]
      explanationBlocks = [
        {
          title: "Why monthly-contribution pages work well",
          paragraphs: [
            "Users often plan retirement around what they can save monthly, not around a single lump sum. That makes contribution-based pages especially useful and especially searchable.",
            "It also makes them commercially strong because the traffic sits near investing, savings, and retirement-product ad categories.",
          ],
        },
        {
          title: "Why assumptions still matter",
          paragraphs: [
            "Small changes in the return assumption or the savings horizon can materially change the projected value over decades. A useful calculator page makes those comparisons easy.",
            "That is why the embedded widget and nearby scenario links matter as much as the first result itself.",
          ],
        },
        {
          title: "Why Plain Tools keeps the page browser-only",
          paragraphs: [
            "Retirement planning questions can feel sensitive even when they only involve rough numbers. Plain Tools keeps the estimate local so users can run a scenario without sharing extra data.",
            "That privacy-first approach fits the wider product positioning and makes the page easier to trust quickly.",
          ],
        },
      ]
      privacyNote = [
        "This retirement calculation runs locally in the browser. No account, uploaded document, or financial sync is required.",
        "The route is designed for quick planning estimates with minimal data exposure and a clean canonical URL.",
      ]
      faq = [
        { question: "How is retirement growth estimated here?", answer: "This page uses monthly contributions combined with a monthly compounding assumption based on the annual return input." },
        { question: "Does this include employer matching or taxes?", answer: "No. It is a simplified planning model, not a full retirement-plan simulator." },
        { question: "Why show total contributions separately?", answer: "Because users usually want to separate what they put in from what growth adds over time." },
        { question: "Can I test a different monthly contribution?", answer: "Yes. Use the embedded calculator or the related links to move into another canonical route." },
        { question: "Does this page send my numbers anywhere?", answer: "No. The computation stays local in the browser." },
        { question: "What should I check next?", answer: "Compound interest, salary, tax, mortgage, and loan pages are common follow-up routes after a retirement estimate." },
      ]
      summaryRows = [
        { label: "Monthly contribution", value: formatCurrency(parsed.monthlyContribution) },
        { label: "Annual rate", value: formatPercentValue(parsed.annualRate) },
        { label: "Years", value: `${parsed.years}` },
        { label: "Total contributions", value: formatCurrency(parsed.totalContributions) },
        { label: "Projected value", value: formatCurrency(parsed.futureValue) },
      ]
      initialValues = { monthlyContribution: parsed.monthlyContribution, annualRate: parsed.annualRate, years: parsed.years }
      break
    }
    case "tax-estimate": {
      intro = [
        "Tax estimate pages carry strong RPM potential because the searcher is usually planning around compensation, take-home pay, a move, or an offer comparison. The query is much closer to a financial decision than a generic calculator search.",
        `For this route, an estimated effective rate of ${formatPercentValue(parsed.effectiveRate * 100)} on ${formatCurrency(parsed.income)} leaves a rough after-tax amount of ${formatCurrency(parsed.keepAfterTax)} for a ${TAX_STATUS_LABELS[parsed.filingStatus].toLowerCase()} filer in ${TAX_STATE_LABELS[parsed.state]}.`,
      ]
      whyUsersNeedThis = [
        "Tax-estimate pages are commercially attractive because the search intent often sits near payroll, banking, accounting, tax software, and financial-planning ad demand.",
        "A useful page also needs to be honest about its scope. The route should be explicit that the number is a planning estimate, not legal or tax advice.",
      ]
      howItWorks = [
        "This route uses a simplified effective-rate model built from filing status and state context. It is designed for quick planning comparisons rather than detailed tax preparation.",
        "The estimate runs locally in the browser. Users can update income, filing status, or state and open the exact canonical route for the revised scenario without sending data anywhere.",
      ]
      howToSteps = [
        { name: "Enter annual income", text: `This example uses ${formatCurrency(parsed.income)} in annual income.` },
        { name: "Set filing status", text: `${TAX_STATUS_LABELS[parsed.filingStatus]} changes the effective-rate assumptions used on the page.` },
        { name: "Choose the state context", text: `${TAX_STATE_LABELS[parsed.state]} changes the state-tax portion of the estimate.` },
        { name: "Treat the output as directional", text: `The page estimates about ${formatCurrency(parsed.estimatedTax)} in taxes and ${formatCurrency(parsed.keepAfterTax)} after tax, but actual filings can differ.` },
      ]
      explanationBlocks = [
        {
          title: "Why simplified tax pages still matter",
          paragraphs: [
            "Many users do not need a full tax-prep workflow when they search. They need a rough after-tax number to compare offers, budget a move, or think through a raise.",
            "That narrower intent is exactly what makes this kind of page useful and monetizable.",
          ],
        },
        {
          title: "Why the estimate is directional",
          paragraphs: [
            "Real tax liability depends on deductions, credits, withholding choices, and filing specifics. A route like this should never pretend to replace a real return or a licensed advisor.",
            "What it can do well is turn a vague question into a fast, comparable estimate.",
          ],
        },
        {
          title: "Why Plain Tools keeps it lightweight",
          paragraphs: [
            "This estimate does not need uploaded forms, synced accounts, or personal identifiers to be useful. Plain Tools keeps the calculation local and uses only the values shown on the page.",
            "That makes the route quicker to use and easier to trust for first-pass planning.",
          ],
        },
      ]
      privacyNote = [
        "This tax estimate runs locally in the browser. No data is sent, no tax forms are uploaded, and there is no account step attached to the page.",
        "The route is designed for quick planning comparisons with minimal data exposure.",
      ]
      faq = [
        { question: "Is this a real tax filing result?", answer: "No. It is a simplified planning estimate based on income, filing status, and state context." },
        { question: "Why does state matter?", answer: "Different states create very different effective tax outcomes, which can materially change take-home pay." },
        { question: "Why use an effective-rate estimate here?", answer: "Because this route is designed for quick planning scenarios, not detailed tax preparation." },
        { question: "Can I compare another state or filing status?", answer: "Yes. Use the live calculator or related links to open the next canonical scenario." },
        { question: "Does this page send income data anywhere?", answer: "No. The calculation stays local in the browser." },
        { question: "What should I check next?", answer: "Salary-to-hourly, retirement, loan, and mortgage pages are common follow-up routes after a quick tax estimate." },
      ]
      summaryRows = [
        { label: "Income", value: formatCurrency(parsed.income) },
        { label: "Filing status", value: TAX_STATUS_LABELS[parsed.filingStatus] },
        { label: "State", value: TAX_STATE_LABELS[parsed.state] },
        { label: "Effective rate", value: formatPercentValue(parsed.effectiveRate * 100) },
        { label: "Estimated tax", value: formatCurrency(parsed.estimatedTax) },
        { label: "After-tax estimate", value: formatCurrency(parsed.keepAfterTax) },
      ]
      initialValues = { income: parsed.income, filingStatus: parsed.filingStatus, state: parsed.state }
      break
    }
    case "tip": {
      intro = [
        "Tip calculators can look lightweight, but they capture clear transactional intent and work well as exact long-tail utility pages when the user wants a fast answer plus a clean split calculation.",
        `For this route, a ${formatPercentValue(parsed.tipPercent)} tip on ${formatCurrency(parsed.bill)} adds ${formatCurrency(parsed.tipAmount)}, taking the total to ${formatCurrency(parsed.totalBill)}. Split ${parsed.split} ways, that is ${formatCurrency(parsed.totalPerPerson)} per person.`,
      ]
      whyUsersNeedThis = [
        "The real utility is not just the tip amount. It is the ability to translate a percentage into a final total and a per-person split quickly, which is what users usually care about in the moment.",
        "That makes these pages good programmatic utility routes: narrow intent, predictable formula, and useful nearby scenario links without needing extra personal data.",
      ]
      howItWorks = [
        "This page calculates the tip amount, the total bill after tip, and the split amount per person. The embedded calculator lets users adjust all three key values and open the exact canonical route for the new combination.",
        "The computation stays entirely local in the browser, so the route remains fast, private, and easy to use on mobile or desktop.",
      ]
      howToSteps = [
        { name: "Enter the bill amount", text: `This route uses a bill total of ${formatCurrency(parsed.bill)}.` },
        { name: "Choose the tip percentage", text: `The selected tip rate is ${parsed.tipPercent}%.` },
        { name: "Set the split count", text: `The final total is divided ${parsed.split} ways in this example.` },
        { name: "Read total and per-person cost", text: `The final split comes to ${formatCurrency(parsed.totalPerPerson)} per person.` },
      ]
      explanationBlocks = [
        {
          title: "Why tip pages still deserve full content",
          paragraphs: [
            "Many calculator pages become thin because they only output one number. Tip pages are more useful when they explain the total bill impact and the split calculation, which is usually the user's real concern.",
            "That extra context is also what keeps the route useful enough to index safely.",
          ],
        },
        {
          title: "Percentage and split together",
          paragraphs: [
            "A tip percentage means little if the user still needs to work out the final split on the spot. Combining both calculations on one route reduces friction and makes the page more practical.",
            "It also creates natural internal links into nearby percentage and salary routes for broader financial utility traffic.",
          ],
        },
        {
          title: "Why Plain Tools keeps the page browser-only",
          paragraphs: [
            "Tip calculators are often used on the phone in a live setting, so speed matters. Plain Tools keeps the page lightweight and browser-only so it opens quickly and does not demand any extra workflow.",
            "That same no-upload, no-account posture fits the broader site USP even on simpler calculator pages.",
          ],
        },
      ]
      privacyNote = [
        "This tip calculation runs locally in the browser. No restaurant data, payment info, or personal inputs are sent anywhere.",
        "The route is intentionally lightweight so the user gets the answer immediately with minimal friction.",
      ]
      faq = [
        { question: "How do you calculate the tip amount?", answer: "The tip amount is the bill multiplied by the selected tip percentage, divided by 100." },
        { question: "Does the page also split the total?", answer: "Yes. It calculates the final total after tip and divides it by the selected group size." },
        { question: "Can I compare 18%, 20%, and 25% quickly?", answer: "Yes. The related links and embedded calculator make nearby scenarios easy to open." },
        { question: "Is this calculator mobile-friendly?", answer: "Yes. It runs locally in the browser and is designed to work quickly on phones." },
        { question: "Does this page send my bill amount anywhere?", answer: "No. The computation stays on-device in the browser." },
        { question: "What should I check next?", answer: "Percentage, salary, and tax pages are common follow-up routes depending on what you are trying to compare." },
      ]
      summaryRows = [
        { label: "Bill amount", value: formatCurrency(parsed.bill) },
        { label: "Tip percentage", value: formatPercentValue(parsed.tipPercent) },
        { label: "Tip amount", value: formatCurrency(parsed.tipAmount) },
        { label: "Total bill", value: formatCurrency(parsed.totalBill) },
        { label: "Split count", value: `${parsed.split}` },
        { label: "Per person", value: formatCurrency(parsed.totalPerPerson) },
      ]
      initialValues = { bill: parsed.bill, tipPercent: parsed.tipPercent, split: parsed.split }
      break
    }
    case "salary-to-hourly": {
      intro = [
        "Salary-to-hourly pages capture valuable compensation intent because the searcher is often evaluating an offer, comparing contract work with full-time pay, or stress-testing a role change.",
        `For this route, ${formatCurrency(parsed.annualSalary)} per year at ${parsed.hoursPerWeek} hours per week over ${parsed.weeksPerYear} working weeks comes to about ${formatCurrency(parsed.hourlyRate)} per hour, with a monthly salary equivalent of ${formatCurrency(parsed.monthlySalary)}.`,
      ]
      whyUsersNeedThis = [
        "Users search salary-to-hourly pages when they need a fast compensation comparison, not a generic career article. That keeps the intent strong and often places the page near payroll, recruiting, and financial-service ad categories.",
        "A useful page should also explain the assumptions clearly. Weekly hours and working weeks matter, and changing either one can move the hourly estimate significantly.",
      ]
      howItWorks = [
        "This page converts annual salary into an hourly estimate based on hours per week and weeks worked per year. The embedded calculator lets users adjust all three and open the exact canonical route for the next scenario.",
        "The calculation stays local in the browser, so there is no data submission step and no need to create an account just to compare compensation scenarios.",
      ]
      howToSteps = [
        { name: "Enter annual salary", text: `The annual salary here is ${formatCurrency(parsed.annualSalary)}.` },
        { name: "Set hours per week", text: `This example assumes ${parsed.hoursPerWeek} working hours each week.` },
        { name: "Set working weeks", text: `The route assumes ${parsed.weeksPerYear} working weeks per year.` },
        { name: "Review hourly and monthly equivalents", text: `That combination produces about ${formatCurrency(parsed.hourlyRate)} hourly and ${formatCurrency(parsed.monthlySalary)} monthly.` },
      ]
      explanationBlocks = [
        {
          title: "Why this calculation matters for offer evaluation",
          paragraphs: [
            "Annual salary feels intuitive for offers, but hourly equivalence can make comparisons much clearer, especially when hours or unpaid time off differ between roles.",
            "That is why these pages perform well: they translate compensation into a format users can compare quickly.",
          ],
        },
        {
          title: "Where assumptions change the answer",
          paragraphs: [
            "A 35-hour workweek and a 40-hour workweek can produce meaningfully different hourly equivalents for the same annual salary. The same is true when the number of paid weeks changes.",
            "That is why the page links into adjacent scenarios rather than pretending one hourly output is universally correct.",
          ],
        },
        {
          title: "Why Plain Tools keeps it local",
          paragraphs: [
            "Compensation comparisons do not need a sync account, payroll import, or uploaded spreadsheet just to answer one scenario. Plain Tools keeps the calculation on-device and lightweight.",
            "That privacy-first simplicity makes the route faster to use and easier to trust for quick planning work.",
          ],
        },
      ]
      privacyNote = [
        "This salary conversion runs locally in the browser. No pay stubs, contracts, or HR documents are uploaded anywhere.",
        "The page is designed for fast private comparisons with a canonical route for each scenario.",
      ]
      faq = [
        { question: "How do you convert salary to hourly?", answer: "The page divides annual salary by the total hours worked in a year, based on hours per week and weeks worked." },
        { question: "Why do working weeks matter?", answer: "Because fewer paid weeks mean fewer total working hours, which changes the hourly equivalent for the same annual salary." },
        { question: "Is this exact take-home pay?", answer: "No. It is a gross pay conversion, not an after-tax estimate." },
        { question: "Can I compare another work schedule?", answer: "Yes. Use the embedded calculator or the related links to open another canonical route." },
        { question: "Does this page send salary data anywhere?", answer: "No. The calculation runs locally in the browser." },
        { question: "What should I check next?", answer: "Tax estimate, retirement, loan, and mortgage pages are common follow-up routes after a salary comparison." },
      ]
      summaryRows = [
        { label: "Annual salary", value: formatCurrency(parsed.annualSalary) },
        { label: "Hours per week", value: `${parsed.hoursPerWeek}` },
        { label: "Weeks per year", value: `${parsed.weeksPerYear}` },
        { label: "Hourly rate", value: formatCurrency(parsed.hourlyRate) },
        { label: "Monthly salary", value: formatCurrency(parsed.monthlySalary) },
      ]
      initialValues = { annualSalary: parsed.annualSalary, hoursPerWeek: parsed.hoursPerWeek, weeksPerYear: parsed.weeksPerYear }
      break
    }
  }

  explanationBlocks = [
    ...explanationBlocks,
    {
      title: "Why a dedicated long-tail route is useful",
      paragraphs: [
        `Searchers usually arrive with one exact scenario in mind rather than a broad finance topic. A focused ${CATEGORY_LABELS[entry.category].toLowerCase()} route works because it answers that narrow question immediately, then gives the user the next nearby scenarios through internal links instead of making them start over.`,
        "That combination of exact-match intent, a real live calculator, and a privacy-first explanation layer is what makes these pages safer to scale than thin calculator stubs. The route should stand on its own even before the user changes any inputs.",
      ],
    },
    {
      title: "Why Plain Tools keeps the calculation local",
      paragraphs: [
        "These calculations do not need uploaded spreadsheets, account creation, or a data sync step to be useful. Plain Tools keeps the inputs and outputs inside the browser so the page stays lightweight, fast, and easier to trust.",
        "That local-computation angle also differentiates the page from generic calculator farms. It gives the user a direct answer, a live adjustment tool, and a clear promise that the numbers stay on-device unless they choose to share them.",
      ],
    },
    {
      title: "How to compare the next scenario without losing context",
      paragraphs: [
        `Most users do not stop at one answer. After checking this ${CATEGORY_LABELS[entry.category].toLowerCase()} route, they usually want to test a nearby rate, amount, term, or workload assumption before making a real decision.`,
        "That is why each page includes nearby internal links and a live calculator block instead of treating the calculation as a dead-end result. The route works best when it helps the user move from one exact scenario to the next without going back to search.",
      ],
    },
  ]

  intro = [
    ...intro,
    `This page is part of a larger calculator cluster built around exact-match financial intent. Instead of pushing the user into a generic finance article, the route answers one precise question first and then links to the next plausible scenarios inside the same silo.`,
  ]

  whyUsersNeedThis = [
    ...whyUsersNeedThis,
    `A strong ${CATEGORY_LABELS[entry.category].toLowerCase()} page also needs enough context for the answer to be actionable. That means explaining the underlying assumptions, pointing out where the estimate can change, and showing the user how to test the next version of the same problem locally in the browser.`,
  ]

  howItWorks = [
    ...howItWorks,
    "Each calculator route is also a stable canonical URL. That matters because users often want to bookmark the exact scenario, share it with a teammate, or reopen it later without re-entering the same numbers from scratch.",
  ]

  privacyNote = [
    ...privacyNote,
    "That privacy-first setup is especially useful on work devices and shared machines where the user wants a quick answer without introducing another web service, another login, or another copied spreadsheet into the process.",
  ]

  faq = [
    ...faq,
    {
      question: "Can I bookmark or share this exact scenario?",
      answer:
        "Yes. Every calculator page uses a self-referencing canonical route so the exact scenario can be reopened, shared, and crawled consistently.",
    },
    {
      question: "Why does Plain Tools use a dedicated route for each scenario?",
      answer:
        "Because exact long-tail routes are easier to reopen, easier to compare, and more useful in search than a generic calculator page with no scenario context.",
    },
  ]

  const wordCount = countWords([
    entry.title,
    entry.desc,
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
    description: entry.desc,
    expression: parsed.expression,
    featureList: [
      `${CATEGORY_LABELS[entry.category]} calculator with canonical long-tail URL`,
      "Local browser computation with no data submission",
      "Internal links to related calculator, converter, and PDF workflows",
    ],
    heroBadges: ["financial calculator", "local computation", "no upload", "privacy-first"],
    h1: entry.category === "percentage" ? `What Is ${(parsed as Extract<ParsedCalculator, { category: "percentage" }>).percent}% of ${(parsed as Extract<ParsedCalculator, { category: "percentage" }>).base}?` : entry.title.replace(" | Plain Tools", ""),
    initialValues,
    keywords: entry.keywords,
    liveToolDescription: "Use the live calculator below to adjust inputs and open the exact canonical route for the next scenario. Computation stays local in the browser and no data is sent.",
    page: {
      canonicalPath,
      description: entry.desc,
      explanationBlocks,
      faq,
      howItWorks,
      howToSteps,
      intro,
      paramLabel: CATEGORY_LABELS[entry.category],
      paramSlug: parsed.expression,
      privacyNote,
      relatedTools: relatedTools(parsed),
      title: entry.title,
      tool: calculatorTool,
      whyUsersNeedThis,
      wordCount,
    },
    relatedLinks,
    siloLinks: [
      { href: "/pdf-tools", label: "PDF tools" },
      { href: "/file-converters", label: "File converters" },
      { href: "/compare/plain-tools-vs-smallpdf", label: "Privacy-first comparisons" },
      { href: relatedLinks[0]?.href ?? "/calculators/percentage/what-is-10-percent-of-100", label: relatedLinks[0]?.title ?? "Related calculator" },
    ],
    summaryRows,
    title: entry.title,
  }
}

export function getCalculatorPage(category: CalculatorCategory, expression: string): CalculatorPage | null {
  const parsed = parseCalculatorExpression(category, expression)
  if (!parsed) return null
  const entry = CALCULATOR_ENTRY_MAP.get(`${category}/${parsed.expression}`)
  if (!entry) return null
  return buildCalculatorPageData(entry, parsed)
}

export function getCalculatorPaths() {
  return CALCULATOR_TEMPLATES.map((entry) =>
    buildCalculatorPath(entry.category, entry.expression)
  )
}

export function generateCategoryCalculatorParams(category: CalculatorCategory, limit?: number) {
  const entries = CALCULATOR_TEMPLATES.filter((entry) => entry.category === category)
  const slice = typeof limit === "number" ? entries.slice(0, limit) : entries
  return slice.map((entry) => ({ category, expression: entry.expression }))
}

export function generateCalculatorParams(limit?: number) {
  const entries = typeof limit === "number" ? CALCULATOR_TEMPLATES.slice(0, limit) : CALCULATOR_TEMPLATES
  return entries.map((entry) => ({ category: entry.category, expression: entry.expression }))
}

export function generateNonPercentageCalculatorParams(limit?: number) {
  const entries = CALCULATOR_TEMPLATES.filter((entry) => entry.category !== "percentage")
  const slice = typeof limit === "number" ? entries.slice(0, limit) : entries
  return slice.map((entry) => ({ category: entry.category, expression: entry.expression }))
}

export function getPrebuildCalculatorParams(limit = 428) {
  const perCategory: Record<CalculatorCategory, number> = {
    "compound-interest": 32,
    loan: 48,
    mortgage: 36,
    percentage: 220,
    retirement: 24,
    "salary-to-hourly": 20,
    "tax-estimate": 24,
    tip: 24,
  }

  const staged = CATEGORY_PREBUILD_ORDER.flatMap((category) =>
    generateCategoryCalculatorParams(category, perCategory[category])
  )
  return staged.slice(0, limit)
}

export const CALCULATOR_TEMPLATE_METADATA_EXAMPLES = [
  getCalculatorPage("percentage", "what-is-15-percent-of-200"),
  getCalculatorPage("loan", "loan-payment-200000-5-30-years"),
  getCalculatorPage("mortgage", "mortgage-payment-350000-6-30-years"),
  getCalculatorPage("compound-interest", "compound-interest-10000-7-10"),
  getCalculatorPage("retirement", "retirement-500-monthly-7-30-years"),
  getCalculatorPage("tax-estimate", "tax-estimate-100000-single-california"),
  getCalculatorPage("tip", "tip-75-20-4-way-split"),
  getCalculatorPage("salary-to-hourly", "salary-90000-40-hours-52-weeks"),
]
  .filter((entry): entry is CalculatorPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

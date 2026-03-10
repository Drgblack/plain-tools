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
  | "tip-calculator"
  | "salary-to-hourly"
  | "basic-loan-payment"
  | "simple-interest"
  | "compound-interest-basic"
  | "retirement-savings-intro"
  | "tax-estimate-simple"
  | "credit-card-payoff"
  | "savings-goal"

export type LegacyCalculatorCategory =
  | "basic-loan"
  | "compound-basic"
  | "compound-interest-intro"
  | "retirement-basic"
  | "retirement-savings-basic"
  | "tip"

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
  category: "tip-calculator"
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
  category: "basic-loan-payment"
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
  category: "compound-interest-basic"
  compounding: "annual" | "monthly" | "quarterly"
  expression: string
  futureValue: number
  principal: number
  totalGrowth: number
  years: number
}

type ParsedRetirementBasic = {
  annualRate: number
  category: "retirement-savings-intro"
  expression: string
  futureValue: number
  monthlyContribution: number
  totalContributions: number
  years: number
}

type ParsedTaxEstimateSimple = {
  annualIncome: number
  category: "tax-estimate-simple"
  effectiveRate: number
  estimatedTax: number
  expression: string
  filingStatus: "head-of-household" | "married-joint" | "single" | "self-employed"
  takeHomeAfterTax: number
}

type ParsedCreditCardPayoff = {
  annualRate: number
  balance: number
  category: "credit-card-payoff"
  expression: string
  interestPaid: number
  monthlyPayment: number
  monthsToPayoff: number
  totalPaid: number
}

type ParsedSavingsGoal = {
  annualRate: number
  category: "savings-goal"
  expression: string
  monthlyContribution: number
  monthsToGoal: number
  targetAmount: number
  totalContributions: number
}

type ParsedCalculator =
  | ParsedBasicLoan
  | ParsedCompoundInterestIntro
  | ParsedCreditCardPayoff
  | ParsedPercentage
  | ParsedRetirementBasic
  | ParsedSalary
  | ParsedSavingsGoal
  | ParsedSimpleInterest
  | ParsedTaxEstimateSimple
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

export const CALCULATOR_CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  "basic-loan": "Basic Loan Payment Calculator",
  "basic-loan-payment": "Basic Loan Payment Calculator",
  "compound-basic": "Compound Interest Basic Calculator",
  "compound-interest-basic": "Compound Interest Basic Calculator",
  "compound-interest-intro": "Compound Interest Calculator",
  "credit-card-payoff": "Credit Card Payoff Calculator",
  percentage: "Percentage Calculator",
  "retirement-basic": "Retirement Savings Intro Calculator",
  "retirement-savings-intro": "Retirement Savings Intro Calculator",
  "retirement-savings-basic": "Retirement Savings Calculator",
  "savings-goal": "Savings Goal Calculator",
  "salary-to-hourly": "Salary to Hourly Calculator",
  "simple-interest": "Simple Interest Calculator",
  "tax-estimate-simple": "Simple Tax Estimate Calculator",
  tip: "Tip Calculator",
  "tip-calculator": "Tip Calculator",
}

export const CALCULATOR_PUBLIC_CATEGORY_ORDER: PublicCalculatorCategory[] = [
  "percentage",
  "tip-calculator",
  "salary-to-hourly",
  "basic-loan-payment",
  "simple-interest",
  "compound-interest-basic",
  "retirement-savings-intro",
  "tax-estimate-simple",
  "credit-card-payoff",
  "savings-goal",
]

const CATEGORY_LABELS = CALCULATOR_CATEGORY_LABELS
const PUBLIC_CATEGORY_ORDER = CALCULATOR_PUBLIC_CATEGORY_ORDER

const CATEGORY_ORDER: CalculatorCategory[] = [
  ...CALCULATOR_PUBLIC_CATEGORY_ORDER,
  "basic-loan",
  "compound-basic",
  "compound-interest-intro",
  "retirement-basic",
  "retirement-savings-basic",
  "tip",
]

const PUBLIC_CATEGORY_SET = new Set<PublicCalculatorCategory>(CALCULATOR_PUBLIC_CATEGORY_ORDER)

function range(start: number, end: number, step = 1) {
  const values: number[] = []
  for (let value = start; value <= end; value += step) {
    values.push(Number.parseFloat(value.toFixed(2)))
  }
  return values
}

function uniqueNumberSeries(values: number[]) {
  return Array.from(new Set(values)).sort((left, right) => left - right)
}

const PERCENT_VALUES = uniqueNumberSeries([
  ...range(1, 30),
  32,
  33,
  35,
  36,
  38,
  40,
  42,
  45,
  48,
  50,
  55,
  60,
  65,
  70,
  75,
  80,
  85,
  90,
  95,
  100,
  110,
  125,
  150,
  175,
  200,
  225,
  250,
  300,
  400,
  500,
])
const PERCENT_BASE_VALUES = uniqueNumberSeries([
  ...range(10, 100, 5),
  ...range(110, 500, 10),
  ...range(550, 2500, 50),
  ...range(2750, 10000, 250),
  12000,
  15000,
  20000,
])
const TIP_BILLS = uniqueNumberSeries([
  ...range(15, 150, 5),
  ...range(160, 500, 10),
  ...range(550, 1500, 50),
  1750,
  2000,
])
const TIP_PERCENTS = uniqueNumberSeries([10, 12, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40])
const SALARY_VALUES = uniqueNumberSeries([
  ...range(18000, 100000, 2000),
  ...range(105000, 200000, 5000),
  ...range(225000, 500000, 25000),
])
const SALARY_HOURS = uniqueNumberSeries([20, 24, 25, 30, 32, 35, 37.5, 40, 42, 45, 48, 50, 55, 60])
const LOAN_PRINCIPALS = uniqueNumberSeries([
  ...range(1000, 20000, 1000),
  ...range(25000, 100000, 5000),
  ...range(125000, 300000, 25000),
  350000,
  400000,
])
const LOAN_RATES = uniqueNumberSeries([
  0,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.25,
  4.5,
  4.75,
  5,
  5.5,
  6,
  6.5,
  7,
  7.5,
  8,
  8.5,
  9,
  10,
  12,
])
const LOAN_TERMS = uniqueNumberSeries([1, 2, 3, 4, 5, 6, 7, 10, 12, 15, 20, 25, 30])
const INTEREST_PRINCIPALS = uniqueNumberSeries([
  ...range(1000, 10000, 1000),
  ...range(12500, 50000, 2500),
  ...range(60000, 250000, 10000),
])
const INTEREST_RATES = uniqueNumberSeries([1, 2, 3, 4, 5, 6, 6.5, 7, 8, 9, 10, 12, 15, 18, 20])
const INTEREST_YEARS = uniqueNumberSeries([1, 2, 3, 4, 5, 7, 10, 12, 15, 20, 25, 30])
const COMPOUND_PRINCIPALS = uniqueNumberSeries([
  ...range(1000, 10000, 1000),
  ...range(15000, 60000, 5000),
  ...range(75000, 200000, 25000),
])
const COMPOUND_RATES = uniqueNumberSeries([2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 9, 10, 12])
const COMPOUND_YEARS = uniqueNumberSeries([1, 2, 3, 5, 7, 10, 12, 15, 20, 25, 30, 35])
const COMPOUNDING_PERIODS = ["monthly", "quarterly", "annual"] as const
const RETIREMENT_MONTHLY = uniqueNumberSeries([
  ...range(50, 500, 25),
  ...range(550, 2000, 50),
  ...range(2250, 5000, 250),
])
const RETIREMENT_RATES = uniqueNumberSeries([3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 9, 10, 12])
const RETIREMENT_YEARS = uniqueNumberSeries([5, 7, 10, 12, 15, 20, 25, 30, 35, 40, 45])
const TAX_INCOMES = uniqueNumberSeries([
  ...range(15000, 100000, 2500),
  ...range(105000, 250000, 5000),
  ...range(275000, 500000, 25000),
])
const TAX_FILING_STATUSES = ["single", "married-joint", "head-of-household", "self-employed"] as const
const CREDIT_CARD_BALANCES = uniqueNumberSeries([
  ...range(1000, 10000, 500),
  ...range(11000, 25000, 1000),
  ...range(27500, 60000, 2500),
])
const CREDIT_CARD_APRS = uniqueNumberSeries([0, 9, 12, 15, 16, 18, 19.9, 21, 22, 24, 25, 27, 29])
const CREDIT_CARD_PAYMENTS = uniqueNumberSeries([50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 650, 750, 900, 1000, 1250, 1500])
const SAVINGS_GOAL_TARGETS = uniqueNumberSeries([
  ...range(1000, 10000, 1000),
  ...range(15000, 60000, 5000),
  ...range(75000, 200000, 25000),
])
const SAVINGS_GOAL_MONTHLY = uniqueNumberSeries([
  ...range(50, 500, 50),
  ...range(600, 2000, 200),
])
const SAVINGS_GOAL_RATES = uniqueNumberSeries([0, 1, 2, 3, 4, 4.5, 5, 6, 7, 8, 10])

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

function futureValueCompoundWithFrequency(
  principal: number,
  annualRate: number,
  years: number,
  compounding: "annual" | "monthly" | "quarterly"
) {
  const periodsPerYear =
    compounding === "annual" ? 1 : compounding === "quarterly" ? 4 : 12
  const periodicRate = annualRate / 100 / periodsPerYear
  return principal * (1 + periodicRate) ** (years * periodsPerYear)
}

function futureValueRetirement(monthlyContribution: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  if (monthlyRate === 0) return monthlyContribution * months
  return monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate)
}

function monthsToSavingsGoal(
  targetAmount: number,
  monthlyContribution: number,
  annualRate: number
) {
  if (monthlyContribution <= 0) return Infinity
  const monthlyRate = annualRate / 100 / 12
  let balance = 0
  let months = 0
  while (balance < targetAmount && months < 1200) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
    months += 1
  }
  return months
}

function monthsToDebtPayoff(balance: number, annualRate: number, monthlyPayment: number) {
  const monthlyRate = annualRate / 100 / 12
  let remaining = balance
  let months = 0
  let totalPaid = 0
  while (remaining > 0.01 && months < 1200) {
    const interest = remaining * monthlyRate
    const principalPaid = monthlyPayment - interest
    if (principalPaid <= 0) {
      return { interestPaid: Infinity, monthsToPayoff: Infinity, totalPaid: Infinity }
    }
    remaining = Math.max(0, remaining - principalPaid)
    totalPaid += monthlyPayment
    months += 1
  }

  return {
    interestPaid: totalPaid - balance,
    monthsToPayoff: months,
    totalPaid,
  }
}

function effectiveTaxRateFor(
  filingStatus: "head-of-household" | "married-joint" | "single" | "self-employed",
  annualIncome: number
) {
  const brackets =
    filingStatus === "married-joint"
      ? [
          { threshold: 25000, rate: 8 },
          { threshold: 50000, rate: 10 },
          { threshold: 90000, rate: 12 },
          { threshold: 150000, rate: 16 },
          { threshold: 250000, rate: 20 },
          { threshold: Number.POSITIVE_INFINITY, rate: 24 },
        ]
      : filingStatus === "head-of-household"
        ? [
            { threshold: 22000, rate: 8 },
            { threshold: 45000, rate: 10 },
            { threshold: 85000, rate: 13 },
            { threshold: 140000, rate: 17 },
            { threshold: 220000, rate: 21 },
            { threshold: Number.POSITIVE_INFINITY, rate: 25 },
          ]
        : filingStatus === "self-employed"
          ? [
              { threshold: 20000, rate: 12 },
              { threshold: 45000, rate: 15 },
              { threshold: 85000, rate: 19 },
              { threshold: 140000, rate: 23 },
              { threshold: 220000, rate: 27 },
              { threshold: Number.POSITIVE_INFINITY, rate: 31 },
            ]
          : [
              { threshold: 20000, rate: 9 },
              { threshold: 40000, rate: 11 },
              { threshold: 85000, rate: 14 },
              { threshold: 140000, rate: 18 },
              { threshold: 220000, rate: 22 },
              { threshold: Number.POSITIVE_INFINITY, rate: 26 },
            ]

  return brackets.find((entry) => annualIncome <= entry.threshold)?.rate ?? 0
}

function normalizeCalculatorCategory(category: CalculatorCategory): PublicCalculatorCategory {
  switch (category) {
    case "tip":
      return "tip-calculator"
    case "basic-loan":
      return "basic-loan-payment"
    case "compound-basic":
    case "compound-interest-intro":
      return "compound-interest-basic"
    case "retirement-basic":
    case "retirement-savings-basic":
      return "retirement-savings-intro"
    default:
      return category
  }
}

function parseNumberToken(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function percentageExpressionFor(percent: number, base: number) {
  return `what-is-${percent}-percent-of-${base}`
}

function tipExpressionFor(bill: number, tipPercent: number) {
  return `tip-calculator-${bill}-${tipPercent}-percent`
}

function salaryExpressionFor(annualSalary: number, hoursPerWeek: number) {
  return `salary-to-hourly-${annualSalary}-${hoursPerWeek}-hours`
}

function basicLoanExpressionFor(principal: number, annualRate: number, termYears: number) {
  return `loan-payment-${principal}-${annualRate}-${termYears}-years`
}

function simpleInterestExpressionFor(principal: number, annualRate: number, years: number) {
  return `simple-interest-${principal}-${annualRate}-${years}`
}

function compoundExpressionFor(
  principal: number,
  annualRate: number,
  years: number,
  compounding: "annual" | "monthly" | "quarterly"
) {
  return `compound-interest-${principal}-${annualRate}-${years}-years-${compounding}`
}

function retirementExpressionFor(
  monthlyContribution: number,
  annualRate: number,
  years: number
) {
  return `retirement-savings-${monthlyContribution}-monthly-${annualRate}-${years}-years`
}

function taxEstimateExpressionFor(
  annualIncome: number,
  filingStatus: "head-of-household" | "married-joint" | "single" | "self-employed"
) {
  return `tax-estimate-${annualIncome}-${filingStatus}`
}

function creditCardPayoffExpressionFor(
  balance: number,
  annualRate: number,
  monthlyPayment: number
) {
  return `credit-card-payoff-${balance}-${annualRate}-${monthlyPayment}-monthly`
}

function savingsGoalExpressionFor(
  targetAmount: number,
  monthlyContribution: number,
  annualRate: number
) {
  return `savings-goal-${targetAmount}-target-${monthlyContribution}-monthly-${annualRate}-rate`
}

export function isCalculatorCategory(value: string): value is CalculatorCategory {
  return CATEGORY_ORDER.includes(value as CalculatorCategory)
}

export function buildCalculatorPath(category: CalculatorCategory, expression: string) {
  return `/calculators/${normalizeCalculatorCategory(category)}/${expression}`
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
    case "tip":
    case "tip-calculator": {
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
    case "basic-loan":
    case "basic-loan-payment": {
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
    case "compound-basic":
    case "compound-interest-intro":
    case "compound-interest-basic": {
      const principal = readNumber("principal")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      const compoundingRaw = String(rawValues.compounding ?? "monthly").toLowerCase()
      const compounding =
        compoundingRaw === "annual" || compoundingRaw === "quarterly"
          ? compoundingRaw
          : "monthly"
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
      return compoundExpressionFor(principal, annualRate, years, compounding)
    }
    case "retirement-basic":
    case "retirement-savings-basic":
    case "retirement-savings-intro": {
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
    case "tax-estimate-simple": {
      const annualIncome = readNumber("annualIncome")
      const filingStatus = String(rawValues.filingStatus ?? "").toLowerCase() as
        | "head-of-household"
        | "married-joint"
        | "single"
        | "self-employed"
      if (
        annualIncome === null ||
        annualIncome < 0 ||
        !TAX_FILING_STATUSES.includes(filingStatus)
      ) {
        return null
      }
      return taxEstimateExpressionFor(annualIncome, filingStatus)
    }
    case "credit-card-payoff": {
      const balance = readNumber("balance")
      const annualRate = readNumber("annualRate")
      const monthlyPayment = readNumber("monthlyPayment")
      if (
        balance === null ||
        annualRate === null ||
        monthlyPayment === null ||
        balance <= 0 ||
        annualRate < 0 ||
        monthlyPayment <= 0
      ) {
        return null
      }
      return creditCardPayoffExpressionFor(balance, annualRate, monthlyPayment)
    }
    case "savings-goal": {
      const targetAmount = readNumber("targetAmount")
      const monthlyContribution = readNumber("monthlyContribution")
      const annualRate = readNumber("annualRate")
      if (
        targetAmount === null ||
        monthlyContribution === null ||
        annualRate === null ||
        targetAmount <= 0 ||
        monthlyContribution <= 0 ||
        annualRate < 0
      ) {
        return null
      }
      return savingsGoalExpressionFor(targetAmount, monthlyContribution, annualRate)
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

  if (category === "tip" || category === "tip-calculator") {
    const match =
      /^tip-calculator-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)-percent$/.exec(
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
      category: "tip-calculator",
      expression: tipExpressionFor(bill, tipPercent),
      split,
      tipAmount,
      tipPercent,
      totalBill,
      totalPerPerson: totalBill / split,
    }
  }

  if (category === "salary-to-hourly") {
    const match =
      /^salary-to-hourly-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)-hours$/.exec(
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

  if (category === "basic-loan" || category === "basic-loan-payment") {
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
      category: "basic-loan-payment",
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

  if (
    category === "compound-basic" ||
    category === "compound-interest-intro" ||
    category === "compound-interest-basic"
  ) {
    const match =
      /^compound-interest-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years-(monthly|quarterly|annual)$/.exec(
        decoded
      )
    if (!match) return null
    const principal = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termYears = parseNumberToken(match[3] ?? "")
    const compounding = (match[4] ?? "monthly") as "annual" | "monthly" | "quarterly"
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
    const futureValue = futureValueCompoundWithFrequency(
      principal,
      annualRate,
      termYears,
      compounding
    )
    return {
      annualRate,
      category: "compound-interest-basic",
      compounding,
      expression: compoundExpressionFor(principal, annualRate, termYears, compounding),
      futureValue,
      principal,
      totalGrowth: futureValue - principal,
      years: termYears,
    }
  }

  if (
    category === "retirement-basic" ||
    category === "retirement-savings-basic" ||
    category === "retirement-savings-intro"
  ) {
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
      category: "retirement-savings-intro",
      expression: retirementExpressionFor(monthlyContribution, annualRate, years),
      futureValue,
      monthlyContribution,
      totalContributions: monthlyContribution * years * 12,
      years,
    }
  }

  if (category === "tax-estimate-simple") {
    const match =
      /^tax-estimate-([0-9]+(?:\.[0-9]+)*)-(single|married-joint|head-of-household|self-employed)$/.exec(
        decoded
      )
    if (!match) return null
    const annualIncome = parseNumberToken(match[1] ?? "")
    const filingStatus = (match[2] ?? "single") as
      | "head-of-household"
      | "married-joint"
      | "single"
      | "self-employed"
    if (annualIncome === null || annualIncome < 0) return null
    const effectiveRate = effectiveTaxRateFor(filingStatus, annualIncome)
    const estimatedTax = (annualIncome * effectiveRate) / 100
    return {
      annualIncome,
      category,
      effectiveRate,
      estimatedTax,
      expression: taxEstimateExpressionFor(annualIncome, filingStatus),
      filingStatus,
      takeHomeAfterTax: annualIncome - estimatedTax,
    }
  }

  if (category === "credit-card-payoff") {
    const match =
      /^credit-card-payoff-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)-([0-9]+(?:\.[0-9]+)*)-monthly$/.exec(
        decoded
      )
    if (!match) return null
    const balance = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const monthlyPayment = parseNumberToken(match[3] ?? "")
    if (
      balance === null ||
      annualRate === null ||
      monthlyPayment === null ||
      balance <= 0 ||
      annualRate < 0 ||
      monthlyPayment <= 0
    ) {
      return null
    }
    const projection = monthsToDebtPayoff(balance, annualRate, monthlyPayment)
    if (!Number.isFinite(projection.monthsToPayoff)) return null
    return {
      annualRate,
      balance,
      category,
      expression: creditCardPayoffExpressionFor(balance, annualRate, monthlyPayment),
      interestPaid: projection.interestPaid,
      monthlyPayment,
      monthsToPayoff: projection.monthsToPayoff,
      totalPaid: projection.totalPaid,
    }
  }

  if (category === "savings-goal") {
    const match =
      /^savings-goal-([0-9]+(?:\.[0-9]+)*)-target-([0-9]+(?:\.[0-9]+)*)-monthly-([0-9]+(?:\.[0-9]+)*)-rate$/.exec(
        decoded
      )
    if (!match) return null
    const targetAmount = parseNumberToken(match[1] ?? "")
    const monthlyContribution = parseNumberToken(match[2] ?? "")
    const annualRate = parseNumberToken(match[3] ?? "")
    if (
      targetAmount === null ||
      monthlyContribution === null ||
      annualRate === null ||
      targetAmount <= 0 ||
      monthlyContribution <= 0 ||
      annualRate < 0
    ) {
      return null
    }
    const monthsToGoal = monthsToSavingsGoal(targetAmount, monthlyContribution, annualRate)
    if (!Number.isFinite(monthsToGoal)) return null
    return {
      annualRate,
      category,
      expression: savingsGoalExpressionFor(targetAmount, monthlyContribution, annualRate),
      monthlyContribution,
      monthsToGoal,
      targetAmount,
      totalContributions: monthlyContribution * monthsToGoal,
    }
  }

  return null
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
      category: "tip-calculator" as const,
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
        category: "basic-loan-payment" as const,
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
      COMPOUND_YEARS.flatMap((years) =>
        COMPOUNDING_PERIODS.map((compounding) => ({
          category: "compound-interest-basic" as const,
          description: buildMetaDescription(
            `Project compound interest on ${formatCurrency(principal)} at ${annualRate}% over ${years} years with ${compounding} compounding in a local browser calculator on Plain Tools.`
          ),
          expression: compoundExpressionFor(principal, annualRate, years, compounding),
          keywords: [
            `compound interest ${principal} ${annualRate} ${years} ${compounding}`,
            "compound interest calculator",
            "compound growth calculator",
            "intro compound interest calculator",
          ],
          title: `Compound Interest on ${formatCurrency(principal)} at ${annualRate}% for ${years} Years (${compounding}) | Plain Tools`,
        }))
      )
    )
  )
}

function retirementEntries(): CalculatorEntry[] {
  return RETIREMENT_MONTHLY.flatMap((monthlyContribution) =>
    RETIREMENT_RATES.flatMap((annualRate) =>
      RETIREMENT_YEARS.map((years) => ({
        category: "retirement-savings-intro" as const,
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

function taxEstimateEntries(): CalculatorEntry[] {
  return TAX_INCOMES.flatMap((annualIncome) =>
    TAX_FILING_STATUSES.map((filingStatus) => ({
      category: "tax-estimate-simple" as const,
      description: buildMetaDescription(
        `Estimate simple take-home pay on ${formatCurrency(annualIncome)} for ${filingStatus.replace(/-/g, " ")} filers with a browser-first tax estimate calculator on Plain Tools.`
      ),
      expression: taxEstimateExpressionFor(annualIncome, filingStatus),
      keywords: [
        `tax estimate ${annualIncome} ${filingStatus}`,
        "simple tax estimate calculator",
        "take home pay estimate",
        "basic tax calculator",
      ],
      title: `Tax Estimate for ${formatCurrency(annualIncome)} (${filingStatus.replace(/-/g, " ")}) | Plain Tools`,
    }))
  )
}

function creditCardPayoffEntries(): CalculatorEntry[] {
  return CREDIT_CARD_BALANCES.flatMap((balance) =>
    CREDIT_CARD_APRS.flatMap((annualRate) =>
      CREDIT_CARD_PAYMENTS.map((monthlyPayment) => ({
        category: "credit-card-payoff" as const,
        description: buildMetaDescription(
          `Estimate how long it could take to pay off ${formatCurrency(balance)} in credit card debt at ${annualRate}% with ${formatCurrency(monthlyPayment)} monthly payments using a local browser calculator on Plain Tools.`
        ),
        expression: creditCardPayoffExpressionFor(balance, annualRate, monthlyPayment),
        keywords: [
          `credit card payoff ${balance} ${annualRate} ${monthlyPayment}`,
          "credit card payoff calculator",
          "debt payoff estimate",
          "monthly debt payoff timeline",
        ],
        title: `Credit Card Payoff for ${formatCurrency(balance)} at ${annualRate}% with ${formatCurrency(monthlyPayment)}/Month | Plain Tools`,
      }))
    )
  )
}

function savingsGoalEntries(): CalculatorEntry[] {
  return SAVINGS_GOAL_TARGETS.flatMap((targetAmount) =>
    SAVINGS_GOAL_MONTHLY.flatMap((monthlyContribution) =>
      SAVINGS_GOAL_RATES.map((annualRate) => ({
        category: "savings-goal" as const,
        description: buildMetaDescription(
          `Estimate how long it could take to reach ${formatCurrency(targetAmount)} by saving ${formatCurrency(monthlyContribution)} per month at ${annualRate}% using a local browser calculator on Plain Tools.`
        ),
        expression: savingsGoalExpressionFor(targetAmount, monthlyContribution, annualRate),
        keywords: [
          `savings goal ${targetAmount} ${monthlyContribution} ${annualRate}`,
          "savings goal calculator",
          "how long to save calculator",
          "monthly savings target",
        ],
        title: `Reach ${formatCurrency(targetAmount)} by Saving ${formatCurrency(monthlyContribution)}/Month at ${annualRate}% | Plain Tools`,
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
  ...taxEstimateEntries(),
  ...creditCardPayoffEntries(),
  ...savingsGoalEntries(),
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
        { href: buildCalculatorPath("tip-calculator", tipExpressionFor(Math.max(20, parsed.base), 18)), title: "Tip calculator example" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(60000, 40)), title: "Salary to hourly example" },
      ]
    case "tip-calculator":
      return [
        { href: buildCalculatorPath("tip-calculator", tipExpressionFor(parsed.bill, 15)), title: `${formatCurrency(parsed.bill)} at 15% tip` },
        { href: buildCalculatorPath("tip-calculator", tipExpressionFor(parsed.bill, 20)), title: `${formatCurrency(parsed.bill)} at 20% tip` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(parsed.tipPercent, parsed.bill)), title: "Percentage breakdown of the bill" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(50000, 40)), title: "Salary to hourly example" },
      ]
    case "salary-to-hourly":
      return [
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 35)), title: `${formatCurrency(parsed.annualSalary)} at 35 hours/week` },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 40)), title: `${formatCurrency(parsed.annualSalary)} at 40 hours/week` },
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(10000, 5, 3)), title: "Basic loan payment example" },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(10000, 4, 3)), title: "Simple interest example" },
      ]
    case "basic-loan-payment":
      return [
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.termYears)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.termYears)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate, parsed.termYears)), title: "Compare with simple interest" },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(300, Math.max(1, parsed.annualRate), Math.max(10, parsed.termYears * 2))), title: "Basic retirement savings example" },
      ]
    case "simple-interest":
      return [
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(parsed.principal, parsed.annualRate, Math.max(1, parsed.years))), title: "Basic loan payment example" },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(250, Math.max(2, parsed.annualRate), Math.max(10, parsed.years * 4))), title: "Basic retirement savings example" },
      ]
    case "compound-interest-basic":
      return [
        { href: buildCalculatorPath("compound-interest-basic", compoundExpressionFor(parsed.principal, Math.max(1, parsed.annualRate - 1), parsed.years, parsed.compounding)), title: `${formatCurrency(parsed.principal)} at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("compound-interest-basic", compoundExpressionFor(parsed.principal, parsed.annualRate + 1, parsed.years, parsed.compounding)), title: `${formatCurrency(parsed.principal)} at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.principal, parsed.annualRate, parsed.years)), title: "Simple interest comparison" },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(500, parsed.annualRate, Math.max(10, parsed.years))), title: "Retirement savings example" },
      ]
    case "retirement-savings-intro":
      return [
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(parsed.monthlyContribution, Math.max(1, parsed.annualRate - 1), parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${Math.max(1, parsed.annualRate - 1)}%` },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(parsed.monthlyContribution, parsed.annualRate + 1, parsed.years)), title: `${formatCurrency(parsed.monthlyContribution)}/month at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(10000, Math.max(1, parsed.annualRate - 1), Math.max(1, Math.round(parsed.years / 5)))), title: "Simple interest example" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(90000, 40)), title: "Salary to hourly example" },
      ]
    case "tax-estimate-simple":
      return [
        { href: buildCalculatorPath("tax-estimate-simple", taxEstimateExpressionFor(Math.max(15000, parsed.annualIncome - 10000), parsed.filingStatus)), title: `Tax estimate on ${formatCurrency(Math.max(15000, parsed.annualIncome - 10000))}` },
        { href: buildCalculatorPath("tax-estimate-simple", taxEstimateExpressionFor(parsed.annualIncome + 10000, parsed.filingStatus)), title: `Tax estimate on ${formatCurrency(parsed.annualIncome + 10000)}` },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualIncome, 40)), title: "Gross salary comparison" },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(parsed.effectiveRate, parsed.annualIncome)), title: "Percentage of income example" },
      ]
    case "credit-card-payoff":
      return [
        { href: buildCalculatorPath("credit-card-payoff", creditCardPayoffExpressionFor(parsed.balance, Math.max(1, parsed.annualRate - 2), parsed.monthlyPayment)), title: `${formatCurrency(parsed.balance)} at ${Math.max(1, parsed.annualRate - 2)}%` },
        { href: buildCalculatorPath("credit-card-payoff", creditCardPayoffExpressionFor(parsed.balance, parsed.annualRate, parsed.monthlyPayment + 50)), title: `${formatCurrency(parsed.balance)} with ${formatCurrency(parsed.monthlyPayment + 50)}/month` },
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(parsed.balance, Math.max(1, parsed.annualRate - 5), 3)), title: "Compare with a basic loan payment" },
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.balance, parsed.monthlyPayment, 4)), title: "Savings goal comparison" },
      ]
    case "savings-goal":
      return [
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.targetAmount, Math.max(25, parsed.monthlyContribution - 50), parsed.annualRate)), title: `${formatCurrency(parsed.targetAmount)} with ${formatCurrency(Math.max(25, parsed.monthlyContribution - 50))}/month` },
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.targetAmount, parsed.monthlyContribution + 50, parsed.annualRate)), title: `${formatCurrency(parsed.targetAmount)} with ${formatCurrency(parsed.monthlyContribution + 50)}/month` },
        { href: buildCalculatorPath("compound-interest-basic", compoundExpressionFor(parsed.targetAmount / 2, Math.max(1, parsed.annualRate), Math.max(5, Math.round(parsed.monthsToGoal / 12)), "monthly")), title: "Compound growth comparison" },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(parsed.monthlyContribution, Math.max(2, parsed.annualRate), 10)), title: "Retirement savings example" },
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
    case "tip-calculator": {
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
      h1 = `Tip on ${formatCurrency(parsed.bill)} at ${parsed.tipPercent}%`
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

  if (parsed.category === "basic-loan-payment") {
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
    h1 = `Loan Payment for ${formatCurrency(parsed.principal)} at ${parsed.annualRate}% for ${parsed.termYears} Years`
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

  if (parsed.category === "compound-interest-basic") {
    const scenarioText = `${formatCurrency(parsed.principal)} at ${formatPercent(parsed.annualRate)} for ${parsed.years} years with ${parsed.compounding} compounding`
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
      `The calculator compounds the starting amount using ${parsed.compounding} compounding with the annual rate entered on the page. It is a practical intro model, not an advanced planning tool with taxes, fees, or asset allocation assumptions.`,
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
      { label: "Compounding", value: parsed.compounding },
      { label: "Projected value", value: formatCurrency(parsed.futureValue) },
      { label: "Total growth", value: formatCurrency(parsed.totalGrowth) },
    ]
    initialValues = { annualRate: parsed.annualRate, compounding: parsed.compounding, principal: parsed.principal, years: parsed.years }
    h1 = `Compound Interest on ${formatCurrency(parsed.principal)} at ${parsed.annualRate}% for ${parsed.years} Years (${parsed.compounding})`
  }

  if (parsed.category === "retirement-savings-intro") {
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
    h1 = `Retirement Savings for ${formatCurrency(parsed.monthlyContribution)}/Month at ${parsed.annualRate}% for ${parsed.years} Years`
  }

  if (parsed.category === "tax-estimate-simple") {
    const scenarioText = `${formatCurrency(parsed.annualIncome)} for ${parsed.filingStatus.replace(/-/g, " ")} filers`
    intro = [
      "Simple tax-estimate routes work because many users want a quick directional answer before they open payroll software or a deeper tax-planning workflow. The goal here is not to replace filing advice, but to give a fast gross-to-net check on a specific income scenario.",
      `For ${scenarioText}, this page uses an estimated effective rate of ${formatPercent(parsed.effectiveRate)}. That implies about ${formatCurrency(parsed.estimatedTax)} in estimated tax and roughly ${formatCurrency(parsed.takeHomeAfterTax)} left after tax.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This kind of route is useful because users often search one exact pay or income level. They want a directional tax estimate, a visible filing-status assumption, and a quick way to compare a nearby salary number without opening a complex planner.",
      "Keeping the model simple also makes the page safer for programmatic scale. It serves high-intent searchers without promising jurisdiction-specific tax preparation or individualized advice.",
    ]
    howItWorks = [
      "The page applies a simplified effective-rate model based on filing status and income band. That makes it useful for first-pass comparisons while staying well short of advanced tax planning.",
      "All calculations stay local in the browser, so the user can test income scenarios privately without sending pay data to a remote service.",
    ]
    howToSteps = [
      { name: "Set annual income", text: `This route uses ${formatCurrency(parsed.annualIncome)}.` },
      { name: "Confirm filing status", text: `The current filing status is ${parsed.filingStatus.replace(/-/g, " ")}.` },
      { name: "Review the estimated rate", text: `The simple effective rate used here is ${formatPercent(parsed.effectiveRate)}.` },
      { name: "Compare tax and take-home", text: `Estimated tax is ${formatCurrency(parsed.estimatedTax)} and estimated after-tax income is ${formatCurrency(parsed.takeHomeAfterTax)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why a simple tax estimate still has value",
      [
        "A simple tax estimate route is useful when it makes the assumptions visible. The user can see the income, the filing-status lens, and the rough effective rate instead of treating the output as unexplained magic.",
        "That transparency matters for SEO quality too. The page is not pretending to replace tax software. It is a quick browser-first estimate that helps users compare nearby scenarios before they go deeper.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when you are comparing pay scenarios on a personal device, a shared office machine, or a quick mobile session.",
      "Plain Tools keeps the page private and lightweight by avoiding accounts, uploads, or server-side finance workflows.",
    ]
    faq = [
      { question: `How much tax might apply to ${formatCurrency(parsed.annualIncome)}?`, answer: `This simplified estimate uses an effective rate of ${formatPercent(parsed.effectiveRate)}, which suggests about ${formatCurrency(parsed.estimatedTax)} in tax.` },
      { question: "Is this a filing calculator?", answer: "No. It is a first-pass estimate designed for quick comparisons, not tax preparation." },
      { question: "Why is filing status included?", answer: "Because even a simple estimate becomes more useful when the page shows which household situation the rate assumption is based on." },
      { question: "Can I compare another income quickly?", answer: "Yes. The related links and embedded calculator make it easy to open nearby salary ranges." },
      { question: "Does this page send salary details anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "Salary-to-hourly, percentage, and savings-goal routes are common next steps after a quick tax estimate." },
    ]
    summaryRows = [
      { label: "Annual income", value: formatCurrency(parsed.annualIncome) },
      { label: "Filing status", value: parsed.filingStatus.replace(/-/g, " ") },
      { label: "Effective rate", value: formatPercent(parsed.effectiveRate) },
      { label: "Estimated tax", value: formatCurrency(parsed.estimatedTax) },
      { label: "After-tax income", value: formatCurrency(parsed.takeHomeAfterTax) },
    ]
    initialValues = { annualIncome: parsed.annualIncome, filingStatus: parsed.filingStatus }
    h1 = `Tax Estimate for ${formatCurrency(parsed.annualIncome)} (${parsed.filingStatus.replace(/-/g, " ")})`
  }

  if (parsed.category === "credit-card-payoff") {
    const scenarioText = `${formatCurrency(parsed.balance)} at ${formatPercent(parsed.annualRate)} with ${formatCurrency(parsed.monthlyPayment)} monthly payments`
    intro = [
      "Credit-card payoff routes capture high-intent utility demand because users want to know whether their current payment will realistically move the balance or simply drag the debt out for too long. This page gives a fast first-pass timeline on one exact scenario.",
      `For ${scenarioText}, the estimated payoff timeline is about ${formatNumber(parsed.monthsToPayoff)} months. Total paid is roughly ${formatCurrency(parsed.totalPaid)}, of which about ${formatCurrency(parsed.interestPaid)} is interest.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This route works because it makes the trade-off visible: monthly payment versus timeline versus interest cost. Users often know their balance and payment but not the time cost of carrying the debt.",
      "It also supports stronger RPM than generic math tools because the search intent sits closer to real debt-management decisions.",
    ]
    howItWorks = [
      "The calculator applies a simple monthly interest-and-payment loop until the balance reaches zero. It is intentionally straightforward and is meant for first-pass payoff comparisons, not multi-debt optimization.",
      "Everything runs locally in the browser, which keeps the workflow private and fast for sensitive debt scenarios.",
    ]
    howToSteps = [
      { name: "Enter the balance", text: `This route starts from ${formatCurrency(parsed.balance)}.` },
      { name: "Set the APR", text: `The current annual rate is ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the monthly payment", text: `The example uses ${formatCurrency(parsed.monthlyPayment)} each month.` },
      { name: "Review timeline and total cost", text: `Estimated payoff time is ${formatNumber(parsed.monthsToPayoff)} months with total paid of ${formatCurrency(parsed.totalPaid)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why payoff timeline pages work for users and search",
      [
        "Users often search one exact debt scenario because they need urgency, not theory. A useful page answers the current timeline clearly and then offers the next comparison: a higher payment, a lower rate, or a different debt shape.",
        "That makes the route practical enough to stand on its own while still fitting a broader finance utility cluster.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters because debt balances and repayment plans are sensitive numbers.",
      "The page keeps the workflow private, fast, and useful on shared devices or quick mobile sessions.",
    ]
    faq = [
      { question: `How long could ${formatCurrency(parsed.balance)} take to pay off at ${parsed.annualRate}%?`, answer: `At ${formatCurrency(parsed.monthlyPayment)} per month, this route estimates about ${formatNumber(parsed.monthsToPayoff)} months.` },
      { question: "Does this include late fees or new purchases?", answer: "No. The page models a fixed balance with fixed monthly payments and no new charges." },
      { question: "Why compare timeline and total paid?", answer: "Because many users focus only on the monthly payment and miss how much interest accumulates over time." },
      { question: "Can I test a larger monthly payment?", answer: "Yes. The embedded calculator and related links are built around that comparison." },
      { question: "Does this page send debt values anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "Basic-loan-payment and savings-goal routes are useful next comparisons after a debt payoff estimate." },
    ]
    summaryRows = [
      { label: "Balance", value: formatCurrency(parsed.balance) },
      { label: "APR", value: formatPercent(parsed.annualRate) },
      { label: "Monthly payment", value: formatCurrency(parsed.monthlyPayment) },
      { label: "Months to payoff", value: formatNumber(parsed.monthsToPayoff) },
      { label: "Interest paid", value: formatCurrency(parsed.interestPaid) },
      { label: "Total paid", value: formatCurrency(parsed.totalPaid) },
    ]
    initialValues = { annualRate: parsed.annualRate, balance: parsed.balance, monthlyPayment: parsed.monthlyPayment }
    h1 = `Credit Card Payoff for ${formatCurrency(parsed.balance)} at ${parsed.annualRate}% with ${formatCurrency(parsed.monthlyPayment)}/Month`
  }

  if (parsed.category === "savings-goal") {
    const yearsToGoal = parsed.monthsToGoal / 12
    const scenarioText = `reaching ${formatCurrency(parsed.targetAmount)} by saving ${formatCurrency(parsed.monthlyContribution)} per month at ${formatPercent(parsed.annualRate)}`
    intro = [
      "Savings-goal routes work because users often know the target before they know the timeline. They want to ask a simple question: if I save this amount each month, roughly how long until I get there?",
      `For ${scenarioText}, this page estimates about ${formatNumber(parsed.monthsToGoal)} months, or roughly ${formatNumber(yearsToGoal)} years. Direct contributions over that period would total about ${formatCurrency(parsed.totalContributions)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The page is useful because it connects a concrete target to a realistic recurring habit. That is more actionable than a generic savings article and still simpler than a full personal finance planner.",
      "It also fits the browser-first model well because users can compare a few contribution levels privately in seconds.",
    ]
    howItWorks = [
      "The calculator compounds monthly savings at the annual rate entered on the page until the target amount is reached. It is a straightforward goal-timeline estimate intended for first-pass planning.",
      "All calculations stay local in the browser, so the user can test savings scenarios without sending financial details to a third party.",
    ]
    howToSteps = [
      { name: "Enter the target amount", text: `This route uses ${formatCurrency(parsed.targetAmount)} as the savings goal.` },
      { name: "Set the monthly contribution", text: `The example contribution is ${formatCurrency(parsed.monthlyContribution)} per month.` },
      { name: "Set the annual rate", text: `The current annual rate is ${formatPercent(parsed.annualRate)}.` },
      { name: "Review the estimated timeline", text: `Estimated time to goal is ${formatNumber(parsed.monthsToGoal)} months.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why savings-goal routes are high-intent utility pages",
      [
        "A savings-goal page is more practical than a generic savings article because it answers one specific scenario and shows the trade-off between target size, monthly habit, and interest rate.",
        "That specificity is what makes the route useful enough to index on its own while still connecting naturally to related calculator pages.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That keeps goal planning private and fast even on a shared or work-managed device.",
      "Plain Tools uses the same browser-first pattern here as it does across other utility clusters: no uploads, no accounts, and no server-side processing to get the answer.",
    ]
    faq = [
      { question: `How long could it take to save ${formatCurrency(parsed.targetAmount)}?`, answer: `At ${formatCurrency(parsed.monthlyContribution)} per month and ${formatPercent(parsed.annualRate)}, this route estimates about ${formatNumber(parsed.monthsToGoal)} months.` },
      { question: "Does this assume a fixed monthly contribution?", answer: "Yes. This cluster is intentionally simple and keeps the monthly contribution constant." },
      { question: "Why show total contributions separately?", answer: "It helps the user see how much of the end goal comes from deposits versus growth." },
      { question: "Can I compare a higher monthly savings amount?", answer: "Yes. Use the embedded calculator or the nearby related links to open the next exact scenario." },
      { question: "Does the page send savings values anywhere?", answer: "No. All calculations stay local in the browser." },
      { question: "What should I check next?", answer: "Compound-interest-basic and retirement-savings-intro pages are common next steps after a savings goal estimate." },
    ]
    summaryRows = [
      { label: "Target amount", value: formatCurrency(parsed.targetAmount) },
      { label: "Monthly contribution", value: formatCurrency(parsed.monthlyContribution) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Months to goal", value: formatNumber(parsed.monthsToGoal) },
      { label: "Years to goal", value: formatNumber(yearsToGoal) },
      { label: "Direct contributions", value: formatCurrency(parsed.totalContributions) },
    ]
    initialValues = { annualRate: parsed.annualRate, monthlyContribution: parsed.monthlyContribution, targetAmount: parsed.targetAmount }
    h1 = `Reach ${formatCurrency(parsed.targetAmount)} by Saving ${formatCurrency(parsed.monthlyContribution)}/Month at ${parsed.annualRate}%`
  }

  explanationBlocks = [
    ...explanationBlocks,
    {
      title: `How to compare nearby ${CATEGORY_LABELS[entry.category].toLowerCase()} scenarios`,
      paragraphs: [
        `A page like this becomes more useful when it helps the user move from ${parsed.expression.replace(/-/g, " ")} into the next realistic comparison. In practice, that usually means changing one variable at a time: a nearby percentage, a slightly different bill total, a shorter loan term, or a longer time horizon. Keeping the comparison tight makes the result easier to trust and easier to act on.`,
        `That is also why the route keeps strong internal links to adjacent calculator pages instead of forcing the user back to a blank hub. The goal is to preserve intent, let the user compare close scenarios quickly, and keep the overall calculator cluster useful rather than repetitive.`,
      ],
    },
    {
      title: "What to verify before acting on the result",
      paragraphs: [
        `This page is designed as a fast first-pass utility. Before using the result in a real budget, payment plan, or savings decision, the user should confirm the assumptions behind the number: whether the rate is annual, whether the amount includes fees, whether the time period is rounded, and whether there are outside factors this basic route intentionally does not model.`,
        `That scoped approach is deliberate. Plain Tools keeps these calculator pages browser-first, privacy-first, and easy to understand, while the surrounding related links help the user move into the next exact route if they want a different input mix or a more appropriate neighboring calculation.`,
      ],
    },
  ]

  howItWorks = [
    ...howItWorks,
    `Because the calculator runs entirely in the browser, you can change the inputs, compare nearby examples, and share the exact canonical URL without creating an account or sending financial details to a remote service. That keeps the workflow aligned with Plain Tools' local, no-upload positioning even on high-intent calculator pages.`,
  ]

  privacyNote = [
    ...privacyNote,
    "All calculations run locally in your browser - nothing is sent anywhere. That matters when you are checking compensation, debt, savings, or payment scenarios on a shared computer, a locked-down work device, or a quick mobile session where privacy and speed both matter.",
  ]

  faq = [
    ...faq,
    {
      question: "Why does this page have its own exact-match URL?",
      answer:
        "Exact-match calculator routes are easier to bookmark, share, revisit, and compare than a blank tool state. They also make the assumptions visible so the next scenario can be opened without re-entering everything from scratch.",
    },
    {
      question: "Is this calculator intended as final financial advice?",
      answer:
        "No. It is a fast, local first-pass calculator designed to answer one clear scenario well, then connect you to nearby comparisons. The result is useful for screening and planning, but important decisions should still be checked against your real terms, fees, and constraints.",
    },
  ]

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

const CALCULATOR_PREBUILD_PRIORITY_ORDER: PublicCalculatorCategory[] = [
  "basic-loan-payment",
  "credit-card-payoff",
  "tax-estimate-simple",
  "retirement-savings-intro",
  "compound-interest-basic",
  "savings-goal",
  "salary-to-hourly",
  "percentage",
  "tip-calculator",
  "simple-interest",
]

const CALCULATOR_PREBUILD_BUDGETS: Record<PublicCalculatorCategory, number> = {
  "basic-loan-payment": 900,
  "compound-interest-basic": 900,
  "credit-card-payoff": 850,
  percentage: 1800,
  "retirement-savings-intro": 650,
  "salary-to-hourly": 450,
  "savings-goal": 750,
  "simple-interest": 700,
  "tax-estimate-simple": 450,
  "tip-calculator": 550,
}

export function getCalculatorClusterRolloutSummary() {
  return CALCULATOR_PREBUILD_PRIORITY_ORDER.map((category) => {
    const total = PUBLIC_CALCULATOR_TEMPLATES.filter((entry) => entry.category === category).length
    return {
      category,
      prebuild: CALCULATOR_PREBUILD_BUDGETS[category],
      total,
    }
  })
}

export function getCalculatorOverlapReport(limit = 25) {
  const buckets = new Map<string, string[]>()

  for (const entry of PUBLIC_CALCULATOR_TEMPLATES) {
    const signature = `${entry.category}:${entry.expression.replace(/[0-9.]+/g, "#")}`
    const existing = buckets.get(signature) ?? []
    existing.push(entry.expression)
    buckets.set(signature, existing)
  }

  return Array.from(buckets.entries())
    .filter(([, expressions]) => expressions.length > 1)
    .slice(0, limit)
    .map(([signature, expressions]) => ({ expressions, signature }))
}

export function getPrebuildCalculatorParams(limit = 6000) {
  const staged = CALCULATOR_PREBUILD_PRIORITY_ORDER.flatMap((category) =>
    generateCategoryCalculatorParams(category, CALCULATOR_PREBUILD_BUDGETS[category])
  )
  return staged.slice(0, limit)
}

export const CALCULATOR_FINANCIAL_METADATA_EXAMPLES = [
  getCalculatorPage("percentage", "what-is-20-percent-of-500"),
  getCalculatorPage("tip-calculator", "tip-calculator-150-18-percent"),
  getCalculatorPage("salary-to-hourly", "salary-to-hourly-60000-40-hours"),
  getCalculatorPage("basic-loan-payment", "loan-payment-10000-5-3-years"),
  getCalculatorPage("simple-interest", "simple-interest-10000-5-3"),
  getCalculatorPage("compound-interest-basic", "compound-interest-10000-5-10-years-monthly"),
  getCalculatorPage("retirement-savings-intro", "retirement-savings-500-monthly-6-20-years"),
  getCalculatorPage("tax-estimate-simple", "tax-estimate-85000-single"),
  getCalculatorPage("credit-card-payoff", "credit-card-payoff-10000-19.9-300-monthly"),
  getCalculatorPage("savings-goal", "savings-goal-25000-target-500-monthly-4-rate"),
]
  .filter((entry): entry is CalculatorPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

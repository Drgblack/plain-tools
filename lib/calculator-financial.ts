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
  | "mortgage-payment"
  | "refinance-savings"
  | "paycheck-estimate"
  | "401k-growth"
  | "auto-loan-payment"
  | "student-loan-payment"
  | "debt-to-income"
  | "cd-calculator"
  | "apy-calculator"
  | "ira-growth"
  | "simple-interest"
  | "compound-interest-basic"
  | "retirement-savings-intro"
  | "tax-estimate-simple"
  | "credit-card-payoff"
  | "savings-goal"
  | "emergency-fund"
  | "break-even-calculator"

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

type ParsedMortgagePayment = {
  annualRate: number
  category: "mortgage-payment"
  downPaymentAmount: number
  downPaymentPercent: number
  expression: string
  homePrice: number
  loanPrincipal: number
  monthlyPayment: number
  termYears: number
  totalInterest: number
  totalPaid: number
}

type ParsedRefinanceSavings = {
  balance: number
  category: "refinance-savings"
  currentMonthlyPayment: number
  currentRate: number
  expression: string
  monthlySavings: number
  newMonthlyPayment: number
  newRate: number
  termYears: number
  totalSavings: number
}

type PayFrequency = "biweekly" | "monthly" | "semimonthly" | "weekly"

type ParsedPaycheckEstimate = {
  annualSalary: number
  annualTakeHome: number
  category: "paycheck-estimate"
  effectiveRate: number
  expression: string
  grossPaycheck: number
  netPaycheck: number
  payFrequency: PayFrequency
  state: string
  stateRate: number
}

type ParsedRetirement401kGrowth = {
  annualRate: number
  annualSalary: number
  category: "401k-growth"
  employeeAnnualContribution: number
  employerAnnualMatch: number
  employerMatchPercent: number
  expression: string
  futureValue: number
  totalAnnualContribution: number
  totalContributions: number
  contributionPercent: number
  years: number
}

type ParsedAutoLoanPayment = {
  annualRate: number
  category: "auto-loan-payment"
  downPaymentAmount: number
  expression: string
  loanPrincipal: number
  monthlyPayment: number
  termMonths: number
  totalInterest: number
  totalPaid: number
  vehiclePrice: number
}

type ParsedStudentLoanPayment = {
  annualRate: number
  balance: number
  baseMonthlyPayment: number
  category: "student-loan-payment"
  expression: string
  extraPayment: number
  interestPaid: number
  monthlyPayment: number
  monthsToPayoff: number
  termYears: number
  totalPaid: number
}

type ParsedDebtToIncome = {
  annualIncome: number
  category: "debt-to-income"
  dtiRatio: number
  expression: string
  housingPayment: number
  monthlyDebt: number
  monthlyGrossIncome: number
  totalMonthlyObligations: number
}

type ParsedCdCalculator = {
  annualRate: number
  category: "cd-calculator"
  compounding: "annual" | "monthly" | "quarterly"
  deposit: number
  expression: string
  interestEarned: number
  maturityValue: number
  termMonths: number
}

type ParsedApyCalculator = {
  annualRate: number
  category: "apy-calculator"
  compounding: "annual" | "monthly" | "quarterly"
  deposit: number
  expression: string
  futureValue: number
  interestEarned: number
  years: number
}

type ParsedIraGrowth = {
  accountType: "roth" | "traditional"
  annualContribution: number
  annualRate: number
  category: "ira-growth"
  expression: string
  futureValue: number
  totalContributions: number
  years: number
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

type ParsedEmergencyFund = {
  category: "emergency-fund"
  emergencyFundTarget: number
  expression: string
  monthlyExpenses: number
  monthsCovered: number
}

type ParsedBreakEvenCalculator = {
  category: "break-even-calculator"
  contributionMargin: number
  expression: string
  fixedCosts: number
  revenueToBreakEven: number
  unitCost: number
  unitPrice: number
  unitsToBreakEven: number
}

type ParsedCalculator =
  | ParsedApyCalculator
  | ParsedAutoLoanPayment
  | ParsedBasicLoan
  | ParsedBreakEvenCalculator
  | ParsedCdCalculator
  | ParsedCompoundInterestIntro
  | ParsedCreditCardPayoff
  | ParsedDebtToIncome
  | ParsedEmergencyFund
  | ParsedIraGrowth
  | ParsedMortgagePayment
  | ParsedPercentage
  | ParsedPaycheckEstimate
  | ParsedRetirement401kGrowth
  | ParsedRetirementBasic
  | ParsedRefinanceSavings
  | ParsedSalary
  | ParsedSavingsGoal
  | ParsedSimpleInterest
  | ParsedStudentLoanPayment
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
  "401k-growth": "401(k) Growth Calculator",
  "apy-calculator": "APY Growth Calculator",
  "auto-loan-payment": "Auto Loan Payment Calculator",
  "basic-loan": "Basic Loan Payment Calculator",
  "basic-loan-payment": "Basic Loan Payment Calculator",
  "break-even-calculator": "Break-Even Calculator",
  "cd-calculator": "CD Calculator",
  "compound-basic": "Compound Interest Basic Calculator",
  "compound-interest-basic": "Compound Interest Basic Calculator",
  "compound-interest-intro": "Compound Interest Calculator",
  "credit-card-payoff": "Credit Card Payoff Calculator",
  "debt-to-income": "Debt-to-Income Calculator",
  "emergency-fund": "Emergency Fund Calculator",
  "ira-growth": "IRA Growth Calculator",
  "mortgage-payment": "Mortgage Payment Calculator",
  percentage: "Percentage Calculator",
  "paycheck-estimate": "Paycheck Estimate Calculator",
  "refinance-savings": "Refinance Savings Calculator",
  "retirement-basic": "Retirement Savings Intro Calculator",
  "retirement-savings-intro": "Retirement Savings Intro Calculator",
  "retirement-savings-basic": "Retirement Savings Calculator",
  "savings-goal": "Savings Goal Calculator",
  "salary-to-hourly": "Salary to Hourly Calculator",
  "simple-interest": "Simple Interest Calculator",
  "student-loan-payment": "Student Loan Payment Calculator",
  "tax-estimate-simple": "Simple Tax Estimate Calculator",
  tip: "Tip Calculator",
  "tip-calculator": "Tip Calculator",
}

export const CALCULATOR_PUBLIC_CATEGORY_ORDER: PublicCalculatorCategory[] = [
  "percentage",
  "tip-calculator",
  "salary-to-hourly",
  "basic-loan-payment",
  "mortgage-payment",
  "refinance-savings",
  "paycheck-estimate",
  "401k-growth",
  "auto-loan-payment",
  "student-loan-payment",
  "debt-to-income",
  "cd-calculator",
  "apy-calculator",
  "ira-growth",
  "simple-interest",
  "compound-interest-basic",
  "retirement-savings-intro",
  "tax-estimate-simple",
  "credit-card-payoff",
  "savings-goal",
  "emergency-fund",
  "break-even-calculator",
]

const CATEGORY_LABELS = CALCULATOR_CATEGORY_LABELS

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
const MORTGAGE_HOME_PRICES = uniqueNumberSeries([
  ...range(100000, 300000, 25000),
  ...range(350000, 800000, 50000),
  900000,
  1000000,
  1250000,
])
const MORTGAGE_RATES = uniqueNumberSeries([3.5, 4, 4.5, 5, 5.5, 6, 6.5, 6.75, 7, 7.5, 8])
const MORTGAGE_TERMS = uniqueNumberSeries([15, 20, 30])
const MORTGAGE_DOWN_PAYMENTS = uniqueNumberSeries([3, 5, 10, 15, 20, 25, 30])
const REFI_BALANCES = uniqueNumberSeries([
  ...range(100000, 300000, 25000),
  ...range(350000, 800000, 50000),
  900000,
  1000000,
])
const REFI_CURRENT_RATES = uniqueNumberSeries([5.5, 6, 6.5, 6.75, 7, 7.5, 8])
const REFI_NEW_RATES = uniqueNumberSeries([4.5, 5, 5.5, 6, 6.25, 6.5, 6.75])
const REFI_TERMS = uniqueNumberSeries([15, 20, 30])
const PAYCHECK_SALARIES = uniqueNumberSeries([
  ...range(25000, 100000, 2500),
  ...range(105000, 200000, 5000),
  ...range(225000, 350000, 25000),
])
const PAYCHECK_FREQUENCIES = ["weekly", "biweekly", "semimonthly", "monthly"] as const
export const PAYCHECK_STATE_OPTIONS = [
  { slug: "alabama", label: "Alabama", rate: 4.5 },
  { slug: "alaska", label: "Alaska", rate: 0 },
  { slug: "arizona", label: "Arizona", rate: 2.5 },
  { slug: "arkansas", label: "Arkansas", rate: 4.4 },
  { slug: "california", label: "California", rate: 6.5 },
  { slug: "colorado", label: "Colorado", rate: 4.4 },
  { slug: "connecticut", label: "Connecticut", rate: 5.5 },
  { slug: "delaware", label: "Delaware", rate: 5.2 },
  { slug: "district-of-columbia", label: "District of Columbia", rate: 6.0 },
  { slug: "florida", label: "Florida", rate: 0 },
  { slug: "georgia", label: "Georgia", rate: 4.75 },
  { slug: "hawaii", label: "Hawaii", rate: 7.0 },
  { slug: "idaho", label: "Idaho", rate: 5.8 },
  { slug: "illinois", label: "Illinois", rate: 4.95 },
  { slug: "indiana", label: "Indiana", rate: 3.0 },
  { slug: "iowa", label: "Iowa", rate: 4.8 },
  { slug: "kansas", label: "Kansas", rate: 5.3 },
  { slug: "kentucky", label: "Kentucky", rate: 4.0 },
  { slug: "louisiana", label: "Louisiana", rate: 4.0 },
  { slug: "maine", label: "Maine", rate: 6.2 },
  { slug: "maryland", label: "Maryland", rate: 5.0 },
  { slug: "massachusetts", label: "Massachusetts", rate: 5.0 },
  { slug: "michigan", label: "Michigan", rate: 4.25 },
  { slug: "minnesota", label: "Minnesota", rate: 6.8 },
  { slug: "mississippi", label: "Mississippi", rate: 4.7 },
  { slug: "missouri", label: "Missouri", rate: 4.8 },
  { slug: "montana", label: "Montana", rate: 5.5 },
  { slug: "nebraska", label: "Nebraska", rate: 5.3 },
  { slug: "nevada", label: "Nevada", rate: 0 },
  { slug: "new-hampshire", label: "New Hampshire", rate: 0 },
  { slug: "new-jersey", label: "New Jersey", rate: 5.5 },
  { slug: "new-mexico", label: "New Mexico", rate: 4.9 },
  { slug: "new-york", label: "New York", rate: 6.2 },
  { slug: "north-carolina", label: "North Carolina", rate: 4.5 },
  { slug: "north-dakota", label: "North Dakota", rate: 2.9 },
  { slug: "ohio", label: "Ohio", rate: 3.5 },
  { slug: "oklahoma", label: "Oklahoma", rate: 4.4 },
  { slug: "oregon", label: "Oregon", rate: 7.0 },
  { slug: "pennsylvania", label: "Pennsylvania", rate: 3.07 },
  { slug: "rhode-island", label: "Rhode Island", rate: 4.8 },
  { slug: "south-carolina", label: "South Carolina", rate: 4.9 },
  { slug: "south-dakota", label: "South Dakota", rate: 0 },
  { slug: "tennessee", label: "Tennessee", rate: 0 },
  { slug: "texas", label: "Texas", rate: 0 },
  { slug: "utah", label: "Utah", rate: 4.6 },
  { slug: "vermont", label: "Vermont", rate: 6.2 },
  { slug: "virginia", label: "Virginia", rate: 4.9 },
  { slug: "washington", label: "Washington", rate: 0 },
  { slug: "west-virginia", label: "West Virginia", rate: 4.7 },
  { slug: "wisconsin", label: "Wisconsin", rate: 5.0 },
  { slug: "wyoming", label: "Wyoming", rate: 0 },
] as const
const RETIREMENT_401K_SALARIES = uniqueNumberSeries([
  40000,
  50000,
  60000,
  70000,
  80000,
  90000,
  100000,
  110000,
  125000,
  150000,
  175000,
  200000,
])
const RETIREMENT_401K_CONTRIBUTION_PERCENTS = uniqueNumberSeries([4, 5, 6, 7, 8, 10, 12, 15, 18, 20])
const RETIREMENT_401K_MATCH_PERCENTS = uniqueNumberSeries([0, 2, 3, 4, 5, 6])
const RETIREMENT_401K_RATES = uniqueNumberSeries([4, 5, 6, 7, 8, 9, 10])
const RETIREMENT_401K_YEARS = uniqueNumberSeries([5, 10, 15, 20, 25, 30, 35])
const AUTO_LOAN_VEHICLE_PRICES = uniqueNumberSeries([
  ...range(10000, 40000, 2500),
  ...range(45000, 80000, 5000),
  90000,
  100000,
])
const AUTO_LOAN_RATES = uniqueNumberSeries([2.9, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10])
const AUTO_LOAN_TERMS_MONTHS = uniqueNumberSeries([24, 36, 48, 60, 72, 84])
const AUTO_LOAN_DOWN_PAYMENTS = uniqueNumberSeries([0, 1000, 2500, 5000, 7500, 10000, 15000])
const STUDENT_LOAN_BALANCES = uniqueNumberSeries([
  ...range(5000, 30000, 2500),
  ...range(35000, 100000, 5000),
  125000,
  150000,
])
const STUDENT_LOAN_RATES = uniqueNumberSeries([3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8])
const STUDENT_LOAN_TERMS_YEARS = uniqueNumberSeries([5, 7, 10, 15, 20, 25])
const STUDENT_LOAN_EXTRA_PAYMENTS = uniqueNumberSeries([0, 25, 50, 100, 150, 200])
const DEBT_TO_INCOME_ANNUAL_INCOMES = uniqueNumberSeries([
  ...range(30000, 100000, 5000),
  ...range(110000, 200000, 10000),
  225000,
  250000,
  300000,
])
const DEBT_TO_INCOME_MONTHLY_DEBT = uniqueNumberSeries([
  250,
  500,
  750,
  1000,
  1250,
  1500,
  1750,
  2000,
  2500,
  3000,
  3500,
  4000,
  5000,
  6000,
  7500,
])
const DEBT_TO_INCOME_HOUSING_PAYMENTS = uniqueNumberSeries([
  800,
  1000,
  1200,
  1400,
  1600,
  1800,
  2000,
  2500,
  3000,
  3500,
  4000,
  5000,
])
const CD_DEPOSITS = uniqueNumberSeries([
  ...range(1000, 10000, 1000),
  ...range(12500, 50000, 2500),
  ...range(60000, 100000, 10000),
])
const CD_RATES = uniqueNumberSeries([2.5, 3, 3.5, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 6])
const CD_TERM_MONTHS = uniqueNumberSeries([3, 6, 9, 12, 18, 24, 36, 48, 60, 84])
const APY_DEPOSITS = CD_DEPOSITS
const APY_RATES = uniqueNumberSeries([2.5, 3, 3.5, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 6])
const APY_YEARS = uniqueNumberSeries([1, 2, 3, 4, 5, 7, 10, 12, 15, 20])
const IRA_ANNUAL_CONTRIBUTIONS = uniqueNumberSeries([1000, 2000, 3000, 4000, 5000, 6000, 6500, 7000, 7500, 8000])
const IRA_RATES = uniqueNumberSeries([4, 5, 6, 7, 8, 9, 10])
const IRA_YEARS = uniqueNumberSeries([5, 10, 15, 20, 25, 30, 35, 40])
const IRA_ACCOUNT_TYPES = ["traditional", "roth"] as const
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
const EMERGENCY_FUND_EXPENSES = uniqueNumberSeries([
  ...range(1500, 6000, 250),
  ...range(6500, 12000, 500),
])
const EMERGENCY_FUND_MONTHS = uniqueNumberSeries([3, 4, 5, 6, 7, 8, 9, 12])
const BREAK_EVEN_FIXED_COSTS = uniqueNumberSeries([
  ...range(5000, 25000, 2500),
  ...range(30000, 100000, 10000),
])
const BREAK_EVEN_PRICE_POINTS = uniqueNumberSeries([25, 40, 50, 65, 80, 100, 120, 150, 200])
const BREAK_EVEN_UNIT_COSTS = uniqueNumberSeries([8, 12, 15, 20, 25, 30, 40, 50, 60, 80])

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

function futureValueFromAnnualContribution(
  annualContribution: number,
  annualRate: number,
  years: number
) {
  return futureValueRetirement(annualContribution / 12, annualRate, years)
}

function stateTaxRateFor(state: string) {
  return PAYCHECK_STATE_OPTIONS.find((entry) => entry.slug === state)?.rate ?? 0
}

function payPeriodsPerYear(payFrequency: PayFrequency) {
  switch (payFrequency) {
    case "weekly":
      return 52
    case "biweekly":
      return 26
    case "semimonthly":
      return 24
    case "monthly":
      return 12
  }
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

function mortgageExpressionFor(
  homePrice: number,
  annualRate: number,
  termYears: number,
  downPaymentPercent: number
) {
  return `mortgage-payment-${homePrice}-${annualRate}-${termYears}-years-${downPaymentPercent}-down`
}

function refinanceExpressionFor(
  balance: number,
  currentRate: number,
  newRate: number,
  termYears: number
) {
  return `refinance-savings-${balance}-${currentRate}-to-${newRate}-${termYears}-years`
}

function paycheckEstimateExpressionFor(
  annualSalary: number,
  payFrequency: PayFrequency,
  state: string
) {
  return `paycheck-estimate-${annualSalary}-${payFrequency}-${state}`
}

function retirement401kExpressionFor(
  annualSalary: number,
  contributionPercent: number,
  employerMatchPercent: number,
  annualRate: number,
  years: number
) {
  return `401k-growth-${annualSalary}-salary-${contributionPercent}-contribution-${employerMatchPercent}-match-${annualRate}-rate-${years}-years`
}

function autoLoanExpressionFor(
  vehiclePrice: number,
  annualRate: number,
  termMonths: number,
  downPaymentAmount: number
) {
  return `auto-loan-${vehiclePrice}-${annualRate}-${termMonths}-months-${downPaymentAmount}-down`
}

function studentLoanExpressionFor(
  balance: number,
  annualRate: number,
  termYears: number,
  extraPayment: number
) {
  return `student-loan-${balance}-${annualRate}-${termYears}-years-${extraPayment}-extra`
}

function debtToIncomeExpressionFor(
  annualIncome: number,
  monthlyDebt: number,
  housingPayment: number
) {
  return `debt-to-income-${annualIncome}-income-${monthlyDebt}-debt-${housingPayment}-housing`
}

function cdExpressionFor(
  deposit: number,
  annualRate: number,
  termMonths: number,
  compounding: "annual" | "monthly" | "quarterly"
) {
  return `cd-calculator-${deposit}-${annualRate}-${termMonths}-months-${compounding}`
}

function apyExpressionFor(
  deposit: number,
  annualRate: number,
  years: number,
  compounding: "annual" | "monthly" | "quarterly"
) {
  return `apy-calculator-${deposit}-${annualRate}-${years}-years-${compounding}`
}

function iraExpressionFor(
  annualContribution: number,
  annualRate: number,
  years: number,
  accountType: "roth" | "traditional"
) {
  return `ira-growth-${annualContribution}-${annualRate}-${years}-years-${accountType}`
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

function emergencyFundExpressionFor(monthlyExpenses: number, monthsCovered: number) {
  return `emergency-fund-${monthlyExpenses}-${monthsCovered}-months`
}

function breakEvenExpressionFor(fixedCosts: number, unitPrice: number, unitCost: number) {
  return `break-even-${fixedCosts}-fixed-${unitPrice}-price-${unitCost}-cost`
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
    case "mortgage-payment": {
      const homePrice = readNumber("homePrice")
      const annualRate = readNumber("annualRate")
      const termYears = readNumber("termYears")
      const downPaymentPercent = readNumber("downPaymentPercent")
      if (
        homePrice === null ||
        annualRate === null ||
        termYears === null ||
        downPaymentPercent === null ||
        homePrice <= 0 ||
        annualRate < 0 ||
        termYears <= 0 ||
        downPaymentPercent < 0 ||
        downPaymentPercent >= 100
      ) {
        return null
      }
      return mortgageExpressionFor(homePrice, annualRate, termYears, downPaymentPercent)
    }
    case "refinance-savings": {
      const balance = readNumber("balance")
      const currentRate = readNumber("currentRate")
      const newRate = readNumber("newRate")
      const termYears = readNumber("termYears")
      if (
        balance === null ||
        currentRate === null ||
        newRate === null ||
        termYears === null ||
        balance <= 0 ||
        currentRate <= 0 ||
        newRate <= 0 ||
        termYears <= 0 ||
        newRate >= currentRate
      ) {
        return null
      }
      return refinanceExpressionFor(balance, currentRate, newRate, termYears)
    }
    case "paycheck-estimate": {
      const annualSalary = readNumber("annualSalary")
      const payFrequency = String(rawValues.payFrequency ?? "biweekly") as PayFrequency
      const state = String(rawValues.state ?? "texas").toLowerCase()
      if (
        annualSalary === null ||
        annualSalary <= 0 ||
        !PAYCHECK_FREQUENCIES.includes(payFrequency) ||
        !PAYCHECK_STATE_OPTIONS.some((entry) => entry.slug === state)
      ) {
        return null
      }
      return paycheckEstimateExpressionFor(annualSalary, payFrequency, state)
    }
    case "401k-growth": {
      const annualSalary = readNumber("annualSalary")
      const contributionPercent = readNumber("contributionPercent")
      const employerMatchPercent = readNumber("employerMatchPercent")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      if (
        annualSalary === null ||
        contributionPercent === null ||
        employerMatchPercent === null ||
        annualRate === null ||
        years === null ||
        annualSalary <= 0 ||
        contributionPercent < 0 ||
        employerMatchPercent < 0 ||
        annualRate < 0 ||
        years <= 0
      ) {
        return null
      }
      return retirement401kExpressionFor(
        annualSalary,
        contributionPercent,
        employerMatchPercent,
        annualRate,
        years
      )
    }
    case "auto-loan-payment": {
      const vehiclePrice = readNumber("vehiclePrice")
      const annualRate = readNumber("annualRate")
      const termMonths = readNumber("termMonths")
      const downPaymentAmount = readNumber("downPaymentAmount")
      if (
        vehiclePrice === null ||
        annualRate === null ||
        termMonths === null ||
        downPaymentAmount === null ||
        vehiclePrice <= 0 ||
        annualRate < 0 ||
        termMonths <= 0 ||
        downPaymentAmount < 0 ||
        downPaymentAmount >= vehiclePrice
      ) {
        return null
      }
      return autoLoanExpressionFor(vehiclePrice, annualRate, termMonths, downPaymentAmount)
    }
    case "student-loan-payment": {
      const balance = readNumber("balance")
      const annualRate = readNumber("annualRate")
      const termYears = readNumber("termYears")
      const extraPayment = readNumber("extraPayment")
      if (
        balance === null ||
        annualRate === null ||
        termYears === null ||
        extraPayment === null ||
        balance <= 0 ||
        annualRate < 0 ||
        termYears <= 0 ||
        extraPayment < 0
      ) {
        return null
      }
      return studentLoanExpressionFor(balance, annualRate, termYears, extraPayment)
    }
    case "debt-to-income": {
      const annualIncome = readNumber("annualIncome")
      const monthlyDebt = readNumber("monthlyDebt")
      const housingPayment = readNumber("housingPayment")
      if (
        annualIncome === null ||
        monthlyDebt === null ||
        housingPayment === null ||
        annualIncome <= 0 ||
        monthlyDebt < 0 ||
        housingPayment < 0
      ) {
        return null
      }
      return debtToIncomeExpressionFor(annualIncome, monthlyDebt, housingPayment)
    }
    case "cd-calculator": {
      const deposit = readNumber("deposit")
      const annualRate = readNumber("annualRate")
      const termMonths = readNumber("termMonths")
      const compoundingRaw = String(rawValues.compounding ?? "monthly").toLowerCase()
      const compounding =
        compoundingRaw === "annual" || compoundingRaw === "quarterly"
          ? compoundingRaw
          : "monthly"
      if (
        deposit === null ||
        annualRate === null ||
        termMonths === null ||
        deposit <= 0 ||
        annualRate < 0 ||
        termMonths <= 0
      ) {
        return null
      }
      return cdExpressionFor(deposit, annualRate, termMonths, compounding)
    }
    case "apy-calculator": {
      const deposit = readNumber("deposit")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      const compoundingRaw = String(rawValues.compounding ?? "monthly").toLowerCase()
      const compounding =
        compoundingRaw === "annual" || compoundingRaw === "quarterly"
          ? compoundingRaw
          : "monthly"
      if (
        deposit === null ||
        annualRate === null ||
        years === null ||
        deposit <= 0 ||
        annualRate < 0 ||
        years <= 0
      ) {
        return null
      }
      return apyExpressionFor(deposit, annualRate, years, compounding)
    }
    case "ira-growth": {
      const annualContribution = readNumber("annualContribution")
      const annualRate = readNumber("annualRate")
      const years = readNumber("years")
      const accountType = String(rawValues.accountType ?? "roth").toLowerCase() as
        | "roth"
        | "traditional"
      if (
        annualContribution === null ||
        annualRate === null ||
        years === null ||
        annualContribution < 0 ||
        annualRate < 0 ||
        years <= 0 ||
        !IRA_ACCOUNT_TYPES.includes(accountType)
      ) {
        return null
      }
      return iraExpressionFor(annualContribution, annualRate, years, accountType)
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
    case "emergency-fund": {
      const monthlyExpenses = readNumber("monthlyExpenses")
      const monthsCovered = readNumber("monthsCovered")
      if (
        monthlyExpenses === null ||
        monthsCovered === null ||
        monthlyExpenses <= 0 ||
        monthsCovered <= 0
      ) {
        return null
      }
      return emergencyFundExpressionFor(monthlyExpenses, monthsCovered)
    }
    case "break-even-calculator": {
      const fixedCosts = readNumber("fixedCosts")
      const unitPrice = readNumber("unitPrice")
      const unitCost = readNumber("unitCost")
      if (
        fixedCosts === null ||
        unitPrice === null ||
        unitCost === null ||
        fixedCosts <= 0 ||
        unitPrice <= 0 ||
        unitCost < 0 ||
        unitPrice <= unitCost
      ) {
        return null
      }
      return breakEvenExpressionFor(fixedCosts, unitPrice, unitCost)
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

  if (category === "mortgage-payment") {
    const match =
      /^mortgage-payment-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years-([0-9]+(?:\.[0-9]+)*)-down$/.exec(
        decoded
      )
    if (!match) return null
    const homePrice = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termYears = parseNumberToken(match[3] ?? "")
    const downPaymentPercent = parseNumberToken(match[4] ?? "")
    if (
      homePrice === null ||
      annualRate === null ||
      termYears === null ||
      downPaymentPercent === null ||
      homePrice <= 0 ||
      annualRate < 0 ||
      termYears <= 0 ||
      downPaymentPercent < 0 ||
      downPaymentPercent >= 100
    ) {
      return null
    }
    const downPaymentAmount = homePrice * (downPaymentPercent / 100)
    const loanPrincipal = homePrice - downPaymentAmount
    const payment = monthlyPayment(loanPrincipal, annualRate, termYears)
    const totalPaid = payment * termYears * 12
    return {
      annualRate,
      category,
      downPaymentAmount,
      downPaymentPercent,
      expression: mortgageExpressionFor(homePrice, annualRate, termYears, downPaymentPercent),
      homePrice,
      loanPrincipal,
      monthlyPayment: payment,
      termYears,
      totalInterest: totalPaid - loanPrincipal,
      totalPaid,
    }
  }

  if (category === "refinance-savings") {
    const match =
      /^refinance-savings-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-to-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years$/.exec(
        decoded
      )
    if (!match) return null
    const balance = parseNumberToken(match[1] ?? "")
    const currentRate = parseNumberToken(match[2] ?? "")
    const newRate = parseNumberToken(match[3] ?? "")
    const termYears = parseNumberToken(match[4] ?? "")
    if (
      balance === null ||
      currentRate === null ||
      newRate === null ||
      termYears === null ||
      balance <= 0 ||
      currentRate <= 0 ||
      newRate <= 0 ||
      termYears <= 0 ||
      newRate >= currentRate
    ) {
      return null
    }
    const currentMonthlyPayment = monthlyPayment(balance, currentRate, termYears)
    const newMonthlyPayment = monthlyPayment(balance, newRate, termYears)
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment
    return {
      balance,
      category,
      currentMonthlyPayment,
      currentRate,
      expression: refinanceExpressionFor(balance, currentRate, newRate, termYears),
      monthlySavings,
      newMonthlyPayment,
      newRate,
      termYears,
      totalSavings: monthlySavings * termYears * 12,
    }
  }

  if (category === "paycheck-estimate") {
    const match =
      /^paycheck-estimate-([0-9]+)-((?:biweekly)|(?:monthly)|(?:semimonthly)|(?:weekly))-([a-z-]+)$/.exec(
        decoded
      )
    if (!match) return null
    const annualSalary = parseNumberToken(match[1] ?? "")
    const payFrequency = (match[2] ?? "biweekly") as PayFrequency
    const state = match[3] ?? "texas"
    if (
      annualSalary === null ||
      annualSalary <= 0 ||
      !PAYCHECK_FREQUENCIES.includes(payFrequency) ||
      !PAYCHECK_STATE_OPTIONS.some((entry) => entry.slug === state)
    ) {
      return null
    }
    const stateRate = stateTaxRateFor(state)
    const effectiveRate = effectiveTaxRateFor("single", annualSalary) + stateRate
    const annualTakeHome = annualSalary * (1 - effectiveRate / 100)
    const periods = payPeriodsPerYear(payFrequency)
    return {
      annualSalary,
      annualTakeHome,
      category,
      effectiveRate,
      expression: paycheckEstimateExpressionFor(annualSalary, payFrequency, state),
      grossPaycheck: annualSalary / periods,
      netPaycheck: annualTakeHome / periods,
      payFrequency,
      state,
      stateRate,
    }
  }

  if (category === "401k-growth") {
    const match =
      /^401k-growth-([0-9]+)-salary-([0-9]+(?:\.[0-9]+)*)-contribution-([0-9]+(?:\.[0-9]+)*)-match-([0-9]+(?:\.[0-9]+)*)-rate-([0-9]+)-years$/.exec(
        decoded
      )
    if (!match) return null
    const annualSalary = parseNumberToken(match[1] ?? "")
    const contributionPercent = parseNumberToken(match[2] ?? "")
    const employerMatchPercent = parseNumberToken(match[3] ?? "")
    const annualRate = parseNumberToken(match[4] ?? "")
    const years = parseNumberToken(match[5] ?? "")
    if (
      annualSalary === null ||
      contributionPercent === null ||
      employerMatchPercent === null ||
      annualRate === null ||
      years === null ||
      annualSalary <= 0 ||
      contributionPercent < 0 ||
      employerMatchPercent < 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null
    }
    const employeeAnnualContribution = annualSalary * (contributionPercent / 100)
    const employerAnnualMatch = annualSalary * (employerMatchPercent / 100)
    const totalAnnualContribution = employeeAnnualContribution + employerAnnualMatch
    const futureValue = futureValueFromAnnualContribution(
      totalAnnualContribution,
      annualRate,
      years
    )
    return {
      annualRate,
      annualSalary,
      category,
      contributionPercent,
      employeeAnnualContribution,
      employerAnnualMatch,
      employerMatchPercent,
      expression: retirement401kExpressionFor(
        annualSalary,
        contributionPercent,
        employerMatchPercent,
        annualRate,
        years
      ),
      futureValue,
      totalAnnualContribution,
      totalContributions: totalAnnualContribution * years,
      years,
    }
  }

  if (category === "auto-loan-payment") {
    const match =
      /^auto-loan-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-months-([0-9]+(?:\.[0-9]+)*)-down$/.exec(
        decoded
      )
    if (!match) return null
    const vehiclePrice = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termMonths = parseNumberToken(match[3] ?? "")
    const downPaymentAmount = parseNumberToken(match[4] ?? "")
    if (
      vehiclePrice === null ||
      annualRate === null ||
      termMonths === null ||
      downPaymentAmount === null ||
      vehiclePrice <= 0 ||
      annualRate < 0 ||
      termMonths <= 0 ||
      downPaymentAmount < 0 ||
      downPaymentAmount >= vehiclePrice
    ) {
      return null
    }
    const termYears = termMonths / 12
    const loanPrincipal = vehiclePrice - downPaymentAmount
    const payment = monthlyPayment(loanPrincipal, annualRate, termYears)
    const totalPaid = payment * termMonths
    return {
      annualRate,
      category,
      downPaymentAmount,
      expression: autoLoanExpressionFor(vehiclePrice, annualRate, termMonths, downPaymentAmount),
      loanPrincipal,
      monthlyPayment: payment,
      termMonths,
      totalInterest: totalPaid - loanPrincipal,
      totalPaid,
      vehiclePrice,
    }
  }

  if (category === "student-loan-payment") {
    const match =
      /^student-loan-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years-([0-9]+(?:\.[0-9]+)*)-extra$/.exec(
        decoded
      )
    if (!match) return null
    const balance = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termYears = parseNumberToken(match[3] ?? "")
    const extraPayment = parseNumberToken(match[4] ?? "")
    if (
      balance === null ||
      annualRate === null ||
      termYears === null ||
      extraPayment === null ||
      balance <= 0 ||
      annualRate < 0 ||
      termYears <= 0 ||
      extraPayment < 0
    ) {
      return null
    }
    const baseMonthlyPayment = monthlyPayment(balance, annualRate, termYears)
    const projection = monthsToDebtPayoff(balance, annualRate, baseMonthlyPayment + extraPayment)
    if (!Number.isFinite(projection.monthsToPayoff)) return null
    return {
      annualRate,
      balance,
      baseMonthlyPayment,
      category,
      expression: studentLoanExpressionFor(balance, annualRate, termYears, extraPayment),
      extraPayment,
      interestPaid: projection.interestPaid,
      monthlyPayment: baseMonthlyPayment + extraPayment,
      monthsToPayoff: projection.monthsToPayoff,
      termYears,
      totalPaid: projection.totalPaid,
    }
  }

  if (category === "debt-to-income") {
    const match =
      /^debt-to-income-([0-9]+)-income-([0-9]+(?:\.[0-9]+)*)-debt-([0-9]+(?:\.[0-9]+)*)-housing$/.exec(
        decoded
      )
    if (!match) return null
    const annualIncome = parseNumberToken(match[1] ?? "")
    const monthlyDebt = parseNumberToken(match[2] ?? "")
    const housingPayment = parseNumberToken(match[3] ?? "")
    if (
      annualIncome === null ||
      monthlyDebt === null ||
      housingPayment === null ||
      annualIncome <= 0 ||
      monthlyDebt < 0 ||
      housingPayment < 0
    ) {
      return null
    }
    const monthlyGrossIncome = annualIncome / 12
    const totalMonthlyObligations = monthlyDebt + housingPayment
    return {
      annualIncome,
      category,
      dtiRatio: (totalMonthlyObligations / monthlyGrossIncome) * 100,
      expression: debtToIncomeExpressionFor(annualIncome, monthlyDebt, housingPayment),
      housingPayment,
      monthlyDebt,
      monthlyGrossIncome,
      totalMonthlyObligations,
    }
  }

  if (category === "cd-calculator") {
    const match =
      /^cd-calculator-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-months-(monthly|quarterly|annual)$/.exec(
        decoded
      )
    if (!match) return null
    const deposit = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const termMonths = parseNumberToken(match[3] ?? "")
    const compounding = (match[4] ?? "monthly") as "annual" | "monthly" | "quarterly"
    if (
      deposit === null ||
      annualRate === null ||
      termMonths === null ||
      deposit <= 0 ||
      annualRate < 0 ||
      termMonths <= 0
    ) {
      return null
    }
    const maturityValue = futureValueCompoundWithFrequency(
      deposit,
      annualRate,
      termMonths / 12,
      compounding
    )
    return {
      annualRate,
      category,
      compounding,
      deposit,
      expression: cdExpressionFor(deposit, annualRate, termMonths, compounding),
      interestEarned: maturityValue - deposit,
      maturityValue,
      termMonths,
    }
  }

  if (category === "apy-calculator") {
    const match =
      /^apy-calculator-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years-(monthly|quarterly|annual)$/.exec(
        decoded
      )
    if (!match) return null
    const deposit = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    const compounding = (match[4] ?? "monthly") as "annual" | "monthly" | "quarterly"
    if (
      deposit === null ||
      annualRate === null ||
      years === null ||
      deposit <= 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null
    }
    const futureValue = futureValueCompoundWithFrequency(deposit, annualRate, years, compounding)
    return {
      annualRate,
      category,
      compounding,
      deposit,
      expression: apyExpressionFor(deposit, annualRate, years, compounding),
      futureValue,
      interestEarned: futureValue - deposit,
      years,
    }
  }

  if (category === "ira-growth") {
    const match =
      /^ira-growth-([0-9]+)-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-years-(roth|traditional)$/.exec(
        decoded
      )
    if (!match) return null
    const annualContribution = parseNumberToken(match[1] ?? "")
    const annualRate = parseNumberToken(match[2] ?? "")
    const years = parseNumberToken(match[3] ?? "")
    const accountType = (match[4] ?? "roth") as "roth" | "traditional"
    if (
      annualContribution === null ||
      annualRate === null ||
      years === null ||
      annualContribution < 0 ||
      annualRate < 0 ||
      years <= 0
    ) {
      return null
    }
    const futureValue = futureValueFromAnnualContribution(annualContribution, annualRate, years)
    return {
      accountType,
      annualContribution,
      annualRate,
      category,
      expression: iraExpressionFor(annualContribution, annualRate, years, accountType),
      futureValue,
      totalContributions: annualContribution * years,
      years,
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

  if (category === "emergency-fund") {
    const match =
      /^emergency-fund-([0-9]+(?:\.[0-9]+)*)-([0-9]+)-months$/.exec(decoded)
    if (!match) return null
    const monthlyExpenses = parseNumberToken(match[1] ?? "")
    const monthsCovered = parseNumberToken(match[2] ?? "")
    if (
      monthlyExpenses === null ||
      monthsCovered === null ||
      monthlyExpenses <= 0 ||
      monthsCovered <= 0
    ) {
      return null
    }
    return {
      category,
      emergencyFundTarget: monthlyExpenses * monthsCovered,
      expression: emergencyFundExpressionFor(monthlyExpenses, monthsCovered),
      monthlyExpenses,
      monthsCovered,
    }
  }

  if (category === "break-even-calculator") {
    const match =
      /^break-even-([0-9]+(?:\.[0-9]+)*)-fixed-([0-9]+(?:\.[0-9]+)*)-price-([0-9]+(?:\.[0-9]+)*)-cost$/.exec(
        decoded
      )
    if (!match) return null
    const fixedCosts = parseNumberToken(match[1] ?? "")
    const unitPrice = parseNumberToken(match[2] ?? "")
    const unitCost = parseNumberToken(match[3] ?? "")
    if (
      fixedCosts === null ||
      unitPrice === null ||
      unitCost === null ||
      fixedCosts <= 0 ||
      unitPrice <= 0 ||
      unitCost < 0 ||
      unitPrice <= unitCost
    ) {
      return null
    }
    const contributionMargin = unitPrice - unitCost
    const unitsToBreakEven = Math.ceil(fixedCosts / contributionMargin)
    return {
      category,
      contributionMargin,
      expression: breakEvenExpressionFor(fixedCosts, unitPrice, unitCost),
      fixedCosts,
      revenueToBreakEven: unitsToBreakEven * unitPrice,
      unitCost,
      unitPrice,
      unitsToBreakEven,
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

function mortgageEntries(): CalculatorEntry[] {
  return MORTGAGE_HOME_PRICES.flatMap((homePrice) =>
    MORTGAGE_RATES.flatMap((annualRate) =>
      MORTGAGE_TERMS.flatMap((termYears) =>
        MORTGAGE_DOWN_PAYMENTS.map((downPaymentPercent) => ({
          category: "mortgage-payment" as const,
          description: buildMetaDescription(
            `Estimate the monthly payment on a ${formatCurrency(homePrice)} home at ${annualRate}% over ${termYears} years with ${downPaymentPercent}% down using a local browser mortgage calculator on Plain Tools.`
          ),
          expression: mortgageExpressionFor(
            homePrice,
            annualRate,
            termYears,
            downPaymentPercent
          ),
          keywords: [
            `mortgage payment ${homePrice} ${annualRate} ${termYears} ${downPaymentPercent} down`,
            "mortgage payment calculator",
            "home loan calculator",
            "monthly mortgage estimate",
          ],
          title: `Mortgage Payment for ${formatCurrency(homePrice)} at ${annualRate}% for ${termYears} Years with ${downPaymentPercent}% Down | Plain Tools`,
        }))
      )
    )
  )
}

function refinanceEntries(): CalculatorEntry[] {
  return REFI_BALANCES.flatMap((balance) =>
    REFI_CURRENT_RATES.flatMap((currentRate) =>
      REFI_NEW_RATES.flatMap((newRate) =>
        REFI_TERMS.flatMap((termYears) => {
          if (newRate >= currentRate) return []
          return [
            {
              category: "refinance-savings" as const,
              description: buildMetaDescription(
                `Estimate refinance savings on ${formatCurrency(balance)} when moving from ${currentRate}% to ${newRate}% over ${termYears} years with a local browser calculator on Plain Tools.`
              ),
              expression: refinanceExpressionFor(balance, currentRate, newRate, termYears),
              keywords: [
                `refinance savings ${balance} ${currentRate} to ${newRate} ${termYears}`,
                "refinance savings calculator",
                "mortgage refinance calculator",
                "monthly refinance savings",
              ],
              title: `Refinance Savings on ${formatCurrency(balance)} from ${currentRate}% to ${newRate}% for ${termYears} Years | Plain Tools`,
            },
          ]
        })
      )
    )
  )
}

function paycheckEstimateEntries(): CalculatorEntry[] {
  return PAYCHECK_SALARIES.flatMap((annualSalary) =>
    PAYCHECK_FREQUENCIES.flatMap((payFrequency) =>
      PAYCHECK_STATE_OPTIONS.map((state) => ({
        category: "paycheck-estimate" as const,
        description: buildMetaDescription(
          `Estimate ${payFrequency} take-home pay on ${formatCurrency(annualSalary)} in ${state.label} with a local browser paycheck calculator on Plain Tools.`
        ),
        expression: paycheckEstimateExpressionFor(annualSalary, payFrequency, state.slug),
        keywords: [
          `paycheck estimate ${annualSalary} ${payFrequency} ${state.slug}`,
          "paycheck calculator",
          "take home pay estimate",
          "salary to paycheck calculator",
        ],
        title: `${formatCurrency(annualSalary)} ${payFrequency} Paycheck Estimate in ${state.label} | Plain Tools`,
      }))
    )
  )
}

function retirement401kEntries(): CalculatorEntry[] {
  return RETIREMENT_401K_SALARIES.flatMap((annualSalary) =>
    RETIREMENT_401K_CONTRIBUTION_PERCENTS.flatMap((contributionPercent) =>
      RETIREMENT_401K_MATCH_PERCENTS.flatMap((employerMatchPercent) =>
        RETIREMENT_401K_RATES.flatMap((annualRate) =>
          RETIREMENT_401K_YEARS.map((years) => ({
            category: "401k-growth" as const,
            description: buildMetaDescription(
              `Estimate 401(k) growth on ${formatCurrency(annualSalary)} salary with ${contributionPercent}% employee contributions, ${employerMatchPercent}% employer match, and ${annualRate}% annual growth over ${years} years using a local browser calculator on Plain Tools.`
            ),
            expression: retirement401kExpressionFor(
              annualSalary,
              contributionPercent,
              employerMatchPercent,
              annualRate,
              years
            ),
            keywords: [
              `401k growth ${annualSalary} salary ${contributionPercent} contribution ${employerMatchPercent} match ${annualRate} ${years}`,
              "401k calculator",
              "retirement contribution calculator",
              "employer match calculator",
            ],
            title: `401(k) Growth on ${formatCurrency(annualSalary)} Salary with ${contributionPercent}% Contribution, ${employerMatchPercent}% Match, and ${annualRate}% for ${years} Years | Plain Tools`,
          }))
        )
      )
    )
  )
}

function autoLoanEntries(): CalculatorEntry[] {
  return AUTO_LOAN_VEHICLE_PRICES.flatMap((vehiclePrice) =>
    AUTO_LOAN_RATES.flatMap((annualRate) =>
      AUTO_LOAN_TERMS_MONTHS.flatMap((termMonths) =>
        AUTO_LOAN_DOWN_PAYMENTS.flatMap((downPaymentAmount) => {
          if (downPaymentAmount >= vehiclePrice) return []
          return [
            {
              category: "auto-loan-payment" as const,
              description: buildMetaDescription(
                `Estimate the auto loan payment on ${formatCurrency(vehiclePrice)} at ${annualRate}% over ${termMonths} months with ${formatCurrency(downPaymentAmount)} down using a local browser calculator on Plain Tools.`
              ),
              expression: autoLoanExpressionFor(
                vehiclePrice,
                annualRate,
                termMonths,
                downPaymentAmount
              ),
              keywords: [
                `auto loan ${vehiclePrice} ${annualRate} ${termMonths} ${downPaymentAmount} down`,
                "car payment calculator",
                "auto loan calculator",
                "vehicle financing estimate",
              ],
              title: `Auto Loan Payment for ${formatCurrency(vehiclePrice)} at ${annualRate}% for ${termMonths} Months with ${formatCurrency(downPaymentAmount)} Down | Plain Tools`,
            },
          ]
        })
      )
    )
  )
}

function studentLoanEntries(): CalculatorEntry[] {
  return STUDENT_LOAN_BALANCES.flatMap((balance) =>
    STUDENT_LOAN_RATES.flatMap((annualRate) =>
      STUDENT_LOAN_TERMS_YEARS.flatMap((termYears) =>
        STUDENT_LOAN_EXTRA_PAYMENTS.map((extraPayment) => ({
          category: "student-loan-payment" as const,
          description: buildMetaDescription(
            `Estimate student loan payoff on ${formatCurrency(balance)} at ${annualRate}% over ${termYears} years with ${formatCurrency(extraPayment)} extra paid each month using a local browser calculator on Plain Tools.`
          ),
          expression: studentLoanExpressionFor(balance, annualRate, termYears, extraPayment),
          keywords: [
            `student loan ${balance} ${annualRate} ${termYears} ${extraPayment} extra`,
            "student loan calculator",
            "student debt payoff calculator",
            "monthly student loan payment",
          ],
          title: `Student Loan Payment for ${formatCurrency(balance)} at ${annualRate}% for ${termYears} Years with ${formatCurrency(extraPayment)} Extra | Plain Tools`,
        }))
      )
    )
  )
}

function debtToIncomeEntries(): CalculatorEntry[] {
  return DEBT_TO_INCOME_ANNUAL_INCOMES.flatMap((annualIncome) =>
    DEBT_TO_INCOME_MONTHLY_DEBT.flatMap((monthlyDebt) =>
      DEBT_TO_INCOME_HOUSING_PAYMENTS.map((housingPayment) => ({
        category: "debt-to-income" as const,
        description: buildMetaDescription(
          `Estimate debt-to-income ratio on ${formatCurrency(annualIncome)} income with ${formatCurrency(monthlyDebt)} in monthly debt and ${formatCurrency(housingPayment)} housing cost using a local browser calculator on Plain Tools.`
        ),
        expression: debtToIncomeExpressionFor(annualIncome, monthlyDebt, housingPayment),
        keywords: [
          `debt to income ${annualIncome} income ${monthlyDebt} debt ${housingPayment} housing`,
          "debt to income calculator",
          "DTI calculator",
          "mortgage qualification ratio",
        ],
        title: `Debt-to-Income Ratio on ${formatCurrency(annualIncome)} Income with ${formatCurrency(monthlyDebt)} Debt and ${formatCurrency(housingPayment)} Housing | Plain Tools`,
      }))
    )
  )
}

function cdEntries(): CalculatorEntry[] {
  return CD_DEPOSITS.flatMap((deposit) =>
    CD_RATES.flatMap((annualRate) =>
      CD_TERM_MONTHS.flatMap((termMonths) =>
        COMPOUNDING_PERIODS.map((compounding) => ({
          category: "cd-calculator" as const,
          description: buildMetaDescription(
            `Estimate CD maturity on ${formatCurrency(deposit)} at ${annualRate}% over ${termMonths} months with ${compounding} compounding using a local browser calculator on Plain Tools.`
          ),
          expression: cdExpressionFor(deposit, annualRate, termMonths, compounding),
          keywords: [
            `cd calculator ${deposit} ${annualRate} ${termMonths} ${compounding}`,
            "certificate of deposit calculator",
            "cd maturity calculator",
            "bank CD growth",
          ],
          title: `CD Growth on ${formatCurrency(deposit)} at ${annualRate}% for ${termMonths} Months (${compounding}) | Plain Tools`,
        }))
      )
    )
  )
}

function apyEntries(): CalculatorEntry[] {
  return APY_DEPOSITS.flatMap((deposit) =>
    APY_RATES.flatMap((annualRate) =>
      APY_YEARS.flatMap((years) =>
        COMPOUNDING_PERIODS.map((compounding) => ({
          category: "apy-calculator" as const,
          description: buildMetaDescription(
            `Estimate APY growth on ${formatCurrency(deposit)} at ${annualRate}% over ${years} years with ${compounding} compounding using a local browser calculator on Plain Tools.`
          ),
          expression: apyExpressionFor(deposit, annualRate, years, compounding),
          keywords: [
            `apy calculator ${deposit} ${annualRate} ${years} ${compounding}`,
            "APY calculator",
            "savings growth calculator",
            "interest growth calculator",
          ],
          title: `APY Growth on ${formatCurrency(deposit)} at ${annualRate}% for ${years} Years (${compounding}) | Plain Tools`,
        }))
      )
    )
  )
}

function iraEntries(): CalculatorEntry[] {
  return IRA_ANNUAL_CONTRIBUTIONS.flatMap((annualContribution) =>
    IRA_RATES.flatMap((annualRate) =>
      IRA_YEARS.flatMap((years) =>
        IRA_ACCOUNT_TYPES.map((accountType) => ({
          category: "ira-growth" as const,
          description: buildMetaDescription(
            `Estimate ${accountType} IRA growth on ${formatCurrency(annualContribution)} contributed annually at ${annualRate}% over ${years} years using a local browser calculator on Plain Tools.`
          ),
          expression: iraExpressionFor(annualContribution, annualRate, years, accountType),
          keywords: [
            `${accountType} ira ${annualContribution} ${annualRate} ${years}`,
            "IRA calculator",
            "roth IRA calculator",
            "traditional IRA calculator",
          ],
          title: `${accountType === "roth" ? "Roth" : "Traditional"} IRA Growth on ${formatCurrency(annualContribution)}/Year at ${annualRate}% for ${years} Years | Plain Tools`,
        }))
      )
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

function emergencyFundEntries(): CalculatorEntry[] {
  return EMERGENCY_FUND_EXPENSES.flatMap((monthlyExpenses) =>
    EMERGENCY_FUND_MONTHS.map((monthsCovered) => ({
      category: "emergency-fund" as const,
      description: buildMetaDescription(
        `Estimate how much emergency savings you may need to cover ${monthsCovered} months of ${formatCurrency(monthlyExpenses)} expenses with a local browser calculator on Plain Tools.`
      ),
      expression: emergencyFundExpressionFor(monthlyExpenses, monthsCovered),
      keywords: [
        `emergency fund ${monthlyExpenses} ${monthsCovered} months`,
        "emergency fund calculator",
        "cash reserve calculator",
        "how much emergency savings",
      ],
      title: `Emergency Fund for ${formatCurrency(monthlyExpenses)}/Month Over ${monthsCovered} Months | Plain Tools`,
    }))
  )
}

function breakEvenEntries(): CalculatorEntry[] {
  return BREAK_EVEN_FIXED_COSTS.flatMap((fixedCosts) =>
    BREAK_EVEN_PRICE_POINTS.flatMap((unitPrice) =>
      BREAK_EVEN_UNIT_COSTS.flatMap((unitCost) => {
        if (unitPrice <= unitCost) return []
        return [
          {
            category: "break-even-calculator" as const,
            description: buildMetaDescription(
              `Estimate break-even units on ${formatCurrency(fixedCosts)} in fixed costs with ${formatCurrency(unitPrice)} price and ${formatCurrency(unitCost)} unit cost using a local browser calculator on Plain Tools.`
            ),
            expression: breakEvenExpressionFor(fixedCosts, unitPrice, unitCost),
            keywords: [
              `break even ${fixedCosts} ${unitPrice} ${unitCost}`,
              "break even calculator",
              "break even point calculator",
              "unit economics calculator",
            ],
            title: `Break-Even Point for ${formatCurrency(fixedCosts)} Fixed Costs at ${formatCurrency(unitPrice)} Price and ${formatCurrency(unitCost)} Cost | Plain Tools`,
          },
        ]
      })
    )
  )
}

const CALCULATOR_TEMPLATES: CalculatorEntry[] = [
  ...percentageEntries(),
  ...tipEntries(),
  ...salaryEntries(),
  ...basicLoanEntries(),
  ...mortgageEntries(),
  ...refinanceEntries(),
  ...paycheckEstimateEntries(),
  ...retirement401kEntries(),
  ...autoLoanEntries(),
  ...studentLoanEntries(),
  ...debtToIncomeEntries(),
  ...cdEntries(),
  ...apyEntries(),
  ...iraEntries(),
  ...simpleInterestEntries(),
  ...compoundEntries(),
  ...retirementEntries(),
  ...taxEstimateEntries(),
  ...creditCardPayoffEntries(),
  ...savingsGoalEntries(),
  ...emergencyFundEntries(),
  ...breakEvenEntries(),
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
    case "mortgage-payment":
      return [
        { href: buildCalculatorPath("mortgage-payment", mortgageExpressionFor(parsed.homePrice, Math.max(2.5, parsed.annualRate - 0.5), parsed.termYears, parsed.downPaymentPercent)), title: `${formatCurrency(parsed.homePrice)} at ${Math.max(2.5, parsed.annualRate - 0.5)}%` },
        { href: buildCalculatorPath("mortgage-payment", mortgageExpressionFor(parsed.homePrice, parsed.annualRate, parsed.termYears, Math.min(40, parsed.downPaymentPercent + 5))), title: `${formatCurrency(parsed.homePrice)} with ${Math.min(40, parsed.downPaymentPercent + 5)}% down` },
        { href: buildCalculatorPath("refinance-savings", refinanceExpressionFor(parsed.loanPrincipal, parsed.annualRate + 0.75, parsed.annualRate, parsed.termYears)), title: "Compare with refinance savings" },
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.downPaymentAmount, 1000, 4)), title: "Save for a similar down payment" },
      ]
    case "refinance-savings":
      return [
        { href: buildCalculatorPath("refinance-savings", refinanceExpressionFor(parsed.balance, parsed.currentRate + 0.5, parsed.newRate, parsed.termYears)), title: `Savings if current rate were ${parsed.currentRate + 0.5}%` },
        { href: buildCalculatorPath("refinance-savings", refinanceExpressionFor(parsed.balance, parsed.currentRate, Math.max(2.5, parsed.newRate - 0.25), parsed.termYears)), title: `Savings at a ${Math.max(2.5, parsed.newRate - 0.25)}% new rate` },
        { href: buildCalculatorPath("mortgage-payment", mortgageExpressionFor(parsed.balance * 1.2, parsed.newRate, parsed.termYears, 20)), title: "Compare with a mortgage payment" },
        { href: buildCalculatorPath("credit-card-payoff", creditCardPayoffExpressionFor(15000, 19.9, 400)), title: "Debt payoff comparison" },
      ]
    case "paycheck-estimate":
      return [
        { href: buildCalculatorPath("paycheck-estimate", paycheckEstimateExpressionFor(parsed.annualSalary + 5000, parsed.payFrequency, parsed.state)), title: `Paycheck estimate at ${formatCurrency(parsed.annualSalary + 5000)}` },
        { href: buildCalculatorPath("paycheck-estimate", paycheckEstimateExpressionFor(parsed.annualSalary, "monthly", parsed.state)), title: "Monthly paycheck estimate" },
        { href: buildCalculatorPath("salary-to-hourly", salaryExpressionFor(parsed.annualSalary, 40)), title: "Gross salary to hourly comparison" },
        { href: buildCalculatorPath("tax-estimate-simple", taxEstimateExpressionFor(parsed.annualSalary, "single")), title: "Simple tax estimate comparison" },
      ]
    case "401k-growth":
      return [
        { href: buildCalculatorPath("401k-growth", retirement401kExpressionFor(parsed.annualSalary, parsed.contributionPercent + 1, parsed.employerMatchPercent, parsed.annualRate, parsed.years)), title: `401(k) at ${parsed.contributionPercent + 1}% employee contribution` },
        { href: buildCalculatorPath("401k-growth", retirement401kExpressionFor(parsed.annualSalary, parsed.contributionPercent, parsed.employerMatchPercent, parsed.annualRate + 1, parsed.years)), title: `401(k) at ${parsed.annualRate + 1}% annual growth` },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(Math.round(parsed.totalAnnualContribution / 12), Math.max(2, parsed.annualRate), parsed.years)), title: "Retirement savings comparison" },
        { href: buildCalculatorPath("ira-growth", iraExpressionFor(Math.min(8000, Math.round(parsed.employeeAnnualContribution)), parsed.annualRate, parsed.years, "roth")), title: "Compare with a Roth IRA scenario" },
      ]
    case "auto-loan-payment":
      return [
        { href: buildCalculatorPath("auto-loan-payment", autoLoanExpressionFor(parsed.vehiclePrice, Math.max(1.9, parsed.annualRate - 0.5), parsed.termMonths, parsed.downPaymentAmount)), title: `${formatCurrency(parsed.vehiclePrice)} at ${Math.max(1.9, parsed.annualRate - 0.5)}%` },
        { href: buildCalculatorPath("auto-loan-payment", autoLoanExpressionFor(parsed.vehiclePrice, parsed.annualRate, parsed.termMonths, parsed.downPaymentAmount + 2500)), title: `${formatCurrency(parsed.vehiclePrice)} with ${formatCurrency(parsed.downPaymentAmount + 2500)} down` },
        { href: buildCalculatorPath("basic-loan-payment", basicLoanExpressionFor(parsed.loanPrincipal, parsed.annualRate, Math.max(1, Math.round(parsed.termMonths / 12)))), title: "Basic loan comparison" },
        { href: buildCalculatorPath("debt-to-income", debtToIncomeExpressionFor(90000, 850, parsed.monthlyPayment)), title: "Check debt-to-income impact" },
      ]
    case "student-loan-payment":
      return [
        { href: buildCalculatorPath("student-loan-payment", studentLoanExpressionFor(parsed.balance, parsed.annualRate, parsed.termYears, parsed.extraPayment + 50)), title: `Add ${formatCurrency(parsed.extraPayment + 50)} extra each month` },
        { href: buildCalculatorPath("student-loan-payment", studentLoanExpressionFor(parsed.balance, Math.max(2, parsed.annualRate - 0.5), parsed.termYears, parsed.extraPayment)), title: `${formatCurrency(parsed.balance)} at ${Math.max(2, parsed.annualRate - 0.5)}%` },
        { href: buildCalculatorPath("credit-card-payoff", creditCardPayoffExpressionFor(Math.min(60000, parsed.balance), Math.max(9, parsed.annualRate + 6), Math.max(100, Math.round(parsed.monthlyPayment)))), title: "Credit card payoff comparison" },
        { href: buildCalculatorPath("paycheck-estimate", paycheckEstimateExpressionFor(85000, "biweekly", "texas")), title: "Compare against a paycheck estimate" },
      ]
    case "debt-to-income":
      return [
        { href: buildCalculatorPath("debt-to-income", debtToIncomeExpressionFor(parsed.annualIncome + 10000, parsed.monthlyDebt, parsed.housingPayment)), title: `Debt-to-income on ${formatCurrency(parsed.annualIncome + 10000)}` },
        { href: buildCalculatorPath("debt-to-income", debtToIncomeExpressionFor(parsed.annualIncome, parsed.monthlyDebt, parsed.housingPayment + 250)), title: `Debt-to-income with ${formatCurrency(parsed.housingPayment + 250)} housing` },
        { href: buildCalculatorPath("mortgage-payment", mortgageExpressionFor(450000, 6.25, 30, 20)), title: "Mortgage payment comparison" },
        { href: buildCalculatorPath("auto-loan-payment", autoLoanExpressionFor(35000, 6.5, 72, 5000)), title: "Auto loan comparison" },
      ]
    case "cd-calculator":
      return [
        { href: buildCalculatorPath("cd-calculator", cdExpressionFor(parsed.deposit, Math.max(1, parsed.annualRate - 0.25), parsed.termMonths, parsed.compounding)), title: `${formatCurrency(parsed.deposit)} at ${Math.max(1, parsed.annualRate - 0.25)}%` },
        { href: buildCalculatorPath("cd-calculator", cdExpressionFor(parsed.deposit, parsed.annualRate, parsed.termMonths + 6, parsed.compounding)), title: `${formatCurrency(parsed.deposit)} for ${parsed.termMonths + 6} months` },
        { href: buildCalculatorPath("apy-calculator", apyExpressionFor(parsed.deposit, parsed.annualRate, Math.max(1, Math.round(parsed.termMonths / 12)), parsed.compounding)), title: "APY growth comparison" },
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.deposit * 2, Math.max(100, Math.round(parsed.deposit / 24)), parsed.annualRate)), title: "Savings goal comparison" },
      ]
    case "apy-calculator":
      return [
        { href: buildCalculatorPath("apy-calculator", apyExpressionFor(parsed.deposit, Math.max(1, parsed.annualRate - 0.25), parsed.years, parsed.compounding)), title: `${formatCurrency(parsed.deposit)} at ${Math.max(1, parsed.annualRate - 0.25)}%` },
        { href: buildCalculatorPath("apy-calculator", apyExpressionFor(parsed.deposit, parsed.annualRate, parsed.years + 2, parsed.compounding)), title: `${formatCurrency(parsed.deposit)} for ${parsed.years + 2} years` },
        { href: buildCalculatorPath("cd-calculator", cdExpressionFor(parsed.deposit, parsed.annualRate, Math.max(12, parsed.years * 12), parsed.compounding)), title: "CD maturity comparison" },
        { href: buildCalculatorPath("compound-interest-basic", compoundExpressionFor(parsed.deposit, parsed.annualRate, parsed.years, parsed.compounding)), title: "Compound growth comparison" },
      ]
    case "ira-growth":
      return [
        { href: buildCalculatorPath("ira-growth", iraExpressionFor(Math.min(8000, parsed.annualContribution + 500), parsed.annualRate, parsed.years, parsed.accountType)), title: `${formatCurrency(Math.min(8000, parsed.annualContribution + 500))}/year in the same IRA` },
        { href: buildCalculatorPath("ira-growth", iraExpressionFor(parsed.annualContribution, parsed.annualRate + 1, parsed.years, parsed.accountType)), title: `${parsed.accountType === "roth" ? "Roth" : "Traditional"} IRA at ${parsed.annualRate + 1}%` },
        { href: buildCalculatorPath("401k-growth", retirement401kExpressionFor(90000, 8, 4, parsed.annualRate, Math.min(35, parsed.years))), title: "401(k) growth comparison" },
        { href: buildCalculatorPath("retirement-savings-intro", retirementExpressionFor(Math.round(parsed.annualContribution / 12), parsed.annualRate, parsed.years)), title: "Retirement savings comparison" },
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
    case "emergency-fund":
      return [
        { href: buildCalculatorPath("emergency-fund", emergencyFundExpressionFor(parsed.monthlyExpenses, Math.max(3, parsed.monthsCovered - 1))), title: `${formatCurrency(parsed.monthlyExpenses)}/month for ${Math.max(3, parsed.monthsCovered - 1)} months` },
        { href: buildCalculatorPath("emergency-fund", emergencyFundExpressionFor(parsed.monthlyExpenses, parsed.monthsCovered + 1)), title: `${formatCurrency(parsed.monthlyExpenses)}/month for ${parsed.monthsCovered + 1} months` },
        { href: buildCalculatorPath("savings-goal", savingsGoalExpressionFor(parsed.emergencyFundTarget, 500, 4)), title: "Turn this target into a savings goal" },
        { href: buildCalculatorPath("paycheck-estimate", paycheckEstimateExpressionFor(85000, "biweekly", "texas")), title: "Check a paycheck estimate" },
      ]
    case "break-even-calculator":
      return [
        { href: buildCalculatorPath("break-even-calculator", breakEvenExpressionFor(parsed.fixedCosts, parsed.unitPrice + 10, parsed.unitCost)), title: `Break even with ${formatCurrency(parsed.unitPrice + 10)} price` },
        { href: buildCalculatorPath("break-even-calculator", breakEvenExpressionFor(parsed.fixedCosts, parsed.unitPrice, Math.max(1, parsed.unitCost - 5))), title: `Break even with ${formatCurrency(Math.max(1, parsed.unitCost - 5))} unit cost` },
        { href: buildCalculatorPath("percentage", percentageExpressionFor(25, parsed.unitPrice)), title: "Margin percentage example" },
        { href: buildCalculatorPath("simple-interest", simpleInterestExpressionFor(parsed.fixedCosts, 6, 3)), title: "Financing cost comparison" },
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

  if (parsed.category === "mortgage-payment") {
    const scenarioText = `${formatCurrency(parsed.homePrice)} home at ${formatPercent(parsed.annualRate)} for ${formatNumber(parsed.termYears)} years with ${formatPercent(parsed.downPaymentPercent)} down`
    intro = [
      "Mortgage-payment routes are some of the strongest finance SEO pages because the user is already close to a real housing decision. They usually want a fast first-pass estimate for one exact home price, rate, term, and down-payment mix.",
      `For ${scenarioText}, the estimated loan amount is ${formatCurrency(parsed.loanPrincipal)} and the projected monthly principal-and-interest payment is about ${formatCurrency(parsed.monthlyPayment)}. Over the full term, total paid would be about ${formatCurrency(parsed.totalPaid)} with roughly ${formatCurrency(parsed.totalInterest)} in interest.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The page is useful because mortgage affordability questions are rarely abstract. Buyers test one listing price, one down payment, and one rate quote at a time.",
      "That exact-match structure fits programmatic expansion well and supports stronger RPM than generic math pages because the intent sits close to lenders, refinancing, insurance, and home-search decisions.",
    ]
    howItWorks = [
      "The calculator subtracts the down payment from the home price, then applies the standard amortizing payment formula to the remaining principal over the selected term.",
      "This page is intentionally first-pass and keeps the model simple. It is useful for comparing scenarios quickly before moving into more detailed property-tax, insurance, or amortization planning.",
    ]
    howToSteps = [
      { name: "Enter the home price", text: `This route starts from ${formatCurrency(parsed.homePrice)}.` },
      { name: "Set the down payment", text: `The down payment assumption is ${formatPercent(parsed.downPaymentPercent)}, or ${formatCurrency(parsed.downPaymentAmount)}.` },
      { name: "Set rate and term", text: `The example uses ${formatPercent(parsed.annualRate)} over ${formatNumber(parsed.termYears)} years.` },
      { name: "Review the monthly payment", text: `Estimated principal-and-interest payment is ${formatCurrency(parsed.monthlyPayment)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why mortgage pages are high-intent utility routes",
      [
        "Mortgage pages work because buyers, refinancers, and agents often need one exact scenario instead of a broad explainer. A useful route answers that scenario cleanly and then offers obvious nearby comparisons.",
        "That makes the page both practical for users and commercially valuable for search because the query sits close to a major financial decision.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when users are comparing home budgets, down payments, or financing options on shared devices.",
      "The browser-first model also keeps the route fast enough for quick listing-by-listing comparisons.",
    ]
    faq = [
      { question: `What is the mortgage payment on ${formatCurrency(parsed.homePrice)} with ${parsed.downPaymentPercent}% down?`, answer: `At ${formatPercent(parsed.annualRate)} for ${formatNumber(parsed.termYears)} years, this route estimates about ${formatCurrency(parsed.monthlyPayment)} per month before taxes and insurance.` },
      { question: "Does this include taxes, insurance, or HOA fees?", answer: "No. This page focuses on principal and interest so users can compare financing assumptions quickly." },
      { question: "Why show down payment and loan amount separately?", answer: "Because buyers often need to compare how a larger down payment changes both the financed balance and the monthly payment." },
      { question: "Can I compare another rate quickly?", answer: "Yes. The related links and embedded calculator are built around nearby rate and down-payment comparisons." },
      { question: "Does the page send home-price details anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "Refinance-savings, savings-goal, and paycheck-estimate routes are common next steps after a mortgage estimate." },
    ]
    summaryRows = [
      { label: "Home price", value: formatCurrency(parsed.homePrice) },
      { label: "Down payment", value: formatCurrency(parsed.downPaymentAmount) },
      { label: "Loan amount", value: formatCurrency(parsed.loanPrincipal) },
      { label: "Rate", value: formatPercent(parsed.annualRate) },
      { label: "Monthly payment", value: formatCurrency(parsed.monthlyPayment) },
      { label: "Total interest", value: formatCurrency(parsed.totalInterest) },
    ]
    initialValues = {
      homePrice: parsed.homePrice,
      annualRate: parsed.annualRate,
      termYears: parsed.termYears,
      downPaymentPercent: parsed.downPaymentPercent,
    }
    h1 = `Mortgage Payment for ${formatCurrency(parsed.homePrice)} at ${parsed.annualRate}% for ${parsed.termYears} Years with ${parsed.downPaymentPercent}% Down`
  }

  if (parsed.category === "refinance-savings") {
    const scenarioText = `${formatCurrency(parsed.balance)} refinanced from ${formatPercent(parsed.currentRate)} to ${formatPercent(parsed.newRate)} over ${formatNumber(parsed.termYears)} years`
    intro = [
      "Refinance-savings routes work because homeowners usually want to know whether a new quote is worth taking seriously before they spend time on lender paperwork. The key question is simple: how much could the monthly payment move if the rate drops?",
      `For ${scenarioText}, the estimated payment falls from about ${formatCurrency(parsed.currentMonthlyPayment)} to ${formatCurrency(parsed.newMonthlyPayment)}. That is a monthly difference of roughly ${formatCurrency(parsed.monthlySavings)} and a term-level savings estimate near ${formatCurrency(parsed.totalSavings)} if the assumptions hold.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The route is useful because it translates a rate quote into a concrete monthly and total savings number. That is much easier to act on than comparing APRs in isolation.",
      "It also captures high-value refinance intent without pretending to replace a full closing-cost or lender-fee analysis.",
    ]
    howItWorks = [
      "The calculator runs the payment formula twice on the same balance and term: once with the current rate and once with the new rate. The difference becomes the estimated monthly savings.",
      "This is intentionally a first-pass savings page. It does not model closing costs, escrow resets, or term changes beyond the selected years.",
    ]
    howToSteps = [
      { name: "Enter the current balance", text: `This route uses ${formatCurrency(parsed.balance)}.` },
      { name: "Compare current and new rate", text: `The rate change here is ${formatPercent(parsed.currentRate)} down to ${formatPercent(parsed.newRate)}.` },
      { name: "Keep the term in view", text: `The selected term is ${formatNumber(parsed.termYears)} years.` },
      { name: "Review monthly and total savings", text: `Estimated monthly savings are ${formatCurrency(parsed.monthlySavings)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why refinance-savings pages convert well",
      [
        "A refinance page works when it turns one lender quote into a decision-ready savings estimate. Users usually need that screen before they decide whether to ask for a full offer.",
        "That makes the route commercially valuable while still staying narrow, fast, and honest about what it does not include.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That keeps mortgage balances and quote comparisons private.",
      "It also makes quick lender-to-lender comparisons easier on mobile or during a fast rate-shopping session.",
    ]
    faq = [
      { question: `How much could I save by refinancing ${formatCurrency(parsed.balance)}?`, answer: `This route estimates about ${formatCurrency(parsed.monthlySavings)} per month when moving from ${formatPercent(parsed.currentRate)} to ${formatPercent(parsed.newRate)} over ${formatNumber(parsed.termYears)} years.` },
      { question: "Does this include closing costs?", answer: "No. The page compares payment differences only and is meant as a first-pass savings check." },
      { question: "Why compare monthly savings and total savings?", answer: "Because some borrowers care about immediate cash-flow relief while others want to see the longer-term impact." },
      { question: "Can I compare another new rate quickly?", answer: "Yes. The related links and embedded calculator are built for that exact follow-up." },
      { question: "Does the page send refinance details anywhere?", answer: "No. All calculations stay local in the browser." },
      { question: "What should I check next?", answer: "Mortgage-payment and paycheck-estimate pages are common next steps after a refinance comparison." },
    ]
    summaryRows = [
      { label: "Balance", value: formatCurrency(parsed.balance) },
      { label: "Current payment", value: formatCurrency(parsed.currentMonthlyPayment) },
      { label: "New payment", value: formatCurrency(parsed.newMonthlyPayment) },
      { label: "Monthly savings", value: formatCurrency(parsed.monthlySavings) },
      { label: "Term", value: `${formatNumber(parsed.termYears)} years` },
      { label: "Total savings", value: formatCurrency(parsed.totalSavings) },
    ]
    initialValues = {
      balance: parsed.balance,
      currentRate: parsed.currentRate,
      newRate: parsed.newRate,
      termYears: parsed.termYears,
    }
    h1 = `Refinance Savings on ${formatCurrency(parsed.balance)} from ${parsed.currentRate}% to ${parsed.newRate}% for ${parsed.termYears} Years`
  }

  if (parsed.category === "paycheck-estimate") {
    const stateLabel =
      PAYCHECK_STATE_OPTIONS.find((entry) => entry.slug === parsed.state)?.label ?? parsed.state
    const scenarioText = `${formatCurrency(parsed.annualSalary)} paid ${parsed.payFrequency} in ${stateLabel}`
    intro = [
      "Paycheck-estimate routes work because users often think in per-paycheck cash flow, not just annual salary. They want a quick gross-to-net view for one exact income, pay schedule, and state context.",
      `For ${scenarioText}, the estimated gross paycheck is about ${formatCurrency(parsed.grossPaycheck)} and the estimated take-home paycheck is about ${formatCurrency(parsed.netPaycheck)} using a simple combined rate model of ${formatPercent(parsed.effectiveRate)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This page is useful because offer comparisons, raise discussions, and freelance-to-payroll decisions often depend more on paycheck cadence than on annual salary alone.",
      "It also fits high-RPM finance intent well because the user is closer to payroll, tax, budgeting, banking, and employment decisions than on a generic salary page.",
    ]
    howItWorks = [
      "The calculator estimates an effective federal rate, adds a simple state rate assumption, then divides annual gross and annual net across the selected pay frequency.",
      "It is intentionally simplified and meant for first-pass planning. Withholding settings, benefits, pre-tax deductions, and local taxes can change the real paycheck.",
    ]
    howToSteps = [
      { name: "Enter the annual salary", text: `This route starts from ${formatCurrency(parsed.annualSalary)}.` },
      { name: "Choose the pay frequency", text: `The selected pay schedule is ${parsed.payFrequency}.` },
      { name: "Choose the state context", text: `This example uses ${stateLabel}.` },
      { name: "Review gross and estimated net pay", text: `Estimated take-home per paycheck is ${formatCurrency(parsed.netPaycheck)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why paycheck pages are practical finance utilities",
      [
        "A paycheck page works when it connects salary intent to real budgeting. Users want to know what lands in the account, not only what sits in the offer letter.",
        "That makes the route more actionable than a generic tax explainer while still staying simpler than payroll software or a full withholding worksheet.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when users are comparing offers, promotions, or compensation scenarios.",
      "The browser-only model keeps the route private enough for quick checks on work devices and fast enough for repeated comparisons.",
    ]
    faq = [
      { question: `What is the paycheck estimate on ${formatCurrency(parsed.annualSalary)} in ${stateLabel}?`, answer: `At ${parsed.payFrequency} pay, this route estimates about ${formatCurrency(parsed.netPaycheck)} take-home per paycheck before deductions and withholding details are customized further.` },
      { question: "Does this include benefits or pre-tax deductions?", answer: "No. The page uses a simplified effective-rate model and should be treated as a first-pass estimate." },
      { question: "Why show gross and net paycheck?", answer: "Because users often need to compare the paycheck reduction directly rather than only the annual after-tax total." },
      { question: "Can I compare a different state or pay schedule quickly?", answer: "Yes. The embedded calculator and related links are designed for that exact next step." },
      { question: "Does the page send salary details anywhere?", answer: "No. All calculations stay local in the browser." },
      { question: "What should I check next?", answer: "Tax-estimate-simple, salary-to-hourly, and emergency-fund pages are common next steps after a paycheck estimate." },
    ]
    summaryRows = [
      { label: "Annual salary", value: formatCurrency(parsed.annualSalary) },
      { label: "Pay frequency", value: parsed.payFrequency },
      { label: "State rate", value: formatPercent(parsed.stateRate) },
      { label: "Estimated effective rate", value: formatPercent(parsed.effectiveRate) },
      { label: "Gross paycheck", value: formatCurrency(parsed.grossPaycheck) },
      { label: "Net paycheck", value: formatCurrency(parsed.netPaycheck) },
    ]
    initialValues = {
      annualSalary: parsed.annualSalary,
      payFrequency: parsed.payFrequency,
      state: parsed.state,
    }
    h1 = `${formatCurrency(parsed.annualSalary)} ${parsed.payFrequency} Paycheck Estimate in ${stateLabel}`
  }

  if (parsed.category === "401k-growth") {
    const scenarioText = `${formatCurrency(parsed.annualSalary)} salary with ${formatPercent(parsed.contributionPercent)} employee contributions, ${formatPercent(parsed.employerMatchPercent)} employer match, and ${formatPercent(parsed.annualRate)} annual growth over ${parsed.years} years`
    intro = [
      "401(k) growth pages capture high-value finance intent because the user is usually thinking about retirement readiness, employer benefits, and contribution decisions at the same time. They want a fast directional answer before moving into a full planning stack.",
      `For ${scenarioText}, this route estimates about ${formatCurrency(parsed.futureValue)} in projected 401(k) value. The model assumes annual employee contributions of ${formatCurrency(parsed.employeeAnnualContribution)} and employer match contributions of ${formatCurrency(parsed.employerAnnualMatch)} for a combined annual contribution of ${formatCurrency(parsed.totalAnnualContribution)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The useful part of a 401(k) page is not only the future balance. It is the visibility into how employee contribution rate, employer match, and market-return assumptions interact in one exact scenario.",
      "That makes this cluster a strong RPM fit because it sits near retirement planning, payroll benefits, brokerages, and workplace finance research without trying to replace professional advice.",
    ]
    howItWorks = [
      "The calculator converts annual employee and employer contributions into a monthly savings stream, then applies the chosen annual growth rate over the selected time horizon. It is intentionally a first-pass compounding model rather than a full plan simulator.",
      "That scope keeps the page clear enough for long-tail SEO while still giving the user a meaningful number they can compare against nearby contribution and match assumptions.",
    ]
    howToSteps = [
      { name: "Enter annual salary", text: `This route starts from ${formatCurrency(parsed.annualSalary)} per year.` },
      { name: "Set employee and employer contribution rates", text: `The example uses ${formatPercent(parsed.contributionPercent)} employee contributions and ${formatPercent(parsed.employerMatchPercent)} employer match.` },
      { name: "Set return and time horizon", text: `The page assumes ${formatPercent(parsed.annualRate)} annual growth across ${parsed.years} years.` },
      { name: "Review total annual contributions and projected value", text: `Combined annual contributions are ${formatCurrency(parsed.totalAnnualContribution)} and the projected account value is about ${formatCurrency(parsed.futureValue)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why 401(k) pages are strong high-intent retirement utilities",
      [
        "The user usually arrives with one concrete question: what happens if I contribute a little more, get a better match, or keep the same plan running for longer? Exact-match routes answer that faster than a generic retirement explainer.",
        "These pages are also naturally useful to revisit after a raise, a benefits enrollment window, or a compensation review, which creates stronger repeat utility than a one-time article read.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when users are modeling salary, employer benefits, and retirement assumptions on a work device.",
      "The local workflow keeps the page fast enough for quick scenario comparisons during open enrollment or offer review.",
    ]
    faq = [
      { question: "How is 401(k) growth estimated on this page?", answer: "The route estimates employee contributions from salary and contribution percentage, adds a simple employer match percentage, and then projects the total using the selected annual return assumption. It is intended as a first-pass growth screen rather than a full retirement plan simulation with vesting, fees, and tax detail." },
      { question: `What does ${formatPercent(parsed.employerMatchPercent)} employer match mean here?`, answer: `On this page it acts as an additional contribution percentage tied to salary, which keeps the estimate easy to compare across nearby scenarios. Real employer match rules can be more specific, so the result should be treated as directional rather than final plan advice.` },
      { question: "Why compare employee contribution rate and growth rate separately?", answer: "Because those are usually the two fastest levers the user can sanity-check without changing jobs or redesigning the whole retirement plan. A strong programmatic page makes those adjacent comparisons easy instead of hiding them behind a blank form." },
      { question: "Does this page send salary or retirement data anywhere?", answer: "No. All calculations happen locally in the browser with nothing uploaded, stored, or synced." },
      { question: "What should I check next?", answer: "IRA-growth, retirement-savings-intro, and paycheck-estimate pages are common follow-up routes after a 401(k) estimate." },
    ]
    summaryRows = [
      { label: "Annual salary", value: formatCurrency(parsed.annualSalary) },
      { label: "Employee contribution", value: formatPercent(parsed.contributionPercent) },
      { label: "Employer match", value: formatPercent(parsed.employerMatchPercent) },
      { label: "Combined annual contribution", value: formatCurrency(parsed.totalAnnualContribution) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Projected value", value: formatCurrency(parsed.futureValue) },
    ]
    initialValues = {
      annualSalary: parsed.annualSalary,
      contributionPercent: parsed.contributionPercent,
      employerMatchPercent: parsed.employerMatchPercent,
      annualRate: parsed.annualRate,
      years: parsed.years,
    }
    h1 = `401(k) Growth on ${formatCurrency(parsed.annualSalary)} Salary with ${parsed.contributionPercent}% Contribution, ${parsed.employerMatchPercent}% Match, and ${parsed.annualRate}% for ${parsed.years} Years`
  }

  if (parsed.category === "auto-loan-payment") {
    const scenarioText = `${formatCurrency(parsed.vehiclePrice)} financed at ${formatPercent(parsed.annualRate)} over ${parsed.termMonths} months with ${formatCurrency(parsed.downPaymentAmount)} down`
    intro = [
      "Auto-loan pages work because the user usually wants to translate sticker price into a payment they can compare against budget immediately. They are not looking for a dealership flow; they want a fast, exact first-pass answer.",
      `For ${scenarioText}, the financed amount is ${formatCurrency(parsed.loanPrincipal)} and the estimated monthly payment is about ${formatCurrency(parsed.monthlyPayment)}. Total interest across the term is about ${formatCurrency(parsed.totalInterest)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This route is useful because it makes the tradeoff between price, down payment, and term explicit in one exact scenario. That is more actionable than a generic auto-finance article.",
      "It also fits strong lender, insurance, and budgeting advertiser demand while staying simple enough for a browser-first utility page.",
    ]
    howItWorks = [
      "The calculator subtracts the down payment from the vehicle price to find the financed principal, then applies the standard amortized monthly payment formula across the selected term length.",
      "It does not attempt to model taxes, registration, dealer add-ons, or insurance. The goal is a fast directional payment estimate tied to one exact financing setup.",
    ]
    howToSteps = [
      { name: "Enter vehicle price", text: `This route starts from ${formatCurrency(parsed.vehiclePrice)}.` },
      { name: "Set the down payment", text: `The example uses ${formatCurrency(parsed.downPaymentAmount)} down, leaving ${formatCurrency(parsed.loanPrincipal)} financed.` },
      { name: "Set APR and loan term", text: `The page assumes ${formatPercent(parsed.annualRate)} across ${parsed.termMonths} months.` },
      { name: "Review monthly payment and total interest", text: `Estimated monthly payment is ${formatCurrency(parsed.monthlyPayment)} with about ${formatCurrency(parsed.totalInterest)} in total interest.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why auto-loan pages convert well",
      [
        "The searcher often has a real purchase in front of them and needs to know whether a slightly cheaper vehicle, bigger down payment, or shorter term changes the monthly payment enough to matter.",
        "That practical intent makes exact-match auto-loan routes more useful than thin rate tables, especially when the page also surfaces debt-to-income and nearby financing comparisons.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That helps when users are comparing price and financing assumptions on a dealership floor or shared device.",
      "The local model also keeps the page quick for repeated what-if checks across nearby prices and down-payment amounts.",
    ]
    faq = [
      { question: `What is the auto loan payment on ${formatCurrency(parsed.vehiclePrice)} with ${formatCurrency(parsed.downPaymentAmount)} down?`, answer: `At ${formatPercent(parsed.annualRate)} over ${parsed.termMonths} months, this page estimates about ${formatCurrency(parsed.monthlyPayment)} per month on a financed amount of ${formatCurrency(parsed.loanPrincipal)}. It is a fast directional estimate and does not include taxes, fees, or insurance.` },
      { question: "Why show total interest as well as monthly payment?", answer: "Because many users can make a payment fit by stretching the term, but the interest cost can change materially. A useful page makes that tradeoff visible instead of hiding it." },
      { question: "Should I compare a higher down payment or a shorter term first?", answer: "Both can matter, but they change the result differently. A larger down payment reduces the amount financed immediately, while a shorter term usually lowers total interest but can raise the monthly payment." },
      { question: "Does this page send my financing scenario anywhere?", answer: "No. All calculations happen locally in the browser with nothing uploaded." },
      { question: "What should I check next?", answer: "Debt-to-income and paycheck-estimate pages are common next steps after an auto-loan estimate." },
    ]
    summaryRows = [
      { label: "Vehicle price", value: formatCurrency(parsed.vehiclePrice) },
      { label: "Down payment", value: formatCurrency(parsed.downPaymentAmount) },
      { label: "Loan principal", value: formatCurrency(parsed.loanPrincipal) },
      { label: "APR", value: formatPercent(parsed.annualRate) },
      { label: "Monthly payment", value: formatCurrency(parsed.monthlyPayment) },
      { label: "Total interest", value: formatCurrency(parsed.totalInterest) },
    ]
    initialValues = {
      vehiclePrice: parsed.vehiclePrice,
      annualRate: parsed.annualRate,
      termMonths: parsed.termMonths,
      downPaymentAmount: parsed.downPaymentAmount,
    }
    h1 = `Auto Loan Payment for ${formatCurrency(parsed.vehiclePrice)} at ${parsed.annualRate}% for ${parsed.termMonths} Months with ${formatCurrency(parsed.downPaymentAmount)} Down`
  }

  if (parsed.category === "student-loan-payment") {
    const scenarioText = `${formatCurrency(parsed.balance)} at ${formatPercent(parsed.annualRate)} over ${parsed.termYears} years with ${formatCurrency(parsed.extraPayment)} extra each month`
    intro = [
      "Student-loan pages work because borrowers usually want to understand how term length and extra monthly payments change the path out of debt. They are often comparing one real balance against a few nearby payoff strategies.",
      `For ${scenarioText}, the estimated monthly payment is about ${formatCurrency(parsed.monthlyPayment)} and the projected payoff time is about ${formatNumber(parsed.monthsToPayoff)} months. Interest paid over that payoff path is roughly ${formatCurrency(parsed.interestPaid)}.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This route is more useful than a generic debt article because it ties the payoff math to one exact balance, rate, term, and extra-payment decision.",
      "That makes it a strong fit for high-RPM finance traffic around refinancing, debt payoff, employer benefits, and budgeting decisions.",
    ]
    howItWorks = [
      "The calculator first estimates the standard payment for the selected balance, rate, and term. It then adds the chosen extra monthly payment and simulates payoff month by month to estimate interest paid and total time to zero.",
      "This is still a simple consumer calculator. It does not model deferment, income-driven plans, capitalization events, or multiple separate loan tranches.",
    ]
    howToSteps = [
      { name: "Enter the loan balance", text: `This route starts from ${formatCurrency(parsed.balance)}.` },
      { name: "Set rate and term", text: `The page assumes ${formatPercent(parsed.annualRate)} over ${parsed.termYears} years.` },
      { name: "Add optional extra payment", text: `The example includes ${formatCurrency(parsed.extraPayment)} extra each month, taking the total payment to ${formatCurrency(parsed.monthlyPayment)}.` },
      { name: "Review payoff timeline and interest", text: `Projected payoff time is about ${formatNumber(parsed.monthsToPayoff)} months with roughly ${formatCurrency(parsed.interestPaid)} in interest.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why student-loan pages need payoff framing",
      [
        "The interesting part is usually not the scheduled payment by itself. It is whether a modest extra payment meaningfully changes the payoff date and total interest cost.",
        "That is why exact-match student-loan routes can support better engagement than generic educational content: the user is acting on a real debt-management decision.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when users are reviewing debt payoff options on a work device or shared computer.",
      "The browser-only approach also makes it easier to test nearby extra-payment scenarios without handing account data to a third party.",
    ]
    faq = [
      { question: "How is the student-loan payoff time estimated?", answer: "The page estimates a base monthly payment from the selected balance, rate, and term, then adds any extra monthly payment and simulates the balance month by month until it reaches zero. That gives a directional payoff timeline and total interest estimate." },
      { question: `What does ${formatCurrency(parsed.extraPayment)} extra per month do in this scenario?`, answer: `It raises the monthly payment from about ${formatCurrency(parsed.baseMonthlyPayment)} to about ${formatCurrency(parsed.monthlyPayment)}, which can shorten the payoff timeline and reduce total interest. The page is meant to make that tradeoff visible quickly.` },
      { question: "Does this page model student-loan forgiveness or special repayment plans?", answer: "No. This cluster is intentionally limited to straightforward payoff math so the result stays clear and comparable across nearby scenarios." },
      { question: "Does the page send debt information anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "Credit-card-payoff, refinance-savings, and paycheck-estimate pages are common next steps after a student-loan estimate." },
    ]
    summaryRows = [
      { label: "Balance", value: formatCurrency(parsed.balance) },
      { label: "APR", value: formatPercent(parsed.annualRate) },
      { label: "Base payment", value: formatCurrency(parsed.baseMonthlyPayment) },
      { label: "Extra payment", value: formatCurrency(parsed.extraPayment) },
      { label: "Total monthly payment", value: formatCurrency(parsed.monthlyPayment) },
      { label: "Payoff time", value: `${formatNumber(parsed.monthsToPayoff)} months` },
    ]
    initialValues = {
      balance: parsed.balance,
      annualRate: parsed.annualRate,
      termYears: parsed.termYears,
      extraPayment: parsed.extraPayment,
    }
    h1 = `Student Loan Payment for ${formatCurrency(parsed.balance)} at ${parsed.annualRate}% for ${parsed.termYears} Years with ${formatCurrency(parsed.extraPayment)} Extra`
  }

  if (parsed.category === "debt-to-income") {
    const scenarioText = `${formatCurrency(parsed.annualIncome)} income with ${formatCurrency(parsed.monthlyDebt)} monthly debt and ${formatCurrency(parsed.housingPayment)} housing payment`
    intro = [
      "Debt-to-income pages work because users often need a quick approval-style ratio before they apply for a mortgage, auto loan, or refinance. They want to see how current obligations compare with gross monthly income without opening a lender portal.",
      `For ${scenarioText}, the total monthly obligation is ${formatCurrency(parsed.totalMonthlyObligations)} and the estimated debt-to-income ratio is ${formatPercent(parsed.dtiRatio)}. That gives the user a simple screening number for comparing nearby income and housing scenarios.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The value of a DTI page is its clarity. It turns income and recurring obligations into one ratio the user can compare against qualification rules, underwriting guidance, or personal budget limits.",
      "This cluster also supports high-RPM lending intent because it sits close to mortgage qualification, refinancing, credit, and auto-finance research.",
    ]
    howItWorks = [
      "The calculator divides total monthly obligations by gross monthly income. In this simplified version, total obligations are the sum of recurring monthly debt and the selected housing payment.",
      "The route is meant for fast screening rather than final underwriting. Real lenders may include or exclude additional obligations depending on the product and borrower profile.",
    ]
    howToSteps = [
      { name: "Enter annual income", text: `This example starts from ${formatCurrency(parsed.annualIncome)} per year, or about ${formatCurrency(parsed.monthlyGrossIncome)} gross per month.` },
      { name: "Enter recurring monthly debt", text: `The page uses ${formatCurrency(parsed.monthlyDebt)} in non-housing monthly debt.` },
      { name: "Add the housing payment", text: `The housing cost assumption is ${formatCurrency(parsed.housingPayment)} per month.` },
      { name: "Review the ratio", text: `Total monthly obligations are ${formatCurrency(parsed.totalMonthlyObligations)}, which implies a DTI near ${formatPercent(parsed.dtiRatio)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why debt-to-income pages help with lending decisions",
      [
        "The user usually needs a fast pass-fail style signal: is this payment level in the range that feels workable or qualifying? An exact-match DTI route answers that immediately.",
        "It also creates a natural bridge into mortgage, refinance, and auto-loan pages, which makes the cluster more useful than a one-off ratio widget.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That is useful when users are screening borrowing scenarios with private income and debt values.",
      "The local workflow also keeps the route convenient for repeated comparisons across different housing-payment assumptions.",
    ]
    faq = [
      { question: "How is debt-to-income ratio calculated on this page?", answer: "The route adds monthly debt and housing payment, then divides that total by gross monthly income derived from the annual income input. The result is shown as a percentage for quick qualification-style screening." },
      { question: "Why use gross income instead of take-home pay?", answer: "Debt-to-income is usually discussed as a gross-income ratio in lending contexts, which makes the comparison more consistent with typical mortgage and loan qualification discussions. Budget planning may still require a separate take-home or cash-flow check." },
      { question: "Does this page guarantee loan approval?", answer: "No. It is a first-pass ratio calculator, not a lending decision engine. Underwriting can depend on credit, reserves, loan program rules, and other details this page does not model." },
      { question: "Does the page send income or debt values anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "Mortgage-payment, refinance-savings, and auto-loan-payment pages are common follow-up routes after a DTI estimate." },
    ]
    summaryRows = [
      { label: "Annual income", value: formatCurrency(parsed.annualIncome) },
      { label: "Gross monthly income", value: formatCurrency(parsed.monthlyGrossIncome) },
      { label: "Monthly debt", value: formatCurrency(parsed.monthlyDebt) },
      { label: "Housing payment", value: formatCurrency(parsed.housingPayment) },
      { label: "Monthly obligations", value: formatCurrency(parsed.totalMonthlyObligations) },
      { label: "DTI ratio", value: formatPercent(parsed.dtiRatio) },
    ]
    initialValues = {
      annualIncome: parsed.annualIncome,
      monthlyDebt: parsed.monthlyDebt,
      housingPayment: parsed.housingPayment,
    }
    h1 = `Debt-to-Income Ratio on ${formatCurrency(parsed.annualIncome)} Income with ${formatCurrency(parsed.monthlyDebt)} Debt and ${formatCurrency(parsed.housingPayment)} Housing`
  }

  if (parsed.category === "cd-calculator") {
    const years = parsed.termMonths / 12
    const scenarioText = `${formatCurrency(parsed.deposit)} at ${formatPercent(parsed.annualRate)} for ${parsed.termMonths} months with ${parsed.compounding} compounding`
    intro = [
      "CD calculator pages work because the user usually wants to compare one deposit amount, one term, and one yield without logging into a bank or opening a spreadsheet. They want to know what the certificate may be worth at maturity.",
      `For ${scenarioText}, the estimated maturity value is about ${formatCurrency(parsed.maturityValue)} and the interest earned is about ${formatCurrency(parsed.interestEarned)}. That gives the user a quick first-pass maturity number for comparing nearby CD terms and rates.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "A strong CD route helps the user compare term tradeoffs and maturity outcomes without pretending to be a full deposit marketplace.",
      "This is attractive finance traffic because the intent often overlaps with banking, savings products, and rate-shopping behavior.",
    ]
    howItWorks = [
      "The calculator applies compound growth to the selected deposit for the selected number of months using the chosen compounding frequency. It assumes the deposit stays in place for the full term.",
      "This cluster does not model early-withdrawal penalties, step-up rates, or changing rate environments. It is a clean maturity estimate for one exact CD setup.",
    ]
    howToSteps = [
      { name: "Enter the deposit amount", text: `This route uses ${formatCurrency(parsed.deposit)} as the opening deposit.` },
      { name: "Set the rate and term", text: `The selected rate is ${formatPercent(parsed.annualRate)} across ${parsed.termMonths} months.` },
      { name: "Choose compounding frequency", text: `The example uses ${parsed.compounding} compounding.` },
      { name: "Review maturity value and interest earned", text: `Estimated maturity value is ${formatCurrency(parsed.maturityValue)} with about ${formatCurrency(parsed.interestEarned)} in interest.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why CD routes are useful bank-product pages",
      [
        "The user usually needs a maturity estimate fast enough to compare several term options side by side. Exact-match routes make those comparisons bookmarkable and easy to revisit.",
        "These pages also connect naturally to APY, savings-goal, and compound-growth routes instead of becoming dead-end banking content.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That makes the route practical for quick savings-product checks on a personal or shared device.",
      "The local workflow also keeps it fast enough to compare multiple deposit and term combinations in sequence.",
    ]
    faq = [
      { question: "How is CD maturity value calculated on this page?", answer: "The route applies compound growth to the selected deposit using the chosen annual rate, term length, and compounding frequency. The result is a simple maturity estimate for one CD scenario." },
      { question: `How much interest does ${formatCurrency(parsed.deposit)} earn over ${parsed.termMonths} months?`, answer: `At ${formatPercent(parsed.annualRate)} with ${parsed.compounding} compounding, this page estimates about ${formatCurrency(parsed.interestEarned)} in interest by maturity. The exact bank product can still differ if penalties or rate features apply.` },
      { question: "Why compare CD and APY pages?", answer: "Because many users want to know whether a fixed term product or a more flexible savings-style growth assumption looks better for the same deposit. Keeping both routes nearby makes that comparison easier." },
      { question: "Does the page send deposit values anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "APY-calculator and savings-goal pages are common next steps after a CD maturity estimate." },
    ]
    summaryRows = [
      { label: "Deposit", value: formatCurrency(parsed.deposit) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Term", value: `${parsed.termMonths} months` },
      { label: "Compounding", value: parsed.compounding },
      { label: "Maturity value", value: formatCurrency(parsed.maturityValue) },
      { label: "Interest earned", value: formatCurrency(parsed.interestEarned) },
    ]
    initialValues = {
      deposit: parsed.deposit,
      annualRate: parsed.annualRate,
      termMonths: parsed.termMonths,
      compounding: parsed.compounding,
    }
    h1 = `CD Growth on ${formatCurrency(parsed.deposit)} at ${parsed.annualRate}% for ${formatNumber(years)} Years (${parsed.compounding})`
  }

  if (parsed.category === "apy-calculator") {
    const scenarioText = `${formatCurrency(parsed.deposit)} at ${formatPercent(parsed.annualRate)} for ${parsed.years} years with ${parsed.compounding} compounding`
    intro = [
      "APY growth pages work because savers often want one direct answer: what could this deposit grow to if it stays parked and compounds for a given period? They do not want a general interest article when they already know the starting amount and rate assumption.",
      `For ${scenarioText}, the estimated future value is about ${formatCurrency(parsed.futureValue)} and the estimated interest earned is about ${formatCurrency(parsed.interestEarned)}. That gives the user a clean benchmark for comparing deposits, rates, and time horizons.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "This route makes rate-shopping and savings planning more concrete because it turns one deposit and one yield assumption into a future-value estimate the user can act on.",
      "It also supports strong banking and personal-finance advertiser demand while staying within a browser-first, no-upload utility model.",
    ]
    howItWorks = [
      "The calculator compounds the starting deposit at the selected annual rate over the chosen number of years using the selected compounding frequency. It is intentionally a first-pass growth model with no additional contributions.",
      "That scope keeps the page clean enough for exact-match SEO while still useful for comparing savings-product assumptions.",
    ]
    howToSteps = [
      { name: "Enter the deposit", text: `This route starts with ${formatCurrency(parsed.deposit)}.` },
      { name: "Choose the annual rate", text: `The example uses ${formatPercent(parsed.annualRate)}.` },
      { name: "Set the time horizon and compounding", text: `The page assumes ${parsed.years} years with ${parsed.compounding} compounding.` },
      { name: "Review future value and interest earned", text: `Estimated future value is ${formatCurrency(parsed.futureValue)} with about ${formatCurrency(parsed.interestEarned)} in growth.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why APY pages are useful planning routes",
      [
        "Exact-match APY routes help the user compare the effect of small changes in rate or time horizon without building a custom spreadsheet first.",
        "They also create a natural bridge into CD, savings-goal, and retirement-intro pages, which makes the cluster more useful than a single isolated formula.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That keeps deposit and savings assumptions private while still making the page fast enough for repeated comparisons.",
      "The browser-only workflow also matches the privacy-first positioning across the rest of Plain Tools.",
    ]
    faq = [
      { question: "How is APY growth estimated on this page?", answer: "The route compounds the selected deposit using the chosen annual rate, time horizon, and compounding frequency. It is designed as a first-pass savings-growth estimate rather than a bank-account simulator with changing rates or ongoing deposits." },
      { question: `What does ${formatPercent(parsed.annualRate)} growth mean on ${formatCurrency(parsed.deposit)}?`, answer: `Over ${parsed.years} years with ${parsed.compounding} compounding, this page estimates about ${formatCurrency(parsed.futureValue)} in total value. The interest portion of that estimate is about ${formatCurrency(parsed.interestEarned)}.` },
      { question: "Should I use a CD page or an APY page?", answer: "Use the CD page when you want to model a fixed deposit term, and use the APY page when you want a simpler savings-growth view over a chosen number of years. They answer closely related but slightly different questions." },
      { question: "Does the page send my deposit amount anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "CD-calculator, savings-goal, and compound-interest-basic pages are common follow-up routes after an APY estimate." },
    ]
    summaryRows = [
      { label: "Deposit", value: formatCurrency(parsed.deposit) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Compounding", value: parsed.compounding },
      { label: "Future value", value: formatCurrency(parsed.futureValue) },
      { label: "Interest earned", value: formatCurrency(parsed.interestEarned) },
    ]
    initialValues = {
      deposit: parsed.deposit,
      annualRate: parsed.annualRate,
      years: parsed.years,
      compounding: parsed.compounding,
    }
    h1 = `APY Growth on ${formatCurrency(parsed.deposit)} at ${parsed.annualRate}% for ${parsed.years} Years (${parsed.compounding})`
  }

  if (parsed.category === "ira-growth") {
    const accountLabel = parsed.accountType === "roth" ? "Roth IRA" : "Traditional IRA"
    const scenarioText = `${accountLabel} contributions of ${formatCurrency(parsed.annualContribution)} per year at ${formatPercent(parsed.annualRate)} over ${parsed.years} years`
    intro = [
      "IRA pages work because the user usually wants to compare one contribution level and one return assumption without opening a full retirement planning app. The exact account type also matters, so a route that keeps that context visible is more useful than a generic retirement article.",
      `For ${scenarioText}, this route estimates a future value of about ${formatCurrency(parsed.futureValue)} on total contributions of ${formatCurrency(parsed.totalContributions)}. That gives the user a direct savings-growth benchmark for one exact IRA scenario.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The route is useful because it turns an annual contribution habit into a projected long-term account value without forcing the user into a deeper retirement workflow first.",
      "It also fits strong investing and retirement-intent traffic while staying simple enough for privacy-first, browser-only execution.",
    ]
    howItWorks = [
      "The calculator converts annual contributions into a monthly contribution stream and compounds that savings flow at the selected annual return over the chosen time horizon.",
      "The page intentionally does not model income limits, tax rules, distribution requirements, or changing contribution caps. It is a first-pass IRA growth estimate.",
    ]
    howToSteps = [
      { name: "Choose account type", text: `This example uses a ${accountLabel}.` },
      { name: "Enter annual contribution", text: `The route assumes ${formatCurrency(parsed.annualContribution)} contributed each year.` },
      { name: "Set annual growth and time horizon", text: `The page uses ${formatPercent(parsed.annualRate)} across ${parsed.years} years.` },
      { name: "Review projected account value", text: `Projected value is about ${formatCurrency(parsed.futureValue)} on total contributions of ${formatCurrency(parsed.totalContributions)}.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why IRA pages complement 401(k) content",
      [
        "Many users move between workplace-plan and IRA questions as they compare contribution priorities. A good IRA page makes that next step obvious instead of isolating the calculation.",
        "Exact-match IRA routes also work well because contribution level and horizon are usually the variables the user already has in mind when searching.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That keeps retirement contribution assumptions private and makes the page practical on a work device or quick mobile session.",
      "The local model also makes it easy to test nearby contribution and growth assumptions without creating an account.",
    ]
    faq = [
      { question: `How is ${accountLabel} growth estimated on this page?`, answer: "The route converts the annual contribution into a monthly savings stream and compounds it using the selected annual return over the chosen number of years. It is a directional retirement-growth estimate, not a full tax or account-eligibility tool." },
      { question: "Why keep Roth and traditional IRA scenarios separate?", answer: "Because the search intent is often account-type specific, and keeping that visible in the page and URL makes comparisons easier. The growth math here is similar, but the surrounding planning context is different." },
      { question: `What does ${formatCurrency(parsed.annualContribution)} per year become over ${parsed.years} years?`, answer: `At ${formatPercent(parsed.annualRate)}, this page estimates about ${formatCurrency(parsed.futureValue)} by the end of the period. Total contributions across the full horizon would be ${formatCurrency(parsed.totalContributions)}.` },
      { question: "Does the page send retirement values anywhere?", answer: "No. All calculations happen locally in the browser." },
      { question: "What should I check next?", answer: "401k-growth and retirement-savings-intro pages are common next steps after an IRA estimate." },
    ]
    summaryRows = [
      { label: "Account type", value: accountLabel },
      { label: "Annual contribution", value: formatCurrency(parsed.annualContribution) },
      { label: "Annual rate", value: formatPercent(parsed.annualRate) },
      { label: "Years", value: `${parsed.years}` },
      { label: "Total contributions", value: formatCurrency(parsed.totalContributions) },
      { label: "Projected value", value: formatCurrency(parsed.futureValue) },
    ]
    initialValues = {
      annualContribution: parsed.annualContribution,
      annualRate: parsed.annualRate,
      years: parsed.years,
      accountType: parsed.accountType,
    }
    h1 = `${accountLabel} Growth on ${formatCurrency(parsed.annualContribution)}/Year at ${parsed.annualRate}% for ${parsed.years} Years`
  }

  if (parsed.category === "emergency-fund") {
    const scenarioText = `${formatCurrency(parsed.monthlyExpenses)} in monthly expenses over ${formatNumber(parsed.monthsCovered)} months`
    intro = [
      "Emergency-fund routes work because the user usually starts with one simple question: how much cash reserve would cover a realistic number of months if income stopped or dropped?",
      `For ${scenarioText}, the target reserve is about ${formatCurrency(parsed.emergencyFundTarget)}. That gives the user one concrete savings number they can compare against current cash, savings-goal plans, and paycheck capacity.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The page is practical because it converts a generic emergency-fund rule into a scenario the user can actually budget around.",
      "It also fits strong finance intent since it naturally leads into savings, banking, insurance, and household-budget decisions.",
    ]
    howItWorks = [
      "The calculator multiplies monthly expenses by the number of months the user wants to cover. It stays intentionally simple so the result is easy to understand and compare quickly.",
      "This route is not trying to be a complete household budget model. It is a fast reserve target calculator for first-pass planning.",
    ]
    howToSteps = [
      { name: "Enter monthly essential expenses", text: `This route uses ${formatCurrency(parsed.monthlyExpenses)} per month.` },
      { name: "Choose the number of months to cover", text: `The selected reserve length is ${formatNumber(parsed.monthsCovered)} months.` },
      { name: "Read the target fund size", text: `Estimated emergency fund target is ${formatCurrency(parsed.emergencyFundTarget)}.` },
      { name: "Compare with a savings path", text: "Use nearby savings-goal and paycheck pages to see how quickly the reserve could be built." },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why emergency-fund pages are useful planning routes",
      [
        "An emergency-fund page works because it gives the user a direct reserve target without forcing them into a full financial planning workflow first.",
        "That makes the route useful enough to stand on its own while still connecting naturally to savings and paycheck calculators.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That keeps household expense planning private and fast.",
      "The route stays useful on a shared device or quick mobile session where users still want basic financial privacy.",
    ]
    faq = [
      { question: `How much emergency fund do I need for ${parsed.monthsCovered} months?`, answer: `At ${formatCurrency(parsed.monthlyExpenses)} in monthly expenses, this route estimates about ${formatCurrency(parsed.emergencyFundTarget)}.` },
      { question: "Does this include every optional expense?", answer: "Not necessarily. Most users treat this as an essentials-based reserve estimate rather than a full lifestyle-spending model." },
      { question: "Why compare three months, six months, or more?", answer: "Because the right reserve length depends on income stability, household obligations, and risk tolerance." },
      { question: "Can I turn this into a savings goal?", answer: "Yes. That is one of the most common follow-up actions after an emergency-fund estimate." },
      { question: "Does the page send expense values anywhere?", answer: "No. All calculations stay local in the browser." },
      { question: "What should I check next?", answer: "Savings-goal and paycheck-estimate pages are common next steps after an emergency-fund target." },
    ]
    summaryRows = [
      { label: "Monthly expenses", value: formatCurrency(parsed.monthlyExpenses) },
      { label: "Months covered", value: formatNumber(parsed.monthsCovered) },
      { label: "Target reserve", value: formatCurrency(parsed.emergencyFundTarget) },
    ]
    initialValues = {
      monthlyExpenses: parsed.monthlyExpenses,
      monthsCovered: parsed.monthsCovered,
    }
    h1 = `Emergency Fund for ${formatCurrency(parsed.monthlyExpenses)}/Month Over ${parsed.monthsCovered} Months`
  }

  if (parsed.category === "break-even-calculator") {
    const scenarioText = `${formatCurrency(parsed.fixedCosts)} in fixed costs with ${formatCurrency(parsed.unitPrice)} price and ${formatCurrency(parsed.unitCost)} unit cost`
    intro = [
      "Break-even pages work because the user wants one concrete answer fast: how many units need to sell before the business covers fixed costs? That is a strong small-business and side-hustle planning query.",
      `For ${scenarioText}, the contribution margin is ${formatCurrency(parsed.contributionMargin)} per unit. The estimated break-even point is about ${formatNumber(parsed.unitsToBreakEven)} units, or roughly ${formatCurrency(parsed.revenueToBreakEven)} in revenue.`,
      EXTERNAL_OVERLAP_NOTE,
    ]
    whyUsersNeedThis = [
      "The route is useful because it converts fixed costs and unit economics into a decision-ready threshold. That is more actionable than reading a generic margin article.",
      "It also fits good advertiser demand around accounting, invoicing, small-business banking, and operating software.",
    ]
    howItWorks = [
      "The calculator subtracts unit cost from unit price to get contribution margin, then divides fixed costs by that margin to estimate the number of units needed to break even.",
      "This route is intentionally a simple unit-economics screen. It does not model taxes, discounts, churn, financing, or multiple product lines.",
    ]
    howToSteps = [
      { name: "Enter fixed costs", text: `This route uses ${formatCurrency(parsed.fixedCosts)} in fixed costs.` },
      { name: "Enter price and unit cost", text: `The example assumes ${formatCurrency(parsed.unitPrice)} price and ${formatCurrency(parsed.unitCost)} cost per unit.` },
      { name: "Read the contribution margin", text: `Contribution margin is ${formatCurrency(parsed.contributionMargin)} per unit.` },
      { name: "Review units and revenue to break even", text: `Estimated break-even point is ${formatNumber(parsed.unitsToBreakEven)} units.` },
    ]
    explanationBlocks = buildCommonBlocks(
      CATEGORY_LABELS[parsed.category],
      scenarioText,
      "Why break-even pages are strong business-finance utilities",
      [
        "A break-even page works because the user usually has a real pricing or launch decision in front of them. They need the threshold fast, not a long textbook explanation.",
        "That makes the route practical for founders, freelancers, and operators while staying narrow enough for programmatic scale.",
      ]
    )
    privacyNote = [
      "All calculations run locally in your browser - nothing is sent anywhere. That matters when users are testing pricing, margin, or cost assumptions they do not want to share broadly.",
      "The local model also makes quick scenario comparison easier during planning meetings or mobile checks.",
    ]
    faq = [
      { question: "How do you calculate break-even units?", answer: "Subtract unit cost from unit price to get contribution margin, then divide fixed costs by that margin." },
      { question: `What is the break-even point on ${formatCurrency(parsed.fixedCosts)} in fixed costs?`, answer: `At ${formatCurrency(parsed.unitPrice)} price and ${formatCurrency(parsed.unitCost)} cost, this route estimates about ${formatNumber(parsed.unitsToBreakEven)} units.` },
      { question: "Why show both units and revenue?", answer: "Because some users think in sales volume while others need a revenue target for planning and forecasting." },
      { question: "Can I compare another price or cost quickly?", answer: "Yes. The related links and embedded calculator are built for nearby pricing comparisons." },
      { question: "Does the page send cost assumptions anywhere?", answer: "No. All calculations stay local in the browser." },
      { question: "What should I check next?", answer: "Simple-interest and percentage pages are useful follow-ups when funding cost or margin percentage questions come next." },
    ]
    summaryRows = [
      { label: "Fixed costs", value: formatCurrency(parsed.fixedCosts) },
      { label: "Unit price", value: formatCurrency(parsed.unitPrice) },
      { label: "Unit cost", value: formatCurrency(parsed.unitCost) },
      { label: "Contribution margin", value: formatCurrency(parsed.contributionMargin) },
      { label: "Break-even units", value: formatNumber(parsed.unitsToBreakEven) },
      { label: "Break-even revenue", value: formatCurrency(parsed.revenueToBreakEven) },
    ]
    initialValues = {
      fixedCosts: parsed.fixedCosts,
      unitPrice: parsed.unitPrice,
      unitCost: parsed.unitCost,
    }
    h1 = `Break-Even Point for ${formatCurrency(parsed.fixedCosts)} Fixed Costs at ${formatCurrency(parsed.unitPrice)} Price and ${formatCurrency(parsed.unitCost)} Cost`
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
  "mortgage-payment",
  "refinance-savings",
  "paycheck-estimate",
  "401k-growth",
  "auto-loan-payment",
  "student-loan-payment",
  "cd-calculator",
  "apy-calculator",
  "ira-growth",
  "debt-to-income",
  "basic-loan-payment",
  "credit-card-payoff",
  "tax-estimate-simple",
  "retirement-savings-intro",
  "compound-interest-basic",
  "savings-goal",
  "emergency-fund",
  "break-even-calculator",
  "salary-to-hourly",
  "percentage",
  "tip-calculator",
  "simple-interest",
]

const CALCULATOR_PREBUILD_BUDGETS: Record<PublicCalculatorCategory, number> = {
  "401k-growth": 84,
  "apy-calculator": 48,
  "auto-loan-payment": 60,
  "basic-loan-payment": 120,
  "break-even-calculator": 24,
  "cd-calculator": 48,
  "compound-interest-basic": 60,
  "credit-card-payoff": 80,
  "debt-to-income": 36,
  "emergency-fund": 24,
  "ira-growth": 24,
  "mortgage-payment": 96,
  "paycheck-estimate": 72,
  percentage: 120,
  "refinance-savings": 72,
  "retirement-savings-intro": 40,
  "salary-to-hourly": 30,
  "savings-goal": 50,
  "simple-interest": 40,
  "student-loan-payment": 60,
  "tax-estimate-simple": 60,
  "tip-calculator": 40,
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
  getCalculatorPage("mortgage-payment", "mortgage-payment-450000-6.25-30-years-20-down"),
  getCalculatorPage("refinance-savings", "refinance-savings-320000-7.25-to-6.25-30-years"),
  getCalculatorPage("paycheck-estimate", "paycheck-estimate-85000-biweekly-texas"),
  getCalculatorPage("401k-growth", "401k-growth-90000-salary-8-contribution-4-match-7-rate-30-years"),
  getCalculatorPage("auto-loan-payment", "auto-loan-35000-6.5-72-months-5000-down"),
  getCalculatorPage("student-loan-payment", "student-loan-45000-5.5-10-years-100-extra"),
  getCalculatorPage("debt-to-income", "debt-to-income-90000-income-850-debt-1800-housing"),
  getCalculatorPage("cd-calculator", "cd-calculator-10000-4.75-12-months-monthly"),
  getCalculatorPage("apy-calculator", "apy-calculator-10000-4.5-5-years-monthly"),
  getCalculatorPage("ira-growth", "ira-growth-7000-7-25-years-roth"),
  getCalculatorPage("simple-interest", "simple-interest-10000-5-3"),
  getCalculatorPage("compound-interest-basic", "compound-interest-10000-5-10-years-monthly"),
  getCalculatorPage("retirement-savings-intro", "retirement-savings-500-monthly-6-20-years"),
  getCalculatorPage("tax-estimate-simple", "tax-estimate-85000-single"),
  getCalculatorPage("credit-card-payoff", "credit-card-payoff-10000-19.9-300-monthly"),
  getCalculatorPage("savings-goal", "savings-goal-25000-target-500-monthly-4-rate"),
  getCalculatorPage("emergency-fund", "emergency-fund-4500-6-months"),
  getCalculatorPage("break-even-calculator", "break-even-25000-fixed-120-price-45-cost"),
]
  .filter((entry): entry is CalculatorPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

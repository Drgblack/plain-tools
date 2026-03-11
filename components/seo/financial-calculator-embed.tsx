"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import {
  buildCalculatorExpression,
  buildCalculatorPath,
  type CalculatorCategory,
} from "@/lib/calculator-financial"

type FinancialCalculatorEmbedProps = {
  category: CalculatorCategory
  initialValues: Record<string, number | string>
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"

const labelClassName = "block text-sm font-medium text-foreground"

function readNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
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

function roundText(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

function calculateSummary(category: CalculatorCategory, values: Record<string, string>) {
  switch (category) {
    case "percentage": {
      const percent = readNumber(values.percent ?? "")
      const base = readNumber(values.base ?? "")
      if (percent === null || base === null) return "Enter valid numbers to calculate."
      return `${formatNumber(percent)}% of ${formatNumber(base)} = ${roundText((percent / 100) * base)}`
    }
    case "basic-loan":
    case "basic-loan-payment": {
      const principal = readNumber(values.principal ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const termYears = readNumber(values.termYears ?? "")
      if (principal === null || annualRate === null || termYears === null) {
        return "Enter principal, rate, and term to estimate the payment."
      }
      const monthlyRate = annualRate / 100 / 12
      const months = termYears * 12
      const payment =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
      return `Estimated monthly payment: ${formatCurrency(payment)}`
    }
    case "mortgage-payment": {
      const homePrice = readNumber(values.homePrice ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const termYears = readNumber(values.termYears ?? "")
      const downPaymentPercent = readNumber(values.downPaymentPercent ?? "")
      if (
        homePrice === null ||
        annualRate === null ||
        termYears === null ||
        downPaymentPercent === null
      ) {
        return "Enter home price, rate, term, and down payment."
      }
      const downPaymentAmount = homePrice * (downPaymentPercent / 100)
      const principal = homePrice - downPaymentAmount
      const monthlyRate = annualRate / 100 / 12
      const months = termYears * 12
      const payment =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
      return `Estimated mortgage payment: ${formatCurrency(payment)}`
    }
    case "refinance-savings": {
      const balance = readNumber(values.balance ?? "")
      const currentRate = readNumber(values.currentRate ?? "")
      const newRate = readNumber(values.newRate ?? "")
      const termYears = readNumber(values.termYears ?? "")
      if (
        balance === null ||
        currentRate === null ||
        newRate === null ||
        termYears === null
      ) {
        return "Enter balance, current rate, new rate, and term."
      }
      const currentPayment = ((balance * (currentRate / 100 / 12)) /
        (1 - (1 + currentRate / 100 / 12) ** -(termYears * 12)))
      const newPayment = ((balance * (newRate / 100 / 12)) /
        (1 - (1 + newRate / 100 / 12) ** -(termYears * 12)))
      return `Estimated monthly savings: ${formatCurrency(currentPayment - newPayment)}`
    }
    case "paycheck-estimate": {
      const annualSalary = readNumber(values.annualSalary ?? "")
      const payFrequency = values.payFrequency ?? "biweekly"
      const state = values.state ?? "texas"
      if (annualSalary === null) {
        return "Enter annual salary, pay frequency, and state."
      }
      const stateRates: Record<string, number> = {
        california: 6.5,
        florida: 0,
        georgia: 4.75,
        illinois: 4.95,
        massachusetts: 5,
        "new-jersey": 5.5,
        "new-york": 6.2,
        "north-carolina": 4.5,
        ohio: 3.5,
        pennsylvania: 3.07,
        texas: 0,
        washington: 0,
      }
      const federalRate =
        annualSalary <= 40000 ? 11 : annualSalary <= 85000 ? 14 : annualSalary <= 140000 ? 18 : 24
      const periods =
        payFrequency === "weekly"
          ? 52
          : payFrequency === "semimonthly"
            ? 24
            : payFrequency === "monthly"
              ? 12
              : 26
      const netPaycheck =
        (annualSalary * (1 - (federalRate + (stateRates[state] ?? 0)) / 100)) / periods
      return `Estimated take-home paycheck: ${formatCurrency(netPaycheck)}`
    }
    case "compound-basic":
    case "compound-interest-intro":
    case "compound-interest-basic": {
      const principal = readNumber(values.principal ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const years = readNumber(values.years ?? "")
      if (principal === null || annualRate === null || years === null) {
        return "Enter principal, rate, and years to project growth."
      }
      const compounding = values.compounding ?? "monthly"
      const periodsPerYear =
        compounding === "annual" ? 1 : compounding === "quarterly" ? 4 : 12
      const futureValue =
        principal * (1 + annualRate / 100 / periodsPerYear) ** (years * periodsPerYear)
      return `Projected value: ${formatCurrency(futureValue)}`
    }
    case "retirement-basic":
    case "retirement-savings-basic":
    case "retirement-savings-intro": {
      const monthlyContribution = readNumber(values.monthlyContribution ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const years = readNumber(values.years ?? "")
      if (
        monthlyContribution === null ||
        annualRate === null ||
        years === null
      ) {
        return "Enter monthly savings, rate, and years to project retirement value."
      }
      const monthlyRate = annualRate / 100 / 12
      const months = years * 12
      const futureValue =
        monthlyRate === 0
          ? monthlyContribution * months
          : monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate)
      return `Projected retirement balance: ${formatCurrency(futureValue)}`
    }
    case "tip":
    case "tip-calculator": {
      const bill = readNumber(values.bill ?? "")
      const tipPercent = readNumber(values.tipPercent ?? "")
      if (bill === null || tipPercent === null) {
        return "Enter bill and tip rate."
      }
      const tipAmount = (bill * tipPercent) / 100
      return `Tip ${formatCurrency(tipAmount)}. Total bill: ${formatCurrency(bill + tipAmount)}`
    }
    case "salary-to-hourly": {
      const annualSalary = readNumber(values.annualSalary ?? "")
      const hoursPerWeek = readNumber(values.hoursPerWeek ?? "")
      if (annualSalary === null || hoursPerWeek === null) {
        return "Enter salary and weekly hours."
      }
      return `Hourly equivalent: ${formatCurrency(annualSalary / (hoursPerWeek * 52))}`
    }
    case "simple-interest": {
      const principal = readNumber(values.principal ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const years = readNumber(values.years ?? "")
      if (principal === null || annualRate === null || years === null) {
        return "Enter principal, rate, and years to estimate simple interest."
      }
      const interest = principal * (annualRate / 100) * years
      return `Simple interest: ${formatCurrency(interest)}. Total amount: ${formatCurrency(
        principal + interest
      )}`
    }
    case "tax-estimate-simple": {
      const annualIncome = readNumber(values.annualIncome ?? "")
      const filingStatus = values.filingStatus ?? "single"
      if (annualIncome === null) return "Enter annual income and filing status."
      const rate =
        filingStatus === "married-joint"
          ? annualIncome <= 50000
            ? 10
            : annualIncome <= 150000
              ? 16
              : 22
          : filingStatus === "head-of-household"
            ? annualIncome <= 45000
              ? 10
              : annualIncome <= 140000
                ? 17
                : 23
            : filingStatus === "self-employed"
              ? annualIncome <= 45000
                ? 15
                : annualIncome <= 140000
                  ? 23
                  : 29
              : annualIncome <= 40000
                ? 11
                : annualIncome <= 140000
                  ? 18
                  : 24
      return `Estimated tax: ${formatCurrency((annualIncome * rate) / 100)}. Estimated take-home: ${formatCurrency(annualIncome * (1 - rate / 100))}`
    }
    case "credit-card-payoff": {
      const balance = readNumber(values.balance ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const monthlyPayment = readNumber(values.monthlyPayment ?? "")
      if (balance === null || annualRate === null || monthlyPayment === null) {
        return "Enter balance, APR, and monthly payment."
      }
      const monthlyRate = annualRate / 100 / 12
      let remaining = balance
      let months = 0
      while (remaining > 0.01 && months < 1200) {
        const interest = remaining * monthlyRate
        const principalPaid = monthlyPayment - interest
        if (principalPaid <= 0) return "Payment is too low to reduce the balance."
        remaining = Math.max(0, remaining - principalPaid)
        months += 1
      }
      return `Estimated payoff time: ${months} months`
    }
    case "savings-goal": {
      const targetAmount = readNumber(values.targetAmount ?? "")
      const monthlyContribution = readNumber(values.monthlyContribution ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      if (
        targetAmount === null ||
        monthlyContribution === null ||
        annualRate === null
      ) {
        return "Enter target, monthly savings, and annual rate."
      }
      const monthlyRate = annualRate / 100 / 12
      let balance = 0
      let months = 0
      while (balance < targetAmount && months < 1200) {
        balance = balance * (1 + monthlyRate) + monthlyContribution
        months += 1
      }
      return `Estimated time to goal: ${months} months`
    }
    case "emergency-fund": {
      const monthlyExpenses = readNumber(values.monthlyExpenses ?? "")
      const monthsCovered = readNumber(values.monthsCovered ?? "")
      if (monthlyExpenses === null || monthsCovered === null) {
        return "Enter monthly expenses and months covered."
      }
      return `Emergency fund target: ${formatCurrency(monthlyExpenses * monthsCovered)}`
    }
    case "break-even-calculator": {
      const fixedCosts = readNumber(values.fixedCosts ?? "")
      const unitPrice = readNumber(values.unitPrice ?? "")
      const unitCost = readNumber(values.unitCost ?? "")
      if (fixedCosts === null || unitPrice === null || unitCost === null) {
        return "Enter fixed costs, unit price, and unit cost."
      }
      if (unitPrice <= unitCost) return "Unit price must be greater than unit cost."
      return `Estimated break-even units: ${Math.ceil(fixedCosts / (unitPrice - unitCost))}`
    }
  }
}

function renderFields(
  category: CalculatorCategory,
  values: Record<string, string>,
  setValue: (name: string, value: string) => void
) {
  switch (category) {
    case "percentage":
      return (
        <>
          <label className={labelClassName}>
            Percentage
            <input
              className={inputClassName}
              onChange={(event) => setValue("percent", event.target.value)}
              step="0.01"
              type="number"
              value={values.percent ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Base number
            <input
              className={inputClassName}
              onChange={(event) => setValue("base", event.target.value)}
              step="0.01"
              type="number"
              value={values.base ?? ""}
            />
          </label>
        </>
      )
    case "basic-loan":
    case "basic-loan-payment":
      return (
        <>
          <label className={labelClassName}>
            Principal
            <input
              className={inputClassName}
              onChange={(event) => setValue("principal", event.target.value)}
              step="1"
              type="number"
              value={values.principal ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Annual interest rate (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Term (years)
            <input
              className={inputClassName}
              onChange={(event) => setValue("termYears", event.target.value)}
              step="1"
              type="number"
              value={values.termYears ?? ""}
            />
          </label>
        </>
      )
    case "mortgage-payment":
      return (
        <>
          <label className={labelClassName}>
            Home price
            <input className={inputClassName} onChange={(event) => setValue("homePrice", event.target.value)} step="1" type="number" value={values.homePrice ?? ""} />
          </label>
          <label className={labelClassName}>
            Annual rate (%)
            <input className={inputClassName} onChange={(event) => setValue("annualRate", event.target.value)} step="0.01" type="number" value={values.annualRate ?? ""} />
          </label>
          <label className={labelClassName}>
            Term (years)
            <input className={inputClassName} onChange={(event) => setValue("termYears", event.target.value)} step="1" type="number" value={values.termYears ?? ""} />
          </label>
          <label className={labelClassName}>
            Down payment (%)
            <input className={inputClassName} onChange={(event) => setValue("downPaymentPercent", event.target.value)} step="0.01" type="number" value={values.downPaymentPercent ?? ""} />
          </label>
        </>
      )
    case "refinance-savings":
      return (
        <>
          <label className={labelClassName}>
            Remaining balance
            <input className={inputClassName} onChange={(event) => setValue("balance", event.target.value)} step="1" type="number" value={values.balance ?? ""} />
          </label>
          <label className={labelClassName}>
            Current rate (%)
            <input className={inputClassName} onChange={(event) => setValue("currentRate", event.target.value)} step="0.01" type="number" value={values.currentRate ?? ""} />
          </label>
          <label className={labelClassName}>
            New rate (%)
            <input className={inputClassName} onChange={(event) => setValue("newRate", event.target.value)} step="0.01" type="number" value={values.newRate ?? ""} />
          </label>
          <label className={labelClassName}>
            Term (years)
            <input className={inputClassName} onChange={(event) => setValue("termYears", event.target.value)} step="1" type="number" value={values.termYears ?? ""} />
          </label>
        </>
      )
    case "paycheck-estimate":
      return (
        <>
          <label className={labelClassName}>
            Annual salary
            <input className={inputClassName} onChange={(event) => setValue("annualSalary", event.target.value)} step="1" type="number" value={values.annualSalary ?? ""} />
          </label>
          <label className={labelClassName}>
            Pay frequency
            <select className={inputClassName} onChange={(event) => setValue("payFrequency", event.target.value)} value={values.payFrequency ?? "biweekly"}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="semimonthly">Semimonthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className={labelClassName}>
            State
            <select className={inputClassName} onChange={(event) => setValue("state", event.target.value)} value={values.state ?? "texas"}>
              <option value="california">California</option>
              <option value="new-york">New York</option>
              <option value="texas">Texas</option>
              <option value="florida">Florida</option>
              <option value="illinois">Illinois</option>
              <option value="pennsylvania">Pennsylvania</option>
              <option value="ohio">Ohio</option>
              <option value="georgia">Georgia</option>
              <option value="north-carolina">North Carolina</option>
              <option value="washington">Washington</option>
              <option value="new-jersey">New Jersey</option>
              <option value="massachusetts">Massachusetts</option>
            </select>
          </label>
        </>
      )
    case "compound-basic":
    case "compound-interest-intro":
    case "compound-interest-basic":
      return (
        <>
          <label className={labelClassName}>
            Starting principal
            <input
              className={inputClassName}
              onChange={(event) => setValue("principal", event.target.value)}
              step="1"
              type="number"
              value={values.principal ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Annual return (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Years
            <input
              className={inputClassName}
              onChange={(event) => setValue("years", event.target.value)}
              step="1"
              type="number"
              value={values.years ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Compounding
            <select
              className={inputClassName}
              onChange={(event) => setValue("compounding", event.target.value)}
              value={values.compounding ?? "monthly"}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </label>
        </>
      )
    case "retirement-basic":
    case "retirement-savings-basic":
    case "retirement-savings-intro":
      return (
        <>
          <label className={labelClassName}>
            Monthly contribution
            <input
              className={inputClassName}
              onChange={(event) => setValue("monthlyContribution", event.target.value)}
              step="1"
              type="number"
              value={values.monthlyContribution ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Annual return (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Years
            <input
              className={inputClassName}
              onChange={(event) => setValue("years", event.target.value)}
              step="1"
              type="number"
              value={values.years ?? ""}
            />
          </label>
        </>
      )
    case "tip":
    case "tip-calculator":
      return (
        <>
          <label className={labelClassName}>
            Bill amount
            <input
              className={inputClassName}
              onChange={(event) => setValue("bill", event.target.value)}
              step="0.01"
              type="number"
              value={values.bill ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Tip percentage
            <input
              className={inputClassName}
              onChange={(event) => setValue("tipPercent", event.target.value)}
              step="0.01"
              type="number"
              value={values.tipPercent ?? ""}
            />
          </label>
        </>
      )
    case "salary-to-hourly":
      return (
        <>
          <label className={labelClassName}>
            Annual salary
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualSalary", event.target.value)}
              step="1"
              type="number"
              value={values.annualSalary ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Hours per week
            <input
              className={inputClassName}
              onChange={(event) => setValue("hoursPerWeek", event.target.value)}
              step="0.5"
              type="number"
              value={values.hoursPerWeek ?? ""}
            />
          </label>
        </>
      )
    case "simple-interest":
      return (
        <>
          <label className={labelClassName}>
            Principal
            <input
              className={inputClassName}
              onChange={(event) => setValue("principal", event.target.value)}
              step="1"
              type="number"
              value={values.principal ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Annual interest rate (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Years
            <input
              className={inputClassName}
              onChange={(event) => setValue("years", event.target.value)}
              step="1"
              type="number"
              value={values.years ?? ""}
            />
          </label>
        </>
      )
    case "tax-estimate-simple":
      return (
        <>
          <label className={labelClassName}>
            Annual income
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualIncome", event.target.value)}
              step="1"
              type="number"
              value={values.annualIncome ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Filing status
            <select
              className={inputClassName}
              onChange={(event) => setValue("filingStatus", event.target.value)}
              value={values.filingStatus ?? "single"}
            >
              <option value="single">Single</option>
              <option value="married-joint">Married joint</option>
              <option value="head-of-household">Head of household</option>
              <option value="self-employed">Self-employed</option>
            </select>
          </label>
        </>
      )
    case "credit-card-payoff":
      return (
        <>
          <label className={labelClassName}>
            Balance
            <input
              className={inputClassName}
              onChange={(event) => setValue("balance", event.target.value)}
              step="1"
              type="number"
              value={values.balance ?? ""}
            />
          </label>
          <label className={labelClassName}>
            APR (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Monthly payment
            <input
              className={inputClassName}
              onChange={(event) => setValue("monthlyPayment", event.target.value)}
              step="1"
              type="number"
              value={values.monthlyPayment ?? ""}
            />
          </label>
        </>
      )
    case "savings-goal":
      return (
        <>
          <label className={labelClassName}>
            Target amount
            <input
              className={inputClassName}
              onChange={(event) => setValue("targetAmount", event.target.value)}
              step="1"
              type="number"
              value={values.targetAmount ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Monthly savings
            <input
              className={inputClassName}
              onChange={(event) => setValue("monthlyContribution", event.target.value)}
              step="1"
              type="number"
              value={values.monthlyContribution ?? ""}
            />
          </label>
          <label className={labelClassName}>
            Annual rate (%)
            <input
              className={inputClassName}
              onChange={(event) => setValue("annualRate", event.target.value)}
              step="0.01"
              type="number"
              value={values.annualRate ?? ""}
            />
          </label>
        </>
      )
    case "emergency-fund":
      return (
        <>
          <label className={labelClassName}>
            Monthly expenses
            <input className={inputClassName} onChange={(event) => setValue("monthlyExpenses", event.target.value)} step="1" type="number" value={values.monthlyExpenses ?? ""} />
          </label>
          <label className={labelClassName}>
            Months covered
            <input className={inputClassName} onChange={(event) => setValue("monthsCovered", event.target.value)} step="1" type="number" value={values.monthsCovered ?? ""} />
          </label>
        </>
      )
    case "break-even-calculator":
      return (
        <>
          <label className={labelClassName}>
            Fixed costs
            <input className={inputClassName} onChange={(event) => setValue("fixedCosts", event.target.value)} step="1" type="number" value={values.fixedCosts ?? ""} />
          </label>
          <label className={labelClassName}>
            Unit price
            <input className={inputClassName} onChange={(event) => setValue("unitPrice", event.target.value)} step="0.01" type="number" value={values.unitPrice ?? ""} />
          </label>
          <label className={labelClassName}>
            Unit cost
            <input className={inputClassName} onChange={(event) => setValue("unitCost", event.target.value)} step="0.01" type="number" value={values.unitCost ?? ""} />
          </label>
        </>
      )
  }
}

export function FinancialCalculatorEmbed({
  category,
  initialValues,
}: FinancialCalculatorEmbedProps) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(initialValues).map(([key, value]) => [key, String(value)])
    )
  )

  const summary = calculateSummary(category, values)

  function setValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const expression = buildCalculatorExpression(category, values)
    if (!expression) return
    router.push(buildCalculatorPath(category, expression))
  }

  return (
    <form className="space-y-3 notranslate" onSubmit={handleSubmit} translate="no">
      {renderFields(category, values, setValue)}
      <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Live local calculation</p>
        <p className="mt-2">{summary}</p>
      </div>
      <button
        className="w-full rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        type="submit"
      >
        Open canonical calculator page
      </button>
    </form>
  )
}

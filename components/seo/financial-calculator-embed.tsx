"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import {
  buildCalculatorExpression,
  type CalculatorCategory,
} from "@/lib/calculator-financial"

type FinancialCalculatorEmbedProps = {
  category: CalculatorCategory
  initialValues: Record<string, number | string>
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"

const labelClassName = "block text-sm font-medium text-foreground"

function buildCalculatorPath(category: CalculatorCategory, expression: string) {
  return `/calculators/${category}/${expression}`
}

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
    case "basic-loan": {
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
    case "compound-interest-intro": {
      const principal = readNumber(values.principal ?? "")
      const annualRate = readNumber(values.annualRate ?? "")
      const years = readNumber(values.years ?? "")
      if (principal === null || annualRate === null || years === null) {
        return "Enter principal, rate, and years to project growth."
      }
      const futureValue = principal * (1 + annualRate / 100 / 12) ** (years * 12)
      return `Projected value: ${formatCurrency(futureValue)}`
    }
    case "retirement-savings-basic": {
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
    case "tip": {
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
    case "compound-interest-intro":
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
        </>
      )
    case "retirement-savings-basic":
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

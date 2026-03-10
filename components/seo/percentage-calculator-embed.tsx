"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, type FormEvent } from "react"

function expressionFor(percent: number, base: number) {
  return `what-is-${percent}-percent-of-${base}`
}

function roundResult(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

export function PercentageCalculatorEmbed({
  baseValue,
  percentValue,
}: {
  baseValue: number
  percentValue: number
}) {
  const router = useRouter()
  const [percent, setPercent] = useState(percentValue.toString())
  const [base, setBase] = useState(baseValue.toString())

  const result = useMemo(() => {
    const parsedPercent = Number.parseFloat(percent)
    const parsedBase = Number.parseFloat(base)
    if (!Number.isFinite(parsedPercent) || !Number.isFinite(parsedBase)) return null
    return (parsedPercent / 100) * parsedBase
  }, [base, percent])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedPercent = Number.parseFloat(percent)
    const parsedBase = Number.parseFloat(base)
    if (!Number.isFinite(parsedPercent) || !Number.isFinite(parsedBase)) return

    router.push(
      `/calculators/percentage/${expressionFor(parsedPercent, parsedBase)}`
    )
  }

  return (
    <form className="space-y-3 notranslate" onSubmit={handleSubmit} translate="no">
      <label className="block text-sm font-medium text-foreground">
        Percentage
        <input
          className="mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"
          onChange={(event) => setPercent(event.target.value)}
          step="0.01"
          type="number"
          value={percent}
        />
      </label>
      <label className="block text-sm font-medium text-foreground">
        Base number
        <input
          className="mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"
          onChange={(event) => setBase(event.target.value)}
          step="0.01"
          type="number"
          value={base}
        />
      </label>
      <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
        Result:{" "}
        <span className="font-semibold text-foreground">
          {result === null ? "Enter valid numbers" : roundResult(result)}
        </span>
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

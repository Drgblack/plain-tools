type CalculatorSummaryProps = {
  rows: Array<{ label: string; value: string }>
  title?: string
}

export function CalculatorSummary({
  rows,
  title = "Calculation summary",
}: CalculatorSummaryProps) {
  if (rows.length === 0) return null

  return (
    <section
      className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6 notranslate"
      translate="no"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
        <table className="min-w-full divide-y divide-border/70 text-left text-sm">
          <tbody className="divide-y divide-border/60 bg-card/40">
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="w-48 px-4 py-3 font-medium text-foreground">{row.label}</th>
                <td className="px-4 py-3 text-muted-foreground">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

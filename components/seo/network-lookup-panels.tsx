import type { ReactNode } from "react"

export function NetworkStatGrid({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border/70 bg-background/60 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/90">
            {item.label}
          </p>
          <div className="mt-2 text-sm text-foreground">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export function NetworkKeyValueTable({
  rows,
}: {
  rows: Array<{ label: string; value: ReactNode }>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
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
  )
}

export function NetworkListTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: Array<string[]>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <table className="min-w-full divide-y divide-border/70 text-left text-sm">
        <thead className="bg-background/80">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium text-foreground">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-card/40">
          {rows.map((row, index) => (
            <tr key={`${row.join(":")}-${index}`}>
              {row.map((value, cellIndex) => (
                <td
                  key={`${columns[cellIndex] ?? "cell"}-${value}-${cellIndex}`}
                  className="px-4 py-3 text-muted-foreground"
                >
                  <span className="font-mono text-xs sm:text-sm">{value}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

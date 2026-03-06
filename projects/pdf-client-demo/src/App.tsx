import { useMemo, useState } from "react"
import { ThemeToggle } from "./components/ThemeToggle"
import { MergeTool } from "./components/MergeTool"
import { CompressTool } from "./components/CompressTool"

type ToolTab = "merge" | "compress"

const TAB_COPY: Record<ToolTab, { title: string; description: string }> = {
  merge: {
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one document locally in your browser.",
  },
  compress: {
    title: "Compress PDF",
    description: "Optimise PDF file size with a best-effort local compression flow.",
  },
}

function App() {
  const [tab, setTab] = useState<ToolTab>("merge")

  const activeCopy = useMemo(() => TAB_COPY[tab], [tab])

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Local PDF Merge + Compress Demo</h1>
            <p className="mt-1 text-sm text-muted">100% client-side processing. No uploads.</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-xl border border-border bg-surface p-3 sm:p-4">
          <nav aria-label="Tool selection" className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("merge")}
              className={`focus-ring rounded-lg border px-4 py-2 text-sm font-medium transition ${
                tab === "merge"
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-transparent text-text hover:border-accent hover:text-accent"
              }`}
            >
              Merge PDFs
            </button>
            <button
              type="button"
              onClick={() => setTab("compress")}
              className={`focus-ring rounded-lg border px-4 py-2 text-sm font-medium transition ${
                tab === "compress"
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-transparent text-text hover:border-accent hover:text-accent"
              }`}
            >
              Compress PDF
            </button>
          </nav>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold sm:text-xl">{activeCopy.title}</h2>
          <p className="mt-1 text-sm text-muted sm:text-base">{activeCopy.description}</p>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          {tab === "merge" ? <MergeTool /> : <CompressTool />}
        </section>
      </main>
    </div>
  )
}

export default App

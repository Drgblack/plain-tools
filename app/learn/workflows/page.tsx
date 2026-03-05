import type { Metadata } from "next"
import Link from "next/link"

import { workflowRouteSlugs } from "@/lib/seo/workflows-content"

export const metadata: Metadata = {
  title: "PDF Workflows - Offline & Private | Plain.tools",
  description:
    "Practical PDF workflow guides for everyday tasks. Runs locally in your browser. No uploads.",
  alternates: {
    canonical: "https://plain.tools/learn/workflows",
  },
  openGraph: {
    title: "PDF Workflows - Offline & Private | Plain.tools",
    description:
      "Practical PDF workflow guides for everyday tasks. Runs locally in your browser. No uploads.",
    url: "https://plain.tools/learn/workflows",
    type: "article",
  },
}

function toTitle(slug: string) {
  return slug
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

export default function WorkflowHubPage() {
  return (
    <main className="px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          PDF Workflows
        </h1>
        <p className="text-base text-muted-foreground">
          Practical step-by-step workflows for common PDF tasks. Runs locally in your browser. No uploads.
        </p>
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <ul className="grid gap-3 sm:grid-cols-2">
            {workflowRouteSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/learn/workflows/${slug}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {toTitle(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

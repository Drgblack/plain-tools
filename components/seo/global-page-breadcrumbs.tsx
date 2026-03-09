"use client"

import { usePathname } from "next/navigation"

import { PageBreadcrumbs } from "@/components/seo/page-breadcrumbs"

const STATIC_PAGE_LABELS: Record<string, string> = {
  "/about": "About",
  "/support": "Support",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/changelog": "Changelog",
  "/roadmap": "Roadmap",
}

export function GlobalPageBreadcrumbs() {
  const pathname = usePathname()

  if (!pathname) return null

  const label = STATIC_PAGE_LABELS[pathname]
  if (!label) return null

  return (
    <div className="border-b border-border/60 bg-background/70">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label }]} />
      </div>
    </div>
  )
}

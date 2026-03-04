"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LEARN_TO_TOOL_MAP, getToolSeoEntry } from "@/lib/seo-route-map"

export function ContextualResourceLinks() {
  const pathname = usePathname()
  if (!pathname) return null

  const segments = pathname.split("/").filter(Boolean)
  if (segments.length < 2) return null

  if (segments[0] === "tools" && segments[1]) {
    const tool = getToolSeoEntry(segments[1])
    if (!tool) return null

    return (
      <div className="mx-auto mb-10 max-w-6xl rounded-xl border border-[#0070f3]/25 bg-[#0070f3]/8 p-4">
        <p className="text-sm text-white/80">
          Learn more:{" "}
          <Link href={tool.learnHref} className="font-medium text-[#7ab8ff] hover:underline">
            {tool.learnLabel} {"\u2192"}
          </Link>
        </p>
      </div>
    )
  }

  if (segments[0] === "learn" && segments[1]) {
    const mapping = LEARN_TO_TOOL_MAP[segments[1]]
    if (!mapping) return null

    return (
      <div className="mx-auto mb-10 max-w-6xl rounded-xl border border-[#0070f3]/25 bg-[#0070f3]/8 p-4">
        <p className="text-sm text-white/80">
          Try the related workflow now:{" "}
          <Link href={mapping.href} className="font-medium text-[#7ab8ff] hover:underline">
            {mapping.label}
          </Link>
        </p>
      </div>
    )
  }

  return null
}

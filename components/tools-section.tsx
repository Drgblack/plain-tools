"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpDown,
  FileOutput,
  FileSearch,
  FileText,
  LayoutGrid,
  Lock,
  Merge,
  MessageSquare,
  Minimize2,
  PencilLine,
  PenTool,
  RefreshCw,
  ScanText,
  Search,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  Split,
  Unlock,
  Zap,
  Layers,
  LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TOOL_CATALOGUE, type ToolCategory, type ToolDefinition } from "@/lib/tools-catalogue"

type CategoryConfig = {
  id: "All" | ToolCategory
  label: string
  icon: LucideIcon
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: "All", label: "All", icon: Layers },
  { id: "Core", label: "Core", icon: Layers },
  { id: "Security & Privacy", label: "Security & Privacy", icon: ShieldAlert },
  { id: "Performance & Edit", label: "Performance & Edit", icon: LayoutGrid },
  { id: "AI Assistant", label: "AI Assistant", icon: Sparkles },
]

const ICON_MAP: Record<string, LucideIcon> = {
  Merge,
  Split,
  Minimize2,
  ArrowUpDown,
  FileOutput,
  RefreshCw,
  FileSearch,
  ShieldAlert,
  PenTool,
  Unlock,
  SearchCheck,
  LayoutGrid,
  Zap,
  ScanText,
  Sparkles,
  MessageSquare,
  PencilLine,
}

const WEBGPU_TOOL_IDS = new Set([
  "plain-webgpu-page-organiser",
  "plain-hardware-accelerated-batch-engine",
  "plain-offline-ocr-pipeline",
])

const LOCAL_ENGINE_TOOL_IDS = new Set([
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "convert-pdf",
  "extract-pages",
  "reorder-pages",
  "plain-metadata-purge",
  "plain-irreversible-redactor",
  "plain-local-cryptographic-signer",
  "plain-password-breaker",
  "plain-privacy-risk-scanner",
  "plain-real-time-compression-previewer",
])

const resolveIcon = (tool: ToolDefinition) => {
  if (!tool.icon) return FileText
  return ICON_MAP[tool.icon] ?? FileText
}

const getSystemBadge = (tool: ToolDefinition) => {
  if (tool.badge) {
    return tool.badge
  }
  if (WEBGPU_TOOL_IDS.has(tool.id)) {
    return "WebGPU"
  }
  if (LOCAL_ENGINE_TOOL_IDS.has(tool.id)) {
    return "Local Engine"
  }
  return null
}

export function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState<"All" | ToolCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isProUser, setIsProUser] = useState(false)
  const availableTools = useMemo(
    () => TOOL_CATALOGUE.filter((tool) => tool.available),
    []
  )
  const categoryCounts = useMemo(() => {
    const counts: Record<"All" | ToolCategory, number> = {
      All: availableTools.length,
      Core: 0,
      "Security & Privacy": 0,
      "Performance & Edit": 0,
      "AI Assistant": 0,
    }

    for (const tool of availableTools) {
      counts[tool.category] += 1
    }

    return counts
  }, [availableTools])

  const showingSearchResults = searchQuery.trim().length > 0

  useEffect(() => {
    let cancelled = false

    const loadSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/subscription/status", {
          method: "GET",
          cache: "no-store",
        })
        if (!response.ok) {
          return
        }

        const payload = (await response.json().catch(() => null)) as { isPro?: boolean } | null
        if (!cancelled && payload?.isPro === true) {
          setIsProUser(true)
        }
      } catch {
        // Keep default false when status check is unavailable.
      }
    }

    void loadSubscriptionStatus()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      return availableTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.slug.toLowerCase().includes(query)
      )
    }

    if (activeCategory === "All") {
      return availableTools
    }

    return availableTools.filter((tool) => tool.category === activeCategory)
  }, [activeCategory, availableTools, searchQuery])

  return (
    <section id="tools" className="relative px-4 pt-24 pb-28 md:pt-28 md:pb-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/[0.02] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tool Catalogue</h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search all tools..."
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-background to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
          <div className="overflow-x-auto pb-1 [scrollbar-width:thin]">
            <div className="inline-flex min-w-max items-center gap-2 whitespace-nowrap rounded-lg bg-white/[0.03] p-1 ring-1 ring-white/[0.06]">
              {CATEGORY_CONFIG.map((category) => {
                const Icon = category.icon
                const isActive = !showingSearchResults && activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id)
                      setSearchQuery("")
                    }}
                    className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{`${category.label} (${categoryCounts[category.id] ?? 0})`}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <p className="mt-1 text-right text-[11px] text-muted-foreground/70 md:hidden">
            Swipe to view categories
          </p>
        </div>

        {showingSearchResults ? (
          <div className="mt-4 flex items-center gap-2">
            <p className="text-[13px] text-muted-foreground/70">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[12px] text-accent hover:underline"
            >
              Clear
            </button>
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = resolveIcon(tool)
            const systemBadge = getSystemBadge(tool)
            const isAiTool = tool.category === "AI Assistant"
            const privacyBadge = isAiTool ? "Text sent to server (opt-in)" : "100% Local"
            const showProBadge = Boolean(tool.pro && !isProUser)

            const card = (
              <Card
                className="group relative h-full min-h-[44px] cursor-pointer overflow-hidden rounded-xl border border-[#3b3b3b] bg-[#151515] transition-all duration-150 outline-none hover:border-[#0070f3] hover:shadow-[0_0_24px_rgba(0,112,243,0.18)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {showProBadge ? (
                  <div className="absolute top-3 left-3 z-10">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300"
                          tabIndex={0}
                        >
                          PRO
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        Available with Plain Pro.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1 ring-1 ring-white/[0.06]">
                  <Lock className={`h-2.5 w-2.5 ${isAiTool ? "text-amber-300/80" : "text-emerald-400/80"}`} />
                  <span className="text-[10px] font-medium text-foreground/90">
                    {privacyBadge}
                  </span>
                </div>

                <CardContent className="relative flex items-start gap-4 p-6 pt-10">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/12 ring-1 ring-accent/25 transition-all group-hover:bg-accent/20 group-hover:ring-accent/45"
                  >
                    <Icon className="h-7 w-7 text-accent/80 transition-all group-hover:text-accent" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 className="text-[14px] font-semibold leading-tight text-foreground group-hover:text-foreground">
                        {tool.name}
                      </h3>
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>

                    <p className="mt-2 text-[13px] leading-relaxed text-foreground/80 group-hover:text-foreground/90">
                      {tool.description}
                    </p>

                    {systemBadge ? (
                      <div className="mt-3 inline-flex items-center rounded-full border border-[#0070f3]/30 bg-[#0070f3]/10 px-2.5 py-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#76bcff]">
                          {systemBadge}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )

            return (
              <TiltCard
                key={tool.id}
                className="h-full"
                tiltIntensity={8}
                glowOnHover={true}
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block h-full min-h-[44px] rounded-xl focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Open ${tool.name}. ${tool.description}`}
                >
                  {card}
                </Link>
              </TiltCard>
            )
          })}
        </div>

        {filteredTools.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-[14px] text-muted-foreground/70">
              No tools found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

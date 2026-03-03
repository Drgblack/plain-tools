"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Merge, Split, Minimize2, ArrowUpDown, FileOutput, EyeOff, ScanText,
  MessageSquare, Sparkles, Shield, Cpu,
  History, ToggleLeft, Gauge, Command, CornerDownLeft, ArrowUp, ArrowDown,
  Zap, HardDrive, Lock, X, PencilLine, RefreshCw, FileSearch, PenTool, Unlock, SearchCheck, LayoutGrid, Layers, FileText
} from "lucide-react"
import { TOOL_CATALOGUE, type ToolDefinition } from "@/lib/tools-catalogue"

// Types
interface CommandItem {
  id: string
  title: string
  description?: string
  category: "tools" | "learning" | "actions"
  icon: React.ElementType
  href?: string
  action?: () => void
  shortcut?: string
}

// Fuzzy search implementation
function fuzzySearch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Direct substring match
  if (textLower.includes(queryLower)) return true
  
  // Fuzzy matching - all query chars must appear in order
  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }
  return queryIndex === queryLower.length
}

function fuzzyScore(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match at start gets highest score
  if (textLower.startsWith(queryLower)) return 100
  
  // Contains as substring
  if (textLower.includes(queryLower)) return 80
  
  // Fuzzy match score based on how close characters are
  let score = 0
  let queryIndex = 0
  let lastMatchIndex = -1
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 10
      if (lastMatchIndex !== -1 && i - lastMatchIndex === 1) {
        score += 5 // Bonus for consecutive matches
      }
      lastMatchIndex = i
      queryIndex++
    }
  }
  
  return queryIndex === queryLower.length ? score : 0
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const closePalette = useCallback(() => setIsOpen(false), [])

  const resolveToolIcon = useCallback((tool: ToolDefinition) => {
    const iconMap: Record<string, React.ElementType> = {
      Merge,
      Split,
      Minimize2,
      ArrowUpDown,
      FileOutput,
      RefreshCw,
      FileSearch,
      ShieldAlert: EyeOff,
      PenTool,
      Unlock,
      SearchCheck,
      LayoutGrid,
      Zap,
      ScanText,
      Sparkles,
      MessageSquare,
      PencilLine,
      Layers,
    }

    if (!tool.icon) {
      return FileText
    }

    return iconMap[tool.icon] ?? FileText
  }, [])

  // Define all command items
  const allItems: CommandItem[] = useMemo(() => [
    ...TOOL_CATALOGUE
      .filter((tool) => tool.available)
      .map((tool) => ({
        id: tool.id,
        title: tool.name,
        description: tool.description,
        category: "tools" as const,
        icon: resolveToolIcon(tool),
        href: `/tools/${tool.slug}`,
      })),

    // Learning Centre articles
    { id: "learn-wasm", title: "WebAssembly Explained", description: "How your data stays in-browser", category: "learning", icon: Cpu, href: "/learn/wasm-security" },
    { id: "learn-webgpu", title: "Hardware Acceleration", description: "Using WebGPU for local AI", category: "learning", icon: Zap, href: "/learn/webgpu-acceleration" },
    { id: "learn-redaction", title: "The Redaction Guide", description: "Ensuring permanent data removal", category: "learning", icon: EyeOff, href: "/learn/redaction-guide" },
    { id: "learn-offline", title: "Offline Workflows", description: "Using Plain in high-security environments", category: "learning", icon: Shield, href: "/learn/offline-workflows" },
    { id: "learn-ram", title: "RAM Optimisation", description: "Managing 500MB+ PDFs on-device", category: "learning", icon: HardDrive, href: "/learn/ram-optimisation" },
    { id: "learn-privacy", title: "Privacy 101", description: "Why uploading documents is a risk", category: "learning", icon: Lock, href: "/learn/privacy-101" },
    
    // Actions
    { id: "action-clear-history", title: "Clear Local History", description: "Remove all stored document history", category: "actions", icon: History, action: () => {
      localStorage.removeItem("plain-local-history")
      window.dispatchEvent(new CustomEvent("historyCleared"))
    }},
    { id: "action-toggle-privacy", title: "Toggle Privacy Mode", description: "Disable history recording", category: "actions", icon: ToggleLeft, action: () => {
      const current = localStorage.getItem("plain-history-enabled") !== "false"
      localStorage.setItem("plain-history-enabled", (!current).toString())
      window.dispatchEvent(new CustomEvent("privacyModeToggled"))
    }},
    { id: "action-benchmark", title: "Run Performance Benchmark", description: "Test your device capabilities", category: "actions", icon: Gauge, href: "/labs" },
  ], [resolveToolIcon])

  // Filter and sort items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    
    return allItems
      .filter(item => 
        fuzzySearch(query, item.title) || 
        (item.description && fuzzySearch(query, item.description))
      )
      .sort((a, b) => {
        const scoreA = Math.max(
          fuzzyScore(query, a.title),
          a.description ? fuzzyScore(query, a.description) * 0.5 : 0
        )
        const scoreB = Math.max(
          fuzzyScore(query, b.title),
          b.description ? fuzzyScore(query, b.description) * 0.5 : 0
        )
        return scoreB - scoreA
      })
  }, [query, allItems])

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: { category: string; label: string; items: CommandItem[] }[] = [
      { category: "tools", label: "Tools", items: [] },
      { category: "learning", label: "Learning Centre", items: [] },
      { category: "actions", label: "Actions", items: [] },
    ]
    
    filteredItems.forEach(item => {
      const group = groups.find(g => g.category === item.category)
      if (group) group.items.push(item)
    })
    
    return groups.filter(g => g.items.length > 0)
  }, [filteredItems])

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    return groupedItems.flatMap(g => g.items)
  }, [groupedItems])

  // Keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Programmatic trigger for mobile and custom UI buttons
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true)
    window.addEventListener("plain:open-command-palette", handleOpenEvent)
    return () => window.removeEventListener("plain:open-command-palette", handleOpenEvent)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (!isOpen) return

    setQuery("")
    setSelectedIndex(0)

    const focusInput = () => {
      inputRef.current?.focus({ preventScroll: true })
    }

    const rafId = requestAnimationFrame(focusInput)
    const timeoutId = window.setTimeout(focusInput, 120)
    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
    }
  }, [isOpen])

  // Execute selected item
  const executeItem = useCallback((item: CommandItem) => {
    closePalette()
    if (item.action) {
      item.action()
    } else if (item.href) {
      router.push(item.href)
    }
  }, [closePalette, router])

  // Keyboard navigation within palette
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (flatItems[selectedIndex]) {
          executeItem(flatItems[selectedIndex])
        }
        break
    }
  }, [executeItem, flatItems, selectedIndex])

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    selectedEl?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedIndex])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Calculate flat index for an item
  const getFlatIndex = (categoryIndex: number, itemIndex: number): number => {
    let index = 0
    for (let i = 0; i < categoryIndex; i++) {
      index += groupedItems[i].items.length
    }
    return index + itemIndex
  }

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[12px] text-muted-foreground/60 hover:bg-white/[0.06] hover:text-muted-foreground transition-all duration-150"
        title="Open Command Palette"
      >
        <Command className="h-3 w-3" />
        <span className="font-mono">K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={closePalette}
            />

            {/* Palette Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-[101] flex items-start justify-center p-0 sm:p-4 sm:pt-20"
            >
              <div 
                className="flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border border-[#333] bg-[#0f0f0f] shadow-[0_0_0_1px_rgba(0,112,243,0.1),0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_40px_rgba(0,112,243,0.15)] sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:rounded-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Command Palette"
              >
                <div className="flex items-center justify-between border-b border-[#333] px-4 py-3 sm:hidden">
                  <p className="text-sm font-semibold text-white/80">Command Palette</p>
                  <button
                    onClick={closePalette}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-white/[0.10] px-3 text-xs font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative border-b border-[#333]">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search tools, articles, actions..."
                    className="w-full bg-transparent py-4 pl-12 pr-4 text-[16px] text-white placeholder:text-white/40 outline-none"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <button
                    onClick={closePalette}
                    className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/60 sm:inline-flex"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Results */}
                <div 
                  ref={listRef}
                  className="flex-1 overflow-y-auto overscroll-contain sm:max-h-[400px]"
                >
                  {groupedItems.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-[14px] text-white/40">No results found for &ldquo;{query}&rdquo;</p>
                      <p className="mt-1 text-[12px] text-white/25">Try a different search term</p>
                    </div>
                  ) : (
                    groupedItems.map((group, groupIndex) => (
                      <div key={group.category} className="py-2">
                        {/* Category Label */}
                        <div className="px-4 py-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                            {group.label}
                          </span>
                        </div>

                        {/* Items */}
                        {group.items.map((item, itemIndex) => {
                          const flatIndex = getFlatIndex(groupIndex, itemIndex)
                          const isSelected = flatIndex === selectedIndex
                          
                          return (
                            <button
                              key={item.id}
                              data-index={flatIndex}
                              onClick={() => executeItem(item)}
                              onMouseEnter={() => setSelectedIndex(flatIndex)}
                              className={`group relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${
                                isSelected 
                                  ? "bg-[#111]" 
                                  : "hover:bg-[#111]/50"
                              }`}
                            >
                              {/* Active indicator bar */}
                              <div className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#0070f3] transition-all duration-100 ${
                                isSelected ? "opacity-100" : "opacity-0"
                              }`} />

                              {/* Icon */}
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-100 ${
                                isSelected 
                                  ? "bg-[#0070f3]/15 text-[#0070f3]" 
                                  : "bg-white/[0.04] text-white/50 group-hover:text-white/70"
                              }`}>
                                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-[14px] font-medium truncate transition-colors duration-100 ${
                                  isSelected ? "text-white" : "text-white/80"
                                }`}>
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="text-[12px] text-white/40 truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              {/* Shortcut hint */}
                              <div className={`flex items-center gap-1.5 text-[11px] font-mono text-white/25 transition-opacity duration-100 ${
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                              }`}>
                                <CornerDownLeft className="h-3 w-3" />
                                <span>to open</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-[#333] px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Navigation hints */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/30">
                      <span className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5">
                          <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px]">
                            <ArrowUp className="h-2.5 w-2.5 inline" />
                          </kbd>
                          <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px]">
                            <ArrowDown className="h-2.5 w-2.5 inline" />
                          </kbd>
                        </span>
                        <span>Navigate</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
                        <span>Select</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                        <span>Close</span>
                      </span>
                    </div>

                    {/* Brand footer */}
                    <p className="text-[10px] font-mono text-white/20 sm:text-right">
                      Plain Command Palette — Your data remains local.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

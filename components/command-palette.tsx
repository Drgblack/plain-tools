"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Globe,
  FileText,
  FileType,
  Calculator,
  Info,
  Shield,
  CheckCircle,
  Network,
  Wifi,
  FileCode,
  FileSearch,
  QrCode,
  FileImage,
  FileSpreadsheet,
  Presentation,
  PenTool,
  Lock,
  Unlock,
  ScanText,
  Minimize2,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  name: string
  description?: string
  href: string
  icon: React.ReactNode
  category: string
}

const commands: CommandItem[] = [
  // Navigation
  { id: "home", name: "Home", description: "Go to homepage", href: "/", icon: <Home className="h-4 w-4" />, category: "Navigation" },
  { id: "network-tools", name: "Network Tools", description: "IP, DNS, ping and more", href: "/network-tools", icon: <Globe className="h-4 w-4" />, category: "Navigation" },
  { id: "file-tools", name: "File Tools", description: "Convert and transform files", href: "/file-tools", icon: <FileCode className="h-4 w-4" />, category: "Navigation" },
  { id: "pdf-tools", name: "PDF Tools", description: "Compress, merge, split PDFs", href: "/pdf-tools", icon: <FileType className="h-4 w-4" />, category: "Navigation" },
  
  // Network Tools
  { id: "what-is-my-ip", name: "What is My IP", description: "See your public IP address", href: "/what-is-my-ip", icon: <Network className="h-4 w-4" />, category: "Network Tools" },
  { id: "dns-lookup", name: "DNS Lookup", description: "Query DNS records for any domain", href: "/dns-lookup", icon: <Globe className="h-4 w-4" />, category: "Network Tools" },
  { id: "site-status", name: "Site Status", description: "Check if a website is up", href: "/site-status", icon: <CheckCircle className="h-4 w-4" />, category: "Network Tools" },
  { id: "ping-test", name: "Ping Test", description: "Test latency to any host", href: "/ping-test", icon: <Wifi className="h-4 w-4" />, category: "Network Tools" },
  
  // PDF Tools
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one file", href: "/tools/merge-pdf", icon: <FileText className="h-4 w-4" />, category: "PDF Tools" },
  { id: "split-pdf", name: "Split PDF", description: "Split one PDF by ranges or pages", href: "/tools/split-pdf", icon: <FileType className="h-4 w-4" />, category: "PDF Tools" },
  { id: "compare-pdf", name: "Compare PDF Files", description: "Compare two PDFs with text diff highlights", href: "/tools/compare-pdf", icon: <FileSearch className="h-4 w-4" />, category: "PDF Tools" },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size", href: "/tools/compress-pdf", icon: <Minimize2 className="h-4 w-4" />, category: "PDF Tools" },
  { id: "rotate-pdf", name: "Rotate PDF Pages", description: "Rotate pages by 90, 180, or 270 degrees", href: "/tools/rotate-pdf", icon: <FileType className="h-4 w-4" />, category: "PDF Tools" },
  { id: "annotate-pdf", name: "Annotate PDF", description: "Add pen, highlight, and text annotations", href: "/tools/annotate-pdf", icon: <PenTool className="h-4 w-4" />, category: "PDF Tools" },
  { id: "watermark-pdf", name: "Add Watermark to PDF", description: "Overlay text or image watermark on each page", href: "/tools/watermark-pdf", icon: <FileText className="h-4 w-4" />, category: "PDF Tools" },
  { id: "sign-pdf", name: "Sign PDF", description: "Place a visual signature locally", href: "/tools/sign-pdf", icon: <PenTool className="h-4 w-4" />, category: "PDF Tools" },
  { id: "protect-pdf", name: "Protect PDF", description: "Encrypt a PDF with a password", href: "/tools/protect-pdf", icon: <Lock className="h-4 w-4" />, category: "PDF Tools" },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Remove PDF password protection locally", href: "/tools/unlock-pdf", icon: <Unlock className="h-4 w-4" />, category: "PDF Tools" },
  { id: "ocr-pdf", name: "OCR PDF", description: "Extract text from scanned PDFs locally", href: "/tools/ocr-pdf", icon: <ScanText className="h-4 w-4" />, category: "PDF Tools" },
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to .docx", href: "/tools/pdf-to-word", icon: <FileText className="h-4 w-4" />, category: "PDF Tools" },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to JPG images", href: "/tools/pdf-to-jpg", icon: <FileImage className="h-4 w-4" />, category: "PDF Tools" },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Extract table-like data to CSV", href: "/tools/pdf-to-excel", icon: <FileSpreadsheet className="h-4 w-4" />, category: "PDF Tools" },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF pages into slides", href: "/tools/pdf-to-ppt", icon: <Presentation className="h-4 w-4" />, category: "PDF Tools" },
  { id: "pdf-to-html", name: "PDF to HTML", description: "Export PDF pages as HTML with extracted text", href: "/tools/pdf-to-html", icon: <FileCode className="h-4 w-4" />, category: "PDF Tools" },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Combine images into a PDF", href: "/tools/jpg-to-pdf", icon: <FileImage className="h-4 w-4" />, category: "PDF Tools" },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert .docx to PDF", href: "/tools/word-to-pdf", icon: <FileType className="h-4 w-4" />, category: "PDF Tools" },
  { id: "text-to-pdf", name: "Text to PDF", description: "Convert plain text or Markdown to PDF", href: "/tools/text-to-pdf", icon: <FileText className="h-4 w-4" />, category: "PDF Tools" },
  
  // File Tools
  { id: "file-converters", name: "File Converters", description: "Convert between formats", href: "/file-converters", icon: <FileCode className="h-4 w-4" />, category: "File Tools" },
  { id: "base64", name: "Base64 Encode / Decode", description: "Encode or decode text and files locally", href: "/tools/base64", icon: <FileCode className="h-4 w-4" />, category: "File Tools" },
  { id: "file-hash", name: "File Hash / Checksum", description: "Compute SHA-256, MD5, SHA-1, or SHA-512 hash values", href: "/tools/file-hash", icon: <FileCode className="h-4 w-4" />, category: "File Tools" },
  { id: "qr-code", name: "QR Code Generator", description: "Generate scannable QR codes for URLs or text", href: "/tools/qr-code", icon: <QrCode className="h-4 w-4" />, category: "Utility" },
  
  // Company
  { id: "about", name: "About", description: "Learn about plain.tools", href: "/about", icon: <Info className="h-4 w-4" />, category: "Company" },
  { id: "privacy", name: "Privacy", description: "Our privacy policy", href: "/privacy", icon: <Shield className="h-4 w-4" />, category: "Company" },
  { id: "verify", name: "Verify", description: "Verify our privacy claims", href: "/verify-claims", icon: <CheckCircle className="h-4 w-4" />, category: "Company" },
  
  // External
  { id: "calculators", name: "Calculators", description: "plainfigures.org", href: "https://plainfigures.org", icon: <Calculator className="h-4 w-4" />, category: "External" },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredCommands = commands.filter((command) => {
    const searchText = `${command.name} ${command.description} ${command.category}`.toLowerCase()
    return searchText.includes(query.toLowerCase())
  })

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const flatCommands = Object.values(groupedCommands).flat()

  const handleSelect = useCallback((command: CommandItem) => {
    onOpenChange(false)
    setQuery("")
    setSelectedIndex(0)
    if (command.href.startsWith("http")) {
      window.open(command.href, "_blank", "noopener,noreferrer")
    } else {
      router.push(command.href)
    }
  }, [onOpenChange, router])

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev < flatCommands.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : flatCommands.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            handleSelect(flatCommands[selectedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          onOpenChange(false)
          setQuery("")
          setSelectedIndex(0)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, flatCommands, selectedIndex, handleSelect, onOpenChange])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && flatCommands[selectedIndex]) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      )
      selectedElement?.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex, flatCommands])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => {
          onOpenChange(false)
          setQuery("")
          setSelectedIndex(0)
        }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tools and pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search commands"
              aria-controls="command-list"
              aria-activedescendant={flatCommands[selectedIndex]?.id}
            />
            <kbd className="hidden h-6 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            id="command-list"
            role="listbox"
            className="max-h-[60vh] overflow-y-auto overscroll-contain p-2"
          >
            {flatCommands.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {items.map((command) => {
                    const index = flatCommands.findIndex((c) => c.id === command.id)
                    const isSelected = index === selectedIndex
                    return (
                      <button
                        key={command.id}
                        data-index={index}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(command)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                          isSelected
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          isSelected ? "bg-foreground/10" : "bg-secondary"
                        )}>
                          {command.icon}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium text-foreground">
                            {command.name}
                          </div>
                          {command.description && (
                            <div className="truncate text-xs text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <kbd className="hidden h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                            Enter
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

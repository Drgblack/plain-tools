"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Download, 
  Trash2, 
  Search, 
  AlertTriangle,
  Clock,
  FileText,
  Merge,
  Split,
  Minimize2,
  RotateCcw,
  FileOutput,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"

// History icon component (clock with arrow)
export function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

// Tool icon mapping
const toolIcons: Record<string, React.ElementType> = {
  merge: Merge,
  split: Split,
  compress: Minimize2,
  rotate: RotateCcw,
  convert: FileOutput,
  default: FileText,
}

// Tool label mapping
const toolLabels: Record<string, string> = {
  merge: "Merged",
  split: "Split",
  compress: "Compressed",
  rotate: "Rotated",
  convert: "Converted",
  reorder: "Reordered",
  extract: "Extracted",
  redact: "Redacted",
}

export interface HistoryEntry {
  id: string
  filename: string
  tool: string
  timestamp: number
  blobUrl?: string
  fileSize?: number
}

// Format relative time (e.g., "2 minutes ago")
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return "Just now"
  if (minutes === 1) return "1 minute ago"
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return "1 hour ago"
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })
}

// Format file size
function formatFileSize(bytes?: number): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Local storage keys
const HISTORY_KEY = "plain_local_history"
const HISTORY_ENABLED_KEY = "plain_history_enabled"

interface LocalHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function LocalHistorySidebar({ isOpen, onClose }: LocalHistorySidebarProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [historyEnabled, setHistoryEnabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(HISTORY_KEY)
      const enabled = localStorage.getItem(HISTORY_ENABLED_KEY)
      
      if (stored) {
        try {
          setHistory(JSON.parse(stored))
        } catch {
          setHistory([])
        }
      }
      
      setHistoryEnabled(enabled !== "false")
      setIsLoaded(true)
    }
  }, [])

  // Filter history based on search
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history
    const query = searchQuery.toLowerCase()
    return history.filter(entry => 
      entry.filename.toLowerCase().includes(query) ||
      (toolLabels[entry.tool] || entry.tool).toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  // Toggle history recording
  const handleToggleHistory = useCallback(() => {
    const newValue = !historyEnabled
    setHistoryEnabled(newValue)
    localStorage.setItem(HISTORY_ENABLED_KEY, String(newValue))
  }, [historyEnabled])

  // Delete single entry
  const handleDeleteEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(entry => entry.id !== id)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear all history
  const handleClearAll = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  // Download file
  const handleDownload = useCallback((entry: HistoryEntry) => {
    if (entry.blobUrl) {
      const a = document.createElement("a")
      a.href = entry.blobUrl
      a.download = entry.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }, [])

  return (
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
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[101] h-full w-full max-w-md border-l border-[#333] bg-[#0a0a0a] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#333] px-5 py-4">
              <div className="flex items-center gap-3">
                <HistoryIcon className="h-5 w-5 text-[#0070f3]" />
                <h2 className="text-[16px] font-semibold text-white">Local History</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-[#333] bg-[#111] p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} />
              <p className="text-[12px] leading-relaxed text-white/60">
                <span className="font-medium text-white/80">Local History Only:</span> This list is stored in your browser&apos;s cache. Clearing your browser data will wipe this history.
              </p>
            </div>

            {/* Search & Toggle */}
            <div className="mt-4 px-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#333] bg-[#111] py-2.5 pl-10 pr-4 text-[13px] text-white placeholder:text-white/40 outline-none transition-all duration-150 focus:border-[#0070f3] focus:shadow-[0_0_8px_rgba(0,112,243,0.15)]"
                />
              </div>

              {/* Record History Toggle */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-[#333] bg-[#111] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-white/60" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-white/80">Record History</span>
                </div>
                <button
                  onClick={handleToggleHistory}
                  className={`relative h-6 w-11 rounded-full transition-colors duration-150 ${
                    historyEnabled ? "bg-[#0070f3]" : "bg-[#333]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ${
                      historyEnabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="mt-4 flex-1 overflow-y-auto px-4" style={{ maxHeight: "calc(100vh - 340px)" }}>
              {!isLoaded ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0070f3] border-t-transparent" />
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="mb-3 h-10 w-10 text-white/20" strokeWidth={1.5} />
                  <p className="text-[14px] font-medium text-white/60">
                    {searchQuery ? "No matching entries" : "No history yet"}
                  </p>
                  <p className="mt-1 text-[12px] text-white/40">
                    {searchQuery 
                      ? "Try a different search term" 
                      : "Process a document to see it here"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {filteredHistory.map((entry) => {
                    const ToolIcon = toolIcons[entry.tool] || toolIcons.default
                    const toolLabel = toolLabels[entry.tool] || entry.tool

                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="group flex items-center gap-3 rounded-lg border border-[#333] bg-[#111] p-3 transition-colors hover:border-[#444]"
                      >
                        {/* Tool Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0070f3]/10">
                          <ToolIcon className="h-5 w-5 text-[#0070f3]" strokeWidth={1.5} />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-[13px] font-medium text-white">
                            {entry.filename}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/50">
                            <span className="font-medium text-[#0070f3]/80">{toolLabel}</span>
                            <span className="h-1 w-1 rounded-full bg-white/30" />
                            <span>{formatRelativeTime(entry.timestamp)}</span>
                            {entry.fileSize && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-white/30" />
                                <span>{formatFileSize(entry.fileSize)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {entry.blobUrl && (
                            <button
                              onClick={() => handleDownload(entry)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0070f3] transition-colors hover:bg-[#0070f3]/10"
                              title="Download"
                            >
                              <Download className="h-4 w-4" strokeWidth={2} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Delete from History"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[#333] bg-[#0a0a0a] px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-white/40">
                  {history.length} item{history.length !== 1 ? "s" : ""} stored locally
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={history.length === 0}
                  className="h-8 px-3 text-[12px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
                  Clear All
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// Helper function to add to history (call this from tools after processing)
export function addToLocalHistory(entry: Omit<HistoryEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return
  
  const enabled = localStorage.getItem(HISTORY_ENABLED_KEY)
  if (enabled === "false") return

  const stored = localStorage.getItem(HISTORY_KEY)
  const history: HistoryEntry[] = stored ? JSON.parse(stored) : []
  
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }
  
  // Add to front, keep max 50 entries
  const updated = [newEntry, ...history].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Search, Trash2, Eye, EyeOff, Download, Undo, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolWorkspace } from "./index"

interface RedactionBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  page: number
}

interface RedactionInterfaceProps {
  fileName?: string
}

export function RedactionInterface({ fileName = "document.pdf" }: RedactionInterfaceProps) {
  const [redactions, setRedactions] = useState<RedactionBox[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentBox, setCurrentBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
  const [showRedactions, setShowRedactions] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Simulated search results for demo
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    // Demo: simulate finding instances
    setSearchResults([
      `Page 1: "...contains ${searchQuery} in paragraph 2..."`,
      `Page 2: "...reference to ${searchQuery} found..."`,
      `Page 3: "...${searchQuery} appears in heading..."`,
    ])
  }, [searchQuery])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setIsDrawing(true)
    setCurrentBox({ startX: x, startY: y, endX: x, endY: y })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || !currentBox) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCurrentBox(prev => prev ? { ...prev, endX: x, endY: y } : null)
  }, [isDrawing, currentBox])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentBox) return
    setIsDrawing(false)
    
    const width = Math.abs(currentBox.endX - currentBox.startX)
    const height = Math.abs(currentBox.endY - currentBox.startY)
    
    if (width > 10 && height > 10) {
      const newRedaction: RedactionBox = {
        id: `redact-${Date.now()}`,
        x: Math.min(currentBox.startX, currentBox.endX),
        y: Math.min(currentBox.startY, currentBox.endY),
        width,
        height,
        page: currentPage,
      }
      setRedactions(prev => [...prev, newRedaction])
    }
    setCurrentBox(null)
  }, [isDrawing, currentBox, currentPage])

  const removeRedaction = useCallback((id: string) => {
    setRedactions(prev => prev.filter(r => r.id !== id))
  }, [])

  const redactSearchResults = useCallback(() => {
    // Demo: add redaction boxes for search results
    const newRedactions: RedactionBox[] = searchResults.map((_, index) => ({
      id: `search-redact-${Date.now()}-${index}`,
      x: 50 + Math.random() * 200,
      y: 100 + index * 80,
      width: 150 + Math.random() * 100,
      height: 20,
      page: index + 1,
    }))
    setRedactions(prev => [...prev, ...newRedactions])
  }, [searchResults])

  return (
    <ToolWorkspace 
      title="Permanent Redaction" 
      fileName={fileName}
      privacyBannerText="Redactions Applied Locally"
    >
      <div className="flex h-full">
        {/* Sidebar - Search & Redact */}
        <aside className="w-72 border-r border-white/[0.06] bg-[oklch(0.125_0.006_250)] flex flex-col">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="text-[13px] font-semibold text-foreground mb-3">Search & Redact</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05]"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="sm" 
              className="w-full mt-3 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30"
            >
              Find All Instances
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-muted-foreground">
                  {searchResults.length} matches found
                </span>
                <Button
                  size="sm"
                  onClick={redactSearchResults}
                  className="h-7 px-2 text-[11px] bg-destructive/20 text-destructive hover:bg-destructive/30"
                >
                  Redact All
                </Button>
              </div>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div 
                    key={index}
                    className="rounded-lg bg-white/[0.03] p-3 text-[12px] text-muted-foreground/80 hover:bg-white/[0.05] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-accent/60" />
                      <span>{result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Redaction List */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-foreground">Redactions</h3>
              <span className="text-[11px] text-muted-foreground/60">{redactions.length} areas</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {redactions.filter(r => r.page === currentPage).map((redaction) => (
                <div 
                  key={redaction.id}
                  className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 text-[12px]"
                >
                  <span className="text-muted-foreground/70">
                    {Math.round(redaction.width)}x{Math.round(redaction.height)}px
                  </span>
                  <button
                    onClick={() => removeRedaction(redaction.id)}
                    className="text-destructive/70 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              ))}
              {redactions.filter(r => r.page === currentPage).length === 0 && (
                <p className="text-[12px] text-muted-foreground/50 text-center py-2">
                  No redactions on this page
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[oklch(0.12_0.005_250)] px-4 py-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRedactions(!showRedactions)}
                className="h-8 gap-2 text-[12px] text-muted-foreground/70"
              >
                {showRedactions ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                    Show Preview
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRedactions([])}
                className="h-8 gap-2 text-[12px] text-muted-foreground/70"
              >
                <Undo className="h-3.5 w-3.5" strokeWidth={2} />
                Clear All
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-foreground/60">Page {currentPage} of 3</span>
              <Button
                size="sm"
                className="h-8 gap-2 bg-accent text-white hover:bg-accent-hover"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                Apply & Download
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-8 bg-[oklch(0.10_0.004_250)]">
            <div className="mx-auto max-w-2xl">
              <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative bg-white rounded-lg shadow-2xl aspect-[8.5/11] cursor-crosshair select-none overflow-hidden"
                style={{ minHeight: 600 }}
              >
                {/* Simulated PDF Content */}
                <div className="absolute inset-0 p-8 pointer-events-none">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  </div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                  </div>
                  <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* Redaction Boxes */}
                {showRedactions && redactions
                  .filter(r => r.page === currentPage)
                  .map((redaction) => (
                    <div
                      key={redaction.id}
                      className="absolute bg-black rounded-sm"
                      style={{
                        left: redaction.x,
                        top: redaction.y,
                        width: redaction.width,
                        height: redaction.height,
                      }}
                    />
                  ))}

                {/* Current Drawing Box */}
                {currentBox && (
                  <div
                    className="absolute bg-black/60 border-2 border-accent rounded-sm"
                    style={{
                      left: Math.min(currentBox.startX, currentBox.endX),
                      top: Math.min(currentBox.startY, currentBox.endY),
                      width: Math.abs(currentBox.endX - currentBox.startX),
                      height: Math.abs(currentBox.endY - currentBox.startY),
                    }}
                  />
                )}
              </div>

              {/* Page Navigation */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-[12px] font-medium transition-all ${
                      currentPage === page
                        ? "bg-accent text-white"
                        : "bg-white/[0.05] text-muted-foreground/70 hover:bg-white/[0.08]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  )
}

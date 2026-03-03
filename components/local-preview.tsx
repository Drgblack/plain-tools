"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { motion, Reorder, useDragControls } from "framer-motion"
import Image from "next/image"
import { 
  FileText, 
  FileImage, 
  Scissors, 
  Minimize2, 
  Merge, 
  GripVertical,
  X,
  Shield,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

// Initialise PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

export interface PDFFile {
  id: string
  file: File
  name: string
  size: number
  pageCount: number
  thumbnails: string[]
}

interface LocalPreviewProps {
  files: File[]
  onClose: () => void
  onFilesReorder?: (files: PDFFile[]) => void
  mode?: "single" | "merge"
}

interface SuggestedTool {
  name: string
  description: string
  href: string
  icon: React.ElementType
  reason: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getSuggestedTools(files: PDFFile[]): SuggestedTool[] {
  const suggestions: SuggestedTool[] = []
  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const fileCount = files.length

  // Multiple files - suggest Merge
  if (fileCount > 1) {
    suggestions.push({
      name: "Merge PDFs",
      description: "Combine all files into one document",
      href: "/tools/merge-pdf",
      icon: Merge,
      reason: `${fileCount} files selected`
    })
  }

  // Single page - suggest Convert to Image
  if (totalPages === 1) {
    suggestions.push({
      name: "Convert to Image",
      description: "Export as PNG or JPEG",
      href: "/tools/pdf-to-image",
      icon: FileImage,
      reason: "Single page document"
    })
  }

  // 10+ pages - suggest Split or Compress
  if (totalPages >= 10) {
    suggestions.push({
      name: "Split PDF",
      description: "Extract specific pages",
      href: "/tools/split-pdf",
      icon: Scissors,
      reason: `${totalPages} pages detected`
    })
  }

  // Large file - suggest Compress
  if (totalSize > 5 * 1024 * 1024) { // 5MB+
    suggestions.push({
      name: "Compress",
      description: "Reduce file size",
      href: "/tools/compress-pdf",
      icon: Minimize2,
      reason: formatFileSize(totalSize)
    })
  }

  // Always show at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push({
      name: "View & Edit",
      description: "Reorder, rotate, or delete pages",
      href: "/tools/reorder-pdf",
      icon: FileText,
      reason: "Ready to edit"
    })
  }

  return suggestions.slice(0, 4) // Max 4 suggestions
}

// Draggable thumbnail item for merge mode
function DraggableThumbnail({ 
  pdfFile, 
  onRemove 
}: { 
  pdfFile: PDFFile
  onRemove: (id: string) => void 
}) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={pdfFile}
      id={pdfFile.id}
      dragListener={false}
      dragControls={dragControls}
      className="group relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative rounded-lg border border-[#333] bg-[#111] overflow-hidden transition-all duration-150 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.2)]">
        {/* Drag handle */}
        <div 
          className="absolute top-2 left-2 z-20 cursor-grab rounded bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="h-4 w-4 text-white/70" />
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(pdfFile.id)}
          className="absolute top-2 right-2 z-20 rounded bg-black/60 p-1 opacity-0 transition-opacity hover:bg-red-500/80 group-hover:opacity-100"
          aria-label="Remove file"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* First page thumbnail */}
        <div className="aspect-[3/4] p-2">
          {pdfFile.thumbnails[0] ? (
            <div className="relative h-full w-full">
              <Image
                src={pdfFile.thumbnails[0]}
                alt={pdfFile.name}
                fill
                unoptimized
                sizes="160px"
                className="rounded object-contain"
                draggable={false}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded bg-[#0a0a0a]">
              <FileText className="h-8 w-8 text-white/20" />
            </div>
          )}
        </div>

        {/* File info overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
          <p className="truncate text-[11px] font-medium text-white font-mono">
            {pdfFile.name}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/60">
            <span>{pdfFile.pageCount} pg</span>
            <span className="h-2.5 w-px bg-white/20" />
            <span>{formatFileSize(pdfFile.size)}</span>
          </div>
        </div>
      </div>
    </Reorder.Item>
  )
}

export function LocalPreview({ files, onClose, onFilesReorder, mode = "single" }: LocalPreviewProps) {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load PDFs and generate thumbnails
  useEffect(() => {
    const loadPDFs = async () => {
      setIsLoading(true)
      const loadedFiles: PDFFile[] = []

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          const pageCount = pdf.numPages
          const thumbnails: string[] = []

          // Generate thumbnails for all pages
          for (let i = 1; i <= Math.min(pageCount, 20); i++) {
            const page = await pdf.getPage(i)
            const viewport = page.getViewport({ scale: 0.4 })
            
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            if (!context) continue

            canvas.height = viewport.height
            canvas.width = viewport.width

            await page.render({
              canvas: canvas as unknown as HTMLCanvasElement,
              canvasContext: context,
              viewport: viewport,
            }).promise

            thumbnails.push(canvas.toDataURL("image/jpeg", 0.7))
          }

          loadedFiles.push({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            size: file.size,
            pageCount,
            thumbnails
          })
        } catch (error) {
          console.error("Error loading PDF:", error)
        }
      }

      setPdfFiles(loadedFiles)
      setIsLoading(false)
    }

    if (files.length > 0) {
      loadPDFs()
    }
  }, [files])

  // Handle reorder in merge mode
  const handleReorder = useCallback((newOrder: PDFFile[]) => {
    setPdfFiles(newOrder)
    onFilesReorder?.(newOrder)
  }, [onFilesReorder])

  // Remove file
  const handleRemoveFile = useCallback((id: string) => {
    setPdfFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id)
      if (newFiles.length === 0) {
        onClose()
      }
      return newFiles
    })
  }, [onClose])

  // Get suggested tools
  const suggestedTools = getSuggestedTools(pdfFiles)

  // Current file for single mode
  const currentFile = pdfFiles[selectedFileIndex]

  // Scroll thumbnail into view
  const scrollToPage = (index: number) => {
    setSelectedPageIndex(index)
    const container = scrollContainerRef.current
    if (container) {
      const thumbnails = container.querySelectorAll("[data-thumbnail]")
      thumbnails[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#0070f3]/30 border-t-[#0070f3]" />
          <p className="mt-4 text-[14px] font-mono text-white/60">Generating preview...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Preview Pane */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 mx-auto mt-4 flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-2xl border border-[#333] bg-[rgba(0,0,0,0.95)] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333] px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#0070f3]" />
            <h2 className="text-[15px] font-semibold text-white">Local Preview</h2>
            {pdfFiles.length > 1 && (
              <span className="rounded-full bg-[#0070f3]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#0070f3]">
                {pdfFiles.length} files
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {mode === "merge" && pdfFiles.length > 1 ? (
            /* Merge Mode - Drag to Reorder */
            <div className="h-full p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] text-white/60">
                  Drag to reorder files before merging
                </p>
                <span className="text-[11px] font-mono text-white/40">
                  {pdfFiles.reduce((sum, f) => sum + f.pageCount, 0)} total pages
                </span>
              </div>
              <Reorder.Group
                axis="x"
                values={pdfFiles}
                onReorder={handleReorder}
                className="flex gap-4 overflow-x-auto pb-4"
              >
                {pdfFiles.map((pdfFile) => (
                  <DraggableThumbnail
                    key={pdfFile.id}
                    pdfFile={pdfFile}
                    onRemove={handleRemoveFile}
                  />
                ))}
              </Reorder.Group>
            </div>
          ) : (
            /* Single File Mode - Light Table View */
            <div className="flex h-full flex-col">
              {/* File metadata overlay */}
              {currentFile && (
                <div className="border-b border-[#222] bg-[#0a0a0a] px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-[13px] font-medium text-white">
                        {currentFile.name}
                      </span>
                      <span className="h-4 w-px bg-white/10" />
                      <span className="text-[12px] text-white/50">
                        {formatFileSize(currentFile.size)}
                      </span>
                      <span className="h-4 w-px bg-white/10" />
                      <span className="text-[12px] text-white/50">
                        {currentFile.pageCount} {currentFile.pageCount === 1 ? "page" : "pages"}
                      </span>
                    </div>
                    
                    {/* Zoom controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                        className="rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="min-w-[3rem] text-center text-[11px] font-mono text-white/50">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                        className="rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail strip - Light Table */}
              {currentFile && (
                <div className="relative flex-1 overflow-hidden">
                  {/* Navigation arrows */}
                  {selectedPageIndex > 0 && (
                    <button
                      onClick={() => scrollToPage(selectedPageIndex - 1)}
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white/70 transition-all hover:bg-[#0070f3] hover:text-white"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  {selectedPageIndex < currentFile.thumbnails.length - 1 && (
                    <button
                      onClick={() => scrollToPage(selectedPageIndex + 1)}
                      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white/70 transition-all hover:bg-[#0070f3] hover:text-white"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}

                  {/* Scrollable thumbnail container */}
                  <div 
                    ref={scrollContainerRef}
                    className="flex h-full items-center gap-4 overflow-x-auto px-6 py-4 scroll-smooth"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
                  >
                    {currentFile.thumbnails.map((thumbnail, index) => (
                      <motion.button
                        key={index}
                        data-thumbnail
                        onClick={() => setSelectedPageIndex(index)}
                        className={`relative shrink-0 rounded-lg border-2 transition-all duration-150 ${
                          selectedPageIndex === index
                            ? "border-[#0070f3] shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                            : "border-[#333] hover:border-[#555]"
                        }`}
                        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                        whileHover={{ scale: zoom * 1.02 }}
                        whileTap={{ scale: zoom * 0.98 }}
                      >
                        <div className="aspect-[3/4] w-32 overflow-hidden rounded-md bg-[#111]">
                          <div className="relative h-full w-full">
                            <Image
                              src={thumbnail}
                              alt={`Page ${index + 1}`}
                              fill
                              unoptimized
                              sizes="128px"
                              className="object-contain"
                              draggable={false}
                            />
                          </div>
                        </div>
                        {/* Page number */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-white">
                          {index + 1}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Multiple file selector (if in single mode but multiple files) */}
              {pdfFiles.length > 1 && (
                <div className="border-t border-[#222] bg-[#0a0a0a] px-6 py-3">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {pdfFiles.map((pdfFile, index) => (
                      <button
                        key={pdfFile.id}
                        onClick={() => {
                          setSelectedFileIndex(index)
                          setSelectedPageIndex(0)
                        }}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-mono transition-colors ${
                          selectedFileIndex === index
                            ? "bg-[#0070f3] text-white"
                            : "bg-[#1a1a1a] text-white/60 hover:bg-[#222] hover:text-white"
                        }`}
                      >
                        {pdfFile.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div className="border-t border-[#333] bg-[#0a0a0a] px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-medium text-white/50">Quick Actions</p>
            <p className="text-[11px] text-white/30">Based on your files</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {suggestedTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group flex items-center gap-3 rounded-lg border border-[#333] bg-[#111] px-4 py-3 transition-all duration-150 hover:border-[#0070f3] hover:shadow-[0_0_10px_rgba(0,112,243,0.15)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0070f3]/10 transition-colors group-hover:bg-[#0070f3]/20">
                  <tool.icon className="h-5 w-5 text-[#0070f3]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white group-hover:text-[#0070f3]">
                    {tool.name}
                  </p>
                  <p className="text-[11px] text-white/40">{tool.reason}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 border-t border-[#222] bg-[#050505] px-6 py-2.5">
          <Shield className="h-3.5 w-3.5 text-emerald-500/70" />
          <p className="text-[11px] font-mono text-white/40">
            Preview generated in-browser. No data sent to server.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

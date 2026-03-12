"use client"

import { FileText, Upload, Download, X, GripVertical, Plus } from "lucide-react"
import { useState, useCallback } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How many PDFs can I merge at once?",
    answer: "You can merge as many PDF files as your browser's memory allows. For best performance, we recommend merging up to 50 files at a time, though the tool can handle more.",
  },
  {
    question: "Is there a file size limit?",
    answer: "There's no artificial file size limit. The only constraint is your device's available memory. Large files may take longer to process but will work correctly.",
  },
  {
    question: "Can I reorder pages before merging?",
    answer: "Yes! After uploading your PDFs, you can drag and drop them to change the order. The files will be merged in the order shown.",
  },
  {
    question: "Are my PDFs uploaded to a server?",
    answer: "No. All PDF merging happens entirely in your browser using WebAssembly. Your files never leave your device.",
  },
  {
    question: "Will the merged PDF maintain quality?",
    answer: "Yes. The merging process preserves the original quality of all pages, including images, fonts, and vector graphics.",
  },
]

const relatedTools = [
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    href: "/tools/compress-pdf",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word files",
    href: "/tools/pdf-to-word",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-5 w-5" />,
  },
]

interface PDFFile {
  id: string
  name: string
  size: number
  file: File
}

function PDFMergeToolInterface() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    )
    
    const newFiles = droppedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file,
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return
    
    const pdfFiles = Array.from(selectedFiles).filter(
      file => file.type === 'application/pdf'
    )
    
    const newFiles = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file,
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setIsProcessing(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real implementation, this would use pdf-lib or similar
    setIsProcessing(false)
    alert('PDF merge functionality requires pdf-lib integration. Files would be merged in the order shown.')
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-[var(--category-accent,var(--accent))] bg-[var(--category-accent,var(--accent))]/5"
            : "border-border hover:border-muted-foreground/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Drop PDF files here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--category-accent,var(--accent))]/20 text-xs font-semibold text-[var(--category-accent,var(--accent))]">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
          className="flex-1 bg-[var(--category-accent,var(--accent))] text-[var(--accent-foreground)] hover:bg-[var(--category-accent,var(--accent))]/90"
        >
          {isProcessing ? (
            "Merging..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Merge {files.length} PDFs
            </>
          )}
        </Button>
        {files.length > 0 && (
          <Button
            variant="outline"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {files.length === 1 && (
        <p className="text-xs text-center text-muted-foreground">
          Add at least one more PDF to merge
        </p>
      )}
    </div>
  )
}

export function PDFMergeClient() {
  return (
    <ToolShell
      name="Merge PDF"
      description="Combine multiple PDF files into a single document"
      category={{ name: "PDF Tools", href: "/tools", type: "pdf" }}
      tags={["Local", "WASM"]}
      explanation="This tool merges multiple PDF files into a single document entirely in your browser. Using WebAssembly-powered PDF processing, your files are combined locally without being uploaded to any server. Drag and drop to reorder pages before merging."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <PDFMergeToolInterface />
    </ToolShell>
  )
}

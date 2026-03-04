"use client"

import { FileText, FileType, Upload, Download } from "lucide-react"
import { useState, useCallback } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const relatedTools = [
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word files",
    href: "/pdf-to-word",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "Split PDF",
    description: "Extract pages from a PDF",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <FileType className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "Is my PDF uploaded anywhere?",
    answer:
      "No. Compression happens entirely in your browser using WebAssembly. Your document never leaves your device.",
  },
  {
    question: "How does compression work?",
    answer:
      "The tool optimizes images, removes unnecessary metadata, and applies lossless compression to reduce file size while maintaining quality.",
  },
  {
    question: "Will I lose quality?",
    answer:
      "The default settings use high-quality compression. For most documents, the difference is imperceptible. Very small files may not compress further.",
  },
]

function CompressPDFToolInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [compressed, setCompressed] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [savings, setSavings] = useState<number | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setCompressed(false)
        setSavings(null)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setCompressed(false)
      setSavings(null)
    }
  }

  const handleCompress = () => {
    if (!file) return
    setCompressing(true)
    // Placeholder - would be replaced with actual compression
    setTimeout(() => {
      setCompressing(false)
      setCompressed(true)
      setSavings(42) // Example: 42% reduction
    }, 1500)
  }

  const handleDownload = () => {
    // Placeholder - would trigger actual download
    alert("Download would start here")
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-6 transition-colors",
          dragActive && "border-accent bg-accent/10",
          file && "border-solid"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="text-center">
            <FileType className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">{file.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-foreground">
              Drop your PDF here or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF files up to 100MB
            </p>
          </div>
        )}
      </div>

      {file && !compressed && (
        <Button
          onClick={handleCompress}
          disabled={compressing}
          className="w-full"
        >
          {compressing ? "Compressing..." : "Compress PDF"}
        </Button>
      )}

      {compressed && savings !== null && (
        <div className="rounded-md border border-border bg-secondary/50 p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">{savings}%</p>
          <p className="text-sm text-muted-foreground">file size reduced</p>
        </div>
      )}

      {compressed && (
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download Compressed PDF
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Your file is processed locally and never uploaded.
      </p>
    </div>
  )
}

export default function CompressPDFPage() {
  return (
    <ToolShell
          name="Compress PDF"
          description="Reduce PDF file size while maintaining quality"
          category={{ name: "PDF Tools", href: "/pdf-tools", type: "pdf" }}
          tags={["Local", "WASM"]}
          explanation="This tool compresses PDF files by optimizing images, removing unused data, and applying efficient compression algorithms. All processing happens in your browser using WebAssembly. Your documents are never uploaded."
          faqs={faqs}
          relatedTools={relatedTools}
    >
      <CompressPDFToolInterface />
    </ToolShell>
  )
}

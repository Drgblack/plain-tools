"use client"

import { FileType, Minimize2, Upload, FileText, Download } from "lucide-react"
import { useState, useCallback } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const relatedTools = [
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress-pdf",
    tags: ["Local", "WASM"],
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Word to PDF",
    description: "Convert Word documents to PDF",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "File Converters",
    description: "Convert between various formats",
    href: "/file-converters",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "Is my PDF uploaded anywhere?",
    answer:
      "No. The PDF is processed entirely in your browser using WebAssembly. Your document never leaves your device.",
  },
  {
    question: "Will the formatting be preserved?",
    answer:
      "We aim to preserve as much formatting as possible, but complex layouts, fonts, and embedded content may not convert perfectly.",
  },
  {
    question: "What about scanned PDFs?",
    answer:
      "This tool works best with text-based PDFs. Scanned documents may not convert well as they contain images rather than selectable text.",
  },
]

function PDFToWordToolInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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
        setConverted(false)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setConverted(false)
    }
  }

  const handleConvert = () => {
    if (!file) return
    setConverting(true)
    // Placeholder - would be replaced with actual conversion
    setTimeout(() => {
      setConverting(false)
      setConverted(true)
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
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
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

      {file && !converted && (
        <Button
          onClick={handleConvert}
          disabled={converting}
          className="w-full"
        >
          {converting ? "Converting..." : "Convert to Word"}
        </Button>
      )}

      {converted && (
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download .docx
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Your file is processed locally and never uploaded.
      </p>
    </div>
  )
}

export default function PDFToWordPage() {
  return (
    <ToolShell
      name="PDF to Word"
      description="Convert PDF documents to editable Word (.docx) files"
      category={{ name: "PDF Tools", href: "/pdf-tools", type: "pdf" }}
      tags={["Local", "WASM"]}
      explanation="This tool converts PDF documents to Microsoft Word format (.docx) entirely in your browser. Using WebAssembly, the conversion happens locally on your device. Your documents are never uploaded to any server."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <PDFToWordToolInterface />
    </ToolShell>
  )
}

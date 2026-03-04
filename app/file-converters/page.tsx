"use client"

import { FileType, Image, FileText, Upload, Download, ArrowRight } from "lucide-react"
import { useState, useCallback } from "react"
import { ToolShell } from "@/components/tool-shell"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress-pdf",
    tags: ["Local", "WASM"],
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "Image Compressor",
    description: "Reduce image file size",
    href: "/file-tools",
    tags: ["Local", "Worker"],
    icon: <Image className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "Are my files uploaded anywhere?",
    answer:
      "No. All conversions happen entirely in your browser using WebAssembly and Web Workers. Your files never leave your device.",
  },
  {
    question: "What formats are supported?",
    answer:
      "We support common image formats (PNG, JPG, WebP, GIF, BMP), document formats, and archive formats. Each conversion type shows available options.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "File size is limited by your browser's available memory. Most browsers can handle files up to several hundred megabytes.",
  },
]

const formatOptions = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "webp", label: "WebP" },
  { value: "gif", label: "GIF" },
  { value: "bmp", label: "BMP" },
]

function FileConverterToolInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
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
      setFile(e.dataTransfer.files[0])
      setConverted(false)
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
    }, 1000)
  }

  const handleDownload = () => {
    // Placeholder - would trigger actual download
    alert("Download would start here")
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE"
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-6 transition-colors",
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
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="text-center">
            <Image className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 font-medium text-foreground">{file.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-foreground">
              Drop your file here or click to browse
            </p>
          </div>
        )}
      </div>

      {file && (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md bg-secondary px-3 py-2 text-center text-sm text-foreground">
            {getFileExtension(file.name)}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger className="flex-1 bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {file && !converted && (
        <Button
          onClick={handleConvert}
          disabled={converting}
          className="w-full"
        >
          {converting ? "Converting..." : "Convert File"}
        </Button>
      )}

      {converted && (
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download .{outputFormat}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Your file is processed locally and never uploaded.
      </p>
    </div>
  )
}

export default function FileConvertersPage() {
  return (
    <ToolShell
          name="File Converters"
          description="Convert between various file formats including images and documents"
          category={{ name: "File Tools", href: "/file-tools", type: "file" }}
          tags={["Local", "WASM", "Worker"]}
          explanation="This tool converts files between different formats entirely in your browser. Using WebAssembly and Web Workers, all processing happens on your device. Your files are never uploaded to any server."
          faqs={faqs}
          relatedTools={relatedTools}
    >
      <FileConverterToolInterface />
    </ToolShell>
  )
}

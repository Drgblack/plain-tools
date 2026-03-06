import type { ComponentType } from "react"
import type {
  PdfConversionFormat,
  PdfPageRange,
  PlainHardwareAcceleratedBatchOptions,
} from "./pdf-batch-engine"
import type { LocalSigningKeyInput, ProcessingStage } from "./pdf-security-engines"

export type ToolCategory =
  | "Core"
  | "Security & Privacy"
  | "Performance & Edit"
  | "AI Assistant"

export type ToolHandlerResult =
  | Uint8Array
  | Uint8Array[]
  | Blob[]
  | { report: unknown; annotatedBytes: Uint8Array }

type ToolOptions = Record<string, unknown>
type StageReporter = (stage: ProcessingStage, message: string) => void
type BatchProgress = (progress: number, status: string) => void

export interface ToolDefinition {
  id: string
  name: string
  slug: string
  category: ToolCategory
  description: string
  badge?: string
  pro?: boolean
  icon?: string
  available: boolean
  component?: ComponentType
  handler?: (
    files: File[],
    options?: ToolOptions
  ) => Promise<ToolHandlerResult>
}

const requireSingleFile = (files: File[], toolName: string) => {
  const file = files[0]
  if (!file) {
    throw new Error(`${toolName} requires at least one file.`)
  }
  return file
}

export const TOOL_CATALOGUE: ToolDefinition[] = [
  {
    id: "merge-pdf",
    name: "Merge PDFs",
    slug: "merge-pdf",
    category: "Core",
    description: "Combine multiple PDF files into a single document locally.",
    icon: "Merge",
    available: true,
    handler: async (files) => {
      const { mergePdfs } = await import("./pdf-batch-engine")
      return await mergePdfs(files)
    },
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    slug: "split-pdf",
    category: "Core",
    description: "Split one PDF into selected page ranges without uploads.",
    icon: "Split",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Split PDF")
      const pageRanges = options?.pageRanges
      if (!Array.isArray(pageRanges) || pageRanges.length === 0) {
        throw new Error("Split PDF requires pageRanges in options.")
      }
      const { splitPdf } = await import("./pdf-batch-engine")
      return await splitPdf(file, pageRanges as PdfPageRange[])
    },
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    slug: "compress-pdf",
    category: "Core",
    description: "Reduce PDF size with local, adjustable compression.",
    icon: "Minimize2",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Compress PDF")
      const level = typeof options?.level === "number" ? options.level : 60
      const { plainRealTimeCompressionPreviewer } = await import("./pdf-batch-engine")
      const result = await plainRealTimeCompressionPreviewer(file, level, options)
      return result.compressedBytes
    },
  },
  {
    id: "reorder-pages",
    name: "Reorder Pages",
    slug: "reorder-pdf",
    category: "Core",
    description: "Drag, reorder, extract, delete, and rotate pages locally.",
    icon: "ArrowUpDown",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Reorder Pages")
      const operations = options?.operations
      if (!operations) {
        throw new Error("Reorder Pages requires operations in options.")
      }
      const { plainWebGPUPageOrganiser } = await import("./page-organiser-engine")
      return await plainWebGPUPageOrganiser(file, operations, options)
    },
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    slug: "extract-pdf",
    category: "Core",
    description: "Extract selected pages into a new local PDF file.",
    icon: "FileOutput",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Extract Pages")
      const pageRanges = options?.pageRanges
      if (!Array.isArray(pageRanges) || pageRanges.length === 0) {
        throw new Error("Extract Pages requires pageRanges in options.")
      }
      const { splitPdf } = await import("./pdf-batch-engine")
      const outputs = await splitPdf(file, pageRanges)
      return outputs.map((bytes) => new Blob([bytes], { type: "application/pdf" }))
    },
  },
  {
    id: "convert-pdf",
    name: "Convert PDF",
    slug: "convert-pdf",
    category: "Core",
    description: "Convert PDF pages to images or extract text locally.",
    badge: "100% Local",
    icon: "RefreshCw",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Convert PDF")
      const targetFormat = (options?.targetFormat ?? "png") as PdfConversionFormat
      const { convertPdf } = await import("./pdf-batch-engine")
      return await convertPdf(file, targetFormat)
    },
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    slug: "sign-pdf",
    category: "Security & Privacy",
    description:
      "Place a visual signature on a PDF locally using draw or typed input.",
    badge: "100% Local",
    icon: "PenTool",
    available: true,
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    slug: "protect-pdf",
    category: "Security & Privacy",
    description: "Encrypt PDFs with a password locally so access requires your key.",
    badge: "100% Local",
    icon: "Lock",
    available: true,
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    slug: "unlock-pdf",
    category: "Security & Privacy",
    description: "Unlock password-protected PDFs locally when you know the password.",
    badge: "100% Local",
    icon: "Unlock",
    available: true,
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    slug: "ocr-pdf",
    category: "Performance & Edit",
    description: "Run best-effort OCR locally and export searchable PDF or extracted text.",
    badge: "100% Local",
    icon: "ScanText",
    available: true,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    slug: "pdf-to-word",
    category: "Core",
    description: "Extract PDF text locally and export a best-effort editable .docx file.",
    badge: "100% Local",
    icon: "FileText",
    available: true,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    category: "Core",
    description: "Convert PDF pages to JPG images locally with adjustable quality and scale.",
    badge: "100% Local",
    icon: "FileImage",
    available: true,
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    slug: "pdf-to-excel",
    category: "Core",
    description:
      "Extract table-like data from PDFs locally and export spreadsheet-ready CSV output.",
    badge: "100% Local",
    icon: "FileSpreadsheet",
    available: true,
  },
  {
    id: "pdf-to-ppt",
    name: "PDF to PowerPoint",
    slug: "pdf-to-ppt",
    category: "Core",
    description:
      "Convert each PDF page to an image-based PowerPoint slide locally in your browser.",
    badge: "100% Local",
    icon: "Presentation",
    available: true,
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    category: "Core",
    description: "Combine JPG, JPEG, or PNG images into one PDF locally with layout controls.",
    badge: "100% Local",
    icon: "FileImage",
    available: true,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    slug: "word-to-pdf",
    category: "Core",
    description: "Convert .docx files to PDF in your browser with best-effort layout preservation.",
    badge: "100% Local",
    icon: "FileType",
    available: true,
  },
  {
    id: "fill-pdf",
    name: "Fill PDF Forms",
    slug: "fill-pdf",
    category: "Core",
    description: "Fill AcroForm fields locally, then export flattened or editable output.",
    badge: "PRO",
    pro: true,
    icon: "FileText",
    available: true,
  },
  {
    id: "plain-metadata-purge",
    name: "Plain Metadata Purge",
    slug: "metadata-purge",
    category: "Security & Privacy",
    description: "Remove XMP, info dictionary, and custom metadata fields locally.",
    badge: "100% Local",
    icon: "FileSearch",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Metadata Purge")
      const { plainMetadataPurge } = await import("./pdf-security-engines")
      return await plainMetadataPurge(file, options)
    },
  },
  {
    id: "plain-irreversible-redactor",
    name: "Plain Irreversible Redactor",
    slug: "redact-pdf",
    category: "Security & Privacy",
    description: "Burn in redaction regions and rebuild pages for irreversible removal.",
    icon: "ShieldAlert",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Irreversible Redactor")
      const regions = options?.redactionRegions
      if (!Array.isArray(regions) || regions.length === 0) {
        throw new Error("Plain Irreversible Redactor requires redactionRegions in options.")
      }
      const { plainIrreversibleRedactor } = await import("./pdf-security-engines")
      return await plainIrreversibleRedactor(
        file,
        regions,
        options?.onStageChange as StageReporter | undefined
      )
    },
  },
  {
    id: "plain-local-cryptographic-signer",
    name: "Plain Local Cryptographic Signer",
    slug: "local-signer",
    category: "Security & Privacy",
    description: "Apply visual and cryptographic PDF signatures locally with built-in verification workflow.",
    badge: "Local Crypto",
    icon: "PenTool",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Local Cryptographic Signer")
      const keyMaterial = options?.keyMaterial
      if (!keyMaterial) {
        throw new Error("Plain Local Cryptographic Signer requires keyMaterial in options.")
      }
      const { plainLocalCryptographicSigner } = await import("./pdf-security-engines")
      return await plainLocalCryptographicSigner(
        file,
        keyMaterial as LocalSigningKeyInput,
        options
      )
    },
  },
  {
    id: "plain-password-breaker",
    name: "Plain Password Breaker",
    slug: "password-breaker",
    category: "Security & Privacy",
    description: "Attempt local password unlock with known key and bounded brute-force.",
    badge: "Local Recovery",
    icon: "Unlock",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Password Breaker")
      const { plainPasswordBreaker } = await import("./pdf-security-engines")
      return await plainPasswordBreaker(file, options)
    },
  },
  {
    id: "plain-privacy-risk-scanner",
    name: "Plain Privacy Risk Scanner",
    slug: "privacy-scan",
    category: "Security & Privacy",
    description: "Scan for PII risk patterns and generate redaction-ready annotations.",
    icon: "SearchCheck",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Privacy Risk Scanner")
      const { plainPrivacyRiskScanner } = await import("./pdf-privacy-scanner")
      return await plainPrivacyRiskScanner(file, options)
    },
  },
  {
    id: "plain-webgpu-page-organiser",
    name: "Plain WebGPU Page Organiser",
    slug: "webgpu-organiser",
    category: "Performance & Edit",
    description: "Organise pages with local thumbnail previews, drag reorder, and bulk edit controls.",
    badge: "WebGPU",
    icon: "LayoutGrid",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain WebGPU Page Organiser")
      const operations = options?.operations
      if (!operations) {
        throw new Error("Plain WebGPU Page Organiser requires operations in options.")
      }
      const { plainWebGPUPageOrganiser } = await import("./page-organiser-engine")
      return await plainWebGPUPageOrganiser(file, operations, options)
    },
  },
  {
    id: "plain-hardware-accelerated-batch-engine",
    name: "Plain Hardware-Accelerated Batch Engine",
    slug: "batch-engine",
    category: "Performance & Edit",
    description: "Run merge, compress, split, and convert workflows in a parallel local worker pool.",
    badge: "Worker Pool",
    icon: "Zap",
    available: true,
    handler: async (files, options) => {
      const { plainHardwareAcceleratedBatch } = await import("./pdf-batch-engine")
      const batchOptions: PlainHardwareAcceleratedBatchOptions =
        (options as PlainHardwareAcceleratedBatchOptions | undefined) ?? { mode: "merge" }
      const results = await plainHardwareAcceleratedBatch(files, batchOptions)
      const first = results[0]
      if (!first) {
        throw new Error("Batch engine returned no results.")
      }

      if (first.bytes) return first.bytes
      if (first.blobs) return first.blobs
      if (first.splitOutputs) {
        return first.splitOutputs.map(
          (bytes) => new Blob([bytes], { type: "application/pdf" })
        )
      }
      return new Uint8Array()
    },
  },
  {
    id: "plain-offline-ocr-pipeline",
    name: "Plain Offline OCR Pipeline",
    slug: "offline-ocr",
    category: "Performance & Edit",
    description: "Generate searchable PDFs from image-based pages fully locally.",
    icon: "ScanText",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Offline OCR Pipeline")
      const { plainOfflineOCR } = await import("./pdf-batch-engine")
      return await plainOfflineOCR(file, options?.onProgress as BatchProgress | undefined)
    },
  },
  {
    id: "plain-real-time-compression-previewer",
    name: "Plain Real-Time Compression Previewer",
    slug: "compression-preview",
    category: "Performance & Edit",
    description: "Render side-by-side previews and produce final compressed output.",
    icon: "Minimize2",
    available: true,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Real-Time Compression Previewer")
      const level = typeof options?.level === "number" ? options.level : 60
      const { plainRealTimeCompressionPreviewer } = await import("./pdf-batch-engine")
      const result = await plainRealTimeCompressionPreviewer(file, level, options)
      return result.compressedBytes
    },
  },
  {
    id: "summarize-pdf",
    name: "Summarize PDF",
    slug: "summarize-pdf",
    category: "AI Assistant",
    description: "Extract text locally and request a Claude summary with opt-in.",
    icon: "Sparkles",
    available: true,
  },
  {
    id: "pdf-qa",
    name: "Q&A on PDF",
    slug: "pdf-qa",
    category: "AI Assistant",
    description: "Ask focused questions about extracted PDF text using Claude.",
    icon: "MessageSquare",
    available: true,
  },
  {
    id: "suggest-edits",
    name: "Suggest Edits",
    slug: "suggest-edits",
    category: "AI Assistant",
    description: "Get rewrite suggestions for selected PDF text sections via Claude.",
    icon: "PencilLine",
    available: true,
  },
]

export const getToolBySlug = (slug: string): ToolDefinition | undefined =>
  TOOL_CATALOGUE.find((tool) => tool.slug === slug)

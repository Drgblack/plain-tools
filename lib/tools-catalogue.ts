import type { ComponentType } from "react"

export type ToolCategory =
  | "Core"
  | "Security & Privacy"
  | "Performance & Edit"
  | "AI Assistant"

export type ToolHandlerResult =
  | Uint8Array
  | Blob[]
  | { report: unknown; annotatedBytes: Uint8Array }

type ToolOptions = Record<string, unknown>

export interface ToolDefinition {
  id: string
  name: string
  slug: string
  category: ToolCategory
  description: string
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
      return await splitPdf(file, pageRanges)
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
    icon: "RefreshCw",
    available: false,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Convert PDF")
      const targetFormat = options?.targetFormat ?? "png"
      const { convertPdf } = await import("./pdf-batch-engine")
      return await convertPdf(file, targetFormat)
    },
  },
  {
    id: "plain-metadata-purge",
    name: "Plain Metadata Purge",
    slug: "plain-metadata-purge",
    category: "Security & Privacy",
    description: "Remove XMP, info dictionary, and custom metadata fields locally.",
    icon: "FileSearch",
    available: false,
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
      return await plainIrreversibleRedactor(file, regions, options?.onStageChange)
    },
  },
  {
    id: "plain-local-cryptographic-signer",
    name: "Plain Local Cryptographic Signer",
    slug: "plain-local-cryptographic-signer",
    category: "Security & Privacy",
    description: "Apply local visual plus cryptographic signature data to PDF files.",
    icon: "PenTool",
    available: false,
    handler: async (files, options) => {
      const file = requireSingleFile(files, "Plain Local Cryptographic Signer")
      const keyMaterial = options?.keyMaterial
      if (!keyMaterial) {
        throw new Error("Plain Local Cryptographic Signer requires keyMaterial in options.")
      }
      const { plainLocalCryptographicSigner } = await import("./pdf-security-engines")
      return await plainLocalCryptographicSigner(file, keyMaterial, options)
    },
  },
  {
    id: "plain-password-breaker",
    name: "Plain Password Breaker",
    slug: "plain-password-breaker",
    category: "Security & Privacy",
    description: "Attempt local password unlock with known key and bounded brute-force.",
    icon: "Unlock",
    available: false,
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
    slug: "plain-webgpu-page-organiser",
    category: "Performance & Edit",
    description: "Organise pages with local WebGPU previews and pdf-lib restructuring.",
    icon: "LayoutGrid",
    available: false,
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
    slug: "plain-hardware-accelerated-batch-engine",
    category: "Performance & Edit",
    description: "Run merge/split/compress/convert in local worker-driven batch mode.",
    icon: "Zap",
    available: false,
    handler: async (files, options) => {
      const { plainHardwareAcceleratedBatch } = await import("./pdf-batch-engine")
      const results = await plainHardwareAcceleratedBatch(files, options)
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
      return await plainOfflineOCR(file, options?.onProgress)
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

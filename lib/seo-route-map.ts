export type ToolSeoEntry = {
  slug: string
  name: string
  description: string
  learnHref: string
  learnLabel: string
}

export const TOOL_SEO_ENTRIES: ToolSeoEntry[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDFs",
    description: "Merge PDF files locally in your browser with zero uploads, fast processing, and privacy-safe output downloads for confidential document workflows with private.",
    learnHref: "/learn/how-pdfs-work",
    learnLabel: "How PDFs Work Internally",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Split PDF pages by custom ranges, extraction rules, or single-page output entirely in-browser with local processing and no remote file transfer with private.",
    learnHref: "/learn/how-pdfs-work",
    learnLabel: "How PDFs Work Internally",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Compress PDF files offline with adjustable quality controls and local processing to reduce file size while keeping document text and visuals usable with.",
    learnHref: "/learn/compress-pdf-without-losing-quality",
    learnLabel: "Compress PDF Without Losing Quality",
  },
  {
    slug: "reorder-pdf",
    name: "Reorder PDF",
    description: "Reorder PDF pages locally with drag-and-drop controls, page rotation, and instant export, all processed on-device with no upload requirements with private.",
    learnHref: "/learn/how-pdfs-work",
    learnLabel: "How PDFs Work Internally",
  },
  {
    slug: "extract-pdf",
    name: "Extract Pages",
    description: "Extract selected PDF pages into new files using local browser processing, with no server upload risk and clean output for secure document sharing with private.",
    learnHref: "/learn/how-pdfs-work",
    learnLabel: "How PDFs Work Internally",
  },
  {
    slug: "convert-pdf",
    name: "Convert PDF",
    description: "Convert PDF files to page images or text output in-browser with page-by-page progress and private local processing that never uploads your files with private.",
    learnHref: "/learn/webassembly-pdf-processing-explained",
    learnLabel: "WebAssembly PDF Processing Explained",
  },
  {
    slug: "redact-pdf",
    name: "Plain Irreversible Redactor",
    description: "Apply irreversible PDF redaction locally by defining secure removal regions and exporting sanitized files without exposing sensitive content online with.",
    learnHref: "/learn/how-pdf-redaction-really-works",
    learnLabel: "How PDF Redaction Really Works",
  },
  {
    slug: "privacy-scan",
    name: "Plain Privacy Risk Scanner",
    description: "Scan PDFs for privacy risks and PII indicators locally, review confidence and severity signals, and export redaction-ready results on-device with private.",
    learnHref: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    learnLabel: "How to Verify a PDF Tool Does not Upload Your Files",
  },
  {
    slug: "offline-ocr",
    name: "Plain Offline OCR Pipeline",
    description: "Run offline OCR on scanned PDFs in your browser to generate searchable text layers without sending sensitive files to cloud OCR endpoints with private.",
    learnHref: "/learn/ocr-pdf-without-cloud",
    learnLabel: "OCR PDF Without Cloud Processing",
  },
  {
    slug: "compression-preview",
    name: "Plain Real-Time Compression Previewer",
    description: "Preview PDF compression changes side-by-side before export, compare file-size differences, and process everything locally with no upload latency with private.",
    learnHref: "/learn/compress-pdf-without-losing-quality",
    learnLabel: "Compress PDF Without Losing Quality",
  },
  {
    slug: "summarize-pdf",
    name: "Summarize PDF",
    description: "Extract PDF text locally and generate concise summaries with explicit consent controls for optional server-side language model processing with private.",
    learnHref: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    learnLabel: "How to Verify a PDF Tool Does not Upload Your Files",
  },
  {
    slug: "pdf-qa",
    name: "Q&A on PDF",
    description: "Ask focused questions about PDF content after local extraction with clear consent boundaries for optional remote model response generation with private.",
    learnHref: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    learnLabel: "How to Verify a PDF Tool Does not Upload Your Files",
  },
  {
    slug: "suggest-edits",
    name: "Suggest Edits",
    description: "Generate revision suggestions from PDF text with local extraction and explicit opt-in processing for AI-assisted rewrite recommendations with private no-upload.",
    learnHref: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    learnLabel: "How to Verify a PDF Tool Does not Upload Your Files",
  },
  {
    slug: "metadata-purge",
    name: "Plain Metadata Purge",
    description: "Inspect and remove PDF metadata fields including XMP and Info Dictionary properties locally to reduce hidden-data exposure before sharing with private.",
    learnHref: "/learn/what-is-pdf-metadata-and-why-it-matters",
    learnLabel: "What Is PDF Metadata and Why It Matters",
  },
  {
    slug: "local-signer",
    name: "Plain Local Cryptographic Signer",
    description: "Sign PDFs locally with cryptographic integrity proof, visual placement controls, and downloadable verification material without cloud upload with private.",
    learnHref: "/learn/how-to-sign-a-pdf-without-uploading-it",
    learnLabel: "How to Sign a PDF Without Uploading It",
  },
  {
    slug: "password-breaker",
    name: "Plain Password Breaker",
    description: "Recover access to your own protected PDFs using known-password or bounded brute-force modes in a private local browser workflow with private no-upload.",
    learnHref: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    learnLabel: "How to Verify a PDF Tool Does not Upload Your Files",
  },
  {
    slug: "webgpu-organiser",
    name: "Plain WebGPU Page Organiser",
    description: "Organise PDF pages with visual thumbnail grids, touch-friendly reordering, and local reconstruction workflows that keep data on-device with private no-upload.",
    learnHref: "/learn/webassembly-pdf-processing-explained",
    learnLabel: "WebAssembly PDF Processing Explained",
  },
  {
    slug: "batch-engine",
    name: "Plain Hardware-Accelerated Batch Engine",
    description: "Run batch merge, split, compress, and convert jobs in parallel browser workers with per-file progress and private local execution with private no-upload.",
    learnHref: "/learn/webassembly-pdf-processing-explained",
    learnLabel: "WebAssembly PDF Processing Explained",
  },
]

const TOOL_ALIASES: Record<string, string> = {
  "plain-hardware-accelerated-batch-engine": "batch-engine",
  "plain-local-cryptographic-signer": "local-signer",
  "plain-metadata-purge": "metadata-purge",
  "plain-password-breaker": "password-breaker",
  "plain-webgpu-page-organiser": "webgpu-organiser",
  "ai-pdf-assistant": "summarize-pdf",
  "irreversible-redactor": "redact-pdf",
  "privacy-risk-scanner": "privacy-scan",
}

const TOOL_SEO_MAP = new Map(TOOL_SEO_ENTRIES.map((entry) => [entry.slug, entry]))

export function getToolSeoEntry(slug: string) {
  const canonicalSlug = TOOL_ALIASES[slug] ?? slug
  return TOOL_SEO_MAP.get(canonicalSlug)
}

export type LearnToolLink = {
  href: string
  label: string
}

export const LEARN_TO_TOOL_MAP: Record<string, LearnToolLink> = {
  glossary: {
    href: "/tools",
    label: "Browse All Tools",
  },
  "adobe-acrobat-ai-privacy-concerns-explained": {
    href: "/compare/plain-vs-adobe-acrobat",
    label: "Compare Plain vs Adobe Acrobat",
  },
  "client-side-processing": {
    href: "/tools/merge-pdf",
    label: "Try Merge PDF Locally",
  },
  "compress-pdf-without-losing-quality": {
    href: "/tools/compression-preview",
    label: "Try Compression Preview",
  },
  "gdpr-and-pdf-tools-what-businesses-need-to-know": {
    href: "/tools/metadata-purge",
    label: "Try Metadata Purge",
  },
  "how-pdf-redaction-really-works": {
    href: "/tools/redact-pdf",
    label: "Try Irreversible Redactor",
  },
  "how-pdfs-work": {
    href: "/tools/merge-pdf",
    label: "Try Merge PDF",
  },
  "how-plain-works": {
    href: "/tools/merge-pdf",
    label: "Try Plain Tools",
  },
  "how-to-sign-a-pdf-without-uploading-it": {
    href: "/tools/local-signer",
    label: "Try Local Cryptographic Signer",
  },
  "how-to-verify-a-pdf-tool-doesnt-upload-your-files": {
    href: "/verify-claims",
    label: "Open Verify Claims",
  },
  "is-offline-pdf-processing-secure": {
    href: "/tools/merge-pdf",
    label: "Try Offline Merge PDF",
  },
  "language-support": {
    href: "/tools",
    label: "Browse All Tools",
  },
  "no-uploads-explained": {
    href: "/verify-claims",
    label: "Verify Zero Uploads",
  },
  "ocr-pdf-without-cloud": {
    href: "/tools/offline-ocr",
    label: "Try Offline OCR",
  },
  "online-vs-offline-pdf-tools": {
    href: "/compare/offline-vs-online-pdf-tools",
    label: "Compare Offline vs Online",
  },
  "pdf-consistency": {
    href: "/tools/convert-pdf",
    label: "Try Convert PDF",
  },
  "plain-vs-online-pdf-tools": {
    href: "/compare/offline-vs-online-pdf-tools",
    label: "See Full Comparison",
  },
  "verify-offline-processing": {
    href: "/verify-claims",
    label: "Run Verification Steps",
  },
  "webassembly-pdf-processing-explained": {
    href: "/tools/batch-engine",
    label: "Try Batch Engine",
  },
  "what-is-a-pdf": {
    href: "/tools/merge-pdf",
    label: "Try Merge PDF",
  },
  "what-is-pdf-metadata-and-why-it-matters": {
    href: "/tools/metadata-purge",
    label: "Try Metadata Purge",
  },
  "why-offline-compression-has-limits": {
    href: "/tools/compression-preview",
    label: "Try Compression Preview",
  },
  "why-pdf-uploads-are-risky": {
    href: "/verify-claims",
    label: "Verify Upload Behavior",
  },
  "why-you-should-never-upload-medical-records-to-pdf-tools": {
    href: "/tools/redact-pdf",
    label: "Try Local Redaction",
  },
}



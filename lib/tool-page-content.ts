import type { ToolDefinition } from "@/lib/tools-catalogue"

type ToolPageProfile = {
  title: string
  description: string
  trustPoints: string[]
  limitation: string
  featureList: string[]
  overview?: string
  useCases?: string[]
}

const DEFAULT_TRUST_POINTS = [
  "Processed locally in your browser",
  "Files never leave your device",
  "No account required for local processing",
]

const DEFAULT_LIMITATION =
  "Best-effort output quality depends on file complexity and available device memory."

const TOOL_PAGE_PROFILES: Record<string, ToolPageProfile> = {
  "merge-pdf": {
    title: "Merge PDFs Locally - No Upload | Plain Tools",
    description:
      "Merge PDF files locally in your browser with Plain Tools. No uploads, no file storage, and fast private output.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort merge. Source PDF corruption or encryption can prevent successful output.",
    featureList: [
      "Merge multiple PDFs locally",
      "Reorder files before export",
      "No uploads or server processing",
      "Works on desktop and mobile browsers",
    ],
  },
  "split-pdf": {
    title: "Split PDF Locally - No Upload | Plain Tools",
    description:
      "Split PDF pages by range or extract individual pages locally in your browser. Private, fast, and no upload required.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort split. Invalid page ranges or damaged PDFs may fail.",
    featureList: [
      "Split by custom page ranges",
      "Extract each page as a separate PDF",
      "Local browser-only processing",
      "Download single files or ZIP output",
    ],
  },
  "compare-pdf": {
    title: "Compare PDF Files Locally - No Upload | Plain Tools",
    description:
      "Compare two PDF files locally with page-by-page text diff and highlighted word changes in your browser.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort text diff. Visual layout-only changes and scanned image differences may not appear without extractable text.",
    featureList: [
      "Two-file local PDF comparison",
      "Page-by-page text extraction",
      "Line and word-level change highlights",
      "No-upload local processing",
    ],
  },
  "compress-pdf": {
    title: "Compress PDF Locally - No Upload | Plain Tools",
    description:
      "Compress PDF files locally with light, medium, or strong settings. No uploads and no server-side file handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Strong compression may flatten text into images and reduce visual quality.",
    featureList: [
      "Local PDF optimisation levels",
      "Before and after size comparison",
      "No upload compression workflow",
      "Fast browser-side output",
    ],
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Locally - No Upload | Plain Tools",
    description:
      "Rotate PDF pages by 90, 180, or 270 degrees locally with visual thumbnail previews and no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Rotation changes page orientation only and does not crop or reorder existing page content.",
    featureList: [
      "Per-page rotation control",
      "Global rotation shortcuts",
      "Thumbnail previews before export",
      "No-upload local processing",
    ],
  },
  "watermark-pdf": {
    title: "Add Watermark to PDF Locally - No Upload | Plain Tools",
    description:
      "Add text or image watermarks to PDF pages locally with opacity and placement controls and no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Watermarks are visual overlays. They improve document labelling but do not encrypt or lock content.",
    featureList: [
      "Text or image watermark mode",
      "Opacity, size, colour, and position controls",
      "Apply overlays across all pages",
      "No-upload local processing",
    ],
  },
  "annotate-pdf": {
    title: "Annotate PDF Locally - No Upload | Plain Tools",
    description:
      "Annotate PDF pages locally with pen, highlight, and text tools in a browser overlay workspace with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort annotation. This tool embeds visible marks and labels but does not support collaborative comments.",
    featureList: [
      "Pen, highlight, and text annotation tools",
      "Per-page canvas overlay workspace",
      "Thumbnail page navigation",
      "Local browser-only processing",
    ],
  },
  "pdf-to-word": {
    title: "PDF to Word Locally - No Upload | Plain Tools",
    description:
      "Convert PDF to Word (.docx) locally in your browser with Plain Tools. No uploads, no cloud storage, and private text extraction.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Complex layouts and forms may not stay perfectly formatted.",
    featureList: [
      "PDF text extraction to .docx",
      "Local conversion workflow",
      "No upload requirement",
      "Progress and download states",
    ],
  },
  "word-to-pdf": {
    title: "Word to PDF Locally - No Upload | Plain Tools",
    description:
      "Convert Word (.docx) files to PDF locally in your browser. Fast private processing with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Complex formatting can shift in output PDF.",
    featureList: [
      "DOCX to PDF conversion",
      "Offline-first browser processing",
      "No server upload",
      "Direct PDF download",
    ],
  },
  "text-to-pdf": {
    title: "Text to PDF Locally - No Upload | Plain Tools",
    description:
      "Convert plain text or Markdown to PDF locally in your browser without uploading files.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Markdown rendering is best-effort and supports core formatting only (headings, bold, italic).",
    featureList: [
      "Paste text or Markdown",
      "Load .txt and .md files locally",
      "Generate wrapped multi-page PDFs",
      "No-upload browser processing",
    ],
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Locally - No Upload | Plain Tools",
    description:
      "Convert PDF pages to JPG images locally with quality and scale options. No uploads and private output handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Very large PDFs can take longer on mobile devices.",
    featureList: [
      "PDF pages to JPG images",
      "Per-page quality and scale settings",
      "ZIP output for multi-page files",
      "Local browser rendering",
    ],
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Locally - No Upload | Plain Tools",
    description:
      "Combine JPG, JPEG, or PNG images into one PDF locally. No uploads, no cloud storage, and simple layout controls.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort layout fitting. Image dimensions and orientation affect final spacing.",
    featureList: [
      "Multiple image to PDF",
      "Reorder image pages",
      "Page size, orientation, and margin controls",
      "No-upload local export",
    ],
  },
  "pdf-to-excel": {
    title: "PDF to Excel Locally - No Upload | Plain Tools",
    description:
      "Extract table-like data from PDF to spreadsheet output locally in your browser with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort extraction. Complex tables may require manual cleanup after export.",
    featureList: [
      "Table-like text extraction",
      "CSV spreadsheet output",
      "Fallback full text extraction",
      "Local processing without uploads",
    ],
  },
  "pdf-to-ppt": {
    title: "PDF to PowerPoint Locally - No Upload | Plain Tools",
    description:
      "Convert PDF pages to PowerPoint slides locally in your browser. No upload required and private processing.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Slides are image-based and text is not editable in output.",
    featureList: [
      "One slide per PDF page",
      "Local page rendering and export",
      "No server upload",
      "Download .pptx directly",
    ],
  },
  "pdf-to-html": {
    title: "PDF to HTML Locally - No Upload | Plain Tools",
    description:
      "Convert PDF files to HTML locally in your browser with extracted text and optional embedded page previews.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort conversion. Complex layouts, fonts, and positioning may differ from the source PDF.",
    featureList: [
      "Extract PDF page text to HTML",
      "Optional embedded page preview images",
      "Single downloadable .html output",
      "No-upload local browser processing",
    ],
  },
  "file-hash": {
    title: "File Hash / Checksum Locally - No Upload | Plain Tools",
    description:
      "Compute SHA-256, MD5, SHA-1, and SHA-512 checksums for local files directly in your browser.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Checksums verify integrity but do not encrypt file content. Use SHA-256 for modern integrity workflows.",
    featureList: [
      "SHA-256, MD5, SHA-1, and SHA-512 support",
      "Hex digest output with copy action",
      "No-upload local browser hashing",
      "Works with any file type",
    ],
  },
  "qr-code": {
    title: "QR Code Generator Locally - No Upload | Plain Tools",
    description:
      "Generate QR codes for URLs or text locally in your browser with size, error correction, and colour options.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Very long text payloads can reduce scan reliability on older cameras. Keep payloads concise where possible.",
    featureList: [
      "URL and text QR generation",
      "Configurable size and error correction",
      "Foreground and background colour controls",
      "PNG and SVG downloads",
    ],
  },
  "sign-pdf": {
    title: "Sign PDF Locally - No Upload | Plain Tools",
    description:
      "Add a visual signature to PDF pages locally using draw or typed input. Private browser processing with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Visual signature placement only. This is not a cryptographic certificate workflow.",
    featureList: [
      "Draw or type a signature",
      "Page and position controls",
      "Local PDF stamping",
      "No-upload signing workflow",
    ],
  },
  "protect-pdf": {
    title: "Protect PDF Locally - No Upload | Plain Tools",
    description:
      "Encrypt PDF files with a password locally in your browser. No uploads and no server-side file handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Viewer compatibility can vary across older PDF readers and mobile apps.",
    featureList: [
      "Password-protect PDF files",
      "Local browser encryption",
      "No upload workflow",
      "Private output download",
    ],
  },
  "unlock-pdf": {
    title: "Unlock PDF Locally - No Upload | Plain Tools",
    description:
      "Unlock password-protected PDFs locally in your browser when you have the password. No uploads or server processing.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Only works if the correct password is provided.",
    featureList: [
      "Remove known PDF password locally",
      "User-friendly incorrect-password handling",
      "No-upload processing",
      "Download unlocked PDF",
    ],
  },
  "ocr-pdf": {
    title: "OCR PDF Locally - No Upload | Plain Tools",
    description:
      "Run OCR on scanned PDFs locally in your browser and export searchable PDF or text output. No uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "OCR is best-effort and can be slower on large files or mobile devices.",
    featureList: [
      "Local OCR with WebAssembly",
      "Searchable PDF output",
      "Text-only fallback export",
      "English and German language support",
    ],
  },
  "offline-ocr": {
    title: "Offline OCR PDF Tool - No Upload | Plain Tools",
    description:
      "Generate searchable PDFs locally from scanned documents using offline OCR in your browser with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "OCR speed and accuracy depend on scan quality, language, and device performance.",
    featureList: [
      "Offline OCR pipeline",
      "Searchable PDF generation",
      "Batch-friendly local processing",
      "No server-side file handling",
    ],
  },
}

export type ResolvedToolPageProfile = ToolPageProfile & {
  overview: string
  useCases: string[]
}

export function getToolPageProfile(tool: ToolDefinition): ResolvedToolPageProfile {
  const profile = TOOL_PAGE_PROFILES[tool.slug]
  if (profile) {
    return {
      ...profile,
      overview:
        profile.overview ??
        `${tool.name} runs in your browser for local, private document handling. Process files directly on your device without a server-side upload step for core workflows.`,
      useCases:
        profile.useCases ?? [
          "Prepare documents quickly before sharing or archiving.",
          "Handle privacy-sensitive files without third-party upload workflows.",
          "Run practical browser-first tasks on desktop or mobile.",
        ],
    }
  }

  return {
    title: `${tool.name} Locally - No Upload | Plain Tools`,
    description:
      `${tool.description} Process files locally in your browser with no uploads or server-side handling.`,
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: DEFAULT_LIMITATION,
    featureList: [
      "Local browser processing",
      "No upload workflow",
      "Fast private output",
      "Cross-device compatible",
    ],
    overview: `${tool.name} runs locally in your browser. This keeps file handling on your device for faster, private workflow control.`,
    useCases: [
      "Quick day-to-day document tasks",
      "Private handling for sensitive files",
      "Simple browser-based processing without extra software",
    ],
  }
}

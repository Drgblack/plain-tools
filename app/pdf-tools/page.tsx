import type { Metadata } from "next"
import {
  FileImage,
  FileText,
  FileType,
  ScanSearch,
  Scissors,
  Shield,
} from "lucide-react"

import { ToolCategoryHub } from "@/components/seo/tool-category-hub"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "PDF tools",
  description:
    "Browse Plain Tools PDF workflows for merge, split, compress, rotate, extract, OCR, and conversion. Local browser processing with no upload step.",
  path: "/pdf-tools",
  image: "/og/tools.png",
})

const tools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files in one local browser workflow.",
    href: "/tools/merge-pdf",
    tags: ["Local", "Core"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "Split PDF",
    description: "Split a PDF by selected pages or ranges without uploading it.",
    href: "/tools/split-pdf",
    tags: ["Local", "Core"] as const,
    icon: <Scissors className="h-4 w-4" />,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size locally for email, uploads, or storage.",
    href: "/tools/compress-pdf",
    tags: ["Local", "Optimise"] as const,
    icon: <Shield className="h-4 w-4" />,
  },
  {
    name: "Rotate PDF",
    description: "Fix page orientation with per-page rotation controls.",
    href: "/tools/rotate-pdf",
    tags: ["Local", "Organise"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "Extract PDF Pages",
    description: "Pull selected pages into a new PDF while keeping the source local.",
    href: "/tools/extract-pdf",
    tags: ["Local", "Organise"] as const,
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "PDF to Word",
    description: "Convert text-based PDFs into editable Word documents locally.",
    href: "/tools/pdf-to-word",
    tags: ["Local", "Convert"] as const,
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Word to PDF",
    description: "Turn DOCX files into PDF output directly in your browser.",
    href: "/tools/word-to-pdf",
    tags: ["Local", "Convert"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "PDF to JPG",
    description: "Export PDF pages as images for previews or downstream editing.",
    href: "/tools/pdf-to-jpg",
    tags: ["Local", "Image"] as const,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "JPG to PDF",
    description: "Combine image files into one PDF for sharing or submission.",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Image"] as const,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "OCR PDF",
    description: "Run OCR locally to make scans searchable without cloud upload.",
    href: "/tools/ocr-pdf",
    tags: ["Local", "OCR"] as const,
    icon: <ScanSearch className="h-4 w-4" />,
  },
]

const guides = [
  {
    label: "How to merge PDFs offline",
    href: "/learn/how-to-merge-pdfs-offline",
    description: "Combine documents locally and check ordering before you download the final file.",
  },
  {
    label: "How to split a PDF by pages",
    href: "/learn/how-to-split-a-pdf-by-pages",
    description: "Extract or separate pages without sending the source document to a remote service.",
  },
  {
    label: "How to verify a PDF tool does not upload your files",
    href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    description: "Use DevTools to confirm the local-processing claim yourself.",
  },
  {
    label: "No uploads explained",
    href: "/learn/no-uploads-explained",
    description: "Understand what local browser processing means in practice for sensitive documents.",
  },
]

const intro =
  "Plain Tools PDF Tools brings together the highest-usage document workflows on the site: merge, split, compress, rotate, extract, convert, and OCR. This hub is meant for people who arrive with a specific PDF task and want a fast route to the right tool without browsing the full directory first. The linked workflows use the existing Plain Tools components, so the behaviour is the same as on the canonical tool pages. For the core PDF operations, processing happens in your browser rather than through an upload queue to a remote converter. That matters when you are working with contracts, onboarding forms, receipts, statements, scans, or internal documents that still deserve careful handling even when the task is simple. Use this page as the main PDF category entry point, then move into the exact workflow you need and on to related guides if you want privacy checks or step-by-step help."

export default function PdfToolsPage() {
  return <ToolCategoryHub title="PDF Tools" path="/pdf-tools" intro={intro} tools={tools} guides={guides} />
}

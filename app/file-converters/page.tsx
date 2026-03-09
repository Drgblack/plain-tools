import type { Metadata } from "next"
import { FileImage, FileSpreadsheet, FileText, FileType, Presentation } from "lucide-react"

import { ToolCategoryHub } from "@/components/seo/tool-category-hub"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "File converters",
  description:
    "Browse file conversion workflows on Plain Tools for document, spreadsheet, presentation, image, and text-oriented tasks with local processing.",
  path: "/file-converters",
  image: "/og/tools.png",
})

const tools = [
  {
    name: "PDF to Word",
    description: "Convert text-based PDFs into editable Word files locally.",
    href: "/tools/pdf-to-word",
    tags: ["Local", "Best-effort"] as const,
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Word to PDF",
    description: "Convert DOCX files to PDF directly in your browser.",
    href: "/tools/word-to-pdf",
    tags: ["Local", "Best-effort"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "PDF to JPG",
    description: "Export PDF pages as JPG images for sharing or reuse.",
    href: "/tools/pdf-to-jpg",
    tags: ["Local", "Image output"] as const,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "JPG to PDF",
    description: "Combine JPG or PNG images into one PDF document locally.",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Image input"] as const,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "PDF to Excel",
    description: "Extract table-like PDF content into spreadsheet-ready output.",
    href: "/tools/pdf-to-excel",
    tags: ["Local", "Spreadsheet"] as const,
    icon: <FileSpreadsheet className="h-4 w-4" />,
  },
  {
    name: "PDF to PowerPoint",
    description: "Convert PDF pages into slide-based output for presentation reuse.",
    href: "/tools/pdf-to-ppt",
    tags: ["Local", "Presentation"] as const,
    icon: <Presentation className="h-4 w-4" />,
  },
  {
    name: "PDF to HTML",
    description: "Convert PDF content into browser-friendly HTML locally.",
    href: "/tools/pdf-to-html",
    tags: ["Local", "Web"] as const,
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "HTML to PDF",
    description: "Turn simple HTML content into a PDF directly in your browser.",
    href: "/tools/html-to-pdf",
    tags: ["Local", "Web"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "PDF to Markdown",
    description: "Extract structured text from a PDF into Markdown output.",
    href: "/tools/pdf-to-markdown",
    tags: ["Local", "Text"] as const,
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Text to PDF",
    description: "Create a PDF from plain text or Markdown locally.",
    href: "/tools/text-to-pdf",
    tags: ["Local", "Text"] as const,
    icon: <FileType className="h-4 w-4" />,
  },
]

const guides = [
  {
    label: "No uploads explained",
    href: "/learn/no-uploads-explained",
    description: "Understand how local conversion workflows avoid a file upload step.",
  },
  {
    label: "How to verify a PDF tool does not upload your files",
    href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    description: "Use DevTools to check whether a converter is sending file bytes anywhere.",
  },
  {
    label: "Browser memory limits for PDF tools",
    href: "/learn/browser-memory-limits-for-pdf-tools",
    description: "Know when large conversions may need splitting, batching, or a different workflow.",
  },
  {
    label: "How PDFs work",
    href: "/learn/how-pdfs-work",
    description: "Get context on why some conversions are best-effort rather than layout-perfect.",
  },
]

const intro =
  "Plain Tools File Converters is the category hub for browser-based format conversion workflows. It groups the document, image, spreadsheet, presentation, and text routes that users most often need when they are moving content from one format into another. The aim is not to send you through a chain of empty converter shells. Each link here points to a live working tool or a canonical route that loads the existing conversion component immediately. For the supported core workflows, processing happens locally in your browser rather than through a cloud upload queue. That makes this hub useful for resumes, reports, scanned pages, slide decks, data extracts, and internal working files where privacy still matters even if the conversion job is routine. Use it as the main entry point when you know the source and target format you need, then follow the guide links below if you want to verify local processing or understand conversion limits before you start."

export default function FileConvertersPage() {
  return <ToolCategoryHub title="File Converters" path="/file-converters" intro={intro} tools={tools} guides={guides} />
}

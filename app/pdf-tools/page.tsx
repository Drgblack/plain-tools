import type { Metadata } from 'next'
import {
  FileType,
  FileText,
  Minimize2,
  Scissors,
  Combine,
  Lock,
} from "lucide-react"
import { CategoryPage } from "@/components/category-page"
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata: Metadata = generateCategoryMetadata({
  name: 'PDF Tools',
  description: 'Free online PDF tools to convert, compress, merge, split, and protect PDF files locally in your browser.',
  slug: 'pdf-tools',
  toolCount: 6,
})

const tools = [
  {
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word (.docx) files",
    href: "/pdf-to-word",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while preserving quality",
    href: "/compress-pdf",
    tags: ["Local", "WASM"],
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple files",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <Scissors className="h-4 w-4" />,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <Combine className="h-4 w-4" />,
  },
  {
    name: "Protect PDF",
    description: "Add password protection to your PDF files",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <Lock className="h-4 w-4" />,
  },
  {
    name: "Word to PDF",
    description: "Convert Word documents to PDF format",
    href: "/pdf-tools",
    tags: ["Local", "WASM"],
    icon: <FileType className="h-4 w-4" />,
  },
]

const howItWorks = [
  {
    title: "Select your PDF",
    description:
      "Drop a PDF file or click to browse. Your file stays on your device.",
  },
  {
    title: "WebAssembly processing",
    description:
      "PDF operations run locally using compiled WebAssembly libraries.",
  },
  {
    title: "Download instantly",
    description:
      "Your processed PDF is ready immediately. No waiting for server uploads.",
  },
]

const faqs = [
  {
    question: "Is my PDF uploaded to any server?",
    answer:
      "No. All PDF processing happens entirely in your browser using WebAssembly. Your documents never leave your device and are not accessible to us or any third party.",
  },
  {
    question: "What is WebAssembly and why do you use it?",
    answer:
      "WebAssembly (WASM) is a binary format that allows us to run compiled code in your browser at near-native speed. This enables complex PDF operations without uploading files to a server.",
  },
  {
    question: "Are there size limits for PDFs?",
    answer:
      "Processing is limited by your browser's memory. Most browsers can handle PDFs up to 100-200MB. Larger files may work but could be slower.",
  },
  {
    question: "Why does processing take time for large files?",
    answer:
      "While WebAssembly is fast, complex PDF operations on large files require computational resources. Processing happens in a Web Worker to keep the page responsive.",
  },
  {
    question: "Can I process password-protected PDFs?",
    answer:
      "Yes, you can enter the password for protected PDFs. The password is only used locally and is never transmitted anywhere.",
  },
]

export default function PDFToolsPage() {
  return (
    <CategoryPage
      name="PDF Tools"
      description="Convert, compress, merge, split, and secure PDF files locally"
      icon={<FileType className="h-6 w-6" />}
      tools={tools}
      howItWorks={howItWorks}
      faqs={faqs}
    />
  )
}

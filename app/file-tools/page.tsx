import type { Metadata } from 'next'
import { FileText, Image, FileArchive, FileCode } from "lucide-react"
import { CategoryPage } from "@/components/category-page"
import { generateCategoryMetadata } from "@/lib/seo"

export const metadata: Metadata = generateCategoryMetadata({
  name: 'File Tools',
  description: 'Free online file conversion, compression, and transformation tools that work locally in your browser.',
  slug: 'file-tools',
  toolCount: 4,
})

const tools = [
  {
    name: "File Converters",
    description: "Convert between various file formats including images and documents",
    href: "/file-converters",
    tags: ["Local", "WASM"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Image Compressor",
    description: "Reduce image file size while maintaining quality",
    href: "/file-converters",
    tags: ["Local", "Worker"],
    icon: <Image className="h-4 w-4" />,
  },
  {
    name: "Archive Extractor",
    description: "Extract files from ZIP, RAR, 7z, and other archive formats",
    href: "/file-converters",
    tags: ["Local", "WASM"],
    icon: <FileArchive className="h-4 w-4" />,
  },
  {
    name: "Code Formatter",
    description: "Format and beautify code in various programming languages",
    href: "/file-converters",
    tags: ["Local"],
    icon: <FileCode className="h-4 w-4" />,
  },
]

const howItWorks = [
  {
    title: "Drop your file",
    description:
      "Drag and drop or select a file from your device. Files never leave your browser.",
  },
  {
    title: "Processing happens locally",
    description:
      "WebAssembly and Web Workers process your file entirely on your device.",
  },
  {
    title: "Download the result",
    description:
      "Your converted or processed file is ready to download. Nothing was uploaded.",
  },
]

const faqs = [
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. All file processing happens entirely in your browser using WebAssembly. Your files never leave your device.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support most common formats including images (PNG, JPG, WebP, GIF), documents, and archives. Each tool lists its supported formats.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "File size is limited by your browser's available memory. Most browsers can handle files up to several hundred megabytes.",
  },
  {
    question: "Do these tools work offline?",
    answer:
      "Yes. Once the page is loaded, file tools work without an internet connection because all processing is local.",
  },
]

export default function FileToolsPage() {
  return (
    <CategoryPage
      name="File Tools"
      description="Convert, compress, and transform files locally in your browser"
      icon={<FileText className="h-6 w-6" />}
      tools={tools}
      howItWorks={howItWorks}
      faqs={faqs}
    />
  )
}

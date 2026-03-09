import type { Metadata } from "next"
import { FileImage, Image, Images, ScanSearch } from "lucide-react"

import { ToolCategoryHub } from "@/components/seo/tool-category-hub"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Image tools",
  description:
    "Browse image-focused tools on Plain Tools for PDF page export, image-to-PDF conversion, compression, and OCR-adjacent workflows.",
  path: "/image-tools",
  image: "/og/tools.png",
})

const tools = [
  {
    name: "PDF to JPG",
    description: "Turn PDF pages into JPG images directly in your browser.",
    href: "/tools/pdf-to-jpg",
    tags: ["Local", "Export"] as const,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "JPG to PDF",
    description: "Combine JPG or PNG images into one PDF without an upload step.",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Convert"] as const,
    icon: <Images className="h-4 w-4" />,
  },
  {
    name: "PDF to PNG",
    description: "Use the local page-export workflow for PNG-oriented image output.",
    href: "/pdf-to-png",
    tags: ["Local", "SEO route"] as const,
    icon: <Image className="h-4 w-4" />,
  },
  {
    name: "PNG to PDF",
    description: "Build a PDF from PNG files with the existing local image-to-PDF workflow.",
    href: "/png-to-pdf",
    tags: ["Local", "SEO route"] as const,
    icon: <Images className="h-4 w-4" />,
  },
  {
    name: "Image Compressor",
    description: "Optimise images locally before sharing, uploading, or bundling into a PDF.",
    href: "/tools/image-compress",
    tags: ["Local", "Optimise"] as const,
    icon: <Image className="h-4 w-4" />,
  },
  {
    name: "OCR PDF",
    description: "Convert scanned image-based PDFs into searchable text locally.",
    href: "/tools/ocr-pdf",
    tags: ["Local", "OCR"] as const,
    icon: <ScanSearch className="h-4 w-4" />,
  },
]

const guides = [
  {
    label: "How OCR works on scanned PDFs",
    href: "/learn/how-ocr-works-on-scanned-pdfs",
    description: "See what affects OCR quality and when a scan needs review after export.",
  },
  {
    label: "OCR PDF without cloud",
    href: "/learn/ocr-pdf-without-cloud",
    description: "Understand why local OCR is a stronger fit for sensitive scanned records.",
  },
  {
    label: "How to verify a PDF tool does not upload your files",
    href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    description: "Inspect network requests while using an image or PDF conversion workflow.",
  },
  {
    label: "No uploads explained",
    href: "/learn/no-uploads-explained",
    description: "Review the privacy model behind local file and image processing on Plain Tools.",
  },
]

const intro =
  "Plain Tools Image Tools is the category hub for workflows that turn PDF pages into images, combine images into PDFs, compress image assets, or handle image-heavy scanned documents. It is designed for users who arrive with a visual file task and want to move directly into a working tool instead of navigating the broader PDF directory first. The linked routes reuse the live Plain Tools components, so there is no thin SEO shell between the category page and the actual workflow. For the core file tasks here, processing happens locally in your browser rather than through a remote upload service. That makes the hub useful for screenshots, scanned paperwork, visual records, preview exports, and image bundles that still contain private or business-sensitive information. Use this category page when the input or output is primarily image-based, then follow the guide links if you need OCR context or want to verify the local-processing behaviour yourself."

export default function ImageToolsPage() {
  return <ToolCategoryHub title="Image Tools" path="/image-tools" intro={intro} tools={tools} guides={guides} />
}

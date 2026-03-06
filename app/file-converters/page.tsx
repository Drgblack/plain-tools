import { FileImage, FileSpreadsheet, FileText, FileType, Presentation } from "lucide-react"
import Link from "next/link"

import { ToolShell } from "@/components/tool-shell"

const relatedTools = [
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word files locally",
    href: "/tools/pdf-to-word",
    tags: ["Local", "Best-effort"],
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "Word to PDF",
    description: "Convert .docx files to PDF in your browser",
    href: "/tools/word-to-pdf",
    tags: ["Local", "Best-effort"],
    icon: <FileType className="h-4 w-4" />,
  },
  {
    name: "PDF to JPG",
    description: "Export PDF pages as JPG images locally",
    href: "/tools/pdf-to-jpg",
    tags: ["Local", "Image output"],
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "JPG to PDF",
    description: "Combine JPG/PNG images into one PDF",
    href: "/tools/jpg-to-pdf",
    tags: ["Local", "Image input"],
    icon: <FileImage className="h-4 w-4" />,
  },
]

const faqs = [
  {
    question: "Are converter files uploaded?",
    answer:
      "Live converters run locally in your browser for supported workflows. Files are not uploaded for those local tools.",
  },
  {
    question: "Why do some converter URLs redirect?",
    answer:
      "Some legacy converter slugs were documentation shells. They now redirect to the nearest live tool or this hub to avoid misleading empty pages.",
  },
  {
    question: "Where should I start?",
    answer:
      "Pick the converter below that matches your source and output format, then process directly on the canonical /tools route.",
  },
]

const liveConverters = [
  {
    label: "PDF to Word",
    detail: "Best-effort text extraction to DOCX.",
    href: "/tools/pdf-to-word",
  },
  {
    label: "Word to PDF",
    detail: "Best-effort DOCX rendering to PDF.",
    href: "/tools/word-to-pdf",
  },
  {
    label: "PDF to JPG",
    detail: "Convert PDF pages to JPG with quality and page controls.",
    href: "/tools/pdf-to-jpg",
  },
  {
    label: "JPG or PNG to PDF",
    detail: "Merge image files into a single PDF output.",
    href: "/tools/jpg-to-pdf",
  },
  {
    label: "PDF to Excel",
    detail: "Extract table-like data to CSV spreadsheet format.",
    href: "/tools/pdf-to-excel",
  },
  {
    label: "PDF to PowerPoint",
    detail: "One PDF page per image-based PPT slide.",
    href: "/tools/pdf-to-ppt",
  },
]

const redirectedAliases = [
  "pdf-to-image",
  "pdf-to-png",
  "image-to-pdf",
  "png-to-pdf",
]

const unsupportedLegacy = [
  "excel-to-pdf",
  "ppt-to-pdf",
  "heic-to-pdf",
  "pdf-to-heic",
  "tiff-to-pdf",
]

export default function FileConvertersPage() {
  return (
    <ToolShell
      name="File Converters"
      description="Canonical converter directory for live local tools."
      category={{ name: "File Tools", href: "/file-tools", type: "file" }}
      tags={["Local", "Canonical routes"]}
      explanation="Use the live converter routes below. Legacy /file-converters/* aliases now redirect so no empty converter shells remain exposed."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-border bg-secondary/30 p-4">
          <h2 className="text-lg font-semibold text-foreground">Live converter tools</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These routes load real working converters under the canonical /tools path.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {liveConverters.map((converter) => (
              <li key={converter.href} className="rounded-md border border-border bg-card/60 p-3">
                <Link href={converter.href} className="text-sm font-semibold text-accent hover:underline">
                  {converter.label}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">{converter.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-secondary/30 p-4">
          <h2 className="text-lg font-semibold text-foreground">Alias handling</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The following legacy aliases redirect to working canonical tools:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {redirectedAliases.map((slug) => (
              <li key={slug}>/file-converters/{slug}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-secondary/30 p-4">
          <h2 className="text-lg font-semibold text-foreground">Unsupported legacy requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These routes redirect back to this hub because no live converter is currently available.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {unsupportedLegacy.map((slug) => (
              <li key={slug}>/file-converters/{slug}</li>
            ))}
          </ul>
        </section>
      </div>
    </ToolShell>
  )
}

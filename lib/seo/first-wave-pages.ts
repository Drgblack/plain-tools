export type PriorityPageLink = {
  label: string
  href: string
  description: string
}

/**
 * First-wave traffic set ("first 100k visitors"):
 * - High-intent utility pages
 * - Curated status routes
 * - Practical guides
 * - Core comparison pages
 *
 * Expand this file when publishing new traffic-priority pages so hubs and sitemap
 * can stay in sync without scattered hard-coded arrays.
 */
export const FIRST_WAVE_TOOL_PAGES: PriorityPageLink[] = [
  {
    label: "Merge PDF locally",
    href: "/tools/merge-pdf",
    description: "Combine multiple PDF files in one local browser workflow.",
  },
  {
    label: "Compress PDF without uploading",
    href: "/tools/compress-pdf",
    description: "Reduce PDF size with practical quality controls and local processing.",
  },
  {
    label: "Convert PDF to Word locally",
    href: "/tools/pdf-to-word",
    description: "Best-effort local conversion from PDF text to editable DOCX.",
  },
  {
    label: "Convert Word to PDF locally",
    href: "/tools/word-to-pdf",
    description: "Create PDF output from DOCX directly in your browser.",
  },
  {
    label: "Sign PDF in your browser",
    href: "/tools/sign-pdf",
    description: "Apply visual signatures without uploading sensitive documents.",
  },
  {
    label: "Run OCR on scanned PDFs locally",
    href: "/tools/ocr-pdf",
    description: "Extract text from scanned pages with best-effort local OCR.",
  },
]

export const FIRST_WAVE_STATUS_SITES = [
  "chatgpt.com",
  "reddit.com",
  "discord.com",
  "gmail.com",
  "github.com",
  "youtube.com",
  "netflix.com",
  "amazon.com",
] as const

export const FIRST_WAVE_STATUS_PAGES: PriorityPageLink[] = FIRST_WAVE_STATUS_SITES.map((site) => ({
  label: `Check whether ${site} is down`,
  href:
    site === "chatgpt.com"
      ? "/status/chatgpt"
      : site === "discord.com"
        ? "/status/discord"
        : site === "youtube.com"
          ? "/status/youtube"
          : site === "reddit.com"
            ? "/status/reddit"
            : `/status/${encodeURIComponent(site)}`,
  description: `Live status route for ${site} with response-time context and troubleshooting guidance.`,
}))

export const FIRST_WAVE_GUIDE_PAGES: PriorityPageLink[] = [
  {
    label: "How to compress a PDF without uploading it",
    href: "/learn/compress-pdf-without-upload",
    description: "Step-by-step private PDF compression workflow with no upload requirement.",
  },
  {
    label: "Why you should not upload sensitive PDFs",
    href: "/learn/why-pdf-uploads-are-risky",
    description: "Privacy and risk context for handling confidential PDF documents.",
  },
  {
    label: "How to compress PDFs locally",
    href: "/learn/compress-pdf-without-losing-quality",
    description: "Practical local compression steps with quality trade-offs explained.",
  },
  {
    label: "How to check if a website is down",
    href: "/learn/is-it-down-for-everyone-or-just-me",
    description: "A simple decision flow for global outages versus local network problems.",
  },
  {
    label: "How DNS lookup works",
    href: "/learn/how-dns-lookup-works",
    description: "Foundational DNS concepts for practical troubleshooting workflows.",
  },
]

export const FIRST_WAVE_COMPARE_PAGES: PriorityPageLink[] = [
  {
    label: "Best Smallpdf alternative",
    href: "/compare/smallpdf-alternative",
    description: "Answer-first comparison page for users searching privacy-first Smallpdf alternatives.",
  },
  {
    label: "Compare Plain Tools with Smallpdf",
    href: "/compare/plain-tools-vs-smallpdf",
    description: "Privacy and workflow comparison for high-intent alternative queries.",
  },
  {
    label: "Compare Plain Tools with iLovePDF",
    href: "/compare/plain-tools-vs-ilovepdf",
    description: "Local-first versus upload-based processing trade-offs.",
  },
  {
    label: "Compare Plain Tools with Adobe Acrobat Online",
    href: "/compare/plain-tools-vs-adobe-acrobat-online",
    description: "Operational fit comparison for sensitive document workflows.",
  },
]

export const FIRST_WAVE_PRIORITY_PATHS = [
  ...FIRST_WAVE_TOOL_PAGES.map((entry) => entry.href),
  ...FIRST_WAVE_STATUS_PAGES.map((entry) => entry.href),
  ...FIRST_WAVE_GUIDE_PAGES.map((entry) => entry.href),
  ...FIRST_WAVE_COMPARE_PAGES.map((entry) => entry.href),
]

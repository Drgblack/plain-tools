import type { TrancheLearnArticle, TrancheTrustBox } from "@/lib/seo/tranche1-content"

const NO_UPLOADS_LINE = "Runs locally in your browser. No uploads."

const trustBox: TrancheTrustBox = {
  localProcessing: "Conversion and export happen in local browser memory.",
  noUploads: NO_UPLOADS_LINE,
  noTracking: "No behavioural tracking is required for local conversions.",
  verifyHref: "/verify-claims",
}

type ConverterConfig = {
  slug: string
  title: string
  primaryQuery: string
  toolHref: string
  toolLabel: string
  relatedConverters: [string, string]
}

const converterConfigs: ConverterConfig[] = [
  {
    slug: "pdf-to-word",
    title: "PDF to Word",
    primaryQuery: "pdf to word",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-excel", "pdf-to-ppt"],
  },
  {
    slug: "word-to-pdf",
    title: "Word to PDF",
    primaryQuery: "word to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["excel-to-pdf", "ppt-to-pdf"],
  },
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF",
    primaryQuery: "jpg to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["png-to-pdf", "image-to-pdf"],
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG",
    primaryQuery: "pdf to jpg",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-png", "pdf-to-image"],
  },
  {
    slug: "png-to-pdf",
    title: "PNG to PDF",
    primaryQuery: "png to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["jpg-to-pdf", "image-to-pdf"],
  },
  {
    slug: "pdf-to-png",
    title: "PDF to PNG",
    primaryQuery: "pdf to png",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-jpg", "pdf-to-image"],
  },
  {
    slug: "pdf-to-excel",
    title: "PDF to Excel",
    primaryQuery: "pdf to excel",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["excel-to-pdf", "pdf-to-word"],
  },
  {
    slug: "excel-to-pdf",
    title: "Excel to PDF",
    primaryQuery: "excel to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["word-to-pdf", "ppt-to-pdf"],
  },
  {
    slug: "ppt-to-pdf",
    title: "PPT to PDF",
    primaryQuery: "ppt to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-ppt", "word-to-pdf"],
  },
  {
    slug: "pdf-to-ppt",
    title: "PDF to PPT",
    primaryQuery: "pdf to ppt",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["ppt-to-pdf", "pdf-to-word"],
  },
  {
    slug: "heic-to-pdf",
    title: "HEIC to PDF",
    primaryQuery: "heic to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["jpg-to-pdf", "image-to-pdf"],
  },
  {
    slug: "pdf-to-heic",
    title: "PDF to HEIC",
    primaryQuery: "pdf to heic",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-jpg", "pdf-to-png"],
  },
  {
    slug: "image-to-pdf",
    title: "Image to PDF",
    primaryQuery: "image to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["jpg-to-pdf", "png-to-pdf"],
  },
  {
    slug: "pdf-to-image",
    title: "PDF to Image",
    primaryQuery: "pdf to image",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["pdf-to-jpg", "pdf-to-png"],
  },
  {
    slug: "tiff-to-pdf",
    title: "TIFF to PDF",
    primaryQuery: "tiff to pdf",
    toolHref: "/tools/convert-pdf",
    toolLabel: "Convert PDF tool",
    relatedConverters: ["image-to-pdf", "jpg-to-pdf"],
  },
]

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

function createConverterArticle(config: ConverterConfig): TrancheLearnArticle {
  const [relatedA, relatedB] = config.relatedConverters

  return {
    slug: config.slug,
    title: config.title,
    metaTitle: `${config.title} - Offline & Private | Plain.tools`,
    metaDescription: `${config.title} conversion guide. ${NO_UPLOADS_LINE}`,
    primaryQuery: config.primaryQuery,
    secondaryQueries: [
      `${config.primaryQuery} converter`,
      `${config.primaryQuery} online`,
      `${config.primaryQuery} no upload`,
    ],
    intent: "how-to",
    intro: [
      `${config.title} is quickest with a local conversion workflow that keeps your files on-device. ${NO_UPLOADS_LINE}`,
      "This guide covers the practical conversion steps, checks to run before sharing, and links to related formats.",
    ],
    sections: [
      {
        id: "conversion-explanation",
        heading: "How this conversion works",
        paragraphs: [
          "Most format conversions decode the source file structure and then re-encode content into the target format.",
          "The result quality depends on source quality, page complexity, and whether images or text are being transformed.",
        ],
      },
      {
        id: "step-by-step",
        heading: "Step-by-step instructions",
        paragraphs: [
          "Prepare the source file first, then run one test conversion and inspect output before final sharing.",
          "If the destination system has size or format limits, validate those requirements before export.",
        ],
        bullets: [
          `Open Plain ${config.toolLabel}`,
          "Select your source file and output format",
          "Run conversion and download output",
          "Review output readability and file size",
        ],
      },
      {
        id: "privacy-explanation",
        heading: "Why local conversion is useful",
        paragraphs: [
          "Local processing avoids sending document content to a remote conversion service.",
          "For personal records and business paperwork, this reduces transfer exposure and keeps workflows simpler to audit.",
        ],
      },
      {
        id: "quality-checks",
        heading: "Output checks before sending",
        paragraphs: [
          "Open the converted file in a separate viewer to verify fonts, page order, and image clarity.",
          "If a portal rejects the file, recheck format requirements and rerun conversion with adjusted settings.",
        ],
      },
    ],
    faqs: [
      {
        question: `Can I convert ${config.title} without an account?`,
        answer:
          "Yes. The local conversion flow can run directly in your browser without creating an account.",
      },
      {
        question: "Are files uploaded during conversion?",
        answer:
          "No. Conversion runs locally in your browser session. You can verify this in DevTools network requests.",
      },
      {
        question: "What if the output quality looks wrong?",
        answer:
          "Retry with a cleaner source file or a different output option, then inspect the result before distribution.",
      },
      {
        question: "Can I convert multiple related documents in one workflow?",
        answer:
          "Yes. Convert each file, then merge or compress outputs as needed for your submission or archive workflow.",
      },
    ],
    trustBox,
    nextSteps: [
      { label: `Open ${config.toolLabel}`, href: config.toolHref },
      { label: "Learn centre", href: "/learn" },
      { label: "Compare offline vs online tools", href: "/compare" },
      { label: "Verify claims", href: "/verify-claims" },
      { label: `Related converter: ${titleFromSlug(relatedA)}`, href: `/file-converters/${relatedA}` },
      { label: `Related converter: ${titleFromSlug(relatedB)}`, href: `/file-converters/${relatedB}` },
    ],
    toolHref: config.toolHref,
    relatedLearn: [relatedA, relatedB],
    verifyHref: "/verify-claims",
  }
}

export const converterPages: TrancheLearnArticle[] = converterConfigs.map(createConverterArticle)
export const converterRouteSlugs = converterConfigs.map((config) => config.slug)
export const converterSitemapUrls = converterRouteSlugs.map((slug) => `/file-converters/${slug}`)

const converterMap = new Map(converterPages.map((page) => [page.slug, page]))

export function getConverterArticleOrThrow(slug: string) {
  const article = converterMap.get(slug)
  if (!article) {
    throw new Error(`Missing file converter article data for slug: ${slug}`)
  }
  return article
}

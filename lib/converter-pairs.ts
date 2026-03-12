import type { ToolDefinition } from "@/lib/tools-catalogue"

export type ConverterRouteParams = {
  from: string
  to: string
}

export type ConverterPair = {
  desc: string
  from: string
  keywords: string[]
  title: string
  to: string
}

export type ConverterFaq = {
  answer: string
  question: string
}

export type ConverterStep = {
  name: string
  text: string
}

export type ConverterSection = {
  paragraphs: string[]
  title: string
}

export type ConverterEmbed =
  | {
      kind: "tool"
      toolSlug: string
    }
  | {
      kind: "universal"
    }

export type ConverterPairPage = ConverterPair & {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  description: string
  embed: ConverterEmbed
  faq: ConverterFaq[]
  featureList: string[]
  fromFormat: ConverterFormat
  h1: string
  heroBadges: string[]
  howToSteps: ConverterStep[]
  intro: string[]
  liveToolDescription: string
  privacyNote: string[]
  proxyTool: ToolDefinition
  relatedLinks: Array<{ href: string; title: string }>
  sections: ConverterSection[]
  slug: string
  toFormat: ConverterFormat
  title: string
  wordCount: number
}

export type ConverterFormatCategory =
  | "3d"
  | "archive"
  | "audio"
  | "cad"
  | "document"
  | "ebook"
  | "font"
  | "image"
  | "pdf"
  | "subtitle"
  | "text"
  | "video"

export type ConverterFormat = {
  browserSupportNote?: string
  category: ConverterFormatCategory
  longLabel: string
  problem: string
  seoLabel: string
  slug: string
}

const CONVERTER_TOOL_PROXY: ToolDefinition = {
  available: true,
  category: "File Tools",
  description:
    "Browser-based file conversion routes with no upload for the core workflow where supported.",
  id: "file-converter-proxy",
  name: "File Converter",
  slug: "file-converters",
}

const FORMATS: Record<string, ConverterFormat> = {
  avif: {
    browserSupportNote:
      "AVIF support depends on the current browser and operating system, so local conversion is best-effort rather than universal.",
    category: "image",
    longLabel: "AVIF image",
    problem: "AVIF is efficient, but older apps and CMS uploads often reject it or generate broken previews.",
    seoLabel: "AVIF",
    slug: "avif",
  },
  bmp: {
    category: "image",
    longLabel: "BMP bitmap image",
    problem: "BMP files are bulky and awkward to share because they keep size high without modern web compression.",
    seoLabel: "BMP",
    slug: "bmp",
  },
  docx: {
    category: "document",
    longLabel: "DOCX Word document",
    problem: "DOCX is great for editing, but it is the wrong format when you need a fixed-layout share copy or browser-friendly output.",
    seoLabel: "DOCX",
    slug: "docx",
  },
  gif: {
    category: "image",
    longLabel: "GIF image",
    problem: "GIF is widely compatible, but it is inefficient for still images and often bloats compared with JPG or WebP.",
    seoLabel: "GIF",
    slug: "gif",
  },
  heic: {
    browserSupportNote:
      "HEIC often works best on Apple devices. Windows and older web apps still struggle to open it cleanly without conversion.",
    category: "image",
    longLabel: "HEIC image",
    problem: "HEIC files regularly fail on Windows desktops, old CMS uploaders, and browser workflows that expect JPG or PNG.",
    seoLabel: "HEIC",
    slug: "heic",
  },
  heif: {
    browserSupportNote:
      "HEIF decoding varies by browser and operating system, so local conversion works only when the browser can read the exact file variant.",
    category: "image",
    longLabel: "HEIF image",
    problem: "HEIF keeps files smaller, but compatibility remains inconsistent across office workflows and older upload tools.",
    seoLabel: "HEIF",
    slug: "heif",
  },
  htm: {
    category: "document",
    longLabel: "HTM document",
    problem: "HTM source files are useful for rendering, but they are not a stable delivery format for review or archiving.",
    seoLabel: "HTM",
    slug: "htm",
  },
  html: {
    category: "document",
    longLabel: "HTML document",
    problem: "HTML is flexible, but that flexibility becomes a problem when you need one fixed downloadable file instead of a live web document.",
    seoLabel: "HTML",
    slug: "html",
  },
  ico: {
    browserSupportNote:
      "ICO files can contain multiple sizes and image variants, so browsers do not always decode every icon bundle the same way.",
    category: "image",
    longLabel: "ICO icon image",
    problem: "ICO is ideal for favicons, but not for modern content workflows that need previewable, editable image outputs.",
    seoLabel: "ICO",
    slug: "ico",
  },
  jfif: {
    category: "image",
    longLabel: "JFIF image",
    problem: "JFIF is effectively JPEG, but some uploaders and editors label it awkwardly and confuse users who only expect JPG.",
    seoLabel: "JFIF",
    slug: "jfif",
  },
  jpeg: {
    category: "image",
    longLabel: "JPEG image",
    problem: "JPEG is common, but some workflows still demand PNG or PDF when you need transparency, printing, or review packaging.",
    seoLabel: "JPEG",
    slug: "jpeg",
  },
  jpg: {
    category: "image",
    longLabel: "JPG image",
    problem: "JPG travels well, but it is not always the right target for print, transparency, or document packaging workflows.",
    seoLabel: "JPG",
    slug: "jpg",
  },
  markdown: {
    category: "text",
    longLabel: "Markdown document",
    problem: "Markdown is portable for editing, but it often needs PDF or HTML output before sharing with non-technical reviewers.",
    seoLabel: "Markdown",
    slug: "markdown",
  },
  md: {
    category: "text",
    longLabel: "MD file",
    problem: "MD files are efficient for writing, but many recipients still need a rendered PDF or HTML copy instead of raw source.",
    seoLabel: "MD",
    slug: "md",
  },
  pdf: {
    category: "pdf",
    longLabel: "PDF document",
    problem: "PDF preserves layout well, but it is often the wrong format when you need editable text, images, or structured extraction.",
    seoLabel: "PDF",
    slug: "pdf",
  },
  png: {
    category: "image",
    longLabel: "PNG image",
    problem: "PNG preserves quality and transparency, but it can become unnecessarily heavy when the next workflow only needs JPG or WebP.",
    seoLabel: "PNG",
    slug: "png",
  },
  ppt: {
    category: "document",
    longLabel: "PowerPoint deck",
    problem: "Presentation workflows often need PDF or extracted images before a deck can be reviewed cleanly outside Office tooling.",
    seoLabel: "PPT",
    slug: "ppt",
  },
  pptx: {
    category: "document",
    longLabel: "PPTX presentation",
    problem: "PPTX is useful for editing, but many recipients want a fixed review copy instead of a live slide deck.",
    seoLabel: "PPTX",
    slug: "pptx",
  },
  svg: {
    browserSupportNote:
      "SVG conversion depends on embedded fonts, CSS, and linked assets. Self-contained SVG files convert far more reliably than externally linked ones.",
    category: "image",
    longLabel: "SVG image",
    problem: "SVG is ideal for vectors, but plenty of uploaders and social tools still need raster outputs such as PNG or JPG.",
    seoLabel: "SVG",
    slug: "svg",
  },
  text: {
    category: "text",
    longLabel: "plain text file",
    problem: "Plain text is easy to store, but it often needs PDF or HTML packaging before it is ready for review or delivery.",
    seoLabel: "Text",
    slug: "text",
  },
  tif: {
    browserSupportNote:
      "TIF support is inconsistent in browsers, especially for unusual compression variants or multi-page images.",
    category: "image",
    longLabel: "TIF image",
    problem: "TIF files are common in archives and scans, but many day-to-day workflows need JPG, PNG, or PDF instead.",
    seoLabel: "TIF",
    slug: "tif",
  },
  tiff: {
    browserSupportNote:
      "TIFF decoding in browsers is best-effort. Multi-page or uncommon TIFF variants may need a more compatible environment.",
    category: "image",
    longLabel: "TIFF image",
    problem: "TIFF is good for scanning and print pipelines, but it is awkward for casual sharing, web uploaders, and non-specialist tools.",
    seoLabel: "TIFF",
    slug: "tiff",
  },
  txt: {
    category: "text",
    longLabel: "TXT file",
    problem: "TXT is universal for editing, but it is not a polished delivery format when layout or presentation matters.",
    seoLabel: "TXT",
    slug: "txt",
  },
  webp: {
    category: "image",
    longLabel: "WebP image",
    problem: "WebP is efficient for the web, but many legacy editors, CMS fields, and office tools still expect JPG or PNG.",
    seoLabel: "WebP",
    slug: "webp",
  },
  word: {
    category: "document",
    longLabel: "Word document",
    problem: "Word files are ideal for editing, but they are fragile when you need a stable final layout or browser share copy.",
    seoLabel: "Word",
    slug: "word",
  },
  xlsx: {
    category: "document",
    longLabel: "XLSX spreadsheet",
    problem: "Spreadsheet data often needs PDF or extracted output before it is shareable outside Excel-heavy workflows.",
    seoLabel: "XLSX",
    slug: "xlsx",
  },
}

const IMAGE_SOURCES = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "gif",
  "bmp",
  "svg",
  "tiff",
  "tif",
  "heic",
  "heif",
  "jfif",
  "ico",
] as const

const IMAGE_TARGETS = ["png", "jpg", "jpeg", "webp", "avif", "pdf"] as const
const PDF_TARGETS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "text",
  "txt",
  "word",
  "docx",
  "html",
  "htm",
  "markdown",
  "md",
  "xlsx",
  "ppt",
  "pptx",
] as const
const DOCUMENT_TO_PDF_SOURCES = [
  "word",
  "docx",
  "html",
  "htm",
  "text",
  "txt",
  "markdown",
  "md",
] as const

function buildPairs() {
  const entries = new Map<string, ConverterPair>()

  const addPair = (from: string, to: string) => {
    const fromFormat = FORMATS[from]
    const toFormat = FORMATS[to]
    if (!fromFormat || !toFormat || from === to) return

    const key = `${from}->${to}`
    if (entries.has(key)) return

    entries.set(key, {
      desc: `Convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} free without upload. Browser-based conversion for ${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} with privacy-first handling on Plain Tools.`,
      from,
      keywords: [
        `convert ${from} to ${to} online free`,
        `${from} to ${to} converter no upload`,
        `${from} to ${to} converter browser`,
        `${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} local converter`,
      ],
      title: `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter – Free, No Upload, Local | Plain Tools`,
      to,
    })
  }

  for (const from of IMAGE_SOURCES) {
    for (const to of IMAGE_TARGETS) {
      addPair(from, to)
    }
  }

  for (const to of PDF_TARGETS) {
    addPair("pdf", to)
  }

  for (const from of DOCUMENT_TO_PDF_SOURCES) {
    addPair(from, "pdf")
  }

  return Array.from(entries.values()).sort((left, right) =>
    `${left.from}-${left.to}`.localeCompare(`${right.from}-${right.to}`)
  )
}

export const CONVERTER_PAIRS = buildPairs()

const CONVERTER_PAIR_MAP = new Map(
  CONVERTER_PAIRS.map((pair) => [`${pair.from}->${pair.to}`, pair])
)

export function getConverterFormat(slug: string) {
  return FORMATS[slug.toLowerCase()] ?? null
}

function buildEmbed(from: string, to: string): ConverterEmbed {
  if (from === "pdf") {
    if (["word", "docx"].includes(to)) return { kind: "tool", toolSlug: "pdf-to-word" }
    if (["html", "htm"].includes(to)) return { kind: "tool", toolSlug: "pdf-to-html" }
    if (["markdown", "md"].includes(to)) return { kind: "tool", toolSlug: "pdf-to-markdown" }
    if (to === "xlsx") return { kind: "tool", toolSlug: "pdf-to-excel" }
    if (["ppt", "pptx"].includes(to)) return { kind: "tool", toolSlug: "pdf-to-ppt" }
    return { kind: "universal" }
  }

  if (to === "pdf") {
    if (["word", "docx"].includes(from)) return { kind: "tool", toolSlug: "word-to-pdf" }
    if (["html", "htm"].includes(from)) return { kind: "tool", toolSlug: "html-to-pdf" }
    if (["text", "txt", "markdown", "md"].includes(from)) {
      return { kind: "tool", toolSlug: "text-to-pdf" }
    }
  }

  return { kind: "universal" }
}

function buildProblemIntro(fromFormat: ConverterFormat, toFormat: ConverterFormat) {
  return [
    `${fromFormat.problem} That is why searches for ${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} converters are usually high intent. The user already knows the source format is friction in the next workflow and wants one direct fix, not a generic file-tool directory.`,
    `This route is designed for that exact intent. It explains why ${fromFormat.seoLabel} becomes awkward in real workflows, embeds the live converter immediately, and keeps the positioning explicit: files never leave your device for the core workflow, the conversion runs locally in the browser where supported, and the page links directly into the next adjacent tools instead of acting like a thin SEO doorway.`,
  ]
}

function buildWhyItMatters(fromFormat: ConverterFormat, toFormat: ConverterFormat) {
  return [
    `${fromFormat.seoLabel} and ${toFormat.seoLabel} solve different problems. ${fromFormat.seoLabel} is valuable because it suits one stage of the workflow, but teams often switch formats when the file has to open on different devices, fit an upload validator, print correctly, or move into a review process that expects a different kind of output.`,
    `That is also where privacy enters the decision. Many public converter sites treat conversion as an upload problem first and a workflow problem second. Plain Tools flips that around. The page assumes the file may be sensitive and that a good default is browser-first, no-upload handling when the current browser can support the conversion locally.`,
  ]
}

function buildHowItWorks(fromFormat: ConverterFormat, toFormat: ConverterFormat, embed: ConverterEmbed) {
  const toolLine =
    embed.kind === "tool"
      ? `This route uses the existing ${embed.toolSlug.replace(/-/g, " ")} workspace under the hood, then wraps it in intent-specific guidance for ${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} searches.`
      : `This route uses the universal local converter for image and simple document transformations, so the work happens inside your browser memory instead of a hosted upload queue.`

  return [
    toolLine,
    `${FORMATS[fromFormat.slug].browserSupportNote ?? ""}`.trim() ||
      `${fromFormat.seoLabel} can be processed locally in most modern browsers for the supported conversion paths on this page.`,
    `The practical workflow is straightforward: choose the file, run the conversion locally, inspect the result, and download the new ${toFormat.seoLabel} file. That sounds simple, but the explanation matters because users often need to understand compression changes, editability trade-offs, or compatibility limits before they trust the output.`,
  ]
}

function buildSteps(fromFormat: ConverterFormat, toFormat: ConverterFormat): ConverterStep[] {
  return [
    {
      name: `Choose the ${fromFormat.seoLabel} file you actually need to convert`,
      text: `Start with the real source file that is failing in the next workflow, whether that is a HEIC image on Windows, a PDF that needs extraction, or a Markdown file that needs a stable review copy.`,
    },
    {
      name: `Run the ${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion locally`,
      text: `Use the embedded converter below. The preferred path is browser-only and no-upload, so the file stays on your device while the conversion engine does the work locally where supported.`,
    },
    {
      name: `Inspect the ${toFormat.seoLabel} result before sharing it`,
      text: `Check visual quality, formatting, text extraction, or editability depending on the pair. A successful conversion is not enough unless the next tool or recipient can actually use the result.`,
    },
    {
      name: "Move into the next related workflow only if needed",
      text: "If the file is still too large, needs PDF packaging, or should be converted into a second output, use the related links instead of starting again on another site.",
    },
  ]
}

function buildSections(fromFormat: ConverterFormat, toFormat: ConverterFormat): ConverterSection[] {
  return [
    {
      title: `Why ${fromFormat.seoLabel} becomes a problem in real workflows`,
      paragraphs: [
        `${fromFormat.seoLabel} can be the right source format and still be the wrong delivery format. That is why people search for exact long-tail pages like ${fromFormat.slug}-to-${toFormat.slug} rather than a generic converter homepage. They already hit a compatibility wall.`,
        `Examples vary by pair. HEIC and HEIF often fail on Windows. PNG files may be too heavy for email or CMS limits. PDFs preserve layout well but resist editing. Markdown is excellent for drafting but awkward for stakeholders who just need a clean PDF review copy. The route needs to explain that context to avoid becoming thin or interchangeable.`,
      ],
    },
    {
      title: `Why local ${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion is safer`,
      paragraphs: [
        `Upload-first conversion sites add one more external handoff for a file that may already contain sensitive material such as contracts, screenshots, invoices, HR exports, or internal diagrams. Plain Tools takes a narrower approach: the file stays in browser memory for the core conversion workflow and is downloaded again directly on the same device.`,
        `That matters because conversion queries often look harmless even when the files are not. "Convert PNG to JPG" might be a customer screenshot. "Convert PDF to Word" might be a contract. "Convert HTML to PDF" might be an internal report. Local processing reduces one important category of exposure without making unrealistic promises about every browser or every source variant.`,
      ],
    },
    {
      title: `What changes after converting ${fromFormat.seoLabel} to ${toFormat.seoLabel}`,
      paragraphs: [
        `${toFormat.seoLabel} changes more than the file extension. It affects who can open the file easily, whether the result stays editable, how the file compresses, and whether the next workflow treats it as an image, a document, or a fixed layout.`,
        `That is why this page keeps expectations explicit. Some pairs are near-visual exports. Others are best-effort editable outputs. Some work instantly on almost every browser, while others depend on native decoding support for the input type. Clear caveats are part of quality, not a weakness.`,
      ],
    },
  ]
}

function buildFaq(fromFormat: ConverterFormat, toFormat: ConverterFormat): ConverterFaq[] {
  return [
    {
      question: `Can I convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} without uploading the file?`,
      answer:
        "Yes. This route is built around browser-based local conversion where supported, so the preferred path does not require uploading the file to Plain Tools servers.",
    },
    {
      question: `Is ${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion lossless?`,
      answer:
        "Not always. Some pairs preserve the image or layout closely, while others trade editability, compression, or fidelity for compatibility. Always inspect the result before you send it on.",
    },
    {
      question: `Why would someone convert ${fromFormat.seoLabel} to ${toFormat.seoLabel}?`,
      answer: `${fromFormat.seoLabel} may be the wrong format for the next tool, operating system, upload field, or review step. Converting to ${toFormat.seoLabel} usually solves compatibility, sharing, or workflow friction.`,
    },
    {
      question: "What if the browser cannot read my source file?",
      answer:
        "That usually means the exact format variant is not supported locally in the current environment. Try a more compatible browser or a simpler intermediate such as PNG, JPG, or PDF.",
    },
    {
      question: "Why does this page include other converter links?",
      answer:
        "Because conversion workflows branch naturally. Users often need the same source in another target format, or they need to package the result into a PDF or image workflow immediately after the first conversion.",
    },
    {
      question: "Does Plain Tools store the converted file?",
      answer:
        "No. The core workflow here is local browser processing, so the file stays on your device during the conversion path on supported routes.",
    },
  ]
}

function countWords(values: string[]) {
  return values
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function getConverterPair(from: string, to: string) {
  return CONVERTER_PAIR_MAP.get(`${from.toLowerCase()}->${to.toLowerCase()}`) ?? null
}

export function getConverterPairPage(from: string, to: string): ConverterPairPage | null {
  const pair = getConverterPair(from, to)
  if (!pair) return null

  const fromFormat = FORMATS[pair.from]
  const toFormat = FORMATS[pair.to]
  const canonicalPath = `/convert/${pair.from}-to-${pair.to}`
  const slug = `${pair.from}-to-${pair.to}`
  const embed = buildEmbed(pair.from, pair.to)
  const intro = buildProblemIntro(fromFormat, toFormat)
  const whyUsersNeedThis = buildWhyItMatters(fromFormat, toFormat)
  const howItWorks = buildHowItWorks(fromFormat, toFormat, embed)
  const steps = buildSteps(fromFormat, toFormat)
  const sections = buildSections(fromFormat, toFormat)
  const privacyNote = [
    `Files never leave your device for the core workflow on this page. Plain Tools is intentionally browser-based and no-upload here because many conversion jobs involve screenshots, contracts, statements, exports, or other files that should not be pushed through a random hosted converter just to change the format.`,
    `That privacy angle is part of the product, not just the copy. The route embeds the actual local conversion workspace, explains where browser support can still limit a pair such as HEIC or TIFF, and then links to the next adjacent tools so users do not need to restart the workflow elsewhere.`,
  ]
  const faq = buildFaq(fromFormat, toFormat)
  const relatedLinks = getRelatedConverterLinks(pair.from, pair.to)
  const wordCount = countWords([
    pair.title,
    pair.desc,
    ...intro,
    ...whyUsersNeedThis,
    ...howItWorks,
    ...steps.flatMap((step) => [step.name, step.text]),
    ...sections.flatMap((section) => [section.title, ...section.paragraphs]),
    ...privacyNote,
    ...faq.flatMap((item) => [item.question, item.answer]),
  ])

  return {
    ...pair,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/file-converters", label: "File Converters" },
      { label: `${fromFormat.seoLabel} to ${toFormat.seoLabel}` },
    ],
    canonicalPath,
    description: pair.desc,
    embed,
    faq,
    featureList: [
      `Convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} in a browser-first workflow`,
      "No upload for the core conversion path",
      "Related links to adjacent converters, PDF tools, and comparison pages",
    ],
    fromFormat,
    h1: `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter`,
    heroBadges: ["100% local", "no upload", "privacy-first", "browser-based"],
    howToSteps: steps,
    intro,
    liveToolDescription: `Run the actual ${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion below. The preferred path stays local in the browser and keeps the file on your device where supported.`,
    privacyNote,
    proxyTool: CONVERTER_TOOL_PROXY,
    relatedLinks,
    sections: [
      {
        paragraphs: whyUsersNeedThis,
        title: `Why ${fromFormat.seoLabel} to ${toFormat.seoLabel} matters`,
      },
      {
        paragraphs: howItWorks,
        title: `How the local ${fromFormat.seoLabel} to ${toFormat.seoLabel} workflow works`,
      },
      ...sections,
    ],
    slug,
    toFormat,
    title: pair.title,
    wordCount,
  }
}

export function getConverterPairs() {
  return CONVERTER_PAIRS
}

export function generateAllConverterParams(limit?: number): ConverterRouteParams[] {
  const pairs = typeof limit === "number" ? CONVERTER_PAIRS.slice(0, limit) : CONVERTER_PAIRS
  return pairs.map((pair) => ({ from: pair.from, to: pair.to }))
}

export function getConverterSitemapPaths() {
  return CONVERTER_PAIRS.map((pair) => `/convert/${pair.from}-to-${pair.to}`)
}

export function getRelatedConverterLinks(from: string, to: string) {
  const sameInput = CONVERTER_PAIRS.filter(
    (pair) => pair.from === from && pair.to !== to
  ).slice(0, 4)
  const sameOutput = CONVERTER_PAIRS.filter(
    (pair) => pair.to === to && pair.from !== from
  ).slice(0, 4)
  const supportLinks = [
    { href: "/file-converters", title: "Browse file converters" },
    { href: "/tools", title: "Browse PDF tools" },
    { href: "/image-tools", title: "Browse image tools" },
    { href: "/compare", title: "Compare PDF tools" },
  ]

  return [
    ...sameInput.map((pair) => ({
      href: `/convert/${pair.from}-to-${pair.to}`,
      title: `${FORMATS[pair.from].seoLabel} to ${FORMATS[pair.to].seoLabel}`,
    })),
    ...sameOutput.map((pair) => ({
      href: `/convert/${pair.from}-to-${pair.to}`,
      title: `${FORMATS[pair.from].seoLabel} to ${FORMATS[pair.to].seoLabel}`,
    })),
    ...supportLinks,
  ]
    .filter((link, index, links) => links.findIndex((entry) => entry.href === link.href) === index)
    .slice(0, 10)
}

export const CONVERTER_METADATA_EXAMPLES = [
  getConverterPairPage("png", "jpg"),
  getConverterPairPage("heic", "pdf"),
  getConverterPairPage("pdf", "word"),
].filter((entry): entry is ConverterPairPage => Boolean(entry)).map((entry) => ({
  description: entry.description,
  path: entry.canonicalPath,
  title: entry.title,
}))

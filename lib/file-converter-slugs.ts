import { getToolBySlug } from "@/lib/tools-catalogue"

export type ConverterRouteParams = {
  conversion: string
}

export type ConverterSection = {
  id: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type ConverterFaq = {
  question: string
  answer: string
}

export type ConverterStep = {
  title: string
  text: string
}

export type ConverterLink = {
  href: string
  label: string
}

export type ConverterEmbedDefinition =
  | {
      kind: "tool"
      toolSlug: string
    }
  | {
      kind: "universal"
    }

type ConverterFormatCategory = "image" | "document" | "pdf" | "text"

type ConverterFormat = {
  category: ConverterFormatCategory
  browserSupportNote?: string
  extensionLabel: string
  longLabel: string
  seoLabel: string
  slug: string
}

type ConverterRouteDefinition = {
  embed: ConverterEmbedDefinition
  from: string
  slug: string
  to: string
}

export type FileConverterSeoPage = {
  canonicalToolHref: string
  embed: ConverterEmbedDefinition
  faq: ConverterFaq[]
  from: ConverterFormat
  h1: string
  introParagraphs: string[]
  metaDescription: string
  metaTitle: string
  path: string
  relatedConverters: {
    sameInput: ConverterLink[]
    sameOutput: ConverterLink[]
    supportingTools: ConverterLink[]
  }
  sections: ConverterSection[]
  slug: string
  steps: ConverterStep[]
  title: string
  to: ConverterFormat
}

const IMAGE_SOURCE_SLUGS = [
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

const IMAGE_OUTPUT_SLUGS = ["png", "jpg", "jpeg", "webp", "avif", "pdf"] as const
const PDF_OUTPUT_SLUGS = [
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
  "excel",
  "xlsx",
  "ppt",
  "pptx",
] as const
const PDF_INPUT_TO_PDF_SLUGS = [
  "word",
  "docx",
  "html",
  "htm",
  "text",
  "txt",
  "markdown",
  "md",
] as const

const CONVERTER_FORMATS: Record<string, ConverterFormat> = {
  avif: {
    slug: "avif",
    seoLabel: "AVIF",
    extensionLabel: ".avif",
    longLabel: "AVIF image",
    category: "image",
    browserSupportNote:
      "AVIF decoding and encoding depend on browser support. If your browser cannot decode or export AVIF locally, use PNG or JPG instead.",
  },
  bmp: {
    slug: "bmp",
    seoLabel: "BMP",
    extensionLabel: ".bmp",
    longLabel: "BMP bitmap image",
    category: "image",
  },
  docx: {
    slug: "docx",
    seoLabel: "DOCX",
    extensionLabel: ".docx",
    longLabel: "DOCX Word document",
    category: "document",
  },
  excel: {
    slug: "excel",
    seoLabel: "Excel",
    extensionLabel: "Excel spreadsheet",
    longLabel: "Excel spreadsheet",
    category: "document",
  },
  gif: {
    slug: "gif",
    seoLabel: "GIF",
    extensionLabel: ".gif",
    longLabel: "GIF image",
    category: "image",
  },
  heic: {
    slug: "heic",
    seoLabel: "HEIC",
    extensionLabel: ".heic",
    longLabel: "HEIC image",
    category: "image",
    browserSupportNote:
      "HEIC works only when the current browser can decode the file locally. If the browser rejects the file, convert it on a device with native HEIC support or use a PNG or JPG intermediate.",
  },
  heif: {
    slug: "heif",
    seoLabel: "HEIF",
    extensionLabel: ".heif",
    longLabel: "HEIF image",
    category: "image",
    browserSupportNote:
      "HEIF decoding varies by browser and operating system. This route is privacy-first, but support remains best effort when the browser cannot read HEIF directly.",
  },
  htm: {
    slug: "htm",
    seoLabel: "HTM",
    extensionLabel: ".htm",
    longLabel: "HTM document",
    category: "document",
  },
  html: {
    slug: "html",
    seoLabel: "HTML",
    extensionLabel: ".html",
    longLabel: "HTML document",
    category: "document",
  },
  ico: {
    slug: "ico",
    seoLabel: "ICO",
    extensionLabel: ".ico",
    longLabel: "ICO icon image",
    category: "image",
    browserSupportNote:
      "ICO files often contain multiple icon sizes. Your browser will usually decode one renderable bitmap locally, but complex icon bundles can behave differently across browsers.",
  },
  jfif: {
    slug: "jfif",
    seoLabel: "JFIF",
    extensionLabel: ".jfif",
    longLabel: "JFIF image",
    category: "image",
  },
  jpeg: {
    slug: "jpeg",
    seoLabel: "JPEG",
    extensionLabel: ".jpeg",
    longLabel: "JPEG image",
    category: "image",
  },
  jpg: {
    slug: "jpg",
    seoLabel: "JPG",
    extensionLabel: ".jpg",
    longLabel: "JPG image",
    category: "image",
  },
  markdown: {
    slug: "markdown",
    seoLabel: "Markdown",
    extensionLabel: ".md",
    longLabel: "Markdown document",
    category: "text",
  },
  md: {
    slug: "md",
    seoLabel: "MD",
    extensionLabel: ".md",
    longLabel: "Markdown file",
    category: "text",
  },
  pdf: {
    slug: "pdf",
    seoLabel: "PDF",
    extensionLabel: ".pdf",
    longLabel: "PDF document",
    category: "pdf",
  },
  png: {
    slug: "png",
    seoLabel: "PNG",
    extensionLabel: ".png",
    longLabel: "PNG image",
    category: "image",
  },
  ppt: {
    slug: "ppt",
    seoLabel: "PowerPoint",
    extensionLabel: "PowerPoint deck",
    longLabel: "PowerPoint deck",
    category: "document",
  },
  pptx: {
    slug: "pptx",
    seoLabel: "PPTX",
    extensionLabel: ".pptx",
    longLabel: "PPTX presentation",
    category: "document",
  },
  svg: {
    slug: "svg",
    seoLabel: "SVG",
    extensionLabel: ".svg",
    longLabel: "SVG image",
    category: "image",
    browserSupportNote:
      "SVG conversion depends on how the file references fonts, CSS, and linked assets. Self-contained SVG files convert cleanly in the browser, while externally linked assets can be blocked.",
  },
  text: {
    slug: "text",
    seoLabel: "Text",
    extensionLabel: ".txt",
    longLabel: "plain text file",
    category: "text",
  },
  tif: {
    slug: "tif",
    seoLabel: "TIF",
    extensionLabel: ".tif",
    longLabel: "TIF image",
    category: "image",
    browserSupportNote:
      "TIF decoding in browsers is inconsistent. This route stays privacy-first, but your browser still needs to understand the input file locally.",
  },
  tiff: {
    slug: "tiff",
    seoLabel: "TIFF",
    extensionLabel: ".tiff",
    longLabel: "TIFF image",
    category: "image",
    browserSupportNote:
      "TIFF files can contain multi-page or uncommon compression schemes. The converter works only when the browser can decode that specific TIFF locally.",
  },
  txt: {
    slug: "txt",
    seoLabel: "TXT",
    extensionLabel: ".txt",
    longLabel: "TXT text file",
    category: "text",
  },
  webp: {
    slug: "webp",
    seoLabel: "WebP",
    extensionLabel: ".webp",
    longLabel: "WebP image",
    category: "image",
  },
  word: {
    slug: "word",
    seoLabel: "Word",
    extensionLabel: "Word document",
    longLabel: "Word document",
    category: "document",
  },
  xlsx: {
    slug: "xlsx",
    seoLabel: "XLSX",
    extensionLabel: ".xlsx",
    longLabel: "XLSX spreadsheet",
    category: "document",
  },
}

function createToolEmbed(toolSlug: string): ConverterEmbedDefinition {
  return { kind: "tool", toolSlug }
}

function addRoute(
  target: Map<string, ConverterRouteDefinition>,
  from: string,
  to: string,
  embed: ConverterEmbedDefinition
) {
  const slug = `${from}-to-${to}`
  if (target.has(slug)) return
  target.set(slug, { slug, from, to, embed })
}

function buildRouteDefinitions() {
  const routes = new Map<string, ConverterRouteDefinition>()

  for (const from of IMAGE_SOURCE_SLUGS) {
    for (const to of IMAGE_OUTPUT_SLUGS) {
      if (from === to) continue
      addRoute(routes, from, to, { kind: "universal" })
    }
  }

  for (const to of PDF_OUTPUT_SLUGS) {
    addRoute(
      routes,
      "pdf",
      to,
      ["word", "docx"].includes(to)
        ? createToolEmbed("pdf-to-word")
        : ["html", "htm"].includes(to)
          ? createToolEmbed("pdf-to-html")
          : ["markdown", "md"].includes(to)
            ? createToolEmbed("pdf-to-markdown")
            : ["excel", "xlsx"].includes(to)
              ? createToolEmbed("pdf-to-excel")
              : ["ppt", "pptx"].includes(to)
                ? createToolEmbed("pdf-to-ppt")
                : { kind: "universal" }
    )
  }

  for (const from of PDF_INPUT_TO_PDF_SLUGS) {
    addRoute(
      routes,
      from,
      "pdf",
      ["word", "docx"].includes(from)
        ? createToolEmbed("word-to-pdf")
        : ["html", "htm"].includes(from)
          ? createToolEmbed("html-to-pdf")
          : createToolEmbed("text-to-pdf")
    )
  }

  return Array.from(routes.values()).sort((left, right) => left.slug.localeCompare(right.slug))
}

const FILE_CONVERTER_ROUTE_DEFINITIONS = buildRouteDefinitions()
const FILE_CONVERTER_ROUTE_MAP = new Map(
  FILE_CONVERTER_ROUTE_DEFINITIONS.map((route) => [route.slug, route])
)

function getFormatOrThrow(slug: string) {
  const format = CONVERTER_FORMATS[slug]
  if (!format) {
    throw new Error(`Unknown converter format: ${slug}`)
  }
  return format
}

function getCanonicalToolHref(route: ConverterRouteDefinition) {
  if (route.embed.kind === "tool") {
    return `/tools/${route.embed.toolSlug}`
  }

  if (route.from === "pdf") {
    return "/tools/convert-pdf"
  }

  if (route.to === "pdf") {
    return "/tools/jpg-to-pdf"
  }

  return "/file-converters"
}

function buildConverterDescription(from: ConverterFormat, to: ConverterFormat) {
  return `Convert ${from.seoLabel} to ${to.seoLabel} free online with a browser-based workflow that runs locally where supported. No upload, privacy-first processing, and practical guidance for ${from.seoLabel.toLowerCase()} to ${to.seoLabel.toLowerCase()} conversion on Plain Tools.`
}

function buildToolExplainer(route: ConverterRouteDefinition) {
  if (route.embed.kind === "tool") {
    const tool = getToolBySlug(route.embed.toolSlug)
    return tool
      ? `This page embeds the same ${tool.name} workspace used on the canonical tool page, then layers search-intent specific guidance, privacy notes, and internal links around that workflow.`
      : "This page embeds the closest matching local conversion workspace, then layers format-specific guidance around the live tool."
  }

  if (route.from === "pdf") {
    return `This route uses a browser-only renderer for PDF pages when the output is an image or text export. For multi-page documents, the converter can package page outputs into a ZIP without sending the PDF to a remote server.`
  }

  return `This route uses a best-effort browser converter for image formats, which means the file is decoded in your current browser, transformed locally, and downloaded again without a cloud upload step.`
}

function buildCompatibilityCopy(from: ConverterFormat, to: ConverterFormat) {
  const notes = [from.browserSupportNote, to.browserSupportNote].filter(Boolean)
  if (notes.length === 0) {
    return `Because ${from.seoLabel} and ${to.seoLabel} are handled inside the browser, the main variables are file size, the source image dimensions, and how aggressively you want to optimise the output. The local workflow is usually faster than an upload-first converter for one-off conversions because there is no queue, no transfer delay, and no account gate before the download starts.`
  }

  return `${notes.join(" ")} That is the tradeoff with privacy-first conversion: Plain Tools avoids uploading your file, but the browser still has to support the format natively for the local path to work.`
}

function buildSections(
  route: ConverterRouteDefinition,
  from: ConverterFormat,
  to: ConverterFormat
): ConverterSection[] {
  const workflowExplainer = buildToolExplainer(route)
  const compatibilityCopy = buildCompatibilityCopy(from, to)

  return [
    {
      id: "why-convert",
      heading: `Why people convert ${from.seoLabel} to ${to.seoLabel}`,
      paragraphs: [
        `${from.seoLabel} to ${to.seoLabel} is a high-intent conversion because the output format usually changes how the file is shared, edited, or archived. Teams often move from ${from.longLabel} to ${to.longLabel} to reduce compatibility friction, prepare files for printing, make assets easier to insert into slides, or standardise output across design and operations workflows. The search intent is practical: open the file, convert it quickly, and keep moving without a signup wall or a remote processing queue.`,
        `That is also why a privacy-first page matters. Many converter sites push users toward drag-and-drop uploads with very little explanation of where the file goes, how long it is retained, or which third-party services sit between the upload and the download. Plain Tools takes the opposite position for this route: the preferred path is browser-only processing, no upload for the core workflow, and clear notes where browser support or file complexity can still limit what is realistic.`,
      ],
    },
    {
      id: "local-workflow",
      heading: `How the local ${from.seoLabel} to ${to.seoLabel} workflow works`,
      paragraphs: [
        `The page below is not a thin SEO wrapper. It embeds a live converter workspace so the user can act on the query immediately. ${workflowExplainer} For search-driven visitors, that matters because the page does not force a second click to reach the tool. The explanation, tool, schema, and related links all live in one route that matches the exact conversion intent.`,
        `In practical terms the workflow is simple. You select a ${from.seoLabel} file, the browser loads it into local memory, the conversion runs with browser APIs or an existing Plain Tools conversion engine, and the result is offered back as a direct download. For supported routes that means no file transfer to Plain Tools infrastructure, no processing queue on a remote server, and no need to trust that an upload-first vendor actually deletes the original file on time.`,
      ],
    },
    {
      id: "format-differences",
      heading: `${from.seoLabel} vs ${to.seoLabel}: what changes after conversion`,
      paragraphs: [
        `${from.seoLabel} and ${to.seoLabel} are not interchangeable just because both can represent the same document or image. The output format changes compression behaviour, browser compatibility, downstream editing options, and how the file behaves when another tool opens it. That is why this page is written around the exact ${from.seoLabel.toLowerCase()} to ${to.seoLabel.toLowerCase()} query instead of a generic “convert files” template with one recycled paragraph.`,
        compatibilityCopy,
      ],
      bullets: [
        `${to.seoLabel} is usually chosen because it fits the next workflow better than ${from.seoLabel}.`,
        `Local conversion removes upload risk, but it does not remove format-specific limits like unsupported fonts, multi-page source files, or browser decode gaps.`,
        `For sensitive files, browser-only conversion is the safest default because the input stays on the current device unless you deliberately move it elsewhere.`,
      ],
    },
    {
      id: "step-by-step",
      heading: `Step-by-step: convert ${from.seoLabel} to ${to.seoLabel} without upload`,
      paragraphs: [
        `A good conversion page should reduce uncertainty before the user clicks anything. First, confirm that your target format is the one you actually need downstream. If the file is headed for print, review, or offline sharing, ${to.seoLabel} may be the better endpoint. If it is headed back into a design workflow, keeping a more editable source may still be smarter. That is why the route includes related converters so users can pivot without returning to search results.`,
        `Second, run the conversion locally and inspect the output before distributing it. For image conversions, check dimensions, clarity, colour shifts, and compression artifacts. For document-oriented outputs, confirm whether the result is intended as a visual export, a text extraction, or a best-effort editable file. The privacy-first claim is only useful if the result is also practical, so this page sets expectations instead of pretending every pair is lossless.`,
      ],
    },
    {
      id: "common-problems",
      heading: `Common ${from.seoLabel} to ${to.seoLabel} problems`,
      paragraphs: [
        `Most failures in ${from.seoLabel} to ${to.seoLabel} conversion are not mysterious. Large files can exceed browser memory. Exotic source variants can decode differently on one operating system than another. A browser may read one HEIC file and reject the next because device vendors encoded them differently. A PDF can export clean first pages to images but slow down on long documents because every page still has to be rendered locally. Those issues are real, and pretending otherwise creates thin content and poor user trust.`,
        `The recovery path is usually straightforward. Reduce the input size, try a more compatible intermediate such as PNG or JPG, or switch to the canonical Plain Tools workflow for that document class if the page below recommends one. That keeps the internal linking matrix functional instead of decorative. The next link is there because the adjacent converter or core tool genuinely solves the next likely problem.`,
      ],
      bullets: [
        "If the file fails immediately, the browser probably cannot decode the exact input type locally.",
        "If the output looks soft or blocky, choose a less lossy target such as PNG or PDF.",
        "If a document conversion produces a best-effort editable file, review formatting before sharing it as final output.",
      ],
    },
    {
      id: "privacy",
      heading: `Why a privacy-first ${from.seoLabel} to ${to.seoLabel} converter matters`,
      paragraphs: [
        `Utility-site SEO only works long term when the page solves the job while respecting the file. That is especially true for converters because many users are handling invoices, HR exports, contracts, screenshots, internal diagrams, or client deliverables. Those files are often confidential even when the conversion itself is simple. Plain Tools keeps the message consistent across this entire system: 100% local where supported, no upload for the core workflow, browser-only processing first, and explicit caveats when support depends on the current browser.`,
        `That emphasis is not just marketing copy. It affects the content structure, schema, and internal links. Pages like this connect users to adjacent routes such as ${from.seoLabel} to PDF, PDF to ${to.seoLabel}, and the canonical tool page because real users branch into those tasks naturally. The result is stronger internal linking, better crawl paths, and a lower risk of thin content because every route speaks to a different concrete conversion intent.`,
      ],
    },
    {
      id: "next-steps",
      heading: `Related ${from.seoLabel} and ${to.seoLabel} tools`,
      paragraphs: [
        `After converting ${from.seoLabel} to ${to.seoLabel}, the next task is often optimisation or packaging. You may want to compress the result, merge it into a PDF workflow, extract text from a PDF derivative, or convert the same source into a different target for another teammate. That is why the page ends with a link matrix instead of a dead end. Search visitors often need a chain of conversions, not just a single isolated action.`,
        `For Plain Tools, those links also reinforce safe crawl architecture. Rather than generating thousands of disconnected slugs, each route points to same-input alternatives, same-output alternatives, and the canonical tool page that best fits the underlying workflow. That keeps users moving through relevant paths and gives search engines a clear understanding of how these converter pages cluster around a real product surface.`,
      ],
    },
  ]
}

function buildFaq(from: ConverterFormat, to: ConverterFormat): ConverterFaq[] {
  return [
    {
      question: `Can I convert ${from.seoLabel} to ${to.seoLabel} without uploading the file?`,
      answer:
        "Yes. This page is designed around a browser-first workflow so the conversion runs locally where supported. Your browser still needs to understand the input format, but the preferred path does not require uploading the file to Plain Tools servers.",
    },
    {
      question: `Is ${from.seoLabel} to ${to.seoLabel} conversion lossless?`,
      answer:
        "Not always. Some format pairs preserve the image visually, while others change compression, colour handling, text extraction, or editability. Treat the output as a new file and verify quality before you share it.",
    },
    {
      question: `What if my ${from.seoLabel} file does not open in the local converter?`,
      answer:
        "That usually means the browser cannot decode the exact file variant locally. Try a more compatible intermediate format, use the canonical related tool on Plain Tools, or open the file on a browser and operating system with better native support for that format.",
    },
    {
      question: `Why does this ${from.seoLabel} to ${to.seoLabel} page include related converters?`,
      answer:
        "Because conversion tasks usually branch. Users often need the same source in a second output format or need the result packaged into a PDF workflow. The related links are there to support the next likely task, not to pad the page.",
    },
  ]
}

function buildSteps(from: ConverterFormat, to: ConverterFormat): ConverterStep[] {
  return [
    {
      title: `Add your ${from.seoLabel} file`,
      text: `Open the live converter below and choose the ${from.extensionLabel} file you want to process.`,
    },
    {
      title: `Run the ${from.seoLabel} to ${to.seoLabel} conversion locally`,
      text: `The browser reads the file and performs the conversion on-device where supported, without a cloud upload step for the core workflow.`,
    },
    {
      title: `Review the ${to.seoLabel} output`,
      text: `Check quality, formatting, or extracted content so you know the target file behaves the way the next workflow expects.`,
    },
    {
      title: `Download and continue`,
      text: `Save the new ${to.seoLabel} file, then use the related links if you need another conversion, compression, or PDF workflow.`,
    },
  ]
}

function buildRelatedConverters(route: ConverterRouteDefinition) {
  const sameInput = FILE_CONVERTER_ROUTE_DEFINITIONS.filter(
    (entry) => entry.from === route.from && entry.slug !== route.slug
  )
    .slice(0, 6)
    .map((entry) => ({
      href: `/convert/${entry.slug}`,
      label: `${getFormatOrThrow(entry.from).seoLabel} to ${getFormatOrThrow(entry.to).seoLabel}`,
    }))

  const sameOutput = FILE_CONVERTER_ROUTE_DEFINITIONS.filter(
    (entry) => entry.to === route.to && entry.slug !== route.slug
  )
    .slice(0, 6)
    .map((entry) => ({
      href: `/convert/${entry.slug}`,
      label: `${getFormatOrThrow(entry.from).seoLabel} to ${getFormatOrThrow(entry.to).seoLabel}`,
    }))

  const supportingTools: ConverterLink[] = Array.from(
    new Map(
      [
        { href: getCanonicalToolHref(route), label: "Open the canonical tool" },
        { href: "/file-converters", label: "Browse file converters" },
        { href: "/tools/jpg-to-pdf", label: "Use JPG to PDF" },
        { href: "/tools/convert-pdf", label: "Use Convert PDF" },
        { href: "/tools/pdf-to-word", label: "Use PDF to Word" },
        { href: "/tools/html-to-pdf", label: "Use HTML to PDF" },
      ].map((item) => [item.href, item])
    ).values()
  ).slice(0, 6)

  return { sameInput, sameOutput, supportingTools }
}

export function getFileConverterPage(conversion: string): FileConverterSeoPage | null {
  const route = FILE_CONVERTER_ROUTE_MAP.get(conversion)
  if (!route) return null

  const from = getFormatOrThrow(route.from)
  const to = getFormatOrThrow(route.to)
  const title = `${from.seoLabel} to ${to.seoLabel} Converter`
  const path = `/convert/${route.slug}`

  return {
    slug: route.slug,
    path,
    title,
    h1: title,
    metaTitle: `${from.seoLabel} to ${to.seoLabel} Converter Free Online | Plain Tools`,
    metaDescription: buildConverterDescription(from, to),
    introParagraphs: [
      `Use this ${from.seoLabel} to ${to.seoLabel} converter when you need a direct, privacy-first route from ${from.longLabel} to ${to.longLabel}. The page is built for programmatic search intent, but it does real work: it embeds a live conversion tool, explains what changes between formats, and links to the next relevant tools instead of trapping the user in a generic landing page.`,
      `Plain Tools keeps the positioning explicit across the entire file-converter system: no upload for the core workflow, browser-only processing where supported, and realistic caveats when a file format depends on native browser decoding. That makes this route useful for both users and search engines. A visitor searching for “${route.slug} converter” gets an immediate tool plus context, not just a headline and affiliate links.`,
    ],
    sections: buildSections(route, from, to),
    faq: buildFaq(from, to),
    steps: buildSteps(from, to),
    embed: route.embed,
    from,
    to,
    canonicalToolHref: getCanonicalToolHref(route),
    relatedConverters: buildRelatedConverters(route),
  }
}

export function generateFileConverterStaticParams(): ConverterRouteParams[] {
  return FILE_CONVERTER_ROUTE_DEFINITIONS.map((route) => ({ conversion: route.slug }))
}

export function getFileConverterSitemapPaths() {
  return FILE_CONVERTER_ROUTE_DEFINITIONS.map((route) => `/convert/${route.slug}`)
}

export function getFileConverterManifest() {
  return FILE_CONVERTER_ROUTE_DEFINITIONS.map((route) => {
    const page = getFileConverterPage(route.slug)
    if (!page) {
      throw new Error(`Missing file converter page for ${route.slug}`)
    }

    return {
      canonicalToolHref: page.canonicalToolHref,
      description: page.metaDescription,
      embed: page.embed.kind === "tool" ? page.embed.toolSlug : page.embed.kind,
      slug: page.slug,
      title: page.metaTitle,
      url: page.path,
    }
  })
}

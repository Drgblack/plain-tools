import {
  getConverterPairPage,
  getConverterPairs,
  type ConverterEmbed,
  type ConverterFormat,
  type ConverterPairPage,
} from "@/lib/converter-pairs"

export type ConverterModifierRouteParams = {
  from: string
  modifier: string
  to: string
}

type ModifierDefinition = {
  descAngle: string
  headline: string
  keyword: string
  longTail: string
  reviewFocus: string
  slug: string
}

export type ConverterModifierEntry = {
  desc: string
  from: string
  keywords: string[]
  modifier: string
  title: string
  to: string
}

export type ConverterModifierPage = ConverterModifierEntry & {
  breadcrumbs: Array<{ href?: string; label: string }>
  canonicalPath: string
  description: string
  embed: ConverterEmbed
  faq: Array<{ answer: string; question: string }>
  featureList: string[]
  fromFormat: ConverterFormat
  h1: string
  heroBadges: string[]
  howToSteps: Array<{ name: string; text: string }>
  intro: string[]
  liveToolDescription: string
  privacyNote: string[]
  proxyPage: ConverterPairPage
  relatedLinks: Array<{ href: string; title: string }>
  sections: Array<{ paragraphs: string[]; title: string }>
  slug: string
  toFormat: ConverterFormat
  wordCount: number
}

const MODIFIERS: ModifierDefinition[] = [
  { slug: "windows", headline: "for Windows", keyword: "windows", longTail: "when compatibility or app support is the real blocker", descAngle: "Local conversion removes the usual upload friction when the source file will not open cleanly on Windows.", reviewFocus: "whether the output opens in the Windows app or upload field that caused the problem" },
  { slug: "mac", headline: "for Mac", keyword: "mac", longTail: "when the task starts on macOS and needs a clean browser-first path", descAngle: "The page is tuned for users who want the job done on Mac without bouncing through a cloud converter.", reviewFocus: "preview quality, Finder-ready output, and whether the result opens cleanly in the next Mac workflow" },
  { slug: "iphone", headline: "on iPhone", keyword: "iphone", longTail: "when the file begins on a phone and needs a quick no-upload conversion", descAngle: "Mobile file conversion is usually a trust problem as much as a format problem, so the route keeps the workflow browser-first.", reviewFocus: "whether the output is easy to preview, download, and send from the device" },
  { slug: "android", headline: "on Android", keyword: "android", longTail: "when the source file lives on Android and needs a browser-based handoff", descAngle: "Android workflows benefit from staying local because the file is often moving between apps, downloads, and chat attachments.", reviewFocus: "whether the result saves correctly and survives the next Android share step" },
  { slug: "offline", headline: "Offline", keyword: "offline", longTail: "when privacy or connectivity means the task should stay entirely local", descAngle: "Offline-style positioning matters because many users are trying to avoid both uploads and flaky connections.", reviewFocus: "whether the browser can complete the conversion locally and produce a usable file without another service" },
  { slug: "secure", headline: "Securely", keyword: "secure", longTail: "when the file contains material you do not want to upload just to change the format", descAngle: "The route emphasizes secure local processing because the document may be confidential even if the conversion itself is simple.", reviewFocus: "whether the result is ready to share without exposing the original to unnecessary systems" },
  { slug: "no-upload", headline: "with No Upload", keyword: "no upload", longTail: "when the conversion should stay entirely inside the browser instead of another upload queue", descAngle: "This page leans into the strongest privacy-first message on Plain Tools: the core conversion path stays local in your browser.", reviewFocus: "whether the result is usable without handing the original file to another hosted converter first" },
  { slug: "private-sharing", headline: "for Private Sharing", keyword: "private sharing", longTail: "when the result will be shared but the source should not be exposed to more systems than necessary", descAngle: "Private-sharing queries usually come from people handling screenshots, drafts, contracts, or media assets that should not leave the device just to change format.", reviewFocus: "whether the converted file is safe and polished enough for the next recipient without another handoff" },
  { slug: "offline-no-upload", headline: "Offline & No Upload", keyword: "offline no upload", longTail: "when the conversion needs to finish locally without network dependency or a hosted processing step", descAngle: "This route exists for users who want the most explicit local-processing promise possible: browser-first, no upload, and no dependency on a third-party queue.", reviewFocus: "whether the browser can finish the job locally and produce a result that is ready for the next workflow immediately" },
  { slug: "for-email", headline: "for Email", keyword: "for email", longTail: "when the output has to be light enough and compatible enough to send immediately", descAngle: "Email-driven conversions usually need both compatibility and lower file friction, not just a format change.", reviewFocus: "whether the output is small enough, opens everywhere, and is actually ready to send" },
  { slug: "batch", headline: "in Batch", keyword: "batch", longTail: "when the same conversion needs to be repeated across several files", descAngle: "Batch-style pages matter because teams often solve the format problem once, then need a repeatable local workflow.", reviewFocus: "whether the output stays consistent across the full set instead of only the first file" },
]

const MODIFIER_MAP = new Map(MODIFIERS.map((modifier) => [modifier.slug, modifier]))

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

function pathFor(from: string, to: string, modifier: string) {
  return `/convert/${from}-to-${to}/${modifier}`
}

function entryFromPair(pair: ConverterPairPage, modifier: ModifierDefinition): ConverterModifierEntry {
  return {
    desc: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} conversion ${modifier.longTail}. ${modifier.descAngle} Plain Tools keeps the core path local in your browser with no upload.`,
    from: pair.from,
    keywords: [
      `convert ${pair.from} to ${pair.to} ${modifier.keyword}`,
      `${pair.from} to ${pair.to} converter ${modifier.keyword}`,
      `${pair.fromFormat.seoLabel.toLowerCase()} to ${pair.toFormat.seoLabel.toLowerCase()} no upload`,
      "local browser converter",
    ],
    modifier: modifier.slug,
    title: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} Converter ${modifier.headline} – No Upload, Local | Plain Tools`,
    to: pair.to,
  }
}

const BASE_PAIR_PAGES = getConverterPairs().map((pair) => {
  const page = getConverterPairPage(pair.from, pair.to)
  if (!page) {
    throw new Error(`Missing converter pair for modifier matrix: ${pair.from}->${pair.to}`)
  }
  return page
})

export const CONVERTER_MODIFIER_MATRIX = BASE_PAIR_PAGES.flatMap((pair) =>
  MODIFIERS.map((modifier) => entryFromPair(pair, modifier))
)

const MODIFIER_ENTRY_MAP = new Map(
  CONVERTER_MODIFIER_MATRIX.map((entry) => [`${entry.from}->${entry.to}/${entry.modifier}`, entry])
)

function intro(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} conversion ${modifier.longTail}. That is why this route does not behave like a generic converter directory. It starts from the exact compatibility problem, then keeps the core fix inside the browser so the file does not need to leave your device first.`,
    `${modifier.descAngle} Plain Tools treats that as a workflow requirement rather than a marketing line. The live tool is embedded directly on the page, the file stays local for the core path, and the supporting copy explains what to verify before you trust the converted output.`,
  ]
}

function why(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    `Searches like ${pair.from}-${pair.to} ${modifier.slug} tend to come from people who already know the source format is getting in the way. They are not asking for file-conversion theory. They are asking for a route that fits the real device, sharing method, or privacy requirement behind the query.`,
    `That is why this page narrows the advice around ${modifier.keyword}. The point is to help the user finish the job with fewer steps and fewer trust assumptions while still reviewing ${modifier.reviewFocus}.`,
  ]
}

function how(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    `Open the live ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} converter below with the real source file. The preferred Plain Tools flow keeps the conversion local in the browser, so there is no upload queue between the input and the output on the main path.`,
    `That local workflow matters most when the next step is time-sensitive or privacy-sensitive. For this ${modifier.keyword} page, the check is simple: review ${modifier.reviewFocus}. If the result is still not right, move into the related links instead of handing the same file to another converter site.`,
  ]
}

function steps(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    { name: "Choose the real source file", text: `Start with the ${pair.fromFormat.seoLabel} file that is actually blocking your next workflow, not a throwaway sample.` },
    { name: `Run the ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} conversion locally`, text: `Use the embedded workspace so the core transformation stays on-device while you solve the ${modifier.keyword} constraint.` },
    { name: "Review the converted output carefully", text: `Check ${modifier.reviewFocus}. The route is only useful if the next app, device, or recipient can really use the result.` },
    { name: "Continue into the next local tool only if needed", text: "If you still need a PDF variant, compression pass, or adjacent converter, use the internal links instead of returning to search." },
  ]
}

function sections(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    {
      title: `Why this ${modifier.keyword} variant exists`,
      paragraphs: [
        `Generic converter pages rarely speak to the actual reason a search happens. This one does. The user is usually dealing with a concrete blocker: device compatibility, privacy, email readiness, or a repeated conversion batch.`,
        `That is why the page leads with ${modifier.keyword} intent rather than burying it in one sentence. The conversion itself is the same base task, but the surrounding advice and review standards are different.`,
      ],
    },
    {
      title: `What changes after converting ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel}`,
      paragraphs: [
        `${pair.toFormat.seoLabel} is not just a new extension. It changes how easily the file opens, how it compresses, how it travels through email and portals, and how much editing flexibility remains after the conversion.`,
        `Those differences matter more on a page like this because the modifier is telling us what the real blocker is. This route exists to make that blocker easier to solve without adding upload risk.`,
      ],
    },
    {
      title: "How to keep the workflow privacy-first",
      paragraphs: [
        `Files never leave your device for the core workflow on this route. That matters because even a routine conversion can involve invoices, screenshots, internal docs, contracts, or review copies that do not belong on a random third-party upload queue.`,
        `The safer default is to convert locally, inspect locally, and only then decide whether the output is ready for the next handoff.`,
      ],
    },
  ]
}

function privacy() {
  return [
    "Plain Tools is explicit about the trust model here: 100% local browser processing for the core conversion path, no upload, and no account requirement before the file changes format.",
    "That privacy angle is especially important on converter pages because the document may be sensitive even when the task itself looks simple from the outside.",
  ]
}

function faq(pair: ConverterPairPage, modifier: ModifierDefinition) {
  return [
    { question: `Can I convert ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} ${modifier.keyword} without uploading the file?`, answer: "Yes. This route is built around local browser processing where supported, so the preferred path does not require uploading the file to Plain Tools servers." },
    { question: `Why does this page focus on ${modifier.keyword}?`, answer: `Because that is usually the real blocker behind the query. The conversion task is the same, but the surrounding advice and review criteria change when the user is solving for ${modifier.keyword}.` },
    { question: "What should I review after converting?", answer: `Review ${modifier.reviewFocus}. A successful download is not enough if the next workflow still rejects the output.` },
    { question: "Does Plain Tools store the converted file?", answer: "No. The core route is local browser processing, so the file stays on your device during the main conversion path." },
    { question: "Why are there so many internal links on this page?", answer: "Because conversion workflows branch naturally. Users often need a second output format, a PDF step, or a comparison page immediately after the first conversion." },
    { question: "What if the browser cannot read my file?", answer: "That usually means the exact source variant is not supported locally in the current environment. Try a more compatible browser or a simpler intermediate format such as JPG, PNG, or PDF." },
  ]
}

function relatedLinks(pair: ConverterPairPage, modifier: ModifierDefinition) {
  const siblingModifiers = MODIFIERS.filter((entry) => entry.slug !== modifier.slug)
    .slice(0, 4)
    .map((entry) => ({
      href: pathFor(pair.from, pair.to, entry.slug),
      title: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} ${entry.headline}`,
    }))

  const support = [
    { href: pair.canonicalPath, title: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} base page` },
    ...pair.relatedLinks.slice(0, 4),
    { href: "/compare/plain-tools-vs-smallpdf", title: "Compare privacy-first PDF alternatives" },
  ]

  return [...siblingModifiers, ...support]
    .filter((link, index, links) => links.findIndex((entry) => entry.href === link.href) === index)
    .slice(0, 10)
}

export function getConverterModifierPage(from: string, to: string, modifierSlug: string): ConverterModifierPage | null {
  const pair = getConverterPairPage(from, to)
  const modifier = MODIFIER_MAP.get(modifierSlug)
  const entry = MODIFIER_ENTRY_MAP.get(`${from.toLowerCase()}->${to.toLowerCase()}/${modifierSlug.toLowerCase()}`)
  if (!pair || !modifier || !entry) return null

  const introCopy = intro(pair, modifier)
  const whyCopy = why(pair, modifier)
  const howCopy = how(pair, modifier)
  const stepCopy = steps(pair, modifier)
  const sectionCopy = sections(pair, modifier)
  const privacyCopy = privacy()
  const faqCopy = faq(pair, modifier)
  const canonicalPath = pathFor(pair.from, pair.to, modifier.slug)
  const wordCount = countWords([
    entry.title,
    entry.desc,
    ...introCopy,
    ...whyCopy,
    ...howCopy,
    ...stepCopy.flatMap((step) => [step.name, step.text]),
    ...sectionCopy.flatMap((section) => [section.title, ...section.paragraphs]),
    ...privacyCopy,
    ...faqCopy.flatMap((item) => [item.question, item.answer]),
  ])

  if (wordCount < 800) {
    throw new Error(`Converter modifier page ${canonicalPath} is below 800 words (${wordCount}).`)
  }

  return {
    ...entry,
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/file-converters", label: "File Converters" },
      { href: pair.canonicalPath, label: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel}` },
      { label: modifier.headline },
    ],
    canonicalPath,
    description: entry.desc,
    embed: pair.embed,
    faq: faqCopy,
    featureList: [
      `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} conversion ${modifier.keyword}`,
      "100% local browser processing for the core conversion path",
      "No upload and task-specific review guidance",
      "Internal links into sibling modifiers, converters, and PDF tools",
    ],
    fromFormat: pair.fromFormat,
    h1: `${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} Converter ${modifier.headline}`,
    heroBadges: ["100% local", "no upload", "privacy-first", modifier.keyword],
    howToSteps: stepCopy,
    intro: introCopy,
    liveToolDescription: `Run the ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} converter below with a ${modifier.keyword} workflow in mind. The core path stays local in the browser, so the file remains on your device during processing.`,
    privacyNote: privacyCopy,
    proxyPage: pair,
    relatedLinks: relatedLinks(pair, modifier),
    sections: [
      { title: `Why ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} ${modifier.keyword} matters`, paragraphs: whyCopy },
      { title: `How the local ${pair.fromFormat.seoLabel} to ${pair.toFormat.seoLabel} workflow works`, paragraphs: howCopy },
      ...sectionCopy,
    ],
    slug: `${pair.slug}-${modifier.slug}`,
    toFormat: pair.toFormat,
    wordCount,
  }
}

export function generateAllConverterModifierParams(limit?: number): ConverterModifierRouteParams[] {
  const entries = typeof limit === "number" ? CONVERTER_MODIFIER_MATRIX.slice(0, limit) : CONVERTER_MODIFIER_MATRIX
  return entries.map((entry) => ({ from: entry.from, modifier: entry.modifier, to: entry.to }))
}

export function getConverterModifierSitemapPaths() {
  return CONVERTER_MODIFIER_MATRIX.map((entry) => pathFor(entry.from, entry.to, entry.modifier))
}

export function getRelatedConverterModifierLinks(from: string, to: string, modifier: string) {
  return getConverterModifierPage(from, to, modifier)?.relatedLinks ?? []
}

export const CONVERTER_MODIFIER_METADATA_EXAMPLES = [
  getConverterModifierPage("heic", "jpg", "windows"),
  getConverterModifierPage("pdf", "word", "secure"),
  getConverterModifierPage("png", "pdf", "for-email"),
].filter((entry): entry is ConverterModifierPage => Boolean(entry)).map((entry) => ({
  description: entry.description,
  path: entry.canonicalPath,
  title: entry.title,
}))

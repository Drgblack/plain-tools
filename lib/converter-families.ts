import type { ToolDefinition } from "@/lib/tools-catalogue"

import {
  type ConverterEmbed,
  type ConverterFaq,
  type ConverterFormat,
  type ConverterPairPage,
  type ConverterRouteParams,
  type ConverterSection,
  type ConverterStep,
  generateAllConverterParams as generateBaseConverterParams,
  getConverterPairPage as getBaseConverterPairPage,
  getConverterSitemapPaths as getBaseConverterSitemapPaths,
  getRelatedConverterLinks as getBaseRelatedConverterLinks,
} from "@/lib/converter-pairs"
import {
  type ConverterModifierPage,
  type ConverterModifierRouteParams,
  generateAllConverterModifierParams as generateBaseModifierParams,
  getConverterModifierPage as getBaseConverterModifierPage,
  getConverterModifierSitemapPaths as getBaseModifierSitemapPaths,
  getRelatedConverterModifierLinks as getBaseRelatedModifierLinks,
} from "@/lib/converter-modifiers"

type FamilyFormat = ConverterFormat & {
  family: "archive" | "audio" | "ebook" | "subtitle" | "video"
}

type ModifierSeed = {
  desc: string
  headline: string
  keyword: string
  review: string
  slug: string
}

const EXTENDED_CONVERTER_TOOL: ToolDefinition = {
  available: true,
  category: "File Tools",
  description: "Privacy-first browser file conversion routes with no upload for the core workflow.",
  id: "extended-file-converter",
  name: "File Converter",
  slug: "file-converters",
}

function countWords(values: string[]) {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length
}

const EXTENDED_FORMATS: FamilyFormat[] = [
  { family: "audio", slug: "mp3", seoLabel: "MP3", longLabel: "MP3 audio", problem: "MP3 is portable, but some edit or archive workflows still require a different audio container.", category: "audio" },
  { family: "audio", slug: "wav", seoLabel: "WAV", longLabel: "WAV audio", problem: "WAV is high quality, but the files are heavy and awkward to share quickly.", category: "audio" },
  { family: "audio", slug: "m4a", seoLabel: "M4A", longLabel: "M4A audio", problem: "M4A is efficient, but some editors and uploaders still expect MP3 or WAV.", category: "audio" },
  { family: "audio", slug: "flac", seoLabel: "FLAC", longLabel: "FLAC audio", problem: "FLAC preserves quality, but compatibility is weaker than MP3 in many everyday workflows.", category: "audio" },
  { family: "audio", slug: "ogg", seoLabel: "OGG", longLabel: "OGG audio", problem: "OGG is efficient, but app and uploader support is inconsistent compared with MP3.", category: "audio" },
  { family: "video", slug: "mp4", seoLabel: "MP4", longLabel: "MP4 video", problem: "MP4 is common, but source files still need reshaping for older players or browser workflows.", category: "video" },
  { family: "video", slug: "mov", seoLabel: "MOV", longLabel: "MOV video", problem: "MOV works well on Apple devices, but cross-platform compatibility is weaker than MP4.", category: "video" },
  { family: "video", slug: "webm", seoLabel: "WEBM", longLabel: "WEBM video", problem: "WEBM is browser-friendly, but some teams still need MP4 or MOV outputs for sharing.", category: "video" },
  { family: "video", slug: "avi", seoLabel: "AVI", longLabel: "AVI video", problem: "AVI lingers in older workflows, but the files are bulky and awkward for modern web use.", category: "video" },
  { family: "video", slug: "mkv", seoLabel: "MKV", longLabel: "MKV video", problem: "MKV is flexible, but many uploaders and devices still expect MP4 or MOV.", category: "video" },
  { family: "archive", slug: "zip", seoLabel: "ZIP", longLabel: "ZIP archive", problem: "ZIP is standard, but incoming archives are not always in the format the next system expects.", category: "archive" },
  { family: "archive", slug: "rar", seoLabel: "RAR", longLabel: "RAR archive", problem: "RAR is common, but users often need ZIP or TAR for broader compatibility.", category: "archive" },
  { family: "archive", slug: "7z", seoLabel: "7Z", longLabel: "7Z archive", problem: "7Z compresses well, but not every endpoint or device opens it cleanly.", category: "archive" },
  { family: "archive", slug: "tar", seoLabel: "TAR", longLabel: "TAR archive", problem: "TAR is useful in developer and Linux workflows, but less friendly for general recipients.", category: "archive" },
  { family: "archive", slug: "gz", seoLabel: "GZ", longLabel: "GZ archive", problem: "GZ is efficient for packaged files, but everyday users often need ZIP instead.", category: "archive" },
  { family: "ebook", slug: "epub", seoLabel: "EPUB", longLabel: "EPUB ebook", problem: "EPUB is portable, but some devices and storefronts still demand a different ebook output.", category: "ebook" },
  { family: "ebook", slug: "mobi", seoLabel: "MOBI", longLabel: "MOBI ebook", problem: "MOBI persists in older Kindle workflows, but many teams now need EPUB or AZW3.", category: "ebook" },
  { family: "ebook", slug: "azw3", seoLabel: "AZW3", longLabel: "AZW3 ebook", problem: "AZW3 fits Kindle workflows, but it is less universal than EPUB outside that ecosystem.", category: "ebook" },
  { family: "ebook", slug: "fb2", seoLabel: "FB2", longLabel: "FB2 ebook", problem: "FB2 appears in niche reading workflows, but compatibility is weak elsewhere.", category: "ebook" },
  { family: "ebook", slug: "cbz", seoLabel: "CBZ", longLabel: "CBZ comic archive", problem: "CBZ is useful for comic workflows, but some readers and uploaders still expect EPUB or PDF-adjacent packaging.", category: "ebook" },
  { family: "subtitle", slug: "srt", seoLabel: "SRT", longLabel: "SRT subtitle file", problem: "SRT is common, but different video platforms still expect other subtitle formats.", category: "subtitle" },
  { family: "subtitle", slug: "vtt", seoLabel: "VTT", longLabel: "VTT subtitle file", problem: "VTT is browser-friendly, but some legacy tools still ask for SRT or ASS.", category: "subtitle" },
  { family: "subtitle", slug: "ass", seoLabel: "ASS", longLabel: "ASS subtitle file", problem: "ASS supports richer styling, but the next workflow may only accept simpler subtitle files.", category: "subtitle" },
  { family: "subtitle", slug: "sbv", seoLabel: "SBV", longLabel: "SBV subtitle file", problem: "SBV shows up in creator workflows, but support is not as broad as SRT or VTT.", category: "subtitle" },
  { family: "subtitle", slug: "ttml", seoLabel: "TTML", longLabel: "TTML subtitle file", problem: "TTML is structured and powerful, but it is not the easiest format for everyday tools and uploads.", category: "subtitle" },
]

const EXTENDED_MODIFIERS: ModifierSeed[] = [
  { slug: "windows", headline: "for Windows", keyword: "windows", desc: "when the compatibility problem shows up on a Windows workflow", review: "whether the converted file opens cleanly in the next Windows app or upload flow" },
  { slug: "mac", headline: "for Mac", keyword: "mac", desc: "when the file starts on macOS and needs a browser-first path", review: "preview quality, Finder-ready output, and whether the file behaves cleanly on Mac" },
  { slug: "iphone", headline: "on iPhone", keyword: "iphone", desc: "when the file begins on a phone and needs a quick no-upload conversion", review: "whether the output previews, saves, and shares cleanly from the device" },
  { slug: "android", headline: "on Android", keyword: "android", desc: "when the source lives on Android and needs a browser-based handoff", review: "whether the output survives the next Android share step without friction" },
  { slug: "offline", headline: "Offline", keyword: "offline", desc: "when privacy or connectivity means the task should stay entirely local", review: "whether the browser can finish the conversion locally without another service" },
  { slug: "secure", headline: "Securely", keyword: "secure", desc: "when the source file should not be uploaded just to change format", review: "whether the result is ready to share without unnecessary exposure of the original" },
  { slug: "for-email", headline: "for Email", keyword: "for email", desc: "when the output has to be more portable and easier to send immediately", review: "whether the output is small enough, compatible enough, and actually ready to send" },
  { slug: "batch", headline: "in Batch", keyword: "batch", desc: "when the same conversion needs to repeat across several files", review: "whether the output stays consistent across the full set instead of only the first file" },
  { slug: "legal", headline: "for Legal Teams", keyword: "legal", desc: "when the file belongs to a legal or evidence-handling workflow", review: "whether the output is clear enough for counsel, reviewers, or evidence packets" },
  { slug: "finance", headline: "for Finance Teams", keyword: "finance", desc: "when the file belongs to reporting, statement, or approval work", review: "whether the result is acceptable for approvals, statements, or supporting packs" },
  { slug: "education", headline: "for Education Teams", keyword: "education", desc: "when the file belongs to student, board, or admin workflows", review: "whether the output is clear enough for staff, students, or committee review" },
]

const FORMAT_MAP = new Map(EXTENDED_FORMATS.map((format) => [format.slug, format]))
const MODIFIER_MAP = new Map(EXTENDED_MODIFIERS.map((modifier) => [modifier.slug, modifier]))

const EXTENDED_PAIR_MATRIX = EXTENDED_FORMATS.flatMap((fromFormat) =>
  EXTENDED_FORMATS.filter(
    (toFormat) => toFormat.family === fromFormat.family && toFormat.slug !== fromFormat.slug
  ).map((toFormat) => ({ fromFormat, toFormat }))
)

const EXTENDED_MODIFIER_MATRIX = EXTENDED_PAIR_MATRIX.flatMap((pair) =>
  EXTENDED_MODIFIERS.map((modifier) => ({ ...pair, modifier }))
)

function pairPath(from: string, to: string) {
  return `/convert/${from}-to-${to}`
}

function modifierPath(from: string, to: string, modifier: string) {
  return `/convert/${from}-to-${to}/${modifier}`
}

function buildRelatedLinks(fromFormat: FamilyFormat, toFormat: FamilyFormat) {
  const siblings = EXTENDED_FORMATS.filter(
    (format) => format.family === fromFormat.family && format.slug !== toFormat.slug && format.slug !== fromFormat.slug
  )
    .slice(0, 4)
    .map((format) => ({
      href: pairPath(fromFormat.slug, format.slug),
      title: `${fromFormat.seoLabel} to ${format.seoLabel} converter`,
    }))

  return [
    ...siblings,
    { href: "/file-converters", title: "Browse file converters" },
    { href: "/pdf-tools", title: "Browse PDF tools" },
    { href: "/compare/plain-tools-vs-smallpdf", title: "Compare privacy-first PDF alternatives" },
    { href: "/guides/legal/compress-shared-pdfs", title: "Professional privacy-first workflows" },
  ]
}

function buildPairPage(fromFormat: FamilyFormat, toFormat: FamilyFormat): ConverterPairPage {
  const title = `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter – Free, No Upload, Local | Plain Tools`
  const description = `Convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} with a privacy-first browser workflow on Plain Tools. Files stay local for the core conversion path and no upload is required.`
  const intro = [
    `${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion becomes useful when the real blocker is compatibility, portability, or the next upload rule rather than the source file itself.`,
    `${fromFormat.problem} ${toFormat.seoLabel} is usually the next format users try because it fits a wider range of devices, workflows, or sharing methods.`,
    "Plain Tools positions this route around local browser processing, no upload, and a clearer trust story than generic converter farms.",
    `That matters because files in ${fromFormat.family} workflows are often reused several times after the initial conversion. A useful page should explain not only how to get the output, but why the target format is operationally better for the next step.`,
    "It should also help the user avoid pointless format churn. If the page cannot explain when the target format is actually the better destination, it is not doing enough work to deserve the query.",
  ]
  const sections: ConverterSection[] = [
    { title: "Why this pair exists", paragraphs: [`${fromFormat.longLabel} and ${toFormat.longLabel} solve different workflow problems. Searchers land on this route when the source is getting in the way of the next device, editor, uploader, or teammate.`, "That is why the page is built as an exact long-tail route rather than a vague file-conversion directory entry."] },
    { title: "How the local workflow works", paragraphs: ["Open the live converter below and run the file through a browser-first flow. For the core route, Plain Tools treats local processing as the default trust position.", "That matters because users often care about privacy and speed at the same time. They want the new format without creating another upload dependency."] },
    { title: "What to review after converting", paragraphs: [`A successful conversion is only useful if the output behaves better than the source. Review readability, compatibility, and whether ${toFormat.seoLabel} is really the format the next workflow expects.`, "That review step is what turns the page into a usable task route instead of a thin converter stub."] },
    { title: "Why exact-match converter pages scale safely", paragraphs: ["Long-tail converter pages work when the source/target pair is real, the workflow guidance is specific, and the page includes the next relevant internal links. That is the bar Plain Tools is trying to meet here.", "The local-processing angle also creates a clearer product difference than generic converter directories that rely on upload-first messaging."] },
    { title: "Why the no-upload positioning matters", paragraphs: ["A conversion route can still be commercially valuable without acting like a black box. In fact, the page becomes more trustworthy when it is explicit that the core file handling stays in the browser instead of disappearing into a remote queue.", "That matters for team files, media assets, archived records, and packaged content where the user may not want another third party touching the source file just to change the container or extension."] },
    { title: "How this route fits a broader tool stack", paragraphs: ["A realistic converter page does not pretend the workflow ends after one format change. Users often still need compression, PDF packaging, or a second compatibility pass after the first successful output.", "That is why the page links deliberately into adjacent converter and PDF routes. Strong internal linking turns a one-step utility into a usable task path instead of an orphan page."] },
  ]
  const howToSteps: ConverterStep[] = [
    { name: "Choose the real source file", text: `Start with the ${fromFormat.seoLabel} file that is actually blocking the next workflow.` },
    { name: "Run the local conversion", text: `Use the embedded ${fromFormat.seoLabel} to ${toFormat.seoLabel} workspace so the core conversion stays browser-first and privacy-aware.` },
    { name: "Review the output format", text: `Check whether ${toFormat.seoLabel} really solves the compatibility or sharing problem that caused the search.` },
    { name: "Continue into the next tool only if needed", text: "If the file still needs compression, PDF cleanup, or another conversion, follow the internal links instead of starting from search again." },
  ]
  const faq: ConverterFaq[] = [
    { question: `Can I convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} without uploading the file?`, answer: "Yes. This route is designed around a local browser workflow for the core conversion path on Plain Tools." },
    { question: `Why would I convert ${fromFormat.seoLabel} to ${toFormat.seoLabel}?`, answer: `Usually because ${fromFormat.seoLabel} is getting in the way and ${toFormat.seoLabel} is more practical for the next device, tool, or recipient.` },
    { question: "What should I review after conversion?", answer: "Review readability, file behavior, and whether the target format actually matches the next workflow requirement." },
    { question: "Does Plain Tools store the file?", answer: "No. The intended route keeps the core file-processing step local in the browser." },
    { question: "Why are there related links on this page?", answer: "Because file-conversion workflows branch naturally into adjacent formats, PDF tasks, and privacy-first comparisons." },
    { question: "Is this better than a generic converter directory?", answer: "It is more useful when the page answers one exact pair well, keeps the processing local, and explains what to review next." },
    { question: "Can I bookmark this exact conversion path?", answer: "Yes. The route is built as a stable canonical page for one exact source and target pair so you can reopen the same workflow later." },
  ]
  const privacyNote = [
    "Plain Tools emphasizes local browser processing for the core route, so the source file stays on your device instead of moving through another upload queue.",
    "That privacy-first positioning matters even on routine converter pages because source files can still contain internal material, drafts, media assets, or packaged records.",
    "The practical advantage is not just privacy language. It is the ability to solve the conversion problem quickly without introducing another account, another storage location, or another system that the team now has to trust.",
    "For teams, that also means fewer explainability gaps. The person running the conversion can say exactly how the file was handled and why the chosen output format made sense for the next step.",
  ]
  const wordCount = countWords([
    title,
    description,
    ...intro,
    ...sections.flatMap((section) => [section.title, ...section.paragraphs]),
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...faq.flatMap((item) => [item.question, item.answer]),
    ...privacyNote,
  ])
  if (wordCount < 900) {
    throw new Error(`Extended converter page ${fromFormat.slug}->${toFormat.slug} is below 900 words (${wordCount}).`)
  }

  return {
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/file-converters", label: "File Converters" },
      { label: `${fromFormat.seoLabel} to ${toFormat.seoLabel}` },
    ],
    canonicalPath: pairPath(fromFormat.slug, toFormat.slug),
    description,
    embed: { kind: "universal" } satisfies ConverterEmbed,
    faq,
    featureList: [`${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion`, "100% local browser processing", "No upload for the core workflow", "Related internal links into converters and PDF tools"],
    from: fromFormat.slug,
    fromFormat,
    h1: `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter`,
    heroBadges: ["100% local", "no upload", "privacy-first", fromFormat.family],
    howToSteps,
    intro,
    keywords: [`convert ${fromFormat.slug} to ${toFormat.slug}`, `${fromFormat.slug} to ${toFormat.slug} converter`, `${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} no upload`, "local browser converter"],
    liveToolDescription: `Run the ${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion below with a local browser workflow and no upload for the core path.`,
    privacyNote,
    proxyTool: EXTENDED_CONVERTER_TOOL,
    relatedLinks: buildRelatedLinks(fromFormat, toFormat),
    sections,
    slug: `${fromFormat.slug}-to-${toFormat.slug}`,
    title,
    to: toFormat.slug,
    toFormat,
    wordCount,
  }
}

function buildModifierPage(
  fromFormat: FamilyFormat,
  toFormat: FamilyFormat,
  modifier: ModifierSeed
): ConverterModifierPage {
  const pair = buildPairPage(fromFormat, toFormat)
  const title = `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter ${modifier.headline} – No Upload, Local | Plain Tools`
  const description = `${fromFormat.seoLabel} to ${toFormat.seoLabel} conversion ${modifier.desc}. Plain Tools keeps the core workflow local in your browser with no upload.`
  const intro = [
    `${fromFormat.seoLabel} to ${toFormat.seoLabel} ${modifier.keyword} searches usually happen when the file is already sitting inside a real workflow and the user needs a faster, safer way to get to the next format.`,
    `That is why this route emphasizes local browser processing and no upload for the core path. The conversion itself matters, but so does the trust model around it.`,
    `The page is tuned to ${modifier.keyword} intent, which means the review guidance changes along with the scenario.`,
    `A good modifier page should also explain how the scenario changes the success criteria. ${modifier.keyword} users are not just converting a file; they are trying to unblock the next step with fewer trust assumptions.`,
    "That extra context is what keeps the page useful enough to rank safely instead of collapsing into a duplicated modifier stub.",
  ]
  const sections = [
    { title: `Why ${modifier.keyword} intent changes the page`, paragraphs: [`${modifier.keyword} is not just a suffix. It usually reveals the real blocker behind the search: device compatibility, privacy, delivery speed, or audience fit.`, "That is why this page leads with the workflow context instead of treating every converter query as identical."] },
    { title: "How the local conversion path works", paragraphs: ["Open the live converter below and keep the file inside a browser-first workflow. For the intended route, Plain Tools does not require an upload for the core processing step.", "That local positioning matters because users are often trying to solve a compatibility problem without creating a new privacy problem."] },
    { title: "What to review after converting", paragraphs: [`Review ${modifier.review}. The file only becomes useful when the next real workflow accepts it without more cleanup.`, "That review layer is especially important on long-tail modifier pages because the user is often closer to a real handoff than someone on a generic converter route."] },
    { title: "Why related internal links matter here", paragraphs: ["Most converter workflows do not stop after one file-format change. Users often need a sibling modifier, a PDF route, or a privacy-first comparison immediately after the first task.", "The page is built to keep that follow-up navigation inside the same task silo instead of sending the user back to search."] },
    { title: "Why local processing is the differentiator", paragraphs: ["Generic modifier pages tend to collapse into duplication unless they reflect a real product difference. On Plain Tools, that difference is the local browser-first workflow and the explicit no-upload positioning for the core task.", "That gives the page a clearer reason to exist in search and a clearer reason to monetize: the user is already comparing convenience, privacy, and workflow fit at the same time."] },
    { title: "How modifier intent changes monetizable value", paragraphs: ["Modifier routes tend to carry better commercial intent than generic converter pages because the user is already narrowing the workflow around a device, department, or privacy constraint. That makes the page more decision-oriented and less disposable.", "It also gives the page more room to explain tradeoffs honestly: what the modifier solves, what still needs review, and which adjacent route should come next if the first output is not enough."] },
  ]
  const howToSteps: ConverterStep[] = [
    { name: "Open the real source file", text: `Start with the ${fromFormat.seoLabel} file that is actually blocked by the ${modifier.keyword} constraint.` },
    { name: "Run the local conversion", text: `Use the live ${fromFormat.seoLabel} to ${toFormat.seoLabel} workspace so the core path stays browser-first and privacy-aware.` },
    { name: "Check the modified workflow fit", text: `Review ${modifier.review} before deciding the new file is ready.` },
    { name: "Move into the next adjacent route if needed", text: "Use the related links for the next converter, PDF, or comparison step instead of restarting the workflow elsewhere." },
  ]
  const faq: ConverterFaq[] = [
    { question: `Can I convert ${fromFormat.seoLabel} to ${toFormat.seoLabel} ${modifier.keyword} without uploading the file?`, answer: "Yes. The route is designed around local browser processing for the core conversion path on Plain Tools." },
    { question: `Why focus on ${modifier.keyword}?`, answer: "Because the modifier usually reflects the real constraint behind the query, and the review criteria change when that scenario changes." },
    { question: "What should I review after converting?", answer: `Review ${modifier.review}. A successful export is not enough if the next workflow still rejects the result.` },
    { question: "Does Plain Tools store the converted file?", answer: "No. The intended route keeps the core conversion path local in the browser." },
    { question: "Why are related links important on converter pages?", answer: "Because converters naturally branch into sibling formats, PDF cleanup, and privacy-first tool comparisons." },
    { question: "What if this format pair still is not enough?", answer: "Open a sibling modifier or related converter route instead of restarting the search from scratch." },
    { question: "Can I reuse this exact modifier route later?", answer: "Yes. The page has a stable canonical URL so the same scenario can be reopened, shared, and benchmarked again." },
  ]
  const privacyNote = [
    "Plain Tools uses a browser-first trust model for the core workflow on this route, so the file stays on your device instead of being sent to another upload-first converter.",
    `That privacy angle is especially relevant ${modifier.desc}. The source file may still contain internal, client, student, or media material that does not need another third-party handoff.`,
    "A privacy-first route also tends to be faster operationally: fewer uploads, fewer waiting steps, and fewer places where the workflow can fail before the result reaches the person who needs it.",
    "That combination of trust and speed is exactly why these long-tail modifier pages are worth building as dedicated canonical routes instead of collapsing them into one generic converter article.",
  ]
  const wordCount = countWords([
    title,
    description,
    ...intro,
    ...sections.flatMap((section) => [section.title, ...section.paragraphs]),
    ...howToSteps.flatMap((step) => [step.name, step.text]),
    ...faq.flatMap((item) => [item.question, item.answer]),
    ...privacyNote,
  ])
  if (wordCount < 900) {
    throw new Error(`Extended converter modifier page ${fromFormat.slug}->${toFormat.slug}/${modifier.slug} is below 900 words (${wordCount}).`)
  }

  return {
    breadcrumbs: [
      { href: "/", label: "Home" },
      { href: "/file-converters", label: "File Converters" },
      { href: pair.canonicalPath, label: `${fromFormat.seoLabel} to ${toFormat.seoLabel}` },
      { label: modifier.headline },
    ],
    canonicalPath: modifierPath(fromFormat.slug, toFormat.slug, modifier.slug),
    description,
    embed: pair.embed,
    faq,
    featureList: [`${fromFormat.seoLabel} to ${toFormat.seoLabel} ${modifier.keyword}`, "100% local browser processing", "No upload for the core workflow", "Related internal links into sibling modifiers and PDF tools"],
    from: fromFormat.slug,
    fromFormat,
    h1: `${fromFormat.seoLabel} to ${toFormat.seoLabel} Converter ${modifier.headline}`,
    heroBadges: ["100% local", "no upload", "privacy-first", modifier.keyword],
    howToSteps,
    intro,
    keywords: [`convert ${fromFormat.slug} to ${toFormat.slug} ${modifier.keyword}`, `${fromFormat.slug} to ${toFormat.slug} converter ${modifier.keyword}`, `${fromFormat.seoLabel.toLowerCase()} to ${toFormat.seoLabel.toLowerCase()} no upload`, "local browser converter"],
    liveToolDescription: `Run the ${fromFormat.seoLabel} to ${toFormat.seoLabel} converter below with a ${modifier.keyword} workflow in mind. The core path stays local in the browser.`,
    modifier: modifier.slug,
    privacyNote,
    proxyPage: pair,
    relatedLinks: [
      ...EXTENDED_MODIFIERS.filter((entry) => entry.slug !== modifier.slug).slice(0, 4).map((entry) => ({
        href: modifierPath(fromFormat.slug, toFormat.slug, entry.slug),
        title: `${fromFormat.seoLabel} to ${toFormat.seoLabel} ${entry.headline}`,
      })),
      { href: pair.canonicalPath, title: `${fromFormat.seoLabel} to ${toFormat.seoLabel} base page` },
      ...pair.relatedLinks.slice(0, 3),
      { href: "/compare/plain-tools-vs-smallpdf", title: "Compare privacy-first PDF alternatives" },
    ],
    sections,
    slug: `${fromFormat.slug}-to-${toFormat.slug}-${modifier.slug}`,
    title,
    to: toFormat.slug,
    toFormat,
    wordCount,
  }
}

function getExtendedFormat(slug: string) {
  return FORMAT_MAP.get(slug)
}

export function getExtendedConverterPairPage(from: string, to: string): ConverterPairPage | null {
  const fromFormat = getExtendedFormat(from.toLowerCase())
  const toFormat = getExtendedFormat(to.toLowerCase())
  if (fromFormat && toFormat && fromFormat.family === toFormat.family && fromFormat.slug !== toFormat.slug) {
    return buildPairPage(fromFormat, toFormat)
  }
  return getBaseConverterPairPage(from, to)
}

export function getExtendedConverterModifierPage(
  from: string,
  to: string,
  modifier: string
): ConverterModifierPage | null {
  const fromFormat = getExtendedFormat(from.toLowerCase())
  const toFormat = getExtendedFormat(to.toLowerCase())
  const modifierSeed = MODIFIER_MAP.get(modifier.toLowerCase())
  if (fromFormat && toFormat && modifierSeed && fromFormat.family === toFormat.family && fromFormat.slug !== toFormat.slug) {
    return buildModifierPage(fromFormat, toFormat, modifierSeed)
  }
  return getBaseConverterModifierPage(from, to, modifier)
}

export function generateAllExtendedConverterParams(limit?: number): ConverterRouteParams[] {
  const extension = EXTENDED_PAIR_MATRIX.map(({ fromFormat, toFormat }) => ({ from: fromFormat.slug, to: toFormat.slug }))
  const base = generateBaseConverterParams().filter(
    (entry) => !FORMAT_MAP.has(entry.from.toLowerCase()) && !FORMAT_MAP.has(entry.to.toLowerCase())
  )
  const combined = [...extension, ...base]
  return typeof limit === "number" ? combined.slice(0, limit) : combined
}

export function generateAllExtendedConverterModifierParams(limit?: number): ConverterModifierRouteParams[] {
  const extension = EXTENDED_MODIFIER_MATRIX.map(({ fromFormat, modifier, toFormat }) => ({
    from: fromFormat.slug,
    modifier: modifier.slug,
    to: toFormat.slug,
  }))
  const base = generateBaseModifierParams().filter(
    (entry) => !FORMAT_MAP.has(entry.from.toLowerCase()) && !FORMAT_MAP.has(entry.to.toLowerCase())
  )
  const combined = [...extension, ...base]
  return typeof limit === "number" ? combined.slice(0, limit) : combined
}

export function getExtendedConverterSitemapPaths() {
  return [
    ...EXTENDED_PAIR_MATRIX.map(({ fromFormat, toFormat }) => pairPath(fromFormat.slug, toFormat.slug)),
    ...getBaseConverterSitemapPaths(),
  ].filter((path, index, paths) => paths.findIndex((entry) => entry === path) === index)
}

export function getExtendedConverterModifierSitemapPaths() {
  return [
    ...EXTENDED_MODIFIER_MATRIX.map(({ fromFormat, modifier, toFormat }) =>
      modifierPath(fromFormat.slug, toFormat.slug, modifier.slug)
    ),
    ...getBaseModifierSitemapPaths(),
  ].filter((path, index, paths) => paths.findIndex((entry) => entry === path) === index)
}

export function getExtendedRelatedConverterLinks(from: string, to: string) {
  return getExtendedConverterPairPage(from, to)?.relatedLinks ?? getBaseRelatedConverterLinks(from, to)
}

export function getExtendedRelatedConverterModifierLinks(from: string, to: string, modifier: string) {
  return getExtendedConverterModifierPage(from, to, modifier)?.relatedLinks ?? getBaseRelatedModifierLinks(from, to, modifier)
}

export const EXTENDED_CONVERTER_METADATA_EXAMPLES = [
  getExtendedConverterPairPage("mp3", "wav"),
  getExtendedConverterPairPage("epub", "mobi"),
  getExtendedConverterPairPage("zip", "7z"),
  getExtendedConverterModifierPage("mp4", "mov", "offline"),
  getExtendedConverterModifierPage("rar", "zip", "legal"),
  getExtendedConverterModifierPage("srt", "vtt", "education"),
]
  .filter((entry): entry is ConverterPairPage | ConverterModifierPage => Boolean(entry))
  .map((entry) => ({
    description: entry.description,
    path: entry.canonicalPath,
    title: entry.title,
  }))

export type { ConverterModifierRouteParams, ConverterRouteParams }

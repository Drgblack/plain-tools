import { getToolBySlug } from "@/lib/tools-catalogue"
import { getToolVariantPage, TOOL_VARIANT_PAGES } from "@/lib/tools-matrix"

export const DIAGNOSIS_REVALIDATE_SECONDS = 86400

export const FILE_TYPE_OPTIONS = ["pdf", "image", "json", "other"] as const
export const MAIN_PROBLEM_OPTIONS = [
  "too-large",
  "wont-open",
  "cant-edit",
  "password-protected",
  "scanned-document",
  "need-merge",
  "need-split",
  "need-convert",
  "other",
] as const
export const DEVICE_OPTIONS = ["mac", "windows", "iphone", "android", "any"] as const
export const GOAL_OPTIONS = ["email", "upload", "whatsapp", "archive", "edit", "print", "other"] as const

export type DiagnosisFileType = (typeof FILE_TYPE_OPTIONS)[number]
export type DiagnosisProblem = (typeof MAIN_PROBLEM_OPTIONS)[number]
export type DiagnosisDevice = (typeof DEVICE_OPTIONS)[number]
export type DiagnosisGoal = (typeof GOAL_OPTIONS)[number]

export type DiagnosisInputs = {
  fileTypes: DiagnosisFileType[]
  problems: DiagnosisProblem[]
  device: DiagnosisDevice
  goals: DiagnosisGoal[]
  freeText: string
}

export type Recommendation = {
  tool: string
  modifier: string
  title: string
  description: string
  url: string
  whyThisHelps: string[]
  privacyNote: string
  score: number
}

type RecommendationSeed = {
  tool: string
  modifiers?: string[]
  title: string
  description: string
  whyThisHelps: string[]
}

type DiagnosisRule = {
  id: string
  label: string
  fileTypes?: DiagnosisFileType[]
  problems?: DiagnosisProblem[]
  devices?: DiagnosisDevice[]
  goals?: DiagnosisGoal[]
  keywords?: string[]
  recommendations: RecommendationSeed[]
}

export const EMPTY_DIAGNOSIS_INPUTS: DiagnosisInputs = {
  fileTypes: [],
  problems: [],
  device: "any",
  goals: [],
  freeText: "",
}

export const DIAGNOSIS_FAQS = [
  {
    question: "Why is my PDF file so big?",
    answer:
      "Large PDFs usually contain scanned pages, heavy images, embedded fonts, or several files merged into one. Compression, splitting, or OCR often solves the real bottleneck.",
  },
  {
    question: "Can I diagnose a PDF problem without uploading the file?",
    answer:
      "Yes. The diagnosis form runs locally in the browser and recommends the best Plain Tools route. Core local tool workflows keep file bytes on your device.",
  },
  {
    question: "What if my PDF will not open?",
    answer:
      "A PDF may fail because it is locked, oversized, damaged, or too heavy for the current viewer. The diagnosis flow helps narrow down which next step is most practical.",
  },
  {
    question: "Is local PDF processing more private?",
    answer:
      "For the core local workflows, yes. Local processing removes the upload step to Plain Tools and keeps the file on your device during the main task.",
  },
  {
    question: "Does Plain Tools store my diagnosis text?",
    answer:
      "No. The free-text explanation is used locally in the browser to rank recommendations. It is not sent to Plain Tools by the diagnosis flow.",
  },
  {
    question: "What if the recommendations are close but not exact?",
    answer:
      "Start with the nearest fit, review the result, and rerun the diagnosis with a clearer description. You can also open a related guide or contact support.",
  },
] as const

export const DIAGNOSIS_POPULAR_VARIANTS = [
  "/tools/compress-pdf/for-email",
  "/tools/compress-pdf/under-1mb",
  "/tools/compress-pdf/no-upload",
  "/tools/merge-pdf/mac",
  "/tools/merge-pdf/offline",
  "/tools/pdf-to-word/no-upload",
  "/tools/pdf-to-word/scanned",
  "/tools/ocr-pdf/scanned",
  "/tools/ocr-pdf/for-records",
  "/tools/fill-pdf/for-forms",
  "/tools/sign-pdf/for-contracts",
  "/tools/jpg-to-pdf/iphone",
] as const

export const DIAGNOSIS_PREFILLED_REDIRECTS = [
  { path: "/why-is-my-pdf-so-large", query: "?fileType=pdf&problem=too-large" },
  { path: "/pdf-wont-open", query: "?fileType=pdf&problem=wont-open" },
  {
    path: "/how-to-compress-pdf-without-upload",
    query: "?fileType=pdf&problem=too-large&goal=upload&q=no%20upload",
  },
  { path: "/pdf-diagnosis", query: "" },
  { path: "/tool-diagnosis", query: "" },
] as const

const DIAGNOSIS_RULES: DiagnosisRule[] = [
  rule("pdf-too-large-email", { fileTypes: ["pdf"], problems: ["too-large"], goals: ["email"] }, [
    rec("compress-pdf", ["for-email"], "Compress PDF for Email - Free and Private", "Built for attachment limits when the file needs to stay readable and local before you send it on.", ["Targets email-friendly output", "Keeps the source file local", "Useful before Gmail or Outlook sending"]),
    rec("compress-pdf", ["under-1mb"], "Compress PDF Under 1 MB", "Best when the email system is strict and you need a smaller working copy rather than another retry.", ["Useful for hard size caps", "Good fallback after normal compression", "Helps with admin attachments"]),
  ]),
  rule("pdf-too-large-upload", { fileTypes: ["pdf"], problems: ["too-large"], goals: ["upload"] }, [
    rec("compress-pdf", ["for-upload", "under-1mb"], "Compress PDF for Upload", "A better fit for forms and portals when the destination rejects the file and you need a smaller, cleaner upload copy.", ["Optimised for portal limits", "Reduces failed submissions", "Keeps the prep step private"]),
    rec("split-pdf", ["for-upload"], "Split PDF for Upload Limits", "Useful when the real issue is page count or bundle size rather than compression alone.", ["Creates smaller submission parts", "Preserves readability", "Helps with multi-part uploads"]),
  ]),
  rule("pdf-too-large-whatsapp", { fileTypes: ["pdf", "image"], problems: ["too-large"], goals: ["whatsapp"] }, [
    rec("compress-pdf", ["for-whatsapp", "for-sharing"], "Compress PDF for WhatsApp", "Useful when the document only needs to be readable on a phone and light enough to share quickly.", ["Designed for messaging flows", "Better for mobile sharing", "Keeps the prep step local"]),
    rec("image-compress", ["for-whatsapp"], "Compress Images for WhatsApp", "If the heavy content is really images, this is often a faster fix than changing the PDF itself.", ["Best for photo-heavy files", "Good for mobile previews", "Useful before rebuilding a PDF"]),
  ]),
  rule("scanned-heavy-pdf", { fileTypes: ["pdf"], problems: ["too-large", "scanned-document"] }, [
    rec("compress-pdf", ["scanned", "large-files"], "Compress Scanned PDF Files", "Scanned PDFs behave like image stacks, so this route focuses on size reduction without making the pages unusable.", ["Handles image-heavy pages better", "Useful for scan-led files", "Good for email or upload prep"]),
    rec("ocr-pdf", ["scanned", "searchable"], "Run OCR on a Scanned PDF", "When the scan is both heavy and hard to work with, OCR often improves the next editing or archive step.", ["Makes scans searchable", "Improves later conversion", "Useful before archiving"]),
  ]),
  rule("pdf-wont-open-password", { fileTypes: ["pdf"], problems: ["wont-open", "password-protected"], keywords: ["password", "locked", "unlock"] }, [
    rec("unlock-pdf", ["password-protected", "quick-fix"], "Unlock a Password-Protected PDF", "The cleanest next step when the file will not open because access protection is blocking the real task.", ["Best for access issues", "Keeps the unlock step local", "Lets you move to edit or review next"]),
    rec("protect-pdf", ["password-protected"], "Re-protect the PDF After Editing", "If you unlock a file to work on it, you may need to add protection back before sharing the final copy.", ["Useful after editing", "Fits contracts and records", "Helps with controlled sharing"]),
  ]),
  rule("pdf-wont-open-general", { fileTypes: ["pdf"], problems: ["wont-open"] }, [
    rec("pdf-to-jpg", ["for-review"], "Convert PDF Pages to JPG for Review", "A practical workaround when the priority is seeing or sharing the content, not repairing the original PDF.", ["Useful for quick inspection", "Good when viewers keep failing", "Creates simple visual copies"]),
    rec("split-pdf", ["large-files", "quick-fix"], "Split the PDF Into Smaller Sections", "Useful when one long or heavy file opens poorly and you need to isolate the problem.", ["Breaks large files into testable parts", "Can isolate damaged sections", "Creates lighter working copies"]),
  ]),
  rule("cant-edit-scanned", { fileTypes: ["pdf"], problems: ["cant-edit", "scanned-document"], goals: ["edit"] }, [
    rec("ocr-pdf", ["scanned", "searchable"], "Make a Scanned PDF Searchable", "The right first move when the document behaves like an image and you need text the browser can actually work with.", ["Turns scans into searchable content", "Improves later editing", "Useful before conversion"]),
    rec("pdf-to-word", ["scanned", "no-upload"], "Convert a Scanned PDF to Word", "Best when the real goal is editing text and not just preserving a scan as-is.", ["Creates an editable copy", "Useful for letters and reports", "Keeps the conversion local"]),
  ]),
  rule("cant-edit-general", { fileTypes: ["pdf"], problems: ["cant-edit"], goals: ["edit"] }, [
    rec("pdf-to-word", ["no-upload", "for-review"], "Convert PDF to Word for Editing", "A strong default when the PDF contains text and the real task is revising content rather than preserving the PDF format.", ["Best for text changes", "Useful for reports and CVs", "Keeps the main workflow private"]),
    rec("fill-pdf", ["for-forms"], "Fill or Update a PDF Form", "Better than full conversion when the document is really a form and only fields need to change.", ["Best for form workflows", "Keeps the layout intact", "Works well before signing"]),
  ]),
  rule("merge-mac", { fileTypes: ["pdf"], problems: ["need-merge"], devices: ["mac"] }, [
    rec("merge-pdf", ["mac", "offline"], "Merge PDF on Mac", "Best when you want a straightforward browser route on macOS without a desktop suite detour.", ["Tailored to the Mac browser workflow", "Avoids software installs", "Useful for packs and annexes"]),
    rec("merge-pdf", ["for-contracts"], "Merge PDFs for Contracts or Records", "Useful when the combined result needs careful ordering and review before it is shared or stored.", ["Better for structured bundles", "Good for annexes and evidence packs", "Encourages output review"]),
  ]),
  rule("merge-windows", { fileTypes: ["pdf"], problems: ["need-merge"], devices: ["windows"] }, [
    rec("merge-pdf", ["windows", "offline"], "Merge PDF on Windows", "A browser-first path for combining files on Windows without moving into a heavier app workflow.", ["Good fit for Edge or Chrome", "Useful for office tasks", "Keeps the merge step local"]),
    rec("merge-pdf", ["for-upload"], "Merge PDF for Submission", "Better when the merge is only a means to a portal upload or client handover.", ["Built around the next step", "Useful for application packs", "Pairs well with compression"]),
  ]),
  rule("split-upload", { fileTypes: ["pdf"], problems: ["need-split"], goals: ["upload"] }, [
    rec("split-pdf", ["for-upload"], "Split PDF for Upload Limits", "Ideal when the destination system prefers smaller sections or rejects one large bundled file.", ["Useful for portals", "Preserves clarity", "Creates separate upload-ready parts"]),
    rec("extract-pdf", ["quick-fix", "for-upload"], "Extract Only the Pages You Need", "Often the cleaner route when the portal only needs a few pages rather than the whole file.", ["Best for selected pages", "Great for IDs and forms", "Creates tighter upload copies"]),
  ]),
  rule("convert-edit-pdf", { fileTypes: ["pdf"], problems: ["need-convert", "cant-edit"], goals: ["edit"] }, [
    rec("pdf-to-word", ["no-upload"], "Convert PDF to Word Without Upload", "The best route when the task is editing text and you want an editable working copy rather than another static PDF.", ["Strong fit for editing", "Useful for office documents", "Keeps the conversion local"]),
    rec("ocr-pdf", ["searchable", "scanned"], "Run OCR First if the PDF Is Image-Based", "Helpful when the PDF looks readable but still behaves like a set of images with no selectable text.", ["Good before conversion", "Improves text extraction", "Useful for scan-led files"]),
  ]),
  rule("fill-form", { fileTypes: ["pdf"], goals: ["edit"], keywords: ["form", "application", "fillable", "fill in"] }, [
    rec("fill-pdf", ["for-forms", "for-review"], "Fill PDF Forms Without Upload", "The best fit when the issue is field entry rather than full document editing.", ["Best for official forms", "Keeps the original layout", "Useful before signing or protecting"]),
    rec("sign-pdf", ["for-forms"], "Sign the Form After Filling It", "A practical follow-up when the document also needs a signature before return or archiving.", ["Completes the form workflow", "Useful for HR and admin", "Keeps signing local too"]),
  ]),
  rule("sign-contract", { fileTypes: ["pdf"], keywords: ["sign", "signature", "contract", "agreement"] }, [
    rec("sign-pdf", ["for-contracts", "securely"], "Sign PDF for Contracts", "Best when the document needs a visible signature and careful local handling before it leaves your device.", ["Built for agreement workflows", "Good before controlled sharing", "Pairs well with protection"]),
    rec("protect-pdf", ["for-contracts", "securely"], "Protect the Signed PDF", "Useful when the signed result should not be freely opened after you send it on.", ["Adds access control", "Useful after signing", "Fits contract and records work"]),
  ]),
  rule("protect-password", { fileTypes: ["pdf"], problems: ["password-protected", "other"], goals: ["email", "upload", "archive"], keywords: ["secure", "protect", "password"] }, [
    rec("protect-pdf", ["password-protected", "for-sharing", "for-archive"], "Protect PDF With a Password", "A practical route when the file is ready and the remaining task is controlled sharing or storage.", ["Adds password protection locally", "Useful before email or archive handoff", "Pairs well with unlock later"]),
  ]),
  rule("json-format", { fileTypes: ["json"], keywords: ["json", "invalid", "format", "beautify", "minify"] }, [
    rec("json-formatter", ["offline", "quick-fix"], "Format and Validate JSON Locally", "The right answer when the problem is malformed or unreadable JSON and you want to keep the payload in-browser.", ["Best for syntax issues", "Useful for developer troubleshooting", "Keeps payloads local"]),
  ]),
  rule("image-too-large", { fileTypes: ["image"], problems: ["too-large"], goals: ["email", "whatsapp", "upload"] }, [
    rec("image-compress", ["for-whatsapp", "for-upload"], "Compress an Image Before Sharing", "Best when the heavy file is really an image and the fix is lighter image output rather than PDF work.", ["Best for JPG and PNG", "Useful for mobile sharing", "Keeps the source image local"]),
    rec("jpg-to-pdf", ["iphone", "for-upload"], "Combine Images Into One PDF", "Useful when several phone images belong together as one cleaner upload or archive document.", ["Great for mobile scans", "Useful for submissions", "Combines separate photos neatly"]),
  ]),
  rule("iphone-to-pdf", { fileTypes: ["image"], devices: ["iphone"], problems: ["need-convert"] }, [
    rec("jpg-to-pdf", ["iphone", "offline"], "JPG to PDF on iPhone", "A mobile-friendly route for turning several phone images into one PDF without an app-install detour.", ["Built for iPhone capture workflows", "Useful for receipts and scans", "Keeps the prep step simple"]),
  ]),
  rule("extract-pages", { fileTypes: ["pdf"], problems: ["need-split", "other"], keywords: ["extract", "selected pages", "just one page", "remove pages"] }, [
    rec("extract-pdf", ["quick-fix", "for-records"], "Extract Pages From a PDF", "Best when you only need a few pages for submission, review, or storage and do not want to rebuild the whole file.", ["Best for selected pages", "Useful for annexes and IDs", "Creates narrower working copies"]),
  ]),
  rule("reorder-pages", { fileTypes: ["pdf"], keywords: ["reorder", "wrong order", "page order", "arrange pages"] }, [
    rec("reorder-pdf", ["for-sharing", "quick-fix"], "Reorder PDF Pages Before Sharing", "The cleanest fix when the content is fine but the page sequence is wrong.", ["Fixes sequence without changing content", "Useful for reports and packs", "Pairs well with merge or compression"]),
  ]),
  rule("compare-versions", { fileTypes: ["pdf"], goals: ["edit", "archive"], keywords: ["compare", "difference", "version", "changed", "revision"] }, [
    rec("compare-pdf", ["for-review", "for-contracts"], "Compare PDF Files Locally", "Best when the real question is what changed between two versions rather than how to edit one file.", ["Best for revision review", "Useful for contracts and policies", "Keeps both files on-device"]),
  ]),
  rule("archive-searchable", { fileTypes: ["pdf"], problems: ["scanned-document", "other"], goals: ["archive"], keywords: ["archive", "records", "searchable"] }, [
    rec("ocr-pdf", ["searchable", "for-records"], "Make PDF Searchable for Archive Use", "Useful when the archive problem is really future retrieval and not immediate editing.", ["Best for record copies", "Improves later retrieval", "Useful for legacy scans"]),
    rec("compress-pdf", ["for-archive", "scanned"], "Compress a PDF for Archive Storage", "Helpful when storage size is part of the records problem after you have a workable copy.", ["Reduces archive size", "Useful after OCR", "Good for large scans"]),
  ]),
  rule("print-copy", { fileTypes: ["pdf", "image"], goals: ["print"] }, [
    rec("rotate-pdf", ["quick-fix"], "Rotate PDF Pages Before Printing", "Best when the print issue is really orientation or sideways pages rather than the content itself.", ["Fixes orientation cleanly", "Useful for scans", "Creates a more print-friendly copy"]),
    rec("compress-pdf", ["for-sharing"], "Create a Lighter Print-Friendly PDF", "Helpful when the file is too heavy for a smooth print workflow on older hardware or shared printers.", ["Lightens heavy print jobs", "Useful for office printers", "Improves performance before printing"]),
  ]),
  rule("no-upload-search", { fileTypes: ["pdf"], keywords: ["no upload", "private", "local", "browser only"] }, [
    rec("compress-pdf", ["no-upload", "free"], "Compress PDF With No Upload", "A good privacy-first starting point when the search is really about trust and not only about size.", ["Speaks directly to the privacy concern", "Useful for sensitive PDFs", "Pairs with Verify Claims"]),
    rec("pdf-to-word", ["no-upload"], "Convert PDF to Word Without Upload", "The stronger follow-up when the private task is editing rather than compression.", ["Good for privacy-conscious editing", "Useful for reports and CVs", "Keeps conversion on-device"]),
  ]),
  rule("general-convert", { fileTypes: ["pdf"], problems: ["need-convert"] }, [
    rec("pdf-to-word", ["no-upload"], "Convert PDF to Word", "The clearest first route when the PDF is text-first and you need an editable document.", ["Best general editing route", "Useful for text-led files", "Keeps the core workflow local"]),
    rec("pdf-to-jpg", ["for-sharing"], "Convert PDF to JPG", "A better fit when the pages only need to be seen or shared visually rather than edited as text.", ["Useful for previews", "Good for slides and screenshots", "Simple visual output"]),
  ]),
  rule("merge-then-compress", { fileTypes: ["pdf"], problems: ["need-merge", "too-large"], goals: ["email", "upload"] }, [
    rec("merge-pdf", ["for-upload"], "Merge the PDFs First", "A cleaner starting point when several files belong together and the final output still needs one more optimisation step.", ["Creates one reviewable working copy", "Useful before final compression", "Reduces submission confusion"]),
    rec("compress-pdf", ["for-upload", "for-email"], "Compress the Combined PDF", "Once the pages are in the right order, compression can target the final file that will actually be sent or uploaded.", ["Targets the final output", "Useful for merged packs", "Keeps the last prep step local"]),
  ]),
  rule("large-sensitive", { fileTypes: ["pdf"], problems: ["too-large", "other"], keywords: ["sensitive", "private", "confidential", "medical", "contract"] }, [
    rec("compress-pdf", ["securely", "no-upload", "large-files"], "Compress a Sensitive PDF Locally", "Best when the document is both heavy and private and you want the first processing step to stay on your own device.", ["Strong fit for sensitive files", "Useful for medical and finance docs", "Keeps the main workflow local"]),
  ]),
]

function rule(id: string, config: Omit<DiagnosisRule, "id" | "label" | "recommendations">, recommendations: RecommendationSeed[]): DiagnosisRule {
  return {
    id,
    label: id.replace(/-/g, " "),
    ...config,
    recommendations,
  }
}

function rec(
  tool: string,
  modifiers: string[] | undefined,
  title: string,
  description: string,
  whyThisHelps: string[]
): RecommendationSeed {
  return { tool, modifiers, title, description, whyThisHelps }
}

function parseListValue<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[]
): T[] {
  const allowedSet = new Set(allowed)
  const values = Array.isArray(value) ? value : value ? [value] : []
  return values
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry): entry is T => allowedSet.has(entry as T))
}

function normaliseFreeText(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.join(" ").trim()
  return value?.trim() ?? ""
}

function detectByKeywords(freeText: string) {
  const lower = freeText.toLowerCase()
  const problems = new Set<DiagnosisProblem>()
  const goals = new Set<DiagnosisGoal>()
  const fileTypes = new Set<DiagnosisFileType>()

  const pairs: Array<[string[], DiagnosisProblem | DiagnosisGoal | DiagnosisFileType]> = [
    [["too large", "too big", "under 1mb", "oversized"], "too-large"],
    [["won't open", "wont open", "cannot open", "corrupt"], "wont-open"],
    [["can't edit", "cannot edit", "editable"], "cant-edit"],
    [["password", "locked", "unlock"], "password-protected"],
    [["scanned", "scan", "ocr"], "scanned-document"],
    [["merge", "combine", "join"], "need-merge"],
    [["split", "extract pages"], "need-split"],
    [["convert", "to word", "to jpg", "to excel"], "need-convert"],
    [["email", "gmail", "outlook", "attachment"], "email"],
    [["upload", "portal", "submission"], "upload"],
    [["whatsapp", "message"], "whatsapp"],
    [["archive", "records"], "archive"],
    [["edit", "revise"], "edit"],
    [["print", "printer"], "print"],
    [["pdf"], "pdf"],
    [["image", "jpg", "jpeg", "png", "photo"], "image"],
    [["json", "payload"], "json"],
  ]

  for (const [needles, value] of pairs) {
    if (!needles.some((needle) => lower.includes(needle))) continue
    if ((MAIN_PROBLEM_OPTIONS as readonly string[]).includes(value)) problems.add(value as DiagnosisProblem)
    if ((GOAL_OPTIONS as readonly string[]).includes(value)) goals.add(value as DiagnosisGoal)
    if ((FILE_TYPE_OPTIONS as readonly string[]).includes(value)) fileTypes.add(value as DiagnosisFileType)
  }

  return { problems, goals, fileTypes }
}

function resolveRecommendation(seed: RecommendationSeed, score: number): Recommendation {
  const variant = seed.modifiers?.map((modifier) => getToolVariantPage(seed.tool, modifier)).find(Boolean) ?? null
  const tool = getToolBySlug(seed.tool)

  return {
    tool: seed.tool,
    modifier: variant?.modifierSlug ?? "core",
    title: seed.title,
    description: seed.description,
    url: variant?.path ?? `/tools/${seed.tool}`,
    whyThisHelps: seed.whyThisHelps,
    privacyNote:
      tool?.category === "Network Tools"
        ? "Runs directly from your browser with no Plain Tools proxy."
        : "100% local for the core workflow, with no file upload to Plain Tools.",
    score,
  }
}

function scoreRule(
  rule: DiagnosisRule,
  inputs: DiagnosisInputs,
  detected: ReturnType<typeof detectByKeywords>
) {
  let score = 0
  let matched = false

  if (rule.fileTypes?.some((item) => inputs.fileTypes.includes(item) || detected.fileTypes.has(item))) {
    score += 3
    matched = true
  }
  if (rule.problems?.some((item) => inputs.problems.includes(item) || detected.problems.has(item))) {
    score += 4
    matched = true
  }
  if (rule.devices?.some((item) => inputs.device === item)) {
    score += 2
    matched = true
  }
  if (rule.goals?.some((item) => inputs.goals.includes(item) || detected.goals.has(item))) {
    score += 3
    matched = true
  }
  if (rule.keywords?.some((keyword) => inputs.freeText.toLowerCase().includes(keyword.toLowerCase()))) {
    score += 2
    matched = true
  }

  return matched ? score : 0
}

function buildFallbackRecommendations(inputs: DiagnosisInputs) {
  if (inputs.problems.includes("too-large")) {
    return [
      resolveRecommendation(
        rec(
          "compress-pdf",
          ["no-upload", "free"],
          "Start With Compress PDF",
          "If the issue is simply size and the destination is still unclear, compression is usually the most useful first step. It gives you a lighter working copy before you decide whether the file should also be split, converted, or archived.",
          ["Good first step for large PDFs", "Useful before upload or email decisions", "Keeps the workflow private"]
        ),
        1
      ),
    ]
  }

  if (inputs.problems.includes("need-merge")) {
    return [
      resolveRecommendation(
        rec(
          "merge-pdf",
          ["offline"],
          "Start With Merge PDF",
          "If several files belong together and the exact next step is still unclear, merge first. One clean combined output is easier to review and then compress, protect, or upload afterwards.",
          ["Strong first step for multi-file jobs", "Useful before later optimisation", "Keeps the merge local"]
        ),
        1
      ),
    ]
  }

  return [
    resolveRecommendation(
      rec(
        "pdf-to-word",
        ["no-upload"],
        "Try a Core Local Tool First",
        "If the issue is still broad, start with a core route that matches the closest task and then rerun the diagnosis with a clearer description once you know whether the real obstacle is size, access, structure, or editability.",
        ["Gives you a practical starting point", "Useful when the issue is still vague", "Pairs well with a second diagnosis pass"]
      ),
      1
    ),
  ]
}

export function getDiagnosisInitialInputs(
  searchParams: Record<string, string | string[] | undefined>
): DiagnosisInputs {
  return {
    fileTypes: parseListValue(searchParams.fileType, FILE_TYPE_OPTIONS),
    problems: parseListValue(searchParams.problem, MAIN_PROBLEM_OPTIONS),
    device: parseListValue(searchParams.device, DEVICE_OPTIONS)[0] ?? "any",
    goals: parseListValue(searchParams.goal, GOAL_OPTIONS),
    freeText: normaliseFreeText(searchParams.q),
  }
}

export function diagnose(inputs: DiagnosisInputs): Recommendation[] {
  const detected = detectByKeywords(inputs.freeText)
  const recommendations = new Map<string, Recommendation>()

  for (const rule of DIAGNOSIS_RULES) {
    const score = scoreRule(rule, inputs, detected)
    if (score < 3) continue

    for (const seed of rule.recommendations) {
      const recommendation = resolveRecommendation(seed, score)
      const existing = recommendations.get(recommendation.url)
      if (!existing || recommendation.score > existing.score) {
        recommendations.set(recommendation.url, recommendation)
      }
    }
  }

  if (recommendations.size === 0) {
    for (const fallback of buildFallbackRecommendations(inputs)) {
      recommendations.set(fallback.url, fallback)
    }
  }

  return Array.from(recommendations.values())
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 5)
}

export function hasDiagnosisPrefill(inputs: DiagnosisInputs) {
  return (
    inputs.fileTypes.length > 0 ||
    inputs.problems.length > 0 ||
    inputs.goals.length > 0 ||
    inputs.device !== "any" ||
    inputs.freeText.trim().length > 0
  )
}

export function getPopularDiagnosisLinks() {
  return DIAGNOSIS_POPULAR_VARIANTS.map((path) => {
    const page = TOOL_VARIANT_PAGES.find((item) => item.path === path)
    return {
      href: path,
      label: page?.h1 ?? path,
    }
  })
}


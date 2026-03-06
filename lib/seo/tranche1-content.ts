import { getToolBySlug } from "@/lib/tools-catalogue"

export const REQUIRED_LOCAL_LINE = "Runs locally in your browser. No uploads."

export type TrancheIntent = "how-to" | "trust" | "evergreen" | "comparison"

export type TrancheSection = {
  id: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type TrancheFaq = {
  question: string
  answer: string
}

export type TrancheTrustBox = {
  localProcessing: string
  noUploads: string
  noTracking: string
  verifyHref: string
}

export type TrancheLink = {
  label: string
  href: string
}

export type TrancheComparisonRow = {
  feature: string
  plain: string
  competitor: string
}

export interface TrancheLearnArticle {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  primaryQuery: string
  secondaryQueries: string[]
  intent: Exclude<TrancheIntent, "comparison">
  intro: string[]
  sections: TrancheSection[]
  faqs: TrancheFaq[]
  trustBox: TrancheTrustBox
  nextSteps: TrancheLink[]
  toolHref: string
  relatedLearn: string[]
  verifyHref: string
  disclaimer?: string
}

export interface TrancheComparePage {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  primaryQuery: string
  secondaryQueries: string[]
  intent: "comparison"
  competitorName: string
  intro: string[]
  comparisonRows: TrancheComparisonRow[]
  sections: TrancheSection[]
  faqs: TrancheFaq[]
  trustBox: TrancheTrustBox
  nextSteps: TrancheLink[]
  toolHrefs: string[]
  relatedLearn: string[]
  verifyHref: string
  disclaimer?: string
}

const defaultTrustBox: TrancheTrustBox = {
  localProcessing:
    "All core PDF processing happens in browser memory on your own device.",
  noUploads: REQUIRED_LOCAL_LINE,
  noTracking:
    "No behavioural tracking is required for local PDF operations.",
  verifyHref: "/verify-claims",
}

const toolLabel = (href: string) => {
  const slug = href.replace("/tools/", "")
  const tool = getToolBySlug(slug)
  return tool?.name ?? "Open tool"
}

const howToSections = (
  queryLabel: string,
  actionLabel: string
): TrancheSection[] => [
  {
    id: "quick-answer",
    heading: "Quick answer",
    paragraphs: [
      `To ${queryLabel}, use a local workflow that keeps file bytes on-device, then verify output before sharing.`,
      `The most reliable method is: prepare source files, run ${actionLabel}, inspect the output, and keep originals unchanged for audit traceability.`,
    ],
  },
  {
    id: "step-by-step",
    heading: "Step-by-step workflow",
    paragraphs: [
      "Start by defining exactly what the recipient needs, rather than exporting the full source by default.",
      "Apply the operation once, inspect edge pages, signatures, and metadata, then only distribute the final reviewed output.",
    ],
    bullets: [
      "Prepare files and naming",
      "Run the local operation",
      "Inspect output quality",
      "Share minimum necessary scope",
    ],
  },
  {
    id: "privacy-angle",
    heading: "Why privacy-first handling matters",
    paragraphs: [
      "Upload-based tools can be convenient, but they add transfer and retention surfaces for sensitive content.",
      "Local processing narrows that surface and gives teams direct technical verification through browser tooling.",
    ],
  },
  {
    id: "quality-checks",
    heading: "Quality and governance checks",
    paragraphs: [
      "Check the final file in a separate viewer and confirm expected page order, readability, and fields.",
      "For regulated teams, keep a lightweight processing note with file version, operator, and date.",
    ],
  },
]

const trustSections = (topic: string): TrancheSection[] => [
  {
    id: "what-it-means",
    heading: `What ${topic} means in practice`,
    paragraphs: [
      "Trust claims should be treated as technical statements that can be tested, not slogans.",
      "A practical policy starts with verifiable behaviour in your own environment.",
    ],
  },
  {
    id: "what-to-check",
    heading: "What to check first",
    paragraphs: [
      "Inspect network requests during a real PDF operation and compare payload behaviour to document size.",
      "Run an offline test after first load to confirm whether processing still works without connectivity.",
    ],
  },
  {
    id: "risk-model",
    heading: "Risk model and limitations",
    paragraphs: [
      "Local processing reduces server-side exposure, but endpoint hygiene still matters.",
      "Use this as a risk-reduction layer, not as a replacement for broader security controls.",
    ],
  },
  {
    id: "operational-routine",
    heading: "Operational routine",
    paragraphs: [
      "Create a repeatable review checklist and keep evidence screenshots for internal governance.",
      "Re-run checks when tooling changes, especially before processing high-sensitivity batches.",
    ],
  },
]

const evergreenSections = (topic: string): TrancheSection[] => [
  {
    id: "core-concept",
    heading: `Core concept: ${topic}`,
    paragraphs: [
      "Understanding the basic model helps teams choose safer and more predictable workflows.",
      "This is especially useful when multiple people edit, compress, or share the same document set.",
    ],
  },
  {
    id: "why-it-matters",
    heading: "Why it matters operationally",
    paragraphs: [
      "Most real incidents come from routine handling gaps rather than advanced attacks.",
      "Simple structural checks often prevent avoidable leakage and rework.",
    ],
  },
  {
    id: "privacy-context",
    heading: "Privacy context",
    paragraphs: [
      "The file format itself is neutral. Exposure risk depends on where processing happens and what is shared.",
      "Local processing supports minimisation by keeping routine operations on-device.",
    ],
  },
  {
    id: "practical-next-step",
    heading: "Practical next step",
    paragraphs: [
      "Apply one concrete control immediately, such as metadata review or redaction verification.",
      "Then standardise the control in your team workflow to avoid one-off behaviour.",
    ],
  },
]

const defaultFaqs: TrancheFaq[] = [
  {
    question: "Can I verify this behaviour myself?",
    answer:
      "Yes. Use browser DevTools and run a real file operation while watching request payloads.",
  },
  {
    question: "Does local processing mean no internet at all?",
    answer:
      "Core operations can run offline after the page has loaded, depending on the feature.",
  },
  {
    question: "Is this legal or medical advice?",
    answer:
      "No. This is technical and operational guidance only.",
  },
  {
    question: "What should teams do first?",
    answer:
      "Define document sensitivity classes and map approved processing routes for each class.",
  },
]

const buildHowTo = (
  slug: string,
  title: string,
  primaryQuery: string,
  secondaryQueries: string[],
  toolHref: string,
  relatedLearn: string[],
  compareHref: string,
  compareLabel: string
): TrancheLearnArticle => ({
  slug,
  title,
  metaTitle: `${title} | Plain Tools`,
  metaDescription: `${title}. ${REQUIRED_LOCAL_LINE}`,
  primaryQuery,
  secondaryQueries,
  intent: "how-to",
  intro: [
    `${title} is simplest with a local-first workflow that avoids unnecessary transfer risk. ${REQUIRED_LOCAL_LINE}`,
    "This guide focuses on practical steps, output validation, and predictable handling for sensitive files.",
  ],
  sections: howToSections(primaryQuery, title),
  faqs: defaultFaqs,
  trustBox: defaultTrustBox,
  nextSteps: [
    { label: toolLabel(toolHref), href: toolHref },
    { label: `Learn: ${relatedLearn[0].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[0]}` },
    { label: `Learn: ${relatedLearn[1].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[1]}` },
    { label: "Verify Claims", href: "/verify-claims" },
    { label: compareLabel, href: compareHref },
  ],
  toolHref,
  relatedLearn,
  verifyHref: "/verify-claims",
})

const buildTrust = (
  slug: string,
  title: string,
  primaryQuery: string,
  secondaryQueries: string[],
  toolHref: string,
  relatedLearn: string[]
): TrancheLearnArticle => ({
  slug,
  title,
  metaTitle: `${title} | Plain Tools`,
  metaDescription: `${title}. ${REQUIRED_LOCAL_LINE}`,
  primaryQuery,
  secondaryQueries,
  intent: "trust",
  intro: [
    `${title} should be treated as an engineering question first, then a policy question. ${REQUIRED_LOCAL_LINE}`,
    "This page gives a concrete verification workflow and practical constraints for teams handling sensitive PDFs.",
  ],
  sections: trustSections(title.toLowerCase()),
  faqs: defaultFaqs,
  trustBox: defaultTrustBox,
  nextSteps: [
    { label: toolLabel(toolHref), href: toolHref },
    { label: `Learn: ${relatedLearn[0].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[0]}` },
    { label: `Learn: ${relatedLearn[1].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[1]}` },
    { label: "Verify Claims", href: "/verify-claims" },
  ],
  toolHref,
  relatedLearn,
  verifyHref: "/verify-claims",
})

const buildEvergreen = (
  slug: string,
  title: string,
  primaryQuery: string,
  secondaryQueries: string[],
  toolHref: string,
  relatedLearn: string[]
): TrancheLearnArticle => ({
  slug,
  title,
  metaTitle: `${title} | Plain Tools`,
  metaDescription: `${title}. ${REQUIRED_LOCAL_LINE}`,
  primaryQuery,
  secondaryQueries,
  intent: "evergreen",
  intro: [
    `${title} is easier to manage when you separate format mechanics from workflow risk. ${REQUIRED_LOCAL_LINE}`,
    "This explainer keeps the focus on plain-language understanding and operational decisions.",
  ],
  sections: evergreenSections(title),
  faqs: defaultFaqs,
  trustBox: defaultTrustBox,
  nextSteps: [
    { label: toolLabel(toolHref), href: toolHref },
    { label: `Learn: ${relatedLearn[0].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[0]}` },
    { label: `Learn: ${relatedLearn[1].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[1]}` },
    { label: "Verify Claims", href: "/verify-claims" },
  ],
  toolHref,
  relatedLearn,
  verifyHref: "/verify-claims",
})

const compareRows = (competitorName: string): TrancheComparisonRow[] => [
  { feature: "Uploads files?", plain: "No for core local tools - local browser processing", competitor: "Commonly yes for hosted processing workflows" },
  { feature: "Primary workflow model", plain: "Local-first utility workflow", competitor: `${competitorName} account and service model` },
  { feature: "Works offline after load", plain: "Yes for local tools", competitor: "Usually limited or unavailable" },
  { feature: "Privacy verification path", plain: "Inspectable with DevTools", competitor: "Depends on provider controls and transparency" },
  { feature: "Best fit", plain: "Sensitive-document handling and no-upload operations", competitor: "Hosted collaboration and account-centric routing" },
]

const buildCompare = (
  slug: string,
  title: string,
  competitorName: string,
  primaryQuery: string,
  secondaryQueries: string[],
  toolHrefs: string[],
  relatedLearn: string[]
): TrancheComparePage => ({
  slug,
  title,
  metaTitle: `${title} | Plain Tools`,
  metaDescription: `${title} comparison with practical privacy and workflow criteria. ${REQUIRED_LOCAL_LINE}`,
  primaryQuery,
  secondaryQueries,
  intent: "comparison",
  competitorName,
  intro: [
    `${title} is best assessed as an architecture and workflow comparison, not a feature checklist alone. ${REQUIRED_LOCAL_LINE}`,
    "Use this page for fair operational trade-offs and independent verification steps.",
  ],
  comparisonRows: compareRows(competitorName),
  sections: [
    {
      id: "quick-summary",
      heading: "Quick summary",
      paragraphs: [
        `${competitorName} can suit account-led, cloud-centric workflows. Plain Tools suits privacy-first workflows where local processing is required.`,
        "Use practical workflow criteria and technical verification steps, not feature lists alone.",
      ],
    },
    {
      id: "privacy-comparison",
      heading: "Privacy comparison",
      paragraphs: [
        "Hosted processing depends on provider policy, account controls, and retention settings.",
        "Local-first processing reduces transfer exposure for sensitive workflows and can be validated directly in your browser.",
      ],
    },
    {
      id: "workflow-speed-comparison",
      heading: "Workflow and speed comparison",
      paragraphs: [
        "Cloud workflows add upload and download steps that may still be acceptable for low-sensitivity work.",
        "Local workflows remove transfer waiting for routine tasks and keep handling close to the operator.",
      ],
    },
    {
      id: "best-for",
      heading: "Best-for guidance",
      paragraphs: [
        `Choose ${competitorName} when account integration and hosted collaboration are central requirements.`,
        "Choose Plain.tools when no-upload handling, privacy verification, and fast local execution are priorities.",
      ],
    },
    {
      id: "when-plain",
      heading: "When Plain Tools is the better choice",
      paragraphs: [
        "You work with sensitive files and need a no-upload workflow.",
        "You want to verify behaviour directly in browser tooling.",
      ],
    },
    {
      id: "when-other",
      heading: "When another option may suit better",
      paragraphs: [
        "You require vendor-managed collaboration, routing, or account-level administration.",
        "You prioritise hosted features over local processing controls for the specific workflow.",
      ],
    },
  ],
  faqs: defaultFaqs,
  trustBox: defaultTrustBox,
  nextSteps: [
    { label: "Verify Claims", href: "/verify-claims" },
    { label: `Learn: ${relatedLearn[0].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[0]}` },
    { label: `Learn: ${relatedLearn[1].replace(/-/g, " ")}`, href: `/learn/${relatedLearn[1]}` },
    { label: toolLabel(toolHrefs[0] ?? "/tools"), href: toolHrefs[0] ?? "/tools" },
  ],
  toolHrefs,
  relatedLearn,
  verifyHref: "/verify-claims",
  disclaimer:
    "Informational comparison only. Verify current product behaviour and terms in your own environment.",
})

export const learnPages: TrancheLearnArticle[] = [
  buildHowTo(
    "compress-pdf-without-losing-quality",
    "Compress PDF Without Losing Quality",
    "compress pdf without losing quality",
    ["reduce pdf file size", "compress pdf offline", "best pdf compression settings"],
    "/tools/compress-pdf",
    ["why-offline-compression-has-limits", "pdf-consistency"],
    "/verify-claims",
    "Verify Claims"
  ),
  buildHowTo(
    "how-to-merge-pdfs-offline",
    "How to Merge PDFs Offline",
    "merge pdf offline",
    ["merge pdf no upload", "merge pdf locally", "offline pdf merge"],
    "/tools/merge-pdf",
    ["no-uploads-explained", "how-pdfs-work"],
    "/compare/offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools"
  ),
  buildHowTo(
    "how-to-split-a-pdf-by-pages",
    "How to Split a PDF by Pages",
    "split pdf by pages",
    ["split pdf ranges", "extract pages from pdf", "split pdf offline"],
    "/tools/split-pdf",
    ["pdf-consistency", "what-is-pdf-metadata-and-why-it-matters"],
    "/compare/offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools"
  ),
  buildHowTo(
    "how-to-remove-pdf-metadata",
    "How to Remove PDF Metadata",
    "remove pdf metadata",
    ["strip xmp metadata", "pdf hidden metadata", "remove author from pdf"],
    "/tools/metadata-purge",
    ["what-is-pdf-metadata-and-why-it-matters", "gdpr-and-pdf-tools-what-businesses-need-to-know"],
    "/compare/offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools"
  ),
  buildHowTo(
    "how-to-redact-a-pdf-properly",
    "How to Redact a PDF Properly",
    "redact pdf properly",
    ["irreversible redaction", "secure pdf redaction", "remove sensitive text from pdf"],
    "/tools/redact-pdf",
    ["how-pdf-redaction-really-works", "why-pdf-uploads-are-risky"],
    "/compare/plain-vs-adobe-acrobat-online",
    "Plain vs Adobe Acrobat Online"
  ),
  buildHowTo(
    "how-to-sign-a-pdf-without-uploading-it",
    "How to Sign a PDF Without Uploading It",
    "sign pdf without uploading",
    ["local pdf signer", "offline signature workflow", "private pdf signing"],
    "/tools/local-signer",
    ["no-uploads-explained", "verify-offline-processing"],
    "/compare/plain-vs-docusign",
    "Plain vs DocuSign"
  ),
  buildHowTo(
    "how-to-extract-pages-from-a-pdf",
    "How to Extract Pages from a PDF",
    "extract pages from pdf",
    ["pdf page extraction", "extract pdf pages offline", "save selected pdf pages"],
    "/tools/extract-pdf",
    ["how-pdfs-work", "client-side-processing"],
    "/compare/offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools"
  ),
  buildHowTo(
    "ocr-pdf-without-cloud",
    "OCR PDF Without Cloud",
    "ocr pdf without cloud",
    ["offline ocr pdf", "local ocr browser", "private ocr workflow"],
    "/tools/offline-ocr",
    ["webassembly-pdf-processing-explained", "why-pdf-uploads-are-risky"],
    "/compare/offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools"
  ),
  buildTrust(
    "what-happens-when-you-upload-a-pdf",
    "What Happens When You Upload a PDF",
    "what happens when you upload a pdf",
    ["pdf upload process", "where uploaded files go", "cloud pdf processing risk"],
    "/tools/merge-pdf",
    ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
  ),
  buildTrust(
    "no-uploads-explained",
    "No Uploads Explained",
    "no uploads explained",
    ["local processing meaning", "client-side pdf tools", "verify no upload claim"],
    "/tools/merge-pdf",
    ["how-to-verify-a-pdf-tool-doesnt-upload-your-files", "why-pdf-uploads-are-risky"]
  ),
  buildTrust(
    "how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    "How to Verify a PDF Tool Does not Upload Your Files",
    "how to verify a pdf tool doesnt upload your files",
    ["verify pdf privacy devtools", "network tab pdf upload check", "check local pdf processing"],
    "/tools/pdf-qa",
    ["no-uploads-explained", "is-offline-pdf-processing-secure"]
  ),
  buildTrust(
    "is-offline-pdf-processing-secure",
    "Is Offline PDF Processing Secure",
    "is offline pdf processing secure",
    ["local pdf security", "offline document processing safety", "browser pdf security"],
    "/tools/merge-pdf",
    ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
  ),
  {
    ...buildTrust(
      "gdpr-and-pdf-tools-what-businesses-need-to-know",
      "GDPR and PDF Tools: What Businesses Need to Know",
      "gdpr and pdf tools what businesses need to know",
      ["gdpr pdf tools", "client-side pdf processing gdpr", "pdf processor exposure"],
      "/tools/metadata-purge",
      ["what-is-pdf-metadata-and-why-it-matters", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
    ),
    disclaimer:
      "Informational only. This page is not legal advice and does not replace qualified counsel.",
  },
  buildTrust(
    "common-pdf-privacy-mistakes",
    "Common PDF Privacy Mistakes",
    "common pdf privacy mistakes",
    ["pdf privacy checklist", "document leakage mistakes", "secure pdf workflow errors"],
    "/tools/redact-pdf",
    ["how-to-redact-a-pdf-properly", "how-to-remove-pdf-metadata"]
  ),
  {
    ...buildTrust(
      "why-you-should-never-upload-medical-records-to-pdf-tools",
      "Why You Should Never Upload Medical Records to PDF Tools",
      "why you should never upload medical records to pdf tools",
      ["hipaa pdf tools", "medical pdf upload risk", "healthcare local pdf processing"],
      "/tools/redact-pdf",
      ["how-to-remove-pdf-metadata", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
    ),
    disclaimer:
      "Informational only. This page is not medical advice and does not replace professional guidance.",
  },
  buildEvergreen(
    "what-is-a-pdf",
    "What Is a PDF",
    "what is a pdf",
    ["pdf format explained", "why use pdf files", "pdf basics"],
    "/tools/merge-pdf",
    ["how-pdfs-work", "what-is-pdf-metadata-and-why-it-matters"]
  ),
  buildEvergreen(
    "how-pdfs-work",
    "How PDFs Work",
    "how pdfs work",
    ["pdf internals", "pdf object structure", "pdf page tree"],
    "/tools/reorder-pdf",
    ["how-to-split-a-pdf-by-pages", "how-to-extract-pages-from-a-pdf"]
  ),
  buildEvergreen(
    "why-pdf-uploads-are-risky",
    "Why PDF Uploads Are Risky",
    "why pdf uploads are risky",
    ["online pdf privacy risks", "cloud pdf processing risk", "sensitive pdf uploads"],
    "/tools/merge-pdf",
    ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
  ),
  buildEvergreen(
    "what-is-pdf-metadata-and-why-it-matters",
    "What Is PDF Metadata and Why It Matters",
    "what is pdf metadata and why it matters",
    ["pdf metadata", "hidden data in pdf", "remove metadata pdf"],
    "/tools/metadata-purge",
    ["how-to-remove-pdf-metadata", "gdpr-and-pdf-tools-what-businesses-need-to-know"]
  ),
]

export const comparePages: TrancheComparePage[] = [
  buildCompare(
    "offline-vs-online-pdf-tools",
    "Offline vs Online PDF Tools",
    "Online PDF tools",
    "offline vs online pdf tools",
    ["local vs cloud pdf tools", "private pdf processing", "upload-based pdf alternatives"],
    ["/tools/merge-pdf", "/tools/compress-pdf"],
    ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
  ),
  buildCompare(
    "plain-vs-smallpdf",
    "Plain vs Smallpdf",
    "Smallpdf",
    "plain vs smallpdf",
    ["smallpdf alternative", "smallpdf privacy", "smallpdf no upload alternative"],
    ["/tools/merge-pdf", "/tools/compress-pdf"],
    ["why-pdf-uploads-are-risky", "no-uploads-explained"]
  ),
  buildCompare(
    "plain-vs-ilovepdf",
    "Plain vs iLovePDF",
    "iLovePDF",
    "plain vs ilovepdf",
    ["ilovepdf alternative", "ilovepdf privacy", "offline pdf alternative"],
    ["/tools/compress-pdf", "/tools/extract-pdf"],
    ["no-uploads-explained", "why-pdf-uploads-are-risky"]
  ),
  buildCompare(
    "plain-vs-sejda",
    "Plain vs Sejda",
    "Sejda",
    "plain vs sejda",
    ["sejda alternative", "sejda privacy", "private pdf tool alternative"],
    ["/tools/split-pdf", "/tools/reorder-pdf"],
    ["how-to-verify-a-pdf-tool-doesnt-upload-your-files", "is-offline-pdf-processing-secure"]
  ),
  buildCompare(
    "plain-vs-adobe-acrobat-online",
    "Plain vs Adobe Acrobat Online",
    "Adobe Acrobat Online",
    "plain vs adobe acrobat online",
    ["adobe acrobat online alternative", "adobe online pdf privacy", "private adobe alternative"],
    ["/tools/redact-pdf", "/tools/metadata-purge"],
    ["why-pdf-uploads-are-risky", "no-uploads-explained"]
  ),
  {
    ...buildCompare(
      "plain-vs-docusign",
      "Plain vs DocuSign",
      "DocuSign",
      "plain vs docusign",
      ["docusign alternative", "local pdf signer", "private signing workflow"],
      ["/tools/local-signer"],
      ["how-to-sign-a-pdf-without-uploading-it", "is-offline-pdf-processing-secure"]
    ),
    disclaimer:
      "Informational comparison only and not legal advice on signature enforceability.",
  },
]

const learnMap = new Map(learnPages.map((entry) => [entry.slug, entry]))
const compareMap = new Map(comparePages.map((entry) => [entry.slug, entry]))

export function getTrancheLearnArticleOrThrow(slug: string) {
  const article = learnMap.get(slug)
  if (!article) {
    throw new Error(`Missing learn article data for slug: ${slug}`)
  }
  return article
}

export function getTrancheComparePageOrThrow(slug: string) {
  const page = compareMap.get(slug)
  if (!page) {
    throw new Error(`Missing compare page data for slug: ${slug}`)
  }
  return page
}

export const trancheLearnSlugs = learnPages.map((entry) => entry.slug)
export const trancheCompareSlugs = comparePages.map((entry) => entry.slug)

export const trancheSitemapUrls = [
  ...trancheLearnSlugs.map((slug) => `/learn/${slug}`),
  ...trancheCompareSlugs.map((slug) => `/compare/${slug}`),
]

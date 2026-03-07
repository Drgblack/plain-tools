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
    "/compare/plain-tools-vs-adobe-acrobat-online",
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
  buildTrust(
    "private-pdf-tools",
    "Private PDF Tools: How to Choose a No-Upload Workflow",
    "private pdf tools",
    ["private pdf editor", "no upload pdf tools", "offline pdf tools for sensitive documents"],
    "/tools/merge-pdf",
    ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"]
  ),
  {
    slug: "is-it-down-for-everyone-or-just-me",
    title: "Is It Down for Everyone or Just Me: Status Checks Explained",
    metaTitle: "Is It Down for Everyone or Just Me: Status Checks Explained | Plain Tools",
    metaDescription:
      "Learn how to check whether a website is down globally or only for your connection, with practical local diagnostics and clear next steps.",
    primaryQuery: "is it down for everyone or just me",
    secondaryQueries: [
      "site status check explained",
      "website down troubleshooting steps",
      "check if a site is down globally",
    ],
    intent: "trust",
    intro: [
      "Use this guide when a site does not load and you need to separate local connectivity issues from broader outages. Runs locally in your browser. No uploads.",
      "The process below gives a practical status-check workflow with DNS and response-time context.",
    ],
    sections: [
      {
        id: "quick-answer",
        heading: "Quick answer",
        paragraphs: [
          "A single failed load does not prove a global outage. Start with a status check, then validate DNS and local network conditions.",
          "Check at least one other network before escalating an incident.",
        ],
      },
      {
        id: "step-by-step",
        heading: "Step-by-step status workflow",
        paragraphs: [
          "Run checks in sequence so you can rule out local causes before reporting a platform outage.",
        ],
        bullets: [
          "Check the domain status page and note response state and timing.",
          "Run DNS lookup to confirm resolver behaviour for the same hostname.",
          "Retry from another network or device to distinguish local versus broad failure.",
        ],
      },
      {
        id: "limitations",
        heading: "Limitations and caveats",
        paragraphs: [
          "One probe point cannot represent all regions at once.",
          "Corporate firewalls, DNS overrides, and captive portals can create false down signals.",
        ],
      },
      {
        id: "privacy-note",
        heading: "Privacy note",
        paragraphs: [
          "Status checks in this workflow do not require uploading personal files. Keep diagnostics focused on domain availability and timing only.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why can a site be up for others but down for me?",
        answer:
          "Local DNS, ISP routing, firewalls, or browser state can fail while the service is healthy elsewhere.",
      },
      {
        question: "What does response time mean in a status check?",
        answer:
          "It indicates how long the target took to reply to the probe request, not full page render performance.",
      },
      {
        question: "Should I clear DNS cache before concluding a global outage?",
        answer:
          "Yes. Clearing local DNS and retrying can rule out stale resolver entries.",
      },
      {
        question: "Is this a full monitoring service?",
        answer:
          "No. This is a practical on-demand check, not multi-region synthetic monitoring.",
      },
    ],
    trustBox: {
      localProcessing: "Status checks run in-browser and use direct request probes from your session.",
      noUploads: REQUIRED_LOCAL_LINE,
      noTracking: "No behavioural tracking is required for status checks.",
      verifyHref: "/verify-claims",
    },
    nextSteps: [
      { label: "Open site status checker", href: "/site-status" },
      { label: "Check whether chatgpt.com is down", href: "/status/chatgpt.com" },
      { label: "Run DNS lookup for a domain", href: "/dns-lookup" },
      { label: "What is my IP", href: "/what-is-my-ip" },
      { label: "Verify Claims", href: "/verify-claims" },
    ],
    toolHref: "/site-status",
    relatedLearn: ["how-to-verify-a-pdf-tool-doesnt-upload-your-files", "no-uploads-explained"],
    verifyHref: "/verify-claims",
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
    "plain-tools-vs-smallpdf",
    "Plain Tools vs Smallpdf",
    "Smallpdf",
    "plain tools vs smallpdf",
    ["smallpdf alternative", "smallpdf privacy", "smallpdf no upload alternative"],
    ["/tools/merge-pdf", "/tools/compress-pdf"],
    ["why-pdf-uploads-are-risky", "no-uploads-explained"]
  ),
  buildCompare(
    "plain-tools-vs-ilovepdf",
    "Plain Tools vs iLovePDF",
    "iLovePDF",
    "plain tools vs ilovepdf",
    ["ilovepdf alternative", "ilovepdf privacy", "offline pdf alternative"],
    ["/tools/compress-pdf", "/tools/extract-pdf"],
    ["no-uploads-explained", "why-pdf-uploads-are-risky"]
  ),
  buildCompare(
    "plain-tools-vs-sejda",
    "Plain Tools vs Sejda",
    "Sejda",
    "plain tools vs sejda",
    ["sejda alternative", "sejda privacy", "private pdf tool alternative"],
    ["/tools/split-pdf", "/tools/reorder-pdf"],
    ["how-to-verify-a-pdf-tool-doesnt-upload-your-files", "is-offline-pdf-processing-secure"]
  ),
  buildCompare(
    "plain-tools-vs-adobe-acrobat-online",
    "Plain Tools vs Adobe Acrobat Online",
    "Adobe Acrobat Online",
    "plain tools vs adobe acrobat online",
    ["adobe acrobat online alternative", "adobe online pdf privacy", "private adobe alternative"],
    ["/tools/redact-pdf", "/tools/metadata-purge"],
    ["why-pdf-uploads-are-risky", "no-uploads-explained"]
  ),
  buildCompare(
    "plain-tools-vs-pdf24",
    "Plain Tools vs PDF24",
    "PDF24",
    "plain tools vs pdf24",
    ["pdf24 alternative", "pdf24 privacy", "pdf24 vs plain tools"],
    ["/tools/merge-pdf", "/tools/split-pdf"],
    ["how-to-verify-a-pdf-tool-doesnt-upload-your-files", "no-uploads-explained"]
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

const priorityLearnOverrides: Record<string, Partial<TrancheLearnArticle>> = {
  "how-to-merge-pdfs-offline": {
    title: "How to Merge PDFs Offline",
    intro: [
      "Need one clean PDF from multiple files without handing your documents to a hosted processor? Runs locally in your browser. No uploads.",
      "This guide covers a practical merge workflow, validation steps, and caveats for sensitive document handling.",
    ],
  },
  "compress-pdf-without-losing-quality": {
    title: "Compress PDF Without Losing Quality",
    intro: [
      "Compression is a quality trade-off, not a single setting. Runs locally in your browser. No uploads.",
      "Start with light optimisation, check output readability, and escalate only when you still need further size reduction.",
    ],
  },
  "how-to-sign-a-pdf-without-uploading-it": {
    toolHref: "/tools/sign-pdf",
    intro: [
      "Sign a PDF without sending the file to an external signing service. Runs locally in your browser. No uploads.",
      "Use this guide for practical visual signing workflows, plus limits you should know before external submission.",
    ],
  },
}

for (const article of learnPages) {
  const override = priorityLearnOverrides[article.slug]
  if (!override) continue
  Object.assign(article, override)
}

const priorityCompareOverrides: Record<string, Partial<TrancheComparePage>> = {
  "plain-tools-vs-smallpdf": {
    title: "Plain Tools vs Smallpdf",
    metaTitle: "Plain Tools vs Smallpdf | Plain Tools",
    metaDescription:
      "Compare Plain Tools vs Smallpdf on privacy model, upload requirements, speed, and practical fit for sensitive PDF workflows.",
    intro: [
      "Comparing Plain Tools vs Smallpdf usually comes down to processing model and workflow control. Runs locally in your browser. No uploads.",
      "This page focuses on practical trade-offs so you can decide based on operational reality rather than feature lists.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core tasks", plain: "No for core local tools", competitor: "Usually yes for hosted browser workflows" },
      { feature: "Workflow model", plain: "Local-first execution in your browser", competitor: "Cloud-assisted workflow with account options" },
      { feature: "Verification effort", plain: "Low: check one real operation in DevTools", competitor: "Higher: relies on policy and settings" },
      { feature: "Operational speed profile", plain: "No upload/download round trip for local jobs", competitor: "Can include transfer and queue time" },
      { feature: "Best fit", plain: "Sensitive files and no-upload handling", competitor: "Cloud convenience and account-centric routing" },
    ],
    faqs: [
      {
        question: "Is Plain Tools or Smallpdf better for sensitive PDFs?",
        answer:
          "Plain Tools is usually better when your requirement is no-upload handling for core tasks and direct technical verification in the browser.",
      },
      {
        question: "Can I verify local processing on Plain Tools myself?",
        answer:
          "Yes. Run one file operation and inspect the Network panel in DevTools to confirm no file payload is sent for local tools.",
      },
      {
        question: "When might Smallpdf still suit better?",
        answer:
          "Smallpdf may suit teams that prioritise cloud convenience and account-based workflow routing over local-only handling.",
      },
      {
        question: "Does this comparison claim one tool is always better?",
        answer:
          "No. The better option depends on your workflow constraints, especially privacy requirements and collaboration model.",
      },
    ],
  },
  "plain-tools-vs-ilovepdf": {
    title: "Plain Tools vs iLovePDF",
    metaTitle: "Plain Tools vs iLovePDF | Plain Tools",
    metaDescription:
      "Compare Plain Tools vs iLovePDF with a fair view of uploads, local processing, workflow speed, and practical privacy controls.",
    intro: [
      "Plain Tools vs iLovePDF is primarily a local-first versus cloud-first decision. Runs locally in your browser. No uploads.",
      "Use this comparison to evaluate operational fit, privacy handling, and day-to-day workflow friction.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core tasks", plain: "No for core local tools", competitor: "Usually yes for hosted processing" },
      { feature: "Primary workflow", plain: "In-browser local execution", competitor: "Cloud processing with browser front-end" },
      { feature: "Offline continuity after first load", plain: "Yes for local tools", competitor: "Limited for upload-dependent features" },
      { feature: "Privacy verification path", plain: "Direct DevTools validation", competitor: "Policy and account controls dependent" },
      { feature: "Best fit", plain: "Sensitive-document workflows", competitor: "General hosted conversion workflows" },
    ],
    faqs: [
      {
        question: "What is the main difference between Plain Tools and iLovePDF?",
        answer:
          "The main difference is processing architecture: Plain Tools is local-first for core tools, while iLovePDF commonly uses hosted processing routes.",
      },
      {
        question: "Which option is better for private internal documents?",
        answer:
          "Plain Tools is typically the stronger fit when your policy requires no-upload workflows for routine document handling.",
      },
      {
        question: "Can iLovePDF workflows still be useful?",
        answer:
          "Yes. Hosted workflows can be practical when cloud accessibility and account-based operations are priorities.",
      },
      {
        question: "How should teams evaluate this fairly?",
        answer:
          "Test the same task on both options, compare upload behaviour and turnaround time, then choose based on operational fit.",
      },
    ],
  },
  "plain-tools-vs-adobe-acrobat-online": {
    title: "Plain Tools vs Adobe Acrobat Online",
    metaTitle: "Plain Tools vs Adobe Acrobat Online | Plain Tools",
    metaDescription:
      "Compare Plain Tools vs Adobe Acrobat Online on upload model, privacy verification, workflow speed, and practical team fit.",
    intro: [
      "Plain Tools vs Adobe Acrobat Online is best evaluated by architecture and workflow constraints, not feature lists alone. Runs locally in your browser. No uploads.",
      "Use this page for a neutral comparison of privacy handling, process friction, and where each option tends to suit better.",
    ],
    comparisonRows: [
      { feature: "Core processing path", plain: "Local browser processing", competitor: "Hosted online service workflow" },
      { feature: "Uploads required for core tasks", plain: "No for core local tools", competitor: "Typically yes for online workflows" },
      { feature: "Verification path", plain: "DevTools checks in your own session", competitor: "Relies on provider statements and controls" },
      { feature: "Workflow speed", plain: "Local execution, no transfer round trip", competitor: "Can include upload/download latency" },
      { feature: "Best fit", plain: "No-upload handling and sensitive files", competitor: "Cloud ecosystem and account-led administration" },
    ],
    faqs: [
      {
        question: "When is Plain Tools a better fit than Adobe Acrobat Online?",
        answer:
          "Plain Tools is often the better fit when you need no-upload handling for core operations and quick local execution.",
      },
      {
        question: "When might Adobe Acrobat Online be the better choice?",
        answer:
          "Adobe Acrobat Online may suit organisations that depend on account-based administration and cloud-integrated workflows.",
      },
      {
        question: "Is this comparison a legal or compliance recommendation?",
        answer:
          "No. It is a technical workflow comparison and should be combined with your legal and compliance review process.",
      },
      {
        question: "How can I validate privacy claims before rollout?",
        answer:
          "Run a controlled pilot with representative files and record network behaviour, output quality, and operational steps.",
      },
    ],
  },
  "plain-tools-vs-pdf24": {
    title: "Plain Tools vs PDF24",
    metaTitle: "Plain Tools vs PDF24 | Plain Tools",
    metaDescription:
      "Compare Plain Tools vs PDF24 with practical criteria: route clarity, verification effort, upload risk, and daily workflow control.",
    intro: [
      "Plain Tools and PDF24 can both support privacy-conscious work, but route clarity and verification effort differ in practice. Runs locally in your browser. No uploads.",
      "This comparison helps teams choose what they can run consistently under normal time pressure.",
    ],
    comparisonRows: [
      { feature: "Route clarity for local handling", plain: "Single local-first flow for core tools", competitor: "Depends on selected route and setup" },
      { feature: "Verification effort", plain: "Low: one-session DevTools check", competitor: "Varies by chosen route and environment" },
      { feature: "Upload exposure risk", plain: "No upload for core local tools", competitor: "Can vary by route and workflow selection" },
      { feature: "Policy enforcement ease", plain: "Straightforward for mixed-skill teams", competitor: "May need tighter route governance" },
      { feature: "Best fit", plain: "Teams wanting predictable local-first defaults", competitor: "Teams with established route-control practices" },
    ],
    faqs: [
      {
        question: "Is Plain Tools vs PDF24 mostly a feature comparison?",
        answer:
          "Not primarily. It is mostly a workflow and verification comparison, especially for teams with privacy-sensitive file handling requirements.",
      },
      {
        question: "Can PDF24 be used in privacy-conscious workflows?",
        answer:
          "Yes, depending on route and configuration. Teams should document the exact route they standardise on and verify it regularly.",
      },
      {
        question: "Why does route clarity matter so much?",
        answer:
          "Clear routes reduce accidental process drift and make policy enforcement easier for mixed-skill teams.",
      },
      {
        question: "How should we decide between the two?",
        answer:
          "Run one representative workflow with two reviewers, compare verification effort, and choose the path that is easiest to execute consistently.",
      },
    ],
  },
  "plain-tools-vs-sejda": {
    title: "Plain Tools vs Sejda",
    metaTitle: "Plain Tools vs Sejda | Plain Tools",
    metaDescription:
      "Compare Plain Tools vs Sejda for private PDF workflows, upload handling, speed, and practical fit for everyday document operations.",
    intro: [
      "Plain Tools vs Sejda usually comes down to whether your default requires strict local-first handling or hosted convenience. Runs locally in your browser. No uploads.",
      "Use this comparison to decide based on workflow reality and verification effort.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core tasks", plain: "No for core local tools", competitor: "Often route-dependent and may be hosted" },
      { feature: "Workflow model", plain: "Local browser workflow", competitor: "Hybrid or hosted flow depending on task" },
      { feature: "Offline continuity after first load", plain: "Yes for local tools", competitor: "Task-dependent and often limited" },
      { feature: "Verification path", plain: "Direct local inspection in DevTools", competitor: "Depends on selected flow and provider controls" },
      { feature: "Best fit", plain: "Privacy-first routine operations", competitor: "Users prioritising hosted workflow convenience" },
    ],
    faqs: [
      {
        question: "What should I compare first between Plain Tools and Sejda?",
        answer:
          "Compare processing route, upload requirements, and verification effort before comparing secondary features.",
      },
      {
        question: "Which tool is better for no-upload handling?",
        answer:
          "Plain Tools is generally better when you need a strict local-first default for core workflows.",
      },
      {
        question: "Can Sejda still be appropriate for some teams?",
        answer:
          "Yes. Sejda may suit teams that prioritise hosted workflow convenience and accept its operational trade-offs.",
      },
      {
        question: "How do I avoid a biased decision?",
        answer:
          "Use the same files, same tasks, and same validation checklist for both tools, then compare outcomes objectively.",
      },
    ],
  },
}

for (const page of comparePages) {
  const override = priorityCompareOverrides[page.slug]
  if (!override) continue
  Object.assign(page, override)
}

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

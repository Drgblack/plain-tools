import type {
  TrancheComparePage,
  TrancheFaq,
  TrancheLearnArticle,
  TrancheLink,
  TrancheTrustBox,
} from "@/lib/seo/tranche1-content"
import { REQUIRED_LOCAL_LINE } from "@/lib/seo/tranche1-content"

const trustBox: TrancheTrustBox = {
  localProcessing: "Core document handling runs in local browser memory on your own device.",
  noUploads: REQUIRED_LOCAL_LINE,
  noTracking: "No behavioural tracking is required for the local PDF workflows described here.",
  verifyHref: "/verify-claims",
}

function links(...items: Array<[string, string]>): TrancheLink[] {
  return items.map(([label, href]) => ({ label, href }))
}

function makeLearnArticle(article: TrancheLearnArticle): TrancheLearnArticle {
  return article
}

function makeComparePage(page: TrancheComparePage): TrancheComparePage {
  return page
}

const lawFirmFaqs: TrancheFaq[] = [
  {
    question: "Why do law firms need offline PDF tools?",
    answer:
      "Legal teams often handle privileged, confidential, or court-sensitive documents where minimising third-party exposure is part of a sensible risk posture.",
  },
  {
    question: "Are offline PDF tools enough on their own?",
    answer:
      "No. Local processing reduces transfer exposure, but firms still need endpoint controls, document classification, and review procedures.",
  },
  {
    question: "Which PDF tasks should be kept local first?",
    answer:
      "Redaction, metadata cleanup, page extraction, bundling, and review copies are strong candidates because they often involve sensitive matter files.",
  },
  {
    question: "Is this legal advice?",
    answer: "No. This page covers operational workflow choices, not legal advice.",
  },
]

const healthcareFaqs: TrancheFaq[] = [
  {
    question: "Why is local PDF processing relevant for healthcare teams?",
    answer:
      "Patient records, referrals, imaging summaries, and insurance paperwork often contain sensitive personal data that should not be sent to unnecessary third parties.",
  },
  {
    question: "Does offline handling automatically make a workflow compliant?",
    answer:
      "No. It lowers exposure in one part of the process. Compliance still depends on access control, retention, device security, and governance.",
  },
  {
    question: "Which healthcare tasks benefit most from local tools?",
    answer:
      "Redaction, metadata removal, splitting records, and compressing portal uploads are especially good candidates because they usually involve patient-identifiable documents.",
  },
  {
    question: "Is this medical or compliance advice?",
    answer: "No. It is operational guidance only.",
  },
]

const complianceFaqs: TrancheFaq[] = [
  {
    question: "What is the most common PDF redaction mistake?",
    answer:
      "Using visual overlays instead of irreversible content removal. If text still exists underneath, it is not safely redacted.",
  },
  {
    question: "Should metadata be checked after redaction?",
    answer:
      "Yes. Even a visually correct redaction can still leave identifying metadata, comments, or hidden fields behind.",
  },
  {
    question: "Why keep a checklist?",
    answer:
      "Redaction failures usually happen during rushed, repetitive work. A checklist makes validation steps repeatable and auditable.",
  },
  {
    question: "Does this replace formal compliance review?",
    answer: "No. It supports implementation, but it does not replace internal policy or legal review.",
  },
]

const ocrFaqs: TrancheFaq[] = [
  {
    question: "What is the main privacy difference between local and cloud OCR?",
    answer:
      "Cloud OCR adds a transfer step to a third-party service. Local OCR keeps page images and extracted text on the operator's device.",
  },
  {
    question: "Is local OCR always the better choice?",
    answer:
      "Not always. Cloud OCR can still suit lower-sensitivity work or managed enterprise setups. The key is matching document sensitivity to the route.",
  },
  {
    question: "What documents should default to local OCR?",
    answer:
      "Identity records, medical scans, legal exhibits, payroll paperwork, and other files containing personal or regulated data.",
  },
  {
    question: "Can local OCR be verified?",
    answer:
      "Yes. You can inspect the Network panel during a real OCR run and confirm that document bytes are not sent to a remote endpoint.",
  },
]

const memoryFaqs: TrancheFaq[] = [
  {
    question: "Why do browser PDF tools run out of memory?",
    answer:
      "Large scans, high-resolution images, and multi-step processing can force the browser to hold several copies of page data in memory at once.",
  },
  {
    question: "Does this mean local processing is flawed?",
    answer:
      "No. It means browser memory is a real constraint that needs workflow planning, especially for oversized documents.",
  },
  {
    question: "What should users do first when a large PDF fails?",
    answer:
      "Try splitting the file, compressing source scans, or running the job in smaller batches before repeating the operation.",
  },
  {
    question: "Will more RAM always fix the problem?",
    answer:
      "Not always. Browser limits, image density, and page count still matter, even on stronger machines.",
  },
]

export const expansionLearnPages: TrancheLearnArticle[] = [
  makeLearnArticle({
    slug: "offline-pdf-tools-for-law-firms",
    title: "Offline PDF Tools for Law Firms",
    metaTitle: "Offline PDF Tools for Law Firms | Plain Tools",
    metaDescription:
      "Offline PDF tools for law firms, with practical guidance for redaction, metadata hygiene, and privilege-sensitive document workflows. Runs locally in your browser. No uploads.",
    primaryQuery: "offline pdf tools for law firms",
    secondaryQueries: [
      "legal document privacy tools",
      "no upload pdf tools legal",
      "confidential pdf processing",
    ],
    intent: "trust",
    intro: [
      `Law firms should assume everyday PDF work can expose confidential material if the route is poorly chosen. ${REQUIRED_LOCAL_LINE}`,
      "This guide focuses on matter-file handling, redaction controls, metadata hygiene, and team procedures that are realistic under deadline pressure.",
    ],
    sections: [
      {
        id: "risk-points",
        heading: "Where legal PDF workflows usually leak risk",
        paragraphs: [
          "The highest-risk moments are usually ordinary ones: emailing bundles, extracting exhibits, redacting draft productions, and sending client documents through convenience tools.",
          "A local-first route reduces unnecessary third-party handling before the file ever leaves the matter team.",
        ],
        bullets: [
          "court bundles assembled from multiple confidential source files",
          "metadata left behind on draft pleadings or exhibits",
          "visual-only redactions that fail later in review",
          "staff defaulting to upload tools during time pressure",
        ],
      },
      {
        id: "recommended-stack",
        heading: "Recommended local-first workflow for matter files",
        paragraphs: [
          "Treat bundling, page extraction, metadata cleanup, and redaction as pre-share controls that should stay on the operator device by default.",
          "Only move to an external system once the file has been minimised and validated for the actual recipient.",
        ],
        bullets: [
          "split or extract only the pages needed for the recipient",
          "purge metadata before external sharing",
          "apply irreversible redaction rather than overlays",
          "keep the reviewed output separate from source matter files",
        ],
      },
      {
        id: "policy-template",
        heading: "Simple policy teams can actually follow",
        paragraphs: [
          "Good policy is recognisable in the middle of a busy day. Give staff one default route for sensitive PDFs instead of several optional routes that require judgment each time.",
          "Use a short checklist in handoff-heavy processes such as litigation support, due diligence, and client onboarding.",
        ],
        bullets: [
          "classify files as public, internal, confidential, or privilege-sensitive",
          "require local-first handling for confidential and privilege-sensitive classes",
          "record who reviewed redactions and metadata before release",
          "re-run verification after major tool or browser changes",
        ],
      },
      {
        id: "tooling",
        heading: "Useful local controls for law firms",
        paragraphs: [
          "Redaction and metadata removal matter more than feature breadth in confidentiality-heavy practice areas.",
          "For high-volume bundles, splitting and merging locally also keeps draft case material out of third-party queues.",
        ],
      },
    ],
    faqs: lawFirmFaqs,
    trustBox,
    nextSteps: links(
      ["Use Redact PDF locally", "/tools/redact-pdf"],
      ["Remove metadata before sharing", "/tools/metadata-purge"],
      ["How PDF redaction really works", "/learn/how-pdf-redaction-really-works"],
      ["PDF redaction checklist for compliance", "/learn/pdf-redaction-checklist-for-compliance"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/redact-pdf",
    relatedLearn: [
      "pdf-redaction-checklist-for-compliance",
      "how-pdf-redaction-really-works",
      "how-to-remove-pdf-metadata",
    ],
    verifyHref: "/verify-claims",
    disclaimer: "Informational only. This page does not replace legal advice or internal firm policy.",
  }),
  makeLearnArticle({
    slug: "offline-pdf-tools-for-healthcare-teams",
    title: "Offline PDF Tools for Healthcare Teams",
    metaTitle: "Offline PDF Tools for Healthcare Teams | Plain Tools",
    metaDescription:
      "Offline PDF tools for healthcare teams, with practical guidance for patient-document handling, OCR, redaction, and metadata cleanup. Runs locally in your browser. No uploads.",
    primaryQuery: "offline pdf tools for healthcare teams",
    secondaryQueries: [
      "private pdf tools healthcare",
      "no upload medical pdf tools",
      "patient document privacy pdf",
    ],
    intent: "trust",
    intro: [
      `Healthcare teams often handle PDFs that contain more data than the task actually requires. ${REQUIRED_LOCAL_LINE}`,
      "This guide focuses on how to minimise patient-document exposure during OCR, redaction, compression, and portal upload preparation.",
    ],
    sections: [
      {
        id: "exposure-points",
        heading: "Where patient-document exposure usually happens",
        paragraphs: [
          "Exposure often occurs in routine admin steps: scanning, compressing for portals, extracting specific pages, or forwarding records to another party.",
          "A local route does not solve everything, but it removes one avoidable transfer step in already sensitive workflows.",
        ],
        bullets: [
          "scanned records sent to cloud OCR for convenience",
          "full record packets shared when only a few pages were needed",
          "referrals and ID documents uploaded to generic conversion tools",
          "metadata or form history left in the exported file",
        ],
      },
      {
        id: "workflow",
        heading: "Practical local-first workflow for healthcare teams",
        paragraphs: [
          "Start with minimisation: extract only the pages needed, redact only what the receiving party should not see, and scrub metadata before any upload to a portal or system.",
          "If OCR is needed, use a local route for the first pass whenever the record contains patient-identifiable information.",
        ],
        bullets: [
          "extract relevant pages from the full record packet",
          "apply irreversible redaction where disclosures must be limited",
          "remove metadata before external submission",
          "compress only after readability checks on the final output",
        ],
      },
      {
        id: "safeguards",
        heading: "Operational safeguards that matter most",
        paragraphs: [
          "The main goal is to reduce accidental oversharing. A simple local-first default helps non-specialist staff make the safer choice quickly.",
          "Combine that with device hygiene and a second review step for external disclosures.",
        ],
        bullets: [
          "separate draft working copies from final disclosed copies",
          "require a second review for redacted patient documents",
          "document the approved route for OCR and portal uploads",
          "avoid reusing convenience tools outside the approved flow",
        ],
      },
      {
        id: "limitations",
        heading: "Limitations and common misunderstandings",
        paragraphs: [
          "Local processing helps narrow exposure, but it is not a blanket compliance answer. Device security, access control, and retention policy still matter.",
          "Use it as one concrete control in a broader patient-document handling process.",
        ],
      },
    ],
    faqs: healthcareFaqs,
    trustBox,
    nextSteps: links(
      ["Run offline OCR", "/tools/offline-ocr"],
      ["Scan for privacy risks", "/tools/privacy-scan"],
      ["Why you should never upload medical records", "/learn/why-you-should-never-upload-medical-records-to-pdf-tools"],
      ["Local vs cloud OCR privacy", "/learn/local-vs-cloud-ocr-privacy"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/offline-ocr",
    relatedLearn: [
      "local-vs-cloud-ocr-privacy",
      "why-you-should-never-upload-medical-records-to-pdf-tools",
      "how-to-remove-pdf-metadata",
    ],
    verifyHref: "/verify-claims",
    disclaimer: "Informational only. This page does not replace medical, legal, or compliance advice.",
  }),
  makeLearnArticle({
    slug: "pdf-redaction-checklist-for-compliance",
    title: "PDF Redaction Checklist for Compliance Teams",
    metaTitle: "PDF Redaction Checklist for Compliance Teams | Plain Tools",
    metaDescription:
      "A practical PDF redaction checklist for compliance teams, covering irreversible removal, metadata review, and validation before release. Runs locally in your browser. No uploads.",
    primaryQuery: "pdf redaction checklist",
    secondaryQueries: [
      "compliant pdf redaction",
      "secure redaction workflow",
      "irreversible redaction checklist",
    ],
    intent: "how-to",
    intro: [
      `Redaction failures are usually process failures, not just tool failures. ${REQUIRED_LOCAL_LINE}`,
      "Use this checklist to make redaction review consistent before disclosure, publication, or regulated submission.",
    ],
    sections: [
      {
        id: "before-you-start",
        heading: "Checklist before redaction starts",
        paragraphs: [
          "Define exactly what must be removed and why. Scope mistakes at the start create expensive rework later.",
          "Work from a copy, not the original source record, and confirm the correct version before marking anything.",
        ],
        bullets: [
          "confirm the disclosure version of the document",
          "mark all text, images, signatures, and identifiers in scope",
          "decide whether the recipient needs a partial extract rather than the full file",
          "keep the source copy unchanged for audit purposes",
        ],
      },
      {
        id: "apply-redaction",
        heading: "Checklist while applying redaction",
        paragraphs: [
          "Use a tool that actually removes underlying content rather than hiding it visually.",
          "Review each marked region after export, not just in the editing interface.",
        ],
        bullets: [
          "apply irreversible redaction instead of black overlays",
          "check page thumbnails and exports for missed regions",
          "flatten or rebuild output where the tool requires it",
          "avoid mixing markup comments with the final release copy",
        ],
      },
      {
        id: "validate-output",
        heading: "Checklist after export",
        paragraphs: [
          "Validation should include content, metadata, and copy-and-paste tests where relevant.",
          "If the output will leave the organisation, do the final check in a separate viewer to avoid being misled by editor state.",
        ],
        bullets: [
          "copy and paste around redacted areas to confirm text is gone",
          "search for names, IDs, and terms that should no longer exist",
          "remove metadata and inspect the cleaned output",
          "record reviewer name and review date for release control",
        ],
      },
      {
        id: "team-sop",
        heading: "Turn the checklist into a team SOP",
        paragraphs: [
          "Redaction control works best when the checklist is short enough to survive real operations. Keep it visible at the release point, not hidden in a long policy document.",
          "Pair the checklist with a local-first default so staff are not forced to decide the route each time.",
        ],
      },
    ],
    faqs: complianceFaqs,
    trustBox,
    nextSteps: links(
      ["Use Redact PDF locally", "/tools/redact-pdf"],
      ["Remove PDF metadata", "/tools/metadata-purge"],
      ["How PDF redaction really works", "/learn/how-pdf-redaction-really-works"],
      ["Offline PDF tools for law firms", "/learn/offline-pdf-tools-for-law-firms"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/redact-pdf",
    relatedLearn: [
      "offline-pdf-tools-for-law-firms",
      "how-pdf-redaction-really-works",
      "what-is-pdf-metadata-and-why-it-matters",
    ],
    verifyHref: "/verify-claims",
  }),
  makeLearnArticle({
    slug: "local-vs-cloud-ocr-privacy",
    title: "Local vs Cloud OCR Privacy",
    metaTitle: "Local vs Cloud OCR Privacy | Plain Tools",
    metaDescription:
      "Compare local and cloud OCR privacy trade-offs for scanned PDFs, with practical guidance for sensitive document workflows. Runs locally in your browser. No uploads.",
    primaryQuery: "local vs cloud ocr privacy",
    secondaryQueries: [
      "offline ocr privacy",
      "cloud ocr risk",
      "private ocr workflow",
    ],
    intent: "trust",
    intro: [
      `OCR can be one of the most privacy-sensitive PDF steps because the input is often a scan of an identity, legal, or medical document. ${REQUIRED_LOCAL_LINE}`,
      "This page compares local and cloud OCR by data flow, operational fit, and the kinds of documents that should default to the safer route.",
    ],
    sections: [
      {
        id: "ocr-flow",
        heading: "Why OCR changes the privacy conversation",
        paragraphs: [
          "OCR does more than display a file. It extracts machine-readable text from every page image, which can turn a scan into searchable, reusable data.",
          "That makes the OCR route more consequential than a simple view or download step.",
        ],
      },
      {
        id: "cloud-risk",
        heading: "Cloud OCR risk model",
        paragraphs: [
          "Cloud OCR adds transmission to a third-party processor, plus questions about retention, logging, queueing, and policy scope.",
          "That can still be acceptable for low-sensitivity work, but it creates more to evaluate and more to govern.",
        ],
        bullets: [
          "uploaded page images may contain more information than the task requires",
          "extracted text can be more reusable than the original scan",
          "policy and retention review becomes part of the workflow",
        ],
      },
      {
        id: "local-risk",
        heading: "Local OCR risk model",
        paragraphs: [
          "Local OCR keeps the scan and extracted text on the device running the job. That usually makes the route easier to explain and easier to verify.",
          "The main trade-offs are device performance, browser limits, and the need for disciplined endpoint handling.",
        ],
      },
      {
        id: "decision-framework",
        heading: "A practical decision framework",
        paragraphs: [
          "Default to local OCR when the scan contains personal identifiers, confidential client material, or any record you would hesitate to upload to a generic service.",
          "Use cloud OCR only where the document class and governance model make that route acceptable on purpose, not by habit.",
        ],
      },
    ],
    faqs: ocrFaqs,
    trustBox,
    nextSteps: links(
      ["Run offline OCR", "/tools/offline-ocr"],
      ["Read OCR without cloud", "/learn/ocr-pdf-without-cloud"],
      ["Offline PDF tools for healthcare teams", "/learn/offline-pdf-tools-for-healthcare-teams"],
      ["Compare offline vs online PDF tools", "/compare/offline-vs-online-pdf-tools"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/offline-ocr",
    relatedLearn: [
      "ocr-pdf-without-cloud",
      "offline-pdf-tools-for-healthcare-teams",
      "why-pdf-uploads-are-risky",
    ],
    verifyHref: "/verify-claims",
  }),
  makeLearnArticle({
    slug: "browser-memory-limits-for-pdf-tools",
    title: "Browser Memory Limits for PDF Tools",
    metaTitle: "Browser Memory Limits for PDF Tools | Plain Tools",
    metaDescription:
      "Why browser PDF tools hit memory limits on large files, with practical mitigation steps for local processing workflows. Runs locally in your browser. No uploads.",
    primaryQuery: "browser memory limits for pdf tools",
    secondaryQueries: [
      "large pdf browser limits",
      "pdf processing out of memory",
      "client side pdf performance",
    ],
    intent: "evergreen",
    intro: [
      `Local processing removes upload latency, but it does not remove the physics of large documents. ${REQUIRED_LOCAL_LINE}`,
      "This guide explains why memory pressure appears in browser-based PDF work and what to do before assuming the tool is broken.",
    ],
    sections: [
      {
        id: "why-it-happens",
        heading: "Why memory limits happen in browser PDF workflows",
        paragraphs: [
          "A large PDF can expand dramatically during processing. Scanned images, decompressed assets, thumbnails, and intermediate outputs can each consume more memory than the file size suggests.",
          "That means a 300 MB upload is not the same thing as a 300 MB in-memory job.",
        ],
      },
      {
        id: "warning-signs",
        heading: "Signs a job is about to fail",
        paragraphs: [
          "Slow thumbnail rendering, browser-tab freezes, sudden crashes, and jobs that stall during export are common signs of memory pressure.",
          "These problems show up most often with long scan bundles, image-heavy documents, and repeated transformations in one session.",
        ],
        bullets: [
          "very long scanned PDFs",
          "high-resolution images embedded on many pages",
          "running merge, OCR, and compression on the same giant file in one pass",
        ],
      },
      {
        id: "mitigation",
        heading: "What to do instead",
        paragraphs: [
          "Split the workload into smaller steps. That usually works better than repeating the same oversized job and hoping the browser behaves differently.",
          "If the source is image-heavy, compress or split before heavier processing such as OCR or batch export.",
        ],
        bullets: [
          "split large files before OCR or visual conversion",
          "batch long jobs into smaller sections",
          "close other heavy tabs before retrying",
          "use compression or extraction to narrow the working set first",
        ],
      },
      {
        id: "operational-policy",
        heading: "Set expectations for large-file handling",
        paragraphs: [
          "Teams get better results when they define a threshold for when to split first, when to batch, and when to expect slower processing.",
          "That turns a frustrating failure mode into a predictable workflow decision.",
        ],
      },
    ],
    faqs: memoryFaqs,
    trustBox,
    nextSteps: links(
      ["Run the batch engine", "/tools/batch-engine"],
      ["Compress PDF locally", "/tools/compress-pdf"],
      ["Why offline compression has limits", "/learn/why-offline-compression-has-limits"],
      ["Split PDF for email attachments", "/learn/workflows/split-pdf-for-email-attachments"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/batch-engine",
    relatedLearn: [
      "why-offline-compression-has-limits",
      "how-pdfs-work",
      "local-vs-cloud-ocr-privacy",
    ],
    verifyHref: "/verify-claims",
  }),
]
export const expansionGlossaryPages: TrancheLearnArticle[] = [
  makeLearnArticle({
    slug: "what-is-xmp-in-pdf",
    title: "What Is XMP in PDF?",
    metaTitle: "What Is XMP in PDF? | Plain Tools",
    metaDescription:
      "A plain-language explanation of XMP in PDF files, where it appears, and why it matters for privacy and metadata cleanup. Runs locally in your browser. No uploads.",
    primaryQuery: "what is xmp in pdf",
    secondaryQueries: ["pdf xmp metadata", "xmp packet pdf", "remove xmp from pdf"],
    intent: "evergreen",
    intro: [
      `XMP is one of the metadata layers that can travel quietly with a PDF. ${REQUIRED_LOCAL_LINE}`,
      "If you share documents outside your organisation, understanding XMP helps you decide what should be inspected and cleaned before release.",
    ],
    sections: [
      {
        id: "definition",
        heading: "XMP in plain language",
        paragraphs: [
          "XMP stands for Extensible Metadata Platform. In PDFs, it is a structured metadata block used to store information about the file.",
          "It can include authoring details, titles, subjects, keywords, timestamps, and workflow-related properties.",
        ],
      },
      {
        id: "where-it-lives",
        heading: "Where XMP appears in a PDF",
        paragraphs: [
          "XMP is not usually visible in the document body. It lives in the file structure and travels with the PDF unless it is intentionally removed or replaced.",
          "That makes it easy to forget during ordinary sharing workflows.",
        ],
      },
      {
        id: "why-it-matters",
        heading: "Why XMP matters for privacy",
        paragraphs: [
          "Metadata can reveal more than the visible pages do. Even when the document looks clean, XMP may preserve authoring or workflow clues that are unnecessary for the recipient.",
          "For sensitive sharing, it should be treated as part of the disclosure surface.",
        ],
      },
      {
        id: "inspection",
        heading: "How to inspect and remove XMP",
        paragraphs: [
          "The practical approach is simple: check metadata before sharing, then remove it if the recipient does not need it.",
          "Local metadata-purge workflows help teams reduce hidden-data leakage without uploading the file to a third party.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is XMP the same as visible PDF content?",
        answer:
          "No. XMP is metadata stored in the file structure, not the visible page content itself.",
      },
      {
        question: "Can XMP contain sensitive information?",
        answer:
          "Yes. Depending on the workflow, it may contain authorship, timestamps, subjects, tags, and other context the recipient does not need.",
      },
      {
        question: "Should XMP always be removed?",
        answer:
          "Not always. Remove it when the metadata is unnecessary or could leak context. Keep it when there is a documented operational reason.",
      },
      {
        question: "How is XMP different from the Info Dictionary?",
        answer:
          "Both store metadata, but they are separate structures. Many PDFs can contain one, the other, or both.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Metadata Purge locally", "/tools/metadata-purge"],
      ["Read: What is PDF metadata?", "/learn/what-is-pdf-metadata-and-why-it-matters"],
      ["Read: What is the PDF Info Dictionary?", "/learn/glossary/what-is-pdf-info-dictionary"],
      ["Remove metadata before sharing PDF", "/learn/workflows/remove-metadata-before-sharing-pdf"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/metadata-purge",
    relatedLearn: [
      "what-is-pdf-metadata-and-why-it-matters",
      "how-to-remove-pdf-metadata",
      "browser-memory-limits-for-pdf-tools",
    ],
    verifyHref: "/verify-claims",
  }),
  makeLearnArticle({
    slug: "what-is-pdf-info-dictionary",
    title: "What Is the PDF Info Dictionary?",
    metaTitle: "What Is the PDF Info Dictionary? | Plain Tools",
    metaDescription:
      "A practical guide to the PDF Info Dictionary, common metadata fields, and why they matter before sharing a PDF. Runs locally in your browser. No uploads.",
    primaryQuery: "pdf info dictionary",
    secondaryQueries: [
      "document info dictionary pdf",
      "pdf properties fields",
      "pdf metadata fields",
    ],
    intent: "evergreen",
    intro: [
      `The PDF Info Dictionary is one of the classic places where file metadata lives. ${REQUIRED_LOCAL_LINE}`,
      "If you send PDFs outside your immediate team, these fields are worth understanding because they often survive routine document handling.",
    ],
    sections: [
      {
        id: "basics",
        heading: "What the Info Dictionary does",
        paragraphs: [
          "The Info Dictionary stores basic descriptive properties for a PDF, such as title, author, subject, keywords, creator, and producer.",
          "These fields can be harmless, useful, or sensitive depending on the workflow and recipient.",
        ],
      },
      {
        id: "common-fields",
        heading: "Common fields that can leak context",
        paragraphs: [
          "Author, creator, producer, and timestamps are the usual places to start. They can reveal who made the file, with what software, and sometimes when it moved through a workflow.",
          "That is often more context than the recipient needs.",
        ],
      },
      {
        id: "xmp-difference",
        heading: "How it differs from XMP",
        paragraphs: [
          "The Info Dictionary and XMP are related but separate metadata layers. A PDF can hold overlapping information in both places.",
          "That is why a proper metadata cleanup workflow should consider more than one field set.",
        ],
      },
      {
        id: "cleanup",
        heading: "How to review and clean it",
        paragraphs: [
          "Before external sharing, inspect metadata and decide whether those properties are still needed.",
          "If not, remove them locally so the visible document and the hidden metadata tell the same story.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the PDF Info Dictionary visible on the page?",
        answer:
          "No. It is part of the file structure, not the visible document body.",
      },
      {
        question: "Can the Info Dictionary identify who created a document?",
        answer:
          "Yes. Author, creator, producer, and related fields can expose workflow details or authorship clues.",
      },
      {
        question: "Do I need to clean both XMP and the Info Dictionary?",
        answer:
          "Often yes. If the goal is metadata minimisation, it is safer to review and clean both layers rather than assuming one field set is enough.",
      },
      {
        question: "Is metadata cleanup always appropriate?",
        answer:
          "Only when it aligns with the workflow. Some archival or internal uses may intentionally keep metadata, but external sharing often benefits from minimisation.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Metadata Purge locally", "/tools/metadata-purge"],
      ["Read: What is XMP in PDF?", "/learn/glossary/what-is-xmp-in-pdf"],
      ["Read: What is PDF metadata?", "/learn/what-is-pdf-metadata-and-why-it-matters"],
      ["Remove metadata before sharing PDF", "/learn/workflows/remove-metadata-before-sharing-pdf"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHref: "/tools/metadata-purge",
    relatedLearn: [
      "what-is-pdf-metadata-and-why-it-matters",
      "how-to-remove-pdf-metadata",
      "offline-pdf-tools-for-law-firms",
    ],
    verifyHref: "/verify-claims",
  }),
]

export const expansionComparePages: TrancheComparePage[] = [
  makeComparePage({
    slug: "plain-vs-pdfcandy",
    title: "Plain vs PDFCandy",
    metaTitle: "Plain vs PDFCandy | Plain Tools",
    metaDescription:
      "Compare Plain and PDFCandy on privacy handling, upload requirements, workflow speed, and fit for sensitive PDF work. Runs locally in your browser. No uploads.",
    primaryQuery: "pdfcandy alternative",
    secondaryQueries: ["plain vs pdfcandy", "pdfcandy privacy", "no upload pdfcandy alternative"],
    intent: "comparison",
    competitorName: "PDFCandy",
    intro: [
      `PDFCandy and Plain solve many of the same user tasks, but they sit on different handling models. ${REQUIRED_LOCAL_LINE}`,
      "This comparison focuses on data flow, verification effort, and day-to-day suitability for sensitive documents.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core workflow", plain: "No for local-first core tools", competitor: "Often yes for hosted conversion paths" },
      { feature: "Verification effort", plain: "Low: validate one real job in DevTools", competitor: "Higher: depends on route and provider transparency" },
      { feature: "Operational speed", plain: "No upload and download round trip for local jobs", competitor: "Includes transfer time for hosted flows" },
      { feature: "Best fit", plain: "Sensitive files and controlled document handling", competitor: "General convenience workflows" },
    ],
    sections: [
      {
        id: "quick-summary",
        heading: "Quick summary",
        paragraphs: [
          "If the priority is minimising third-party handling, Plain is the clearer route because the local model is easier to recognise and verify.",
          "If the priority is a broad hosted utility suite, PDFCandy may still suit lower-sensitivity workflows.",
        ],
      },
      {
        id: "privacy-model",
        heading: "Privacy model comparison",
        paragraphs: [
          "The core difference is whether the file must leave the device for the job to happen. That distinction matters much more than cosmetic UI similarity.",
          "For sensitive work, the simpler route is usually the safer route because staff can follow it consistently.",
        ],
      },
      {
        id: "workflow-fit",
        heading: "Workflow fit",
        paragraphs: [
          "Choose Plain when policy or professional judgment requires no-upload defaults.",
          "Choose PDFCandy when you explicitly accept hosted processing for the specific task and document class.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Plain a PDFCandy alternative for private workflows?",
        answer:
          "Yes. Plain is especially relevant where the deciding factor is local-first processing rather than a hosted conversion route.",
      },
      {
        question: "What should teams compare first?",
        answer:
          "Compare upload behaviour, verification effort, and how easy the approved route is to recognise under time pressure.",
      },
      {
        question: "Does this mean PDFCandy is always unsuitable?",
        answer:
          "No. It can still fit lower-sensitivity work. The point is to match the route to the document class instead of defaulting blindly.",
      },
      {
        question: "How can I verify the difference myself?",
        answer:
          "Run the same task in both tools and inspect network requests during a real file operation.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Merge PDF locally", "/tools/merge-pdf"],
      ["Use Compress PDF locally", "/tools/compress-pdf"],
      ["No uploads explained", "/learn/no-uploads-explained"],
      ["How to verify a PDF tool does not upload your files", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHrefs: ["/tools/merge-pdf", "/tools/compress-pdf"],
    relatedLearn: ["no-uploads-explained", "how-to-verify-a-pdf-tool-doesnt-upload-your-files"],
    verifyHref: "/verify-claims",
    disclaimer:
      "Informational comparison only. Verify current product behaviour in your own environment before standardising a route.",
  }),
  makeComparePage({
    slug: "plain-vs-lightpdf",
    title: "Plain vs LightPDF",
    metaTitle: "Plain vs LightPDF | Plain Tools",
    metaDescription:
      "Compare Plain and LightPDF on upload handling, workflow clarity, and practical privacy controls for PDF work. Runs locally in your browser. No uploads.",
    primaryQuery: "lightpdf alternative",
    secondaryQueries: ["plain vs lightpdf", "lightpdf privacy", "offline lightpdf alternative"],
    intent: "comparison",
    competitorName: "LightPDF",
    intro: [
      `Plain and LightPDF can overlap in user intent, but they are not equivalent from a handling and verification standpoint. ${REQUIRED_LOCAL_LINE}`,
      "Use this page when the key question is whether your team needs a clear no-upload default or is comfortable with hosted processing routes.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core workflow", plain: "No for local-first core tools", competitor: "Usually yes for hosted processing routes" },
      { feature: "Route clarity", plain: "Single local-first model for core PDF work", competitor: "Cloud-oriented route selection" },
      { feature: "Verification path", plain: "Direct browser-level testing", competitor: "More dependent on provider claims and settings" },
      { feature: "Best fit", plain: "Sensitive and verification-heavy workflows", competitor: "Hosted convenience workflows" },
    ],
    sections: [
      {
        id: "core-difference",
        heading: "The core difference",
        paragraphs: [
          "The important distinction is not brand positioning. It is whether the operator can complete the task without introducing a third-party transfer step.",
          "That difference becomes more valuable as document sensitivity rises.",
        ],
      },
      {
        id: "privacy-verification",
        heading: "Privacy and verification",
        paragraphs: [
          "Plain gives teams a short, repeatable verification route for core tools. That matters when the organisation wants technical confirmation rather than policy language alone.",
          "Hosted tools require more trust in external controls and more care in route selection.",
        ],
      },
      {
        id: "who-should-pick-which",
        heading: "Who should pick which",
        paragraphs: [
          "Pick Plain for confidentiality-sensitive routine work, especially when mixed-skill staff need a clear default.",
          "Pick LightPDF when hosted convenience is acceptable for the task and document type.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Plain a LightPDF alternative for private PDF workflows?",
        answer:
          "Yes. It is a strong alternative when you want local-first handling and direct verification for core PDF tasks.",
      },
      {
        question: "What matters more than feature count here?",
        answer:
          "Upload behaviour, route clarity, and whether staff can execute the approved workflow consistently.",
      },
      {
        question: "Can hosted routes still make sense?",
        answer:
          "Yes, for lower-sensitivity work or where an organisation has deliberately accepted the hosted model.",
      },
      {
        question: "How should teams evaluate the choice?",
        answer:
          "Test the same files and the same tasks, then compare transfer behaviour, speed, and review burden.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Batch Engine locally", "/tools/batch-engine"],
      ["Use Merge PDF locally", "/tools/merge-pdf"],
      ["Why PDF uploads are risky", "/learn/why-pdf-uploads-are-risky"],
      ["Offline PDF tools for law firms", "/learn/offline-pdf-tools-for-law-firms"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHrefs: ["/tools/batch-engine", "/tools/merge-pdf"],
    relatedLearn: ["why-pdf-uploads-are-risky", "offline-pdf-tools-for-law-firms"],
    verifyHref: "/verify-claims",
    disclaimer:
      "Informational comparison only. Verify current product behaviour in your own environment before rollout.",
  }),
  makeComparePage({
    slug: "plain-vs-sodapdf",
    title: "Plain vs SodaPDF",
    metaTitle: "Plain vs SodaPDF | Plain Tools",
    metaDescription:
      "Compare Plain and SodaPDF for no-upload handling, privacy verification, and practical fit for sensitive PDFs. Runs locally in your browser. No uploads.",
    primaryQuery: "sodapdf alternative",
    secondaryQueries: ["plain vs sodapdf", "sodapdf privacy", "offline sodapdf alternative"],
    intent: "comparison",
    competitorName: "SodaPDF",
    intro: [
      `Plain and SodaPDF differ most in where processing happens and how much trust the operator must place in the route. ${REQUIRED_LOCAL_LINE}`,
      "This comparison is aimed at teams deciding whether they need a local-first default for confidential documents.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core workflow", plain: "No for local-first core tools", competitor: "Usually yes for hosted workflows" },
      { feature: "Workflow control", plain: "Operator keeps document on-device for core jobs", competitor: "Provider-managed route for hosted processing" },
      { feature: "Verification effort", plain: "Short local verification path", competitor: "Depends on provider controls and route choice" },
      { feature: "Best fit", plain: "No-upload defaults and sensitive PDFs", competitor: "Hosted document operations and account-led workflows" },
    ],
    sections: [
      {
        id: "positioning",
        heading: "Positioning summary",
        paragraphs: [
          "SodaPDF can suit account-based, hosted document workflows. Plain is stronger where teams want the handling route itself to stay simple and visible.",
          "That difference matters most when the file is confidential rather than merely inconvenient to lose.",
        ],
      },
      {
        id: "control-model",
        heading: "Control model comparison",
        paragraphs: [
          "A local-first route keeps the sensitive preprocessing steps close to the user. That usually reduces governance overhead for routine operations.",
          "A hosted route can still be acceptable, but it needs clearer justification and more operational discipline.",
        ],
      },
      {
        id: "practical-guidance",
        heading: "Practical guidance",
        paragraphs: [
          "Choose Plain when the organisation wants a straightforward no-upload default for core work.",
          "Choose SodaPDF when hosted workflow features are the priority and the document class permits that route.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Plain a SodaPDF alternative for sensitive documents?",
        answer:
          "Yes. It is especially relevant when the main requirement is local-first processing and low verification overhead.",
      },
      {
        question: "What is the main trade-off?",
        answer:
          "The trade-off is between local route control and hosted-service convenience, not simply between two feature lists.",
      },
      {
        question: "Why does verification effort matter?",
        answer:
          "Because the safest workflow is usually the one staff can recognise and repeat without extra interpretation.",
      },
      {
        question: "How can I test the difference?",
        answer:
          "Run one representative job in each tool and compare the network activity, transfer steps, and review burden.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Merge PDF locally", "/tools/merge-pdf"],
      ["Use Metadata Purge locally", "/tools/metadata-purge"],
      ["No uploads explained", "/learn/no-uploads-explained"],
      ["PDF redaction checklist for compliance", "/learn/pdf-redaction-checklist-for-compliance"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHrefs: ["/tools/merge-pdf", "/tools/metadata-purge"],
    relatedLearn: ["no-uploads-explained", "pdf-redaction-checklist-for-compliance"],
    verifyHref: "/verify-claims",
    disclaimer:
      "Informational comparison only. Verify current product behaviour in your own environment before standardising it.",
  }),
  makeComparePage({
    slug: "plain-vs-pdfgear",
    title: "Plain vs PDFgear",
    metaTitle: "Plain vs PDFgear | Plain Tools",
    metaDescription:
      "Compare Plain and PDFgear for privacy handling, upload behaviour, and practical fit for no-upload PDF workflows. Runs locally in your browser. No uploads.",
    primaryQuery: "pdfgear alternative",
    secondaryQueries: ["plain vs pdfgear", "pdfgear privacy", "no upload pdfgear alternative"],
    intent: "comparison",
    competitorName: "PDFgear",
    intro: [
      `Plain and PDFgear overlap on common PDF tasks, but the important question is still processing route rather than marketing category. ${REQUIRED_LOCAL_LINE}`,
      "Use this page to compare architecture, verification effort, and operational fit for confidential work.",
    ],
    comparisonRows: [
      { feature: "Uploads required for core workflow", plain: "No for local-first core tools", competitor: "Depends on route and feature path" },
      { feature: "Route predictability", plain: "Clear local-first path for core tools", competitor: "Can vary by chosen workflow" },
      { feature: "Verification effort", plain: "Short and direct", competitor: "May require more route-specific checking" },
      { feature: "Best fit", plain: "Teams needing a simple no-upload default", competitor: "Teams comfortable evaluating route differences per task" },
    ],
    sections: [
      {
        id: "summary",
        heading: "Quick summary",
        paragraphs: [
          "If your organisation wants one obvious local-first default, Plain is easier to standardise.",
          "If you are comfortable evaluating route differences per workflow, PDFgear may still suit some lower-sensitivity tasks.",
        ],
      },
      {
        id: "route-behaviour",
        heading: "Why route behaviour matters more than labels",
        paragraphs: [
          "Teams often choose tools by brand familiarity, but the bigger operational question is whether a user can tell, quickly and reliably, what happens to the file.",
          "That is where simpler local-first tools tend to outperform route-dependent alternatives.",
        ],
      },
      {
        id: "practical-fit",
        heading: "Practical fit by workflow",
        paragraphs: [
          "Use Plain when the workflow must stay predictable for staff handling legal, HR, medical, or financial PDFs.",
          "Use PDFgear where the accepted route is documented and the organisation is comfortable verifying feature-specific behaviour.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Plain a PDFgear alternative for no-upload workflows?",
        answer:
          "Yes. It is especially relevant when the requirement is a consistent local-first route for core PDF work.",
      },
      {
        question: "What should I compare beyond features?",
        answer:
          "Compare route predictability, verification effort, and how much policy discipline the workflow needs to stay safe.",
      },
      {
        question: "Does one tool win for every user?",
        answer:
          "No. The better option depends on document sensitivity and whether your organisation prefers a single default route or feature-by-feature evaluation.",
      },
      {
        question: "How should teams test this fairly?",
        answer:
          "Use the same files, the same tasks, and the same verification checklist in both tools before deciding.",
      },
    ],
    trustBox,
    nextSteps: links(
      ["Use Compare PDF locally", "/tools/compare-pdf"],
      ["Use Merge PDF locally", "/tools/merge-pdf"],
      ["How to verify a PDF tool does not upload your files", "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files"],
      ["Browser memory limits for PDF tools", "/learn/browser-memory-limits-for-pdf-tools"],
      ["Verify claims", "/verify-claims"]
    ),
    toolHrefs: ["/tools/compare-pdf", "/tools/merge-pdf"],
    relatedLearn: [
      "how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "browser-memory-limits-for-pdf-tools",
    ],
    verifyHref: "/verify-claims",
    disclaimer:
      "Informational comparison only. Verify current product behaviour in your own environment before standardising a route.",
  }),
]

const learnMap = new Map(expansionLearnPages.map((entry) => [entry.slug, entry]))
const glossaryMap = new Map(expansionGlossaryPages.map((entry) => [entry.slug, entry]))
const compareMap = new Map(expansionComparePages.map((entry) => [entry.slug, entry]))

export function getExpansionLearnArticleOrThrow(slug: string) {
  const article = learnMap.get(slug)
  if (!article) {
    throw new Error(`Missing expansion learn article for slug: ${slug}`)
  }
  return article
}

export function getExpansionGlossaryArticleOrThrow(slug: string) {
  const article = glossaryMap.get(slug)
  if (!article) {
    throw new Error(`Missing glossary article for slug: ${slug}`)
  }
  return article
}

export function getExpansionComparePageOrThrow(slug: string) {
  const page = compareMap.get(slug)
  if (!page) {
    throw new Error(`Missing expansion compare page for slug: ${slug}`)
  }
  return page
}

export const expansionLearnSlugs = expansionLearnPages.map((entry) => entry.slug)
export const expansionGlossarySlugs = expansionGlossaryPages.map((entry) => entry.slug)
export const expansionCompareSlugs = expansionComparePages.map((entry) => entry.slug)

export const expansionSitemapUrls = [
  ...expansionLearnSlugs.map((slug) => `/learn/${slug}`),
  ...expansionGlossarySlugs.map((slug) => `/learn/glossary/${slug}`),
  ...expansionCompareSlugs.map((slug) => `/compare/${slug}`),
]

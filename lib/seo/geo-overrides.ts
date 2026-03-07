export type LearnGeoOverride = {
  summary?: string
  whenToUse?: string[]
  steps?: string[]
  limitations?: string[]
  privacyNote?: string
  relatedQuestions?: string[]
}

export type CompareGeoOverride = {
  quickAnswer?: string
  privacyDifferences?: string[]
  workflowDifferences?: string[]
  bestFor?: string[]
  whenPlainBetter?: string[]
  whenOtherBetter?: string[]
}

export const LEARN_GEO_OVERRIDES: Record<string, LearnGeoOverride> = {
  "how-to-merge-pdfs-offline": {
    summary:
      "Use this when you need one clean PDF from multiple files without exposing document bytes to a hosted processor. Runs locally in your browser. No uploads.",
    whenToUse: [
      "You need one submission file for portals, onboarding, or procurement workflows.",
      "You are merging documents that include personal, legal, or financial information.",
      "You need predictable page order and filename control before sharing.",
    ],
    steps: [
      "Place files in final order and rename them before uploading to the tool.",
      "Merge once, then review first page, last page, and any critical signed pages.",
      "Download the merged file and keep source documents unchanged for traceability.",
    ],
    limitations: [
      "Scanned source quality is not improved by merging.",
      "Corrupt source files can fail the merge and should be replaced upstream.",
      "Very large batches are limited by browser memory on lower-end devices.",
    ],
    relatedQuestions: [
      "Can I merge password-protected files?",
      "How do I preserve page order for formal submissions?",
      "Should I compress before or after merging?",
      "How can I verify no uploads occurred?",
    ],
  },
  "compress-pdf-without-losing-quality": {
    summary:
      "Compression is a trade-off. Start with light optimisation, validate readability, then only increase compression if you still miss the size target. Runs locally in your browser. No uploads.",
    whenToUse: [
      "Your file exceeds portal or email attachment limits.",
      "You need to reduce transfer size while keeping text readable.",
      "You want a private workflow for sensitive internal documents.",
    ],
    steps: [
      "Start with Light mode and record before/after size.",
      "If needed, try Medium and re-check text clarity, charts, and signatures.",
      "Use Strong only when size is critical and image-style output is acceptable.",
    ],
    limitations: [
      "Strong compression can flatten selectable text into page images.",
      "Already-optimised PDFs may show minimal size improvement.",
      "Image-heavy scans can lose detail under aggressive settings.",
    ],
    relatedQuestions: [
      "Why did strong mode reduce text quality?",
      "Which mode is safest for contracts?",
      "Can compression increase file size?",
      "How should I validate output before sending?",
    ],
  },
  "how-to-sign-a-pdf-without-uploading-it": {
    summary:
      "This guide covers local, visual PDF signing for routine workflows where privacy and speed matter. Runs locally in your browser. No uploads.",
    whenToUse: [
      "You need a visible signature on internal approvals or form submissions.",
      "You cannot send files to external signing platforms for policy reasons.",
      "You need a fast signature workflow on desktop or mobile.",
    ],
    steps: [
      "Load the PDF and create a signature by drawing or typing.",
      "Choose the page and approximate position before applying.",
      "Export signed output and review placement in a second viewer.",
    ],
    limitations: [
      "Visual signatures are not the same as certificate-based digital signatures.",
      "Placement precision is limited on very dense page layouts.",
      "If legal enforceability is required, confirm jurisdiction-specific requirements.",
    ],
    relatedQuestions: [
      "Is a visual signature legally equivalent to a certificate signature?",
      "Can I sign on mobile touch screens?",
      "How do I move the signature if placement is wrong?",
      "Can I verify this tool does not upload my PDF?",
    ],
  },
  "private-pdf-tools": {
    summary:
      "Private PDF workflows are chosen by architecture, not marketing claims. Prioritise tools you can test directly in your own browser. Runs locally in your browser. No uploads.",
    whenToUse: [
      "You regularly handle HR, legal, healthcare, or financial PDFs.",
      "Your team needs a practical no-upload baseline for common tasks.",
      "You want a repeatable verification checklist for procurement and governance.",
    ],
    steps: [
      "Define which document classes must stay in local-only workflows.",
      "Run one real operation and inspect network requests in DevTools.",
      "Record accepted tools, limits, and validation steps as team policy.",
    ],
    limitations: [
      "Local tools still depend on endpoint hygiene and access control.",
      "Browser memory limits can affect very large files.",
      "Not every feature in cloud suites has a local equivalent.",
    ],
    relatedQuestions: [
      "What makes a PDF tool genuinely private?",
      "How do I verify no upload claims myself?",
      "When should I still use a hosted workflow?",
      "Which tasks are safest to keep local-first?",
    ],
  },
  "is-it-down-for-everyone-or-just-me": {
    summary:
      "Status checks help distinguish local connection issues from broad service outages. Use a repeatable process before escalating incidents.",
    whenToUse: [
      "A major website does not load from your device.",
      "Your team needs a quick sanity check before opening an incident.",
      "You need to confirm whether DNS, latency, or service availability is failing.",
    ],
    steps: [
      "Check canonical status page for the target domain.",
      "Run a DNS lookup and IP check to isolate resolver or routing issues.",
      "Retry from another network before concluding a global outage.",
    ],
    limitations: [
      "A single check cannot confirm global multi-region status.",
      "Firewalls and local DNS can cause false down signals.",
      "Some sites block probe patterns and can appear intermittently down.",
    ],
    relatedQuestions: [
      "Why can a site be up for others but down for me?",
      "What does response time actually indicate?",
      "When should I clear DNS cache and retry?",
      "Where can I check related network diagnostics?",
    ],
  },
}

export const COMPARE_GEO_OVERRIDES: Record<string, CompareGeoOverride> = {
  "plain-vs-smallpdf": {
    quickAnswer:
      "If your priority is no-upload handling for sensitive files, Plain Tools is usually the stronger fit. If you need an account-centric cloud workflow, Smallpdf may suit better.",
    privacyDifferences: [
      "Plain Tools core workflows process files in-browser without upload.",
      "Smallpdf workflows are typically cloud-mediated and policy-governed.",
      "Plain Tools can be validated directly through browser network inspection.",
    ],
    workflowDifferences: [
      "Plain Tools avoids upload/download round-trips for local tools.",
      "Smallpdf can be convenient for account-based cross-device routing.",
      "Large-file handling depends on local device resources versus cloud queues.",
    ],
  },
  "plain-vs-ilovepdf": {
    quickAnswer:
      "Choose Plain Tools when you need local-first privacy controls. Choose iLovePDF when hosted convenience and account workflows matter more than no-upload architecture.",
    privacyDifferences: [
      "Plain Tools keeps core processing local to the browser session.",
      "iLovePDF workflows are generally upload-based for processing.",
      "Verification is simpler in local-first workflows using DevTools checks.",
    ],
    workflowDifferences: [
      "Plain Tools is faster for repeated local operations on stable devices.",
      "iLovePDF can simplify cloud access across multiple machines.",
      "Network quality affects cloud workflow consistency more heavily.",
    ],
  },
  "plain-vs-adobe-acrobat-online": {
    quickAnswer:
      "For strict no-upload requirements and straightforward local tasks, Plain Tools is often the better fit. For enterprise account governance and broader hosted suite workflows, Adobe Acrobat Online may fit better.",
    privacyDifferences: [
      "Plain Tools emphasises local browser processing for core flows.",
      "Adobe Acrobat Online is designed around cloud service workflows.",
      "Local-first behaviour is directly testable in-browser before adoption.",
    ],
    workflowDifferences: [
      "Plain Tools reduces transfer friction for routine private operations.",
      "Adobe can be stronger for integrated enterprise account ecosystems.",
      "Cloud-first workflows depend on policy settings and service routing.",
    ],
  },
}

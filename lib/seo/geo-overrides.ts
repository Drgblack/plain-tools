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
  "why-pdf-uploads-are-risky": {
    summary:
      "Uploading sensitive PDFs to random tools creates avoidable exposure. Prefer local-first workflows when documents contain personal, legal, financial, or medical information.",
    whenToUse: [
      "You need a policy baseline for handling sensitive PDFs.",
      "You are reviewing tools that claim privacy without technical proof.",
      "You want practical controls that non-specialists can follow.",
    ],
    steps: [
      "Classify document sensitivity before selecting any processing route.",
      "For high-sensitivity files, choose no-upload local workflows.",
      "Verify behaviour in DevTools and document approved tool routes.",
    ],
    limitations: [
      "Local workflows reduce transfer exposure but do not replace endpoint security controls.",
      "Some advanced cloud features may not have a direct local equivalent.",
      "Policy enforcement still depends on team discipline and training.",
    ],
    relatedQuestions: [
      "What counts as a sensitive PDF in real workflows?",
      "How can I prove a tool is not uploading files?",
      "When can cloud processing still be acceptable?",
      "How should teams standardise safe defaults?",
    ],
  },
  "online-vs-offline-pdf-tools": {
    summary:
      "Local PDF tools and cloud PDF tools solve similar tasks with different privacy and governance trade-offs. Choose based on risk class and workflow constraints.",
    whenToUse: [
      "You are selecting a default tool model for team workflows.",
      "You need to balance privacy requirements against collaboration needs.",
      "You want a repeatable way to compare local and hosted options.",
    ],
    steps: [
      "Map document types to sensitivity classes first.",
      "Run the same workflow in local and cloud models.",
      "Compare upload exposure, speed, output quality, and verification effort.",
    ],
    limitations: [
      "Local model performance depends on device and browser capability.",
      "Cloud models can add transfer latency and policy overhead.",
      "No single model is best for every workload.",
    ],
    relatedQuestions: [
      "Is offline always safer than online processing?",
      "How should regulated teams choose a default model?",
      "What should be tested in a pilot before rollout?",
      "How can mixed-skill teams avoid workflow drift?",
    ],
  },
  "how-to-protect-a-pdf-with-a-password": {
    summary:
      "Use PDF password protection to limit casual access when sharing is necessary. Apply it locally and validate the result before distribution.",
    whenToUse: [
      "You must send a PDF to an external recipient but want access gating.",
      "You need a lightweight control for confidential attachments.",
      "You want local processing for sensitive document protection.",
    ],
    steps: [
      "Choose a strong password and confirm it in the tool.",
      "Apply protection locally and download the output.",
      "Open the result in a separate viewer to confirm password prompt behaviour.",
    ],
    limitations: [
      "Password protection is not the same as rights management or full workflow security.",
      "Weak shared passwords reduce the value of protection quickly.",
      "Recipient handling practices still determine real-world exposure.",
    ],
    relatedQuestions: [
      "What makes a strong PDF password?",
      "Does password protection stop copying content?",
      "How should I share passwords safely?",
      "Can I verify this happened without file uploads?",
    ],
  },
  "how-pdf-compression-works": {
    summary:
      "PDF compression reduces size by optimising structure and, in stronger modes, reducing image fidelity. Results vary by document composition.",
    whenToUse: [
      "You need to meet upload or email size limits.",
      "You want to understand why some PDFs compress well and others do not.",
      "You need predictable quality checks after optimisation.",
    ],
    steps: [
      "Assess whether the PDF is text-heavy, image-heavy, or mixed.",
      "Start with light optimisation and compare before/after size.",
      "Escalate only when needed and validate readability in a second viewer.",
    ],
    limitations: [
      "Aggressive compression can flatten selectable text into images.",
      "Already-optimised files may show little reduction.",
      "Image quality trade-offs are often irreversible after export.",
    ],
    relatedQuestions: [
      "Why does one PDF shrink a lot while another barely changes?",
      "What is the safest mode for contracts and forms?",
      "When does compression reduce OCR quality?",
      "How should I test quality before sharing?",
    ],
  },
  "how-ocr-works-on-scanned-pdfs": {
    summary:
      "OCR converts scanned page images into text by detecting characters, grouping words, and rebuilding a text layer. Accuracy depends on scan quality and layout complexity.",
    whenToUse: [
      "You need searchable text from scanned documents.",
      "You want to understand OCR limits before relying on extracted data.",
      "You process image-based PDFs containing forms, tables, or mixed fonts.",
    ],
    steps: [
      "Check scan quality and orientation before OCR.",
      "Run OCR and inspect extracted text on multiple sample pages.",
      "Correct critical fields manually before downstream use.",
    ],
    limitations: [
      "Low-resolution scans reduce recognition accuracy significantly.",
      "Handwritten and multi-column layouts often need manual correction.",
      "Language packs and character sets affect recognition quality.",
    ],
    relatedQuestions: [
      "Why does OCR fail on some scans?",
      "Can OCR output be trusted for legal values without review?",
      "How does language selection affect results?",
      "What is the difference between text-only and searchable-PDF output?",
    ],
  },
  "how-dns-lookup-works": {
    summary:
      "DNS lookup resolves domain names to IP addresses. Many apparent outages are actually resolver or cache issues rather than service failure.",
    whenToUse: [
      "A domain does not resolve on your network.",
      "You need to separate DNS failure from true service downtime.",
      "You are troubleshooting intermittent site-access incidents.",
    ],
    steps: [
      "Run DNS lookup for the target hostname.",
      "Compare results across at least two resolvers.",
      "Clear cache and retry before escalating.",
    ],
    limitations: [
      "Propagation windows can produce temporary resolver mismatch.",
      "Enterprise DNS controls can intentionally override public results.",
      "DNS success does not guarantee application-layer health.",
    ],
    relatedQuestions: [
      "Why do two resolvers return different answers?",
      "How long should DNS changes take to appear?",
      "Can DNS be correct while the site is still unreachable?",
      "What is the next step after DNS looks healthy?",
    ],
  },
  "what-response-time-means-in-uptime-check": {
    summary:
      "Response time is a request-latency signal, not a full user experience score. Use it with status code and DNS context for reliable diagnosis.",
    whenToUse: [
      "Uptime checks report slow responses but not outright failures.",
      "You need to decide whether to escalate an availability incident.",
      "You want a practical method for interpreting latency spikes.",
    ],
    steps: [
      "Run multiple checks for the same target over a short interval.",
      "Compare latency together with status code outcome.",
      "Cross-check DNS and test from another network.",
    ],
    limitations: [
      "One probe path cannot represent global user experience.",
      "Short spikes can be local-network noise rather than service incidents.",
      "Latency thresholds differ by service and route profile.",
    ],
    relatedQuestions: [
      "How high is too high for response time?",
      "Can a site be up but still effectively unusable?",
      "Why does latency vary between checks?",
      "When should I escalate to an outage report?",
    ],
  },
}

export const COMPARE_GEO_OVERRIDES: Record<string, CompareGeoOverride> = {
  "plain-tools-vs-smallpdf": {
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
  "plain-tools-vs-ilovepdf": {
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
  "plain-tools-vs-adobe-acrobat-online": {
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

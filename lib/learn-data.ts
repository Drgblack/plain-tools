export type LearnArticleCategory =
  | "Security"
  | "Tutorial"
  | "Comparison"
  | "Hardware"

export type LearnArticleIconKey =
  | "Shield"
  | "Search"
  | "FileText"
  | "AlertTriangle"
  | "EyeOff"
  | "Zap"
  | "Lock"
  | "Blocks"
  | "Sparkles"
  | "HardDrive"
  | "WifiOff"

export interface LearnArticleLink {
  title: string
  summary: string
  href: string
  category: LearnArticleCategory
  readTime: string
  icon: LearnArticleIconKey
}

export interface LearnSection {
  id: string
  title: string
  description: string
  articles: LearnArticleLink[]
}

export const learnSections: LearnSection[] = [
  {
    id: "privacy-seo-guides",
    title: "Privacy & Compliance Guides",
    description:
      "High-intent guides for healthcare, legal, compliance, and privacy-first PDF workflows.",
    articles: [
      {
        title: "Never Upload Medical Records",
        summary:
          "HIPAA, PHI, and why local processing should be the default for healthcare documents.",
        href: "/learn/why-you-should-never-upload-medical-records-to-pdf-tools",
        category: "Security",
        readTime: "9 min",
        icon: "Shield",
      },
      {
        title: "Verify No Uploads with DevTools",
        summary:
          "A practical workflow to prove whether a PDF tool sends document bytes to a server.",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
        category: "Tutorial",
        readTime: "10 min",
        icon: "Search",
      },
      {
        title: "PDF Metadata Risks",
        summary:
          "What XMP and Info Dictionary metadata can leak and how to remove hidden fields.",
        href: "/learn/what-is-pdf-metadata-and-why-it-matters",
        category: "Security",
        readTime: "10 min",
        icon: "FileText",
      },
      {
        title: "Acrobat AI Privacy Concerns",
        summary:
          "How to evaluate terms, data flow, and safer alternatives for sensitive PDF workflows.",
        href: "/learn/adobe-acrobat-ai-privacy-concerns-explained",
        category: "Comparison",
        readTime: "9 min",
        icon: "AlertTriangle",
      },
      {
        title: "How Redaction Really Works",
        summary:
          "Why black boxes fail and what irreversible redaction requires in real documents.",
        href: "/learn/how-pdf-redaction-really-works",
        category: "Security",
        readTime: "9 min",
        icon: "EyeOff",
      },
      {
        title: "Compress Without Losing Quality",
        summary:
          "How to balance PDF size reduction against visual readability and print needs.",
        href: "/learn/compress-pdf-without-losing-quality",
        category: "Tutorial",
        readTime: "9 min",
        icon: "Zap",
      },
      {
        title: "Sign PDFs Without Uploading",
        summary:
          "Visual vs cryptographic signatures and local signing workflows for private documents.",
        href: "/learn/how-to-sign-a-pdf-without-uploading-it",
        category: "Security",
        readTime: "10 min",
        icon: "Lock",
      },
      {
        title: "Private PDF Tools",
        summary:
          "How to choose no-upload PDF workflows with practical verification steps and trade-off checks.",
        href: "/learn/private-pdf-tools",
        category: "Security",
        readTime: "8 min",
        icon: "Shield",
      },
      {
        title: "GDPR and PDF Tools",
        summary:
          "Controller/processor exposure and why client-side workflows reduce compliance burden.",
        href: "/learn/gdpr-and-pdf-tools-what-businesses-need-to-know",
        category: "Security",
        readTime: "10 min",
        icon: "Shield",
      },
      {
        title: "Offline PDF Tools for Law Firms",
        summary:
          "A practical local-first handling model for matter files, redaction, and metadata hygiene.",
        href: "/learn/offline-pdf-tools-for-law-firms",
        category: "Security",
        readTime: "9 min",
        icon: "Shield",
      },
      {
        title: "Offline PDF Tools for Healthcare Teams",
        summary:
          "How to reduce patient-document exposure during OCR, redaction, and portal uploads.",
        href: "/learn/offline-pdf-tools-for-healthcare-teams",
        category: "Security",
        readTime: "9 min",
        icon: "Shield",
      },
      {
        title: "PDF Redaction Checklist",
        summary:
          "A repeatable compliance-oriented checklist for irreversible redaction and post-export review.",
        href: "/learn/pdf-redaction-checklist-for-compliance",
        category: "Tutorial",
        readTime: "8 min",
        icon: "EyeOff",
      },
      {
        title: "Local vs Cloud OCR Privacy",
        summary:
          "Compare OCR data-flow trade-offs for scanned PDFs and decide when local should be the default.",
        href: "/learn/local-vs-cloud-ocr-privacy",
        category: "Comparison",
        readTime: "8 min",
        icon: "Sparkles",
      },
      {
        title: "WebAssembly PDF Explained",
        summary:
          "A plain-language guide to WASM-powered local processing and offline capability.",
        href: "/learn/webassembly-pdf-processing-explained",
        category: "Hardware",
        readTime: "9 min",
        icon: "Blocks",
      },
      {
        title: "OCR Without Cloud",
        summary:
          "How to generate searchable PDFs locally and avoid exposing sensitive scans.",
        href: "/learn/ocr-pdf-without-cloud",
        category: "Tutorial",
        readTime: "9 min",
        icon: "Sparkles",
      },
    ],
  },
  {
    id: "core-privacy",
    title: "Core Privacy",
    description:
      "Foundational concepts for understanding data privacy in document processing.",
    articles: [
      {
        title: "Never Upload Sensitive PDFs to Random Tools",
        summary:
          "Why random upload tools are risky for legal, financial, HR, and medical PDFs, plus safer local-first handling.",
        href: "/learn/why-pdf-uploads-are-risky",
        category: "Security",
        readTime: "8 min",
        icon: "AlertTriangle",
      },
      {
        title: "Wasm vs. Cloud Security",
        summary:
          "Comparing WebAssembly local processing with traditional cloud-based approaches to document security.",
        href: "/learn/is-offline-pdf-processing-secure",
        category: "Security",
        readTime: "6 min",
        icon: "Shield",
      },
      {
        title: "Local PDF Tools vs Cloud PDF Tools",
        summary:
          "A practical comparison of upload-based and local workflows using privacy, speed, and governance criteria.",
        href: "/learn/online-vs-offline-pdf-tools",
        category: "Comparison",
        readTime: "8 min",
        icon: "FileText",
      },
      {
        title: "Is It Down for Everyone or Just Me?",
        summary:
          "A practical status-check explainer for separating local connectivity issues from real outages.",
        href: "/learn/is-it-down-for-everyone-or-just-me",
        category: "Tutorial",
        readTime: "6 min",
        icon: "WifiOff",
      },
    ],
  },
  {
    id: "technical-deep-dives",
    title: "Technical Deep Dives",
    description:
      "In-depth explorations of the technologies powering local document processing.",
    articles: [
      {
        title: "How PDF Compression Works",
        summary:
          "What actually gets compressed in a PDF, why size reduction varies, and how quality trade-offs are introduced.",
        href: "/learn/how-pdf-compression-works",
        category: "Tutorial",
        readTime: "8 min",
        icon: "Zap",
      },
      {
        title: "How OCR Works on Scanned PDFs",
        summary:
          "How scanned images become searchable text, where OCR accuracy fails, and what to validate before use.",
        href: "/learn/how-ocr-works-on-scanned-pdfs",
        category: "Tutorial",
        readTime: "9 min",
        icon: "Sparkles",
      },
      {
        title: "WebAssembly Explained",
        summary:
          "How your data stays in-browser. Understand the technology that enables near-native performance.",
        href: "/learn/client-side-processing",
        category: "Hardware",
        readTime: "5 min",
        icon: "Blocks",
      },
      {
        title: "WebGPU Hardware Acceleration",
        summary:
          "Using WebGPU for local AI. How Plain leverages your device's GPU for document analysis.",
        href: "/learn/webassembly-pdf-processing-explained",
        category: "Hardware",
        readTime: "6 min",
        icon: "Zap",
      },
      {
        title: "RAM Management for Large PDFs",
        summary:
          "Techniques for processing 500MB+ documents efficiently without overwhelming system memory.",
        href: "/learn/why-offline-compression-has-limits",
        category: "Tutorial",
        readTime: "4 min",
        icon: "HardDrive",
      },
      {
        title: "Browser Memory Limits for PDF Tools",
        summary:
          "Why local PDF jobs hit memory pressure and how to recover with smaller, more predictable batches.",
        href: "/learn/browser-memory-limits-for-pdf-tools",
        category: "Tutorial",
        readTime: "8 min",
        icon: "HardDrive",
      },
      {
        title: "Local AI Processing",
        summary:
          "How WebGPU and WebLLM enable AI-powered features without sending data to external servers.",
        href: "/learn/ocr-pdf-without-cloud",
        category: "Hardware",
        readTime: "7 min",
        icon: "Sparkles",
      },
    ],
  },
  {
    id: "security-masterclasses",
    title: "Security Masterclasses",
    description: "Advanced guides for professionals handling sensitive documents.",
    articles: [
      {
        title: "Protect a PDF with a Password",
        summary:
          "A practical local workflow for password protection, plus limitations of PDF encryption in shared environments.",
        href: "/learn/how-to-protect-a-pdf-with-a-password",
        category: "Security",
        readTime: "8 min",
        icon: "Lock",
      },
      {
        title: "Permanent Redaction Techniques",
        summary:
          "Ensuring permanent data removal. A comprehensive guide to securely redacting sensitive information.",
        href: "/learn/how-pdf-redaction-really-works",
        category: "Security",
        readTime: "7 min",
        icon: "EyeOff",
      },
      {
        title: "Offline Workflows",
        summary:
          "Using Plain in high-security environments. Best practices for air-gapped systems and secure facilities.",
        href: "/learn/no-uploads-explained",
        category: "Security",
        readTime: "5 min",
        icon: "WifiOff",
      },
      {
        title: "Verifying Local Processing",
        summary:
          "How to confirm that your files never leave your device using browser DevTools.",
        href: "/learn/verify-offline-processing",
        category: "Tutorial",
        readTime: "6 min",
        icon: "Lock",
      },
      {
        title: "Encryption Best Practices",
        summary:
          "Understanding AES-256 local encryption and how to protect sensitive documents on-device.",
        href: "/learn/is-offline-pdf-processing-secure",
        category: "Security",
        readTime: "5 min",
        icon: "Shield",
      },
    ],
  },
  {
    id: "network-status-guides",
    title: "Network and Status Guides",
    description:
      "Evergreen diagnostics guides for availability checks, DNS behaviour, and response-time interpretation.",
    articles: [
      {
        title: "How to Check if a Website Is Down",
        summary:
          "A practical workflow to separate local connectivity failures from broader service outages.",
        href: "/learn/is-it-down-for-everyone-or-just-me",
        category: "Tutorial",
        readTime: "7 min",
        icon: "WifiOff",
      },
      {
        title: "How DNS Lookup Works",
        summary:
          "How domain names resolve to IP addresses and why DNS errors can mimic outages.",
        href: "/learn/how-dns-lookup-works",
        category: "Tutorial",
        readTime: "7 min",
        icon: "Search",
      },
      {
        title: "What Response Time Means in Uptime Checks",
        summary:
          "How to interpret latency values correctly and avoid false outage conclusions from one slow probe.",
        href: "/learn/what-response-time-means-in-uptime-check",
        category: "Tutorial",
        readTime: "6 min",
        icon: "Zap",
      },
    ],
  },
]

export const learnFeedArticles: LearnArticleLink[] = Array.from(
  new Map(
    learnSections
      .flatMap((section) => section.articles)
      .map((article) => [article.href, article])
  ).values()
)

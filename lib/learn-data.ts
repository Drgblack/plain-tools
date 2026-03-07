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
        title: "Privacy 101",
        summary:
          "Why uploading sensitive documents is a security risk. The hidden dangers of cloud-based PDF tools.",
        href: "/learn/why-pdf-uploads-are-risky",
        category: "Security",
        readTime: "5 min",
        icon: "AlertTriangle",
      },
      {
        title: "Wasm vs. Cloud Security",
        summary:
          "Comparing WebAssembly local processing with traditional cloud-based approaches to document security.",
        href: "/learn/wasm-vs-cloud-security",
        category: "Security",
        readTime: "6 min",
        icon: "Shield",
      },
      {
        title: "Online vs Offline PDF Tools",
        summary:
          "A neutral comparison of server-based and client-side approaches to document processing.",
        href: "/learn/online-vs-offline-pdf-tools",
        category: "Comparison",
        readTime: "5 min",
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
        href: "/learn/hardware-acceleration",
        category: "Hardware",
        readTime: "6 min",
        icon: "Zap",
      },
      {
        title: "RAM Management for Large PDFs",
        summary:
          "Techniques for processing 500MB+ documents efficiently without overwhelming system memory.",
        href: "/learn/ram-optimisation",
        category: "Tutorial",
        readTime: "4 min",
        icon: "HardDrive",
      },
      {
        title: "Local AI Processing",
        summary:
          "How WebGPU and WebLLM enable AI-powered features without sending data to external servers.",
        href: "/learn/local-ai-processing",
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
        title: "Permanent Redaction Techniques",
        summary:
          "Ensuring permanent data removal. A comprehensive guide to securely redacting sensitive information.",
        href: "/learn/redaction-guide",
        category: "Security",
        readTime: "7 min",
        icon: "EyeOff",
      },
      {
        title: "Offline Workflows",
        summary:
          "Using Plain in high-security environments. Best practices for air-gapped systems and secure facilities.",
        href: "/learn/offline-workflows",
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
        href: "/learn/encryption-best-practices",
        category: "Security",
        readTime: "5 min",
        icon: "Shield",
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

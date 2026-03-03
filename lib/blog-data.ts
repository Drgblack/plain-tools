export const categories = [
  {
    id: "all",
    label: "All",
    slug: "all",
    description: "",
    longDescription: "",
    learnLinks: [],
    faqs: [],
  },
  {
    id: "privacy-security",
    label: "Privacy & Security",
    slug: "privacy-security",
    description:
      "Articles about file handling, uploads, browser security, and data protection.",
    longDescription:
      "When you work with documents online, understanding where your files go and who can access them matters. This category covers the technical realities of file uploads, browser security models, and data protection. The articles explain how different tools handle your files, what risks exist with server-based processing, and how to verify privacy claims yourself.",
    learnLinks: [
      { href: "/learn/no-uploads-explained", label: 'What "No Uploads" Actually Means' },
      { href: "/learn/verify-offline-processing", label: "Verifying Offline Processing" },
      { href: "/learn/client-side-processing", label: "Client-Side Processing Explained" },
    ],
    faqs: [
      {
        question: "What happens to my files when I upload them to an online tool?",
        answer: "When you upload a file to an online tool, it travels over the internet to a remote server. The server processes your file and sends results back. During this process, a copy of your file exists on the server, potentially in logs, caches, or backups. Retention policies vary by service.",
      },
      {
        question: "How can I tell if a tool is uploading my files?",
        answer: "Open your browser's developer tools (F12) and watch the Network tab while using the tool. If you see large POST requests or file data being sent to remote servers, your files are being uploaded. Truly local tools show minimal network activity during file operations.",
      },
      {
        question: "Are all online PDF tools a privacy risk?",
        answer: "Not necessarily. The risk depends on what data you're processing and how much you trust the service. For non-sensitive documents, reputable online tools with clear privacy policies may be acceptable. For confidential documents, local processing eliminates transmission risks entirely.",
      },
      {
        question: "What is the difference between encryption and local processing?",
        answer: "Encryption protects data during transmission and storage but the server still receives your file. Local processing means the file never leaves your device at all. These are complementary but different protections.",
      },
    ],
  },
  {
    id: "pdf-basics",
    label: "How PDFs Work",
    slug: "pdf-basics",
    description:
      "Foundational explanations of PDF structure, formatting, and document standards.",
    longDescription:
      "PDF is one of the most widely used document formats, but few people understand how it actually works. This category covers the technical foundations: how PDFs store text and images, why they look consistent across devices, and what makes them different from other document formats. These articles provide the background knowledge needed to work with PDFs effectively.",
    learnLinks: [
      { href: "/learn/what-is-a-pdf", label: "What Is a PDF?" },
      { href: "/learn/how-pdfs-work", label: "How PDFs Work Internally" },
      { href: "/learn/pdf-consistency", label: "Why PDFs Preserve Layout" },
    ],
    faqs: [
      {
        question: "Why do PDFs look the same on every device?",
        answer: "PDFs embed everything needed to render the document: fonts, exact positioning coordinates, images, and colour profiles. Unlike web pages or Word documents that adapt to the viewing environment, PDFs specify absolute positions for every element.",
      },
      {
        question: "What is the difference between a PDF and a Word document?",
        answer: "Word documents are designed for editing and adapt to different screen sizes and fonts. PDFs are designed for consistent viewing and lock in the exact appearance. The tradeoff is that PDFs are harder to edit but guarantee visual consistency.",
      },
      {
        question: "Can PDFs contain hidden data?",
        answer: "Yes. PDFs can contain metadata (author, creation date, editing history), hidden layers, embedded files, comments, and form field data that may not be visible when viewing the document. This is important to understand when sharing sensitive documents.",
      },
      {
        question: "Why are PDFs used for official documents?",
        answer: "PDFs provide visual consistency, can include digital signatures for authenticity verification, support encryption and access controls, and are based on an open ISO standard. These characteristics make them suitable for legal and financial documents.",
      },
      {
        question: "Are all PDFs the same internally?",
        answer: "No. PDFs can be created differently: some contain actual text data, others are essentially images of text. This affects searchability, accessibility, and what operations can be performed on them.",
      },
    ],
  },
  {
    id: "offline-computing",
    label: "Offline Tools",
    slug: "offline-computing",
    description:
      "Articles about local processing, browser-based tools, and working without internet dependency.",
    longDescription:
      "Offline tools process files entirely on your device without requiring internet connectivity or server uploads. This category explains how local processing works, what its advantages and limitations are, and when offline tools are appropriate. The articles cover both the technical mechanisms and practical considerations for choosing between online and offline approaches.",
    learnLinks: [
      { href: "/learn/client-side-processing", label: "Client-Side Processing Explained" },
      { href: "/learn/no-uploads-explained", label: 'What "No Uploads" Actually Means' },
      { href: "/learn/verify-offline-processing", label: "How to Verify Offline Processing" },
    ],
    faqs: [
      {
        question: "How do offline tools work in a browser?",
        answer: "Modern browsers can run sophisticated code locally using JavaScript and WebAssembly. When you select a file, it's read into browser memory, processed using local code, and the result is created without server communication. The browser acts as a local application runtime.",
      },
      {
        question: "Do offline tools work without internet?",
        answer: "Once the tool is loaded, genuine offline tools work without internet connectivity. You can test this by going offline (airplane mode) after loading the page. If the tool still processes files, it's running locally.",
      },
      {
        question: "Are offline tools as capable as online tools?",
        answer: "For many common operations like merging, splitting, and compressing PDFs, yes. Modern browsers with WebAssembly can run sophisticated processing locally. Some advanced operations like AI-powered OCR may still benefit from server processing.",
      },
      {
        question: "What are the limitations of offline processing?",
        answer: "Offline processing is limited by your device's memory and processing power. Very large files or computationally intensive operations may be slower or constrained compared to powerful servers. Browser security also limits some file system operations.",
      },
    ],
  },
  {
    id: "browser-technology",
    label: "Browser Technology",
    slug: "browser-technology",
    description:
      "Explanations of modern browser capabilities relevant to document processing.",
    longDescription:
      "Modern browsers are capable application platforms, not just document viewers. This category explains the technologies that enable local document processing: WebAssembly for near-native performance, the File API for local file access, and the security model that keeps your data protected. Understanding these technologies helps you evaluate claims about browser-based tools.",
    learnLinks: [
      { href: "/learn/client-side-processing", label: "Client-Side Processing Explained" },
      { href: "/learn/verify-offline-processing", label: "Verifying Browser Behaviour" },
    ],
    faqs: [
      {
        question: "What is WebAssembly and why does it matter?",
        answer: "WebAssembly (Wasm) allows code written in languages like C++ to run in browsers at near-native speed. PDF libraries originally written for desktop applications can be compiled to WebAssembly, bringing full processing capabilities to the browser without plugins.",
      },
      {
        question: "Can websites access files on my computer without permission?",
        answer: "No. Browsers enforce strict security: websites cannot read files unless you explicitly select them using a file picker or drag-and-drop. Even then, sites only receive the files you chose, not access to your file system.",
      },
      {
        question: "How can I verify what a website is doing with my files?",
        answer: "Use browser developer tools (F12) to monitor network activity. The Network tab shows all data sent from your browser. If no file data appears in requests during processing, the tool is operating locally.",
      },
    ],
  },
  {
    id: "practical-guides",
    label: "Practical Guides",
    slug: "practical-guides",
    description:
      "Step-by-step explanations for common document tasks and verification techniques.",
    longDescription:
      "This category contains practical, actionable guides for working with documents. The articles explain how to accomplish specific tasks, verify tool behaviour, and avoid common mistakes. These are neutral how-to explanations focused on techniques rather than specific products.",
    learnLinks: [
      { href: "/learn/verify-offline-processing", label: "How to Verify Offline Processing" },
      { href: "/verify", label: "Verification Guide" },
      { href: "/tools/merge-pdf", label: "PDF Merge Tool" },
    ],
    faqs: [
      {
        question: "How do I merge multiple PDFs into one?",
        answer: "Select all the PDF files you want to combine, arrange them in the desired order, and use a merge function. The process combines the pages sequentially into a single document. This can be done locally without uploading files.",
      },
      {
        question: "How can I reduce the file size of a PDF?",
        answer: "PDF compression typically works by reducing image resolution, removing duplicate resources, and optimising internal structures. The effectiveness depends on the PDF content: image-heavy documents compress more than text-heavy ones.",
      },
      {
        question: "How do I properly redact information in a PDF?",
        answer: "True redaction permanently removes content, not just covers it visually. Drawing black rectangles over text leaves the text accessible underneath. Proper redaction tools delete the underlying data entirely before flattening the document.",
      },
      {
        question: "How can I verify a tool's privacy claims?",
        answer: "Open browser developer tools before using the tool. Watch the Network tab during file operations. Test with airplane mode after the page loads. Check if the tool works offline. These steps reveal whether files are processed locally or uploaded.",
      },
      {
        question: "What should I check before using an online PDF tool?",
        answer: "Review the privacy policy for data retention terms. Check whether the tool works offline. Monitor network activity during use. Consider whether the document sensitivity warrants the convenience of online processing.",
      },
    ],
  },
] as const

export type CategoryId = (typeof categories)[number]["id"]

export const posts = [
  {
    slug: "the-pdf-tools-that-betrayed-you",
    title: "The PDF Tools That Betrayed You",
    description:
      "A factual timeline of trust breaks in major PDF platforms, with sources and practical verification takeaways.",
    date: "2026-03-03",
    readingTime: 8,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "why-we-open-sourced-our-privacy-claims",
    title: "Why We Open-Sourced Our Privacy Claims",
    description:
      "Why policy-only privacy promises fail and how verifiable architecture changes trust.",
    date: "2026-03-03",
    readingTime: 7,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "large-pdf-files-kill-browser-tools-heres-why",
    title: "Large PDF Files Kill Browser Tools. Here's Why.",
    description:
      "Upload bottlenecks, server queues, and main-thread blocking explained with a 500MB benchmark model.",
    date: "2026-03-03",
    readingTime: 8,
    category: "browser-technology" as CategoryId,
  },
  {
    slug: "the-legal-professionals-guide-to-pdf-privacy",
    title: "The Legal Professional's Guide to PDF Privacy",
    description:
      "A practical confidentiality-focused PDF workflow for lawyers and paralegals.",
    date: "2026-03-03",
    readingTime: 8,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    title: "We Built a PDF Tool That Works Offline. Here's What We Learned.",
    description:
      "Engineering lessons from building an offline-first PDF stack with WebAssembly and workers.",
    date: "2026-03-03",
    readingTime: 8,
    category: "offline-computing" as CategoryId,
  },
  {
    slug: "how-to-verify-privacy-claims-yourself",
    title: "How to Verify a Website's Privacy Claims Yourself",
    description:
      "Practical techniques to independently verify whether websites handle your files privately, including DevTools and offline testing.",
    date: "2026-02-28",
    readingTime: 8,
    category: "practical-guides" as CategoryId,
  },
  {
    slug: "can-websites-read-your-files-without-uploading",
    title: "Can Websites Read Your Files Without Uploading Them?",
    description:
      "A clear explanation of browser security, file access permissions, and how to verify that websites handle your files safely.",
    date: "2026-02-28",
    readingTime: 6,
    category: "browser-technology" as CategoryId,
  },
  {
    slug: "why-browser-based-tools-are-more-powerful",
    title: "Why Browser-Based Tools Are Becoming More Powerful",
    description:
      "How modern browsers have evolved to support complex operations locally, including WebAssembly and offline processing.",
    date: "2026-02-27",
    readingTime: 7,
    category: "browser-technology" as CategoryId,
  },
  {
    slug: "offline-vs-online-tools-privacy",
    title: "Offline vs Online Tools: A Privacy Perspective",
    description:
      "An analytical comparison of privacy trade-offs between offline and online tools, and when each model is appropriate.",
    date: "2026-02-26",
    readingTime: 8,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "what-happens-when-you-upload-a-pdf",
    title: "What Happens When You Upload a PDF?",
    description:
      "A technical look at the upload process: where files go, how long they stay, and what risks exist.",
    date: "2026-02-25",
    readingTime: 7,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "are-pdfs-really-secure",
    title: "Are PDFs Really Secure? A Practical Explanation",
    description:
      "A balanced examination of PDF security features, their limitations, and what they actually protect against.",
    date: "2026-02-24",
    readingTime: 8,
    category: "privacy-security" as CategoryId,
  },
  {
    slug: "common-pdf-privacy-mistakes",
    title: "Common PDF Privacy Mistakes (And How to Avoid Them)",
    description:
      "Practical guide to avoiding common privacy mistakes when working with PDFs, including hidden metadata and improper redaction.",
    date: "2026-02-23",
    readingTime: 9,
    category: "practical-guides" as CategoryId,
  },
  {
    slug: "why-pdfs-are-used-for-sensitive-documents",
    title: "Why PDFs Are Still the Default for Sensitive Documents",
    description:
      "The characteristics that make PDF the standard format for legal, financial, and official documents.",
    date: "2026-02-22",
    readingTime: 5,
    category: "pdf-basics" as CategoryId,
  },
  {
    slug: "why-pdfs-look-the-same-everywhere",
    title: "Why PDFs Look the Same Everywhere",
    description:
      "A technical explanation of how PDFs achieve consistent visual appearance across different devices and software.",
    date: "2026-02-21",
    readingTime: 7,
    category: "pdf-basics" as CategoryId,
  },
  {
    slug: "browser-pdf-processing-explained",
    title: "Browser PDF Processing Explained",
    description:
      "How modern browsers can handle PDF operations without server uploads using WebAssembly and local APIs.",
    date: "2026-02-20",
    readingTime: 6,
    category: "browser-technology" as CategoryId,
  },
  {
    slug: "why-we-built-plain",
    title: "Why We Built Plain",
    description:
      "The reasoning behind creating offline-first PDF tools in a world of cloud services.",
    date: "2026-02-15",
    readingTime: 4,
    category: "offline-computing" as CategoryId,
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug && c.id !== "all")
}

export function getPostsByCategory(categoryId: CategoryId) {
  return posts.filter((post) => post.category === categoryId)
}

export function getCategoryLabel(categoryId: CategoryId) {
  return categories.find((c) => c.id === categoryId)?.label || categoryId
}

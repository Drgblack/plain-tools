import type { ToolDefinition } from "@/lib/tools-catalogue"

export type ToolAnswerFirstContent = {
  summary: string
  whatItDoes: string
  whatYouProvide: string
  whatYouGet: string
  localProcessing: string
  limitations: string
  whatToExpect: string[]
}

export type ToolFaqItem = {
  question: string
  answer: string
}

type ToolPageProfile = {
  title: string
  description: string
  trustPoints: string[]
  limitation: string
  featureList: string[]
  overview?: string
  useCases?: string[]
}

const DEFAULT_TRUST_POINTS = [
  "Processed locally in your browser",
  "Files never leave your device",
  "No account required for local processing",
]

const DEFAULT_LIMITATION =
  "Best-effort output quality depends on file complexity and available device memory."

const TOOL_ANSWER_FIRST_OVERRIDES: Partial<Record<string, ToolAnswerFirstContent>> = {
  "merge-pdf": {
    summary:
      "Merge PDF combines multiple PDF files into one output document in your browser. Files are processed locally and not uploaded for core workflows.",
    whatItDoes:
      "It reads each selected PDF, preserves page order based on your list, and writes a single merged PDF.",
    whatYouProvide:
      "Two or more PDF files. You can reorder items before running the merge.",
    whatYouGet:
      "One merged PDF download.",
    localProcessing:
      "All merge operations run in browser memory on your device.",
    limitations:
      "Encrypted or corrupted source files can fail to merge.",
    whatToExpect: [
      "Large batches can take longer on mobile devices.",
      "Merged output keeps source page visuals, but file metadata may differ.",
      "Review the final file before sharing.",
    ],
  },
  "split-pdf": {
    summary:
      "Split PDF extracts selected pages or ranges from one source PDF. Processing stays local in your browser.",
    whatItDoes:
      "It reads the source PDF and creates new PDFs from selected pages, ranges, or per-page mode.",
    whatYouProvide:
      "One PDF and a page selection such as 1,3,5-7.",
    whatYouGet:
      "A single extracted PDF or multiple PDFs (often as ZIP).",
    localProcessing:
      "Page extraction and export run locally on-device.",
    limitations:
      "Invalid ranges or pages outside document length are rejected.",
    whatToExpect: [
      "Per-page export can generate many files on long PDFs.",
      "Input validation prevents out-of-range extraction.",
      "Output quality matches source pages because no re-render is required.",
    ],
  },
  "compress-pdf": {
    summary:
      "Compress PDF reduces file size with light, medium, and strong modes in a local browser workflow.",
    whatItDoes:
      "It optimises PDF structure and, in stronger modes, can re-render page content for smaller output.",
    whatYouProvide:
      "One PDF and a compression level.",
    whatYouGet:
      "One optimised PDF with before/after size information.",
    localProcessing:
      "Compression runs inside your browser session with no upload step for core mode paths.",
    limitations:
      "Strong mode may reduce visual quality and can flatten selectable text.",
    whatToExpect: [
      "Text-heavy PDFs often shrink less than image-heavy files.",
      "Medium and strong modes can change rendering fidelity.",
      "Always review readability before distribution.",
    ],
  },
  "pdf-to-word": {
    summary:
      "PDF to Word performs best-effort local conversion from PDF text content into DOCX output.",
    whatItDoes:
      "It extracts readable text and writes a Word document with basic structure.",
    whatYouProvide:
      "One PDF file, ideally text-based rather than scanned images.",
    whatYouGet:
      "One `.docx` file for further editing.",
    localProcessing:
      "Extraction and DOCX creation run in your browser.",
    limitations:
      "Complex layouts, forms, and scanned pages may not convert accurately.",
    whatToExpect: [
      "Paragraph flow is preserved better than exact visual layout.",
      "Tables and multi-column content may need manual cleanup.",
      "Scanned PDFs may require OCR before useful Word output.",
    ],
  },
  "word-to-pdf": {
    summary:
      "Word to PDF converts DOCX files to PDF locally with a best-effort browser rendering path.",
    whatItDoes:
      "It parses DOCX content and generates a PDF output document.",
    whatYouProvide:
      "One `.docx` file.",
    whatYouGet:
      "One converted PDF file.",
    localProcessing:
      "DOCX parsing and PDF creation happen on-device in your browser.",
    limitations:
      "Advanced Word styling and embedded elements may render differently.",
    whatToExpect: [
      "Simple business documents convert most reliably.",
      "Fonts unavailable in-browser can change appearance.",
      "Verify page breaks and spacing after conversion.",
    ],
  },
  "pdf-to-excel": {
    summary:
      "PDF to Excel extracts table-like text into spreadsheet output in a local browser workflow.",
    whatItDoes:
      "It detects row and column patterns from PDF text positions and exports structured data.",
    whatYouProvide:
      "One PDF, preferably with clear table structure.",
    whatYouGet:
      "Spreadsheet-ready output (CSV/XLSX depending on mode support).",
    localProcessing:
      "Text extraction and table heuristics run in your browser.",
    limitations:
      "Complex merged cells and heavily stylised tables may need manual edits after export.",
    whatToExpect: [
      "Simple invoices and statements convert best.",
      "Scanned tables without OCR text are harder to parse.",
      "Run a quick spreadsheet review before downstream use.",
    ],
  },
  "pdf-to-ppt": {
    summary:
      "PDF to PowerPoint creates one slide per PDF page using local browser rendering.",
    whatItDoes:
      "It renders pages to images and places each image on a presentation slide.",
    whatYouProvide:
      "One PDF and a chosen render scale.",
    whatYouGet:
      "One `.pptx` file with image-based slides.",
    localProcessing:
      "Page rendering and PPT generation run on-device.",
    limitations:
      "Slide text is not directly editable because pages are image-based.",
    whatToExpect: [
      "Visual fidelity is usually strong for static documents.",
      "Higher scale improves sharpness but increases file size.",
      "Complex animations are not reconstructed from PDFs.",
    ],
  },
  "pdf-to-jpg": {
    summary:
      "PDF to JPG exports selected PDF pages as JPEG images locally in your browser.",
    whatItDoes:
      "It renders pages to canvas and encodes them to JPG with quality controls.",
    whatYouProvide:
      "One PDF, quality setting, and page selection.",
    whatYouGet:
      "One JPG per page, typically packaged as ZIP for multi-page exports.",
    localProcessing:
      "Rendering and image encoding happen in local browser memory.",
    limitations:
      "Very large PDFs can be memory-intensive on low-end devices.",
    whatToExpect: [
      "Higher quality and scale produce larger image files.",
      "Selected page mode reduces processing time on long PDFs.",
      "Image output is visual, not editable PDF text.",
    ],
  },
  "jpg-to-pdf": {
    summary:
      "JPG to PDF combines image files into a single PDF in a local browser workflow.",
    whatItDoes:
      "It places each selected image on a PDF page using your size and margin options.",
    whatYouProvide:
      "One or more JPG/JPEG/PNG images.",
    whatYouGet:
      "One combined PDF file.",
    localProcessing:
      "Image loading and PDF assembly run entirely in-browser.",
    limitations:
      "Image quality and orientation depend on source resolution and chosen page settings.",
    whatToExpect: [
      "You can reorder images before conversion.",
      "Fit-to-image preserves source proportions best.",
      "Large image batches can increase output size quickly.",
    ],
  },
  "sign-pdf": {
    summary:
      "Sign PDF adds a visual signature mark to a chosen page and position using local browser processing.",
    whatItDoes:
      "It embeds a drawn or typed signature into the PDF at selected coordinates.",
    whatYouProvide:
      "One PDF, a signature (drawn or typed), and placement settings.",
    whatYouGet:
      "One signed PDF file.",
    localProcessing:
      "Signature capture and PDF stamping run on your device.",
    limitations:
      "This is a visual signature workflow, not a cryptographic certificate signature.",
    whatToExpect: [
      "Use placement controls to avoid covering key document content.",
      "Touch signature input is supported for mobile use.",
      "Review signature size and position before final download.",
    ],
  },
  "protect-pdf": {
    summary:
      "Protect PDF applies password protection to a PDF locally in your browser.",
    whatItDoes:
      "It encrypts the output PDF so viewers require a password to open it.",
    whatYouProvide:
      "One PDF and matching password/confirmation input.",
    whatYouGet:
      "One password-protected PDF.",
    localProcessing:
      "Encryption runs in-browser with no file upload for processing.",
    limitations:
      "Compatibility can vary across older or lightweight PDF viewers.",
    whatToExpect: [
      "Use a strong password and store it safely.",
      "Test opening the protected file in your target viewer.",
      "If a viewer rejects the file, try a mainstream PDF reader.",
    ],
  },
  "unlock-pdf": {
    summary:
      "Unlock PDF removes password protection when you provide the correct password, entirely in local browser processing.",
    whatItDoes:
      "It decrypts an encrypted PDF and exports an unlocked copy.",
    whatYouProvide:
      "One encrypted PDF and its correct password.",
    whatYouGet:
      "One unlocked PDF file.",
    localProcessing:
      "Password verification and decryption run on-device in-browser.",
    limitations:
      "Without the correct password, unlock cannot proceed.",
    whatToExpect: [
      "Incorrect password errors are shown without exposing technical traces.",
      "Unlocked output should open without a password prompt.",
      "Re-protect output if you still need controlled access.",
    ],
  },
  "ocr-pdf": {
    summary:
      "OCR PDF performs best-effort optical character recognition locally to extract text from scanned documents.",
    whatItDoes:
      "It renders pages and runs OCR to produce searchable text output and related exports.",
    whatYouProvide:
      "A scanned PDF or image-based document and OCR language selection.",
    whatYouGet:
      "Text output and, where supported, searchable PDF-style export.",
    localProcessing:
      "OCR processing runs in your browser after required OCR assets are available.",
    limitations:
      "Large files and mobile devices may process slowly; recognition quality depends on scan clarity.",
    whatToExpect: [
      "Clean, high-contrast scans produce better text accuracy.",
      "OCR may require additional processing time on long documents.",
      "Always validate extracted text before compliance-critical use.",
    ],
  },
}

const TOOL_FAQ_OVERRIDES: Partial<Record<string, ToolFaqItem[]>> = {
  "merge-pdf": [
    {
      question: "Does merging change PDF quality?",
      answer:
        "Merged output keeps source page visuals. It combines pages into one file rather than re-rendering content.",
    },
    {
      question: "Can I merge many files at once?",
      answer:
        "Yes, but very large batches may be slower on lower-memory devices.",
    },
    {
      question: "Will encrypted PDFs merge?",
      answer:
        "Password-protected or corrupted files can fail. Unlock protected files first where permitted.",
    },
  ],
  "split-pdf": [
    {
      question: "How do page ranges work?",
      answer:
        "Use values such as 1,3,5-7. Invalid or out-of-range pages are rejected before export.",
    },
    {
      question: "Does split output keep original quality?",
      answer:
        "Yes. Page extraction keeps the source page visuals because it copies pages rather than re-rendering.",
    },
    {
      question: "Can I split every page into separate PDFs?",
      answer:
        "Yes. Per-page mode creates one output per page, typically packaged as ZIP for convenience.",
    },
  ],
  "compress-pdf": [
    {
      question: "Which compression mode should I start with?",
      answer:
        "Start with Light for readable documents. Move to Medium or Strong when file size matters more than fidelity.",
    },
    {
      question: "Can Strong mode affect selectable text?",
      answer:
        "Yes. Strong compression may flatten text into image-like output for smaller files.",
    },
    {
      question: "Why does size reduction vary by file?",
      answer:
        "Text-heavy PDFs often shrink less. Image-heavy PDFs usually benefit more from Medium or Strong modes.",
    },
  ],
  "pdf-to-word": [
    {
      question: "Will scanned PDFs convert well?",
      answer:
        "Scanned documents usually need OCR first. Text-based PDFs convert more reliably to editable DOCX.",
    },
    {
      question: "Is layout preserved exactly?",
      answer:
        "No. This is best-effort conversion, so tables and complex multi-column layouts may need manual cleanup.",
    },
    {
      question: "Are files uploaded during conversion?",
      answer:
        "Core conversion runs locally in your browser for this workflow.",
    },
  ],
  "word-to-pdf": [
    {
      question: "Which Word formats are supported?",
      answer:
        "DOCX is the primary supported format for this browser workflow.",
    },
    {
      question: "Why do fonts look different sometimes?",
      answer:
        "If the original font is unavailable in-browser, fallback fonts can change spacing and line breaks.",
    },
    {
      question: "Does the conversion happen locally?",
      answer:
        "Yes. Parsing and PDF generation run on your device in-browser.",
    },
  ],
  "pdf-to-excel": [
    {
      question: "Can it extract every table perfectly?",
      answer:
        "No. It uses best-effort heuristics. Complex merged cells and styled grids may need manual edits.",
    },
    {
      question: "What output format is generated?",
      answer:
        "Spreadsheet-ready output is produced in CSV/XLSX mode depending on the tool option and workflow path.",
    },
    {
      question: "Do scanned table PDFs work?",
      answer:
        "Scanned tables without OCR text are harder to parse and may require OCR first.",
    },
  ],
  "pdf-to-ppt": [
    {
      question: "Are slide texts editable after conversion?",
      answer:
        "Usually no. Slides are image-based representations of PDF pages.",
    },
    {
      question: "How many slides are created?",
      answer:
        "One slide is generated per PDF page in this workflow.",
    },
    {
      question: "How does scale affect output?",
      answer:
        "Higher scale improves sharpness but increases export size and processing time.",
    },
  ],
  "pdf-to-jpg": [
    {
      question: "Can I export only selected pages?",
      answer:
        "Yes. Use page selection syntax such as 1,3,5-7 to export specific pages.",
    },
    {
      question: "How should I choose image quality?",
      answer:
        "Higher quality improves clarity and increases file size. Lower quality reduces size for sharing.",
    },
    {
      question: "How are multi-page outputs downloaded?",
      answer:
        "Each page becomes a JPG file. Multi-page exports are typically bundled as ZIP.",
    },
  ],
  "jpg-to-pdf": [
    {
      question: "Can I reorder images before conversion?",
      answer:
        "Yes. Reorder the image list before generating the final PDF.",
    },
    {
      question: "Which image types are accepted?",
      answer:
        "JPG, JPEG, and PNG are supported in this workflow.",
    },
    {
      question: "Will image quality be preserved?",
      answer:
        "Source quality is retained as much as possible, but page-size and margin settings can affect visual scaling.",
    },
  ],
  "sign-pdf": [
    {
      question: "Is this a cryptographic digital signature?",
      answer:
        "No. This tool places a visual signature mark. It does not issue certificate-based digital signatures.",
    },
    {
      question: "Can I control signature position and size?",
      answer:
        "Yes. Choose page, coordinates, and size before exporting the signed PDF.",
    },
    {
      question: "Does it work on mobile touch screens?",
      answer:
        "Yes. Draw mode supports touch input for mobile signature capture.",
    },
  ],
  "protect-pdf": [
    {
      question: "Will every PDF viewer open protected files?",
      answer:
        "Most modern viewers work, but compatibility can vary on older or lightweight readers.",
    },
    {
      question: "What if I forget the password?",
      answer:
        "You will need the password to open the protected file. Store it safely before sharing.",
    },
    {
      question: "Is protection applied locally?",
      answer:
        "Yes. Password protection runs in your browser for this workflow.",
    },
  ],
  "unlock-pdf": [
    {
      question: "Do I need the existing password?",
      answer:
        "Yes. Unlock requires the correct password for the source PDF.",
    },
    {
      question: "Does this modify the original file?",
      answer:
        "No. You download a new unlocked copy and keep the original unchanged.",
    },
    {
      question: "What happens if the password is wrong?",
      answer:
        "The tool returns a clear error and does not produce unlocked output.",
    },
  ],
  "ocr-pdf": [
    {
      question: "Can OCR run without uploads?",
      answer:
        "Yes. OCR processing runs locally in your browser after required OCR assets are available.",
    },
    {
      question: "What affects OCR accuracy?",
      answer:
        "Scan quality, contrast, skew, language choice, and document complexity all influence recognition quality.",
    },
    {
      question: "What outputs are available?",
      answer:
        "You can export text output and, where supported, searchable PDF-style output.",
    },
  ],
}

const TOOL_PAGE_PROFILES: Record<string, ToolPageProfile> = {
  "merge-pdf": {
    title: "Merge PDFs Locally - No Upload | Plain Tools",
    description:
      "Merge PDF files locally in your browser with Plain Tools. No uploads, no file storage, and fast private output.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort merge. Source PDF corruption or encryption can prevent successful output.",
    featureList: [
      "Merge multiple PDFs locally",
      "Reorder files before export",
      "No uploads or server processing",
      "Works on desktop and mobile browsers",
    ],
  },
  "split-pdf": {
    title: "Split PDF Locally - No Upload | Plain Tools",
    description:
      "Split PDF pages by range or extract individual pages locally in your browser. Private, fast, and no upload required.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort split. Invalid page ranges or damaged PDFs may fail.",
    featureList: [
      "Split by custom page ranges",
      "Extract each page as a separate PDF",
      "Local browser-only processing",
      "Download single files or ZIP output",
    ],
  },
  "compare-pdf": {
    title: "Compare PDF Files Locally - No Upload | Plain Tools",
    description:
      "Compare two PDF files locally with page-by-page text diff and highlighted word changes in your browser.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort text diff. Visual layout-only changes and scanned image differences may not appear without extractable text.",
    featureList: [
      "Two-file local PDF comparison",
      "Page-by-page text extraction",
      "Line and word-level change highlights",
      "No-upload local processing",
    ],
  },
  "compress-pdf": {
    title: "Compress PDF Locally - No Upload | Plain Tools",
    description:
      "Compress PDF files locally with light, medium, or strong settings. No uploads and no server-side file handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Strong compression may flatten text into images and reduce visual quality.",
    featureList: [
      "Local PDF optimisation levels",
      "Before and after size comparison",
      "No upload compression workflow",
      "Fast browser-side output",
    ],
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Locally - No Upload | Plain Tools",
    description:
      "Rotate PDF pages by 90, 180, or 270 degrees locally with visual thumbnail previews and no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Rotation changes page orientation only and does not crop or reorder existing page content.",
    featureList: [
      "Per-page rotation control",
      "Global rotation shortcuts",
      "Thumbnail previews before export",
      "No-upload local processing",
    ],
  },
  "watermark-pdf": {
    title: "Add Watermark to PDF Locally - No Upload | Plain Tools",
    description:
      "Add text or image watermarks to PDF pages locally with opacity and placement controls and no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Watermarks are visual overlays. They improve document labelling but do not encrypt or lock content.",
    featureList: [
      "Text or image watermark mode",
      "Opacity, size, colour, and position controls",
      "Apply overlays across all pages",
      "No-upload local processing",
    ],
  },
  "annotate-pdf": {
    title: "Annotate PDF Locally - No Upload | Plain Tools",
    description:
      "Annotate PDF pages locally with pen, highlight, and text tools in a browser overlay workspace with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort annotation. This tool embeds visible marks and labels but does not support collaborative comments.",
    featureList: [
      "Pen, highlight, and text annotation tools",
      "Per-page canvas overlay workspace",
      "Thumbnail page navigation",
      "Local browser-only processing",
    ],
  },
  "pdf-to-word": {
    title: "PDF to Word Locally - No Upload | Plain Tools",
    description:
      "Convert PDF to Word (.docx) locally in your browser with Plain Tools. No uploads, no cloud storage, and private text extraction.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Complex layouts and forms may not stay perfectly formatted.",
    featureList: [
      "PDF text extraction to .docx",
      "Local conversion workflow",
      "No upload requirement",
      "Progress and download states",
    ],
  },
  "word-to-pdf": {
    title: "Word to PDF Locally - No Upload | Plain Tools",
    description:
      "Convert Word (.docx) files to PDF locally in your browser. Fast private processing with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Complex formatting can shift in output PDF.",
    featureList: [
      "DOCX to PDF conversion",
      "Offline-first browser processing",
      "No server upload",
      "Direct PDF download",
    ],
  },
  "text-to-pdf": {
    title: "Text to PDF Locally - No Upload | Plain Tools",
    description:
      "Convert plain text or Markdown to PDF locally in your browser without uploading files.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Markdown rendering is best-effort and supports core formatting only (headings, bold, italic).",
    featureList: [
      "Paste text or Markdown",
      "Load .txt and .md files locally",
      "Generate wrapped multi-page PDFs",
      "No-upload browser processing",
    ],
  },
  "html-to-pdf": {
    title: "HTML to PDF Locally - No Upload | Plain Tools",
    description:
      "Convert pasted HTML or fetched web content to PDF locally in your browser with best-effort rendering and fallback output.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort conversion only. Complex CSS, scripts, and external assets may not render exactly as source pages.",
    featureList: [
      "Paste HTML and export PDF locally",
      "Best-effort URL fetch for web pages",
      "Automatic text-only fallback when rendering fails",
      "No-upload browser conversion workflow",
    ],
  },
  "image-compress": {
    title: "Image Compressor / Optimizer Locally - No Upload | Plain Tools",
    description:
      "Compress JPG, PNG, and WebP images locally in your browser with quality controls and before/after previews.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort optimisation. PNG inputs are exported as WebP for stronger compression in most browsers.",
    featureList: [
      "Batch image compression",
      "Quality and max-dimension controls",
      "Before/after preview workflow",
      "ZIP download for multiple outputs",
    ],
  },
  "zip-tool": {
    title: "ZIP Extract & Create Locally - No Upload | Plain Tools",
    description:
      "Extract ZIP archives and create ZIP bundles locally in your browser with no upload step.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort support for common ZIP archives. Password-protected ZIP files are not supported in this basic workflow.",
    featureList: [
      "Extract ZIP files locally",
      "Select entries and re-bundle outputs",
      "Create ZIP archives from local files",
      "No-upload browser-only processing",
    ],
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Locally - No Upload | Plain Tools",
    description:
      "Convert PDF pages to JPG images locally with quality and scale options. No uploads and private output handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort conversion. Very large PDFs can take longer on mobile devices.",
    featureList: [
      "PDF pages to JPG images",
      "Per-page quality and scale settings",
      "ZIP output for multi-page files",
      "Local browser rendering",
    ],
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Locally - No Upload | Plain Tools",
    description:
      "Combine JPG, JPEG, or PNG images into one PDF locally. No uploads, no cloud storage, and simple layout controls.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Best-effort layout fitting. Image dimensions and orientation affect final spacing.",
    featureList: [
      "Multiple image to PDF",
      "Reorder image pages",
      "Page size, orientation, and margin controls",
      "No-upload local export",
    ],
  },
  "pdf-to-excel": {
    title: "PDF to Excel Locally - No Upload | Plain Tools",
    description:
      "Extract table-like data from PDF to spreadsheet output locally in your browser with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort extraction. Complex tables may require manual cleanup after export.",
    featureList: [
      "Table-like text extraction",
      "CSV spreadsheet output",
      "Fallback full text extraction",
      "Local processing without uploads",
    ],
  },
  "pdf-to-ppt": {
    title: "PDF to PowerPoint Locally - No Upload | Plain Tools",
    description:
      "Convert PDF pages to PowerPoint slides locally in your browser. No upload required and private processing.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Slides are image-based and text is not editable in output.",
    featureList: [
      "One slide per PDF page",
      "Local page rendering and export",
      "No server upload",
      "Download .pptx directly",
    ],
  },
  "pdf-to-html": {
    title: "PDF to HTML Locally - No Upload | Plain Tools",
    description:
      "Convert PDF files to HTML locally in your browser with extracted text and optional embedded page previews.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort conversion. Complex layouts, fonts, and positioning may differ from the source PDF.",
    featureList: [
      "Extract PDF page text to HTML",
      "Optional embedded page preview images",
      "Single downloadable .html output",
      "No-upload local browser processing",
    ],
  },
  "pdf-to-markdown": {
    title: "PDF to Markdown Locally - No Upload | Plain Tools",
    description:
      "Convert PDF text to Markdown locally in your browser with best-effort heading and list structure detection.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Best-effort output only. Complex layouts, tables, and scanned image PDFs may need manual Markdown cleanup.",
    featureList: [
      "Extract PDF text into Markdown",
      "Heading and list heuristics",
      "Inline bold and italic detection",
      "No-upload local browser conversion",
    ],
  },
  "file-hash": {
    title: "File Hash / Checksum Locally - No Upload | Plain Tools",
    description:
      "Compute SHA-256, MD5, SHA-1, and SHA-512 checksums for local files directly in your browser.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Checksums verify integrity but do not encrypt file content. Use SHA-256 for modern integrity workflows.",
    featureList: [
      "SHA-256, MD5, SHA-1, and SHA-512 support",
      "Hex digest output with copy action",
      "No-upload local browser hashing",
      "Works with any file type",
    ],
  },
  "qr-code": {
    title: "QR Code Generator Locally - No Upload | Plain Tools",
    description:
      "Generate QR codes for URLs or text locally in your browser with size, error correction, and colour options.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Very long text payloads can reduce scan reliability on older cameras. Keep payloads concise where possible.",
    featureList: [
      "URL and text QR generation",
      "Configurable size and error correction",
      "Foreground and background colour controls",
      "PNG and SVG downloads",
    ],
  },
  "qr-scanner": {
    title: "QR Code Scanner Locally - No Upload | Plain Tools",
    description:
      "Scan QR codes from camera preview or uploaded images locally in your browser with no file uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Requires browser Barcode Detection API support. Some browsers may not support camera/image QR decoding.",
    featureList: [
      "Camera-based QR scanning",
      "Uploaded image QR decoding",
      "Copy decoded text or URL",
      "No-upload local browser processing",
    ],
  },
  "sign-pdf": {
    title: "Sign PDF Locally - No Upload | Plain Tools",
    description:
      "Add a visual signature to PDF pages locally using draw or typed input. Private browser processing with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Visual signature placement only. This is not a cryptographic certificate workflow.",
    featureList: [
      "Draw or type a signature",
      "Page and position controls",
      "Local PDF stamping",
      "No-upload signing workflow",
    ],
  },
  "protect-pdf": {
    title: "Protect PDF Locally - No Upload | Plain Tools",
    description:
      "Encrypt PDF files with a password locally in your browser. No uploads and no server-side file handling.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "Viewer compatibility can vary across older PDF readers and mobile apps.",
    featureList: [
      "Password-protect PDF files",
      "Local browser encryption",
      "No upload workflow",
      "Private output download",
    ],
  },
  "unlock-pdf": {
    title: "Unlock PDF Locally - No Upload | Plain Tools",
    description:
      "Unlock password-protected PDFs locally in your browser when you have the password. No uploads or server processing.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "Only works if the correct password is provided.",
    featureList: [
      "Remove known PDF password locally",
      "User-friendly incorrect-password handling",
      "No-upload processing",
      "Download unlocked PDF",
    ],
  },
  "ocr-pdf": {
    title: "OCR PDF Locally - No Upload | Plain Tools",
    description:
      "Run OCR on scanned PDFs locally in your browser and export searchable PDF or text output. No uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation:
      "OCR is best-effort and can be slower on large files or mobile devices.",
    featureList: [
      "Local OCR with WebAssembly",
      "Searchable PDF output",
      "Text-only fallback export",
      "English and German language support",
    ],
  },
  "offline-ocr": {
    title: "Offline OCR PDF Tool - No Upload | Plain Tools",
    description:
      "Generate searchable PDFs locally from scanned documents using offline OCR in your browser with no uploads.",
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation: "OCR speed and accuracy depend on scan quality, language, and device performance.",
    featureList: [
      "Offline OCR pipeline",
      "Searchable PDF generation",
      "Batch-friendly local processing",
      "No server-side file handling",
    ],
  },
}

export type ResolvedToolPageProfile = ToolPageProfile & {
  overview: string
  useCases: string[]
  answerFirst: ToolAnswerFirstContent
  faqs: ToolFaqItem[]
}

export function buildToolHowToSteps(tool: ToolDefinition): string[] {
  const noun =
    tool.category === "Utility"
      ? "input"
      : tool.category === "AI Assistant"
        ? "document"
        : "file"

  return [
    `Add the ${noun} or inputs you want to process in the ${tool.name} workspace.`,
    "Choose the settings that match the output you want before starting the run.",
    `Run ${tool.name} directly in your browser and wait for the local processing step to finish.`,
    "Download the result and review it before sharing, archiving, or sending it onward.",
  ]
}

export function buildToolSeoDescription(
  tool: ToolDefinition,
  profile: Pick<ResolvedToolPageProfile, "overview" | "description" | "useCases" | "answerFirst">
) {
  return [
    `${tool.name} is designed for people who want a practical browser-first workflow instead of uploading files to a third-party service just to complete a routine task. ${profile.overview} ${profile.description}`,
    `${profile.answerFirst.localProcessing} That matters when you are handling work files, drafts, forms, exported data, or other material that should stay under your control until you decide to share the result. It also removes the usual upload delay, which keeps the workflow lighter and easier to repeat when you need to adjust settings and try again.`,
    `In most cases, people use ${tool.name} to ${profile.useCases[0].charAt(0).toLowerCase()}${profile.useCases[0].slice(1)} ${profile.useCases[1].charAt(0).toLowerCase()}${profile.useCases[1].slice(1)} Before you publish, archive, or forward the output, do a quick review of the result because ${profile.answerFirst.limitations.charAt(0).toLowerCase()}${profile.answerFirst.limitations.slice(1)}`,
  ].join("\n\n")
}

function buildDefaultToolFaqs(tool: ToolDefinition, limitation: string): ToolFaqItem[] {
  const localProcessingAnswer =
    tool.category === "AI Assistant"
      ? "Core extraction starts locally. AI responses only run when you explicitly opt in to server-backed processing for that workflow."
      : "Core processing runs locally in your browser for this workflow, so the file or input stays on your device during the main operation."

  return [
    {
      question: `Does ${tool.name} upload my files?`,
      answer: localProcessingAnswer,
    },
    {
      question: `How do I use ${tool.name}?`,
      answer: `Open the tool, add your source file or input, choose the options you need, run the workflow, and download the result from the same page.`,
    },
    {
      question: `What should I check before sharing the output from ${tool.name}?`,
      answer: `${limitation} Review the generated output once before sharing it so you can confirm formatting, completeness, and file quality.`,
    },
  ]
}

function buildDefaultAnswerFirst(
  tool: ToolDefinition,
  overview: string,
  limitation: string
): ToolAnswerFirstContent {
  const localText =
    tool.category === "Network Tools"
      ? "Network checks query endpoints directly and return results in-browser. No document file uploads are involved."
      : "Core processing runs in your browser, so file bytes stay on your device for local workflows."

  return {
    summary: `${tool.name} handles this workflow with a practical browser-first process and clear output download steps.`,
    whatItDoes: overview,
    whatYouProvide: "Source file(s) and the tool-specific options shown in the workspace panel.",
    whatYouGet: "A processed output file ready to download on this page.",
    localProcessing: localText,
    limitations: limitation,
    whatToExpect: [
      "Processing time depends on file size and device performance.",
      "Best-effort tools may need manual review on complex layouts.",
      "Download and verify output before sharing.",
    ],
  }
}

export function getToolPageProfile(tool: ToolDefinition): ResolvedToolPageProfile {
  const profile = TOOL_PAGE_PROFILES[tool.slug]
  if (profile) {
    const overview =
      profile.overview ??
      `${tool.name} runs in your browser for local, private document handling. Process files directly on your device without a server-side upload step for core workflows.`
    const useCases =
      profile.useCases ?? [
        "Prepare documents quickly before sharing or archiving.",
        "Handle privacy-sensitive files without third-party upload workflows.",
        "Run practical browser-first tasks on desktop or mobile.",
      ]

    return {
      ...profile,
      overview,
      useCases,
      answerFirst:
        TOOL_ANSWER_FIRST_OVERRIDES[tool.slug] ??
        buildDefaultAnswerFirst(tool, overview, profile.limitation),
      faqs: TOOL_FAQ_OVERRIDES[tool.slug] ?? buildDefaultToolFaqs(tool, profile.limitation),
    }
  }

  const overview = `${tool.name} runs locally in your browser. This keeps file handling on your device for faster, private workflow control.`
  const limitation = DEFAULT_LIMITATION

  return {
    title: `${tool.name} Locally - No Upload | Plain Tools`,
    description:
      `${tool.description} Process files locally in your browser with no uploads or server-side handling.`,
    trustPoints: DEFAULT_TRUST_POINTS,
    limitation,
    featureList: [
      "Local browser processing",
      "No upload workflow",
      "Fast private output",
      "Cross-device compatible",
    ],
    overview,
    useCases: [
      "Quick day-to-day document tasks",
      "Private handling for sensitive files",
      "Simple browser-based processing without extra software",
    ],
    answerFirst: buildDefaultAnswerFirst(tool, overview, limitation),
    faqs: TOOL_FAQ_OVERRIDES[tool.slug] ?? buildDefaultToolFaqs(tool, limitation),
  }
}

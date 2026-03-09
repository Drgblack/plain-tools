import type { Metadata } from "next"

import { buildCanonicalUrl } from "@/lib/page-metadata"

export type PdfIntentToolKey =
  | "compress-pdf"
  | "merge-pdf"
  | "pdf-to-word"
  | "word-to-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "extract-pdf"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "watermark-pdf"
  | "sign-pdf"
  | "protect-pdf"
  | "unlock-pdf"
  | "fill-pdf"
  | "reorder-pdf"
  | "annotate-pdf"
  | "compare-pdf"
  | "ocr-pdf"
  | "offline-ocr"
  | "pdf-to-excel"
  | "pdf-to-ppt"
  | "html-to-pdf"
  | "pdf-to-html"
  | "pdf-to-markdown"
  | "text-to-pdf"

type IntentLink = {
  label: string
  href: string
}

type IntentFaq = {
  question: string
  answer: string
}

export type PdfIntentPage = {
  slug: string
  h1: string
  title: string
  metaDescription: string
  intro: string
  toolKey: PdfIntentToolKey
  canonicalToolHref: string
  canonicalToolLabel: string
  toolSummary?: string
  howItWorks: string[]
  relatedTools: IntentLink[]
  learnLinks: IntentLink[]
  faqs: IntentFaq[]
  limitations?: string[]
}

export const PDF_INTENT_PAGES: PdfIntentPage[] = [
  {
    slug: "compress-pdf-online",
    h1: "Compress PDF Online",
    title: "Compress PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Compress PDF files online directly in your browser. Plain.tools processes files locally so your documents never leave your device.",
    intro:
      "Compress PDF Online is built for people who need a smaller PDF without sending documents to a remote server. Whether you are trying to email a file, upload a report to a form with strict limits, or store lighter PDFs on your device, this page lets you reduce file size using the same local compression engine that powers the main Plain.tools workflow. The tool runs inside your browser, so the PDF stays on your device while you choose a lighter, medium, or stronger optimisation mode. That matters for invoices, contracts, internal memos, and other files you should not casually upload to third-party services. It is also faster for many everyday jobs because there is no upload queue, no waiting for server-side processing, and no account step. If the file is still too large after one pass, you can adjust the settings and try again immediately. The result is a practical, privacy-first way to compress PDFs online while keeping the actual processing local.",
    toolKey: "compress-pdf",
    canonicalToolHref: "/tools/compress-pdf",
    canonicalToolLabel: "Compress PDF",
    howItWorks: [
      "Upload your PDF directly from your device into the local browser workspace.",
      "Choose the compression level that matches your quality and file-size target.",
      "Download the optimised PDF after processing finishes locally.",
    ],
    relatedTools: [
      { label: "Reduce PDF Size", href: "/reduce-pdf-size" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
      { label: "Split PDF Pages", href: "/split-pdf-pages" },
    ],
    learnLinks: [
      {
        label: "Compress PDF Without Losing Quality",
        href: "/learn/compress-pdf-without-losing-quality",
      },
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "How can I compress a PDF without uploading it?",
        answer:
          "Use the local PDF compressor on this page. The file is processed in your browser, so the document stays on your device instead of being sent to a remote server.",
      },
      {
        question: "Does Plain.tools store my PDF files?",
        answer:
          "No. Plain.tools does not store your files for this workflow. Core compression runs locally in your browser session and does not require an upload step.",
      },
      {
        question: "What compression method is used?",
        answer:
          "The compressor uses local PDF optimisation techniques, including metadata cleanup and stronger image-based rebuilding modes when you choose more aggressive reduction.",
      },
    ],
  },
  {
    slug: "reduce-pdf-size",
    h1: "Reduce PDF Size (Private, No Uploads)",
    title: "Reduce PDF Size (Private, No Uploads) | Plain.tools",
    metaDescription:
      "Reduce PDF size in your browser with no uploads required. Private local processing for smaller PDFs and faster sharing.",
    intro:
      "Reduce PDF Size is a query-focused landing page for people who need a lighter file quickly and do not want to upload sensitive documents just to shrink them. Many PDFs become difficult to email, attach to application portals, or store efficiently because they contain large images, bloated metadata, or page content that can be rebuilt more efficiently. This page reuses the existing Plain.tools compression workflow and places it behind a search-friendly route that matches what users actually type. The experience stays lightweight because nothing new is being processed on a server. Your PDF opens in the browser, the optimisation runs locally, and you download the smaller file directly from the same session. That approach is useful for work documents, signed forms, receipts, legal paperwork, and any file where privacy still matters even if the task seems routine. If you want stronger size reduction, you can move from lighter optimisation to more aggressive compression and compare the output before sharing it.",
    toolKey: "compress-pdf",
    canonicalToolHref: "/tools/compress-pdf",
    canonicalToolLabel: "Compress PDF",
    howItWorks: [
      "Select the PDF you want to make smaller from your device.",
      "Pick a light, medium, or strong optimisation mode depending on the result you need.",
      "Download the reduced PDF once the local processing completes.",
    ],
    relatedTools: [
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
    ],
    learnLinks: [
      {
        label: "Compress PDF Without Losing Quality",
        href: "/learn/compress-pdf-without-losing-quality",
      },
      {
        label: "Why PDF Uploads Are Risky",
        href: "/learn/why-pdf-uploads-are-risky",
      },
    ],
    faqs: [
      {
        question: "Can I reduce PDF size for free?",
        answer:
          "Yes. This page uses the existing Plain.tools local compressor and does not require an account for basic use.",
      },
      {
        question: "Will reducing PDF size affect quality?",
        answer:
          "It depends on the mode you choose. Light optimisation aims to preserve structure, while stronger settings trade some fidelity for smaller output.",
      },
      {
        question: "Does reducing PDF size require a cloud upload?",
        answer:
          "No. The compression workflow on this page runs in your browser, so the PDF is not uploaded as part of the core processing path.",
      },
    ],
  },
  {
    slug: "merge-pdf-files",
    h1: "Merge PDF Files",
    title: "Merge PDF Files (No Uploads) | Plain.tools",
    metaDescription:
      "Merge PDF files directly in your browser with no uploads. Combine PDFs privately using the existing local Plain.tools merge workflow.",
    intro:
      "Merge PDF Files is designed for people who need to combine contracts, reports, scanned pages, or supporting documents into one PDF without pushing everything through an upload service. The page embeds the same local merge interface used by the main Plain.tools tool route, so you are not using a separate or simplified engine. You can add multiple PDFs, reorder them, and produce a single output file while the work stays in your browser. That matters when you are handling internal paperwork, customer records, financial files, or drafts that should remain on your device until you choose to share the result. It also keeps the workflow fast and lightweight because there is no waiting for uploads, server conversion queues, or account-based limits before you can download the merged file. If you realise the final document needs page extraction, compression, or format conversion after merging, you can move directly to related PDF tools from this page without leaving the privacy-first workflow cluster.",
    toolKey: "merge-pdf",
    canonicalToolHref: "/tools/merge-pdf",
    canonicalToolLabel: "Merge PDFs",
    howItWorks: [
      "Add two or more PDF files from your device into the merge workspace.",
      "Reorder the files so the final document follows the sequence you need.",
      "Run the local merge and download the combined PDF.",
    ],
    relatedTools: [
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
      { label: "Split PDF Pages", href: "/split-pdf-pages" },
      { label: "Convert PDF to Word", href: "/convert-pdf-to-word" },
    ],
    learnLinks: [
      {
        label: "How to Merge PDFs Offline",
        href: "/learn/how-to-merge-pdfs-offline",
      },
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I merge PDF files without uploading them?",
        answer:
          "Yes. This page uses the local Plain.tools merge workflow, so the PDFs are combined in your browser instead of being sent to a remote merge service.",
      },
      {
        question: "Can I change the order before merging?",
        answer:
          "Yes. The embedded merge tool lets you reorder files before creating the final PDF.",
      },
      {
        question: "Does Plain.tools keep a copy of merged PDFs?",
        answer:
          "No. The merge workflow is designed around local processing, so the files remain on your device during the core operation.",
      },
    ],
  },
  {
    slug: "convert-pdf-to-word",
    h1: "Convert PDF to Word",
    title: "Convert PDF to Word (No Uploads) | Plain.tools",
    metaDescription:
      "Convert PDF to Word in your browser with no uploads required. Private local processing for best-effort DOCX conversion.",
    intro:
      "Convert PDF to Word is built for the common search intent behind people who want an editable version of a PDF without handing the file to an online converter. This page embeds the existing Plain.tools PDF to Word component, so the conversion logic is reused rather than duplicated. The workflow is best for text-based PDFs where you need to pull content into a DOCX file for editing, review, or repurposing. It is useful for reports, drafts, meeting notes, exported manuals, and other documents where the main goal is recovering text rather than preserving a pixel-perfect layout. Because the processing runs in your browser, the PDF stays local to your device while the tool extracts text and prepares a Word download. That privacy model is important for business documents and personal records that still need careful handling. If the source PDF is image-based or heavily styled, the output may need cleanup afterward, but this route gives users a fast, lightweight starting point that avoids cloud upload services and reuses the exact tool already present on Plain.tools.",
    toolKey: "pdf-to-word",
    canonicalToolHref: "/tools/pdf-to-word",
    canonicalToolLabel: "PDF to Word",
    howItWorks: [
      "Upload the PDF you want to convert into an editable document.",
      "Run the local text extraction and DOCX generation workflow in your browser.",
      "Download the generated Word file and review formatting as needed.",
    ],
    relatedTools: [
      { label: "Convert Word to PDF", href: "/convert-word-to-pdf" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
    ],
    learnLinks: [
      {
        label: "How to Verify a PDF Tool Does Not Upload Your Files",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      },
      {
        label: "How PDFs Work",
        href: "/learn/how-pdfs-work",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF to Word without uploading the file?",
        answer:
          "Yes. This route uses the existing local PDF to Word workflow, so the PDF is processed in your browser during the core conversion path.",
      },
      {
        question: "Will the Word output keep the same formatting?",
        answer:
          "It is a best-effort conversion. Plain text and simple structure usually come across better than complex layouts, forms, or scanned pages.",
      },
      {
        question: "Does Plain.tools store converted documents?",
        answer:
          "No. The converter is designed for local processing, and the generated DOCX is created in your browser session for direct download.",
      },
    ],
  },
  {
    slug: "convert-word-to-pdf",
    h1: "Convert Word to PDF",
    title: "Convert Word to PDF (No Uploads) | Plain.tools",
    metaDescription:
      "Convert Word to PDF directly in your browser with no uploads. Private DOCX-to-PDF conversion using local Plain.tools processing.",
    intro:
      "Convert Word to PDF matches a high-intent search query for people who want a quick DOCX-to-PDF workflow without relying on a cloud office suite or upload-based converter. This page embeds the existing Plain.tools Word to PDF component and keeps the behaviour lightweight by reusing the live tool rather than duplicating any conversion logic. The workflow is useful when you need a PDF for sharing, archiving, printing, or submitting a document to a portal that does not accept Word files. It is especially helpful for resumes, statements, checklists, draft agreements, and internal documents where privacy still matters. Because the processing happens in your browser, the Word file remains on your device during the core conversion step. That means there is no server-side upload queue just to turn a DOCX into a PDF. Formatting can still vary with complex source documents, which is true of most browser-based conversions, but this route gives you a practical, private way to create a PDF quickly and move on to related tools such as merge, compress, or image conversion when needed.",
    toolKey: "word-to-pdf",
    canonicalToolHref: "/tools/word-to-pdf",
    canonicalToolLabel: "Word to PDF",
    howItWorks: [
      "Upload a DOCX file from your device into the local converter.",
      "Run the browser-based Word to PDF conversion workflow.",
      "Download the resulting PDF when the file is ready.",
    ],
    relatedTools: [
      { label: "Convert PDF to Word", href: "/convert-pdf-to-word" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
    ],
    learnLinks: [
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
      {
        label: "How to Verify a PDF Tool Does Not Upload Your Files",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      },
    ],
    faqs: [
      {
        question: "Can I convert Word to PDF without uploading it?",
        answer:
          "Yes. The embedded DOCX-to-PDF tool runs in your browser, so the Word file is not uploaded as part of the standard workflow.",
      },
      {
        question: "What Word files are supported?",
        answer:
          "This workflow is built for DOCX files. If your document uses heavy styling, review the exported PDF before sharing.",
      },
      {
        question: "Does Plain.tools store Word documents?",
        answer:
          "No. Plain.tools does not store DOCX inputs for this local conversion flow. The file is processed in your browser session.",
      },
    ],
  },
  {
    slug: "split-pdf-pages",
    h1: "Split PDF Pages",
    title: "Split PDF Pages (No Uploads) | Plain.tools",
    metaDescription:
      "Split PDF pages in your browser with no uploads. Extract ranges or individual pages privately using local Plain.tools processing.",
    intro:
      "Split PDF Pages is aimed at people searching for a quick way to break a large PDF into smaller parts, extract certain ranges, or save individual pages without uploading documents to a third-party site. This page reuses the existing Plain.tools split workflow, so the logic stays in one place while the SEO route targets the actual search intent. You can load a PDF from your device, choose whether to extract selected pages, separate every page, or split by ranges, and then download the results directly. That is practical for contracts, slide decks, invoices, scans, school forms, or document bundles where only a few pages are needed. Running the workflow locally matters because many split jobs involve files that should not be handed to random web services. It also keeps the experience lightweight and fast for small to medium PDFs because you avoid upload time entirely. If your end goal changes, this page also connects directly to related tools for extracting pages, rotating output, or merging sections back together.",
    toolKey: "split-pdf",
    canonicalToolHref: "/tools/split-pdf",
    canonicalToolLabel: "Split PDF",
    howItWorks: [
      "Upload one PDF and choose whether to extract pages, split by range, or separate every page.",
      "Enter the page selection or range pattern you need for the output.",
      "Run the local split process and download the generated file or ZIP bundle.",
    ],
    relatedTools: [
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Rotate PDF Pages", href: "/rotate-pdf-pages" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
    ],
    learnLinks: [
      {
        label: "How to Split a PDF by Pages",
        href: "/learn/how-to-split-a-pdf-by-pages",
      },
      {
        label: "How PDFs Work",
        href: "/learn/how-pdfs-work",
      },
    ],
    faqs: [
      {
        question: "Can I split PDF pages without uploading my file?",
        answer:
          "Yes. This route uses the local Plain.tools split workflow, which runs in your browser and keeps the PDF on your device during processing.",
      },
      {
        question: "Can I save one page per file?",
        answer:
          "Yes. The split tool supports separate single-page outputs as well as custom extraction and range-based splitting.",
      },
      {
        question: "Will I get a ZIP file when splitting many pages?",
        answer:
          "Yes. When the workflow creates multiple outputs, Plain.tools can package them into a ZIP for easier downloading.",
      },
    ],
  },
  {
    slug: "rotate-pdf-pages",
    h1: "Rotate PDF Pages",
    title: "Rotate PDF Pages (No Uploads) | Plain.tools",
    metaDescription:
      "Rotate PDF pages locally in your browser with no uploads. Use thumbnail controls and download the updated PDF privately.",
    intro:
      "Rotate PDF Pages serves the common search intent behind users who need to fix sideways scans, upside-down statements, or mixed-orientation PDFs without sending them through an upload service. This landing page embeds the existing Plain.tools rotation interface with thumbnail previews and per-page controls, so it uses the same tool logic already available on the canonical route. You can upload a PDF, inspect each page visually, apply 90-degree or 180-degree changes, and download a corrected document directly from the browser. That is especially useful for scanned paperwork, mobile camera captures, onboarding forms, records exported from old systems, or any bundle where page orientation is inconsistent. Because the work happens locally, the source file stays on your device during processing. That keeps the workflow privacy-first while also removing the friction of waiting for an online service to upload and return the file. If you need more than rotation, you can move from this page to related split, extract, or merge routes that continue using the same local-only model.",
    toolKey: "rotate-pdf",
    canonicalToolHref: "/tools/rotate-pdf",
    canonicalToolLabel: "Rotate PDF Pages",
    howItWorks: [
      "Upload one PDF so the tool can render local page thumbnails.",
      "Rotate individual pages or all pages until the preview matches the result you want.",
      "Download the updated PDF with the new page orientation applied.",
    ],
    relatedTools: [
      { label: "Split PDF Pages", href: "/split-pdf-pages" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
    ],
    learnLinks: [
      {
        label: "How PDFs Work",
        href: "/learn/how-pdfs-work",
      },
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I rotate one page instead of the whole PDF?",
        answer:
          "Yes. The embedded rotation tool supports per-page rotation as well as global rotation actions.",
      },
      {
        question: "Does rotating a PDF upload the file anywhere?",
        answer:
          "No. This route uses local browser processing, so the PDF is not uploaded for the core rotation workflow.",
      },
      {
        question: "Can I preview pages before downloading?",
        answer:
          "Yes. The tool shows local page thumbnails so you can review orientation before exporting the final PDF.",
      },
    ],
  },
  {
    slug: "extract-pdf-pages",
    h1: "Extract PDF Pages",
    title: "Extract PDF Pages (No Uploads) | Plain.tools",
    metaDescription:
      "Extract PDF pages in your browser with no uploads. Pull selected pages into a new PDF using local Plain.tools processing.",
    intro:
      "Extract PDF Pages is built for people who only need part of a document and want a fast way to pull those pages out without uploading the full file. This route reuses the existing Plain.tools extraction workflow, so the tool you see here is the same local component already used on the main site. You can upload one PDF, specify exact page numbers or ranges, and generate either one combined output or separate single-page PDFs depending on the task. That is useful when you need to share only relevant pages from a long report, send a single signed page from a larger document, or remove unrelated material before forwarding a file. Running the workflow in the browser keeps the process privacy-first because the PDF remains on your device while the extraction happens. It also makes quick edits more convenient because there is no upload and return cycle to wait for. If you need to rotate extracted pages, merge them, or compress the result afterward, this route keeps those next steps close by.",
    toolKey: "extract-pdf",
    canonicalToolHref: "/tools/extract-pdf",
    canonicalToolLabel: "Extract PDF Pages",
    howItWorks: [
      "Upload a PDF and enter the page numbers or ranges you want to keep.",
      "Choose whether to combine the extracted pages into one file or separate them.",
      "Download the extracted PDF output directly from your browser session.",
    ],
    relatedTools: [
      { label: "Split PDF Pages", href: "/split-pdf-pages" },
      { label: "Rotate PDF Pages", href: "/rotate-pdf-pages" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    learnLinks: [
      {
        label: "How to Extract Pages from a PDF",
        href: "/learn/how-to-extract-pages-from-a-pdf",
      },
      {
        label: "Common PDF Privacy Mistakes",
        href: "/learn/common-pdf-privacy-mistakes",
      },
    ],
    faqs: [
      {
        question: "Can I extract selected pages from a PDF without uploading it?",
        answer:
          "Yes. This page uses the existing local extraction tool, so the PDF stays in your browser session during processing.",
      },
      {
        question: "Can I extract a range like pages 3 to 7?",
        answer:
          "Yes. The extractor supports both individual page numbers and ranges, such as 3-7 or mixed selections like 1,4,8-10.",
      },
      {
        question: "Can I save each extracted page separately?",
        answer:
          "Yes. You can generate separate PDF files for selected pages instead of combining everything into one output.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    h1: "PDF to JPG",
    title: "PDF to JPG (No Uploads) | Plain.tools",
    metaDescription:
      "Convert PDF to JPG in your browser with no uploads required. Private local processing for page-by-page JPG export.",
    intro:
      "PDF to JPG is for users who need PDF pages as images without relying on an upload-based converter. This route embeds the existing Plain.tools PDF to JPG component, so the conversion logic remains shared while the page targets the search query directly. You can load a PDF from your device, choose image quality and scale, select all pages or only specific ones, and download the rendered JPG output from the same browser session. That makes it useful for slide thumbnails, document previews, social graphics, page snapshots, design references, or cases where you need an image instead of a PDF. Because the rendering runs locally, the document does not need to leave your device during the core workflow. That is a better fit for private reports, internal decks, or customer documents that still require careful handling. The route stays lightweight by reusing the current tool component, and it links naturally into adjacent tasks such as JPG to PDF, compression, and splitting when you need to keep working with the same document set.",
    toolKey: "pdf-to-jpg",
    canonicalToolHref: "/tools/pdf-to-jpg",
    canonicalToolLabel: "PDF to JPG",
    howItWorks: [
      "Upload a PDF and choose whether to convert all pages or a selected range.",
      "Adjust output quality and scale for the JPG images you want to generate.",
      "Download the resulting JPG file or ZIP bundle once local rendering finishes.",
    ],
    relatedTools: [
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    learnLinks: [
      {
        label: "How to Verify a PDF Tool Does Not Upload Your Files",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      },
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF pages to JPG without uploading the file?",
        answer:
          "Yes. The PDF to JPG workflow on this page runs locally in your browser, so the document stays on your device during the core conversion step.",
      },
      {
        question: "Can I export only selected PDF pages as JPG?",
        answer:
          "Yes. The embedded tool supports page selection so you can convert a full document or only the pages you need.",
      },
      {
        question: "What happens if there are many output images?",
        answer:
          "When the conversion produces multiple JPG files, the tool can bundle them into a ZIP download for easier handling.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    h1: "JPG to PDF",
    title: "JPG to PDF (No Uploads) | Plain.tools",
    metaDescription:
      "Convert JPG to PDF in your browser with no uploads. Private local image-to-PDF conversion using existing Plain.tools logic.",
    intro:
      "JPG to PDF targets people who want to combine screenshots, scanned pages, phone photos, or exported images into one PDF without using an upload-based image converter. This page embeds the existing Plain.tools JPG to PDF component, which means it reuses the current local workflow instead of duplicating any file-processing logic. You can add multiple JPG, JPEG, or PNG files, reorder them, choose page size and margins, and generate one PDF for download directly in the browser. That is practical for receipts, homework pages, simple reports, travel records, visual references, and small document bundles assembled from images. Keeping the workflow local matters because those images may still contain personal or business information that should not be passed through a random cloud service. It also keeps the experience efficient for everyday use because there is no upload queue to wait through before you get the PDF. From this page, you can continue to related routes like merge, compress, or PDF to JPG if your document workflow changes after conversion.",
    toolKey: "jpg-to-pdf",
    canonicalToolHref: "/tools/jpg-to-pdf",
    canonicalToolLabel: "JPG to PDF",
    howItWorks: [
      "Add one or more JPG, JPEG, or PNG files from your device.",
      "Arrange the images and choose page size, orientation, and margin settings.",
      "Generate the PDF locally and download the finished file.",
    ],
    relatedTools: [
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    learnLinks: [
      {
        label: "No Uploads Explained",
        href: "/learn/no-uploads-explained",
      },
      {
        label: "How to Verify a PDF Tool Does Not Upload Your Files",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      },
    ],
    faqs: [
      {
        question: "Can I convert JPG to PDF without uploading images?",
        answer:
          "Yes. The JPG to PDF workflow runs in your browser, so the images stay on your device during the core conversion process.",
      },
      {
        question: "Can I combine multiple JPG files into one PDF?",
        answer:
          "Yes. You can add multiple images, reorder them, and export a single PDF containing all pages.",
      },
      {
        question: "Does JPG to PDF also support PNG files?",
        answer:
          "Yes. The existing Plain.tools image-to-PDF workflow accepts JPG, JPEG, and PNG inputs on this page.",
      },
    ],
  },
  {
    slug: "add-watermark-to-pdf",
    h1: "Add Watermark to PDF",
    title: "Add Watermark to PDF Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Add a text or image watermark to PDF files directly in your browser. Private local processing keeps documents on your device with no upload step.",
    intro:
      "Add Watermark to PDF is built for people who need a visible review mark, draft label, or ownership stamp without sending the document to a hosted watermark service. The same local Plain Tools watermark workflow runs here, so you can place text or image watermarks, adjust opacity and position, and review the result before download.",
    toolKey: "watermark-pdf",
    canonicalToolHref: "/tools/watermark-pdf",
    canonicalToolLabel: "Add Watermark to PDF",
    howItWorks: [
      "Upload the PDF and choose whether you want a text watermark or an image watermark.",
      "Adjust opacity, size, placement, and repeat settings until the preview matches your intended output.",
      "Export the finished PDF locally and review a few pages before sending it onward.",
    ],
    relatedTools: [
      { label: "Sign PDF", href: "/sign-pdf-online" },
      { label: "Protect PDF with Password", href: "/protect-pdf-with-password" },
      { label: "Annotate PDF", href: "/annotate-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Add watermark before client review",
        href: "/learn/workflows/add-watermark-before-client-review",
      },
      {
        label: "Why PDF uploads are risky",
        href: "/learn/why-pdf-uploads-are-risky",
      },
    ],
    faqs: [
      {
        question: "Can I add a watermark to PDF files without uploading them?",
        answer:
          "Yes. This page uses the local watermark workflow, so the PDF stays on your device during the core processing step.",
      },
      {
        question: "Can I use an image as the watermark?",
        answer:
          "Yes. You can apply either text or image watermarks and adjust their scale, opacity, and placement.",
      },
      {
        question: "Should I watermark the final release copy?",
        answer:
          "Usually only if the recipient actually needs the watermark. Draft, review, and internal versions are the most common cases.",
      },
    ],
    limitations: [
      "Check a few pages after export to confirm the watermark does not cover signatures, page numbers, or fine print.",
      "Large PDFs can take longer because every page needs a local watermark pass before download.",
      "If the watermark is only for review, keep an unmarked source copy for the final release workflow.",
    ],
  },
  {
    slug: "sign-pdf-online",
    h1: "Sign PDF Online",
    title: "Sign PDF Online Privately (No Uploads) | Plain Tools",
    metaDescription:
      "Sign PDF files online in your browser without uploading them. Create a private local signature workflow and download the signed PDF directly.",
    intro:
      "Sign PDF Online is for people who need a quick visual signing workflow without handing the document to a hosted signing service. It uses the local Plain Tools signing interface, so you can draw, type, or place a signature and export the result directly from the same browser session.",
    toolKey: "sign-pdf",
    canonicalToolHref: "/tools/sign-pdf",
    canonicalToolLabel: "Sign PDF",
    howItWorks: [
      "Upload the PDF and choose a visual signature method such as draw, type, or image placement.",
      "Position the signature where it belongs and review page alignment before final export.",
      "Download the signed PDF locally and keep the original copy unchanged for recordkeeping.",
    ],
    relatedTools: [
      { label: "Protect PDF with Password", href: "/protect-pdf-with-password" },
      { label: "Fill PDF Form", href: "/fill-pdf-form-online" },
      { label: "Add Watermark to PDF", href: "/add-watermark-to-pdf" },
    ],
    learnLinks: [
      {
        label: "How to sign a PDF without uploading it",
        href: "/learn/how-to-sign-a-pdf-without-uploading-it",
      },
      {
        label: "Fill and sign PDF for HR onboarding",
        href: "/learn/workflows/fill-and-sign-pdf-for-hr-onboarding",
      },
    ],
    faqs: [
      {
        question: "Can I sign a PDF online without uploading it?",
        answer:
          "Yes. The signing step runs locally in your browser, so the PDF stays on your device during the core workflow.",
      },
      {
        question: "Does this create a hosted e-signature workflow?",
        answer:
          "No. This page is for local PDF signing in the browser, not a hosted account-based signature routing service.",
      },
      {
        question: "Should I keep the unsigned source file?",
        answer:
          "Yes. Keep the original version and create a separate signed output for the document you actually plan to share.",
      },
    ],
    limitations: [
      "Review the signature placement and page scaling carefully before sharing the signed output.",
      "If the recipient needs a specific signing standard or hosted audit trail, check those requirements before relying on a local visual signature alone.",
      "Keep the original unsigned file so you can rebuild the signed copy if the first export needs changes.",
    ],
  },
  {
    slug: "protect-pdf-with-password",
    h1: "Protect PDF with Password",
    title: "Protect PDF with Password Locally | Plain Tools",
    metaDescription:
      "Protect a PDF with a password directly in your browser. Private local processing lets you encrypt the file without an upload step.",
    intro:
      "Protect PDF with Password matches the common query behind people who need to restrict access before emailing or archiving a document. The same local Plain Tools protection workflow runs here, so you can set the password on-device and download the protected copy without sending the file to a hosted service.",
    toolKey: "protect-pdf",
    canonicalToolHref: "/tools/protect-pdf",
    canonicalToolLabel: "Protect PDF",
    howItWorks: [
      "Upload the PDF and choose the password you want to require for opening the file.",
      "Run the local protection step and create a separate password-protected output copy.",
      "Test the protected file before sending it and share the password through a different channel.",
    ],
    relatedTools: [
      { label: "Unlock PDF", href: "/unlock-pdf-online" },
      { label: "Sign PDF", href: "/sign-pdf-online" },
      { label: "Fill PDF Form", href: "/fill-pdf-form-online" },
    ],
    learnLinks: [
      {
        label: "How to protect a PDF with a password",
        href: "/learn/how-to-protect-a-pdf-with-a-password",
      },
      {
        label: "Password-protect PDF before emailing",
        href: "/learn/workflows/password-protect-pdf-before-emailing",
      },
    ],
    faqs: [
      {
        question: "Can I password-protect a PDF without uploading it?",
        answer:
          "Yes. The protection step runs locally in your browser, so the PDF does not need to leave your device.",
      },
      {
        question: "Should I protect the source file or a copy?",
        answer:
          "Protect a copy. Keep the original unchanged so you still have a clean source version for internal use.",
      },
      {
        question: "Is email still safe after password protection?",
        answer:
          "Password protection helps, but you should still send the password through a separate channel and check whether email is appropriate for the document class.",
      },
    ],
    limitations: [
      "Test the protected file before sending it so you know the password was applied correctly.",
      "Password protection does not replace broader document-handling controls, especially for highly sensitive files.",
      "Share the password separately from the document to avoid weakening the protection model.",
    ],
  },
  {
    slug: "unlock-pdf-online",
    h1: "Unlock PDF Online",
    title: "Unlock PDF Online Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Unlock a password-protected PDF in your browser when you have the correct password. Private local processing avoids the upload step entirely.",
    intro:
      "Unlock PDF Online is for users who need access to a protected PDF but do not want to send the file to a hosted unlock service. This page uses the local Plain Tools unlock workflow, so you can provide the correct password on-device and export the accessible copy in the same browser session.",
    toolKey: "unlock-pdf",
    canonicalToolHref: "/tools/unlock-pdf",
    canonicalToolLabel: "Unlock PDF",
    howItWorks: [
      "Upload the protected PDF and enter the correct password when prompted.",
      "Run the local unlock workflow to create an accessible output copy in the browser.",
      "Download the unlocked copy and store it carefully if the document remains sensitive.",
    ],
    relatedTools: [
      { label: "Protect PDF with Password", href: "/protect-pdf-with-password" },
      { label: "Fill PDF Form", href: "/fill-pdf-form-online" },
      { label: "Sign PDF", href: "/sign-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Password-protect PDF before emailing",
        href: "/learn/workflows/password-protect-pdf-before-emailing",
      },
      {
        label: "No uploads explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I unlock a PDF without uploading it?",
        answer:
          "Yes. The unlock step runs locally in your browser, so the PDF stays on your device during processing.",
      },
      {
        question: "Do I still need the correct password?",
        answer:
          "Yes. This workflow is for files you are authorised to open and where you already have the needed access details.",
      },
      {
        question: "Should I keep the unlocked output permanently?",
        answer:
          "Only if the workflow requires it. If the file is still sensitive, minimise how many unlocked copies you keep around.",
      },
    ],
    limitations: [
      "Use this only when you are authorised to access the document and have the correct password.",
      "Unlocked copies can be easier to mishandle, so store or delete them deliberately after use.",
      "Review whether the downstream workflow actually needs an unlocked file or only temporary access for one task.",
    ],
  },
  {
    slug: "fill-pdf-form-online",
    h1: "Fill PDF Form Online",
    title: "Fill PDF Form Online Privately (No Uploads) | Plain Tools",
    metaDescription:
      "Fill PDF forms online in your browser without uploading them. Private local processing lets you complete fields and export the result directly.",
    intro:
      "Fill PDF Form Online is for people who need to complete AcroForm fields without pushing the document through a hosted form service. This page uses the local Plain Tools form-filling workflow, so you can enter values, review the output, and export the finished PDF directly from the browser.",
    toolKey: "fill-pdf",
    canonicalToolHref: "/tools/fill-pdf",
    canonicalToolLabel: "Fill PDF Forms",
    howItWorks: [
      "Upload the form PDF and fill the available fields directly in the browser workspace.",
      "Choose whether to export a flattened share copy or keep the form fields editable where needed.",
      "Download the completed PDF locally and review key fields before sending it onward.",
    ],
    relatedTools: [
      { label: "Sign PDF", href: "/sign-pdf-online" },
      { label: "Protect PDF with Password", href: "/protect-pdf-with-password" },
      { label: "Annotate PDF", href: "/annotate-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Fill and sign PDF for HR onboarding",
        href: "/learn/workflows/fill-and-sign-pdf-for-hr-onboarding",
      },
      {
        label: "No uploads explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I fill a PDF form online without uploading it?",
        answer:
          "Yes. The form-filling step runs locally in your browser, so the PDF stays on your device during processing.",
      },
      {
        question: "Can I export a flattened copy?",
        answer:
          "Yes. You can export a flattened output when you want the filled values locked into the final share copy.",
      },
      {
        question: "Should I review the form after export?",
        answer:
          "Yes. Open the final PDF and check important fields, dates, names, and page breaks before sending it.",
      },
    ],
    limitations: [
      "Some complex or highly customised form layouts may need a quick output check before final submission.",
      "Flatten a copy for sharing when you do not want recipients to edit the fields afterward.",
      "If the next step is external submission, confirm the file size and field appearance in a separate viewer first.",
    ],
  },
  {
    slug: "reorder-pdf-pages",
    h1: "Reorder PDF Pages",
    title: "Reorder PDF Pages Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Reorder PDF pages directly in your browser with no uploads. Private local processing lets you drag pages into the right sequence and export fast.",
    intro:
      "Reorder PDF Pages is built for people who need to fix the sequence of a document before sharing, submission, or archiving. This page uses the local Plain Tools page organiser, so you can drag pages into the correct order, review the sequence visually, and download the adjusted PDF without sending it anywhere.",
    toolKey: "reorder-pdf",
    canonicalToolHref: "/tools/reorder-pdf",
    canonicalToolLabel: "Reorder PDF",
    howItWorks: [
      "Upload one PDF and let the browser render local page thumbnails for review.",
      "Drag pages into the correct order, then check transitions and numbering before export.",
      "Save the reordered PDF locally and keep the original source copy unchanged.",
    ],
    relatedTools: [
      { label: "Rotate PDF Pages", href: "/rotate-pdf-pages" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Merge PDF Files", href: "/merge-pdf-files" },
    ],
    learnLinks: [
      {
        label: "Compare contract versions as PDF",
        href: "/learn/workflows/compare-contract-versions-as-pdf",
      },
      {
        label: "How PDFs work",
        href: "/learn/how-pdfs-work",
      },
    ],
    faqs: [
      {
        question: "Can I reorder PDF pages without uploading the file?",
        answer:
          "Yes. The page organiser runs locally in your browser, so the PDF stays on your device during the workflow.",
      },
      {
        question: "Can I preview the page order before exporting?",
        answer:
          "Yes. The organiser shows local thumbnails so you can review the sequence before saving the final PDF.",
      },
      {
        question: "Should I overwrite the original file?",
        answer:
          "No. Keep the source version unchanged and export a new reordered copy for the workflow that actually needs it.",
      },
    ],
    limitations: [
      "Thumbnail-heavy PDFs can take longer to load because the browser must render page previews locally first.",
      "Check page order and section boundaries before export so the final PDF matches the intended reading flow.",
      "Keep the original untouched in case you need to rebuild the reordered copy differently later.",
    ],
  },
  {
    slug: "annotate-pdf-online",
    h1: "Annotate PDF Online",
    title: "Annotate PDF Online Privately (No Uploads) | Plain Tools",
    metaDescription:
      "Annotate PDF files online in your browser without uploading them. Add notes, highlights, and mark-up locally before downloading the result.",
    intro:
      "Annotate PDF Online serves the common need to mark up a document for review without pushing it through a hosted annotation service. This route uses the local Plain Tools annotation workspace, so you can highlight, draw, or add text notes and then export the review copy directly from the browser.",
    toolKey: "annotate-pdf",
    canonicalToolHref: "/tools/annotate-pdf",
    canonicalToolLabel: "Annotate PDF",
    howItWorks: [
      "Upload the PDF and open it in the local annotation workspace.",
      "Add highlights, notes, or pen marks where reviewers need context or decisions.",
      "Export the annotated copy locally and keep the clean source file separate from review output.",
    ],
    relatedTools: [
      { label: "Compare PDF Files", href: "/compare-pdf-files" },
      { label: "Add Watermark to PDF", href: "/add-watermark-to-pdf" },
      { label: "Sign PDF", href: "/sign-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Add watermark before client review",
        href: "/learn/workflows/add-watermark-before-client-review",
      },
      {
        label: "Compare contract versions as PDF",
        href: "/learn/workflows/compare-contract-versions-as-pdf",
      },
    ],
    faqs: [
      {
        question: "Can I annotate a PDF online without uploading it?",
        answer:
          "Yes. The annotation workspace runs locally in your browser, so the document stays on your device during the core workflow.",
      },
      {
        question: "Should I annotate the only copy I have?",
        answer:
          "No. Keep a clean source version and export a separate annotated copy for review or collaboration.",
      },
      {
        question: "Is annotation the same as redaction?",
        answer:
          "No. Annotation adds marks for review. It does not remove underlying content the way real redaction should.",
      },
    ],
    limitations: [
      "Annotations are for review and collaboration, not for irreversible data removal.",
      "Keep a separate clean source file so comments and highlights do not become your only master copy.",
      "Review the exported file in another viewer if the annotated copy will be sent outside your team.",
    ],
  },
  {
    slug: "compare-pdf-files",
    h1: "Compare PDF Files",
    title: "Compare PDF Files Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Compare PDF files directly in your browser with no uploads. Review text changes, visual differences, and export a local comparison report.",
    intro:
      "Compare PDF Files is for users who need to review differences between two documents without sending drafts or contracts through a hosted comparison service. This page uses the local Plain Tools comparison workflow, so you can inspect text changes, page-level differences, and download the report directly after review.",
    toolKey: "compare-pdf",
    canonicalToolHref: "/tools/compare-pdf",
    canonicalToolLabel: "Compare PDF Files",
    howItWorks: [
      "Upload both PDFs and let the browser analyse the differences locally.",
      "Review text-level and page-level changes to confirm what actually moved, changed, or disappeared.",
      "Export the comparison report locally and use it for the review workflow that follows.",
    ],
    relatedTools: [
      { label: "Annotate PDF", href: "/annotate-pdf-online" },
      { label: "Reorder PDF Pages", href: "/reorder-pdf-pages" },
      { label: "PDF to Word", href: "/convert-pdf-to-word" },
    ],
    learnLinks: [
      {
        label: "Compare contract versions as PDF",
        href: "/learn/workflows/compare-contract-versions-as-pdf",
      },
      {
        label: "Browser memory limits for PDF tools",
        href: "/learn/browser-memory-limits-for-pdf-tools",
      },
    ],
    faqs: [
      {
        question: "Can I compare two PDF files without uploading them?",
        answer:
          "Yes. The comparison step runs locally in your browser, so the PDFs stay on your device during processing.",
      },
      {
        question: "What should I check after the diff finishes?",
        answer:
          "Review changed pages, major text edits, and any sections where formatting shifts may affect interpretation.",
      },
      {
        question: "Is this useful for contracts and policy drafts?",
        answer:
          "Yes. It is especially useful when you need a quick local comparison before sending documents for legal, HR, or client review.",
      },
    ],
    limitations: [
      "Large or heavily formatted PDFs can take longer because the browser must inspect more content locally.",
      "Always confirm key changed sections manually when the document has legal, financial, or contractual importance.",
      "Keep the source versions alongside the diff report so the review trail stays clear.",
    ],
  },
  {
    slug: "ocr-pdf",
    h1: "OCR PDF",
    title: "OCR PDF (No Uploads) | Plain.tools",
    metaDescription:
      "Run OCR on PDF files directly in your browser with no uploads. Local processing helps turn scans into searchable text more privately.",
    intro:
      "OCR PDF is built for people who need searchable text from scans, photographed paperwork, or image-based PDFs without sending those files to a cloud OCR service first. This page embeds the existing Plain.tools OCR workflow, so the tool interface and processing path are the same ones already used on the main tool route. That matters for invoices, reports, records, onboarding packs, and archived scans that may contain private or regulated information. Instead of uploading the document and waiting for a remote service to return extracted text, the OCR pass runs in your browser and keeps the file on your device during the core workflow. You can review the output, test whether the PDF has become searchable, and decide whether it is good enough for downstream work such as conversion, indexing, or internal records handling. Accuracy still depends on the original scan quality, but this route gives users a direct, privacy-first answer to the common OCR PDF search query while reusing the live Plain.tools component rather than creating a separate SEO-only experience.",
    toolKey: "ocr-pdf",
    canonicalToolHref: "/tools/ocr-pdf",
    canonicalToolLabel: "OCR PDF",
    howItWorks: [
      "Upload the scanned PDF and start the browser-based OCR pass on the pages you need.",
      "Let the tool extract text locally and review the output where accuracy matters most.",
      "Download the OCR result and verify searchability or copied text before wider sharing.",
    ],
    relatedTools: [
      { label: "Make PDF Searchable", href: "/make-pdf-searchable" },
      { label: "PDF to Word", href: "/convert-pdf-to-word" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Local vs cloud OCR privacy",
        href: "/learn/local-vs-cloud-ocr-privacy",
      },
      {
        label: "How OCR works on scanned PDFs",
        href: "/learn/how-ocr-works-on-scanned-pdfs",
      },
      {
        label: "How to verify a PDF tool does not upload your files",
        href: "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      },
    ],
    faqs: [
      {
        question: "How can I OCR a PDF without uploading it?",
        answer:
          "Yes. This page runs OCR in your browser, so the document stays on your device during the core workflow.",
      },
      {
        question: "Will OCR always be perfectly accurate?",
        answer:
          "No. Accuracy depends on scan quality, page contrast, skew, and the source language, so review important sections after export.",
      },
      {
        question: "When should I prefer local OCR?",
        answer:
          "Local OCR is a strong default when the PDF contains personal, legal, or medical information that should not be sent to a third-party OCR service.",
      },
      {
        question: "Is the OCR tool free to try?",
        answer:
          "Yes. You can run the OCR workflow on this page without an account, then review the output before deciding whether it fits your document workflow.",
      },
    ],
    limitations: [
      "OCR quality depends heavily on the scan itself, so blurred or low-contrast pages may still need manual review.",
      "Check searchability and copied text on the most important pages before using the output in a downstream workflow.",
      "Large scanned PDFs may need to be split or processed in batches if the browser runs short on memory.",
    ],
  },
  {
    slug: "make-pdf-searchable",
    h1: "Make PDF Searchable",
    title: "Make PDF Searchable Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Make scanned PDFs searchable directly in your browser. Private local OCR processing avoids cloud uploads and keeps document bytes on-device.",
    intro:
      "Make PDF Searchable is a query-focused landing page for people who want a scanned document to behave like real text without sending it to a hosted OCR service. This route uses the local Plain Tools offline OCR pipeline, which is better suited to privacy-sensitive records and repeatable internal workflows.",
    toolKey: "offline-ocr",
    canonicalToolHref: "/tools/offline-ocr",
    canonicalToolLabel: "Offline OCR",
    howItWorks: [
      "Upload the scanned PDF and run the local OCR pipeline in your browser.",
      "Let the tool rebuild the file with searchable text while the source pages stay on your device.",
      "Download the searchable PDF and check a few pages with search or copy-and-paste before using it elsewhere.",
    ],
    relatedTools: [
      { label: "OCR PDF", href: "/ocr-pdf" },
      { label: "Split PDF Pages", href: "/split-pdf-pages" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    learnLinks: [
      {
        label: "Make scanned PDF searchable for records",
        href: "/learn/workflows/make-scanned-pdf-searchable-for-records",
      },
      {
        label: "OCR PDF without cloud",
        href: "/learn/ocr-pdf-without-cloud",
      },
    ],
    faqs: [
      {
        question: "Can I make a PDF searchable without uploading it?",
        answer:
          "Yes. The OCR step runs locally in your browser, so the scanned file stays on your device during processing.",
      },
      {
        question: "What is the difference between OCR PDF and make PDF searchable?",
        answer:
          "They are closely related. This page focuses on the searchable-output intent, while the canonical tool route centres on the OCR workflow itself.",
      },
      {
        question: "Should I verify the searchable output afterward?",
        answer:
          "Yes. Test search, select text, and copy a few important passages before relying on the result.",
      },
    ],
    limitations: [
      "Poor scan quality can still produce imperfect text recognition, so review key pages after export.",
      "Large scanned records may need splitting or batching if your browser runs into memory pressure.",
      "Keep the original scan as the source record in case the searchable copy needs to be regenerated later.",
    ],
  },
  {
    slug: "pdf-to-excel",
    h1: "PDF to Excel",
    title: "PDF to Excel Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert PDF data to Excel-ready output directly in your browser. Private local processing keeps the source document on your device throughout.",
    intro:
      "PDF to Excel is aimed at people who need spreadsheet-ready output from a PDF without passing the file through a hosted converter. This page uses the local Plain Tools extraction workflow for table-like content, which is useful when the goal is analysis, cleanup, or finance-side review rather than perfect visual fidelity.",
    toolKey: "pdf-to-excel",
    canonicalToolHref: "/tools/pdf-to-excel",
    canonicalToolLabel: "PDF to Excel",
    howItWorks: [
      "Upload the PDF and run the local extraction workflow for table-like or structured data.",
      "Review the spreadsheet-ready output for column alignment, headers, and row grouping before use.",
      "Download the result locally and clean it up in Excel if the source layout was complex.",
    ],
    relatedTools: [
      { label: "PDF to Word", href: "/convert-pdf-to-word" },
      { label: "PDF to Markdown", href: "/pdf-to-markdown" },
      { label: "Compare PDF Files", href: "/compare-pdf-files" },
    ],
    learnLinks: [
      {
        label: "Browser memory limits for PDF tools",
        href: "/learn/browser-memory-limits-for-pdf-tools",
      },
      {
        label: "Why PDF uploads are risky",
        href: "/learn/why-pdf-uploads-are-risky",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF to Excel without uploading the file?",
        answer:
          "Yes. The extraction workflow runs locally in your browser, so the PDF stays on your device during the core operation.",
      },
      {
        question: "Will the spreadsheet always look perfect?",
        answer:
          "Not always. Complex layouts may still need cleanup, especially when the source PDF was not built around clean table structure.",
      },
      {
        question: "What kind of PDFs work best?",
        answer:
          "Structured, text-based PDFs with clear rows and columns usually convert better than scanned images or highly styled layouts.",
      },
    ],
    limitations: [
      "Table extraction is best-effort, so expect some cleanup when the source PDF uses complex layout tricks.",
      "Check headers, dates, number formatting, and merged cells before using the output for reporting or analysis.",
      "If the source file is a scan, OCR may be required before spreadsheet extraction becomes useful.",
    ],
  },
  {
    slug: "pdf-to-powerpoint",
    h1: "PDF to PowerPoint",
    title: "PDF to PowerPoint Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert PDF pages to PowerPoint slides directly in your browser. Private local processing keeps slide source files on your device throughout.",
    intro:
      "PDF to PowerPoint is for people who need a presentation-friendly export without sending slide decks or reports to a hosted converter. This route uses the local Plain Tools page-to-slide workflow, which is useful for internal review decks, simple presentations, and repurposing page visuals quickly.",
    toolKey: "pdf-to-ppt",
    canonicalToolHref: "/tools/pdf-to-ppt",
    canonicalToolLabel: "PDF to PowerPoint",
    howItWorks: [
      "Upload the PDF and let the browser convert each page into a slide-based output locally.",
      "Review the generated presentation to confirm slide order, visual readability, and page scaling.",
      "Download the PowerPoint file and make any final edits in your presentation software if needed.",
    ],
    relatedTools: [
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "PDF to HTML", href: "/pdf-to-html" },
      { label: "Reorder PDF Pages", href: "/reorder-pdf-pages" },
    ],
    learnLinks: [
      {
        label: "How PDFs work",
        href: "/learn/how-pdfs-work",
      },
      {
        label: "Why PDF uploads are risky",
        href: "/learn/why-pdf-uploads-are-risky",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF to PowerPoint without uploading it?",
        answer:
          "Yes. The conversion runs locally in your browser, so the PDF stays on your device during the core workflow.",
      },
      {
        question: "Will the PowerPoint be fully editable?",
        answer:
          "This workflow is best for slide-style reuse and visual portability. Some files will still need edits after export.",
      },
      {
        question: "What should I review first?",
        answer:
          "Check slide order, readability, and any pages that contain dense charts, speaker notes, or margins that do not translate cleanly.",
      },
    ],
    limitations: [
      "Complex page layouts may still need manual cleanup in PowerPoint after export.",
      "Review dense graphics and charts closely because presentation readability can shift after conversion.",
      "If only some pages belong in the deck, reorder or extract them before conversion for a cleaner result.",
    ],
  },
  {
    slug: "html-to-pdf",
    h1: "HTML to PDF",
    title: "HTML to PDF Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert HTML to PDF directly in your browser with no uploads. Private local processing keeps pasted content and rendered output on your device.",
    intro:
      "HTML to PDF is a useful route for users who need a quick local print-style export from HTML without posting content to a hosted converter. This page reuses the Plain Tools HTML-to-PDF workflow, making it a practical fit for internal snippets, generated markup, and simple web content exports.",
    toolKey: "html-to-pdf",
    canonicalToolHref: "/tools/html-to-pdf",
    canonicalToolLabel: "HTML to PDF",
    howItWorks: [
      "Paste or load the HTML you want to convert into the local browser workspace.",
      "Review the rendered preview and adjust any simple settings before final export.",
      "Download the generated PDF locally and confirm the visual result in a separate viewer if needed.",
    ],
    relatedTools: [
      { label: "PDF to HTML", href: "/pdf-to-html" },
      { label: "Text to PDF", href: "/text-to-pdf" },
      { label: "PDF to Markdown", href: "/pdf-to-markdown" },
    ],
    learnLinks: [
      {
        label: "No uploads explained",
        href: "/learn/no-uploads-explained",
      },
      {
        label: "Browser memory limits for PDF tools",
        href: "/learn/browser-memory-limits-for-pdf-tools",
      },
    ],
    faqs: [
      {
        question: "Can I convert HTML to PDF without uploading content?",
        answer:
          "Yes. The conversion runs locally in your browser, so the HTML content stays on your device during the core workflow.",
      },
      {
        question: "Will all CSS render perfectly?",
        answer:
          "Not always. Simple layouts usually translate better than highly interactive or heavily styled pages.",
      },
      {
        question: "What should I check before sharing the PDF?",
        answer:
          "Check page breaks, fonts, and whether key sections render in the correct order on the final PDF pages.",
      },
    ],
    limitations: [
      "Complex web layouts and advanced CSS can still render differently from a full browser print pipeline.",
      "Check page breaks and overflow behaviour on the exported PDF before you treat it as final.",
      "If the HTML came from sensitive internal content, keep the source locally and minimise extra copies.",
    ],
  },
  {
    slug: "pdf-to-html",
    h1: "PDF to HTML",
    title: "PDF to HTML Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert PDF files to HTML directly in your browser with no uploads. Private local processing keeps document content on your device throughout.",
    intro:
      "PDF to HTML is for users who need a browser-friendly version of PDF content without relying on a hosted converter. This route uses the local Plain Tools conversion workflow, making it useful for republishing, inspection, or extracting readable content from text-based PDFs.",
    toolKey: "pdf-to-html",
    canonicalToolHref: "/tools/pdf-to-html",
    canonicalToolLabel: "PDF to HTML",
    howItWorks: [
      "Upload the PDF and let the browser extract text and structure into an HTML-oriented output locally.",
      "Review the generated HTML for reading order, formatting, and any pages that need cleanup.",
      "Download the HTML locally and refine it further if the source PDF used complex layout.",
    ],
    relatedTools: [
      { label: "HTML to PDF", href: "/html-to-pdf" },
      { label: "PDF to Markdown", href: "/pdf-to-markdown" },
      { label: "PDF to Word", href: "/convert-pdf-to-word" },
    ],
    learnLinks: [
      {
        label: "How PDFs work",
        href: "/learn/how-pdfs-work",
      },
      {
        label: "No uploads explained",
        href: "/learn/no-uploads-explained",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF to HTML without uploading it?",
        answer:
          "Yes. The conversion runs locally in your browser, so the source PDF stays on your device during the workflow.",
      },
      {
        question: "Which PDFs work best?",
        answer:
          "Text-based PDFs with simpler layout usually convert better than scans or highly designed print layouts.",
      },
      {
        question: "Should I expect cleanup afterward?",
        answer:
          "Yes, especially when the original PDF used columns, floating elements, or tightly controlled print positioning.",
      },
    ],
    limitations: [
      "PDF-to-HTML conversion is best-effort and often needs cleanup when the source file was designed for print, not reflow.",
      "Review reading order, headings, and line breaks before publishing or reusing the HTML output.",
      "If the source is image-based, OCR may be necessary before HTML output becomes meaningfully searchable.",
    ],
  },
  {
    slug: "pdf-to-markdown",
    h1: "PDF to Markdown",
    title: "PDF to Markdown Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert PDF text to Markdown directly in your browser with no uploads. Private local processing keeps source files on your device during extraction.",
    intro:
      "PDF to Markdown is built for users who want editable, lightweight text output without sending the PDF to a hosted converter. This page uses the local Plain Tools Markdown conversion workflow, which is especially helpful for notes, drafts, internal docs, and content repurposing.",
    toolKey: "pdf-to-markdown",
    canonicalToolHref: "/tools/pdf-to-markdown",
    canonicalToolLabel: "PDF to Markdown",
    howItWorks: [
      "Upload the PDF and let the browser extract text into a Markdown-oriented structure locally.",
      "Review the output for headings, lists, and reading order before treating it as final.",
      "Download the Markdown and clean up any sections where the original PDF used complex layout.",
    ],
    relatedTools: [
      { label: "PDF to HTML", href: "/pdf-to-html" },
      { label: "Text to PDF", href: "/text-to-pdf" },
      { label: "PDF to Word", href: "/convert-pdf-to-word" },
    ],
    learnLinks: [
      {
        label: "How PDFs work",
        href: "/learn/how-pdfs-work",
      },
      {
        label: "Browser memory limits for PDF tools",
        href: "/learn/browser-memory-limits-for-pdf-tools",
      },
    ],
    faqs: [
      {
        question: "Can I convert PDF to Markdown without uploading it?",
        answer:
          "Yes. The conversion runs locally in your browser, so the PDF stays on your device during the main workflow.",
      },
      {
        question: "Will the Markdown keep the original layout?",
        answer:
          "Not exactly. Markdown is designed for structured text, so complex print layout usually becomes a simpler text representation.",
      },
      {
        question: "What should I check after export?",
        answer:
          "Check heading levels, list formatting, code-style blocks, and any tables or columns that may need manual cleanup.",
      },
    ],
    limitations: [
      "Markdown output is intentionally simpler than PDF layout, so expect cleanup when the source relied on design-heavy formatting.",
      "Tables, columns, and callout boxes may need manual restructuring after conversion.",
      "If the PDF is scanned rather than text-based, OCR is usually the first step before Markdown extraction becomes useful.",
    ],
  },
  {
    slug: "text-to-pdf",
    h1: "Text to PDF",
    title: "Text to PDF Locally (No Uploads) | Plain Tools",
    metaDescription:
      "Convert plain text or Markdown to PDF directly in your browser. Private local processing keeps your content on-device with no upload step.",
    intro:
      "Text to PDF is for users who need a quick printable or shareable PDF from plain text or Markdown without relying on a hosted document service. This route uses the local Plain Tools text-to-PDF workflow, so drafts, notes, and simple content can be turned into a PDF directly in the browser.",
    toolKey: "text-to-pdf",
    canonicalToolHref: "/tools/text-to-pdf",
    canonicalToolLabel: "Text to PDF",
    howItWorks: [
      "Paste plain text or Markdown into the local editor and choose the output settings you need.",
      "Preview the layout locally and adjust spacing or page settings before export.",
      "Download the generated PDF directly and check the final page flow in a separate viewer if needed.",
    ],
    relatedTools: [
      { label: "PDF to Markdown", href: "/pdf-to-markdown" },
      { label: "HTML to PDF", href: "/html-to-pdf" },
      { label: "Protect PDF with Password", href: "/protect-pdf-with-password" },
    ],
    learnLinks: [
      {
        label: "No uploads explained",
        href: "/learn/no-uploads-explained",
      },
      {
        label: "How PDFs work",
        href: "/learn/how-pdfs-work",
      },
    ],
    faqs: [
      {
        question: "Can I convert text to PDF without uploading it?",
        answer:
          "Yes. The conversion runs locally in your browser, so the text stays on your device during the core workflow.",
      },
      {
        question: "Does Markdown formatting work too?",
        answer:
          "Yes. The tool supports simple Markdown-style structure as well as plain text input.",
      },
      {
        question: "What should I check before sharing the PDF?",
        answer:
          "Check headings, spacing, and page breaks so the output reads cleanly in the final PDF.",
      },
    ],
    limitations: [
      "This workflow is best for text-first documents rather than complex desktop-publishing layouts.",
      "Check page breaks and whitespace if the document will be printed or shared externally.",
      "If the final PDF is sensitive, apply password protection or other controls after you confirm the layout looks correct.",
    ],
  },
]

function cloneIntentPage(baseSlug: string, overrides: Partial<PdfIntentPage> & Pick<PdfIntentPage, "slug" | "h1" | "title" | "metaDescription" | "intro">): PdfIntentPage {
  const base = PDF_INTENT_PAGES.find((page) => page.slug === baseSlug)
  if (!base) {
    throw new Error(`Unknown base PDF intent page: ${baseSlug}`)
  }

  return {
    ...base,
    ...overrides,
    relatedTools: overrides.relatedTools ?? base.relatedTools,
    learnLinks: overrides.learnLinks ?? base.learnLinks,
    faqs: overrides.faqs ?? base.faqs,
    howItWorks: overrides.howItWorks ?? base.howItWorks,
    limitations: overrides.limitations ?? base.limitations,
  }
}

PDF_INTENT_PAGES.push(
  cloneIntentPage("merge-pdf-files", {
    slug: "merge-pdf-online",
    h1: "Merge PDF Online",
    title: "Merge PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Merge PDF files online directly in your browser. Plain.tools combines documents locally so your files never leave your device.",
    intro:
      "Merge PDF Online is built for the exact query people use when they need one combined PDF quickly and do not want to upload contracts, statements, application packs, or internal documents to a cloud service. This page loads the same Plain.tools merge workflow that sits on the main tool route, so there is no reduced feature set and no extra step before you can start. Add the files you want, check the order, and produce one output PDF directly in the browser. Because the merge runs locally, the file bytes stay on your device during the core task. That privacy model matters when the job is routine but the document contents are still sensitive. It also keeps the workflow faster for many everyday cases because there is no upload queue, no waiting for a remote processor, and no sign-up wall between you and the download.",
    relatedTools: [
      { label: "Split PDF Online", href: "/split-pdf-online" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I merge PDF files online without uploading them?",
        answer:
          "Yes. On Plain.tools the merge workflow runs in your browser, so the core file combination happens locally on your device.",
      },
      {
        question: "Can I change the file order before merging?",
        answer:
          "Yes. Add your PDFs, review the order, then rearrange them before creating the final merged document.",
      },
      {
        question: "Is Merge PDF Online free to use?",
        answer:
          "Yes. The main local merge workflow is available without creating an account for basic everyday use.",
      },
    ],
  }),
  cloneIntentPage("split-pdf-pages", {
    slug: "split-pdf-online",
    h1: "Split PDF Online",
    title: "Split PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Split PDF files online directly in your browser. Plain.tools processes pages locally so your document stays on your device.",
    intro:
      "Split PDF Online targets the common search intent behind people who need a few pages from a larger file, want one page per document, or need to break a bundle into smaller pieces for sharing. This route reuses the existing Plain.tools split interface, which means you get the live tool immediately rather than a marketing page that sends you somewhere else to finish the task. Upload the PDF, choose the pages or ranges you need, and download the output directly from the same browser session. Because the workflow runs locally, the source PDF is not sent to a remote splitting service as part of the core job. That makes the page a better fit for invoices, scanned records, HR forms, and other files that still deserve careful handling even when the task itself is simple.",
    relatedTools: [
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I split a PDF online without uploading it?",
        answer:
          "Yes. The split workflow on Plain.tools runs in your browser, so the source document stays on your device during processing.",
      },
      {
        question: "Can I export just a few selected pages?",
        answer:
          "Yes. You can choose specific pages or ranges instead of splitting every page into a separate file.",
      },
      {
        question: "Will I get a ZIP file when there are many outputs?",
        answer:
          "Yes. When the split generates multiple files, Plain.tools can package them into a ZIP for easier download.",
      },
    ],
  }),
  cloneIntentPage("convert-pdf-to-word", {
    slug: "pdf-to-word-online",
    h1: "PDF to Word Online",
    title: "PDF to Word Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PDF to Word online directly in your browser. Plain.tools processes documents locally so the source PDF stays on your device.",
    intro:
      "PDF to Word Online is built for people who want an editable version of a PDF without handing the source file to an upload-first converter. This route embeds the existing Plain.tools PDF to Word workflow immediately, so you can start the job as soon as the page loads. It is most useful for text-based PDFs where the goal is editing or reusing content rather than perfectly preserving a complex print layout. Upload the file, run the local conversion, and download the generated Word document from the same browser session. Because the work happens in-browser, the PDF stays on your device for the core workflow. That makes this page a practical option for internal reports, drafts, notes, and working documents where privacy still matters even though the task is routine.",
    relatedTools: [
      { label: "Word to PDF Online", href: "/word-to-pdf-online" },
      { label: "PDF to JPG Online", href: "/pdf-to-jpg-online" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PDF to Word online without uploading the file?",
        answer:
          "Yes. The core conversion runs locally in your browser, so the PDF does not need to be sent to a server to create the output.",
      },
      {
        question: "Will the Word file keep the original layout perfectly?",
        answer:
          "Not always. Text-heavy PDFs usually convert better than scans or heavily designed page layouts.",
      },
      {
        question: "Is PDF to Word Online free?",
        answer:
          "Yes. The local browser workflow is available without account creation for standard use.",
      },
    ],
  }),
  cloneIntentPage("convert-word-to-pdf", {
    slug: "word-to-pdf-online",
    h1: "Word to PDF Online",
    title: "Word to PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert Word to PDF online directly in your browser. Plain.tools handles DOCX locally so your document never leaves your device.",
    intro:
      "Word to PDF Online is aimed at people who need a fast DOCX-to-PDF workflow for applications, records, printing, or sharing and do not want to rely on a cloud office suite. This page uses the same local Plain.tools converter as the main tool page, so the workflow is immediate and familiar: upload the document, run the conversion, and download the PDF. The core operation stays in your browser, which means the Word file is not uploaded to a remote server just to create a PDF. That approach is especially useful for resumes, statements, draft contracts, and internal documents where the job is simple but the contents still call for restraint. If you need to compress, merge, or secure the resulting file afterward, this page also links directly into the surrounding PDF workflow cluster.",
    relatedTools: [
      { label: "PDF to Word Online", href: "/pdf-to-word-online" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert Word to PDF online without uploading the document?",
        answer:
          "Yes. Plain.tools runs the core DOCX-to-PDF workflow locally in your browser, so the source file stays on your device.",
      },
      {
        question: "What Word file type works best?",
        answer:
          "DOCX is the intended input. Review the PDF output if the source file uses complex styling or layout.",
      },
      {
        question: "Do I need an account to use Word to PDF Online?",
        answer:
          "No. The standard local conversion workflow is available without sign-up.",
      },
    ],
  }),
  cloneIntentPage("pdf-to-jpg", {
    slug: "pdf-to-jpg-online",
    h1: "PDF to JPG Online",
    title: "PDF to JPG Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PDF pages to JPG online directly in your browser. Plain.tools renders pages locally so the source file stays on your device.",
    intro:
      "PDF to JPG Online is built for people who need image exports from a PDF for previews, slide decks, document sharing, or simple image-based handoff. This page opens the existing Plain.tools image-export workflow directly, so there is no extra navigation before you can start converting pages. Upload the PDF, choose the pages you need, and export JPG output from the same browser session. Because the rendering and export happen locally, the source PDF does not need to be uploaded to a remote converter during the core workflow. That makes the page a more practical fit for internal reports, forms, and working files where privacy still matters, even if the goal is only to produce images for quick reuse.",
    relatedTools: [
      { label: "PDF to PNG Online", href: "/pdf-to-png-online" },
      { label: "JPG to PDF Online", href: "/jpg-to-pdf-online" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PDF to JPG online without uploading it?",
        answer:
          "Yes. The export workflow runs in your browser, so the PDF stays on your device during the core conversion.",
      },
      {
        question: "Can I export more than one page?",
        answer:
          "Yes. You can export multiple pages from the same PDF depending on what you need from the document.",
      },
      {
        question: "Is PDF to JPG Online free?",
        answer:
          "Yes. The local browser workflow is available without a sign-up step for normal use.",
      },
    ],
  }),
  cloneIntentPage("jpg-to-pdf", {
    slug: "jpg-to-pdf-online",
    h1: "JPG to PDF Online",
    title: "JPG to PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert JPG to PDF online directly in your browser. Plain.tools builds the document locally so your images stay on your device.",
    intro:
      "JPG to PDF Online is designed for people who need to turn photos or scanned images into one shareable PDF without sending the files to an upload-based converter. This page uses the same Plain.tools image-to-PDF workflow as the canonical tool route, so you can start immediately with the live component already in place. Add one or more JPG files, adjust the order, and download the PDF from the same browser session. Because the file assembly happens locally, the images stay on your device during the core workflow. That makes the page useful for application materials, receipts, records, and quick document bundles where privacy still matters but the task needs to stay fast and practical.",
    relatedTools: [
      { label: "PNG to PDF Online", href: "/png-to-pdf-online" },
      { label: "PDF to JPG Online", href: "/pdf-to-jpg-online" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert JPG to PDF online without uploading the images?",
        answer:
          "Yes. The image-to-PDF workflow runs in your browser, so the source images stay on your device during processing.",
      },
      {
        question: "Can I combine multiple JPG files into one PDF?",
        answer:
          "Yes. Add multiple images, check their order, and export one combined PDF.",
      },
      {
        question: "Do I need an account to use JPG to PDF Online?",
        answer:
          "No. The standard local workflow is available without creating an account.",
      },
    ],
  }),
  cloneIntentPage("pdf-to-jpg", {
    slug: "pdf-to-png-online",
    h1: "PDF to PNG Online",
    title: "PDF to PNG Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PDF pages to PNG online directly in your browser. Plain.tools renders pages locally so the source PDF stays on your device.",
    intro:
      "PDF to PNG Online is for people who want page images from a PDF but still prefer a privacy-first, browser-based workflow. This landing page uses the existing Plain.tools image-export component, which already handles the page rendering locally on your device. That means you can open the file, export the pages you need, and download the output without sending the original PDF to a remote conversion server. The route is useful for previews, design handoff, documentation, and any job where you need image output from a PDF but do not want cloud-processing friction. If your actual downstream need is JPG instead of PNG, you can use the closely related export route from the same workflow cluster.",
    toolSummary:
      "This route targets PNG-focused search intent while using the existing local PDF page-export workflow. Rendering happens in your browser, so the source PDF stays on your device during the core task.",
    relatedTools: [
      { label: "PDF to JPG Online", href: "/pdf-to-jpg-online" },
      { label: "PNG to PDF Online", href: "/png-to-pdf-online" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PDF to PNG online without uploading it?",
        answer:
          "Yes. Plain.tools handles the core page-rendering workflow locally in your browser, so the PDF stays on your device.",
      },
      {
        question: "Why does this page reuse the existing image-export tool?",
        answer:
          "The underlying export workflow is already local and privacy-first, so this landing page uses that same component for PNG-oriented search intent.",
      },
      {
        question: "Should I review the image output afterward?",
        answer:
          "Yes. Check the pages you export to confirm the output quality and choose the image format that best fits the next step in your workflow.",
      },
    ],
  }),
  cloneIntentPage("jpg-to-pdf", {
    slug: "png-to-pdf-online",
    h1: "PNG to PDF Online",
    title: "PNG to PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PNG to PDF online directly in your browser. Plain.tools assembles the PDF locally so your images stay on your device.",
    intro:
      "PNG to PDF Online is built for people who need a quick way to combine PNG images into a PDF while keeping the workflow private and straightforward. This page uses the existing Plain.tools image-to-PDF component, which already handles file assembly locally in the browser. You can add the images you need, check the order, and export one PDF without sending those files to a remote server as part of the core workflow. That makes the route useful for design assets, screenshots, scanned pages, forms, and visual records where cloud-upload friction adds risk without adding much value. If you need JPG support instead, the closely related image-to-PDF route is available from the same tool cluster.",
    toolSummary:
      "This route targets PNG-to-PDF search intent while using the existing local image-to-PDF workflow. The core file assembly happens in your browser, so the source images stay on your device.",
    relatedTools: [
      { label: "JPG to PDF Online", href: "/jpg-to-pdf-online" },
      { label: "PDF to PNG Online", href: "/pdf-to-png-online" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PNG to PDF online without uploading the images?",
        answer:
          "Yes. The image-to-PDF workflow runs locally in your browser, so the PNG files stay on your device during the core task.",
      },
      {
        question: "Can I combine multiple PNG files into one PDF?",
        answer:
          "Yes. Add several images, review the order, and export one PDF from the same browser session.",
      },
      {
        question: "Why does this page reuse the existing image-to-PDF tool?",
        answer:
          "The existing workflow already supports privacy-first local conversion, so this route uses that same component for PNG-focused search intent.",
      },
    ],
  }),
  cloneIntentPage("rotate-pdf-pages", {
    slug: "rotate-pdf-online",
    h1: "Rotate PDF Online",
    title: "Rotate PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Rotate PDF pages online directly in your browser. Plain.tools fixes page orientation locally so your file stays on your device.",
    intro:
      "Rotate PDF Online is designed for the common case where a scan, statement, or form opens sideways and you need a corrected file immediately. This page loads the existing Plain.tools rotation interface directly, so you can review page thumbnails, rotate the pages you need, and download the updated PDF without taking a detour through another tool directory. The core workflow runs in your browser, which means the PDF does not need to be uploaded to a remote rotation service just to fix orientation. That makes the route a practical fit for admin paperwork, scanned records, camera captures, and mixed-orientation PDFs where the task is simple but the file should still stay under your control.",
    relatedTools: [
      { label: "Split PDF Online", href: "/split-pdf-online" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I rotate a PDF online without uploading it?",
        answer:
          "Yes. The rotation workflow runs locally in your browser, so the document stays on your device during the core task.",
      },
      {
        question: "Can I rotate only some pages?",
        answer:
          "Yes. You can apply rotation to selected pages rather than forcing the same orientation on the whole file.",
      },
      {
        question: "Is Rotate PDF Online free?",
        answer:
          "Yes. The main local rotation workflow is available without a required account for standard use.",
      },
    ],
  }),
  cloneIntentPage("extract-pdf-pages", {
    slug: "extract-pages-from-pdf",
    h1: "Extract Pages from PDF",
    title: "Extract Pages from PDF (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Extract pages from PDF directly in your browser. Plain.tools processes the document locally so the source file stays on your device.",
    intro:
      "Extract Pages from PDF is built for the exact task people describe when they want only a few pages from a longer document and do not want to upload the whole file to a cloud service. This page uses the existing Plain.tools extraction workflow, so the tool loads immediately and lets you specify exact page numbers or ranges without any extra navigation. That makes it practical for contracts, reports, forms, and scans where you only need selected pages for sharing, review, or archiving. Because the extraction runs locally in your browser, the PDF stays on your device during the core workflow. That privacy-first approach matters even for simple document trimming jobs, especially when the original file contains unrelated or sensitive pages you do not want to send anywhere else first.",
    relatedTools: [
      { label: "Split PDF Online", href: "/split-pdf-online" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I extract pages from a PDF without uploading it?",
        answer:
          "Yes. The extraction workflow runs locally in your browser, so the source PDF stays on your device during processing.",
      },
      {
        question: "Can I extract a custom range of pages?",
        answer:
          "Yes. You can enter individual page numbers, page ranges, or a mixed selection depending on the output you need.",
      },
      {
        question: "Can I save each extracted page as a separate PDF?",
        answer:
          "Yes. The extractor supports separate outputs as well as combined extraction into one new PDF.",
      },
    ],
  }),
  cloneIntentPage("ocr-pdf", {
    slug: "ocr-pdf-online",
    h1: "OCR PDF Online",
    title: "OCR PDF Online (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "OCR PDF online directly in your browser. Plain.tools processes scans locally so your document stays on your device during OCR.",
    intro:
      "OCR PDF Online targets the high-intent query people use when they need to turn a scanned PDF into searchable text without trusting a remote OCR service. This page loads the existing Plain.tools OCR workflow directly, so you can start with the live tool immediately instead of stepping through another directory page first. It is useful for records, receipts, reports, onboarding packs, and scanned paperwork that need to become searchable or easier to reuse. Because the OCR pass runs in your browser, the source PDF stays on your device during the core workflow. That is a better fit for private or regulated documents where a cloud OCR upload would add risk without improving the task itself. Accuracy still depends on scan quality, but this route gives a direct, privacy-first answer to the common OCR PDF online search.",
    relatedTools: [
      { label: "Make PDF Searchable", href: "/make-pdf-searchable" },
      { label: "PDF to Word Online", href: "/pdf-to-word-online" },
      { label: "Compress PDF Online", href: "/compress-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I OCR a PDF online without uploading it?",
        answer:
          "Yes. The OCR workflow on Plain.tools runs locally in your browser, so the scanned file stays on your device during processing.",
      },
      {
        question: "Will OCR work on every scan?",
        answer:
          "Not perfectly. OCR quality depends on scan clarity, contrast, skew, and language, so review important sections after export.",
      },
      {
        question: "Is OCR PDF Online free to try?",
        answer:
          "Yes. You can run the local OCR workflow without an account for normal use and review the output afterward.",
      },
    ],
  }),
  cloneIntentPage("pdf-to-jpg", {
    slug: "pdf-to-png",
    h1: "PDF to PNG",
    title: "PDF to PNG (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PDF to PNG directly in your browser. Plain.tools renders PDF pages locally so the source file stays on your device.",
    intro:
      "PDF to PNG is aimed at people who need page images from a PDF but prefer a privacy-first workflow that does not start with a cloud upload. This page reuses the existing Plain.tools image-export component, so the live tool is available immediately and the rendering still happens locally in your browser. That makes it useful for previews, design handoff, documentation, screenshots, and any workflow where PNG output is easier to reuse than the original PDF. Because the source document stays on your device during the core task, the page is a better fit for internal documents and working files that should not be uploaded just to create a few page images. If you need JPG output instead, the adjacent export route is linked below from the same tool cluster.",
    toolSummary:
      "This page targets PDF-to-PNG search intent while reusing the existing local PDF page-export workflow. Rendering happens in your browser, so the source file stays on your device.",
    relatedTools: [
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "PNG to PDF", href: "/png-to-pdf" },
      { label: "Rotate PDF Online", href: "/rotate-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PDF to PNG without uploading the file?",
        answer:
          "Yes. The underlying export workflow runs locally in your browser, so the PDF stays on your device during conversion.",
      },
      {
        question: "Why does this page use the existing image export tool?",
        answer:
          "The current export component already handles local page rendering well, so this route reuses that workflow for PNG-focused search intent.",
      },
      {
        question: "Should I review the image output before sharing it?",
        answer:
          "Yes. Check the exported pages for quality and choose the image format that best fits the next step in your workflow.",
      },
    ],
  }),
  cloneIntentPage("jpg-to-pdf", {
    slug: "png-to-pdf",
    h1: "PNG to PDF",
    title: "PNG to PDF (Free, Private, No Upload) | Plain.tools",
    metaDescription:
      "Convert PNG to PDF directly in your browser. Plain.tools builds the document locally so your images stay on your device.",
    intro:
      "PNG to PDF is built for people who want to turn screenshots, design assets, scanned images, or other PNG files into one shareable PDF without passing them through a hosted converter. This page uses the existing Plain.tools image-to-PDF workflow, so the tool is ready immediately and the core file assembly still happens in your browser. That makes it useful for records, forms, visual reports, and quick document bundles where privacy matters even though the task itself is straightforward. Because the conversion runs locally, the input images stay on your device during the workflow. If you also need JPG support, the related image-to-PDF route is linked below from the same PDF conversion cluster.",
    toolSummary:
      "This page targets PNG-to-PDF search intent while reusing the existing local image-to-PDF workflow. The core conversion happens in your browser, so the source images stay on your device.",
    relatedTools: [
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "PDF to PNG", href: "/pdf-to-png" },
      { label: "Merge PDF Online", href: "/merge-pdf-online" },
    ],
    faqs: [
      {
        question: "Can I convert PNG to PDF without uploading the images?",
        answer:
          "Yes. The image-to-PDF workflow runs locally in your browser, so the PNG files stay on your device during processing.",
      },
      {
        question: "Can I combine multiple PNG files into one PDF?",
        answer:
          "Yes. Add multiple images, set the order, and export one PDF directly from the same browser session.",
      },
      {
        question: "Why does this route reuse the existing image-to-PDF tool?",
        answer:
          "The existing component already supports a strong local conversion workflow, so this page uses it for PNG-specific search demand.",
      },
    ],
  })
)

const PDF_INTENT_PAGE_MAP = new Map(PDF_INTENT_PAGES.map((page) => [page.slug, page]))

export function getPdfIntentPage(slug: string) {
  return PDF_INTENT_PAGE_MAP.get(slug)
}

export function pdfIntentPathFor(slug: string) {
  return `/${slug}`
}

export function getIntentPagesForTool(toolKey: PdfIntentToolKey) {
  return PDF_INTENT_PAGES.filter((page) => page.toolKey === toolKey)
}

export function buildPdfIntentMetadata(slug: string): Metadata {
  const page = getPdfIntentPage(slug)
  if (!page) {
    throw new Error(`Unknown PDF intent page: ${slug}`)
  }

  const canonical = buildCanonicalUrl(pdfIntentPathFor(page.slug))

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        de: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Plain.tools",
      locale: "en_GB",
      title: page.title,
      description: page.metaDescription,
      url: canonical,
      images: [
        {
          url: "/og/tools.png",
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: ["/og/tools.png"],
    },
  }
}

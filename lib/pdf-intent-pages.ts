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
  howItWorks: [string, string, string]
  relatedTools: [IntentLink, IntentLink, IntentLink]
  learnLinks: [IntentLink, IntentLink]
  faqs: [IntentFaq, IntentFaq, IntentFaq]
}

export const PDF_INTENT_PAGES: PdfIntentPage[] = [
  {
    slug: "compress-pdf-online",
    h1: "Compress PDF Online (Private, No Uploads)",
    title: "Compress PDF Online (Private, No Uploads) | Plain.tools",
    metaDescription:
      "Compress PDF files directly in your browser with no uploads required. Fast, private PDF compression using local processing.",
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
    h1: "Merge PDF Files (Private, No Uploads)",
    title: "Merge PDF Files (Private, No Uploads) | Plain.tools",
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
    h1: "Convert PDF to Word (Private, No Uploads)",
    title: "Convert PDF to Word (Private, No Uploads) | Plain.tools",
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
    h1: "Convert Word to PDF (Private, No Uploads)",
    title: "Convert Word to PDF (Private, No Uploads) | Plain.tools",
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
    h1: "Split PDF Pages (Private, No Uploads)",
    title: "Split PDF Pages (Private, No Uploads) | Plain.tools",
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
    h1: "Rotate PDF Pages (Private, No Uploads)",
    title: "Rotate PDF Pages (Private, No Uploads) | Plain.tools",
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
    h1: "Extract PDF Pages (Private, No Uploads)",
    title: "Extract PDF Pages (Private, No Uploads) | Plain.tools",
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
    h1: "PDF to JPG (Private, No Uploads)",
    title: "PDF to JPG (Private, No Uploads) | Plain.tools",
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
    h1: "JPG to PDF (Private, No Uploads)",
    title: "JPG to PDF (Private, No Uploads) | Plain.tools",
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
]

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

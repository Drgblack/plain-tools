import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"

type ToolProblemFaq = {
  question: string
  answer: string
}

export type ToolProblemPageDefinition = {
  slug: string
  toolSlug: string
  problemVariant: string
  title: string
  metaDescription: string
  h1: string
  introText: string
  howItWorks: string[]
  limitations: string[]
  faq: ToolProblemFaq[]
  relatedTools: string[]
  relatedGuides: string[]
}

function buildIntro({
  directAnswer,
  context,
  privacyAngle,
}: {
  directAnswer: string
  context: string
  privacyAngle: string
}) {
  return `${directAnswer} ${context} ${privacyAngle}`
}

function buildMeta(lead: string) {
  return `${lead} Use Plain Tools for local browser processing with no upload step, practical checks, and a clean download workflow for everyday documents.`
}

function createProblemPage(
  definition: Omit<ToolProblemPageDefinition, "introText" | "metaDescription"> & {
    intro: {
      directAnswer: string
      context: string
      privacyAngle: string
    }
    metaLead: string
  }
): ToolProblemPageDefinition {
  return {
    ...definition,
    introText: buildIntro(definition.intro),
    metaDescription: buildMeta(definition.metaLead),
  }
}

export const TOOL_PROBLEM_PAGES: ToolProblemPageDefinition[] = [
  createProblemPage({
    slug: "merge-pdf-mac",
    toolSlug: "merge-pdf",
    problemVariant: "mac",
    title: "Merge PDF on Mac - Local Browser Workflow | Plain Tools",
    h1: "Merge PDF on Mac - No Upload, Local Processing",
    intro: {
      directAnswer:
        "You can merge PDF files on a Mac directly in your browser without installing a separate desktop app or sending the document set to a remote service.",
      context:
        "This route is built for people using Safari, Chrome, Edge, or Firefox on macOS who need a straightforward way to combine reports, invoices, contracts, or application packs into one file. Instead of bouncing between preview exports, upload forms, and random converter sites, you can open the tool, add the PDFs in the order you want, review the sequence, and download the merged file from the same page.",
      privacyAngle:
        "That matters when the documents are private or when you simply want the task finished quickly: the core merge flow stays local in the browser, so the file bytes do not need to be uploaded to Plain Tools servers. You still need to review page order, bookmarks, and final readability, but the page gives you the full workflow and the privacy context up front rather than hiding it behind a generic upload button.",
    },
    metaLead: "Merge PDF on Mac in your browser without a separate app.",
    howItWorks: [
      "Open the merge workspace on your Mac browser and add the PDF files you want to combine.",
      "Drag the files into the right order before you run the merge so the output matches the final reading flow.",
      "Start the local merge process, then review the downloaded PDF for page order, bookmarks, and any duplicated pages.",
      "If something looks off, adjust the order and rerun while the files are still in the local session.",
    ],
    limitations: [
      "Very large files or image-heavy PDFs can use a noticeable amount of browser memory on older Macs.",
      "Merged output keeps the page content, but advanced metadata or document structures may not behave exactly like the source files.",
      "You should still review the final document before sharing it externally.",
    ],
    faq: [
      {
        question: "Do I need Preview or Acrobat to merge PDFs on Mac?",
        answer:
          "No. This route uses a browser-based workflow, so you can combine files without relying on a separate installed editor.",
      },
      {
        question: "Does Plain Tools upload my Mac PDFs?",
        answer:
          "No for the core merge workflow. The file handling stays local in your browser, and you can verify that with DevTools Network inspection.",
      },
      {
        question: "Will page order stay the same after merging?",
        answer:
          "Yes if you set the order correctly before processing. Review the output once before sending it on.",
      },
      {
        question: "Is this suitable for sensitive documents?",
        answer:
          "It is more privacy-friendly than an upload tool because the merge runs locally, but you should still check the result carefully before distribution.",
      },
    ],
    relatedTools: ["split-pdf", "compress-pdf", "reorder-pdf"],
    relatedGuides: [
      "/learn/how-to-merge-pdfs-offline",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
    ],
  }),
  createProblemPage({
    slug: "merge-pdf-windows",
    toolSlug: "merge-pdf",
    problemVariant: "windows",
    title: "Merge PDF on Windows - Private Browser Tool | Plain Tools",
    h1: "Merge PDF on Windows - Fast Local Workflow",
    intro: {
      directAnswer:
        "You can merge PDF files on Windows in a browser tab without installing a heavy PDF suite or moving the documents through an upload queue.",
      context:
        "This page is designed for the real situations people search for: combining signed forms, stitching together scanned evidence, building one application packet, or tidying a stack of exported reports before sending them to someone else. The tool below keeps the process simple. Add the files, sort them into the right order, run the merge, and download the new PDF when the local job finishes.",
      privacyAngle:
        "That browser-first route is useful because it removes two common sources of friction at once: software installation and cloud upload. For the core workflow, the files are processed locally in your browser session rather than being passed through a Plain Tools server. The page also explains the practical caveats, so you know to check page order and output quality before you treat the merged result as final.",
    },
    metaLead: "Merge PDF on Windows in your browser with a local workflow.",
    howItWorks: [
      "Open the merge tool on your Windows browser and add the PDFs you want in the final bundle.",
      "Reorder the files to match the sequence you need for review, printing, or submission.",
      "Run the merge locally and download the combined PDF once processing finishes.",
      "Review the final file before sharing, especially if the source PDFs came from different systems.",
    ],
    limitations: [
      "Older Windows machines with limited RAM may struggle with very large source sets.",
      "The merged file keeps page content, but complex source structures can still require a quick manual review.",
      "If one source PDF is corrupt, the merge may fail and you may need to isolate the problematic file.",
    ],
    faq: [
      {
        question: "Can I merge PDFs on Windows without installing software?",
        answer:
          "Yes. This route uses a browser workflow, so you can combine PDFs without adding a separate desktop application.",
      },
      {
        question: "Does the merge happen online?",
        answer:
          "The page loads online, but the core file merge is processed locally in the browser rather than uploaded to a Plain Tools server.",
      },
      {
        question: "Is this useful for work documents?",
        answer:
          "Yes, especially when you need one combined document quickly and want to avoid upload-based tools for routine internal material.",
      },
      {
        question: "What should I verify after merging?",
        answer:
          "Check page order, page count, readability, and whether any source-specific quirks carried over into the output.",
      },
    ],
    relatedTools: ["compress-pdf", "split-pdf", "compare-pdf"],
    relatedGuides: ["/learn/how-to-merge-pdfs-offline", "/verify-claims"],
  }),
  createProblemPage({
    slug: "merge-pdf-offline",
    toolSlug: "merge-pdf",
    problemVariant: "offline",
    title: "Merge PDF Offline - Browser-Based and Private | Plain Tools",
    h1: "Merge PDF Offline - Local Browser Processing",
    intro: {
      directAnswer:
        "If you need to merge PDF files without depending on an upload workflow, a local browser tool is often the cleanest option.",
      context:
        "People usually search for an offline merge route when they are travelling, working with unstable connectivity, or handling files that should stay under tighter control. This page is built for that situation. It explains the local workflow first, then gives you the live merge tool so you can combine pages without turning the task into a cloud hand-off. Add the PDFs, confirm the sequence, run the merge, and download the output directly.",
      privacyAngle:
        "The important distinction is that the core merge processing happens in your browser session rather than on a remote Plain Tools server. That does not remove every limitation, because memory and source quality still matter, but it does remove the upload step that many people are trying to avoid. If you want proof instead of marketing language, the page also points you to verification steps you can run yourself in DevTools.",
    },
    metaLead: "Merge PDF offline with a browser-first local processing flow.",
    howItWorks: [
      "Load the page and add the PDFs you want to merge while your browser session is active.",
      "Arrange the files in the order you need so the combined output is ready for review or sharing.",
      "Run the merge locally, then download the finished PDF directly from the result area.",
      "Open the output and check that page order and document completeness match your intent.",
    ],
    limitations: [
      "You still need the page assets loaded in the browser at least once before a true offline session is realistic.",
      "Very large document sets can be memory-intensive even when the workflow is local.",
      "Offline-friendly does not guarantee perfect handling of damaged or unusually structured source PDFs.",
    ],
    faq: [
      {
        question: "Can I really merge PDFs offline?",
        answer:
          "You can run the core merge locally once the page is loaded, although browser caching and your environment still affect how offline-friendly the session is.",
      },
      {
        question: "Why choose offline merging?",
        answer:
          "It reduces dependence on uploads, avoids network delays for the core task, and keeps the source files on your device during processing.",
      },
      {
        question: "Does local merging mean no server ever sees the file?",
        answer:
          "For the core merge flow on Plain Tools, the file bytes are not uploaded to our server. You can verify that in the Network tab.",
      },
      {
        question: "What if my PDFs are huge?",
        answer:
          "Try smaller batches first. Large or image-heavy PDFs can still push browser memory limits.",
      },
    ],
    relatedTools: ["compress-pdf", "reorder-pdf", "extract-pdf"],
    relatedGuides: ["/learn/how-to-merge-pdfs-offline", "/learn/no-uploads-explained"],
  }),
  createProblemPage({
    slug: "merge-pdf-secure",
    toolSlug: "merge-pdf",
    problemVariant: "secure",
    title: "Merge PDF Securely - Local Processing | Plain Tools",
    h1: "Merge PDF Securely - No Upload for the Core Workflow",
    intro: {
      directAnswer:
        "If you want to merge PDF files securely, the first question is not the merge button. It is where the document data goes while the merge runs.",
      context:
        "This route is written for people handling contracts, HR forms, invoices, policy packs, legal bundles, and other files that should not be pushed through a generic upload service without thought. The tool below performs the core merge locally in your browser. That means you can combine the PDFs, download the result, and keep the workflow closer to your own device instead of sending the source set to Plain Tools servers for processing.",
      privacyAngle:
        "That local approach does not make the job magically risk-free. You still need to review the output, protect the file if it will be shared, and keep an eye on who receives the final bundle. What it does do is remove the server upload step from the core task and give you a route you can inspect yourself in browser developer tools if trust matters as much as convenience.",
    },
    metaLead: "Merge PDF securely with local browser processing and no upload step.",
    howItWorks: [
      "Add the source PDFs and confirm that the files you selected are the ones you actually intend to combine.",
      "Arrange the order carefully so the resulting bundle does not expose pages in the wrong sequence.",
      "Run the merge locally, then download the combined PDF and open it for a final manual review.",
      "If the result will be shared externally, consider protecting or signing the final document separately.",
    ],
    limitations: [
      "Secure handling still depends on what you do with the output after download.",
      "A local merge flow does not automatically encrypt or password-protect the resulting PDF.",
      "You should review page order and content before sending a sensitive file onward.",
    ],
    faq: [
      {
        question: "Is a local merge tool safer than an upload tool?",
        answer:
          "It can be more privacy-friendly because the core merge runs on your device and avoids uploading the file contents to a remote service.",
      },
      {
        question: "Can I verify the no-upload claim?",
        answer:
          "Yes. Open DevTools, watch the Network tab, and confirm that no file-upload request is sent during the core merge workflow.",
      },
      {
        question: "Should I still protect the merged file?",
        answer:
          "If the final PDF is sensitive and will be shared, password protection or another access control step may still be appropriate.",
      },
      {
        question: "What is the biggest practical risk after merging?",
        answer:
          "Human error. The most common problem is sending the wrong page order or including a page that should have been removed before sharing.",
      },
    ],
    relatedTools: ["protect-pdf", "sign-pdf", "reorder-pdf"],
    relatedGuides: [
      "/verify-claims",
      "/learn/how-to-verify-a-pdf-tool-doesnt-upload-your-files",
      "/learn/workflows/password-protect-pdf-before-emailing",
    ],
  }),
  createProblemPage({
    slug: "compress-pdf-large-files",
    toolSlug: "compress-pdf",
    problemVariant: "large-files",
    title: "Compress Large PDF Files - Private Browser Tool | Plain Tools",
    h1: "Compress Large PDF Files - Local Browser Workflow",
    intro: {
      directAnswer:
        "Large PDFs are usually difficult because they combine long page counts, heavy scans, and embedded images, not because the compression button is missing.",
      context:
        "This route is built for the common real-world cases: reducing a report so it can be emailed, shrinking an image-heavy contract bundle, or cleaning up a scanned file before an upload limit blocks you elsewhere. The tool below keeps the compression workflow in the browser so you can try light, medium, or strong settings without handing the document to a generic cloud service first.",
      privacyAngle:
        "That local route is useful when the file is private or when you want to avoid long upload waits for a document that may need multiple passes. It does not remove technical limits. Very large PDFs can still use a lot of memory, and heavy compression can make text or signatures harder to read. This page is meant to make those trade-offs clear before you start so the tool remains useful, not mysterious.",
    },
    metaLead: "Compress large PDF files locally in your browser without upload delays.",
    howItWorks: [
      "Add the large PDF and start with a moderate compression level rather than the strongest option immediately.",
      "Run the local compression pass and compare the output size against the original before deciding whether to go further.",
      "Open the compressed file and check readability, signatures, and image quality on the pages that matter most.",
      "If the result is still too large, rerun with stronger settings or split the file before sharing.",
    ],
    limitations: [
      "Large image-based files can still be slow because browser memory and device performance matter.",
      "Stronger compression usually trades size reduction for lower visual fidelity.",
      "Some PDFs are already optimised, so the size change may be smaller than expected.",
    ],
    faq: [
      {
        question: "Why is my PDF still large after compression?",
        answer:
          "Some files are already reasonably optimised, and image-heavy scans often have a floor below which quality loss becomes obvious.",
      },
      {
        question: "Is local compression slower for large files?",
        answer:
          "It can be, especially on older devices, but it avoids upload time and keeps the file on your device during processing.",
      },
      {
        question: "Will compression affect OCR or readability?",
        answer:
          "It can. Always check text clarity and image detail after compression, especially on scanned documents.",
      },
      {
        question: "What should I do if the file is still too big?",
        answer:
          "Try splitting the PDF, compressing again, or lowering the number of pages you need to share in one file.",
      },
    ],
    relatedTools: ["split-pdf", "ocr-pdf", "merge-pdf"],
    relatedGuides: [
      "/learn/how-pdf-compression-works",
      "/learn/why-offline-compression-has-limits",
    ],
  }),
  createProblemPage({
    slug: "compress-pdf-scanned",
    toolSlug: "compress-pdf",
    problemVariant: "scanned",
    title: "Compress Scanned PDF Files - No Upload | Plain Tools",
    h1: "Compress Scanned PDF Files - Local Processing",
    intro: {
      directAnswer:
        "Scanned PDFs usually compress differently from digitally generated PDFs because most of the file weight comes from page images rather than selectable text.",
      context:
        "This page is meant for people dealing with scanned statements, receipts, forms, archive records, and camera-to-PDF exports that need to be smaller before they can be emailed or uploaded elsewhere. The tool below runs the compression workflow in the browser and gives you a direct way to test whether the file can be reduced enough without wrecking readability.",
      privacyAngle:
        "That local route matters more with scanned files because they often contain passports, HR records, invoices, or other documents that users do not want to send through a remote compressor unless they have to. The page also makes the limits clear. If the file is essentially a stack of dense images, strong compression may blur detail, and OCR may still be needed if you want searchable output instead of a lighter scan.",
    },
    metaLead: "Compress scanned PDF files locally while keeping the workflow private.",
    howItWorks: [
      "Upload the scanned PDF and start with a moderate compression setting to preserve legibility.",
      "Run compression locally and compare the new file size with the original.",
      "Review the compressed output page by page, focusing on signatures, small print, and faint scans.",
      "If the document also needs searchable text, move to OCR after you confirm the image quality is still acceptable.",
    ],
    limitations: [
      "Scanned PDFs can lose visible detail faster than digitally generated PDFs when heavy compression is applied.",
      "Compression alone does not make the file searchable; OCR is a separate step.",
      "Poor original scans cannot be fully rescued by the compression step.",
    ],
    faq: [
      {
        question: "Are scanned PDFs harder to compress?",
        answer:
          "Yes. They are often image-heavy, so size reduction usually depends on image quality trade-offs rather than text optimisation.",
      },
      {
        question: "Will this make my scanned PDF searchable?",
        answer:
          "No. Compression reduces file size. Searchability requires OCR, which is a separate workflow.",
      },
      {
        question: "Should I compress before OCR?",
        answer:
          "Usually yes, but only if readability stays acceptable. Over-compressing a scan can make OCR less reliable.",
      },
      {
        question: "Why use a local compressor for scans?",
        answer:
          "Scanned PDFs often contain sensitive records, so a local workflow removes the upload step for the core task.",
      },
    ],
    relatedTools: ["ocr-pdf", "split-pdf", "pdf-to-jpg"],
    relatedGuides: [
      "/learn/how-pdf-compression-works",
      "/learn/workflows/make-scanned-pdf-searchable-for-records",
    ],
  }),
  createProblemPage({
    slug: "sign-pdf-online",
    toolSlug: "sign-pdf",
    problemVariant: "online",
    title: "Sign PDF Online - Private Browser Signing | Plain Tools",
    h1: "Sign PDF Online - Local Visual Signing",
    intro: {
      directAnswer:
        "You can sign a PDF online without treating “online” as a synonym for uploading the document to a remote signing service.",
      context:
        "This page is designed for the practical task most people have in front of them: add a visual signature to a form, contract, approval sheet, or acknowledgement PDF and return it quickly. The live tool below lets you draw, type, or place a saved signature image inside the document from the browser. You can position it, review it, and download the signed copy without turning the job into an account setup exercise.",
      privacyAngle:
        "That matters because many lightweight signing tasks do not need a fully managed e-signature platform. If the job is simply to place a visible signature mark on a PDF, a local browser workflow can be faster and more private. The core file handling stays on your device during the signing step, and this page also explains the limits so you do not confuse a visual signature workflow with a formal legal-signature platform.",
    },
    metaLead: "Sign PDF online in your browser with local file handling.",
    howItWorks: [
      "Open the signing workspace and add the PDF that needs a visible signature.",
      "Choose whether to draw, type, or place an image-based signature, then position it on the page.",
      "Review the appearance and placement before downloading the signed copy.",
      "If the document also needs legal workflow features such as signer tracking, use a dedicated platform after deciding that is truly necessary.",
    ],
    limitations: [
      "This route focuses on visible signing, not a full enterprise e-signature workflow with audit trails and multi-party routing.",
      "You still need to review placement carefully before sending the document onward.",
      "Some recipients may require a cryptographic or platform-specific signature process instead.",
    ],
    faq: [
      {
        question: "Is this the same as DocuSign-style signing?",
        answer:
          "No. This page focuses on placing a visible signature on a PDF, not on a full remote signature workflow with managed audit trails.",
      },
      {
        question: "Does Plain Tools upload the PDF when I sign it?",
        answer:
          "No for the core signing workflow. The file handling remains local in the browser during processing.",
      },
      {
        question: "Can I type instead of drawing a signature?",
        answer:
          "Yes. The tool supports multiple signature-input methods so you can choose the fastest suitable option.",
      },
      {
        question: "When should I use a formal e-signature platform instead?",
        answer:
          "Use one when you need identity verification, managed signing parties, or compliance features beyond a visible signature mark.",
      },
    ],
    relatedTools: ["fill-pdf", "protect-pdf", "local-signer"],
    relatedGuides: ["/learn/how-to-sign-a-pdf-without-uploading-it", "/verify-claims"],
  }),
  createProblemPage({
    slug: "protect-pdf-password",
    toolSlug: "protect-pdf",
    problemVariant: "password",
    title: "Protect PDF with Password - Local Browser Tool | Plain Tools",
    h1: "Protect PDF with Password - Private Local Workflow",
    intro: {
      directAnswer:
        "If you need to password-protect a PDF, the important question is not just how to set the password, but whether the file has to leave your device first.",
      context:
        "This route is built for straightforward sharing tasks: sending a contract copy by email, storing a private form, or handing off a document that should not open freely if the file is forwarded. The tool below lets you add password protection locally in your browser, download the protected copy, and keep the workflow focused on the actual outcome instead of account friction or unnecessary upload steps.",
      privacyAngle:
        "That is useful for a privacy-first site because password protection is often applied precisely when the document matters. A local workflow cannot solve every security problem, but it does remove the need to upload the source PDF to Plain Tools for the core task. The page also explains the caveats clearly: password protection helps control access to the file, but it does not replace sensible sharing habits or secure password handling.",
    },
    metaLead: "Protect a PDF with a password locally in your browser.",
    howItWorks: [
      "Add the PDF, choose a strong password, and confirm it carefully before processing.",
      "Run the protection step locally and download the locked copy once the browser task completes.",
      "Test the protected file by opening it yourself before sending it anywhere else.",
      "Share the password separately from the file if the document is sensitive.",
    ],
    limitations: [
      "Password protection is only as strong as the password you choose and how you share it.",
      "This does not fix accidental oversharing if you send the file and password together.",
      "Some workflows may need additional document controls beyond a password.",
    ],
    faq: [
      {
        question: "Does password-protecting a PDF make it fully secure?",
        answer:
          "It helps control access, but security still depends on password quality and how the file and password are shared.",
      },
      {
        question: "Can I protect the file without uploading it?",
        answer:
          "Yes. The core protection workflow runs locally in your browser on Plain Tools.",
      },
      {
        question: "Should I test the file after protecting it?",
        answer:
          "Yes. Open the output yourself once to confirm the password works before sending the document to someone else.",
      },
      {
        question: "What is the best way to send the password?",
        answer:
          "Use a separate channel from the file itself, such as a call or a different secure messaging route.",
      },
    ],
    relatedTools: ["unlock-pdf", "sign-pdf", "metadata-purge"],
    relatedGuides: [
      "/learn/how-to-protect-a-pdf-with-a-password",
      "/learn/workflows/password-protect-pdf-before-emailing",
    ],
  }),
  createProblemPage({
    slug: "unlock-pdf-online",
    toolSlug: "unlock-pdf",
    problemVariant: "online",
    title: "Unlock PDF Online - Browser-Based and Private | Plain Tools",
    h1: "Unlock PDF Online - Local Browser Processing",
    intro: {
      directAnswer:
        "You can unlock a PDF online without treating the browser route as a reason to upload the locked file to a third-party processor.",
      context:
        "This page is for the common legitimate use case: you already have the correct password, but you need an accessible copy of the PDF so you can search it, print it, edit it, or pass it into another step in your workflow. The tool below is built for that straightforward task. Provide the password you are authorised to use, run the unlock step locally, and download the accessible result once processing finishes.",
      privacyAngle:
        "That local model matters because protected PDFs often contain the very material people do not want to upload casually. The page keeps the workflow practical: no false promises about bypassing permissions you do not have, just a clear explanation of how to unlock an authorised document in the browser while keeping the core processing on your own device.",
    },
    metaLead: "Unlock a PDF online in your browser when you know the password.",
    howItWorks: [
      "Add the protected PDF and enter the correct password you are authorised to use.",
      "Run the unlock step locally and wait for the browser to generate the accessible copy.",
      "Download the unlocked PDF and confirm it opens without the password as expected.",
      "If the document remains sensitive, protect the resulting copy again before broader sharing.",
    ],
    limitations: [
      "This is not a password-cracking route. You need the correct password to unlock the file legitimately.",
      "The unlocked copy is easier to access, so handle the output carefully if the document is sensitive.",
      "Some PDFs include other restrictions that may still affect downstream workflows.",
    ],
    faq: [
      {
        question: "Can this unlock a PDF without the password?",
        answer:
          "No. This route is for authorised unlocking when you already know the correct password.",
      },
      {
        question: "Does Plain Tools upload the locked file?",
        answer:
          "No for the core unlock workflow. The processing remains local in the browser.",
      },
      {
        question: "Why would I unlock a PDF I already can open?",
        answer:
          "You may need an accessible copy for printing, editing, searching, or moving into another local workflow.",
      },
      {
        question: "Should I re-protect the output?",
        answer:
          "If the document is still sensitive and will be shared, yes. Unlocking removes an access barrier from the copy you download.",
      },
    ],
    relatedTools: ["protect-pdf", "sign-pdf", "fill-pdf"],
    relatedGuides: ["/verify-claims", "/learn/no-uploads-explained"],
  }),
  createProblemPage({
    slug: "fill-pdf-form-online",
    toolSlug: "fill-pdf",
    problemVariant: "form",
    title: "Fill PDF Form Online - Local Browser Editor | Plain Tools",
    h1: "Fill PDF Form Online - Keep the Form on Your Device",
    intro: {
      directAnswer:
        "You can fill many PDF forms online directly in the browser without turning a simple admin task into a cloud upload workflow.",
      context:
        "This page is aimed at practical form work: onboarding forms, applications, questionnaires, approvals, and internal documents that already arrive as a PDF. Instead of printing, handwriting, rescanning, or uploading the file to a generic service, you can open the form below, complete the fields locally, and export either a share copy or another working version depending on what the task needs.",
      privacyAngle:
        "That matters because form PDFs often include addresses, dates of birth, payroll details, or other personal information. A local browser workflow removes the upload step for the core form-filling task and gives you a faster path from blank form to completed file. The page also explains the limits clearly, because not every PDF is a true AcroForm and some scans may need OCR or annotation instead of standard field editing.",
    },
    metaLead: "Fill a PDF form online with local browser-based processing.",
    howItWorks: [
      "Open the form workspace and add the PDF you need to complete.",
      "Fill the editable fields, then review the values once before exporting the result.",
      "Choose whether you need a flattened share copy or a version that remains editable for later updates.",
      "Download the output and check that all expected fields, dates, and selections are present.",
    ],
    limitations: [
      "Not every PDF contains real editable form fields; some scanned forms may need annotation or OCR first.",
      "You should review every field before export because small errors are easy to miss in admin workflows.",
      "Flattening the result may make later editing harder, so choose the output type deliberately.",
    ],
    faq: [
      {
        question: "Can I fill any PDF as a form?",
        answer:
          "Not always. True AcroForm files are easiest. Scanned or flat PDFs may need another workflow such as annotation.",
      },
      {
        question: "Is the form uploaded to Plain Tools?",
        answer:
          "No for the core form-filling workflow. The file handling stays local in the browser.",
      },
      {
        question: "What is a flattened copy?",
        answer:
          "A flattened output turns the visible field values into part of the page content so the file is easier to share consistently.",
      },
      {
        question: "Should I sign the form after filling it?",
        answer:
          "If the workflow requires it, yes. Filling and signing are related tasks, but they are not the same step.",
      },
    ],
    relatedTools: ["sign-pdf", "annotate-pdf", "ocr-pdf"],
    relatedGuides: ["/learn/how-to-sign-a-pdf-without-uploading-it", "/verify-claims"],
  }),
  createProblemPage({
    slug: "reorder-pdf-pages",
    toolSlug: "reorder-pdf",
    problemVariant: "pages",
    title: "Reorder PDF Pages - Browser-Based and Private | Plain Tools",
    h1: "Reorder PDF Pages - Local Page Management",
    intro: {
      directAnswer:
        "Reordering PDF pages should be a quick correction step, not a reason to upload a document and wait for a round trip just to fix the page order.",
      context:
        "This page is for the practical jobs people run into every day: moving a signature page to the end, putting annexes into the right position, removing blank scans from the middle, or rebuilding a presentation deck into the order the reader actually needs. The live tool below is built for page-level management, so you can drag, rotate, extract, and reorder in one browser workflow before exporting the revised file.",
      privacyAngle:
        "That browser-first model is especially useful when the document is sensitive or when you are making several page-order decisions and do not want to re-upload the file on every pass. The core processing stays local in your session, and the page explains the caveats that matter in practice: review the page order carefully, make sure nothing was dropped accidentally, and confirm the output before sharing.",
    },
    metaLead: "Reorder PDF pages locally in your browser without uploading the file.",
    howItWorks: [
      "Open the page organiser and add the PDF you need to restructure.",
      "Drag pages into the right order and remove, extract, or rotate pages where needed.",
      "Export the revised PDF locally, then download the result for final review.",
      "Open the output and scan the thumbnail order once more before sending it onward.",
    ],
    limitations: [
      "Large PDFs with many thumbnails can use more browser memory and may feel slower on older devices.",
      "Page reordering changes sequence, so it is important to review the output before treating it as final.",
      "If the source PDF is damaged, some page operations may fail or need a retry.",
    ],
    faq: [
      {
        question: "Can I reorder pages without editing the content itself?",
        answer:
          "Yes. This route is designed for structural changes such as order, removal, extraction, and rotation.",
      },
      {
        question: "Does page reordering upload the PDF?",
        answer:
          "No for the core workflow. The page operations run locally in the browser.",
      },
      {
        question: "Can I also delete pages here?",
        answer:
          "Yes. The page organiser is intended for broader page management, not only simple reordering.",
      },
      {
        question: "What should I verify after export?",
        answer:
          "Check sequence, missing pages, rotation, and whether the final structure matches the version you meant to send.",
      },
    ],
    relatedTools: ["extract-pdf", "rotate-pdf", "merge-pdf"],
    relatedGuides: ["/learn/how-to-extract-pages-from-a-pdf", "/verify-claims"],
  }),
  createProblemPage({
    slug: "annotate-pdf-online",
    toolSlug: "annotate-pdf",
    problemVariant: "online",
    title: "Annotate PDF Online - Local Browser Review Tool | Plain Tools",
    h1: "Annotate PDF Online - Private Review Workspace",
    intro: {
      directAnswer:
        "You can annotate a PDF online in a browser tab without turning a routine review task into an upload-heavy collaboration workflow.",
      context:
        "This page is aimed at the practical cases that come up every day: marking review comments, highlighting clauses, circling issues in a proof, or adding typed notes to a share copy before you send feedback. The tool below gives you a local annotation workspace with pen, highlight, and text controls so you can make the mark-up, review it, and export the annotated file from the same session.",
      privacyAngle:
        "That local model matters when the source PDF is private or when the annotations themselves reveal internal feedback. The core file handling stays on your device during the workflow, so you can review and mark up a document without uploading the original to Plain Tools. The page also keeps expectations grounded: this is a practical browser annotation tool, not a full enterprise collaboration platform with synced comments and live reviewer state.",
    },
    metaLead: "Annotate PDF online with a local browser-based review workflow.",
    howItWorks: [
      "Add the PDF and choose the annotation mode you need, such as text, pen, or highlighting.",
      "Mark up the document locally while reviewing the relevant pages in the browser workspace.",
      "Download the annotated copy and check that the notes appear where you expect them.",
      "If the file is for client or team review, verify that none of your comments cover essential text.",
    ],
    limitations: [
      "This is a browser annotation workflow, not a shared real-time review platform.",
      "Dense pages can become cluttered quickly if too many notes are added without a final clean-up pass.",
      "You should confirm that your annotations do not obscure important content.",
    ],
    faq: [
      {
        question: "Can I highlight and type comments in the same PDF?",
        answer:
          "Yes. The tool is built for practical review workflows with multiple annotation styles.",
      },
      {
        question: "Does annotating a PDF upload it to Plain Tools?",
        answer:
          "No for the core annotation workflow. The document stays local in the browser during processing.",
      },
      {
        question: "Is this good for formal review approval?",
        answer:
          "It is useful for practical markup and review copies, but formal approval workflows may need additional controls outside the annotation step.",
      },
      {
        question: "What should I do before sharing annotations?",
        answer:
          "Read the annotated copy once to make sure comments are clear, correctly placed, and not covering key content.",
      },
    ],
    relatedTools: ["sign-pdf", "fill-pdf", "compare-pdf"],
    relatedGuides: ["/verify-claims", "/learn/no-uploads-explained"],
  }),
  createProblemPage({
    slug: "compare-pdf-files",
    toolSlug: "compare-pdf",
    problemVariant: "pages",
    title: "Compare PDF Files - Local Browser Comparison | Plain Tools",
    h1: "Compare PDF Files - Private Browser Review",
    intro: {
      directAnswer:
        "If you need to compare PDF files, the real goal is not just to spot a difference. It is to review changes quickly without losing control of the source documents.",
      context:
        "This route is written for practical comparison work: contract revisions, updated reports, policy drafts, tender documents, and any two PDF versions that need side-by-side review. The live tool below compares the files locally and helps you focus on text differences and review cues instead of opening both PDFs in separate tabs and scanning them manually.",
      privacyAngle:
        "That local model matters because version comparisons often involve sensitive content precisely at the moment when people are tempted to use the nearest online upload tool. Here, the core comparison workflow stays in your browser rather than sending the PDFs to Plain Tools servers. You still need to read the output carefully and confirm whether a difference is material, but the page gives you a more trustworthy starting point for that review.",
    },
    metaLead: "Compare PDF files locally in your browser with a private review workflow.",
    howItWorks: [
      "Add both PDF versions and label them clearly so you know which is the baseline and which is the revised copy.",
      "Run the comparison locally and review the highlighted differences or generated report.",
      "Inspect the pages where differences appear to confirm whether they are formatting changes, wording changes, or missing content.",
      "Download or keep the comparison output for review notes if the differences matter operationally.",
    ],
    limitations: [
      "A comparison tool can surface likely changes, but it cannot decide which differences are important for your workflow.",
      "Formatting-only changes may still appear noisy in some documents.",
      "Complex PDFs with unusual text extraction can require manual checking after the automated pass.",
    ],
    faq: [
      {
        question: "Can this compare wording changes between two PDFs?",
        answer:
          "Yes, that is the main purpose, although complex formatting can still require manual review on affected pages.",
      },
      {
        question: "Do I need to upload both PDFs?",
        answer:
          "No for the core comparison workflow. The files are processed locally in your browser.",
      },
      {
        question: "Is this useful for contracts and policy drafts?",
        answer:
          "Yes. It is particularly useful when you need a fast first-pass review of revisions before a closer legal or editorial read.",
      },
      {
        question: "What should I verify after comparing?",
        answer:
          "Review the specific pages that changed and confirm whether the differences are meaningful for the decision you need to make.",
      },
    ],
    relatedTools: ["annotate-pdf", "merge-pdf", "reorder-pdf"],
    relatedGuides: ["/learn/how-pdfs-work", "/compare/offline-vs-online-pdf-tools"],
  }),
  createProblemPage({
    slug: "ocr-pdf-online",
    toolSlug: "ocr-pdf",
    problemVariant: "online",
    title: "OCR PDF Online - Local Browser OCR Workflow | Plain Tools",
    h1: "OCR PDF Online - Keep the Scan on Your Device",
    intro: {
      directAnswer:
        "You can run OCR on a PDF online in the sense that you start in a browser, without turning the scan into a cloud upload job by default.",
      context:
        "This page is built for scanned forms, archive documents, receipts, letters, and records that are readable as images but not searchable as text. The tool below gives you a browser-based route to add OCR, generate searchable output, and review whether the result is good enough for actual work. That is often more useful than a generic OCR promise because the important part is not just text extraction, but whether the output becomes searchable and usable.",
      privacyAngle:
        "A local-first OCR route matters because scanned PDFs frequently contain private information. For the core workflow on Plain Tools, the file stays on your device during processing. The page also explains the limits honestly: OCR accuracy depends on scan quality, language, contrast, and page cleanliness, so you should treat the output as a working copy to review rather than an infallible transcription.",
    },
    metaLead: "Run OCR on a PDF online with local browser processing and no upload step.",
    howItWorks: [
      "Add the scanned PDF and start the OCR process in the browser workspace.",
      "Wait for the local recognition pass to complete, then open the resulting file or text layer for review.",
      "Search for a few known words or phrases to confirm the OCR worked on the expected pages.",
      "Download the searchable copy only after you have checked that the result is usable for the task ahead.",
    ],
    limitations: [
      "OCR quality depends heavily on the source scan, including sharpness, skew, and contrast.",
      "Searchable output is useful, but it may still contain recognition errors that need manual checking.",
      "Large scanned files can take longer because OCR is more computationally demanding than simple page editing.",
    ],
    faq: [
      {
        question: "Does OCR make every scanned PDF fully accurate?",
        answer:
          "No. OCR is best treated as a strong working pass, not a guarantee of perfect text extraction.",
      },
      {
        question: "Can I OCR a PDF without uploading it?",
        answer:
          "Yes on Plain Tools for the core local workflow, assuming your browser and device can handle the document.",
      },
      {
        question: "How do I test whether OCR worked?",
        answer:
          "Search for known words in the output or select text from a few pages to confirm the scan became searchable.",
      },
      {
        question: "What if my scan is low quality?",
        answer:
          "Results may be weaker. Cleaner scans, upright pages, and better contrast generally improve OCR quality.",
      },
    ],
    relatedTools: ["offline-ocr", "compress-pdf", "pdf-to-word"],
    relatedGuides: ["/learn/how-ocr-works-on-scanned-pdfs", "/learn/ocr-pdf-without-cloud"],
  }),
  createProblemPage({
    slug: "make-pdf-searchable",
    toolSlug: "ocr-pdf",
    problemVariant: "searchable",
    title: "Make PDF Searchable - Private OCR Tool | Plain Tools",
    h1: "Make PDF Searchable - Local OCR Workflow",
    intro: {
      directAnswer:
        "Making a PDF searchable usually means adding a usable text layer to a scanned or image-based document so you can search, copy, and work with it more effectively.",
      context:
        "This route is built for the practical versions of that problem: scanned records, HR forms, invoice archives, document bundles from older systems, or evidence packs that arrive as page images instead of selectable text. The tool below helps you run OCR locally, review the output, and decide whether the resulting searchable copy is good enough for indexing, hand-off, or internal search.",
      privacyAngle:
        "A local browser workflow matters here because searchable conversion is often used on the very files that people want to keep under tighter control. The core processing stays on your device during the OCR step rather than being pushed through a remote upload service. The page also makes the caveats explicit. Searchable does not mean perfect, and you should check the result before relying on it for record-keeping or compliance work.",
    },
    metaLead: "Make a PDF searchable locally in your browser with OCR.",
    howItWorks: [
      "Add the scanned or image-based PDF to the OCR workspace.",
      "Run the local recognition process and wait for the browser to generate the searchable output.",
      "Test the result by searching for names, dates, or phrases you know are in the document.",
      "Keep the original scan if needed, but use the searchable copy for review, indexing, or faster retrieval.",
    ],
    limitations: [
      "Searchable output can still contain OCR mistakes, especially on low-quality scans.",
      "If the source is badly skewed or blurred, the resulting text layer may be incomplete.",
      "You should keep the original source if the scan itself is the authoritative record.",
    ],
    faq: [
      {
        question: "What does searchable PDF mean?",
        answer:
          "It means the file contains or gains a text layer that allows search and selection, even if the original pages began as images.",
      },
      {
        question: "Is a searchable PDF the same as an editable document?",
        answer:
          "No. Searchability helps retrieval and copy-paste, but it does not automatically turn the file into a clean editable layout.",
      },
      {
        question: "Can I make a PDF searchable without uploading it?",
        answer:
          "Yes. This route uses local browser processing for the core OCR workflow.",
      },
      {
        question: "What should I test after OCR?",
        answer:
          "Search for a few expected terms and spot-check pages with small print or weak scan quality.",
      },
    ],
    relatedTools: ["ocr-pdf", "offline-ocr", "pdf-to-word"],
    relatedGuides: [
      "/learn/workflows/make-scanned-pdf-searchable-for-records",
      "/learn/how-ocr-works-on-scanned-pdfs",
    ],
  }),
  createProblemPage({
    slug: "pdf-to-excel-online",
    toolSlug: "pdf-to-excel",
    problemVariant: "online",
    title: "PDF to Excel Online - Local Browser Export | Plain Tools",
    h1: "PDF to Excel Online - Browser-Based Table Extraction",
    intro: {
      directAnswer:
        "You can export PDF tables to an Excel-friendly format online in a browser without assuming the source file has to be uploaded to a remote converter.",
      context:
        "This route is built for the usual spreadsheet recovery jobs: extracting tables from invoices, statements, reports, schedules, and financial summaries so the data can be cleaned up in Excel afterwards. The live tool below focuses on that practical hand-off. Run the extraction locally, inspect the output, then move the result into spreadsheet editing only after you confirm the structure is good enough to work with.",
      privacyAngle:
        "That browser-first model matters because many PDF-to-Excel tasks involve financial or operational documents that should not be uploaded casually. The page keeps the promise realistic. Local extraction can save time and preserve privacy, but table reconstruction is still a best-effort process. You may need to tidy columns, fix merged cells, or correct reading order after export, especially when the source table is visually complex.",
    },
    metaLead: "Convert PDF tables to Excel online with local browser processing.",
    howItWorks: [
      "Upload the PDF and identify the pages that contain the table data you actually need.",
      "Run the local extraction workflow and export the spreadsheet-friendly result.",
      "Open the output in Excel or another spreadsheet editor and clean up headers, merged cells, or column alignment.",
      "Check totals and key rows before relying on the output for reporting or analysis.",
    ],
    limitations: [
      "Complex table layouts can still need manual cleanup after export.",
      "Scanned source PDFs may require OCR before any table extraction is useful.",
      "Financial accuracy still depends on your own validation of the extracted result.",
    ],
    faq: [
      {
        question: "Will the Excel output be perfectly formatted?",
        answer:
          "Not always. Table extraction is often a best-effort process, so cleanup in Excel may still be needed.",
      },
      {
        question: "Can I convert PDF tables without uploading them?",
        answer:
          "Yes for the core local workflow on Plain Tools. The extraction runs in your browser.",
      },
      {
        question: "What if the PDF is scanned?",
        answer:
          "A scanned PDF may need OCR first, because table extraction is much harder when the source is image-based.",
      },
      {
        question: "What should I verify after export?",
        answer:
          "Check headers, column alignment, totals, and any rows that are business-critical before using the spreadsheet.",
      },
    ],
    relatedTools: ["ocr-pdf", "pdf-to-word", "compare-pdf"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
  }),
  createProblemPage({
    slug: "pdf-to-powerpoint-online",
    toolSlug: "pdf-to-ppt",
    problemVariant: "online",
    title: "PDF to PowerPoint Online - Private Browser Tool | Plain Tools",
    h1: "PDF to PowerPoint Online - Local Slide Export",
    intro: {
      directAnswer:
        "If you need to turn a PDF into a PowerPoint quickly, a browser-first route can be useful when the goal is practical slide reuse rather than a perfect editable reconstruction.",
      context:
        "This page is built for the common cases: repurposing an old deck that only survives as a PDF, creating presentation slides from a share copy, or moving a document into PowerPoint for a meeting hand-off. The tool below converts each page into a slide-ready result locally in your browser. That gives you a fast starting point for presentation work without bouncing through an upload-heavy conversion queue.",
      privacyAngle:
        "The privacy angle matters because presentation PDFs often contain internal strategy, client material, or pre-release documents. A local workflow removes the server upload step for the core conversion task and keeps expectations clear: the resulting PowerPoint is best treated as a practical reuse format, not a guarantee of perfect editable slide structure identical to the original source file.",
    },
    metaLead: "Convert PDF to PowerPoint online with local browser processing.",
    howItWorks: [
      "Add the PDF you want to repurpose into a presentation format.",
      "Run the local conversion step and export the PowerPoint output from the browser.",
      "Open the resulting deck and review slide order, image quality, and speaker-facing readability.",
      "Edit or rebuild individual slides afterwards if you need a more polished presentation version.",
    ],
    limitations: [
      "The output is useful for slide reuse, but it is not the same as recovering the original editable deck structure.",
      "Image-based slides may need manual editing if you want deeper redesign work afterwards.",
      "Very large PDFs can take longer or create larger presentation files.",
    ],
    faq: [
      {
        question: "Will this recreate the original PowerPoint exactly?",
        answer:
          "No. It is better understood as a practical slide-export workflow than a perfect source-file recovery process.",
      },
      {
        question: "Does the conversion upload my PDF?",
        answer:
          "No for the core local workflow. The conversion happens in the browser.",
      },
      {
        question: "When is this route most useful?",
        answer:
          "It is most useful when you need a quick presentation starting point from an existing PDF, not a pixel-perfect editable recovery.",
      },
      {
        question: "Should I review the slides after export?",
        answer:
          "Yes. Check order, legibility, and whether any slides need rebuilding before presenting them.",
      },
    ],
    relatedTools: ["pdf-to-word", "pdf-to-jpg", "merge-pdf"],
    relatedGuides: ["/learn/how-pdfs-work", "/verify-claims"],
  }),
  createProblemPage({
    slug: "pdf-to-word-no-upload",
    toolSlug: "pdf-to-word",
    problemVariant: "no-upload",
    title: "PDF to Word Without Upload - Local Browser Tool | Plain Tools",
    h1: "PDF to Word - No Upload for the Core Workflow",
    intro: {
      directAnswer:
        "If you need PDF to Word conversion without upload, the key question is whether the document can be processed locally before it ever leaves your device.",
      context:
        "This page is built for that trust-focused search intent. People usually arrive here with a private agreement, CV, report, policy document, or internal file that needs light editing in Word, but they do not want to push the PDF through a remote conversion service just to make a few changes. The tool below gives you a local browser route to extract the content and generate a best-effort DOCX output for further editing.",
      privacyAngle:
        "That local approach is useful because it removes the upload step from the core workflow, but the page also keeps expectations realistic. PDF to Word is never a perfect promise for every layout. Tables, columns, and complex formatting can still need manual cleanup after export. The value here is not hype. It is a practical, privacy-first route with the limitations stated clearly before you commit to the workflow.",
    },
    metaLead: "Convert PDF to Word without upload using local browser processing.",
    howItWorks: [
      "Add the PDF you want to edit and run the local extraction and export step.",
      "Download the DOCX output and open it in Word or another compatible editor.",
      "Review headings, tables, bullet lists, and line breaks before making substantive edits.",
      "Keep the original PDF nearby so you can compare formatting if the layout is important.",
    ],
    limitations: [
      "Complex layouts often need cleanup after PDF-to-Word conversion, even with a good extraction pass.",
      "Scanned PDFs may need OCR first before editable Word output becomes useful.",
      "The resulting DOCX should be reviewed carefully before reuse or redistribution.",
    ],
    faq: [
      {
        question: "Can PDF to Word really happen without upload?",
        answer:
          "Yes on Plain Tools for the core workflow. The file processing stays local in the browser.",
      },
      {
        question: "Will the Word file match the PDF perfectly?",
        answer:
          "Not always. PDF conversion is usually best-effort, especially for complex layouts and tables.",
      },
      {
        question: "Is this better for sensitive documents?",
        answer:
          "It can be, because the core conversion avoids sending the PDF to a remote processor.",
      },
      {
        question: "What should I check first after export?",
        answer:
          "Review structure, headings, tables, and line breaks before editing or sending the DOCX onward.",
      },
    ],
    relatedTools: ["ocr-pdf", "word-to-pdf", "compare-pdf"],
    relatedGuides: ["/learn/what-happens-when-you-upload-a-pdf", "/verify-claims"],
  }),
  createProblemPage({
    slug: "pdf-to-jpg-free",
    toolSlug: "pdf-to-jpg",
    problemVariant: "free",
    title: "PDF to JPG Free - Local Browser Export | Plain Tools",
    h1: "PDF to JPG Free - Browser-Based Image Export",
    intro: {
      directAnswer:
        "If you want PDF to JPG for free, the useful answer is not just that the button exists. It is whether the route is fast, private, and practical for repeated image export work.",
      context:
        "This page is designed for common jobs such as extracting page previews, turning a PDF into images for slides, reusing a single page in a report, or sending selected pages as pictures where a full PDF is inconvenient. The tool below exports PDF pages as JPG images directly in your browser, so you can get the output quickly without introducing extra account steps or artificial paywalls into a simple conversion job.",
      privacyAngle:
        "That local model matters because many PDFs still contain private material even when you only need image output from one or two pages. The core export workflow stays on your device during processing, and the page explains what to verify afterwards: quality, scale, page selection, and whether JPG is actually the right format compared with PNG or another route.",
    },
    metaLead: "Export PDF pages to JPG for free with local browser processing.",
    howItWorks: [
      "Add the PDF and choose the pages you want to export as JPG images.",
      "Run the local conversion and download the resulting image files.",
      "Review image quality and scale before using the files in another document or workflow.",
      "If you need sharper page capture or transparency-friendly output, compare the PNG route as well.",
    ],
    limitations: [
      "JPG is efficient, but it is a lossy image format and may soften text or fine detail.",
      "Large page counts can generate many image files, so choose only the pages you need.",
      "If you need maximum clarity, PNG may be a better fit than JPG.",
    ],
    faq: [
      {
        question: "Is this PDF to JPG route free?",
        answer:
          "Yes. The core workflow is free to use for everyday image-export tasks.",
      },
      {
        question: "Does the PDF get uploaded during conversion?",
        answer:
          "No for the core local workflow. The page export runs in your browser.",
      },
      {
        question: "When should I choose JPG instead of PNG?",
        answer:
          "Choose JPG when you want smaller image files and do not need lossless detail or transparency support.",
      },
      {
        question: "What should I check after export?",
        answer:
          "Review sharpness, page selection, and whether the JPG output is good enough for the destination use case.",
      },
    ],
    relatedTools: ["jpg-to-pdf", "pdf-to-word", "image-compress"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
  }),
  createProblemPage({
    slug: "jpg-to-pdf-offline",
    toolSlug: "jpg-to-pdf",
    problemVariant: "offline",
    title: "JPG to PDF Offline - Local Browser Converter | Plain Tools",
    h1: "JPG to PDF Offline - Keep Images on Your Device",
    intro: {
      directAnswer:
        "If you need JPG to PDF offline, the most practical route is usually a browser workflow that can combine images locally instead of shuttling them through an upload service.",
      context:
        "This page is designed for the common jobs people care about: packaging photos into one shareable file, combining scanned image pages into a PDF, or preparing image-based documents for email or record keeping. The tool below lets you add JPG, JPEG, or PNG images, arrange them in the right sequence, and export one PDF from the same browser session.",
      privacyAngle:
        "That matters because images often contain IDs, receipts, forms, or other personal material that users do not want to upload casually. A local browser route removes the server upload step for the core job and keeps the workflow fast. The page also sets the right expectation: you should still review page order, orientation, and image quality before treating the exported PDF as final, especially if the images came from a phone camera or scan.",
    },
    metaLead: "Convert JPG to PDF offline in your browser with local processing.",
    howItWorks: [
      "Add the images you want in the final PDF and arrange them into the right order.",
      "Choose any available layout settings that affect fit, margins, or page orientation.",
      "Run the local conversion and download the generated PDF once it is ready.",
      "Review the output for page order, cropping, and readability before sharing the file.",
    ],
    limitations: [
      "You still need the page assets loaded once before a truly offline session is realistic.",
      "Poor source images remain poor inside the PDF, so quality starts with the images you provide.",
      "Large image batches can create large PDFs and use more device memory during processing.",
    ],
    faq: [
      {
        question: "Can I create a PDF from images without uploading them?",
        answer:
          "Yes. The core JPG-to-PDF workflow on Plain Tools runs locally in your browser.",
      },
      {
        question: "Does this work only with JPG files?",
        answer:
          "No. The workflow can also handle JPEG and PNG images for practical image-to-PDF conversion.",
      },
      {
        question: "Why use an offline-friendly route?",
        answer:
          "It keeps the image files on your device during processing and avoids upload delays for simple packaging tasks.",
      },
      {
        question: "What should I review before sending the PDF?",
        answer:
          "Check sequence, orientation, cropping, and whether the PDF is the right size for the destination workflow.",
      },
    ],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "image-compress"],
    relatedGuides: ["/learn/no-uploads-explained", "/verify-claims"],
  }),
]

export const TOOL_PROBLEM_PAGE_SLUGS = TOOL_PROBLEM_PAGES.map((page) => page.slug)

export function getToolProblemPage(slug: string) {
  return TOOL_PROBLEM_PAGES.find((page) => page.slug === slug)
}

export function getToolProblemPagesForTool(toolSlug: string) {
  return TOOL_PROBLEM_PAGES.filter((page) => page.toolSlug === toolSlug)
}

export function buildToolProblemMetadata(slug: string): Metadata | null {
  const page = getToolProblemPage(slug)
  if (!page) return null

  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/tools/${page.slug}`,
    image: "/og/tools.png",
  })
}

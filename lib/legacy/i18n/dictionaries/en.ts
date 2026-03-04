import type { Dictionary } from "../types"

/**
 * English Dictionary (Canonical)
 * 
 * This is the source of truth for all translations.
 * Other language files should match this structure exactly.
 */
export const en: Dictionary = {
  locale: "en",
  
  navigation: {
    tools: "Tools",
    learn: "Learn",
    blog: "Blog",
    home: "Home",
  },

  common: {
    tagline: "PDF tools that run in your browser",
    privacyNotice: "Processed locally. Files never leave your device.",
    learnMore: "Learn more",
    download: "Download",
    close: "Close",
    loading: "Loading",
    error: "Something went wrong",
    success: "Success",
  },

  tools: {
    mergePdf: {
      title: "Merge PDFs",
      description: "Combine multiple PDF files into one document",
      dropzoneTitle: "Drop PDF files here",
      dropzoneHint: "Drag and drop your files, or use the button below to browse",
      selectFiles: "Select files",
      addMore: "Add more files",
      mergeButton: "Merge PDFs",
      processing: "Processing locally in your browser",
      downloadReady: "Your merged PDF is ready",
      downloadButton: "Download merged PDF",
      mergeAnother: "Merge another set",
      pageCount: "pages",
      removeFile: "Remove file",
      reorder: "Drag to reorder",
    },
    splitPdf: {
      title: "Split PDF",
      description: "Extract pages from a PDF document",
    },
    compressPdf: {
      title: "Compress PDF",
      description: "Reduce PDF file size",
    },
  },

  footer: {
    tools: "Tools",
    resources: "Resources",
    about: "About",
    privacy: "Privacy",
    verify: "Verify our claims",
    privacyStatement: "Plain runs entirely in your browser. Files are never uploaded.",
  },

  meta: {
    siteTitle: "Plain - PDF tools that run in your browser",
    siteDescription: "Plain provides PDF tools that process files locally in your browser. Files are never uploaded to a server.",
    blogTitle: "Blog - Plain",
    blogDescription: "Plain writes about PDFs, local file processing, and browser-based document tools.",
    learnTitle: "Learning Center - Plain",
    learnDescription: "Plain explains how PDFs work, how local processing functions, and how to verify privacy claims.",
  },
}

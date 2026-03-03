"use client"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

export async function getPdfJs() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }

  return pdfJsModulePromise
}

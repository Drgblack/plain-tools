"use client"

type PdfLibModule = typeof import("pdf-lib")

let pdfLibModulePromise: Promise<PdfLibModule> | null = null

export async function getPdfLib() {
  if (!pdfLibModulePromise) {
    pdfLibModulePromise = import("pdf-lib")
  }

  return pdfLibModulePromise
}

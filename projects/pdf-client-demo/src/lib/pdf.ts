import { PDFDocument } from "pdf-lib"

export type CompressionLevel = "light" | "medium" | "strong"

/**
 * Merges an ordered list of PDF files entirely in-browser.
 */
export const mergePdfFiles = async (files: File[]): Promise<Uint8Array> => {
  if (files.length < 2) {
    throw new Error("Please select at least two PDF files.")
  }

  const output = await PDFDocument.create()

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const source = await PDFDocument.load(bytes, { ignoreEncryption: true })
    const pages = await output.copyPages(source, source.getPageIndices())
    pages.forEach((page) => output.addPage(page))
  }

  return output.save({ useObjectStreams: true })
}

/**
 * Best-effort local PDF optimisation.
 * Note: this preserves structure but may not reduce all PDFs dramatically.
 */
export const compressPdfFile = async (
  file: File,
  level: CompressionLevel
): Promise<Uint8Array> => {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pdf = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  pdf.setTitle("")
  pdf.setAuthor("")
  pdf.setSubject("")
  pdf.setKeywords([])
  pdf.setCreator("")
  pdf.setProducer("")

  const objectsPerTick = level === "strong" ? 220 : level === "medium" ? 160 : 120
  return pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
    objectsPerTick,
  })
}

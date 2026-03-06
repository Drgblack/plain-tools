import { describe, expect, it } from "vitest"
import { PDFDocument } from "pdf-lib"
import { compressPdfFile, mergePdfFiles } from "./pdf"

const makePdfFile = async (name: string, text: string): Promise<File> => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([300, 200])
  page.drawText(text, { x: 24, y: 120, size: 18 })
  const bytes = await pdf.save()
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
  return {
    name,
    size: bytes.byteLength,
    type: "application/pdf",
    async arrayBuffer() {
      return arrayBuffer
    },
  } as File
}

describe("mergePdfFiles", () => {
  it("throws when less than 2 files are provided", async () => {
    const single = await makePdfFile("single.pdf", "one")
    await expect(mergePdfFiles([single])).rejects.toThrow("at least two")
  })

  it("merges multiple files", async () => {
    const one = await makePdfFile("one.pdf", "one")
    const two = await makePdfFile("two.pdf", "two")
    const merged = await mergePdfFiles([one, two])

    const mergedPdf = await PDFDocument.load(merged)
    expect(mergedPdf.getPageCount()).toBe(2)
  })
})

describe("compressPdfFile", () => {
  it("returns bytes for each level", async () => {
    const source = await makePdfFile("source.pdf", "compress me")

    for (const level of ["light", "medium", "strong"] as const) {
      const compressed = await compressPdfFile(source, level)
      expect(compressed.byteLength).toBeGreaterThan(0)
      const output = await PDFDocument.load(compressed)
      expect(output.getPageCount()).toBe(1)
    }
  })
})

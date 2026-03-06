import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  countPdfPages,
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
  MAX_LOCAL_FILE_BYTES,
} from "@/lib/pdf-client-utils"
import { getPdfJs } from "@/lib/pdfjs-loader"

vi.mock("@/lib/pdfjs-loader", () => ({
  getPdfJs: vi.fn(),
}))

const mockedGetPdfJs = vi.mocked(getPdfJs)

const createFakePdfFile = (name: string, type: string, size = 16): File =>
  ({
    name,
    type,
    size,
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(size)),
  }) as unknown as File

describe("isPdfLikeFile", () => {
  it("returns true for PDF mime type", () => {
    const file = createFakePdfFile("report.bin", "application/pdf")
    expect(isPdfLikeFile(file)).toBe(true)
  })

  it("returns true for .pdf extension even with generic mime type", () => {
    const file = createFakePdfFile("Document.PDF", "application/octet-stream")
    expect(isPdfLikeFile(file)).toBe(true)
  })

  it("returns false for non-pdf files", () => {
    const file = createFakePdfFile("image.png", "image/png")
    expect(isPdfLikeFile(file)).toBe(false)
  })
})

describe("formatFileSize", () => {
  it("formats bytes and kilobytes", () => {
    expect(formatFileSize(999)).toBe("999 B")
    expect(formatFileSize(1024)).toBe("1.0 KB")
    expect(formatFileSize(1536)).toBe("1.5 KB")
  })

  it("formats megabytes and gigabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.00 MB")
    expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe("5.00 GB")
  })
})

describe("ensureSafeLocalFileSize", () => {
  it("accepts finite non-empty files within the limit", () => {
    const file = createFakePdfFile("ok.pdf", "application/pdf", 1024)
    expect(() => ensureSafeLocalFileSize(file)).not.toThrow()
  })

  it("rejects empty or unreadable files", () => {
    const file = createFakePdfFile("empty.pdf", "application/pdf", 0)
    expect(() => ensureSafeLocalFileSize(file)).toThrow(
      "Selected file is empty or unreadable."
    )
  })

  it("rejects oversized files with a bounded safety message", () => {
    const huge = createFakePdfFile(
      "large.pdf",
      "application/pdf",
      MAX_LOCAL_FILE_BYTES + 1
    )
    expect(() => ensureSafeLocalFileSize(huge)).toThrow(
      'exceeds the local processing safety limit'
    )
  })
})

describe("countPdfPages", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("reads page count and always destroys loading task", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined)
    const loadingTask = {
      promise: Promise.resolve({ numPages: 7 }),
      destroy,
    }

    const getDocument = vi.fn().mockReturnValue(loadingTask)
    mockedGetPdfJs.mockResolvedValue({ getDocument } as never)

    const file = createFakePdfFile("sample.pdf", "application/pdf")
    const count = await countPdfPages(file)

    expect(count).toBe(7)
    expect(getDocument).toHaveBeenCalledWith({
      data: expect.any(Uint8Array),
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it("destroys loading task when pdf parsing fails", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined)
    const loadingTask = {
      promise: Promise.reject(new Error("parse failure")),
      destroy,
    }

    const getDocument = vi.fn().mockReturnValue(loadingTask)
    mockedGetPdfJs.mockResolvedValue({ getDocument } as never)

    const file = createFakePdfFile("bad.pdf", "application/pdf")

    await expect(countPdfPages(file)).rejects.toThrow("parse failure")
    expect(destroy).toHaveBeenCalledTimes(1)
  })
})

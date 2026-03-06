import { describe, expect, it } from "vitest"
import { formatBytes, isPdfFile } from "./format"

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(2048)).toBe("2.0 KB")
    expect(formatBytes(1024 * 1024 * 2)).toBe("2.00 MB")
  })
})

describe("isPdfFile", () => {
  it("detects by mime type", () => {
    const file = new File(["abc"], "notes.txt", { type: "application/pdf" })
    expect(isPdfFile(file)).toBe(true)
  })

  it("detects by extension when mime is missing", () => {
    const file = new File(["abc"], "sample.PDF", { type: "" })
    expect(isPdfFile(file)).toBe(true)
  })

  it("rejects non-pdf", () => {
    const file = new File(["abc"], "image.jpg", { type: "image/jpeg" })
    expect(isPdfFile(file)).toBe(false)
  })
})

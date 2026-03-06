import { describe, expect, it } from "vitest"

import {
  expandPageRangesToUniquePages,
  formatPaddedIndex,
  parsePageRanges,
} from "@/lib/pdf-range-utils"

describe("parsePageRanges", () => {
  it("parses single pages and ranges across separators", () => {
    const ranges = parsePageRanges("1, 3-4; 7\n9", 12)

    expect(ranges).toEqual([
      { start: 1, end: 1 },
      { start: 3, end: 4 },
      { start: 7, end: 7 },
      { start: 9, end: 9 },
    ])
  })

  it("throws when no valid tokens are provided", () => {
    expect(() => parsePageRanges(" , ; \n ", 10)).toThrow(
      "Enter at least one range, for example 1-3,4-6."
    )
  })

  it("throws for invalid token syntax", () => {
    expect(() => parsePageRanges("1, abc", 10)).toThrow(
      'Invalid token "abc". Use formats like 1-3 or 5.'
    )
  })

  it("throws for descending ranges", () => {
    expect(() => parsePageRanges("6-2", 10)).toThrow(
      'Invalid range "6-2". Start must be <= end.'
    )
  })

  it("throws for out-of-document pages", () => {
    expect(() => parsePageRanges("1-11", 10)).toThrow(
      'Range "1-11" is outside the document range (1-10).'
    )
    expect(() => parsePageRanges("0", 10)).toThrow(
      "Page 0 is outside the document range (1-10)."
    )
  })
})

describe("expandPageRangesToUniquePages", () => {
  it("expands and de-duplicates page numbers in sorted order", () => {
    const pages = expandPageRangesToUniquePages([
      { start: 3, end: 4 },
      { start: 1, end: 1 },
      { start: 4, end: 6 },
      { start: 2, end: 2 },
    ])

    expect(pages).toEqual([1, 2, 3, 4, 5, 6])
  })
})

describe("formatPaddedIndex", () => {
  it("pads to width 3 by default", () => {
    expect(formatPaddedIndex(7)).toBe("007")
    expect(formatPaddedIndex(105)).toBe("105")
  })

  it("supports custom width", () => {
    expect(formatPaddedIndex(12, 5)).toBe("00012")
  })
})

export interface PageRange {
  start: number
  end: number
}

/**
 * Parses page range syntax like `1,3,5-7` into validated page ranges.
 */
export const parsePageRanges = (value: string, pageCount: number): PageRange[] => {
  const tokens = value
    .split(/[\n,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)

  if (!tokens.length) {
    throw new Error("Enter at least one range, for example 1-3,4-6.")
  }

  return tokens.map((token) => {
    const singleMatch = token.match(/^(\d+)$/)
    if (singleMatch) {
      const page = Number(singleMatch[1])
      if (page < 1 || page > pageCount) {
        throw new Error(`Page ${page} is outside the document range (1-${pageCount}).`)
      }
      return { start: page, end: page }
    }

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/)
    if (!rangeMatch) {
      throw new Error(`Invalid token "${token}". Use formats like 1-3 or 5.`)
    }

    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])

    if (start > end) {
      throw new Error(`Invalid range "${token}". Start must be <= end.`)
    }
    if (start < 1 || end > pageCount) {
      throw new Error(`Range "${token}" is outside the document range (1-${pageCount}).`)
    }

    return { start, end }
  })
}

/**
 * Expands ranges to sorted unique page numbers.
 */
export const expandPageRangesToUniquePages = (ranges: PageRange[]) => {
  const pages = new Set<number>()

  for (const range of ranges) {
    for (let page = range.start; page <= range.end; page += 1) {
      pages.add(page)
    }
  }

  return Array.from(pages).sort((left, right) => left - right)
}

export const formatPaddedIndex = (value: number, width = 3) =>
  String(value).padStart(width, "0")

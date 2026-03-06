import { describe, expect, it } from "vitest"

import { sanitizeDocxHtmlForRendering } from "@/lib/word-html-sanitizer"

describe("sanitizeDocxHtmlForRendering", () => {
  it("removes active content and event handlers", () => {
    const dirty =
      '<div onclick="alert(1)"><script>alert(1)</script><p>Safe</p><iframe src="https://evil.test"></iframe></div>'
    const clean = sanitizeDocxHtmlForRendering(dirty)

    expect(clean).not.toContain("onclick")
    expect(clean).not.toContain("<script")
    expect(clean).not.toContain("<iframe")
    expect(clean).toContain("<p>Safe</p>")
  })

  it("blocks remote links and images while preserving local anchors and data images", () => {
    const dirty =
      '<a href="https://evil.test/path">external</a><a href="#section">local</a><img src="https://evil.test/x.png" alt="x"><img src="data:image/png;base64,AAA" alt="safe">'
    const clean = sanitizeDocxHtmlForRendering(dirty)

    expect(clean).not.toContain('href="https://evil.test/path"')
    expect(clean).toContain('href="#section"')
    expect(clean).not.toContain('src="https://evil.test/x.png"')
    expect(clean).toContain('src="data:image/png;base64,AAA"')
  })

  it("removes javascript-like protocols and strips srcset to avoid remote fetches", () => {
    const dirty =
      '<a href="jav&#x61;script:alert(1)">x</a><img srcset="https://evil.test/a.jpg 1x, data:image/png;base64,BBB 2x">'
    const clean = sanitizeDocxHtmlForRendering(dirty)

    expect(clean).not.toContain("javascript")
    expect(clean).not.toContain("evil.test")
    expect(clean).not.toContain("srcset=")
  })
})

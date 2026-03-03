import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 375, height: 812 }

const pagesToCapture = [
  "/",
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/compress-pdf",
  "/tools/reorder-pdf",
  "/tools/extract-pdf",
  "/tools/redact-pdf",
  "/tools/offline-ocr",
  "/tools/privacy-scan",
  "/tools/summarize-pdf",
  "/tools/pdf-qa",
  "/tools/suggest-edits",
  "/tools/convert-pdf",
  "/tools/metadata-purge",
  "/tools/local-signer",
  "/tools/password-breaker",
  "/tools/webgpu-organiser",
  "/tools/batch-engine",
  "/learn",
  "/blog",
  "/about",
  "/privacy",
  "/verify-claims",
]

const screenshotDir = path.join("e2e", "screenshots", "mobile")

const slugFromPath = (pathname: string) => {
  if (pathname === "/") return "home"
  return pathname.replace(/^\/+/, "").replace(/\//g, "-")
}

test.beforeAll(() => {
  fs.mkdirSync(screenshotDir, { recursive: true })
})

for (const pathname of pagesToCapture) {
  test(`mobile screenshot and overflow check: ${pathname}`, async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(pathname, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(600)

    const shotName = `${slugFromPath(pathname)}.png`
    await page.screenshot({
      path: path.join(screenshotDir, shotName),
      fullPage: true,
    })

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(
      scrollWidth,
      `${pathname} has horizontal overflow: scrollWidth=${scrollWidth}, viewport=${MOBILE_VIEWPORT.width}`
    ).toBeLessThanOrEqual(MOBILE_VIEWPORT.width)
  })
}

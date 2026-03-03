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

for (const pathname of pagesToCapture) {
  test(`mobile screenshot and overflow check: ${pathname}`, async ({ page }, testInfo) => {
    const projectScreenshotDir = path.join(screenshotDir, testInfo.project.name)
    fs.mkdirSync(projectScreenshotDir, { recursive: true })

    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(pathname, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(600)

    const shotName = `${slugFromPath(pathname)}.png`
    try {
      await page.screenshot({
        path: path.join(projectScreenshotDir, shotName),
        fullPage: true,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const isWebKitFullPageLimit =
        (testInfo.project.name.includes("webkit") || testInfo.project.name === "mobile-safari") &&
        message.includes("Cannot take screenshot larger than 32767 pixels")

      if (!isWebKitFullPageLimit) {
        throw error
      }

      // WebKit hard-limits screenshot dimensions; take viewport capture as fallback.
      await page.screenshot({
        path: path.join(projectScreenshotDir, shotName),
        fullPage: false,
      })
    }

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(
      scrollWidth,
      `${pathname} has horizontal overflow: scrollWidth=${scrollWidth}, viewport=${MOBILE_VIEWPORT.width}`
    ).toBeLessThanOrEqual(MOBILE_VIEWPORT.width)
  })
}

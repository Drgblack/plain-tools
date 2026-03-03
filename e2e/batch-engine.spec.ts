import { expect, test } from "@playwright/test"

test("batch engine page loads cleanly and is responsive at 375px", async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const notFoundUrls: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })

  page.on("pageerror", (error) => {
    pageErrors.push(error.message)
  })

  page.on("response", (response) => {
    if (response.status() === 404) {
      notFoundUrls.push(response.url())
    }
  })

  await page.addInitScript(() => {
    window.localStorage.setItem("plain-tour-completed", "true")
  })

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/tools/batch-engine")
  await page.waitForLoadState("domcontentloaded")

  const operationSelect = page.locator("#batch-operation")
  await expect(operationSelect).toBeVisible()
  await expect(operationSelect).toContainText("Batch Merge")
  await expect(operationSelect).toContainText("Batch Compress")
  await expect(operationSelect).toContainText("Batch Split")
  await expect(operationSelect).toContainText("Batch Convert to Images")

  const fileInput = page.locator('input[type="file"][accept*="application/pdf"]').first()
  await expect(fileInput).toBeAttached()
  await expect(fileInput).toHaveAttribute("multiple", "")

  const hasHorizontalOverflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth
  })
  expect(hasHorizontalOverflow).toBeFalsy()

  expect(notFoundUrls, `404 responses: ${notFoundUrls.join(" | ")}`).toEqual([])
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join(" | ")}`).toEqual([])
  expect(consoleErrors, `Console errors: ${consoleErrors.join(" | ")}`).toEqual([])
})

import { expect, test } from "@playwright/test"

test("convert PDF page loads cleanly and is responsive at 375px", async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const notFoundUrls: string[] = []
  // WebKit can emit a benign 403 console error from third-party translate widget resources
  // even though tool functionality is unaffected.
  const ignoredConsoleErrorPatterns = [
    /Failed to load resource: the server responded with a status of 403 \(\)/i,
  ]

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
  await page.goto("/tools/convert-pdf")
  await page.waitForLoadState("domcontentloaded")

  const fileInput = page.locator('input[type="file"][accept*="application/pdf"]').first()
  await expect(fileInput).toBeAttached()
  await expect(fileInput).toHaveAttribute("accept", /application\/pdf/)

  const dropzoneButton = page.getByRole("button", { name: /drop a pdf here|click to browse/i }).first()
  await expect(dropzoneButton).toBeVisible()

  const imageMode = page.getByRole("tab", { name: /pdf to images/i })
  const textMode = page.getByRole("tab", { name: /pdf to text/i })
  await expect(imageMode).toBeVisible()
  await expect(textMode).toBeVisible()

  await textMode.click()
  await expect(page.getByText(/Text extraction uses PDF\.js/i)).toBeVisible()
  await imageMode.click()
  await expect(page.getByLabel(/Image format/i)).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth
  })
  expect(hasHorizontalOverflow).toBeFalsy()

  const actionableConsoleErrors = consoleErrors.filter(
    (message) => !ignoredConsoleErrorPatterns.some((pattern) => pattern.test(message))
  )

  expect(notFoundUrls, `404 responses: ${notFoundUrls.join(" | ")}`).toEqual([])
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join(" | ")}`).toEqual([])
  expect(
    actionableConsoleErrors,
    `Console errors: ${actionableConsoleErrors.join(" | ")}`
  ).toEqual([])
})

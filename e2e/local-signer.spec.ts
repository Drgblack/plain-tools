import { expect, test } from "@playwright/test"

test("local signer page loads cleanly and is responsive at 375px", async ({ page }) => {
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
  await page.goto("/tools/local-signer")
  await page.waitForLoadState("domcontentloaded")

  await expect(page.getByRole("tab", { name: /draw/i })).toBeVisible()
  await expect(page.getByRole("tab", { name: /^type$/i })).toBeVisible()
  await expect(page.getByRole("tab", { name: /upload/i })).toBeVisible()

  await expect(page.locator("canvas").first()).toBeVisible()

  await expect(
    page.getByText(/Plain Local Signer produces locally verifiable cryptographic signatures/i)
  ).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth
  })
  expect(hasHorizontalOverflow).toBeFalsy()

  expect(notFoundUrls, `404 responses: ${notFoundUrls.join(" | ")}`).toEqual([])
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join(" | ")}`).toEqual([])
  expect(consoleErrors, `Console errors: ${consoleErrors.join(" | ")}`).toEqual([])
})

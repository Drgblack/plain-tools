import { expect, test } from "@playwright/test"

test("homepage renders hero and tool catalogue, merge card navigates", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Plain/i)
  await expect(page.locator('[data-tour="hero-heading"]')).toBeVisible()

  const toolLinks = page.locator('#tools a[href^="/tools/"]')
  await expect.poll(async () => toolLinks.count()).toBeGreaterThanOrEqual(8)

  await page
    .locator("#tools")
    .getByRole("link", { name: /Open Merge PDFs/i })
    .first()
    .click()

  await expect(page).toHaveURL(/\/tools\/merge-pdf\/?$/)
})


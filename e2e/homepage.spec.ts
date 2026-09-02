import { expect, test } from "@playwright/test"

test("homepage renders hero and tool catalogue, merge card navigates", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Plain/i)
  await expect(page.locator('[data-tour="hero-heading"]')).toBeVisible()
  await expect(page.getByRole("heading", { name: /Start with a common task/i })).toBeVisible()

  const toolLinks = page.locator('#tools a[href^="/tools/"]')
  await expect.poll(async () => toolLinks.count()).toBeGreaterThanOrEqual(6)

  await page
    .locator("#tools")
    .getByRole("link", { name: /Merge PDF/i })
    .first()
    .click()

  await expect(page).toHaveURL(/\/tools\/merge-pdf\/?$/)
})

test("homepage calculators category links to plainfigures", async ({ page }) => {
  await page.goto("/")

  const calculatorsLink = page.getByRole("link", { name: /Calculators/i }).first()
  await expect(calculatorsLink).toHaveAttribute("href", "https://plainfigures.org")
  await expect(calculatorsLink).toHaveAttribute("target", "_blank")
})

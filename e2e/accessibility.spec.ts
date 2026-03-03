import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

type AccessibilityImpact = "minor" | "moderate" | "serious" | "critical" | null

async function checkA11y(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState("networkidle")

  const results = await new AxeBuilder({ page }).analyze()

  if (results.violations.length > 0) {
    const violationSummary = results.violations
      .map((violation) => {
        const impact = violation.impact ?? "none"
        const selectors = violation.nodes
          .flatMap((node) => node.target)
          .map((target) => (Array.isArray(target) ? target.join(" ") : String(target)))
          .join(", ")
        return `[${impact}] ${violation.id}: ${violation.help}\nSelectors: ${selectors}`
      })
      .join("\n\n")

    console.info(`\nA11Y violations for ${path}:\n${violationSummary}\n`)
  }

  const highImpact = results.violations.filter((violation) => {
    const impact = violation.impact as AccessibilityImpact
    return impact === "critical" || impact === "serious"
  })

  expect(
    highImpact,
    `Expected no critical/serious accessibility violations on ${path}`
  ).toHaveLength(0)
}

test.describe("accessibility smoke checks", () => {
  test("homepage", async ({ page }) => {
    await checkA11y(page, "/")
  })

  test("merge pdf page", async ({ page }) => {
    await checkA11y(page, "/tools/merge-pdf")
  })

  test("verify claims page", async ({ page }) => {
    await checkA11y(page, "/verify-claims")
  })

  test("learn page", async ({ page }) => {
    await checkA11y(page, "/learn")
  })
})

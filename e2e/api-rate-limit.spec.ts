import { expect, test } from "@playwright/test"

test("support API enforces rate limit after repeated requests", async ({ request }) => {
  const statuses: number[] = []

  for (let i = 0; i < 11; i += 1) {
    const response = await request.post("/api/support", {
      failOnStatusCode: false,
      data: {
        name: "Playwright E2E",
        email: "invalid-email",
        message: `Rate limit test request ${i + 1}`,
        website: "",
      },
    })

    statuses.push(response.status())
  }

  expect(
    statuses.some((status) => status === 429),
    `Expected at least one HTTP 429 response, got: ${statuses.join(", ")}`
  ).toBeTruthy()
})

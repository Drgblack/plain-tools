import { expect, test, type APIRequestContext } from "@playwright/test"

const headerLinks = [
  "/tools",
  "/learn",
  "/labs",
  "/blog",
  "/privacy",
  "/about",
]

const footerLinks = [
  "/tools/merge-pdf",
  "/tools/redact-pdf",
  "/tools/summarize-pdf",
  "/tools/offline-ocr",
  "/tools",
  "/learn",
  "/blog",
  "/terms",
  "/privacy",
  "/verify-claims",
  "/support",
]

const assertLinksResolve = async (
  request: APIRequestContext,
  paths: string[]
) => {
  for (const path of paths) {
    let response = await request.fetch(path, {
      method: "HEAD",
      failOnStatusCode: false,
      maxRedirects: 10,
      timeout: 20_000,
    })

    if (response.status() === 405) {
      response = await request.get(path, {
        failOnStatusCode: false,
        maxRedirects: 10,
        timeout: 20_000,
      })
    }

    expect(
      response.status() < 400,
      `${path} returned HTTP ${response.status()}`
    ).toBeTruthy()
  }
}

test("header nav links resolve", async ({ request }) => {
  test.setTimeout(180_000)
  await assertLinksResolve(request, headerLinks)
})

test("footer links resolve", async ({ request }) => {
  test.setTimeout(240_000)
  await assertLinksResolve(request, footerLinks)
})


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
  "/tools/convert-pdf",
  "/tools/metadata-purge",
  "/tools/local-signer",
  "/tools/password-breaker",
  "/tools/webgpu-organiser",
  "/tools/batch-engine",
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

const newToolRoutes = [
  "/tools/convert-pdf",
  "/tools/metadata-purge",
  "/tools/local-signer",
  "/tools/password-breaker",
  "/tools/webgpu-organiser",
  "/tools/batch-engine",
]

const aliasRedirects = [
  {
    alias: "/tools/plain-local-cryptographic-signer",
    canonical: "/tools/local-signer",
  },
  {
    alias: "/tools/plain-metadata-purge",
    canonical: "/tools/metadata-purge",
  },
  {
    alias: "/tools/plain-password-breaker",
    canonical: "/tools/password-breaker",
  },
  {
    alias: "/tools/plain-webgpu-page-organiser",
    canonical: "/tools/webgpu-organiser",
  },
  {
    alias: "/tools/plain-hardware-accelerated-batch-engine",
    canonical: "/tools/batch-engine",
  },
]

const comparisonRedirects = [
  {
    alias: "/comparisons",
    canonical: "/compare",
  },
  {
    alias: "/comparisons/plain-vs-ilovepdf",
    canonical: "/compare/plain-vs-ilovepdf",
  },
  {
    alias: "/comparisons/plain-vs-online-pdf-tools",
    canonical: "/compare/offline-vs-online-pdf-tools",
  },
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
      timeout: 60_000,
    })

    if (response.status() === 405) {
      response = await request.get(path, {
        failOnStatusCode: false,
        maxRedirects: 10,
        timeout: 60_000,
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

test("new tool routes resolve", async ({ request }) => {
  test.setTimeout(240_000)
  await assertLinksResolve(request, newToolRoutes)
})

test("alias tool routes redirect to canonical URLs", async ({ request }) => {
  test.setTimeout(240_000)

  for (const { alias, canonical } of aliasRedirects) {
    const aliasResponse = await request.get(alias, {
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 60_000,
    })

    expect(
      aliasResponse.status() >= 300 && aliasResponse.status() < 400,
      `${alias} did not return a redirect status`
    ).toBeTruthy()

    const location = aliasResponse.headers()["location"]
    expect(location, `${alias} is missing location header`).toBeTruthy()
    expect(location).toBe(canonical)

    const canonicalResponse = await request.get(canonical, {
      failOnStatusCode: false,
      maxRedirects: 10,
      timeout: 60_000,
    })

    expect(
      canonicalResponse.status(),
      `${canonical} returned HTTP ${canonicalResponse.status()}`
    ).toBe(200)
  }
})

test("comparison routes redirect to canonical /compare URLs", async ({ request }) => {
  test.setTimeout(120_000)

  for (const { alias, canonical } of comparisonRedirects) {
    const aliasResponse = await request.get(alias, {
      failOnStatusCode: false,
      maxRedirects: 0,
      timeout: 60_000,
    })

    expect(
      aliasResponse.status() >= 300 && aliasResponse.status() < 400,
      `${alias} did not return a redirect status`
    ).toBeTruthy()

    const location = aliasResponse.headers()["location"]
    expect(location, `${alias} is missing location header`).toBeTruthy()
    expect(location).toBe(canonical)

    const canonicalResponse = await request.get(canonical, {
      failOnStatusCode: false,
      maxRedirects: 10,
      timeout: 60_000,
    })

    expect(
      canonicalResponse.status(),
      `${canonical} returned HTTP ${canonicalResponse.status()}`
    ).toBe(200)
  }
})

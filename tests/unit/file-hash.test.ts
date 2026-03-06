import { webcrypto } from "node:crypto"
import { describe, expect, it } from "vitest"

import { bytesToHex, digestHex, md5Digest } from "@/lib/file-hash"

const sample = new TextEncoder().encode("abc")

describe("file hash helpers", () => {
  it("computes MD5 for known input", () => {
    const digest = md5Digest(sample)
    expect(bytesToHex(digest)).toBe("900150983cd24fb0d6963f7d28e17f72")
  })

  it("computes SHA-256 for known input", async () => {
    const digest = await digestHex(sample, "SHA-256", webcrypto.subtle)
    expect(digest).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
  })

  it("computes SHA-1 and SHA-512 for known input", async () => {
    const sha1 = await digestHex(sample, "SHA-1", webcrypto.subtle)
    const sha512 = await digestHex(sample, "SHA-512", webcrypto.subtle)

    expect(sha1).toBe("a9993e364706816aba3e25717850c26c9cd0d89d")
    expect(sha512).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a" +
        "2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
    )
  })
})

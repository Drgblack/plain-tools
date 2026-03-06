export type SupportedHashAlgorithm = "SHA-256" | "MD5" | "SHA-1" | "SHA-512"

const leftRotate = (value: number, amount: number) =>
  ((value << amount) | (value >>> (32 - amount))) >>> 0

const MD5_SHIFT_AMOUNTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
]

const MD5_TABLE = Array.from({ length: 64 }, (_, index) =>
  Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0
)

export const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")

export function md5Digest(bytes: Uint8Array) {
  const messageLength = bytes.length
  const paddedLength = (((messageLength + 8) >>> 6) + 1) * 64
  const padded = new Uint8Array(paddedLength)
  padded.set(bytes)
  padded[messageLength] = 0x80

  const bitLengthLow = (messageLength << 3) >>> 0
  const bitLengthHigh = (messageLength >>> 29) >>> 0
  const view = new DataView(padded.buffer)
  view.setUint32(paddedLength - 8, bitLengthLow, true)
  view.setUint32(paddedLength - 4, bitLengthHigh, true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = new Uint32Array(16)
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4, true)
    }

    let a = a0
    let b = b0
    let c = c0
    let d = d0

    for (let index = 0; index < 64; index += 1) {
      let f = 0
      let g = 0

      if (index < 16) {
        f = (b & c) | (~b & d)
        g = index
      } else if (index < 32) {
        f = (d & b) | (~d & c)
        g = (5 * index + 1) % 16
      } else if (index < 48) {
        f = b ^ c ^ d
        g = (3 * index + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * index) % 16
      }

      const mixed = (f + a + MD5_TABLE[index] + words[g]) >>> 0
      a = d
      d = c
      c = b
      b = (b + leftRotate(mixed, MD5_SHIFT_AMOUNTS[index])) >>> 0
    }

    a0 = (a0 + a) >>> 0
    b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0
    d0 = (d0 + d) >>> 0
  }

  const output = new Uint8Array(16)
  const outputView = new DataView(output.buffer)
  outputView.setUint32(0, a0, true)
  outputView.setUint32(4, b0, true)
  outputView.setUint32(8, c0, true)
  outputView.setUint32(12, d0, true)
  return output
}

export async function digestHex(
  bytes: Uint8Array,
  algorithm: SupportedHashAlgorithm,
  subtle: SubtleCrypto | null | undefined = globalThis.crypto?.subtle
) {
  if (algorithm === "MD5") {
    return bytesToHex(md5Digest(bytes))
  }

  if (!subtle) {
    throw new Error("Your browser does not support SubtleCrypto hashing.")
  }

  const digestBuffer = await subtle.digest(algorithm, bytes)
  return bytesToHex(new Uint8Array(digestBuffer))
}

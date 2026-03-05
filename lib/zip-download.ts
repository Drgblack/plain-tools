import { zipSync } from "fflate"

export type ZipEntry = { name: string; data: Uint8Array }

export function makeZip(entries: ZipEntry[]): Uint8Array {
  const payload: Record<string, Uint8Array> = {}
  for (const entry of entries) {
    payload[entry.name] = entry.data
  }
  return zipSync(payload, { level: 6 })
}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer())
}

export function downloadZip(zipBytes: Uint8Array, filename: string): void {
  const blob = new Blob([zipBytes], { type: "application/zip" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}


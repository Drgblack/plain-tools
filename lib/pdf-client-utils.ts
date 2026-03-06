"use client"

import { getPdfJs } from "@/lib/pdfjs-loader"

export const MAX_LOCAL_FILE_BYTES = 200 * 1024 * 1024

/**
 * Returns true when the file appears to be a PDF by MIME type or extension.
 */
export const isPdfLikeFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

/**
 * Formats bytes into a compact human-readable string for tool status UIs.
 */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

/**
 * Guards client-side processing against trivially unsafe file sizes.
 * This is a local stability and DoS-resilience check, not a server control.
 */
export const ensureSafeLocalFileSize = (
  file: Pick<File, "name" | "size">,
  maxBytes = MAX_LOCAL_FILE_BYTES
) => {
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new Error("Selected file is empty or unreadable.")
  }

  if (file.size > maxBytes) {
    throw new Error(
      `"${file.name}" exceeds the local processing safety limit (${formatFileSize(
        maxBytes
      )}).`
    )
  }
}

/**
 * Reads page count locally via pdf.js without uploading file bytes.
 */
export const countPdfPages = async (file: File) => {
  const pdfjs = await getPdfJs()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const pdf = await loadingTask.promise
    return pdf.numPages
  } finally {
    await loadingTask.destroy()
  }
}

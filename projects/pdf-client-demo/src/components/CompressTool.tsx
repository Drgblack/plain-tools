import { ChangeEvent, useState } from "react"
import { FileDropzone } from "./FileDropzone"
import { compressPdfFile, type CompressionLevel } from "../lib/pdf"
import { formatBytes, isPdfFile } from "../lib/format"

type CompressState = "idle" | "working" | "done" | "error"

const triggerDownload = (bytes: Uint8Array, filename: string) => {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function CompressTool() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<CompressionLevel>("medium")
  const [state, setState] = useState<CompressState>("idle")
  const [message, setMessage] = useState("")
  const [resultSize, setResultSize] = useState<number | null>(null)

  const onFileSelected = (files: File[]) => {
    const next = files[0]
    if (!next) return
    if (!isPdfFile(next)) {
      setFile(null)
      setState("error")
      setMessage("Only PDF files are supported.")
      return
    }

    setFile(next)
    setState("idle")
    setMessage("")
    setResultSize(null)
  }

  const onCompress = async () => {
    if (!file) {
      setState("error")
      setMessage("Select a PDF file first.")
      return
    }

    try {
      setState("working")
      setMessage("Optimising PDF locally...")
      const bytes = await compressPdfFile(file, level)
      setResultSize(bytes.byteLength)
      triggerDownload(bytes, `${file.name.replace(/\.pdf$/i, "")}-optimised.pdf`)
      setState("done")
      setMessage("Optimisation complete.")
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : "Compression failed.")
    }
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
        Best-effort offline optimisation. Complex PDFs may not shrink significantly. Files never
        leave your device.
      </p>

      <FileDropzone
        id="compress-pdf-input"
        description="Select one PDF file"
        onFilesSelected={onFileSelected}
      />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
        <div className="rounded-xl border border-border px-4 py-3">
          <p className="text-sm font-medium">Compression level</p>
          <select
            value={level}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setLevel(event.currentTarget.value as CompressionLevel)
            }
            className="focus-ring mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="light">Light (metadata cleanup)</option>
            <option value="medium">Medium (balanced optimisation)</option>
            <option value="strong">Strong (aggressive structure optimisation)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onCompress}
          disabled={state === "working"}
          className="focus-ring h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "working" ? "Optimising..." : "Compress PDF"}
        </button>
      </div>

      {file ? (
        <div className="rounded-xl border border-border px-4 py-3 text-sm">
          <p className="font-medium">Selected file</p>
          <p className="mt-1 text-muted">{file.name}</p>
          <p className="mt-1 text-muted">Original size: {formatBytes(file.size)}</p>
          {resultSize !== null ? (
            <p className="mt-1 text-muted">
              Optimised size: {formatBytes(resultSize)} ({" "}
              {Math.max(0, ((1 - resultSize / file.size) * 100)).toFixed(1)}% smaller)
            </p>
          ) : null}
        </div>
      ) : null}

      {message ? (
        <p
          className={`text-sm ${state === "error" ? "text-red-500" : "text-muted"}`}
          role={state === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

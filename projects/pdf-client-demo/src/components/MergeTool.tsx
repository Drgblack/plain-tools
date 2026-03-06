import { useMemo, useState } from "react"
import { FileDropzone } from "./FileDropzone"
import { formatBytes, isPdfFile } from "../lib/format"
import { mergePdfFiles } from "../lib/pdf"

type MergeState = "idle" | "working" | "done" | "error"

const triggerDownload = (bytes: Uint8Array, filename: string, mime: string) => {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function MergeTool() {
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<MergeState>("idle")
  const [message, setMessage] = useState<string>("")

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files]
  )

  const addFiles = (incoming: File[]) => {
    const pdfs = incoming.filter(isPdfFile)
    if (pdfs.length !== incoming.length) {
      setState("error")
      setMessage("Only PDF files are supported.")
      return
    }
    setFiles((prev) => [...prev, ...pdfs])
    setState("idle")
    setMessage("")
  }

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= files.length) return
    setFiles((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  const onMerge = async () => {
    if (files.length < 2) {
      setState("error")
      setMessage("Add at least two PDFs to merge.")
      return
    }

    try {
      setState("working")
      setMessage("Merging files locally...")
      const bytes = await mergePdfFiles(files)
      triggerDownload(bytes, "merged.pdf", "application/pdf")
      setState("done")
      setMessage(`Merged ${files.length} files successfully.`)
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : "Merge failed.")
    }
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
        Best-effort offline merge. Files never leave your device.
      </p>

      <FileDropzone
        id="merge-pdf-input"
        multiple
        description="Select two or more PDF files"
        onFilesSelected={addFiles}
      />

      {files.length > 0 ? (
        <div className="rounded-xl border border-border">
          <div className="border-b border-border px-4 py-3 text-sm text-muted">
            {files.length} file(s), {formatBytes(totalSize)} total
          </div>
          <ul className="divide-y divide-border">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-2 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => moveFile(index, -1)}
                  disabled={index === 0}
                  className="focus-ring rounded border border-border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveFile(index, 1)}
                  disabled={index === files.length - 1}
                  className="focus-ring rounded border border-border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="focus-ring rounded border border-red-500/40 px-2 py-1 text-xs text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onMerge}
          disabled={state === "working"}
          className="focus-ring rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "working" ? "Merging..." : "Merge PDFs"}
        </button>
        <button
          type="button"
          onClick={() => {
            setFiles([])
            setState("idle")
            setMessage("")
          }}
          className="focus-ring rounded-lg border border-border px-4 py-2 text-sm"
        >
          Clear
        </button>
        {message ? (
          <p
            className={`text-sm ${state === "error" ? "text-red-500" : "text-muted"}`}
            role={state === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  )
}

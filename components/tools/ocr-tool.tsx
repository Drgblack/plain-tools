"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, ScanText, Trash2, UploadCloud, X } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { plainOfflineOCR } from "@/lib/pdf-batch-engine"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type QueuedPdfFile = {
  id: string
  file: File
}

type OcrResult = {
  id: string
  sourceName: string
  outputName: string
  bytes: Uint8Array
  extractedText: string
  pageCount: number
}

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }
  return pdfJsModulePromise
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const buildOutputName = (name: string) => {
  const base = name.replace(/\.pdf$/i, "")
  return `${base}-ocred.pdf`
}

const extractTextFromPdfBytes = async (bytes: Uint8Array) => {
  const pdfjs = await getPdfJs()
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const sourcePdf = await loadingTask.promise
    const pageTexts: string[] = []

    for (let index = 0; index < sourcePdf.numPages; index++) {
      const page = await sourcePdf.getPage(index + 1)
      const content = await page.getTextContent()
      const text = content.items
        .map((item) =>
          typeof (item as { str?: string }).str === "string"
            ? ((item as { str?: string }).str as string)
            : ""
        )
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()

      pageTexts.push(text)
    }

    const extractedText = pageTexts
      .map((text, index) => `Page ${index + 1}\n${text}`)
      .join("\n\n")
      .trim()

    return {
      extractedText,
      pageCount: sourcePdf.numPages,
    }
  } finally {
    await loadingTask.destroy()
  }
}

const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export default function OcrTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<QueuedPdfFile[]>([])
  const [results, setResults] = useState<OcrResult[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Add scanned/image-based PDFs to run OCR locally.")

  const totalInputBytes = useMemo(
    () => files.reduce((acc, item) => acc + item.file.size, 0),
    [files]
  )

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const all = Array.from(incoming)
    const pdfs = all.filter(isPdfFile)
    const rejectedCount = all.length - pdfs.length

    if (rejectedCount > 0) {
      toast.error("Only PDF files are supported.")
    }

    if (!pdfs.length) return

    setResults([])
    setProgress(0)
    setStatus("Files queued for OCR.")
    setFiles((previous) => [
      ...previous,
      ...pdfs.map((file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    ])
  }, [])

  const clearQueue = useCallback(() => {
    setFiles([])
    setResults([])
    setProgress(0)
    setStatus("Add scanned/image-based PDFs to run OCR locally.")
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((previous) => previous.filter((item) => item.id !== id))
  }, [])

  const runBatchOcr = useCallback(async () => {
    if (!files.length) {
      toast.error("Add at least one PDF first.")
      return
    }

    setIsLoading(true)
    setResults([])
    setProgress(2)
    setStatus("Initialising local OCR pipeline...")

    const nextResults: OcrResult[] = []
    let failureCount = 0
    let noTextCount = 0

    for (let index = 0; index < files.length; index++) {
      const entry = files[index]
      const fileLabel = `${index + 1}/${files.length}`

      try {
        const ocrBytes = await plainOfflineOCR(entry.file, (fileProgress, message) => {
          const overall = Math.round(((index + fileProgress / 100) / files.length) * 100)
          setProgress(Math.max(2, Math.min(99, overall)))
          setStatus(`${message} (${fileLabel})`)
        })

        const { extractedText, pageCount } = await extractTextFromPdfBytes(ocrBytes)
        if (!extractedText.trim()) {
          noTextCount += 1
          toast.error(`No text detected after OCR: ${entry.file.name}`)
        }

        nextResults.push({
          id: entry.id,
          sourceName: entry.file.name,
          outputName: buildOutputName(entry.file.name),
          bytes: ocrBytes,
          extractedText,
          pageCount,
        })
      } catch (error) {
        failureCount += 1
        const message =
          error instanceof Error
            ? error.message
            : `OCR failed for ${entry.file.name}`
        toast.error(message)
      }
    }

    setResults(nextResults)
    setProgress(100)

    if (!nextResults.length) {
      setStatus("OCR failed for all files.")
    } else {
      setStatus(
        `OCR complete. ${nextResults.length} output file(s) ready${
          failureCount ? `, ${failureCount} failed` : ""
        }${noTextCount ? `, ${noTextCount} with no detected text` : ""}.`
      )
      toast.success("OCR processing complete.")
    }

    setIsLoading(false)
  }, [files])

  const canProcess = files.length > 0 && !isLoading

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            addFiles(event.target.files)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              if (event.dataTransfer.files.length) {
                addFiles(event.dataTransfer.files)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop PDF files here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Single or batch OCR for scanned/image-based PDFs. Processing stays local.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Offline OCR Pipeline</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium text-foreground">Queue ({files.length})</p>
              <p className="text-xs text-muted-foreground">{formatBytes(totalInputBytes)}</p>
            </div>

            {files.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No PDFs queued yet.
              </div>
            ) : (
              <ul className="divide-y">
                {files.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.file.name}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatBytes(item.file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeFile(item.id)}
                      disabled={isLoading}
                      aria-label={`Remove ${item.file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isLoading ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" onClick={runBatchOcr} disabled={!canProcess}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                OCR in progress...
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4" />
                OCR
              </>
            )}
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={clearQueue} disabled={isLoading}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </CardFooter>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">OCR Outputs</CardTitle>
            <CardDescription>Download searchable PDFs and optional extracted text.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((result) => (
                <div key={result.id} className="rounded-lg border p-3">
                  <p className="truncate text-sm font-medium text-foreground">{result.sourceName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.pageCount} page{result.pageCount === 1 ? "" : "s"} •{" "}
                    {formatBytes(result.bytes.byteLength)}
                  </p>

                  <div className="mt-3 flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        triggerBlobDownload(
                          new Blob([result.bytes], { type: "application/pdf" }),
                          result.outputName
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                      Download {results.length === 1 ? "ocred.pdf" : result.outputName}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!result.extractedText.trim()) {
                          toast.error(`No text detected in ${result.sourceName}`)
                          return
                        }
                        const textName = result.outputName.replace(/\.pdf$/i, ".txt")
                        triggerBlobDownload(
                          new Blob([result.extractedText], {
                            type: "text/plain;charset=utf-8",
                          }),
                          textName
                        )
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Export Text
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

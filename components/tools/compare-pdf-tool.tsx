"use client"

import Image from "next/image"
import { Download, Eye, EyeOff, FileDiff, Loader2, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { ensureSafeLocalFileSize, formatFileSize, isPdfLikeFile } from "@/lib/pdf-client-utils"
import { getPdfJs } from "@/lib/pdfjs-loader"

type TextItemLike = {
  str?: string
  hasEOL?: boolean
  transform?: number[]
}

type RawOp =
  | { type: "same"; left: string; right: string }
  | { type: "remove"; left: string }
  | { type: "add"; right: string }

type DiffRow = {
  kind: "same" | "remove" | "add" | "change"
  left: string
  right: string
}

type PageDiff = {
  pageNumber: number
  rows: DiffRow[]
  changeCount: number
  hasChanges: boolean
}

type CompareResult = {
  pages: PageDiff[]
  totalPages: number
  changedPages: number
  totalChanges: number
}

type PreviewImage = {
  dataUrl: string
  width: number
  height: number
}

const MAX_PDF_BYTES = 200 * 1024 * 1024

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")

const normalizeLine = (value: string) => value.replace(/\s+/g, " ").trim()

const buildLcs = (left: string[], right: string[]) => {
  const table = Array.from({ length: left.length + 1 }, () => Array.from({ length: right.length + 1 }, () => 0))

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      if (left[i - 1] === right[j - 1]) {
        table[i]![j] = (table[i - 1]![j - 1] ?? 0) + 1
      } else {
        table[i]![j] = Math.max(table[i - 1]![j] ?? 0, table[i]![j - 1] ?? 0)
      }
    }
  }

  return table
}

const buildLineOps = (left: string[], right: string[]) => {
  const table = buildLcs(left, right)
  const ops: RawOp[] = []
  let i = left.length
  let j = right.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && left[i - 1] === right[j - 1]) {
      ops.unshift({ type: "same", left: left[i - 1] ?? "", right: right[j - 1] ?? "" })
      i -= 1
      j -= 1
      continue
    }

    const top = i > 0 ? (table[i - 1]![j] ?? 0) : -1
    const side = j > 0 ? (table[i]![j - 1] ?? 0) : -1

    if (i > 0 && (j === 0 || top >= side)) {
      ops.unshift({ type: "remove", left: left[i - 1] ?? "" })
      i -= 1
    } else if (j > 0) {
      ops.unshift({ type: "add", right: right[j - 1] ?? "" })
      j -= 1
    }
  }

  return ops
}

const buildRows = (ops: RawOp[]) => {
  const rows: DiffRow[] = []
  let index = 0

  while (index < ops.length) {
    const current = ops[index]
    if (!current) {
      index += 1
      continue
    }

    if (current.type === "same") {
      rows.push({ kind: "same", left: current.left, right: current.right })
      index += 1
      continue
    }

    const removed: string[] = []
    const added: string[] = []

    while (index < ops.length && ops[index]?.type !== "same") {
      const op = ops[index]
      if (!op) {
        index += 1
        continue
      }
      if (op.type === "remove") removed.push(op.left)
      if (op.type === "add") added.push(op.right)
      index += 1
    }

    const length = Math.max(removed.length, added.length)
    for (let i = 0; i < length; i += 1) {
      const left = removed[i] ?? ""
      const right = added[i] ?? ""
      if (left && right) {
        rows.push({ kind: "change", left, right })
      } else if (left) {
        rows.push({ kind: "remove", left, right: "" })
      } else {
        rows.push({ kind: "add", left: "", right })
      }
    }
  }

  return rows
}

const extractLines = (items: TextItemLike[]) => {
  const tokens = items
    .map((item, idx) => {
      const text = normalizeLine(item.str ?? "")
      if (!text) return null
      return {
        text,
        x: Number(item.transform?.[4] ?? 0),
        y: Number(item.transform?.[5] ?? 0),
        hasEOL: Boolean(item.hasEOL),
        idx,
      }
    })
    .filter((item): item is { text: string; x: number; y: number; hasEOL: boolean; idx: number } => Boolean(item))

  tokens.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 1.5) return b.y - a.y
    if (Math.abs(a.x - b.x) > 1.5) return a.x - b.x
    return a.idx - b.idx
  })

  const lines: string[] = []
  let current: string[] = []
  let currentY: number | null = null

  for (const token of tokens) {
    const newLine = currentY === null || Math.abs(token.y - currentY) > 2.5 || token.hasEOL
    if (newLine && current.length > 0) {
      lines.push(normalizeLine(current.join(" ")))
      current = []
    }

    current.push(token.text)
    currentY = token.y

    if (token.hasEOL) {
      lines.push(normalizeLine(current.join(" ")))
      current = []
      currentY = null
    }
  }

  if (current.length > 0) {
    lines.push(normalizeLine(current.join(" ")))
  }

  return lines.filter(Boolean)
}

async function extractPdfTextPages(file: File, report: (progress: number, status: string) => void, label: string) {
  const pdfjs = await getPdfJs()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const task = pdfjs.getDocument({ data: bytes, disableAutoFetch: true, disableRange: true, disableStream: true })

  try {
    const doc = await task.promise
    const pages: string[] = []
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber)
      const content = await page.getTextContent()
      const lines = extractLines(content.items as TextItemLike[])
      pages.push(lines.join("\n"))
      report(Math.round((pageNumber / doc.numPages) * 100), `${label}: extracted page ${pageNumber} of ${doc.numPages}...`)
    }
    return pages
  } finally {
    await task.destroy()
  }
}

async function renderPreview(file: File, pageNumber: number): Promise<{ preview: PreviewImage | null; totalPages: number }> {
  const pdfjs = await getPdfJs()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const task = pdfjs.getDocument({ data: bytes, disableAutoFetch: true, disableRange: true, disableStream: true })

  try {
    const doc = await task.promise
    if (pageNumber > doc.numPages) {
      return { preview: null, totalPages: doc.numPages }
    }

    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 0.42 })
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.floor(viewport.width))
    canvas.height = Math.max(1, Math.floor(viewport.height))

    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not create preview canvas.")

    await page.render({ canvasContext: context, viewport }).promise

    return {
      totalPages: doc.numPages,
      preview: {
        dataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
      },
    }
  } finally {
    await task.destroy()
  }
}

const reportRows = (rows: DiffRow[]) =>
  rows
    .map((row) => {
      if (row.kind === "same") {
        return `<tr><td class=\"same\">${escapeHtml(row.left || "-")}</td><td class=\"same\">${escapeHtml(row.right || "-")}</td></tr>`
      }
      if (row.kind === "remove") {
        return `<tr><td class=\"remove\">${escapeHtml(row.left || "-")}</td><td class=\"empty\">-</td></tr>`
      }
      if (row.kind === "add") {
        return `<tr><td class=\"empty\">-</td><td class=\"add\">${escapeHtml(row.right || "-")}</td></tr>`
      }
      return `<tr><td class=\"remove\">${escapeHtml(row.left || "-")}</td><td class=\"add\">${escapeHtml(row.right || "-")}</td></tr>`
    })
    .join("")

const makeReportHtml = (result: CompareResult, leftFile: File, rightFile: File) => {
  const sections = result.pages
    .map(
      (page) => `<section>
<h3>Page ${page.pageNumber}${page.hasChanges ? " (changed)" : " (no text changes)"}</h3>
<p>${page.changeCount} change block${page.changeCount === 1 ? "" : "s"}</p>
<table><thead><tr><th>PDF A</th><th>PDF B</th></tr></thead><tbody>${reportRows(page.rows)}</tbody></table>
</section>`
    )
    .join("\n")

  return `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/><title>PDF Compare Report</title><style>
body{font-family:Arial,sans-serif;margin:20px;color:#111} h1{font-size:24px} h3{margin-top:24px} table{width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #ddd} th,td{border:1px solid #ddd;padding:8px;font-size:13px;vertical-align:top} th{background:#f3f4f6} .same{background:#fff} .remove{background:#fee2e2;color:#7f1d1d} .add{background:#dcfce7;color:#14532d} .empty{background:#f9fafb;color:#6b7280;font-style:italic}
</style></head><body>
<h1>Compare PDF Files Report</h1>
<p>Generated: ${escapeHtml(new Date().toISOString())}</p>
<p>PDF A: ${escapeHtml(leftFile.name)}</p>
<p>PDF B: ${escapeHtml(rightFile.name)}</p>
<p>${result.changedPages} changed page${result.changedPages === 1 ? "" : "s"} of ${result.totalPages}. ${result.totalChanges} change block${result.totalChanges === 1 ? "" : "s"}.</p>
${sections}
<p>Generated locally in your browser. No files were uploaded.</p>
</body></html>`
}

export default function ComparePdfTool() {
  const [leftFile, setLeftFile] = useState<File | null>(null)
  const [rightFile, setRightFile] = useState<File | null>(null)
  const [status, setStatus] = useState("Upload two PDF files to compare extracted text changes.")
  const [isComparing, setIsComparing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const [viewMode, setViewMode] = useState<"side" | "diff">("side")
  const [showPreview, setShowPreview] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState("")
  const [leftPreview, setLeftPreview] = useState<PreviewImage | null>(null)
  const [rightPreview, setRightPreview] = useState<PreviewImage | null>(null)
  const [leftPageCount, setLeftPageCount] = useState<number | null>(null)
  const [rightPageCount, setRightPageCount] = useState<number | null>(null)

  const setValidatedFile = (file: File, side: "left" | "right") => {
    try {
      if (!isPdfLikeFile(file)) {
        toast.error("Please upload a PDF file.")
        return
      }
      ensureSafeLocalFileSize(file, MAX_PDF_BYTES)
      if (side === "left") setLeftFile(file)
      if (side === "right") setRightFile(file)
      setResult(null)
      setProgress(0)
      setSelectedPage(1)
      setShowPreview(false)
      setStatus(`Ready to compare ${side === "left" ? "first" : "second"} file.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load this PDF."
      toast.error(message)
      setStatus(message)
    }
  }

  const canCompare = Boolean(leftFile && rightFile && !isComparing)

  const compareFiles = async () => {
    if (!leftFile || !rightFile) return

    setIsComparing(true)
    setResult(null)
    setProgress(2)
    setStatus("Extracting text from first PDF...")

    try {
      const leftPages = await extractPdfTextPages(leftFile, (p, s) => {
        setProgress(Math.round(p * 0.45))
        setStatus(s)
      }, "First PDF")

      const rightPages = await extractPdfTextPages(rightFile, (p, s) => {
        setProgress(45 + Math.round(p * 0.45))
        setStatus(s)
      }, "Second PDF")

      const totalPages = Math.max(leftPages.length, rightPages.length)
      const pages: PageDiff[] = []
      let totalChanges = 0

      for (let index = 0; index < totalPages; index += 1) {
        const leftLines = (leftPages[index] ?? "").split(/\r?\n/).map(normalizeLine).filter(Boolean)
        const rightLines = (rightPages[index] ?? "").split(/\r?\n/).map(normalizeLine).filter(Boolean)
        const ops = buildLineOps(leftLines, rightLines)
        const rows = buildRows(ops)
        const changeCount = rows.filter((row) => row.kind !== "same").length
        totalChanges += changeCount

        pages.push({
          pageNumber: index + 1,
          rows,
          changeCount,
          hasChanges: changeCount > 0,
        })

        setProgress(90 + Math.round(((index + 1) / totalPages) * 10))
      }

      const changedPages = pages.filter((page) => page.hasChanges).length
      setResult({ pages, totalPages, changedPages, totalChanges })
      setSelectedPage(1)
      setViewMode("side")
      setStatus(
        changedPages === 0
          ? "No text differences detected in extracted content."
          : `Found changes on ${changedPages} of ${totalPages} pages.`
      )
      toast.success("Comparison complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Comparison failed."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsComparing(false)
      setProgress(100)
    }
  }

  useEffect(() => {
    if (!showPreview || !leftFile || !rightFile || !result) {
      setLeftPreview(null)
      setRightPreview(null)
      setPreviewError("")
      setIsPreviewLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setIsPreviewLoading(true)
      setPreviewError("")
      try {
        const [left, right] = await Promise.all([
          renderPreview(leftFile, selectedPage),
          renderPreview(rightFile, selectedPage),
        ])
        if (cancelled) return
        setLeftPreview(left.preview)
        setRightPreview(right.preview)
        setLeftPageCount(left.totalPages)
        setRightPageCount(right.totalPages)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : "Could not render preview."
        setPreviewError(message)
      } finally {
        if (!cancelled) setIsPreviewLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [leftFile, rightFile, result, selectedPage, showPreview])

  const selectedResult = useMemo(() => {
    if (!result) return null
    return result.pages.find((page) => page.pageNumber === selectedPage) ?? null
  }, [result, selectedPage])

  const downloadReport = () => {
    if (!result || !leftFile || !rightFile) return
    try {
      const html = makeReportHtml(result, leftFile, rightFile)
      const blob = new Blob([html], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `pdf-compare-report-${Date.now()}.html`
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      notifyLocalDownloadSuccess()
      toast.success("Report downloaded.")
    } catch {
      toast.error("Could not create report file.")
    }
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Offline text-based PDF diff</CardTitle>
          <CardDescription>
            Compare extracted text from two PDFs locally. Highlighted changes stay in your browser, with no upload step.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose two PDFs</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">PDF A (base)</p>
              <PdfFileDropzone
                accept="application/pdf"
                disabled={isComparing}
                title="Drop first PDF"
                subtitle="Base version"
                onFilesSelected={(files) => {
                  const selected = files[0]
                  if (selected) setValidatedFile(selected, "left")
                }}
              />
              {leftFile ? (
                <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                  <p className="font-medium text-foreground">{leftFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(leftFile.size)}</p>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">PDF B (updated)</p>
              <PdfFileDropzone
                accept="application/pdf"
                disabled={isComparing}
                title="Drop second PDF"
                subtitle="Updated version"
                onFilesSelected={(files) => {
                  const selected = files[0]
                  if (selected) setValidatedFile(selected, "right")
                }}
              />
              {rightFile ? (
                <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                  <p className="font-medium text-foreground">{rightFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(rightFile.size)}</p>
                </div>
              ) : null}
            </div>
          </div>

          {(isComparing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isComparing ? "Comparing" : "Ready"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={!canCompare} onClick={() => void compareFiles()}>
              {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDiff className="h-4 w-4" />}
              Compare
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isComparing}
              onClick={() => {
                setLeftFile(null)
                setRightFile(null)
                setResult(null)
                setSelectedPage(1)
                setProgress(0)
                setShowPreview(false)
                setStatus("Upload two PDF files to compare extracted text changes.")
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison summary</CardTitle>
            <CardDescription>
              {result.changedPages} page{result.changedPages === 1 ? "" : "s"} changed out of {result.totalPages}. {result.totalChanges} change block{result.totalChanges === 1 ? "" : "s"} detected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProcessedLocallyBadge />

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button type="button" size="sm" variant={showPreview ? "default" : "outline"} onClick={() => setShowPreview((value) => !value)}>
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? "Hide visual preview" : "Show visual preview"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.pages.map((page) => (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => setSelectedPage(page.pageNumber)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selectedPage === page.pageNumber
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-card/50 text-muted-foreground hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  Page {page.pageNumber}
                  {page.hasChanges ? " • changed" : ""}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={viewMode === "side" ? "default" : "outline"} onClick={() => setViewMode("side")}>Side-by-side</Button>
              <Button type="button" size="sm" variant={viewMode === "diff" ? "default" : "outline"} onClick={() => setViewMode("diff")}>Diff view</Button>
            </div>

            {showPreview ? (
              <div className="space-y-2 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Visual preview - page {selectedPage}</h3>
                  {isPreviewLoading ? <p className="text-xs text-muted-foreground">Rendering...</p> : null}
                </div>
                {previewError ? <p className="text-xs text-red-300">{previewError}</p> : null}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">PDF A {leftPageCount ? `(page ${Math.min(selectedPage, leftPageCount)} of ${leftPageCount})` : ""}</p>
                    <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-border/60 bg-muted/20 p-2">
                      {leftPreview ? (
                        <Image src={leftPreview.dataUrl} alt={`PDF A preview page ${selectedPage}`} width={leftPreview.width} height={leftPreview.height} unoptimized className="h-auto max-h-[380px] w-auto max-w-full object-contain" />
                      ) : (
                        <p className="text-xs text-muted-foreground">No preview for this page.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">PDF B {rightPageCount ? `(page ${Math.min(selectedPage, rightPageCount)} of ${rightPageCount})` : ""}</p>
                    <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-border/60 bg-muted/20 p-2">
                      {rightPreview ? (
                        <Image src={rightPreview.dataUrl} alt={`PDF B preview page ${selectedPage}`} width={rightPreview.width} height={rightPreview.height} unoptimized className="h-auto max-h-[380px] w-auto max-w-full object-contain" />
                      ) : (
                        <p className="text-xs text-muted-foreground">No preview for this page.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {selectedResult ? (
              viewMode === "side" ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-2 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <div className="px-3 py-2">PDF A</div>
                    <div className="border-l border-border px-3 py-2">PDF B</div>
                  </div>
                  <div className="max-h-[28rem] overflow-y-auto">
                    {selectedResult.rows.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-muted-foreground">No extractable text found on this page.</p>
                    ) : (
                      selectedResult.rows.map((row, index) => (
                        <div key={`${row.kind}-${index}`} className="grid grid-cols-2 border-b border-border/60 text-sm">
                          <div className={`px-3 py-2 whitespace-pre-wrap ${row.kind === "remove" || row.kind === "change" ? "bg-red-500/8 text-red-100" : "text-foreground"}`}>
                            {row.left || "-"}
                          </div>
                          <div className={`border-l border-border px-3 py-2 whitespace-pre-wrap ${row.kind === "add" || row.kind === "change" ? "bg-emerald-500/8 text-emerald-100" : "text-foreground"}`}>
                            {row.right || "-"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-border p-3 text-sm">
                  {selectedResult.rows.length === 0 ? (
                    <p className="text-muted-foreground">No extractable text found on this page.</p>
                  ) : (
                    selectedResult.rows.map((row, index) => (
                      <div key={`${row.kind}-${index}`} className="rounded-lg border border-border/70 bg-card/40 p-3">
                        {row.kind === "same" ? <p className="text-muted-foreground">= {row.left}</p> : null}
                        {row.kind === "remove" ? <p className="text-red-300">- {row.left}</p> : null}
                        {row.kind === "add" ? <p className="text-emerald-300">+ {row.right}</p> : null}
                        {row.kind === "change" ? (
                          <div className="space-y-1">
                            <p className="text-red-300">- {row.left}</p>
                            <p className="text-emerald-300">+ {row.right}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              )
            ) : null}

            <p className="text-xs text-muted-foreground">
              Best-effort text comparison. Scanned, image-only, or layout-only differences may not appear unless they affect extracted text.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

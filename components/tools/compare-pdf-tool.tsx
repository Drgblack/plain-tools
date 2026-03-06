"use client"

import { FileDiff, Loader2, RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ensureSafeLocalFileSize, formatFileSize, isPdfLikeFile } from "@/lib/pdf-client-utils"
import { getPdfJs } from "@/lib/pdfjs-loader"

type TextItemLike = {
  str?: string
  hasEOL?: boolean
  transform?: number[]
}

type RawLineOperation =
  | { type: "equal"; left: string; right: string }
  | { type: "delete"; left: string }
  | { type: "insert"; right: string }

type DiffTokenType = "same" | "remove" | "add"

type DiffToken = {
  text: string
  type: DiffTokenType
}

type DiffRow =
  | { kind: "equal"; left: string; right: string }
  | { kind: "delete"; left: string; right: "" }
  | { kind: "insert"; left: ""; right: string }
  | { kind: "replace"; left: string; right: string; leftTokens: DiffToken[]; rightTokens: DiffToken[] }

type PageDiffResult = {
  pageNumber: number
  rows: DiffRow[]
  hasChanges: boolean
  changeCount: number
}

type CompareResult = {
  pages: PageDiffResult[]
  changedPages: number
  totalPages: number
  totalChanges: number
}

const MAX_COMPARE_PDF_BYTES = 200 * 1024 * 1024

const splitIntoWords = (line: string) => line.trim().split(/\s+/).filter(Boolean)

const buildLcsMatrix = <T,>(left: T[], right: T[], equal: (a: T, b: T) => boolean) => {
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0)
  )

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const leftValue = left[i - 1]
      const rightValue = right[j - 1]
      if (leftValue !== undefined && rightValue !== undefined && equal(leftValue, rightValue)) {
        matrix[i]![j] = (matrix[i - 1]![j - 1] ?? 0) + 1
      } else {
        matrix[i]![j] = Math.max(matrix[i - 1]![j] ?? 0, matrix[i]![j - 1] ?? 0)
      }
    }
  }

  return matrix
}

const buildWordDiff = (leftLine: string, rightLine: string) => {
  const leftWords = splitIntoWords(leftLine)
  const rightWords = splitIntoWords(rightLine)
  const matrix = buildLcsMatrix(leftWords, rightWords, (a, b) => a === b)

  const leftTokens: DiffToken[] = []
  const rightTokens: DiffToken[] = []

  let i = leftWords.length
  let j = rightWords.length

  while (i > 0 || j > 0) {
    const leftWord = leftWords[i - 1]
    const rightWord = rightWords[j - 1]
    if (i > 0 && j > 0 && leftWord !== undefined && rightWord !== undefined && leftWord === rightWord) {
      leftTokens.unshift({ text: leftWord, type: "same" })
      rightTokens.unshift({ text: rightWord, type: "same" })
      i -= 1
      j -= 1
      continue
    }

    const top = i > 0 ? (matrix[i - 1]![j] ?? 0) : -1
    const left = j > 0 ? (matrix[i]![j - 1] ?? 0) : -1

    if (i > 0 && (j === 0 || top >= left)) {
      if (leftWord !== undefined) {
        leftTokens.unshift({ text: leftWord, type: "remove" })
      }
      i -= 1
    } else if (j > 0) {
      if (rightWord !== undefined) {
        rightTokens.unshift({ text: rightWord, type: "add" })
      }
      j -= 1
    }
  }

  return { leftTokens, rightTokens }
}

const extractLinesFromItems = (items: TextItemLike[]) => {
  const tokens = items
    .map((item, index) => {
      const raw = item.str?.replace(/\s+/g, " ").trim() ?? ""
      if (!raw) return null

      const y = Number(item.transform?.[5] ?? 0)
      const x = Number(item.transform?.[4] ?? 0)
      return { text: raw, y, x, hasEOL: Boolean(item.hasEOL), index }
    })
    .filter(
      (
        token
      ): token is { text: string; y: number; x: number; hasEOL: boolean; index: number } => token !== null
    )

  tokens.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 1.5) return b.y - a.y
    if (Math.abs(a.x - b.x) > 1.5) return a.x - b.x
    return a.index - b.index
  })

  const lines: string[] = []
  let currentLine: string[] = []
  let currentY: number | null = null

  for (const token of tokens) {
    const startsNewLine =
      currentY === null || Math.abs(token.y - currentY) > 2.5 || (currentLine.length > 0 && token.hasEOL)

    if (startsNewLine && currentLine.length > 0) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
      currentLine = []
    }

    currentLine.push(token.text)
    currentY = token.y

    if (token.hasEOL) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
      currentLine = []
      currentY = null
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim())
  }

  return lines.filter(Boolean)
}

const buildLineOperations = (leftLines: string[], rightLines: string[]) => {
  const matrix = buildLcsMatrix(leftLines, rightLines, (a, b) => a === b)
  const operations: RawLineOperation[] = []

  let i = leftLines.length
  let j = rightLines.length

  while (i > 0 || j > 0) {
    const leftLine = leftLines[i - 1]
    const rightLine = rightLines[j - 1]

    if (i > 0 && j > 0 && leftLine !== undefined && rightLine !== undefined && leftLine === rightLine) {
      operations.unshift({ type: "equal", left: leftLine, right: rightLine })
      i -= 1
      j -= 1
      continue
    }

    const top = i > 0 ? (matrix[i - 1]![j] ?? 0) : -1
    const left = j > 0 ? (matrix[i]![j - 1] ?? 0) : -1

    if (i > 0 && (j === 0 || top >= left)) {
      if (leftLine !== undefined) {
        operations.unshift({ type: "delete", left: leftLine })
      }
      i -= 1
    } else if (j > 0) {
      if (rightLine !== undefined) {
        operations.unshift({ type: "insert", right: rightLine })
      }
      j -= 1
    }
  }

  return operations
}

const buildDiffRows = (operations: RawLineOperation[]) => {
  const rows: DiffRow[] = []
  let index = 0

  while (index < operations.length) {
    const current = operations[index]
    if (!current) {
      index += 1
      continue
    }
    if (current.type === "equal") {
      rows.push({ kind: "equal", left: current.left, right: current.right })
      index += 1
      continue
    }

    const deletes: string[] = []
    const inserts: string[] = []
    while (index < operations.length && operations[index]?.type !== "equal") {
      const operation = operations[index]
      if (!operation) {
        index += 1
        continue
      }
      if (operation.type === "delete") {
        deletes.push(operation.left)
      } else if (operation.type === "insert") {
        inserts.push(operation.right)
      }
      index += 1
    }

    const maxLength = Math.max(deletes.length, inserts.length)
    for (let diffIndex = 0; diffIndex < maxLength; diffIndex += 1) {
      const leftLine = deletes[diffIndex] ?? ""
      const rightLine = inserts[diffIndex] ?? ""

      if (leftLine && rightLine) {
        const { leftTokens, rightTokens } = buildWordDiff(leftLine, rightLine)
        rows.push({
          kind: "replace",
          left: leftLine,
          right: rightLine,
          leftTokens,
          rightTokens,
        })
      } else if (leftLine) {
        rows.push({ kind: "delete", left: leftLine, right: "" })
      } else if (rightLine) {
        rows.push({ kind: "insert", left: "", right: rightLine })
      }
    }
  }

  return rows
}

async function extractPdfPagesText(
  file: File,
  onProgress: (progress: number, status: string) => void,
  label: string
) {
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
    const pages: string[] = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const textContent = await page.getTextContent()
      const lines = extractLinesFromItems(textContent.items as TextItemLike[])
      pages.push(lines.join("\n").trim())
      const progress = Math.round((pageNumber / pdf.numPages) * 100)
      onProgress(progress, `${label}: extracted page ${pageNumber} of ${pdf.numPages}...`)
    }
    return pages
  } finally {
    await loadingTask.destroy()
  }
}

function DiffTokens({ tokens }: { tokens: DiffToken[] }) {
  return (
    <>
      {tokens.map((token, index) => {
        const classes =
          token.type === "remove"
            ? "rounded-sm bg-red-500/15 px-0.5 text-red-300"
            : token.type === "add"
              ? "rounded-sm bg-emerald-500/15 px-0.5 text-emerald-300"
              : ""
        return (
          <span key={`${token.text}-${index}`} className={classes}>
            {token.text}
            {index < tokens.length - 1 ? " " : ""}
          </span>
        )
      })}
    </>
  )
}

export default function ComparePdfTool() {
  const [leftFile, setLeftFile] = useState<File | null>(null)
  const [rightFile, setRightFile] = useState<File | null>(null)
  const [status, setStatus] = useState("Upload two PDF files to compare extracted text changes.")
  const [isComparing, setIsComparing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [selectedPage, setSelectedPage] = useState(1)
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side")

  const validateAndSetFile = (
    file: File,
    side: "left" | "right",
    setter: (file: File) => void
  ) => {
    try {
      if (!isPdfLikeFile(file)) {
        toast.error("Please upload a PDF file.")
        return
      }
      ensureSafeLocalFileSize(file, MAX_COMPARE_PDF_BYTES)
      setter(file)
      setResult(null)
      setProgress(0)
      setSelectedPage(1)
      setStatus(`Ready to compare ${side === "left" ? "first" : "second"} file.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not use this PDF."
      setStatus(message)
      toast.error(message)
    }
  }

  const canCompare = Boolean(leftFile && rightFile && !isComparing)

  const runCompare = async () => {
    if (!leftFile || !rightFile) {
      toast.error("Upload both PDF files first.")
      return
    }

    setIsComparing(true)
    setResult(null)
    setProgress(2)
    setStatus("Extracting text locally from first PDF...")

    try {
      const leftPages = await extractPdfPagesText(
        leftFile,
        (stageProgress, stageStatus) => {
          setProgress(Math.round(stageProgress * 0.45))
          setStatus(stageStatus)
        },
        "First PDF"
      )

      const rightPages = await extractPdfPagesText(
        rightFile,
        (stageProgress, stageStatus) => {
          setProgress(45 + Math.round(stageProgress * 0.45))
          setStatus(stageStatus)
        },
        "Second PDF"
      )

      setStatus("Computing text diff...")
      const totalPages = Math.max(leftPages.length, rightPages.length)
      const pages: PageDiffResult[] = []
      let totalChanges = 0

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
        const leftText = leftPages[pageIndex] ?? ""
        const rightText = rightPages[pageIndex] ?? ""
        const leftLines = leftText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
        const rightLines = rightText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

        const lineOps = buildLineOperations(leftLines, rightLines)
        const rows = buildDiffRows(lineOps)
        const changeCount = rows.filter((row) => row.kind !== "equal").length
        totalChanges += changeCount

        pages.push({
          pageNumber: pageIndex + 1,
          rows,
          hasChanges: changeCount > 0,
          changeCount,
        })

        setProgress(90 + Math.round(((pageIndex + 1) / totalPages) * 10))
      }

      const changedPages = pages.filter((page) => page.hasChanges).length
      const nextResult: CompareResult = {
        pages,
        changedPages,
        totalPages,
        totalChanges,
      }
      setResult(nextResult)
      setSelectedPage(1)
      setViewMode("side-by-side")
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

  const selectedPageResult = useMemo(() => {
    if (!result) return null
    return result.pages.find((page) => page.pageNumber === selectedPage) ?? result.pages[0] ?? null
  }, [result, selectedPage])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Basic offline text diff</CardTitle>
          <CardDescription>
            This tool extracts text from both PDFs in your browser and highlights line and word-level changes.
            Files never leave your device.
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">First PDF</p>
              <PdfFileDropzone
                accept="application/pdf"
                disabled={isComparing}
                title="Drop first PDF"
                subtitle="This becomes the left/base document"
                onFilesSelected={(files) => {
                  const selected = files[0]
                  if (selected) {
                    validateAndSetFile(selected, "left", setLeftFile)
                  }
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Second PDF</p>
              <PdfFileDropzone
                accept="application/pdf"
                disabled={isComparing}
                title="Drop second PDF"
                subtitle="This becomes the right/updated document"
                onFilesSelected={(files) => {
                  const selected = files[0]
                  if (selected) {
                    validateAndSetFile(selected, "right", setRightFile)
                  }
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
            <Button type="button" disabled={!canCompare} onClick={() => void runCompare()}>
              {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDiff className="h-4 w-4" />}
              Compare
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLeftFile(null)
                setRightFile(null)
                setResult(null)
                setSelectedPage(1)
                setProgress(0)
                setStatus("Upload two PDF files to compare extracted text changes.")
              }}
              disabled={isComparing}
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
              {result.changedPages} page{result.changedPages === 1 ? "" : "s"} changed out of {result.totalPages}.{" "}
              {result.totalChanges} change block{result.totalChanges === 1 ? "" : "s"} detected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProcessedLocallyBadge />

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
              <Button
                type="button"
                size="sm"
                variant={viewMode === "side-by-side" ? "default" : "outline"}
                onClick={() => setViewMode("side-by-side")}
              >
                Side-by-side
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "diff" ? "default" : "outline"}
                onClick={() => setViewMode("diff")}
              >
                Diff view
              </Button>
            </div>

            {selectedPageResult ? (
              viewMode === "side-by-side" ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-2 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <div className="px-3 py-2">First PDF</div>
                    <div className="border-l border-border px-3 py-2">Second PDF</div>
                  </div>
                  <div className="max-h-[28rem] overflow-y-auto">
                    {selectedPageResult.rows.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-muted-foreground">No extractable text found on this page.</p>
                    ) : (
                      selectedPageResult.rows.map((row, index) => (
                        <div key={`${row.kind}-${index}`} className="grid grid-cols-2 border-b border-border/60 text-sm">
                          <div
                            className={`px-3 py-2 leading-relaxed whitespace-pre-wrap ${
                              row.kind === "delete" || row.kind === "replace"
                                ? "bg-red-500/8 text-red-100"
                                : "text-foreground"
                            }`}
                          >
                            {row.kind === "replace" ? <DiffTokens tokens={row.leftTokens} /> : row.left || "—"}
                          </div>
                          <div
                            className={`border-l border-border px-3 py-2 leading-relaxed whitespace-pre-wrap ${
                              row.kind === "insert" || row.kind === "replace"
                                ? "bg-emerald-500/8 text-emerald-100"
                                : "text-foreground"
                            }`}
                          >
                            {row.kind === "replace" ? <DiffTokens tokens={row.rightTokens} /> : row.right || "—"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-border p-3 text-sm">
                  {selectedPageResult.rows.length === 0 ? (
                    <p className="text-muted-foreground">No extractable text found on this page.</p>
                  ) : (
                    selectedPageResult.rows.map((row, index) => (
                      <div key={`${row.kind}-${index}`} className="rounded-lg border border-border/70 bg-card/40 p-3">
                        {row.kind === "equal" ? (
                          <p className="text-muted-foreground">= {row.left}</p>
                        ) : row.kind === "delete" ? (
                          <p className="text-red-300">- {row.left}</p>
                        ) : row.kind === "insert" ? (
                          <p className="text-emerald-300">+ {row.right}</p>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-red-300">
                              - <DiffTokens tokens={row.leftTokens} />
                            </p>
                            <p className="text-emerald-300">
                              + <DiffTokens tokens={row.rightTokens} />
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )
            ) : null}

            <p className="text-xs text-muted-foreground">
              This is a best-effort text diff. Layout-only, image-only, or scanned differences may not appear unless
              they affect extracted text.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

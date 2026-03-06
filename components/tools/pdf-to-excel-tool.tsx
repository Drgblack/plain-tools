"use client"

import { Download, FileSpreadsheet, Loader2, Table2, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfJs } from "@/lib/pdfjs-loader"

type ExtractMode = "tables" | "text"

type PdfTextItem = {
  text: string
  x: number
  y: number
}

type RowCluster = {
  y: number
  cells: PdfTextItem[]
}

type ColumnCluster = {
  x: number
}

type ConversionResult = {
  fileName: string
  mode: ExtractMode
  outputSize: number
  fallbackApplied: boolean
  tableCount: number
}

const MAX_PDF_TO_EXCEL_BYTES = 200 * 1024 * 1024
const ROW_TOLERANCE = 3
const COLUMN_TOLERANCE = 12

const extractBaseName = (name: string) => name.replace(/\.pdf$/i, "")

const sanitizeCell = (value: string) => value.replace(/\s+/g, " ").trim()

const quoteCsv = (value: string) => `"${value.replace(/"/g, '""')}"`

const toCsvLine = (values: string[]) => values.map((value) => quoteCsv(value)).join(",")

const parseTextItems = (items: unknown[]): PdfTextItem[] =>
  items
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const candidate = item as { str?: unknown; transform?: unknown }
      if (typeof candidate.str !== "string" || !candidate.str.trim()) return null
      if (!Array.isArray(candidate.transform) || candidate.transform.length < 6) return null
      const x = Number(candidate.transform[4])
      const y = Number(candidate.transform[5])
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null
      return {
        text: sanitizeCell(candidate.str),
        x,
        y,
      } satisfies PdfTextItem
    })
    .filter((item): item is PdfTextItem => Boolean(item))

const clusterRows = (tokens: PdfTextItem[]): RowCluster[] => {
  const sorted = [...tokens].sort((left, right) => {
    if (Math.abs(left.y - right.y) > 0.1) return right.y - left.y
    return left.x - right.x
  })

  const rows: RowCluster[] = []
  for (const token of sorted) {
    const existing = rows.find((row) => Math.abs(row.y - token.y) <= ROW_TOLERANCE)
    if (existing) {
      existing.cells.push(token)
      existing.y = (existing.y * (existing.cells.length - 1) + token.y) / existing.cells.length
      continue
    }

    rows.push({
      y: token.y,
      cells: [token],
    })
  }

  return rows
    .map((row) => ({
      ...row,
      cells: row.cells.sort((left, right) => left.x - right.x),
    }))
    .sort((left, right) => right.y - left.y)
}

const clusterColumns = (rows: RowCluster[]): ColumnCluster[] => {
  const columns: ColumnCluster[] = []
  for (const row of rows) {
    for (const cell of row.cells) {
      const existing = columns.find((column) => Math.abs(column.x - cell.x) <= COLUMN_TOLERANCE)
      if (existing) {
        existing.x = (existing.x + cell.x) / 2
        continue
      }
      columns.push({ x: cell.x })
    }
  }

  return columns.sort((left, right) => left.x - right.x)
}

const buildGrid = (rows: RowCluster[], columns: ColumnCluster[]) => {
  if (!rows.length || !columns.length) return []

  return rows.map((row) => {
    const values = Array.from({ length: columns.length }, () => "")

    for (const cell of row.cells) {
      let closestColumn = 0
      let closestDistance = Number.POSITIVE_INFINITY

      for (let index = 0; index < columns.length; index += 1) {
        const distance = Math.abs(columns[index].x - cell.x)
        if (distance < closestDistance) {
          closestDistance = distance
          closestColumn = index
        }
      }

      values[closestColumn] = values[closestColumn]
        ? `${values[closestColumn]} ${cell.text}`
        : cell.text
    }

    return values.map((value) => sanitizeCell(value))
  })
}

const looksLikeTable = (grid: string[][]) => {
  if (grid.length < 2) return false
  const width = Math.max(...grid.map((row) => row.length), 0)
  if (width < 2) return false

  const nonEmptyCells = grid.reduce(
    (count, row) => count + row.filter((cell) => cell.trim().length > 0).length,
    0
  )
  return nonEmptyCells >= grid.length * 2
}

const buildTableCsv = (tablesByPage: Array<{ page: number; grid: string[][] }>) => {
  const lines: string[] = []
  let tableCount = 0

  for (const table of tablesByPage) {
    if (!looksLikeTable(table.grid)) continue
    tableCount += 1

    lines.push(toCsvLine([`Table ${tableCount} - Page ${table.page}`]))
    for (const row of table.grid) {
      lines.push(toCsvLine(row))
    }
    lines.push("")
  }

  return {
    csv: lines.join("\n").trim(),
    tableCount,
  }
}

const buildTextCsv = (pages: Array<{ page: number; rows: RowCluster[] }>) => {
  const lines: string[] = [toCsvLine(["Page", "Text"])]

  for (const page of pages) {
    const mergedLines = page.rows
      .map((row) => row.cells.map((cell) => cell.text).join(" ").trim())
      .filter(Boolean)

    if (!mergedLines.length) {
      lines.push(toCsvLine([String(page.page), ""]))
      continue
    }

    for (const line of mergedLines) {
      lines.push(toCsvLine([String(page.page), line]))
    }
  }

  return lines.join("\n")
}

export default function PdfToExcelTool() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<ExtractMode>("tables")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF to convert it into spreadsheet-ready data.")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const handleFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_PDF_TO_EXCEL_BYTES)
        setFile(candidate)
        setProgress(0)
        setStatus("Ready to convert.")
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const canConvert = useMemo(() => Boolean(file && !isConverting), [file, isConverting])

  const runConversion = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsConverting(true)
    setProgress(4)
    setStatus("Opening PDF locally...")
    clearResult()

    try {
      const pdfjs = await getPdfJs()
      const bytes = new Uint8Array(await file.arrayBuffer())
      const loadingTask = pdfjs.getDocument({
        data: bytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      const pages: Array<{ page: number; rows: RowCluster[]; grid: string[][] }> = []

      try {
        const pdf = await loadingTask.promise

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          setStatus(`Reading page ${pageNumber} of ${pdf.numPages}...`)
          const page = await pdf.getPage(pageNumber)
          const textContent = await page.getTextContent()
          const tokens = parseTextItems(textContent.items as unknown[])
          const rows = clusterRows(tokens)
          const columns = clusterColumns(rows)
          const grid = buildGrid(rows, columns)

          pages.push({
            page: pageNumber,
            rows,
            grid,
          })

          setProgress(Math.min(90, Math.round((pageNumber / pdf.numPages) * 80) + 10))
        }
      } finally {
        await loadingTask.destroy()
      }

      let finalMode: ExtractMode = mode
      let fallbackApplied = false
      let tableCount = 0
      let csvContent = ""

      if (mode === "tables") {
        const tableOutput = buildTableCsv(
          pages.map((page) => ({
            page: page.page,
            grid: page.grid,
          }))
        )

        if (tableOutput.tableCount > 0 && tableOutput.csv.length > 0) {
          csvContent = tableOutput.csv
          tableCount = tableOutput.tableCount
        } else {
          fallbackApplied = true
          finalMode = "text"
          csvContent = buildTextCsv(
            pages.map((page) => ({
              page: page.page,
              rows: page.rows,
            }))
          )
          setStatus("No clear tables detected. Falling back to all-text CSV extraction.")
        }
      } else {
        csvContent = buildTextCsv(
          pages.map((page) => ({
            page: page.page,
            rows: page.rows,
          }))
        )
      }

      if (!csvContent.trim()) {
        throw new Error("No extractable text was found in this PDF.")
      }

      const fileName = `${extractBaseName(file.name)}-${
        finalMode === "tables" ? "tables" : "text"
      }.csv`
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8",
      })
      setUrlFromBlob(blob)
      setResult({
        fileName,
        mode: finalMode,
        outputSize: blob.size,
        fallbackApplied,
        tableCount,
      })
      setProgress(100)
      setStatus("Done. Spreadsheet export is ready.")
      toast.success("Conversion complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not convert this PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsConverting(false)
    }
  }, [clearResult, file, mode, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Best-effort offline conversion</CardTitle>
          <CardDescription>
            Best-effort offline conversion. Complex layouts may not convert. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isConverting}
            title="Drop a PDF here, or click to browse"
            subtitle="Local conversion to CSV spreadsheet format"
            onFilesSelected={(files) => {
              const selected = files[0]
              if (selected) {
                handleFile(selected)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">PDF to Excel</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Mode</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={mode === "tables" ? "default" : "outline"}
                className="w-full"
                disabled={isConverting}
                onClick={() => setMode("tables")}
              >
                <Table2 className="h-4 w-4" />
                Extract tables (best-effort)
              </Button>
              <Button
                type="button"
                variant={mode === "text" ? "default" : "outline"}
                className="w-full"
                disabled={isConverting}
                onClick={() => setMode("text")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Extract all text to CSV
              </Button>
            </div>
          </div>

          {(isConverting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isConverting ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!canConvert}
            onClick={runConversion}
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                Convert
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isConverting && !file}
            onClick={() => {
              setFile(null)
              setProgress(0)
              setStatus("Upload a PDF to convert it into spreadsheet-ready data.")
              setMode("tables")
              clearResult()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download export</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.outputSize)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            {result.mode === "tables" ? (
              <p className="text-xs text-muted-foreground">
                Detected {result.tableCount} table{result.tableCount === 1 ? "" : "s"}.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Exported line-based text data to CSV.
              </p>
            )}
            {result.fallbackApplied ? (
              <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200">
                No clear tables were detected, so text extraction fallback was used.
              </p>
            ) : null}
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download CSV
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

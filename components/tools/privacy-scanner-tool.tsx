"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, ScanSearch, ShieldAlert, Trash2, UploadCloud } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  plainPrivacyRiskScanner,
  type PrivacyRiskFinding,
  type PrivacyRiskReport,
} from "@/lib/pdf-privacy-scanner"
import {
  plainIrreversibleRedactor,
  type PlainRedactionRegion,
  type ProcessingStage,
} from "@/lib/pdf-security-engines"

type ProcessingMode = "idle" | "scan" | "redact-all" | "redact-high"

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

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const csvEscape = (value: string | number) => {
  const text = String(value ?? "")
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const severityRank = (severity: PrivacyRiskFinding["severity"]) => {
  if (severity === "high") return 3
  if (severity === "medium") return 2
  return 1
}

const stageToProgress = (
  stage: ProcessingStage,
  message: string,
  totalPages: number | null
) => {
  if (stage === "Initialising Wasm") return 12
  if (stage === "Applying Burn-In Redaction") {
    const match = message.match(/page\s+(\d+)/i)
    if (match && totalPages && totalPages > 0) {
      const page = Number(match[1])
      return Math.min(94, 18 + Math.round((Math.min(page, totalPages) / totalPages) * 74))
    }
    return 72
  }
  if (stage === "Scrubbing Metadata") return 97
  if (stage === "Complete") return 100
  return 65
}

const getSeverityBadgeVariant = (severity: PrivacyRiskFinding["severity"]) => {
  if (severity === "high") return "destructive" as const
  if (severity === "medium") return "secondary" as const
  return "outline" as const
}

const typeLabel = (type: PrivacyRiskFinding["type"]) => {
  if (type === "ssn") return "SSN"
  if (type === "medical_id") return "Medical ID"
  if (type === "iban") return "IBAN"
  return "Email"
}

const findingToRegion = (finding: PrivacyRiskFinding): PlainRedactionRegion => ({
  page: finding.page,
  coords: {
    x: finding.bounds.x,
    y: finding.bounds.y,
    width: finding.bounds.width,
    height: finding.bounds.height,
  },
})

export default function PrivacyScannerTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [processingMode, setProcessingMode] = useState<ProcessingMode>("idle")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF and run a local privacy risk scan.")

  const [report, setReport] = useState<PrivacyRiskReport | null>(null)
  const [annotatedUrl, setAnnotatedUrl] = useState<string | null>(null)
  const [annotatedSize, setAnnotatedSize] = useState<number | null>(null)

  const [autoRedactedUrl, setAutoRedactedUrl] = useState<string | null>(null)
  const [autoRedactedName, setAutoRedactedName] = useState<string>("auto-redacted.pdf")
  const [autoRedactedSize, setAutoRedactedSize] = useState<number | null>(null)

  const isProcessing = processingMode !== "idle"

  useEffect(() => {
    return () => {
      if (annotatedUrl) URL.revokeObjectURL(annotatedUrl)
    }
  }, [annotatedUrl])

  useEffect(() => {
    return () => {
      if (autoRedactedUrl) URL.revokeObjectURL(autoRedactedUrl)
    }
  }, [autoRedactedUrl])

  const clearScannerResults = useCallback(() => {
    if (annotatedUrl) URL.revokeObjectURL(annotatedUrl)
    if (autoRedactedUrl) URL.revokeObjectURL(autoRedactedUrl)

    setReport(null)
    setAnnotatedUrl(null)
    setAnnotatedSize(null)
    setAutoRedactedUrl(null)
    setAutoRedactedSize(null)
    setAutoRedactedName("auto-redacted.pdf")
  }, [annotatedUrl, autoRedactedUrl])

  const setFileAndReset = useCallback(
    (nextFile: File) => {
      if (!isPdfFile(nextFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(nextFile)
      clearScannerResults()
      setProgress(0)
      setStatus("PDF loaded. Ready to scan.")
      toast.success("PDF loaded.")
    },
    [clearScannerResults]
  )

  const findings = useMemo(() => {
    if (!report) return []
    return [...report.findings].sort((left, right) => {
      if (left.page !== right.page) return left.page - right.page
      if (severityRank(left.severity) !== severityRank(right.severity)) {
        return severityRank(right.severity) - severityRank(left.severity)
      }
      return right.confidence - left.confidence
    })
  }, [report])

  const suggestedAllRegions = useMemo(
    () => report?.suggestedRedactions ?? [],
    [report]
  )

  const suggestedHighRiskRegions = useMemo(() => {
    if (!report) return []
    return report.findings
      .filter((finding) => finding.severity === "high")
      .map(findingToRegion)
  }, [report])

  const handleScan = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setProcessingMode("scan")
    setProgress(4)
    setStatus("Initialising local privacy risk scanner...")
    clearScannerResults()

    try {
      const result = await plainPrivacyRiskScanner(file, {
        onProgress: (nextProgress, message) => {
          setProgress(nextProgress)
          setStatus(message)
        },
      })

      const annotatedBlob = new Blob([result.annotatedBytes], {
        type: "application/pdf",
      })
      const nextAnnotatedUrl = URL.createObjectURL(annotatedBlob)

      setReport(result.report)
      setAnnotatedUrl(nextAnnotatedUrl)
      setAnnotatedSize(annotatedBlob.size)
      setProgress(100)
      setStatus(
        `Scan complete. Found ${result.report.summary.totalFindings} potential privacy risk(s).`
      )
      toast.success("Privacy scan complete.")
    } catch (error) {
      setStatus("Scan failed.")
      const message =
        error instanceof Error ? error.message : "Could not complete privacy scan."
      toast.error(message)
    } finally {
      setProcessingMode("idle")
    }
  }, [clearScannerResults, file])

  const runAutoRedact = useCallback(
    async (
      mode: "all" | "high",
      regions: PlainRedactionRegion[],
      outputName: string
    ) => {
      if (!file) {
        toast.error("Upload a PDF first.")
        return
      }
      if (!regions.length) {
        toast.error("No suggested regions available for this action.")
        return
      }

      setProcessingMode(mode === "all" ? "redact-all" : "redact-high")
      setProgress(8)
      setStatus("Preparing irreversible redaction from scanner suggestions...")

      if (autoRedactedUrl) {
        URL.revokeObjectURL(autoRedactedUrl)
        setAutoRedactedUrl(null)
      }
      setAutoRedactedSize(null)

      try {
        const bytes = await plainIrreversibleRedactor(file, regions, (stage, message) => {
          setStatus(message)
          setProgress((current) =>
            Math.max(current, stageToProgress(stage, message, report?.pageCount ?? null))
          )
        })

        const blob = new Blob([bytes], { type: "application/pdf" })
        const nextUrl = URL.createObjectURL(blob)

        setAutoRedactedUrl(nextUrl)
        setAutoRedactedName(outputName)
        setAutoRedactedSize(blob.size)
        setProgress(100)
        setStatus("Auto-redaction complete. File is ready for download.")
        toast.success("Auto-redaction complete.")
      } catch (error) {
        setStatus("Auto-redaction failed.")
        const message =
          error instanceof Error ? error.message : "Could not auto-redact suggested regions."
        toast.error(message)
      } finally {
        setProcessingMode("idle")
      }
    },
    [autoRedactedUrl, file, report?.pageCount]
  )

  const downloadAnnotated = useCallback(() => {
    if (!annotatedUrl) return
    const anchor = document.createElement("a")
    anchor.href = annotatedUrl
    anchor.download = "privacy-risk-annotated.pdf"
    anchor.click()
  }, [annotatedUrl])

  const downloadAutoRedacted = useCallback(() => {
    if (!autoRedactedUrl) return
    const anchor = document.createElement("a")
    anchor.href = autoRedactedUrl
    anchor.download = autoRedactedName
    anchor.click()
  }, [autoRedactedName, autoRedactedUrl])

  const downloadJson = useCallback(() => {
    if (!report) return
    const json = JSON.stringify(report, null, 2)
    downloadBlob(
      new Blob([json], { type: "application/json;charset=utf-8" }),
      "privacy-risk-report.json"
    )
  }, [report])

  const downloadCsv = useCallback(() => {
    if (!report) return
    const headers = ["Page", "PII Type", "Snippet", "Severity", "Confidence"]
    const rows = report.findings.map((finding) => [
      finding.page,
      typeLabel(finding.type),
      finding.matchedText,
      finding.severity.toUpperCase(),
      `${(finding.confidence * 100).toFixed(1)}%`,
    ])

    const csv = [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => row.map(csvEscape).join(",")),
    ].join("\n")

    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "privacy-risk-report.csv")
  }, [report])

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            setFileAndReset(selected)
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
              const dropped = event.dataTransfer.files?.[0]
              if (dropped) {
                setFileAndReset(dropped)
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
            <p className="text-sm font-medium text-foreground">Drop one PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Scanner runs fully local and produces an annotated review copy.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Plain Privacy Risk Scanner</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setFile(null)
                  clearScannerResults()
                  setProgress(0)
                  setStatus("Upload a PDF and run a local privacy risk scan.")
                }}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          {(isProcessing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {processingMode === "scan"
                    ? "Scanning"
                    : processingMode === "redact-all" || processingMode === "redact-high"
                      ? "Auto-redacting"
                      : "Complete"}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleScan}
            disabled={!file || isProcessing}
          >
            {processingMode === "scan" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ScanSearch className="h-4 w-4" />
                Scan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {report ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scan Results</CardTitle>
            <CardDescription>
              {report.summary.totalFindings} finding(s) across {report.pageCount} page(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">High: {report.summary.bySeverity.high}</Badge>
              <Badge variant="outline">Medium: {report.summary.bySeverity.medium}</Badge>
              <Badge variant="outline">Low: {report.summary.bySeverity.low}</Badge>
              <Badge variant="outline">Suggestions: {report.suggestedRedactions.length}</Badge>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>PII Type</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {findings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                        No PII patterns matched in this document.
                      </TableCell>
                    </TableRow>
                  ) : (
                    findings.map((finding) => (
                      <TableRow key={finding.id}>
                        <TableCell className="font-medium">{finding.page}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{typeLabel(finding.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate" title={finding.matchedText}>
                          {finding.matchedText}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(finding.severity)}>
                            {finding.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{(finding.confidence * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  void runAutoRedact("all", suggestedAllRegions, "auto-redacted-all.pdf")
                }
                disabled={isProcessing || suggestedAllRegions.length === 0}
              >
                {processingMode === "redact-all" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auto-Redacting All...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Auto-Redact All ({suggestedAllRegions.length})
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  void runAutoRedact("high", suggestedHighRiskRegions, "auto-redacted-high.pdf")
                }
                disabled={isProcessing || suggestedHighRiskRegions.length === 0}
              >
                {processingMode === "redact-high" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auto-Redacting High Risk...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Auto-Redact High Risk ({suggestedHighRiskRegions.length})
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button type="button" variant="outline" onClick={downloadJson}>
                <Download className="h-4 w-4" />
                Report JSON
              </Button>
              <Button type="button" variant="outline" onClick={downloadCsv}>
                <Download className="h-4 w-4" />
                Report CSV
              </Button>
              <Button type="button" variant="outline" onClick={downloadAnnotated} disabled={!annotatedUrl}>
                <Download className="h-4 w-4" />
                Annotated PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={downloadAutoRedacted}
                disabled={!autoRedactedUrl}
              >
                <Download className="h-4 w-4" />
                Auto-Redacted PDF
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {annotatedSize !== null ? (
                <span>Annotated size: {formatBytes(annotatedSize)}</span>
              ) : null}
              {autoRedactedSize !== null ? (
                <span>Auto-redacted size: {formatBytes(autoRedactedSize)}</span>
              ) : null}
              <span>WebGPU: {report.webgpuActive ? "Available" : "Unavailable"}</span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

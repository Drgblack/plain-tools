"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Copy,
  Download,
  FileText,
  Lightbulb,
  Loader2,
  PencilLine,
  Trash2,
  UploadCloud,
} from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  consumeAiUsage,
  exhaustAiUsage,
  fetchAiUsageSnapshot,
  type AiUsageSnapshot,
} from "@/lib/ai-usage-client"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import {
  isMonthlyAiLimitReachedError,
  SERVER_WARNING,
  suggestPdfEdits,
  type PdfEditSuggestion,
} from "@/lib/pdf-ai-engine"
import { trackEvent } from "@/lib/analytics"

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

const triggerPdfDownload = (bytes: Uint8Array, fileName: string) => {
  const blob = new Blob([bytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  notifyLocalDownloadSuccess()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export default function SuggestEditsTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [rewriteInstruction, setRewriteInstruction] = useState("")
  const [sectionText, setSectionText] = useState("")
  const [pageNumberInput, setPageNumberInput] = useState("")
  const [allowServerProcessing, setAllowServerProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload a PDF, enter rewrite instructions, and enable server processing."
  )

  const [suggestions, setSuggestions] = useState<PdfEditSuggestion[]>([])
  const [updatedPdfBytes, setUpdatedPdfBytes] = useState<Uint8Array | null>(null)
  const [monthlyLimitResetDate, setMonthlyLimitResetDate] = useState<string | null>(null)
  const [aiUsage, setAiUsage] = useState<AiUsageSnapshot | null>(null)

  useEffect(() => {
    void fetchAiUsageSnapshot().then((snapshot) => {
      if (snapshot) {
        setAiUsage(snapshot)
      }
    })
  }, [])

  useEffect(() => {
    if (monthlyLimitResetDate) {
      trackEvent("AI Limit Reached", { tool: "suggest-edits" })
    }
  }, [monthlyLimitResetDate])

  const canSuggest = useMemo(
    () =>
      Boolean(
        file &&
          rewriteInstruction.trim().length > 0 &&
          allowServerProcessing &&
          !isLoading
      ),
    [allowServerProcessing, file, isLoading, rewriteInstruction]
  )

  const safePageNumber = useMemo(() => {
    const value = Number(pageNumberInput)
    return Number.isInteger(value) && value > 0 ? value : undefined
  }, [pageNumberInput])
  const remainingAiRequests = useMemo(() => {
    if (!aiUsage) return null
    return Math.max(0, aiUsage.limit - aiUsage.used)
  }, [aiUsage])
  const showRemainingAiRequests = remainingAiRequests !== null && remainingAiRequests <= 2

  const loadFile = useCallback((nextFile: File) => {
    if (!isPdfFile(nextFile)) {
      toast.error("Only PDF files are supported.")
      return
    }

    setFile(nextFile)
    setSuggestions([])
    setUpdatedPdfBytes(null)
    setProgress(0)
    setStatus("PDF loaded. Ready to suggest edits.")
    toast.success("PDF loaded.")
  }, [])

  const runSuggest = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }
    if (!rewriteInstruction.trim()) {
      toast.error("Enter rewrite instructions first.")
      return
    }
    if (!allowServerProcessing) {
      toast.error("Enable server processing to continue.")
      return
    }

    setIsLoading(true)
    setSuggestions([])
    setUpdatedPdfBytes(null)
    setMonthlyLimitResetDate(null)
    setProgress(2)
    setStatus("Initialising PDF edit suggestion pipeline...")

    try {
      const result = await suggestPdfEdits(file, {
        rewriteInstruction: rewriteInstruction.trim(),
        allowServerProcessing: true,
        sectionText: sectionText.trim() || undefined,
        pageNumber: safePageNumber,
        onProgress: (nextProgress, nextStatus) => {
          setProgress(nextProgress)
          setStatus(nextStatus)
        },
      })

      setSuggestions(result.suggestions)
      setMonthlyLimitResetDate(null)
      setAiUsage((current) => consumeAiUsage(current))
      setProgress(100)
      setStatus(`Suggestions ready. ${result.suggestions.length} option(s) generated.`)
      toast.success("Suggestions generated.")
    } catch (error) {
      if (isMonthlyAiLimitReachedError(error)) {
        setMonthlyLimitResetDate(error.resetDate || null)
        setAiUsage((current) => exhaustAiUsage(current))
        setStatus(error.message)
        return
      }

      setStatus("Suggestion generation failed.")
      const message =
        error instanceof Error ? error.message : "Could not generate edit suggestions."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [allowServerProcessing, file, rewriteInstruction, safePageNumber, sectionText])

  const applySuggestion = useCallback(
    async (index: number) => {
      if (!file) {
        toast.error("Upload a PDF first.")
        return
      }
      if (!rewriteInstruction.trim()) {
        toast.error("Rewrite instructions are required.")
        return
      }
      if (!allowServerProcessing) {
        toast.error("Enable server processing to continue.")
        return
      }

      setIsLoading(true)
      setMonthlyLimitResetDate(null)
      setProgress(5)
      setStatus("Applying selected suggestion...")

      try {
        const result = await suggestPdfEdits(file, {
          rewriteInstruction: rewriteInstruction.trim(),
          allowServerProcessing: true,
          sectionText: sectionText.trim() || undefined,
          pageNumber: safePageNumber,
          acceptedSuggestionIndex: index,
          onProgress: (nextProgress, nextStatus) => {
            setProgress(nextProgress)
            setStatus(nextStatus)
          },
        })

        setSuggestions(result.suggestions)
        setAiUsage((current) => consumeAiUsage(current))
        if (result.updatedPdfBytes) {
          setUpdatedPdfBytes(result.updatedPdfBytes)
          setStatus("Suggestion applied. Download updated PDF.")
          toast.success("Suggestion applied.")
        } else {
          setStatus("Suggestion applied but updated PDF was not returned.")
          toast.error("Updated PDF was not returned.")
        }
      } catch (error) {
        if (isMonthlyAiLimitReachedError(error)) {
          setMonthlyLimitResetDate(error.resetDate || null)
          setAiUsage((current) => exhaustAiUsage(current))
          setStatus(error.message)
          return
        }

        setStatus("Failed to apply suggestion.")
        const message =
          error instanceof Error ? error.message : "Could not apply selected suggestion."
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [allowServerProcessing, file, rewriteInstruction, safePageNumber, sectionText]
  )

  const copySuggestion = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success("Suggestion copied.")
    } catch {
      toast.error("Could not copy suggestion.")
    }
  }, [])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            loadFile(selected)
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
                loadFile(dropped)
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
              Text is extracted locally before optional server rewrite suggestions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Suggest Edits</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
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
                className="ml-auto w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setRewriteInstruction("")
                  setSectionText("")
                  setPageNumberInput("")
                  setSuggestions([])
                  setUpdatedPdfBytes(null)
                  setProgress(0)
                  setStatus(
                    "Upload a PDF, enter rewrite instructions, and enable server processing."
                  )
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="rewrite-instruction">Rewrite instruction</Label>
            <Textarea
              id="rewrite-instruction"
              placeholder='e.g. "Rewrite this in a concise and formal tone."'
              value={rewriteInstruction}
              onChange={(event) => setRewriteInstruction(event.target.value)}
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section-text">Target section text (optional)</Label>
              <Textarea
                id="section-text"
                placeholder="Paste a short snippet to target a specific section."
                value={sectionText}
                onChange={(event) => setSectionText(event.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-number">Page number (optional)</Label>
              <Input
                id="page-number"
                type="number"
                min={1}
                step={1}
                placeholder="1"
                value={pageNumberInput}
                onChange={(event) => setPageNumberInput(event.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs font-medium text-amber-200">Server processing warning</p>
            <p className="mt-1 text-xs text-amber-100/90">{SERVER_WARNING} Only extracted text is sent.</p>
            {showRemainingAiRequests ? (
              <p className="mt-2 text-xs text-amber-100/90">
                {remainingAiRequests} free AI request{remainingAiRequests === 1 ? "" : "s"} remaining this month
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-3 rounded-md border p-3 sm:flex-row sm:items-center">
            <Switch
              id="allow-server-processing-edits"
              checked={allowServerProcessing}
              onCheckedChange={setAllowServerProcessing}
              disabled={isLoading}
            />
            <Label htmlFor="allow-server-processing-edits" className="text-sm">
              Allow server processing
            </Label>
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">{isLoading ? "Processing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" className="w-full sm:w-auto" onClick={runSuggest} disabled={!canSuggest}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PencilLine className="h-4 w-4" />
                Suggest Edits
              </>
            )}
          </Button>
          {updatedPdfBytes ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => triggerPdfDownload(updatedPdfBytes, "suggested-edits.pdf")}
            >
              <Download className="h-4 w-4" />
              Download updated PDF
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {monthlyLimitResetDate ? (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-100">
              You&apos;ve used your 5 free AI requests this month.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-100/90">
              AI request limits reset monthly. If you need more capacity, contact support.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/support">Contact support</Link>
              </Button>
            </div>
            <p className="text-xs text-amber-100/90">
              Resets on {monthlyLimitResetDate}. Come back then to continue for free.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {suggestions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggestions</CardTitle>
            <CardDescription>Select one to apply into the PDF.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {updatedPdfBytes ? <ProcessedLocallyBadge /> : null}
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    <Lightbulb className="mr-1 inline h-4 w-4 text-primary" />
                    Suggestion {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">Page {suggestion.pageNumber}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Original</p>
                    <p className="text-sm text-muted-foreground">{suggestion.originalText}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Suggested</p>
                    <p className="text-sm text-foreground">{suggestion.suggestedText}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => copySuggestion(suggestion.suggestedText)}
                    disabled={isLoading}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => void applySuggestion(index)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <PencilLine className="h-4 w-4" />
                        Apply to PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

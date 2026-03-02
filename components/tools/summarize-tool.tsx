"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Copy, FileText, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SERVER_WARNING, summarizePdf } from "@/lib/pdf-ai-engine"

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

export default function SummarizeTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [customInstruction, setCustomInstruction] = useState("")
  const [allowServerProcessing, setAllowServerProcessing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF and opt in to server processing to continue.")

  const [summary, setSummary] = useState("")

  const canSummarize = useMemo(
    () => Boolean(file && allowServerProcessing && !isLoading),
    [allowServerProcessing, file, isLoading]
  )

  const loadFile = useCallback((nextFile: File) => {
    if (!isPdfFile(nextFile)) {
      toast.error("Only PDF files are supported.")
      return
    }

    setFile(nextFile)
    setSummary("")
    setProgress(0)
    setStatus("PDF loaded. Ready for summarization.")
    toast.success("PDF loaded.")
  }, [])

  const runSummarize = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }
    if (!allowServerProcessing) {
      toast.error("Enable server processing to continue.")
      return
    }

    setIsLoading(true)
    setSummary("")
    setProgress(2)
    setStatus("Initialising local summarization pipeline...")

    try {
      const result = await summarizePdf(file, {
        allowServerProcessing: true,
        summaryInstruction: customInstruction.trim() || undefined,
        onProgress: (nextProgress, nextStatus) => {
          setProgress(nextProgress)
          setStatus(nextStatus)
        },
      })

      setSummary(result)
      setProgress(100)
      setStatus("Summary ready.")
      toast.success("Summary generated.")
    } catch (error) {
      setStatus("Summarization failed.")
      const message =
        error instanceof Error ? error.message : "Could not summarize this PDF."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [allowServerProcessing, customInstruction, file])

  const copySummary = useCallback(async () => {
    if (!summary.trim()) {
      toast.error("No summary to copy.")
      return
    }

    try {
      await navigator.clipboard.writeText(summary)
      toast.success("Summary copied.")
    } catch {
      toast.error("Could not copy summary to clipboard.")
    }
  }, [summary])

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
              Text is extracted locally before optional server summarization.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Summarize PDF</CardTitle>
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
                  setSummary("")
                  setProgress(0)
                  setStatus("Upload a PDF and opt in to server processing to continue.")
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
            <Label htmlFor="custom-summary-instruction">Custom summary instructions (optional)</Label>
            <Textarea
              id="custom-summary-instruction"
              value={customInstruction}
              onChange={(event) => setCustomInstruction(event.target.value)}
              placeholder='e.g. "Focus on key points and action items."'
              className="min-h-[90px]"
              disabled={isLoading}
            />
          </div>

          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs font-medium text-amber-200">Server processing warning</p>
            <p className="mt-1 text-xs text-amber-100/90">
              {SERVER_WARNING} Only extracted text is sent to Anthropic.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-md border p-3">
            <Switch
              id="allow-server-processing"
              checked={allowServerProcessing}
              onCheckedChange={setAllowServerProcessing}
              disabled={isLoading}
            />
            <Label htmlFor="allow-server-processing" className="text-sm">
              Allow server processing (text only sent to Anthropic)
            </Label>
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isLoading ? "Summarizing" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={runSummarize}
            disabled={!canSummarize}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Summarize
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {summary ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary Output</CardTitle>
            <CardDescription>Review and copy the generated summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={summary} readOnly className="min-h-[220px]" />
          </CardContent>
          <CardFooter>
            <Button type="button" variant="secondary" onClick={copySummary}>
              <Copy className="h-4 w-4" />
              Copy Summary
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

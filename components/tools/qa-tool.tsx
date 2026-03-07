"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Copy, FileText, HelpCircle, Loader2, Trash2, UploadCloud } from "lucide-react"
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
import {
  consumeAiUsage,
  exhaustAiUsage,
  fetchAiUsageSnapshot,
  type AiUsageSnapshot,
} from "@/lib/ai-usage-client"
import {
  isMonthlyAiLimitReachedError,
  pdfQA,
  SERVER_WARNING,
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

export default function QaTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [allowServerProcessing, setAllowServerProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a PDF, ask a question, and enable server processing.")
  const [answer, setAnswer] = useState("")
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
      trackEvent("AI Limit Reached", { tool: "pdf-qa" })
    }
  }, [monthlyLimitResetDate])

  const canAsk = useMemo(
    () =>
      Boolean(
        file &&
          question.trim().length > 0 &&
          allowServerProcessing &&
          !isLoading
      ),
    [allowServerProcessing, file, isLoading, question]
  )
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
    setAnswer("")
    setProgress(0)
    setStatus("PDF loaded. Ask your question to continue.")
    toast.success("PDF loaded.")
  }, [])

  const runQa = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }
    if (!question.trim()) {
      toast.error("Enter a question first.")
      return
    }
    if (!allowServerProcessing) {
      toast.error("Enable server processing to continue.")
      return
    }

    setIsLoading(true)
    setAnswer("")
    setMonthlyLimitResetDate(null)
    setProgress(2)
    setStatus("Initialising local PDF QA pipeline...")

    try {
      const response = await pdfQA(file, question, {
        allowServerProcessing: true,
        onProgress: (nextProgress, nextStatus) => {
          setProgress(nextProgress)
          setStatus(nextStatus)
        },
      })

      setAnswer(response)
      setMonthlyLimitResetDate(null)
      setAiUsage((current) => consumeAiUsage(current))
      setProgress(100)
      setStatus("Answer ready.")
      toast.success("Answer generated.")
    } catch (error) {
      if (isMonthlyAiLimitReachedError(error)) {
        setMonthlyLimitResetDate(error.resetDate || null)
        setAiUsage((current) => exhaustAiUsage(current))
        setStatus(error.message)
        return
      }

      setStatus("Question answering failed.")
      const message =
        error instanceof Error ? error.message : "Could not answer this question."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [allowServerProcessing, file, question])

  const copyAnswer = useCallback(async () => {
    if (!answer.trim()) {
      toast.error("No answer to copy.")
      return
    }

    try {
      await navigator.clipboard.writeText(answer)
      toast.success("Answer copied.")
    } catch {
      toast.error("Could not copy answer to clipboard.")
    }
  }, [answer])

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
              Text is extracted locally before optional server QA.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Q&A on PDF</CardTitle>
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
                  setQuestion("")
                  setAnswer("")
                  setProgress(0)
                  setStatus("Upload a PDF, ask a question, and enable server processing.")
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
            <Label htmlFor="pdf-question">Ask a question about this document</Label>
            <Textarea
              id="pdf-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What are the main risks and mitigation steps?"
              className="min-h-[90px]"
              disabled={isLoading}
            />
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
              id="allow-server-processing-qa"
              checked={allowServerProcessing}
              onCheckedChange={setAllowServerProcessing}
              disabled={isLoading}
            />
            <Label htmlFor="allow-server-processing-qa" className="text-sm">
              Allow server processing
            </Label>
          </div>

          {(isLoading || progress > 0) && (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">{isLoading ? "Answering" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="w-full sm:w-auto" onClick={runQa} disabled={!canAsk}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Asking...
              </>
            ) : (
              <>
                <HelpCircle className="h-4 w-4" />
                Ask
              </>
            )}
          </Button>
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

      {answer ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Answer</CardTitle>
            <CardDescription>Review and copy the generated answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={answer} readOnly className="min-h-[220px]" />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={copyAnswer}>
              <Copy className="h-4 w-4" />
              Copy Answer
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

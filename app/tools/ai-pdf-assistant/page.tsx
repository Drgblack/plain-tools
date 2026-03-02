"use client"

import { useMemo, useState } from "react"
import { Bot, FileText, Loader2, MessageSquareText, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { summarizePdf, pdfQA, SERVER_WARNING } from "@/lib/pdf-ai-engine"

type ProgressState = {
  progress: number
  status: string
}

export default function AIPdfAssistantPage() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [summary, setSummary] = useState("")
  const [answer, setAnswer] = useState("")
  const [allowServerProcessing, setAllowServerProcessing] = useState(false)
  const [isSummarising, setIsSummarising] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)
  const [error, setError] = useState("")
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    status: "Awaiting input.",
  })

  const canRunSummary = !!file && allowServerProcessing && !isSummarising && !isAnswering
  const canRunQa =
    !!file &&
    !!question.trim() &&
    allowServerProcessing &&
    !isSummarising &&
    !isAnswering

  const fileLabel = useMemo(() => {
    if (!file) return "No file selected"
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    return `${file.name} (${sizeMb} MB)`
  }, [file])

  const handleSummarise = async () => {
    if (!file || !allowServerProcessing) return

    setError("")
    setAnswer("")
    setIsSummarising(true)

    try {
      const result = await summarizePdf(file, {
        allowServerProcessing,
        onProgress: (progress, status) => setProgressState({ progress, status }),
      })
      setSummary(result)
    } catch (scanError) {
      const message =
        scanError instanceof Error
          ? scanError.message
          : "Summarisation failed. Please try again."
      setError(message)
    } finally {
      setIsSummarising(false)
    }
  }

  const handleAsk = async () => {
    if (!file || !question.trim() || !allowServerProcessing) return

    setError("")
    setIsAnswering(true)

    try {
      const response = await pdfQA(file, question, {
        allowServerProcessing,
        onProgress: (progress, status) => setProgressState({ progress, status }),
      })
      setAnswer(response)
    } catch (scanError) {
      const message =
        scanError instanceof Error
          ? scanError.message
          : "Question answering failed. Please try again."
      setError(message)
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-14 md:py-20">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI PDF Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Generate summaries and ask document questions. Extraction runs locally; AI response uses server proxy.
          </p>
        </div>

        <Card className="border-[#333] bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">PDF file</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] || null
                  setFile(nextFile)
                  setSummary("")
                  setAnswer("")
                  setError("")
                  setProgressState({ progress: 0, status: "Awaiting input." })
                }}
              />
              <p className="text-xs text-muted-foreground">{fileLabel}</p>
            </div>

            <div className="rounded-md border border-[#333] bg-muted/20 p-3 text-xs text-foreground/90">
              <p className="font-medium">Server call notice</p>
              <p className="mt-1 text-muted-foreground">{SERVER_WARNING}</p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allowServerProcessing}
                onChange={(event) => setAllowServerProcessing(event.target.checked)}
                className="h-4 w-4 rounded border-[#333]"
              />
              I understand and opt in to server processing for AI responses.
            </label>

            <div className="rounded-md border border-[#333] px-3 py-2">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progressState.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-muted">
                <div
                  className="h-full bg-[#0070f3] transition-all"
                  style={{ width: `${progressState.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{progressState.status}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-[#333] bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-[#0070f3]" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSummarise}
                disabled={!canRunSummary}
                className="w-full border border-[#333] bg-background text-foreground hover:border-[#0070f3] hover:text-[#0070f3]"
                variant="outline"
              >
                {isSummarising ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarising
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Summarise PDF
                  </>
                )}
              </Button>
              <Textarea
                readOnly
                value={summary}
                placeholder="Summary output will appear here."
                className="min-h-[220px] border-[#333] bg-background"
              />
            </CardContent>
          </Card>

          <Card className="border-[#333] bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareText className="h-4 w-4 text-[#0070f3]" />
                Q&A
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about this PDF"
                className="border-[#333] bg-background"
              />
              <Button
                onClick={handleAsk}
                disabled={!canRunQa}
                className="w-full border border-[#333] bg-background text-foreground hover:border-[#0070f3] hover:text-[#0070f3]"
                variant="outline"
              >
                {isAnswering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asking
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Ask PDF
                  </>
                )}
              </Button>
              <Textarea
                readOnly
                value={answer}
                placeholder="Answer output will appear here."
                className="min-h-[220px] border-[#333] bg-background"
              />
            </CardContent>
          </Card>
        </div>

        {error ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  )
}


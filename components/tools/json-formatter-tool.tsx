"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Copy, FileJson, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"

const EXAMPLE_JSON = `{"service":"plain.tools","features":["json formatter","uuid generator","regex tester"],"localProcessing":true}`

function copyText(value: string, successMessage: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(successMessage))
    .catch(() => toast.error("Could not copy to clipboard."))
}

export default function JsonFormatterTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)

  const canProcess = useMemo(() => input.trim().length > 0, [input])

  const parseInput = () => JSON.parse(input)

  const handleFormat = () => {
    if (!canProcess) return
    try {
      const parsed = parseInput()
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
      setIsValid(true)
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "Invalid JSON input."
      setError(message)
      setIsValid(false)
    }
  }

  const handleMinify = () => {
    if (!canProcess) return
    try {
      const parsed = parseInput()
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
      setIsValid(true)
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "Invalid JSON input."
      setError(message)
      setIsValid(false)
    }
  }

  const handleValidate = () => {
    if (!canProcess) return
    try {
      parseInput()
      setError("")
      setIsValid(true)
      toast.success("JSON is valid.")
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "Invalid JSON input."
      setError(message)
      setIsValid(false)
      toast.error("JSON is not valid.")
    }
  }

  return (
    <div className="space-y-5">
      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">JSON Formatter and Validator</CardTitle>
          <CardDescription>
            Format, minify, and validate JSON locally in your browser. No requests are sent to external services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProcessedLocallyBadge />

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              JSON input
            </label>
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='Paste JSON here, for example {"name":"Plain Tools"}'
              rows={10}
              className="font-mono text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleFormat} disabled={!canProcess}>
              <FileJson className="h-4 w-4" />
              Format JSON
            </Button>
            <Button type="button" variant="outline" onClick={handleMinify} disabled={!canProcess}>
              Minify JSON
            </Button>
            <Button type="button" variant="outline" onClick={handleValidate} disabled={!canProcess}>
              Validate JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setInput(EXAMPLE_JSON)
                setOutput("")
                setError("")
                setIsValid(false)
              }}
            >
              Load example
            </Button>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-300">
              <p className="inline-flex items-center gap-1.5 font-medium">
                <AlertTriangle className="h-4 w-4" />
                Invalid JSON
              </p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          ) : null}

          {isValid && !error ? (
            <div className="rounded-lg border border-green-500/35 bg-green-500/10 p-3 text-sm text-green-300">
              <p className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                JSON is valid
              </p>
            </div>
          ) : null}

          {output ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Output
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyText(output, "Formatted JSON copied.")}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
              <Textarea readOnly value={output} rows={10} className="font-mono text-xs" />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}


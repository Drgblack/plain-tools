"use client"

import { useMemo, useState } from "react"
import { Copy, Search } from "lucide-react"
import { toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type RegexMatch = {
  value: string
  index: number
}

const DEFAULT_SAMPLE = `Error: timeout while connecting to db-12
Warning: retrying request for user_104
Error: invalid token for user_212
Info: success for user_104`

function buildHighlightedSegments(source: string, matches: RegexMatch[]) {
  if (matches.length === 0) {
    return [{ type: "text" as const, value: source }]
  }

  const segments: Array<{ type: "text" | "match"; value: string; key: string }> = []
  let cursor = 0

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    if (match.index > cursor) {
      segments.push({
        type: "text",
        value: source.slice(cursor, match.index),
        key: `text-${index}-${cursor}`,
      })
    }
    segments.push({
      type: "match",
      value: match.value,
      key: `match-${index}-${match.index}`,
    })
    cursor = match.index + match.value.length
  }

  if (cursor < source.length) {
    segments.push({
      type: "text",
      value: source.slice(cursor),
      key: `tail-${cursor}`,
    })
  }

  return segments
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("Error:\\s(.+)")
  const [flags, setFlags] = useState("gm")
  const [testInput, setTestInput] = useState(DEFAULT_SAMPLE)

  const regexResult = useMemo(() => {
    try {
      const effectiveFlags = flags.includes("g") ? flags : `${flags}g`
      const regex = new RegExp(pattern, effectiveFlags)
      const matches: RegexMatch[] = []

      for (const match of testInput.matchAll(regex)) {
        const value = match[0]
        const index = match.index ?? 0
        matches.push({ value, index })
        if (value.length === 0) {
          break
        }
      }

      return {
        regex,
        matches,
        error: "",
      }
    } catch (error) {
      return {
        regex: null,
        matches: [] as RegexMatch[],
        error: error instanceof Error ? error.message : "Invalid regular expression.",
      }
    }
  }, [flags, pattern, testInput])

  const highlighted = useMemo(
    () => buildHighlightedSegments(testInput, regexResult.matches),
    [regexResult.matches, testInput]
  )

  const copyMatches = async () => {
    if (regexResult.matches.length === 0) {
      toast.error("No matches to copy.")
      return
    }
    const content = regexResult.matches.map((match) => match.value).join("\n")
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Matches copied.")
    } catch {
      toast.error("Could not copy matches.")
    }
  }

  return (
    <Card className="border-blue-500/25 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">Regex Tester and Debugger</CardTitle>
        <CardDescription>
          Test regular expressions with live match previews. Processing stays in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProcessedLocallyBadge />

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="regex-pattern">Regex pattern</Label>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="Enter regex pattern"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2 sm:w-28">
            <Label htmlFor="regex-flags">Flags</Label>
            <Input
              id="regex-flags"
              value={flags}
              onChange={(event) => setFlags(event.target.value)}
              placeholder="gim"
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regex-input">Test text</Label>
          <Textarea
            id="regex-input"
            value={testInput}
            onChange={(event) => setTestInput(event.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
        </div>

        {regexResult.error ? (
          <div className="rounded-lg border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-300">
            <p className="font-medium">Invalid pattern</p>
            <p className="mt-1 text-xs">{regexResult.error}</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border/70 bg-background/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Search className="h-4 w-4 text-accent" />
                  {regexResult.matches.length} match{regexResult.matches.length === 1 ? "" : "es"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyMatches}
                  disabled={regexResult.matches.length === 0}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy matches
                </Button>
              </div>
              <div className="mt-3 max-h-56 overflow-auto rounded-md border border-border/60 bg-card/40 p-3 text-xs leading-relaxed">
                {highlighted.map((segment) =>
                  segment.type === "match" ? (
                    <mark key={segment.key} className="rounded bg-blue-500/30 px-0.5 text-foreground">
                      {segment.value}
                    </mark>
                  ) : (
                    <span key={segment.key}>{segment.value}</span>
                  )
                )}
              </div>
            </div>

            {regexResult.matches.length > 0 ? (
              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Match details
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {regexResult.matches.slice(0, 20).map((match, index) => (
                    <li key={`${match.index}-${index}`}>
                      <span className="font-medium text-foreground">#{index + 1}</span>{" "}
                      at index {match.index}:{" "}
                      <code className="rounded bg-card px-1 py-0.5 text-foreground">{match.value}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}

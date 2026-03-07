"use client"

import { useMemo, useState } from "react"
import { Copy, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type UuidVersion = "v4" | "v7"

const MAX_UUID_COUNT = 200

function formatUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function generateV4Uuid() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return formatUuid(bytes)
}

function generateV7Uuid() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const timestamp = BigInt(Date.now())

  bytes[0] = Number((timestamp >> 40n) & 0xffn)
  bytes[1] = Number((timestamp >> 32n) & 0xffn)
  bytes[2] = Number((timestamp >> 24n) & 0xffn)
  bytes[3] = Number((timestamp >> 16n) & 0xffn)
  bytes[4] = Number((timestamp >> 8n) & 0xffn)
  bytes[5] = Number(timestamp & 0xffn)
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return formatUuid(bytes)
}

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState<UuidVersion>("v4")
  const [countInput, setCountInput] = useState("5")
  const [uuids, setUuids] = useState<string[]>([])

  const count = useMemo(() => {
    const numeric = Number.parseInt(countInput, 10)
    if (!Number.isFinite(numeric) || numeric <= 0) return 1
    return Math.min(numeric, MAX_UUID_COUNT)
  }, [countInput])

  const handleGenerate = () => {
    const generated = Array.from({ length: count }, () =>
      version === "v4" ? generateV4Uuid() : generateV7Uuid()
    )
    setUuids(generated)
  }

  const copyAll = async () => {
    if (uuids.length === 0) {
      toast.error("Generate UUIDs first.")
      return
    }
    try {
      await navigator.clipboard.writeText(uuids.join("\n"))
      toast.success("UUID list copied.")
    } catch {
      toast.error("Could not copy UUID list.")
    }
  }

  const downloadAsText = () => {
    if (uuids.length === 0) {
      toast.error("Generate UUIDs first.")
      return
    }
    const blob = new Blob([uuids.join("\n")], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `uuid-${version}-list.txt`
    link.click()
    URL.revokeObjectURL(url)
    notifyLocalDownloadSuccess()
  }

  return (
    <Card className="border-blue-500/25 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">UUID Generator</CardTitle>
        <CardDescription>
          Generate UUID v4 and v7 values instantly in your browser. No network calls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProcessedLocallyBadge />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="uuid-version">UUID version</Label>
            <Select value={version} onValueChange={(value) => setVersion(value as UuidVersion)}>
              <SelectTrigger id="uuid-version">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4">Version 4 (random)</SelectItem>
                <SelectItem value="v7">Version 7 (time-ordered)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uuid-count">How many UUIDs</Label>
            <Input
              id="uuid-count"
              inputMode="numeric"
              value={countInput}
              onChange={(event) => setCountInput(event.target.value)}
              placeholder="5"
            />
            <p className="text-xs text-muted-foreground">Maximum {MAX_UUID_COUNT} per run.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleGenerate}>
            <RefreshCw className="h-4 w-4" />
            Generate UUIDs
          </Button>
          <Button type="button" variant="outline" onClick={copyAll} disabled={uuids.length === 0}>
            <Copy className="h-4 w-4" />
            Copy list
          </Button>
          <Button type="button" variant="outline" onClick={downloadAsText} disabled={uuids.length === 0}>
            <Download className="h-4 w-4" />
            Download .txt
          </Button>
        </div>

        <div className="rounded-lg border border-border/70 bg-background/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Generated UUIDs
          </p>
          {uuids.length > 0 ? (
            <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
              {uuids.join("\n")}
            </pre>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Generate UUIDs to see output here.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

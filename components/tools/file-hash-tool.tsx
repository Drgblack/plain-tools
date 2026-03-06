"use client"

import { Copy, FileCode2, Loader2, RotateCcw } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
} from "@/lib/pdf-client-utils"
import { digestHex, type SupportedHashAlgorithm } from "@/lib/file-hash"

type HashResult = {
  algorithm: SupportedHashAlgorithm
  hex: string
  byteLength: number
}

const MAX_HASH_FILE_BYTES = 1024 * 1024 * 1024

const ALGORITHMS: Array<{ label: string; value: SupportedHashAlgorithm }> = [
  { label: "SHA-256 (recommended)", value: "SHA-256" },
  { label: "MD5", value: "MD5" },
  { label: "SHA-1", value: "SHA-1" },
  { label: "SHA-512", value: "SHA-512" },
]

const readFileAsArrayBuffer = (file: File) =>
  new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (result instanceof ArrayBuffer) {
        resolve(result)
        return
      }
      reject(new Error("Could not read file as ArrayBuffer."))
    }
    reader.onerror = () => reject(new Error("Could not read file."))
    reader.readAsArrayBuffer(file)
  })

export default function FileHashTool() {
  const [file, setFile] = useState<File | null>(null)
  const [algorithm, setAlgorithm] = useState<SupportedHashAlgorithm>("SHA-256")
  const [isHashing, setIsHashing] = useState(false)
  const [status, setStatus] = useState("Upload a file and compute a local hash checksum.")
  const [result, setResult] = useState<HashResult | null>(null)

  const canHash = useMemo(() => Boolean(file && !isHashing), [file, isHashing])

  const handleFile = useCallback((candidate: File) => {
    try {
      ensureSafeLocalFileSize(candidate, MAX_HASH_FILE_BYTES)
      setFile(candidate)
      setResult(null)
      setStatus(`Ready to hash ${candidate.name}.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not use this file."
      setStatus(message)
      toast.error(message)
    }
  }, [])

  const computeHash = useCallback(async () => {
    if (!file) {
      toast.error("Choose a file first.")
      return
    }

    setIsHashing(true)
    setStatus(`Computing ${algorithm} hash locally...`)
    setResult(null)

    try {
      const buffer = await readFileAsArrayBuffer(file)
      const bytes = new Uint8Array(buffer)
      const hex = await digestHex(bytes, algorithm)

      setResult({
        algorithm,
        hex,
        byteLength: bytes.byteLength,
      })
      setStatus("Checksum ready.")
      toast.success("Hash computed.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hashing failed."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsHashing(false)
    }
  }, [algorithm, file])

  const copyHash = useCallback(async () => {
    if (!result?.hex) {
      toast.error("No hash to copy.")
      return
    }

    try {
      await navigator.clipboard.writeText(result.hex)
      toast.success("Checksum copied.")
    } catch {
      toast.error("Could not copy checksum.")
    }
  }, [result?.hex])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">File Hash / Checksum</CardTitle>
          <CardDescription>
            Compute checksums locally in your browser using SHA-256, MD5, SHA-1, or SHA-512. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            accept="*/*"
            title="Drop a file here, or click to browse"
            subtitle="Hashing runs locally with browser APIs"
            disabled={isHashing}
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
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hash settings</CardTitle>
          <CardDescription>{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected yet.</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="hash-algorithm">Algorithm</Label>
            <select
              id="hash-algorithm"
              value={algorithm}
              disabled={isHashing}
              onChange={(event) => setAlgorithm(event.target.value as SupportedHashAlgorithm)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              {ALGORITHMS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={!canHash} onClick={() => void computeHash()}>
              {isHashing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Computing...
                </>
              ) : (
                <>
                  <FileCode2 className="h-4 w-4" />
                  Compute checksum
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isHashing}
              onClick={() => {
                setFile(null)
                setResult(null)
                setAlgorithm("SHA-256")
                setStatus("Upload a file and compute a local hash checksum.")
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Checksum result</CardTitle>
            <CardDescription>
              {result.algorithm} for {formatFileSize(result.byteLength)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <div className="rounded-md border bg-muted/25 p-3">
              <p className="break-all font-mono text-xs text-foreground sm:text-sm">{result.hex}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => void copyHash()}>
              <Copy className="h-4 w-4" />
              Copy checksum
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

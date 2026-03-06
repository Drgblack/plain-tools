"use client"

import { useEffect, useMemo, useState } from "react"
import { Copy, Download, FileCode2, Loader2, RotateCcw } from "lucide-react"
import { Toaster, toast } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type DecodeFileOutput = {
  url: string
  name: string
  mimeType: string
  size: number
}

type ParsedBase64 = {
  payload: string
  mimeType: string | null
}

const CHUNK_SIZE = 0x8000

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = ""
  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + CHUNK_SIZE)
    for (let index = 0; index < chunk.length; index += 1) {
      binary += String.fromCharCode(chunk[index])
    }
  }
  return window.btoa(binary)
}

const base64ToBytes = (base64: string) => {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

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

const readFileAsText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result)
        return
      }
      reject(new Error("Could not read file as text."))
    }
    reader.onerror = () => reject(new Error("Could not read file."))
    reader.readAsText(file)
  })

const parseBase64Input = (value: string): ParsedBase64 => {
  const trimmed = value.trim()
  const dataUrlMatch = trimmed.match(/^data:([^;,]+)?;base64,(.+)$/is)
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1] || null,
      payload: dataUrlMatch[2].replace(/\s+/g, ""),
    }
  }
  return {
    mimeType: null,
    payload: trimmed.replace(/\s+/g, ""),
  }
}

const copyToClipboard = async (value: string) => {
  if (!value) {
    toast.error("Nothing to copy yet.")
    return
  }
  try {
    await navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard.")
  } catch {
    toast.error("Could not copy to clipboard.")
  }
}

export default function Base64Tool() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode")
  const [encodeSource, setEncodeSource] = useState<"text" | "file">("text")
  const [decodeSource, setDecodeSource] = useState<"text" | "file">("text")
  const [decodeTarget, setDecodeTarget] = useState<"text" | "file">("text")
  const [encodeText, setEncodeText] = useState("")
  const [encodeFile, setEncodeFile] = useState<File | null>(null)
  const [decodeFile, setDecodeFile] = useState<File | null>(null)
  const [includeDataUrlPrefix, setIncludeDataUrlPrefix] = useState(false)
  const [encodeOutput, setEncodeOutput] = useState("")
  const [decodeInput, setDecodeInput] = useState("")
  const [decodedText, setDecodedText] = useState("")
  const [decodeFileName, setDecodeFileName] = useState("decoded-file.bin")
  const [decodeMimeType, setDecodeMimeType] = useState("application/octet-stream")
  const [decodedFile, setDecodedFile] = useState<DecodeFileOutput | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState("Ready to encode or decode locally.")

  useEffect(() => {
    return () => {
      if (decodedFile?.url) {
        URL.revokeObjectURL(decodedFile.url)
      }
    }
  }, [decodedFile])

  const canEncode = useMemo(() => {
    if (isProcessing) return false
    if (encodeSource === "text") return encodeText.trim().length > 0
    return Boolean(encodeFile)
  }, [encodeFile, encodeSource, encodeText, isProcessing])

  const canDecode = useMemo(() => {
    if (isProcessing) return false
    if (decodeSource === "text") return decodeInput.trim().length > 0
    return Boolean(decodeFile)
  }, [decodeFile, decodeInput, decodeSource, isProcessing])

  const clearDecodeFile = () => {
    if (decodedFile?.url) {
      URL.revokeObjectURL(decodedFile.url)
    }
    setDecodedFile(null)
  }

  const handleEncode = async () => {
    if (!canEncode) {
      toast.error("Add text or select a file first.")
      return
    }

    setIsProcessing(true)
    setStatus("Encoding locally...")
    setEncodeOutput("")

    try {
      if (encodeSource === "text") {
        const textBytes = new TextEncoder().encode(encodeText)
        const base64 = bytesToBase64(textBytes)
        setEncodeOutput(base64)
        setStatus("Text encoded to Base64.")
      } else if (encodeFile) {
        const buffer = await readFileAsArrayBuffer(encodeFile)
        const bytes = new Uint8Array(buffer)
        const base64 = bytesToBase64(bytes)
        const prefixed =
          includeDataUrlPrefix && encodeFile.type
            ? `data:${encodeFile.type};base64,${base64}`
            : base64
        setEncodeOutput(prefixed)
        setStatus(`Encoded ${encodeFile.name} to Base64.`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Encoding failed."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecode = async () => {
    if (!canDecode) {
      toast.error("Paste Base64 input or select a Base64 file first.")
      return
    }

    setIsProcessing(true)
    setStatus("Decoding locally...")
    setDecodedText("")
    clearDecodeFile()

    try {
      const rawInput =
        decodeSource === "text"
          ? decodeInput
          : decodeFile
            ? await readFileAsText(decodeFile)
            : ""
      const parsed = parseBase64Input(rawInput)
      if (!parsed.payload) {
        throw new Error("Base64 input is empty.")
      }

      const bytes = base64ToBytes(parsed.payload)

      if (decodeTarget === "text") {
        const text = new TextDecoder().decode(bytes)
        setDecodedText(text)
        setStatus("Base64 decoded to text.")
      } else {
        const resolvedMimeType = parsed.mimeType || decodeMimeType.trim() || "application/octet-stream"
        const resolvedFileName = decodeFileName.trim() || "decoded-file.bin"
        const blob = new Blob([bytes], { type: resolvedMimeType })
        const url = URL.createObjectURL(blob)
        setDecodedFile({
          url,
          name: resolvedFileName,
          mimeType: resolvedMimeType,
          size: blob.size,
        })
        setStatus(`Base64 decoded to file (${resolvedFileName}).`)
      }
    } catch {
      setStatus("Could not decode input. Confirm the Base64 data is valid.")
      toast.error("Invalid Base64 input.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadEncodeOutput = () => {
    if (!encodeOutput) {
      toast.error("No Base64 output to download.")
      return
    }
    const blob = new Blob([encodeOutput], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const baseName = encodeFile?.name?.replace(/[^\w.-]/g, "_") || "base64-output"
    a.href = url
    a.download = `${baseName}.txt`
    a.click()
    URL.revokeObjectURL(url)
    notifyLocalDownloadSuccess()
  }

  const resetEncode = () => {
    setEncodeText("")
    setEncodeFile(null)
    setEncodeOutput("")
    setStatus("Ready to encode.")
  }

  const resetDecode = () => {
    setDecodeInput("")
    setDecodeFile(null)
    setDecodedText("")
    clearDecodeFile()
    setStatus("Ready to decode.")
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Base64 Encode / Decode</CardTitle>
          <CardDescription>
            Process text and files locally in your browser. No uploads, no server-side processing.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "encode" | "decode")}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Encode input</CardTitle>
              <CardDescription>{status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={encodeSource === "text" ? "default" : "outline"}
                  onClick={() => setEncodeSource("text")}
                >
                  Text input
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={encodeSource === "file" ? "default" : "outline"}
                  onClick={() => setEncodeSource("file")}
                >
                  File input
                </Button>
              </div>

              {encodeSource === "text" ? (
                <Textarea
                  value={encodeText}
                  onChange={(event) => setEncodeText(event.target.value)}
                  placeholder="Enter text to encode as Base64"
                  rows={8}
                />
              ) : (
                <div className="space-y-3">
                  <PdfFileDropzone
                    accept="*/*"
                    title="Drop a file here, or click to browse"
                    subtitle="Any file type supported for Base64 encoding"
                    onFilesSelected={(files) => {
                      const selected = files[0]
                      if (selected) {
                        setEncodeFile(selected)
                        setStatus(`Selected ${selected.name}`)
                      }
                    }}
                  />
                  {encodeFile ? (
                    <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                      <p className="font-medium text-foreground">{encodeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(encodeFile.size)}{encodeFile.type ? ` • ${encodeFile.type}` : ""}
                      </p>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={includeDataUrlPrefix}
                      onChange={(event) => setIncludeDataUrlPrefix(event.target.checked)}
                    />
                    Include data URL prefix in output when file type is known
                  </label>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void handleEncode()} disabled={!canEncode}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCode2 className="h-4 w-4" />}
                  Encode
                </Button>
                <Button type="button" variant="outline" onClick={resetEncode} disabled={isProcessing}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {encodeOutput ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Base64 output</CardTitle>
                <CardDescription>Output is ready. Copy it or download as a text file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProcessedLocallyBadge />
                <Textarea value={encodeOutput} readOnly rows={8} />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => void copyToClipboard(encodeOutput)}>
                    <Copy className="h-4 w-4" />
                    Copy output
                  </Button>
                  <Button type="button" variant="outline" onClick={downloadEncodeOutput}>
                    <Download className="h-4 w-4" />
                    Download .txt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="decode" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Decode input</CardTitle>
              <CardDescription>{status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={decodeSource === "text" ? "default" : "outline"}
                  onClick={() => setDecodeSource("text")}
                >
                  Base64 text
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={decodeSource === "file" ? "default" : "outline"}
                  onClick={() => setDecodeSource("file")}
                >
                  Base64 file
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={decodeTarget === "text" ? "default" : "outline"}
                  onClick={() => setDecodeTarget("text")}
                >
                  To text
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={decodeTarget === "file" ? "default" : "outline"}
                  onClick={() => setDecodeTarget("file")}
                >
                  To file
                </Button>
              </div>

              {decodeSource === "text" ? (
                <Textarea
                  value={decodeInput}
                  onChange={(event) => setDecodeInput(event.target.value)}
                  placeholder="Paste Base64 input here (plain Base64 or data URL format)"
                  rows={8}
                />
              ) : (
                <div className="space-y-3">
                  <PdfFileDropzone
                    accept=".txt,text/plain,*/*"
                    title="Drop a Base64 text file, or click to browse"
                    subtitle="The selected file should contain plain Base64 or a data URL."
                    onFilesSelected={(files) => {
                      const selected = files[0]
                      if (selected) {
                        setDecodeFile(selected)
                        setStatus(`Selected ${selected.name} for decoding.`)
                      }
                    }}
                  />
                  {decodeFile ? (
                    <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                      <p className="font-medium text-foreground">{decodeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(decodeFile.size)}
                        {decodeFile.type ? ` • ${decodeFile.type}` : ""}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {decodeTarget === "file" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">File name</p>
                    <Input
                      value={decodeFileName}
                      onChange={(event) => setDecodeFileName(event.target.value)}
                      placeholder="decoded-file.bin"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">MIME type (optional)</p>
                    <Input
                      value={decodeMimeType}
                      onChange={(event) => setDecodeMimeType(event.target.value)}
                      placeholder="application/octet-stream"
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void handleDecode()} disabled={!canDecode}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCode2 className="h-4 w-4" />}
                  Decode
                </Button>
                <Button type="button" variant="outline" onClick={resetDecode} disabled={isProcessing}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {decodeTarget === "text" && decodedText ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Decoded text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProcessedLocallyBadge />
                <Textarea value={decodedText} readOnly rows={8} />
                <Button type="button" variant="outline" onClick={() => void copyToClipboard(decodedText)}>
                  <Copy className="h-4 w-4" />
                  Copy text
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {decodeTarget === "file" && decodedFile ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Decoded file is ready</CardTitle>
                <CardDescription>
                  {decodedFile.name} • {formatBytes(decodedFile.size)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProcessedLocallyBadge />
                <p className="text-sm text-muted-foreground">MIME type: {decodedFile.mimeType}</p>
                <Button asChild>
                  <a
                    href={decodedFile.url}
                    download={decodedFile.name}
                    onClick={() => notifyLocalDownloadSuccess()}
                  >
                    <Download className="h-4 w-4" />
                    Download file
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}

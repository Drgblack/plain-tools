"use client"

import { Download, Loader2, ShieldCheck, Trash2, Unlock } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useObjectUrlState } from "@/hooks/use-object-url-state"
import {
  ensureSafeLocalFileSize,
  formatFileSize,
  isPdfLikeFile,
} from "@/lib/pdf-client-utils"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { removePDFPassword } from "@/lib/pdf-security-engines"

const MAX_UNLOCK_PDF_BYTES = 200 * 1024 * 1024

type UnlockResult = {
  fileName: string
  sizeBytes: number
}

const getFriendlyUnlockError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Could not unlock this PDF."
  const lower = message.toLowerCase()

  if (lower.includes("verify the password") || lower.includes("password")) {
    return "Incorrect password. Please check and try again."
  }

  return message
}

export default function UnlockPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload an encrypted PDF and enter the password to unlock it locally."
  )
  const [result, setResult] = useState<UnlockResult | null>(null)
  const { url: downloadUrl, clearUrl, setUrlFromBlob } = useObjectUrlState()

  const clearResult = useCallback(() => {
    clearUrl()
    setResult(null)
  }, [clearUrl])

  const handlePdfFile = useCallback(
    (candidate: File) => {
      try {
        if (!isPdfLikeFile(candidate)) {
          toast.error("Only PDF files are supported.")
          return
        }

        ensureSafeLocalFileSize(candidate, MAX_UNLOCK_PDF_BYTES)
        setFile(candidate)
        setStatus("Ready to unlock.")
        setProgress(0)
        clearResult()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not use this file."
        setStatus(message)
        toast.error(message)
      }
    },
    [clearResult]
  )

  const canUnlock = useMemo(
    () => Boolean(file && password.trim().length > 0 && !isUnlocking),
    [file, isUnlocking, password]
  )

  const unlockPdf = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    const unlockPassword = password.trim()
    if (!unlockPassword) {
      toast.error("Enter the PDF password.")
      return
    }

    setIsUnlocking(true)
    setProgress(12)
    setStatus("Removing password protection locally...")
    clearResult()

    try {
      const unlockedBytes = await removePDFPassword(file, unlockPassword)
      setProgress(86)
      const outputBlob = new Blob([unlockedBytes], { type: "application/pdf" })
      setUrlFromBlob(outputBlob)
      setResult({
        fileName: "unlocked.pdf",
        sizeBytes: outputBlob.size,
      })
      setProgress(100)
      setStatus("Done. Your unlocked PDF is ready.")
      toast.success("PDF unlocked successfully.")
    } catch (error) {
      const friendly = getFriendlyUnlockError(error)
      setStatus(friendly)
      toast.error(friendly)
    } finally {
      setIsUnlocking(false)
    }
  }, [clearResult, file, password, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Offline PDF unlock</CardTitle>
          <CardDescription>
            Offline unlock. Files never leave your device. Only works if you have the password.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isUnlocking}
            title="Drop an encrypted PDF here, or click to browse"
            subtitle="Unlock PDF locally in your browser with your password"
            onFilesSelected={(files) => {
              const first = files[0]
              if (first) {
                handlePdfFile(first)
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Unlock PDF</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="unlock-password">Password</Label>
            <Input
              id="unlock-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter PDF password"
              disabled={isUnlocking}
            />
          </div>

          {(isUnlocking || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isUnlocking ? "Unlocking" : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={unlockPdf}
            disabled={!canUnlock}
          >
            {isUnlocking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Unlock PDF
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setPassword("")
              setFile(null)
              setProgress(0)
              setStatus("Upload an encrypted PDF and enter the password to unlock it locally.")
              clearResult()
            }}
            disabled={isUnlocking}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download unlocked PDF</CardTitle>
            <CardDescription>
              {result.fileName} • {formatFileSize(result.sizeBytes)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a
                href={downloadUrl}
                download={result.fileName}
                onClick={() => notifyLocalDownloadSuccess()}
              >
                <Download className="h-4 w-4" />
                Download unlocked.pdf
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              This output should open without a password in standard PDF viewers.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/60 bg-card/70">
        <CardContent className="pt-6 text-xs text-muted-foreground">
          Offline unlock. Files never leave your device. Only works if you have the password.
        </CardContent>
      </Card>
    </div>
  )
}

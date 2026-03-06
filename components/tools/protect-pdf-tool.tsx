"use client"

import { Download, Loader2, ShieldCheck, Trash2 } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Toaster, toast } from "sonner"

import { PdfFileDropzone } from "@/components/tools/shared/pdf-file-dropzone"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { plainProtectPdf } from "@/lib/pdf-security-engines"

const MAX_PROTECT_PDF_BYTES = 200 * 1024 * 1024

type ProtectResult = {
  fileName: string
  sizeBytes: number
}

export default function ProtectPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [requirePasswordToOpen, setRequirePasswordToOpen] = useState(true)
  const [isProtecting, setIsProtecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(
    "Upload a PDF and set a password to apply local protection."
  )
  const [result, setResult] = useState<ProtectResult | null>(null)
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

        ensureSafeLocalFileSize(candidate, MAX_PROTECT_PDF_BYTES)
        setFile(candidate)
        setStatus("Ready to protect.")
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

  const canProtect = useMemo(
    () =>
      Boolean(
        file &&
          !isProtecting &&
          password.trim().length > 0 &&
          confirmPassword.trim().length > 0 &&
          requirePasswordToOpen
      ),
    [confirmPassword, file, isProtecting, password, requirePasswordToOpen]
  )

  const protectPdf = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    const userPassword = password.trim()
    const userConfirm = confirmPassword.trim()

    if (!userPassword || !userConfirm) {
      toast.error("Enter and confirm a password.")
      return
    }

    if (userPassword !== userConfirm) {
      toast.error("Passwords do not match.")
      return
    }

    if (!requirePasswordToOpen) {
      toast.error("Enable 'Require password to open' to continue.")
      return
    }

    setIsProtecting(true)
    setProgress(10)
    setStatus("Applying password protection locally...")
    clearResult()

    try {
      const protectedBytes = await plainProtectPdf(file, userPassword, {
        requirePasswordToOpen,
      })
      setProgress(85)

      const outputBlob = new Blob([protectedBytes], { type: "application/pdf" })
      setUrlFromBlob(outputBlob)
      setResult({
        fileName: "protected.pdf",
        sizeBytes: outputBlob.size,
      })
      setProgress(100)
      setStatus("Done. Your protected PDF is ready.")
      toast.success("PDF protection complete.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not protect this PDF."
      setStatus(message)
      toast.error(message)
    } finally {
      setIsProtecting(false)
    }
  }, [clearResult, confirmPassword, file, password, requirePasswordToOpen, setUrlFromBlob])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <Card className="border-blue-500/25 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Offline PDF protection</CardTitle>
          <CardDescription>
            Offline protection. Files never leave your device.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PdfFileDropzone
            disabled={isProtecting}
            title="Drop a PDF here, or click to browse"
            subtitle="Apply password protection locally in your browser"
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
          <CardTitle className="text-base">Protect PDF</CardTitle>
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
            <Label htmlFor="protect-password">Password</Label>
            <Input
              id="protect-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              disabled={isProtecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="protect-password-confirm">Confirm password</Label>
            <Input
              id="protect-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter password"
              disabled={isProtecting}
            />
          </div>

          <label className="flex min-h-[44px] items-center gap-3 rounded-md border px-3 py-2 text-sm">
            <Checkbox
              checked={requirePasswordToOpen}
              onCheckedChange={(checked) => setRequirePasswordToOpen(checked === true)}
              disabled={isProtecting}
              aria-label="Require password to open"
            />
            Require password to open
          </label>

          {(isProtecting || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isProtecting ? "Protecting" : "Complete"}</span>
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
            onClick={protectPdf}
            disabled={!canProtect}
          >
            {isProtecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Protecting...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Protect PDF
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setPassword("")
              setConfirmPassword("")
              setFile(null)
              setProgress(0)
              setStatus("Upload a PDF and set a password to apply local protection.")
              setRequirePasswordToOpen(true)
              clearResult()
            }}
            disabled={isProtecting}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && downloadUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Download protected PDF</CardTitle>
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
                Download protected.pdf
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              This output should prompt for password in standard PDF viewers.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/60 bg-card/70">
        <CardContent className="pt-6 text-xs text-muted-foreground">
          Best-effort offline protection. Encryption support depends on PDF viewer compatibility.
          No file data is uploaded.
        </CardContent>
      </Card>
    </div>
  )
}

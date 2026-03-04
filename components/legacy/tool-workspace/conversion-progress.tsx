"use client"

import { useState, useEffect } from "react"
import { FileText, Download, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolWorkspace } from "./index"

type ConversionStatus = "initialising" | "processing" | "complete" | "error"

interface ConversionProgressProps {
  fileName?: string
  outputFormat?: string
  onComplete?: () => void
}

export function ConversionProgress({ 
  fileName = "document.pdf",
  outputFormat = "Word Document (.docx)",
  onComplete
}: ConversionProgressProps) {
  const [status, setStatus] = useState<ConversionStatus>("initialising")
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Initialising Local Engine")

  useEffect(() => {
    // Simulate conversion process
    const stages = [
      { status: "initialising" as const, message: "Initialising Local Engine", duration: 1500, endProgress: 10 },
      { status: "processing" as const, message: "Loading WebAssembly modules", duration: 1000, endProgress: 25 },
      { status: "processing" as const, message: "Parsing PDF structure", duration: 1500, endProgress: 45 },
      { status: "processing" as const, message: "Extracting text and formatting", duration: 2000, endProgress: 70 },
      { status: "processing" as const, message: "Generating output document", duration: 1500, endProgress: 90 },
      { status: "processing" as const, message: "Finalising conversion", duration: 800, endProgress: 100 },
      { status: "complete" as const, message: "Conversion complete", duration: 0, endProgress: 100 },
    ]

    let currentStage = 0
    let animationFrame: number

    const processStages = () => {
      if (currentStage >= stages.length) return

      const stage = stages[currentStage]
      setStatus(stage.status)
      setStatusMessage(stage.message)

      // Animate progress
      const startProgress = currentStage > 0 ? stages[currentStage - 1].endProgress : 0
      const targetProgress = stage.endProgress
      const duration = stage.duration
      const startTime = Date.now()

      const animateProgress = () => {
        const elapsed = Date.now() - startTime
        const progressRatio = Math.min(elapsed / duration, 1)
        const currentProgress = startProgress + (targetProgress - startProgress) * progressRatio
        setProgress(Math.round(currentProgress))

        if (progressRatio < 1) {
          animationFrame = requestAnimationFrame(animateProgress)
        } else {
          currentStage++
          if (currentStage < stages.length) {
            setTimeout(processStages, 200)
          } else {
            onComplete?.()
          }
        }
      }

      if (duration > 0) {
        animateProgress()
      } else {
        setProgress(targetProgress)
        onComplete?.()
      }
    }

    processStages()

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [onComplete])

  return (
    <ToolWorkspace 
      title="PDF to Word Conversion" 
      fileName={fileName}
      privacyBannerText="Converting Locally"
    >
      <div className="flex-1 flex items-center justify-center p-8 bg-[oklch(0.11_0.005_250)]">
        <div className="w-full max-w-md text-center">
          {/* File Icon */}
          <div className="mb-8 flex justify-center">
            <div className={`relative flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-500 ${
              status === "complete" 
                ? "bg-green-500/20 ring-2 ring-green-500/30" 
                : "bg-accent/15 ring-2 ring-accent/25"
            }`}>
              {status === "complete" ? (
                <CheckCircle2 className="h-12 w-12 text-green-400" strokeWidth={1.5} />
              ) : status === "initialising" ? (
                <Loader2 className="h-12 w-12 text-accent animate-spin" strokeWidth={1.5} />
              ) : (
                <FileText className="h-12 w-12 text-accent" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Status Text */}
          <h2 className="text-[18px] font-semibold text-foreground mb-2">
            {status === "complete" ? "Conversion Complete" : "Converting to " + outputFormat}
          </h2>
          <p className="text-[13px] text-muted-foreground/70 mb-6">
            {fileName}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
                  status === "complete" ? "bg-green-500" : "bg-accent"
                }`}
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer effect while processing */}
              {status === "processing" && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-y-0 w-1/3 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {status !== "complete" && (
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            )}
            <span className="text-[13px] text-muted-foreground/80">
              {statusMessage}
            </span>
            {status !== "complete" && status !== "initialising" && (
              <span className="text-[13px] font-medium text-accent">{progress}%</span>
            )}
          </div>

          {/* Download Button */}
          {status === "complete" && (
            <Button
              size="lg"
              className="gap-2 bg-accent text-white hover:bg-accent-hover"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Download {outputFormat}
            </Button>
          )}

          {/* Privacy Note */}
          <p className="mt-8 text-[11px] text-muted-foreground/50">
            All conversion processing happens locally in your browser using WebAssembly.
            <br />
            Your files are never uploaded to any server.
          </p>
        </div>
      </div>
    </ToolWorkspace>
  )
}

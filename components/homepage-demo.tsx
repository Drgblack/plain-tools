"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DemoMode = "compress" | "metadata" | "redact"
type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")
type PdfLibModule = typeof import("pdf-lib")
type PdfBatchEngineModule = typeof import("@/lib/pdf-batch-engine")
type PdfSecurityEnginesModule = typeof import("@/lib/pdf-security-engines")

type PreviewImage = {
  url: string
  width: number
  height: number
}

type CompressionResult = {
  originalSize: number
  compressedSize: number
  savingsPercent: number
  beforePreview: PreviewImage | null
  afterPreview: PreviewImage | null
}

type MetadataField = {
  name: string
  value: string
}

type MetadataResult = {
  removedCount: number
  remainingCount: number
}

type RedactionResult = {
  beforePreview: PreviewImage
  afterPreview: PreviewImage
}

let pdfJsModulePromise: Promise<PdfJsModule> | null = null
let pdfLibModulePromise: Promise<PdfLibModule> | null = null
let pdfBatchEngineModulePromise: Promise<PdfBatchEngineModule> | null = null
let pdfSecurityEnginesModulePromise: Promise<PdfSecurityEnginesModule> | null = null

const getPdfJs = async () => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }

  return pdfJsModulePromise
}

const getPdfLib = async () => {
  if (!pdfLibModulePromise) {
    pdfLibModulePromise = import("pdf-lib")
  }
  return pdfLibModulePromise
}

const getPdfBatchEngine = async () => {
  if (!pdfBatchEngineModulePromise) {
    pdfBatchEngineModulePromise = import("@/lib/pdf-batch-engine")
  }
  return pdfBatchEngineModulePromise
}

const getPdfSecurityEngines = async () => {
  if (!pdfSecurityEnginesModulePromise) {
    pdfSecurityEnginesModulePromise = import("@/lib/pdf-security-engines")
  }
  return pdfSecurityEnginesModulePromise
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })

const getBlobDimensions = async (blob: Blob): Promise<{ width: number; height: number }> => {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob)
    const dimensions = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return dimensions
  }

  return { width: 640, height: 900 }
}

const extractMetadataFields = async (file: File): Promise<MetadataField[]> => {
  const { PDFDocument } = await getPdfLib()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pdfDoc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  const creationDate = pdfDoc.getCreationDate()
  const modificationDate = pdfDoc.getModificationDate()
  const keywords = pdfDoc.getKeywords()

  const fields: MetadataField[] = [
    { name: "Title", value: pdfDoc.getTitle() ?? "" },
    { name: "Author", value: pdfDoc.getAuthor() ?? "" },
    { name: "Creator", value: pdfDoc.getCreator() ?? "" },
    { name: "Producer", value: pdfDoc.getProducer() ?? "" },
    { name: "Subject", value: pdfDoc.getSubject() ?? "" },
    { name: "Keywords", value: Array.isArray(keywords) ? keywords.join(", ") : "" },
    { name: "Creation Date", value: creationDate ? creationDate.toISOString() : "" },
    { name: "Modification Date", value: modificationDate ? modificationDate.toISOString() : "" },
  ]

  return fields.filter((field) => field.value.trim().length > 0)
}

export function HomepageDemo() {
  const [sampleFile, setSampleFile] = useState<File | null>(null)
  const [samplePageCount, setSamplePageCount] = useState(0)
  const [sampleSize, setSampleSize] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeMode, setActiveMode] = useState<DemoMode>("compress")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Loading demo sample...")
  const [error, setError] = useState<string | null>(null)

  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null)
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([])
  const [removedMetadataFields, setRemovedMetadataFields] = useState<string[]>([])
  const [metadataResult, setMetadataResult] = useState<MetadataResult | null>(null)
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null)

  const runRef = useRef(0)
  const previewUrlsRef = useRef<string[]>([])

  const effectiveMode: DemoMode = isMobile ? "compress" : activeMode

  const modeLabel = useMemo(() => {
    if (effectiveMode === "compress") return "Compression"
    if (effectiveMode === "metadata") return "Metadata Purge"
    return "Redaction"
  }, [effectiveMode])

  const revokePreviewUrls = useCallback(() => {
    for (const url of previewUrlsRef.current) {
      URL.revokeObjectURL(url)
    }
    previewUrlsRef.current = []
  }, [])

  const registerPreviewUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    previewUrlsRef.current.push(url)
    return url
  }, [])

  const renderPreviewImage = useCallback(
    async (source: File | Uint8Array): Promise<PreviewImage> => {
      const pdfjs = await getPdfJs()
      const bytes =
        source instanceof File ? new Uint8Array(await source.arrayBuffer()) : source

      const loadingTask = pdfjs.getDocument({
        data: bytes,
        disableAutoFetch: true,
        disableRange: true,
        disableStream: true,
      })

      try {
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 0.8 })
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.ceil(viewport.width))
        canvas.height = Math.max(1, Math.ceil(viewport.height))

        const context = canvas.getContext("2d")
        if (!context) {
          throw new Error("Could not render demo preview.")
        }

        await page.render({
          canvas: canvas as unknown as HTMLCanvasElement,
          canvasContext: context,
          viewport,
          annotationMode: pdfjs.AnnotationMode.ENABLE,
        }).promise

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((result) => {
            if (!result) {
              reject(new Error("Could not export demo preview image."))
              return
            }
            resolve(result)
          }, "image/png")
        })

        const dimensions = await getBlobDimensions(blob)
        const url = registerPreviewUrl(blob)

        canvas.width = 0
        canvas.height = 0

        return { url, ...dimensions }
      } finally {
        await loadingTask.destroy()
      }
    },
    [registerPreviewUrl]
  )

  const loadSamplePdf = useCallback(async () => {
    setStatus("Loading demo sample...")

    const response = await fetch("/demo/sample.pdf", { cache: "force-cache" })
    if (!response.ok) {
      throw new Error("Could not load homepage demo sample.")
    }

    const blob = await response.blob()
    const file = new File([blob], "sample.pdf", { type: "application/pdf" })
    const pdfjs = await getPdfJs()
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })

    try {
      const pdf = await loadingTask.promise
      setSamplePageCount(pdf.numPages)
    } finally {
      await loadingTask.destroy()
    }

    setSampleFile(file)
    setSampleSize(file.size)
  }, [])

  const runCompressionDemo = useCallback(
    async (file: File, runId: number) => {
      const { plainRealTimeCompressionPreviewer } = await getPdfBatchEngine()
      const result = await plainRealTimeCompressionPreviewer(file, 66, {
        previewPages: 1,
        onProgress: (engineProgress, message) => {
          if (runRef.current !== runId) return
          setStatus(message)
          setProgress((current) => Math.max(current, Math.min(95, engineProgress)))
        },
      })

      const pair = result.previewPairs[0]
      let beforePreview: PreviewImage | null = null
      let afterPreview: PreviewImage | null = null

      if (pair) {
        const [beforeDimensions, afterDimensions] = await Promise.all([
          getBlobDimensions(pair.originalBlob),
          getBlobDimensions(pair.compressedBlob),
        ])
        beforePreview = {
          url: registerPreviewUrl(pair.originalBlob),
          ...beforeDimensions,
        }
        afterPreview = {
          url: registerPreviewUrl(pair.compressedBlob),
          ...afterDimensions,
        }
      }

      if (runRef.current !== runId) return

      setCompressionResult({
        originalSize: result.originalSizeBytes,
        compressedSize: result.compressedSizeBytes,
        savingsPercent: result.savingsPercent,
        beforePreview,
        afterPreview,
      })
      setStatus("Compression demo complete.")
    },
    [registerPreviewUrl]
  )

  const runMetadataDemo = useCallback(async (file: File, runId: number) => {
    const { plainMetadataPurge } = await getPdfSecurityEngines()
    setStatus("Scanning metadata fields in sample PDF...")
    const fields = await extractMetadataFields(file)
    if (runRef.current !== runId) return

    setMetadataFields(fields)
    setRemovedMetadataFields([])

    let removedCount = fields.length
    let remainingCount = 0
    await plainMetadataPurge(file, {
      onStageChange: (_, message) => {
        if (runRef.current !== runId) return
        setStatus(message)
      },
      onDiff: (nextDiff) => {
        removedCount = nextDiff.removedInfoKeys.length
        remainingCount = nextDiff.after.infoKeys.length
      },
    })

    for (const field of fields) {
      if (runRef.current !== runId) return
      setRemovedMetadataFields((current) =>
        current.includes(field.name) ? current : [...current, field.name]
      )
      await sleep(120)
    }

    if (runRef.current !== runId) return
    setMetadataResult({
      removedCount,
      remainingCount,
    })
    setStatus("Metadata purge demo complete.")
  }, [])

  const runRedactionDemo = useCallback(
    async (file: File, runId: number) => {
      const { plainIrreversibleRedactor } = await getPdfSecurityEngines()
      setStatus("Rendering original sample page...")
      const beforePreview = await renderPreviewImage(file)
      if (runRef.current !== runId) return

      setStatus("Applying irreversible redaction locally...")
      const redactedBytes = await plainIrreversibleRedactor(
        file,
        [
          {
            page: 1,
            coords: {
              x: 68,
              y: 652,
              width: 280,
              height: 26,
            },
          },
        ],
        (_, message) => {
          if (runRef.current !== runId) return
          setStatus(message)
        }
      )

      const afterPreview = await renderPreviewImage(redactedBytes)
      if (runRef.current !== runId) return

      setRedactionResult({ beforePreview, afterPreview })
      setStatus("Redaction demo complete.")
    },
    [renderPreviewImage]
  )

  const runDemo = useCallback(
    async (mode: DemoMode, file: File) => {
      const runId = runRef.current + 1
      runRef.current = runId

      setIsRunning(true)
      setError(null)
      setProgress(1)
      setCompressionResult(null)
      setMetadataFields([])
      setRemovedMetadataFields([])
      setMetadataResult(null)
      setRedactionResult(null)
      revokePreviewUrls()

      let visualProgress = 3
      const progressTimer = setInterval(() => {
        visualProgress = Math.min(92, visualProgress + 4)
        if (runRef.current === runId) {
          setProgress((current) => Math.max(current, visualProgress))
        }
      }, 120)

      const startedAt = Date.now()

      try {
        if (mode === "compress") {
          await runCompressionDemo(file, runId)
        } else if (mode === "metadata") {
          await runMetadataDemo(file, runId)
        } else {
          await runRedactionDemo(file, runId)
        }

        const elapsed = Date.now() - startedAt
        if (elapsed < 2000) {
          await sleep(2000 - elapsed)
        }

        if (runRef.current !== runId) return
        setProgress(100)
      } catch (demoError) {
        if (runRef.current !== runId) return
        setError(demoError instanceof Error ? demoError.message : "Demo failed.")
        setStatus("Demo failed. Reload and try again.")
      } finally {
        clearInterval(progressTimer)
        if (runRef.current === runId) {
          setIsRunning(false)
        }
      }
    },
    [revokePreviewUrls, runCompressionDemo, runMetadataDemo, runRedactionDemo]
  )

  useEffect(() => {
    let cancelled = false

    const media = window.matchMedia("(max-width: 639px)")
    const syncMobile = () => setIsMobile(media.matches)
    syncMobile()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncMobile)
    } else {
      media.addListener(syncMobile)
    }

    const initialise = async () => {
      try {
        await loadSamplePdf()
      } catch (initError) {
        if (!cancelled) {
          setError(
            initError instanceof Error ? initError.message : "Could not initialise homepage demo."
          )
        }
      }
    }

    void initialise()

    return () => {
      cancelled = true
      runRef.current += 1
      revokePreviewUrls()
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", syncMobile)
      } else {
        media.removeListener(syncMobile)
      }
    }
  }, [loadSamplePdf, revokePreviewUrls])

  useEffect(() => {
    if (!sampleFile) return
    void runDemo(effectiveMode, sampleFile)
  }, [effectiveMode, runDemo, sampleFile])

  const scrollToDropzone = useCallback(() => {
    document
      .getElementById("hero-file-dropzone")
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  return (
    <section id="homepage-live-demo" className="px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Card className="border border-border/80 bg-card/60 backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs uppercase tracking-wide">
                Live Browser Demo
              </Badge>
              <Badge variant="outline" className="text-xs">
                100% Client-Side
              </Badge>
              <Badge variant="outline" className="text-xs">
                Sample PDF: {formatBytes(sampleSize)}
              </Badge>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl">
                See Plain work in the first 10 seconds.
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We preloaded a tiny 2-page sample and run {modeLabel.toLowerCase()} live in your
                browser before you upload anything.
              </CardDescription>
            </div>

            {!isMobile ? (
              <Tabs
                value={activeMode}
                onValueChange={(value) => {
                  if (value === "compress" || value === "metadata" || value === "redact") {
                    setActiveMode(value)
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-3">
                  <TabsTrigger value="compress" className="min-h-[44px]">
                    <Zap className="h-4 w-4" />
                    Compress
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="min-h-[44px]">
                    <ShieldCheck className="h-4 w-4" />
                    Metadata Purge
                  </TabsTrigger>
                  <TabsTrigger value="redact" className="min-h-[44px]">
                    <Lock className="h-4 w-4" />
                    Redact
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mobile quick view: running the compression demo automatically.
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-medium">
                  Demo status: {isRunning ? "Running" : "Complete"}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
              <p className="mt-2 text-sm text-muted-foreground">{status}</p>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {effectiveMode === "compress" && compressionResult ? (
              <div className="space-y-4 rounded-lg border border-border/70 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Original</p>
                    <p className="mt-1 text-base font-semibold">{formatBytes(compressionResult.originalSize)}</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Compressed</p>
                    <p className="mt-1 text-base font-semibold">{formatBytes(compressionResult.compressedSize)}</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Savings</p>
                    <p className="mt-1 text-base font-semibold text-emerald-400">
                      {compressionResult.savingsPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {compressionResult.beforePreview && compressionResult.afterPreview ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Before</p>
                      <div className="overflow-hidden rounded-md border border-border/70">
                        <Image
                          src={compressionResult.beforePreview.url}
                          alt="Sample PDF preview before compression"
                          width={compressionResult.beforePreview.width}
                          height={compressionResult.beforePreview.height}
                          className="h-auto w-full"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">After</p>
                      <div className="overflow-hidden rounded-md border border-border/70">
                        <Image
                          src={compressionResult.afterPreview.url}
                          alt="Sample PDF preview after compression"
                          width={compressionResult.afterPreview.width}
                          height={compressionResult.afterPreview.height}
                          className="h-auto w-full"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {effectiveMode === "metadata" && metadataFields.length > 0 ? (
              <div className="space-y-4 rounded-lg border border-border/70 p-4">
                <div className="overflow-x-auto rounded-md border border-border/70">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2">Field</th>
                        <th className="px-3 py-2">Value</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metadataFields.map((field) => {
                        const removed = removedMetadataFields.includes(field.name)
                        return (
                          <tr key={field.name} className="border-b border-border/50 last:border-0">
                            <td className="px-3 py-2 font-medium">{field.name}</td>
                            <td
                              className={`px-3 py-2 ${
                                removed ? "text-muted-foreground line-through" : "text-foreground"
                              }`}
                            >
                              {field.value}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  removed
                                    ? "bg-emerald-500/15 text-emerald-300"
                                    : "bg-amber-500/15 text-amber-300"
                                }`}
                              >
                                {removed ? "Stripped" : "Detected"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {metadataResult ? (
                  <p className="text-sm text-muted-foreground">
                    Removed {metadataResult.removedCount} metadata fields. Output now tracks{" "}
                    {metadataResult.remainingCount} info-dictionary fields.
                  </p>
                ) : null}
              </div>
            ) : null}

            {effectiveMode === "redact" && redactionResult ? (
              <div className="space-y-4 rounded-lg border border-border/70 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Before redaction</p>
                    <div className="overflow-hidden rounded-md border border-border/70">
                      <Image
                        src={redactionResult.beforePreview.url}
                        alt="Sample page before redaction"
                        width={redactionResult.beforePreview.width}
                        height={redactionResult.beforePreview.height}
                        className="h-auto w-full"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">After redaction</p>
                    <div className="overflow-hidden rounded-md border border-border/70">
                      <Image
                        src={redactionResult.afterPreview.url}
                        alt="Sample page after redaction"
                        width={redactionResult.afterPreview.width}
                        height={redactionResult.afterPreview.height}
                        className="h-auto w-full"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sensitive line on page 1 is burned in with irreversible redaction.
                </p>
              </div>
            ) : null}

            <div className="rounded-lg border border-accent/25 bg-accent/10 p-4 text-sm text-foreground">
              This just ran entirely in your browser. No upload occurred. Check your network tab.{" "}
              <Link href="/learn/verify-offline-processing" className="text-accent underline underline-offset-4">
                Open DevTools instructions
              </Link>
              .
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={scrollToDropzone}
              >
                Try it on your own file <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Sample: {samplePageCount} pages • {formatBytes(sampleSize)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

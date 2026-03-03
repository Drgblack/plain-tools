"use client"

import { PDFDocument, degrees } from "pdf-lib"
import { Copy, Download, GripVertical, Loader2, RotateCw, Trash2, UploadCloud, Zap } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { generatePagePreviews } from "@/lib/page-organiser-engine"

type PagePreview = {
  originalIndex: number
  dataUrl: string
}

type PageCard = {
  id: string
  sourceIndex: number
  dataUrl: string
  rotation: number
}

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

const createCardsFromPreviews = (previews: PagePreview[]) =>
  previews.map((preview) => ({
    id: `page-${preview.originalIndex}-${crypto.randomUUID()}`,
    sourceIndex: preview.originalIndex,
    dataUrl: preview.dataUrl,
    rotation: 0,
  }))

const moveAtIndex = (cards: PageCard[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return cards
  }
  const next = [...cards]
  const [moved] = next.splice(fromIndex, 1)
  if (!moved) {
    return cards
  }
  next.splice(toIndex, 0, moved)
  return next
}

export default function WebgpuOrganiserTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  const [cards, setCards] = useState<PageCard[]>([])
  const [initialCards, setInitialCards] = useState<PageCard[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false)
  const [previewProgress, setPreviewProgress] = useState(0)
  const [previewStatus, setPreviewStatus] = useState("Upload a PDF to load page thumbnails.")
  const [webgpuActive, setWebgpuActive] = useState(false)

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null)

  const [isApplying, setIsApplying] = useState(false)
  const [applyProgress, setApplyProgress] = useState(0)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("organised.pdf")

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const totalPages = cards.length
  const hasChanges = useMemo(() => {
    if (cards.length !== initialCards.length) return true
    return cards.some((card, index) => {
      const initial = initialCards[index]
      if (!initial) return true
      return card.sourceIndex !== initial.sourceIndex || card.rotation !== initial.rotation
    })
  }, [cards, initialCards])

  const canApply = Boolean(file && cards.length > 0 && !isApplying)

  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl)
      }
    }
  }, [outputUrl])

  const clearOutput = useCallback(() => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl)
    }
    setOutputUrl(null)
  }, [outputUrl])

  const clearEditorState = useCallback(() => {
    setCards([])
    setInitialCards([])
    setSelectedIds([])
    setDraggedIndex(null)
    setDragOverIndex(null)
    setTouchDragIndex(null)
    setPreviewProgress(0)
    setWebgpuActive(false)
  }, [])

  const handleFile = useCallback(
    async (incomingFile: File) => {
      if (!isPdfFile(incomingFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(incomingFile)
      clearOutput()
      clearEditorState()
      setIsLoadingPreviews(true)
      setPreviewStatus("Rendering page thumbnails locally...")

      try {
        const { thumbnails, webgpuActive: hardwareActive } = await generatePagePreviews(
          incomingFile,
          {
            thumbnailWidth: 220,
            onProgress: (progress, status) => {
              setPreviewProgress(progress)
              setPreviewStatus(status)
            },
          }
        )

        const preparedCards = createCardsFromPreviews(thumbnails)
        setCards(preparedCards)
        setInitialCards(preparedCards)
        setWebgpuActive(hardwareActive)
        setPreviewProgress(100)
        setPreviewStatus(`Loaded ${preparedCards.length} page thumbnails.`)
        toast.success("PDF loaded.")
      } catch (error) {
        setFile(null)
        clearEditorState()
        const message = error instanceof Error ? error.message : "Failed to render thumbnails."
        setPreviewStatus(message)
        toast.error(message)
      } finally {
        setIsLoadingPreviews(false)
      }
    },
    [clearEditorState, clearOutput]
  )

  const reorderCards = useCallback((fromIndex: number, toIndex: number) => {
    setCards((previous) => moveAtIndex(previous, fromIndex, toIndex))
  }, [])

  const handleCardDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
    setDragOverIndex(index)
  }, [])

  const handleCardDrop = useCallback(
    (dropIndex: number) => {
      if (draggedIndex === null) return
      reorderCards(draggedIndex, dropIndex)
      setDraggedIndex(null)
      setDragOverIndex(null)
    },
    [draggedIndex, reorderCards]
  )

  const toggleSelected = useCallback((cardId: string) => {
    setSelectedIds((previous) =>
      previous.includes(cardId)
        ? previous.filter((id) => id !== cardId)
        : [...previous, cardId]
    )
  }, [])

  const rotateCard = useCallback((cardId: string) => {
    setCards((previous) =>
      previous.map((card) =>
        card.id === cardId ? { ...card, rotation: (card.rotation + 90) % 360 } : card
      )
    )
  }, [])

  const duplicateCard = useCallback((index: number) => {
    setCards((previous) => {
      const target = previous[index]
      if (!target) return previous
      const duplicate: PageCard = {
        ...target,
        id: `page-${target.sourceIndex}-${crypto.randomUUID()}`,
      }
      const next = [...previous]
      next.splice(index + 1, 0, duplicate)
      return next
    })
  }, [])

  const deleteCard = useCallback((cardId: string) => {
    setCards((previous) => previous.filter((card) => card.id !== cardId))
    setSelectedIds((previous) => previous.filter((id) => id !== cardId))
  }, [])

  const bulkRotate = useCallback(() => {
    if (selectedIds.length === 0) return
    setCards((previous) =>
      previous.map((card) =>
        selectedSet.has(card.id) ? { ...card, rotation: (card.rotation + 90) % 360 } : card
      )
    )
  }, [selectedIds.length, selectedSet])

  const bulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return
    setCards((previous) => previous.filter((card) => !selectedSet.has(card.id)))
    setSelectedIds([])
  }, [selectedIds.length, selectedSet])

  const resetLayout = useCallback(() => {
    setCards(initialCards)
    setSelectedIds([])
    setDraggedIndex(null)
    setDragOverIndex(null)
    setTouchDragIndex(null)
    setApplyProgress(0)
    clearOutput()
  }, [clearOutput, initialCards])

  const applyAndDownload = useCallback(async () => {
    if (!file || cards.length === 0) {
      toast.error("Upload a PDF and keep at least one page.")
      return
    }

    setIsApplying(true)
    setApplyProgress(5)
    clearOutput()

    try {
      const sourcePdf = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      })
      const outputPdf = await PDFDocument.create()

      for (let index = 0; index < cards.length; index += 1) {
        const card = cards[index]
        if (!card) continue

        const [copiedPage] = await outputPdf.copyPages(sourcePdf, [card.sourceIndex])
        if (!copiedPage) continue
        if (card.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle
          copiedPage.setRotation(degrees((currentRotation + card.rotation) % 360))
        }
        outputPdf.addPage(copiedPage)

        const progress = 10 + Math.round(((index + 1) / cards.length) * 80)
        setApplyProgress(progress)
      }

      const bytes = await outputPdf.save({ useObjectStreams: true })
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const baseName = file.name.replace(/\.pdf$/i, "")
      setOutputName(`${baseName}-organised.pdf`)
      setOutputUrl(url)
      setApplyProgress(100)
      toast.success("Organised PDF ready.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not build organised PDF."
      toast.error(message)
    } finally {
      setIsApplying(false)
    }
  }, [cards, clearOutput, file])

  const onTouchCardStart = useCallback((index: number) => {
    setTouchDragIndex(index)
    setDragOverIndex(index)
  }, [])

  const onTouchCardMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (touchDragIndex === null) return
    const touch = event.touches[0]
    if (!touch) return

    const node = document.elementFromPoint(touch.clientX, touch.clientY)
    const cardNode = node?.closest("[data-card-index]") as HTMLElement | null
    if (cardNode?.dataset.cardIndex) {
      const parsed = Number(cardNode.dataset.cardIndex)
      if (Number.isInteger(parsed)) {
        setDragOverIndex(parsed)
      }
    }

    if (event.cancelable) {
      event.preventDefault()
    }
  }, [touchDragIndex])

  const onTouchCardEnd = useCallback(() => {
    if (touchDragIndex === null || dragOverIndex === null) {
      setTouchDragIndex(null)
      setDragOverIndex(null)
      return
    }
    reorderCards(touchDragIndex, dragOverIndex)
    setTouchDragIndex(null)
    setDragOverIndex(null)
  }, [dragOverIndex, reorderCards, touchDragIndex])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void handleFile(selected)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDraggingFile(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDraggingFile(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDraggingFile(false)
              const dropped = event.dataTransfer.files[0]
              if (dropped) {
                void handleFile(dropped)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDraggingFile
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Thumbnails and page edits are generated locally on your device.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Plain WebGPU Page Organiser</CardTitle>
          <CardDescription className="break-words">{previewStatus}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(file.size)} • {totalPages} page{totalPages === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {webgpuActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#0070f3]/35 bg-[#0070f3]/12 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7ab8ff]">
                    <Zap className="h-3.5 w-3.5" />
                    WebGPU
                  </span>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    clearOutput()
                    clearEditorState()
                    setFile(null)
                    setPreviewStatus("Upload a PDF to load page thumbnails.")
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          {isLoadingPreviews || previewProgress > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isLoadingPreviews ? "Rendering thumbnails" : "Preview ready"}</span>
                <span>{previewProgress}%</span>
              </div>
              <Progress value={previewProgress} className="h-2 w-full" />
            </div>
          ) : null}

          {selectedIds.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground">
                {selectedIds.length} page{selectedIds.length === 1 ? "" : "s"} selected
              </p>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={bulkRotate}>
                  <RotateCw className="h-4 w-4" />
                  Bulk Rotate 90°
                </Button>
                <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={bulkDelete}>
                  <Trash2 className="h-4 w-4" />
                  Bulk Delete
                </Button>
              </div>
            </div>
          ) : null}

          {cards.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  data-card-index={index}
                  draggable
                  onDragStart={() => handleCardDragStart(index)}
                  onDragEnd={() => {
                    setDraggedIndex(null)
                    setDragOverIndex(null)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragOverIndex(index)
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleCardDrop(index)
                  }}
                  onTouchStart={() => onTouchCardStart(index)}
                  onTouchMove={onTouchCardMove}
                  onTouchEnd={onTouchCardEnd}
                  className={`rounded-xl border p-2 transition-colors ${
                    dragOverIndex === index && (draggedIndex !== null || touchDragIndex !== null)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <label className="inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={selectedSet.has(card.id)}
                        onCheckedChange={() => toggleSelected(card.id)}
                        aria-label={`Select page ${index + 1}`}
                      />
                      Select
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      {index + 1}/{totalPages}
                    </span>
                  </div>

                  <div className="relative aspect-[3/4] overflow-hidden rounded-md border bg-muted/30">
                    <Image
                      src={card.dataUrl}
                      alt={`Page ${card.sourceIndex + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-contain"
                      style={{
                        transform: `rotate(${card.rotation}deg)`,
                      }}
                      draggable={false}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <GripVertical className="h-3.5 w-3.5" />
                      Drag
                    </span>
                    <span className="text-[11px] text-muted-foreground">Source {card.sourceIndex + 1}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-11 w-11"
                      onClick={() => rotateCard(card.id)}
                      aria-label={`Rotate page ${index + 1}`}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-11 w-11"
                      onClick={() => duplicateCard(index)}
                      aria-label={`Duplicate page ${index + 1}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-11 w-11"
                      onClick={() => deleteCard(card.id)}
                      aria-label={`Delete page ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={resetLayout}
            disabled={cards.length === 0 || !hasChanges || isApplying}
          >
            Reset
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={!canApply}
            onClick={() => void applyAndDownload()}
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply & Download"
            )}
          </Button>
        </CardFooter>
      </Card>

      {isApplying || applyProgress > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isApplying ? "Rebuilding PDF" : "Done"}</span>
                <span>{applyProgress}%</span>
              </div>
              <Progress value={applyProgress} className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {outputUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output Ready</CardTitle>
            <CardDescription>Download your organised PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <a href={outputUrl} download={outputName}>
                <Download className="h-4 w-4" />
                Download {outputName}
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, FileText, Loader2, Trash2, UploadCloud } from "lucide-react"
import Image from "next/image"
import { toast, Toaster } from "sonner"

import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"
import { getPdfLib } from "@/lib/pdf-lib-loader"
import { getPdfJs } from "@/lib/pdfjs-loader"

type FieldType = "text" | "checkbox" | "radio" | "dropdown" | "option-list" | "signature" | "unknown"
type FieldValue = string | boolean

type FormFieldDefinition = {
  name: string
  label: string
  type: FieldType
  options: string[]
  readOnly: boolean
  required: boolean
  pageNumber?: number
}

type PagePreview = {
  pageNumber: number
  imageUrl: string
  width: number
  height: number
}

type SignatureWidgetLocation = {
  pageIndex: number
  rect: [number, number, number, number]
}

type ParsedFormResult = {
  sourceBytes: Uint8Array
  fields: FormFieldDefinition[]
  fieldValues: Record<string, FieldValue>
  previews: PagePreview[]
  signatureLocations: Record<string, SignatureWidgetLocation>
}

const PREVIEW_MAX_WIDTH = 220

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

const humanizeFieldName = (value: string) =>
  value
    .replace(/[_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string" && item.length > 0)
}

const toSingleString = (value: unknown): string => {
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    const first = value.find((item): item is string => typeof item === "string")
    return first || ""
  }
  return ""
}

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create preview image."))
          return
        }
        resolve(blob)
      },
      "image/png",
      0.92
    )
  })

const revokePreviewUrls = (items: PagePreview[]) => {
  for (const item of items) {
    URL.revokeObjectURL(item.imageUrl)
  }
}

const parseFormFields = async (file: File): Promise<ParsedFormResult> => {
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfLib = await getPdfLib()
  const pdfDoc = await pdfLib.PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  const form = pdfDoc.getForm()

  const definitions: FormFieldDefinition[] = []
  const fieldValues: Record<string, FieldValue> = {}

  for (const rawField of form.getFields() as unknown[]) {
    const field = rawField as Record<string, unknown>
    const getName = field.getName as (() => string) | undefined
    const fieldName = getName?.()
    if (!fieldName) {
      continue
    }

    const ctorName = String((field as { constructor?: { name?: string } }).constructor?.name || "")
    const readOnly =
      typeof (field as { isReadOnly?: () => boolean }).isReadOnly === "function"
        ? Boolean((field as { isReadOnly: () => boolean }).isReadOnly())
        : false
    const required =
      typeof (field as { isRequired?: () => boolean }).isRequired === "function"
        ? Boolean((field as { isRequired: () => boolean }).isRequired())
        : false

    let type: FieldType = "unknown"
    let options: string[] = []
    let initialValue: FieldValue = ""

    if (ctorName === "PDFTextField") {
      type = "text"
      initialValue = toSingleString((field as { getText?: () => unknown }).getText?.())
    } else if (ctorName === "PDFCheckBox") {
      type = "checkbox"
      initialValue =
        typeof (field as { isChecked?: () => boolean }).isChecked === "function"
          ? Boolean((field as { isChecked: () => boolean }).isChecked())
          : false
    } else if (ctorName === "PDFRadioGroup") {
      type = "radio"
      options = toStringArray((field as { getOptions?: () => unknown }).getOptions?.())
      initialValue = toSingleString((field as { getSelected?: () => unknown }).getSelected?.())
    } else if (ctorName === "PDFDropdown") {
      type = "dropdown"
      options = toStringArray((field as { getOptions?: () => unknown }).getOptions?.())
      initialValue = toSingleString((field as { getSelected?: () => unknown }).getSelected?.())
    } else if (ctorName === "PDFOptionList") {
      type = "option-list"
      options = toStringArray((field as { getOptions?: () => unknown }).getOptions?.())
      initialValue = toSingleString((field as { getSelected?: () => unknown }).getSelected?.())
    } else if (ctorName === "PDFSignature") {
      type = "signature"
      initialValue = ""
    }

    definitions.push({
      name: fieldName,
      label: humanizeFieldName(fieldName),
      type,
      options,
      readOnly,
      required,
    })
    fieldValues[fieldName] = initialValue
  }

  const pdfjs = await getPdfJs()
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  const signatureLocations: Record<string, SignatureWidgetLocation> = {}
  const fieldPageNumbers: Record<string, number> = {}
  const previews: PagePreview[] = []

  try {
    const sourcePdf = await loadingTask.promise

    for (let index = 0; index < sourcePdf.numPages; index++) {
      const page = await sourcePdf.getPage(index + 1)
      const pointViewport = page.getViewport({ scale: 1 })
      const scale = Math.min(1, PREVIEW_MAX_WIDTH / Math.max(1, pointViewport.width))
      const previewViewport = page.getViewport({ scale })

      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.ceil(previewViewport.width))
      canvas.height = Math.max(1, Math.ceil(previewViewport.height))
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas for PDF preview.")
      }

      await page.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: context,
        viewport: previewViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      const blob = await canvasToBlob(canvas)
      const imageUrl = URL.createObjectURL(blob)
      previews.push({
        pageNumber: index + 1,
        imageUrl,
        width: pointViewport.width,
        height: pointViewport.height,
      })

      canvas.width = 0
      canvas.height = 0

      const annotations = (await page.getAnnotations({ intent: "display" })) as Array<
        Record<string, unknown>
      >
      for (const annotation of annotations) {
        const subtype = annotation.subtype
        const fieldName = annotation.fieldName
        if (subtype !== "Widget" || typeof fieldName !== "string") {
          continue
        }

        if (!fieldPageNumbers[fieldName]) {
          fieldPageNumbers[fieldName] = index + 1
        }

        const fieldType = annotation.fieldType
        const rect = annotation.rect
        if (
          fieldType === "Sig" &&
          Array.isArray(rect) &&
          rect.length === 4 &&
          rect.every((value) => typeof value === "number")
        ) {
          signatureLocations[fieldName] = {
            pageIndex: index,
            rect: [rect[0], rect[1], rect[2], rect[3]],
          }
        }
      }
    }
  } finally {
    await loadingTask.destroy()
  }

  const fields = definitions.map((field) => ({
    ...field,
    pageNumber: fieldPageNumbers[field.name],
  }))

  return {
    sourceBytes,
    fields,
    fieldValues,
    previews,
    signatureLocations,
  }
}

export default function FillPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null)
  const [fields, setFields] = useState<FormFieldDefinition[]>([])
  const [fieldValues, setFieldValues] = useState<Record<string, FieldValue>>({})
  const [previews, setPreviews] = useState<PagePreview[]>([])
  const [signatureLocations, setSignatureLocations] = useState<Record<string, SignatureWidgetLocation>>({})
  const [flattenOutput, setFlattenOutput] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Upload a fillable PDF form to begin.")
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultSizeBytes, setResultSizeBytes] = useState<number | null>(null)

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
      revokePreviewUrls(previews)
    }
  }, [previews, resultUrl])

  const clearOutput = useCallback(() => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
    }
    setResultUrl(null)
    setResultSizeBytes(null)
  }, [resultUrl])

  const resetFormValues = useCallback(() => {
    const resetValues: Record<string, FieldValue> = {}
    for (const field of fields) {
      resetValues[field.name] = field.type === "checkbox" ? false : ""
    }
    setFieldValues(resetValues)
    clearOutput()
  }, [clearOutput, fields])

  const loadFile = useCallback(
    async (incomingFile: File) => {
      if (!isPdfFile(incomingFile)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setIsLoading(true)
      setProgress(8)
      setStatus("Parsing AcroForm fields locally...")
      clearOutput()

      try {
        const parsed = await parseFormFields(incomingFile)

        setFile(incomingFile)
        setSourceBytes(parsed.sourceBytes)
        setFields(parsed.fields)
        setFieldValues(parsed.fieldValues)
        setSignatureLocations(parsed.signatureLocations)
        setPreviews((previous) => {
          revokePreviewUrls(previous)
          return parsed.previews
        })

        setProgress(100)
        setStatus(
          parsed.fields.length > 0
            ? `Ready. ${parsed.fields.length} form field${parsed.fields.length === 1 ? "" : "s"} detected.`
            : "No fillable AcroForm fields were detected in this PDF."
        )
        toast.success("PDF form loaded.")
      } catch (error) {
        setFile(null)
        setSourceBytes(null)
        setFields([])
        setFieldValues({})
        setSignatureLocations({})
        setPreviews((previous) => {
          revokePreviewUrls(previous)
          return []
        })
        setStatus("Could not parse form fields.")
        const message = error instanceof Error ? error.message : "Failed to parse this PDF form."
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [clearOutput]
  )

  const applyFieldValue = useCallback((fieldName: string, value: FieldValue) => {
    setFieldValues((current) => ({
      ...current,
      [fieldName]: value,
    }))
    clearOutput()
  }, [clearOutput])

  const fillAndGenerate = useCallback(async () => {
    if (!sourceBytes || !fields.length) {
      toast.error("Load a fillable PDF form first.")
      return
    }

    setIsProcessing(true)
    setProgress(10)
    setStatus("Writing form values into PDF...")
    clearOutput()

    try {
      const pdfLib = await getPdfLib()
      const pdfDoc = await pdfLib.PDFDocument.load(sourceBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      })
      const form = pdfDoc.getForm()

      for (const field of fields) {
        if (field.readOnly) {
          continue
        }

        const rawValue = fieldValues[field.name]

        try {
          if (field.type === "text") {
            const textField = form.getTextField(field.name)
            textField.setText(typeof rawValue === "string" ? rawValue : "")
          } else if (field.type === "checkbox") {
            const checkField = form.getCheckBox(field.name)
            if (rawValue === true) {
              checkField.check()
            } else {
              checkField.uncheck()
            }
          } else if (field.type === "radio") {
            const radioField = form.getRadioGroup(field.name)
            const value = typeof rawValue === "string" ? rawValue : ""
            if (value) {
              radioField.select(value)
            }
          } else if (field.type === "dropdown") {
            const dropdownField = form.getDropdown(field.name)
            const value = typeof rawValue === "string" ? rawValue : ""
            if (value) {
              dropdownField.select(value)
            }
          } else if (field.type === "option-list") {
            const optionField = form.getOptionList(field.name)
            const value = typeof rawValue === "string" ? rawValue : ""
            if (value) {
              optionField.select(value)
            }
          }
        } catch {
          // Continue applying other fields if one field write fails.
        }
      }

      setProgress(70)
      setStatus("Applying signature placeholders and preparing output...")

      const signatureFields = fields.filter((field) => field.type === "signature")
      if (signatureFields.length > 0) {
        const font = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica)

        for (const signatureField of signatureFields) {
          const signatureValue = fieldValues[signatureField.name]
          const textValue = typeof signatureValue === "string" ? signatureValue.trim() : ""
          if (!textValue) {
            continue
          }

          const location = signatureLocations[signatureField.name]
          if (!location) {
            continue
          }

          const page = pdfDoc.getPage(location.pageIndex)
          if (!page) {
            continue
          }

          const [x1, y1, x2, y2] = location.rect
          const x = Math.min(x1, x2) + 2
          const y = Math.min(y1, y2) + 2
          const width = Math.max(12, Math.abs(x2 - x1) - 4)
          const height = Math.max(12, Math.abs(y2 - y1) - 4)
          const fontSize = Math.max(10, Math.min(18, height * 0.45))
          const maxChars = Math.max(6, Math.floor(width / Math.max(5, fontSize * 0.55)))
          const renderedText =
            textValue.length > maxChars ? `${textValue.slice(0, Math.max(0, maxChars - 1))}…` : textValue

          page.drawText(renderedText, {
            x,
            y: y + Math.max(1, (height - fontSize) * 0.5),
            font,
            size: fontSize,
            color: pdfLib.rgb(0.1, 0.1, 0.1),
            maxWidth: width,
            lineHeight: fontSize,
          })
        }
      }

      if (flattenOutput) {
        form.flatten()
      }

      const filledBytes = await pdfDoc.save({ useObjectStreams: true })
      const blob = new Blob([filledBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      setResultUrl(url)
      setResultSizeBytes(blob.size)
      setProgress(100)
      setStatus("Filled PDF ready for download.")
      toast.success("PDF form filled.")
    } catch (error) {
      setStatus("Failed to generate filled PDF.")
      const message = error instanceof Error ? error.message : "Could not generate filled PDF."
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }, [clearOutput, fieldValues, fields, flattenOutput, signatureLocations, sourceBytes])

  const fieldCounts = useMemo(() => {
    return fields.reduce<Record<FieldType, number>>(
      (acc, field) => {
        acc[field.type] += 1
        return acc
      },
      {
        text: 0,
        checkbox: 0,
        radio: 0,
        dropdown: 0,
        "option-list": 0,
        signature: 0,
        unknown: 0,
      }
    )
  }, [fields])

  const canGenerate = Boolean(sourceBytes && fields.length > 0 && !isLoading && !isProcessing)

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
            void loadFile(selected)
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
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              const droppedFile = event.dataTransfer.files?.[0]
              if (droppedFile) {
                void loadFile(droppedFile)
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/70"
            }`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop one fillable PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              AcroForm fields are parsed and filled entirely in your browser.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fill PDF Forms</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {file ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {previews.length} page{previews.length === 1 ? "" : "s"}
              </span>
              <Button
                type="button"
                variant="ghost"
                className="ml-auto w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setSourceBytes(null)
                  setFields([])
                  setFieldValues({})
                  setSignatureLocations({})
                  setPreviews((previous) => {
                    revokePreviewUrls(previous)
                    return []
                  })
                  clearOutput()
                  setProgress(0)
                  setStatus("Upload a fillable PDF form to begin.")
                }}
                disabled={isLoading || isProcessing}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected.</p>
          )}

          {fields.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Text: {fieldCounts.text}</Badge>
              <Badge variant="outline">Checkbox: {fieldCounts.checkbox}</Badge>
              <Badge variant="outline">Radio: {fieldCounts.radio}</Badge>
              <Badge variant="outline">Dropdown: {fieldCounts.dropdown + fieldCounts["option-list"]}</Badge>
              <Badge variant="outline">Signature: {fieldCounts.signature}</Badge>
            </div>
          ) : null}

          <div className="flex flex-col items-start gap-3 rounded-md border p-3 sm:flex-row sm:items-center">
            <Switch
              id="flatten-form-output"
              checked={flattenOutput}
              onCheckedChange={setFlattenOutput}
              disabled={isLoading || isProcessing}
            />
            <Label htmlFor="flatten-form-output" className="text-sm">
              Flatten form output (embed values permanently)
            </Label>
          </div>

          {fields.length === 0 && file ? (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
              This PDF does not expose standard AcroForm fields. Try another fillable form template.
            </div>
          ) : null}

          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field) => {
                const value = fieldValues[field.name]
                const textValue = typeof value === "string" ? value : ""
                const boolValue = value === true
                const isDisabled = isLoading || isProcessing || field.readOnly
                const inputId = `field-${field.name}`

                return (
                  <div key={field.name} className="rounded-lg border p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                        {field.label}
                      </Label>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                        {field.type}
                      </Badge>
                      {field.pageNumber ? (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                          Page {field.pageNumber}
                        </Badge>
                      ) : null}
                      {field.required ? (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                          Required
                        </Badge>
                      ) : null}
                      {field.readOnly ? (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                          Read only
                        </Badge>
                      ) : null}
                    </div>

                    {field.type === "checkbox" ? (
                      <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-base">
                        <Checkbox
                          id={inputId}
                          checked={boolValue}
                          onCheckedChange={(checked) => applyFieldValue(field.name, checked === true)}
                          disabled={isDisabled}
                        />
                        <span>Checked</span>
                      </label>
                    ) : null}

                    {field.type === "radio" ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {field.options.map((option) => (
                          <label
                            key={option}
                            className="flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-base"
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={option}
                              checked={textValue === option}
                              onChange={(event) => applyFieldValue(field.name, event.target.value)}
                              disabled={isDisabled}
                              className="h-4 w-4"
                            />
                            <span className="truncate">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}

                    {(field.type === "dropdown" || field.type === "option-list") ? (
                      <select
                        id={inputId}
                        value={textValue}
                        onChange={(event) => applyFieldValue(field.name, event.target.value)}
                        disabled={isDisabled}
                        className="h-11 w-full rounded-md border bg-background px-3 text-base"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}

                    {(field.type === "text" || field.type === "signature" || field.type === "unknown") ? (
                      <Input
                        id={inputId}
                        value={textValue}
                        onChange={(event) => applyFieldValue(field.name, event.target.value)}
                        disabled={isDisabled}
                        className="h-11 text-base"
                        placeholder={
                          field.type === "signature"
                            ? "Type signer name / signature text"
                            : "Enter value"
                        }
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          {(isLoading || isProcessing || progress > 0) && (
            <div className="space-y-2">
              <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">
                  {isLoading ? "Reading form" : isProcessing ? "Generating output" : "Ready"}
                </span>
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
            onClick={fillAndGenerate}
            disabled={!canGenerate}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Filling...
              </>
            ) : (
              "Fill & Generate PDF"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={resetFormValues}
            disabled={isLoading || isProcessing || fields.length === 0}
          >
            Reset Values
          </Button>
        </CardFooter>
      </Card>

      {resultUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filled Output</CardTitle>
            <CardDescription>
              filled.pdf{resultSizeBytes !== null ? ` • ${formatBytes(resultSizeBytes)}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProcessedLocallyBadge />
            <Button asChild className="w-full sm:w-auto">
              <a
                href={resultUrl}
                download="filled.pdf"
                onClick={() => {
                  notifyLocalDownloadSuccess()
                }}
              >
                <Download className="h-4 w-4" />
                Download filled.pdf
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">PDF Preview</CardTitle>
          <CardDescription>
            {previews.length ? "Rendered locally with form widgets visible." : "Upload a PDF to preview pages."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {previews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No page previews yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previews.map((preview) => (
                <div key={preview.pageNumber} className="space-y-2 rounded-lg border p-3">
                  <div className="relative overflow-hidden rounded-md border bg-muted/20">
                    <Image
                      src={preview.imageUrl}
                      alt={`Preview of page ${preview.pageNumber}`}
                      width={PREVIEW_MAX_WIDTH}
                      height={Math.max(
                        1,
                        Math.round((preview.height / Math.max(1, preview.width)) * PREVIEW_MAX_WIDTH)
                      )}
                      unoptimized
                      className="h-auto w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Page {preview.pageNumber}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

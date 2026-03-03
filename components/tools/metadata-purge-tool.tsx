"use client"

import { Download, Loader2, ShieldCheck, Trash2, UploadCloud } from "lucide-react"
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFRef,
  PDFStream,
  PDFString,
} from "pdf-lib"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type MetadataGroup = "Info Dictionary" | "XMP Metadata" | "Embedded Properties"

type MetadataFieldAction =
  | { kind: "info"; key: string }
  | { kind: "xmp"; tagName: string }
  | { kind: "embedded-spec"; attachmentIndex: number; key: string }
  | {
      kind: "embedded-param"
      attachmentIndex: number
      streamKey: string
      key: string
    }

type MetadataField = {
  id: string
  group: MetadataGroup
  field: string
  value: string
  action: MetadataFieldAction
}

type MetadataInspection = {
  fields: MetadataField[]
  pageCount: number
}

type PurgeResultSummary = {
  removedCount: number
  remainingCount: number
}

const GROUP_ORDER: Record<MetadataGroup, number> = {
  "Info Dictionary": 1,
  "XMP Metadata": 2,
  "Embedded Properties": 3,
}

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

const extractBaseName = (fileName: string) => fileName.replace(/\.pdf$/i, "")

const decodePdfValue = (pdfDoc: PDFDocument, value: unknown): string => {
  const resolved =
    value && typeof value === "object"
      ? pdfDoc.context.lookup(value as never) ?? value
      : value

  if (resolved instanceof PDFString || resolved instanceof PDFHexString) {
    return resolved.decodeText()
  }

  if (resolved instanceof PDFName) {
    return resolved.decodeText()
  }

  if (resolved instanceof PDFNumber) {
    return String(resolved.asNumber())
  }

  if (resolved instanceof PDFArray) {
    return resolved
      .asArray()
      .map((item) => decodePdfValue(pdfDoc, item))
      .join(", ")
  }

  if (resolved instanceof PDFDict) {
    return "[Dictionary]"
  }

  if (resolved instanceof PDFStream) {
    return `[Stream ${resolved.getContentsSize()} bytes]`
  }

  return String(resolved ?? "")
}

const extractXmpPacketFromBytes = (bytes: Uint8Array): string | null => {
  const text = new TextDecoder("latin1").decode(bytes)

  const xpacketStart = text.indexOf("<?xpacket")
  if (xpacketStart >= 0) {
    const xpacketEndStart = text.indexOf("<?xpacket end=", xpacketStart + 1)
    if (xpacketEndStart >= 0) {
      const xpacketEnd = text.indexOf("?>", xpacketEndStart)
      if (xpacketEnd >= 0) {
        return text.slice(xpacketStart, xpacketEnd + 2)
      }
    }
  }

  const xmpStart = text.indexOf("<x:xmpmeta")
  if (xmpStart >= 0) {
    const xmpEnd = text.indexOf("</x:xmpmeta>", xmpStart)
    if (xmpEnd >= 0) {
      return text.slice(xmpStart, xmpEnd + "</x:xmpmeta>".length)
    }
  }

  return null
}

const normaliseLeafText = (value: string | null | undefined) =>
  (value ?? "").replace(/\s+/g, " ").trim()

const parseXmpFields = (xmpPacket: string | null): Array<{ field: string; value: string; tagName: string }> => {
  if (!xmpPacket || typeof DOMParser === "undefined") return []

  const xml = new DOMParser().parseFromString(xmpPacket, "application/xml")
  if (xml.querySelector("parsererror")) {
    return []
  }

  const elements = Array.from(xml.getElementsByTagName("*"))

  const collectValuesByLocalName = (localNames: string[]) => {
    const wanted = new Set(localNames.map((name) => name.toLowerCase()))
    const values = new Set<string>()

    for (const element of elements) {
      const localName = (element.localName || element.tagName || "").toLowerCase()
      if (!wanted.has(localName)) continue

      const listValues = Array.from(element.getElementsByTagName("*")).filter(
        (node) => (node.localName || node.tagName || "").toLowerCase() === "li"
      )

      if (listValues.length > 0) {
        for (const node of listValues) {
          const text = normaliseLeafText(node.textContent)
          if (text) values.add(text)
        }
        continue
      }

      const text = normaliseLeafText(element.textContent)
      if (text) values.add(text)
    }

    return Array.from(values)
  }

  const knownFields: Array<{ field: string; localNames: string[]; tagName: string }> = [
    { field: "Title", localNames: ["title"], tagName: "title" },
    { field: "Author", localNames: ["creator", "author"], tagName: "creator" },
    { field: "Creator", localNames: ["creatortool", "creator"], tagName: "creatorTool" },
    {
      field: "Creation Date",
      localNames: ["createdate", "creationdate"],
      tagName: "createDate",
    },
    {
      field: "Modification Date",
      localNames: ["modifydate", "moddate"],
      tagName: "modifyDate",
    },
    { field: "Producer", localNames: ["producer"], tagName: "producer" },
    { field: "Keywords", localNames: ["keywords", "subject"], tagName: "keywords" },
  ]

  const fields: Array<{ field: string; value: string; tagName: string }> = []

  for (const knownField of knownFields) {
    const values = collectValuesByLocalName(knownField.localNames)
    if (values.length > 0) {
      fields.push({
        field: knownField.field,
        value: values.join("; "),
        tagName: knownField.tagName,
      })
    }
  }

  const ignoredLocalNames = new Set([
    "rdf",
    "description",
    "li",
    "alt",
    "seq",
    "bag",
    "xmpmeta",
  ])
  const knownLocalNames = new Set(
    knownFields.flatMap((entry) => entry.localNames.map((name) => name.toLowerCase()))
  )

  const customFields = new Map<string, Set<string>>()

  for (const element of elements) {
    if (element.children.length > 0) continue

    const localName = (element.localName || element.tagName || "").toLowerCase()
    if (ignoredLocalNames.has(localName)) continue
    if (knownLocalNames.has(localName)) continue

    const value = normaliseLeafText(element.textContent)
    if (!value) continue

    const tagName = element.tagName
    if (!customFields.has(tagName)) {
      customFields.set(tagName, new Set())
    }
    customFields.get(tagName)?.add(value)
  }

  for (const [tagName, values] of customFields) {
    fields.push({
      field: `Custom: ${tagName}`,
      value: Array.from(values).join("; "),
      tagName,
    })
  }

  return fields
}

const getEmbeddedNamesArray = (pdfDoc: PDFDocument): PDFArray | null => {
  const namesDict = pdfDoc.catalog.lookupMaybe(PDFName.of("Names"), PDFDict)
  if (!namesDict) return null

  const embeddedFilesDict = namesDict.lookupMaybe(PDFName.of("EmbeddedFiles"), PDFDict)
  if (!embeddedFilesDict) return null

  return embeddedFilesDict.lookupMaybe(PDFName.of("Names"), PDFArray) ?? null
}

const buildMetadataInspection = async (bytes: Uint8Array): Promise<MetadataInspection> => {
  const pdfDoc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  const fields: MetadataField[] = []

  const infoEntry = pdfDoc.context.trailerInfo.Info
  const infoDict = infoEntry ? pdfDoc.context.lookup(infoEntry, PDFDict) : undefined

  if (infoDict instanceof PDFDict) {
    for (const [key, value] of infoDict.entries()) {
      const keyName = key.decodeText()
      fields.push({
        id: `info:${keyName}`,
        group: "Info Dictionary",
        field: keyName,
        value: decodePdfValue(pdfDoc, value),
        action: { kind: "info", key: keyName },
      })
    }
  }

  const xmpPacket = extractXmpPacketFromBytes(bytes)
  const xmpFields = parseXmpFields(xmpPacket)
  for (const xmpField of xmpFields) {
    fields.push({
      id: `xmp:${xmpField.tagName}`,
      group: "XMP Metadata",
      field: xmpField.field,
      value: xmpField.value,
      action: { kind: "xmp", tagName: xmpField.tagName },
    })
  }

  const embeddedNames = getEmbeddedNamesArray(pdfDoc)
  if (embeddedNames) {
    for (let arrayIndex = 0; arrayIndex + 1 < embeddedNames.size(); arrayIndex += 2) {
      const attachmentIndex = arrayIndex / 2
      const attachmentName = decodePdfValue(pdfDoc, embeddedNames.get(arrayIndex))
      const fileSpec = embeddedNames.lookupMaybe(arrayIndex + 1, PDFDict)
      if (!fileSpec) continue

      for (const [key, value] of fileSpec.entries()) {
        const keyName = key.decodeText()
        if (keyName === "EF") continue

        fields.push({
          id: `embedded:${attachmentIndex}:spec:${keyName}`,
          group: "Embedded Properties",
          field: `${attachmentName || `Attachment ${attachmentIndex + 1}`} - ${keyName}`,
          value: decodePdfValue(pdfDoc, value),
          action: {
            kind: "embedded-spec",
            attachmentIndex,
            key: keyName,
          },
        })
      }

      const embeddedFileDict = fileSpec.lookupMaybe(PDFName.of("EF"), PDFDict)
      if (!embeddedFileDict) continue

      for (const [streamNameKey, streamValue] of embeddedFileDict.entries()) {
        const streamKey = streamNameKey.decodeText()
        const embeddedStream = pdfDoc.context.lookupMaybe(streamValue, PDFStream)
        if (!embeddedStream) continue

        const paramsDict = embeddedStream.dict.lookupMaybe(PDFName.of("Params"), PDFDict)
        if (!paramsDict) continue

        for (const [paramKey, paramValue] of paramsDict.entries()) {
          const paramName = paramKey.decodeText()
          fields.push({
            id: `embedded:${attachmentIndex}:param:${streamKey}:${paramName}`,
            group: "Embedded Properties",
            field: `${attachmentName || `Attachment ${attachmentIndex + 1}`} - ${streamKey}.Params.${paramName}`,
            value: decodePdfValue(pdfDoc, paramValue),
            action: {
              kind: "embedded-param",
              attachmentIndex,
              streamKey,
              key: paramName,
            },
          })
        }
      }
    }
  }

  fields.sort((left, right) => {
    const groupDiff = GROUP_ORDER[left.group] - GROUP_ORDER[right.group]
    if (groupDiff !== 0) return groupDiff
    return left.field.localeCompare(right.field)
  })

  return {
    fields,
    pageCount: pdfDoc.getPageCount(),
  }
}

const removeInfoField = (pdfDoc: PDFDocument, key: string) => {
  const infoEntry = pdfDoc.context.trailerInfo.Info
  if (!infoEntry) return

  const infoDict = pdfDoc.context.lookup(infoEntry, PDFDict)
  if (!(infoDict instanceof PDFDict)) return

  infoDict.delete(PDFName.of(key))
  if (infoDict.keys().length === 0) {
    pdfDoc.context.trailerInfo.Info = undefined
  }
}

const removeEmbeddedSpecField = (pdfDoc: PDFDocument, attachmentIndex: number, key: string) => {
  const namesArray = getEmbeddedNamesArray(pdfDoc)
  if (!namesArray) return

  const specIndex = attachmentIndex * 2 + 1
  const fileSpec = namesArray.lookupMaybe(specIndex, PDFDict)
  if (!fileSpec) return

  fileSpec.delete(PDFName.of(key))
}

const removeEmbeddedParamField = (
  pdfDoc: PDFDocument,
  attachmentIndex: number,
  streamKey: string,
  key: string
) => {
  const namesArray = getEmbeddedNamesArray(pdfDoc)
  if (!namesArray) return

  const specIndex = attachmentIndex * 2 + 1
  const fileSpec = namesArray.lookupMaybe(specIndex, PDFDict)
  if (!fileSpec) return

  const embeddedFileDict = fileSpec.lookupMaybe(PDFName.of("EF"), PDFDict)
  if (!embeddedFileDict) return

  const embeddedStream = embeddedFileDict.lookupMaybe(PDFName.of(streamKey), PDFStream)
  if (!embeddedStream) return

  const paramsDict = embeddedStream.dict.lookupMaybe(PDFName.of("Params"), PDFDict)
  if (!paramsDict) return

  paramsDict.delete(PDFName.of(key))
  if (paramsDict.keys().length === 0) {
    embeddedStream.dict.delete(PDFName.of("Params"))
  }
}

const stripXmpStream = (pdfDoc: PDFDocument) => {
  const metadataName = PDFName.of("Metadata")
  const metadataRef = pdfDoc.catalog.get(metadataName)

  if (metadataRef instanceof PDFRef) {
    pdfDoc.context.delete(metadataRef)
  }

  pdfDoc.catalog.delete(metadataName)

  for (const [ref, object] of pdfDoc.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFStream)) continue

    const streamText = new TextDecoder("latin1").decode(object.getContents())
    if (streamText.includes("<?xpacket")) {
      pdfDoc.context.delete(ref)
    }
  }
}

const purgeSelectedMetadata = async (
  file: File,
  selectedFields: MetadataField[]
): Promise<{ bytes: Uint8Array; summary: PurgeResultSummary }> => {
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const beforeInspection = await buildMetadataInspection(sourceBytes)

  const pdfDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  let shouldStripXmp = false

  for (const field of selectedFields) {
    const action = field.action

    if (action.kind === "info") {
      removeInfoField(pdfDoc, action.key)
      continue
    }

    if (action.kind === "embedded-spec") {
      removeEmbeddedSpecField(pdfDoc, action.attachmentIndex, action.key)
      continue
    }

    if (action.kind === "embedded-param") {
      removeEmbeddedParamField(pdfDoc, action.attachmentIndex, action.streamKey, action.key)
      continue
    }

    if (action.kind === "xmp") {
      shouldStripXmp = true
    }
  }

  if (shouldStripXmp) {
    stripXmpStream(pdfDoc)
  }

  const cleanedBytes = await pdfDoc.save({ useObjectStreams: true })
  const afterInspection = await buildMetadataInspection(cleanedBytes)

  return {
    bytes: cleanedBytes,
    summary: {
      removedCount: Math.max(0, beforeInspection.fields.length - afterInspection.fields.length),
      remainingCount: afterInspection.fields.length,
    },
  }
}

export default function MetadataPurgeTool() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [fields, setFields] = useState<MetadataField[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("Upload a PDF to inspect metadata locally.")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadName, setDownloadName] = useState("cleaned.pdf")
  const [downloadSize, setDownloadSize] = useState<number | null>(null)
  const [summary, setSummary] = useState<PurgeResultSummary | null>(null)

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
    }
  }, [downloadUrl])

  const clearResults = useCallback(() => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
    }
    setDownloadUrl(null)
    setDownloadSize(null)
    setSummary(null)
  }, [downloadUrl])

  const inspectFile = useCallback(
    async (candidate: File) => {
      if (!isPdfFile(candidate)) {
        toast.error("Only PDF files are supported.")
        return
      }

      setFile(candidate)
      setStatus("Inspecting metadata fields...")
      setIsLoading(true)
      clearResults()

      try {
        const inspection = await buildMetadataInspection(new Uint8Array(await candidate.arrayBuffer()))
        setFields(inspection.fields)
        setSelectedIds(inspection.fields.map((field) => field.id))
        setPageCount(inspection.pageCount)
        setStatus(
          inspection.fields.length > 0
            ? `Found ${inspection.fields.length} metadata field(s). Select what to remove.`
            : "No tracked metadata fields were detected in this file."
        )
        toast.success("Metadata inspection complete.")
      } catch (error) {
        setFile(null)
        setPageCount(null)
        setFields([])
        setSelectedIds([])
        setStatus("Could not inspect this PDF.")
        const message =
          error instanceof Error ? error.message : "Failed to inspect metadata."
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [clearResults]
  )

  const hasSelected = selectedIds.length > 0

  const allSelected = useMemo(
    () => fields.length > 0 && selectedIds.length === fields.length,
    [fields.length, selectedIds.length]
  )

  const selectedFields = useMemo(
    () => fields.filter((field) => selectedIds.includes(field.id)),
    [fields, selectedIds]
  )

  const runPurge = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    if (!selectedFields.length) {
      toast.error("Select at least one metadata field to purge.")
      return
    }

    setIsLoading(true)
    setStatus("Purging selected metadata fields locally...")

    try {
      const result = await purgeSelectedMetadata(file, selectedFields)
      clearResults()

      const outputBlob = new Blob([result.bytes], { type: "application/pdf" })
      const outputUrl = URL.createObjectURL(outputBlob)
      const outputName = `${extractBaseName(file.name)}-metadata-purged.pdf`

      setDownloadUrl(outputUrl)
      setDownloadName(outputName)
      setDownloadSize(outputBlob.size)
      setSummary(result.summary)
      setStatus(
        `Removed ${result.summary.removedCount} metadata field(s). Output PDF contains ${result.summary.remainingCount} tracked metadata field(s).`
      )
      toast.success("Metadata purge complete.")
    } catch (error) {
      setStatus("Metadata purge failed.")
      const message =
        error instanceof Error ? error.message : "Could not purge metadata fields."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [clearResults, file, selectedFields])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Toaster richColors position="top-right" />

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) {
            void inspectFile(selected)
          }
          event.currentTarget.value = ""
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                inputRef.current?.click()
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
              const dropped = event.dataTransfer.files?.[0]
              if (dropped) {
                void inspectFile(dropped)
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
            <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Metadata inspection and removal run fully offline in your browser.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Plain Metadata Purge</CardTitle>
          <CardDescription className="break-words">{status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {file ? (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                  {typeof pageCount === "number" ? ` • ${pageCount} page${pageCount === 1 ? "" : "s"}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setFile(null)
                  setPageCount(null)
                  setFields([])
                  setSelectedIds([])
                  clearResults()
                  setStatus("Upload a PDF to inspect metadata locally.")
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked === true) {
                    setSelectedIds(fields.map((field) => field.id))
                  } else {
                    setSelectedIds([])
                  }
                }}
                aria-label="Select all metadata fields"
                disabled={fields.length === 0 || isLoading}
              />
              <span className="text-sm text-foreground">Select all fields</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {selectedIds.length} selected / {fields.length} total
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]">Remove</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Current Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No tracked metadata fields found.
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(field.id)}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              setSelectedIds((previous) =>
                                previous.includes(field.id) ? previous : [...previous, field.id]
                              )
                              return
                            }
                            setSelectedIds((previous) =>
                              previous.filter((id) => id !== field.id)
                            )
                          }}
                          aria-label={`Select ${field.field}`}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{field.group}</TableCell>
                      <TableCell className="whitespace-nowrap">{field.field}</TableCell>
                      <TableCell className="min-w-[220px] max-w-[420px] break-words text-xs text-muted-foreground">
                        {field.value || "(empty)"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {summary ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-foreground">
              Removed {summary.removedCount} metadata fields. Output PDF contains {summary.remainingCount} tracked metadata fields.
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={runPurge}
            disabled={!file || !hasSelected || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Purging...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Purge Selected
              </>
            )}
          </Button>

          {downloadUrl ? (
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href={downloadUrl} download={downloadName}>
                <Download className="h-4 w-4" />
                Download Cleaned PDF
              </a>
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {downloadSize !== null ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output</CardTitle>
            <CardDescription>
              {downloadName} • {formatBytes(downloadSize)}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Files are processed locally. Zero uploads.
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

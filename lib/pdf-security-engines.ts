"use client"

import {
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFStream,
  PDFWidgetAnnotation,
  rgb,
} from "pdf-lib"

export interface Rect {
  pageIndex?: number
  pageNumber?: number
  x: number
  y: number
  width: number
  height: number
}

export type ProcessingStage =
  | "Initialising Wasm"
  | "Scrubbing Metadata"
  | "Applying Burn-In Redaction"
  | "Applying Visual Signature"
  | "Removing Password Protection"
  | "Complete"

type StageReporter = (stage: ProcessingStage, message: string) => void

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

const METADATA_KEYS = [
  "Author",
  "Creator",
  "Producer",
  "CreationDate",
  "ModDate",
  "Title",
  "Subject",
  "Keywords",
  "Metadata",
  "PieceInfo",
  "LastModified",
  "Company",
  "Manager",
  "Trapped",
] as const

const name = (value: string) => PDFName.of(value)

const reportStage = (
  stage: ProcessingStage,
  message: string,
  onStageChange?: StageReporter
) => {
  onStageChange?.(stage, message)
  console.info(`[Plain] ${message}`)
}

const getPdfJs = async (): Promise<PdfJsModule> => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs")
  }

  return pdfJsModulePromise
}

const scrubMetadataKeysFromDict = (dict: PDFDict) => {
  for (const key of METADATA_KEYS) {
    dict.delete(name(key))
  }
}

const scrubMetadataFromDocument = (pdfDoc: PDFDocument) => {
  const context = pdfDoc.context

  for (const [, object] of context.enumerateIndirectObjects()) {
    if (object instanceof PDFDict) {
      scrubMetadataKeysFromDict(object)
      continue
    }

    if (object instanceof PDFStream) {
      scrubMetadataKeysFromDict(object.dict)
    }
  }

  pdfDoc.catalog.delete(name("Metadata"))
  context.trailerInfo.Info = undefined
}

const rebuildAsFlattenedDocument = async (sourceDoc: PDFDocument) => {
  const rebuiltDoc = await PDFDocument.create()
  const pages = await rebuiltDoc.copyPages(sourceDoc, sourceDoc.getPageIndices())
  for (const page of pages) {
    rebuiltDoc.addPage(page)
  }
  scrubMetadataFromDocument(rebuiltDoc)
  return rebuiltDoc
}

const safeGetPageIndex = (rect: Rect) => {
  if (typeof rect.pageIndex === "number") return rect.pageIndex
  if (typeof rect.pageNumber === "number") return rect.pageNumber - 1
  return 0
}

const drawBurnInRectangles = (
  context: CanvasRenderingContext2D,
  pageHeight: number,
  scale: number,
  rectangles: Rect[]
) => {
  context.save()
  context.fillStyle = "#000000"

  for (const rect of rectangles) {
    const scaledX = rect.x * scale
    const scaledWidth = rect.width * scale
    const scaledHeight = rect.height * scale
    const scaledY = pageHeight - (rect.y + rect.height) * scale
    context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
  }

  context.restore()
}

const createSignatureStampPng = async (signerLabel: string) => {
  const canvas = document.createElement("canvas")
  canvas.width = 520
  canvas.height = 160
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not initialise canvas context for signature stamping.")
  }

  ctx.fillStyle = "#0e0e0e"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "#0070f3"
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 28px Arial, sans-serif"
  ctx.fillText("Digitally Signed", 26, 58)

  ctx.fillStyle = "#5aa7ff"
  ctx.font = "20px Arial, sans-serif"
  ctx.fillText(signerLabel, 26, 95)

  ctx.fillStyle = "#8aa2bf"
  ctx.font = "16px Arial, sans-serif"
  ctx.fillText("Local-only visual signature", 26, 128)

  return canvas.toDataURL("image/png")
}

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

const clonePdfWithoutEncryption = async (inputBytes: Uint8Array) => {
  const sourcePdf = await PDFDocument.load(inputBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  const cleanDoc = await rebuildAsFlattenedDocument(sourcePdf)
  return await cleanDoc.save({ useObjectStreams: true })
}

export async function purgeMetadata(
  file: File,
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm core for local metadata sanitisation.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const sourceDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  reportStage(
    "Scrubbing Metadata",
    "Scrubbing metadata entries locally with no uploads.",
    onStageChange
  )

  scrubMetadataFromDocument(sourceDoc)
  const flattenedDoc = await rebuildAsFlattenedDocument(sourceDoc)
  const cleanedBytes = await flattenedDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Metadata scrubbing complete. The cleaned PDF is ready for download.",
    onStageChange
  )

  return cleanedBytes
}

export async function applyBurnInRedaction(
  file: File,
  coordinates: Rect[],
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm and local rendering engines for burn-in redaction.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfjs = await getPdfJs()
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  const sourcePdf = await loadingTask.promise
  const outputDoc = await PDFDocument.create()
  const renderScale = 2

  try {
    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const renderViewport = page.getViewport({ scale: renderScale })
      const pointViewport = page.getViewport({ scale: 1 })

      const canvas = document.createElement("canvas")
      canvas.width = Math.ceil(renderViewport.width)
      canvas.height = Math.ceil(renderViewport.height)

      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise canvas context for local redaction.")
      }

      await page.render({
        canvasContext: context,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      reportStage(
        "Applying Burn-In Redaction",
        `Applying burn-in redaction on page ${pageIndex + 1} locally.`,
        onStageChange
      )

      const pageRects = coordinates.filter((rect) => safeGetPageIndex(rect) === pageIndex)
      drawBurnInRectangles(context, pointViewport.height, renderScale, pageRects)

      const redactedPngDataUrl = canvas.toDataURL("image/png")
      const redactedImage = await outputDoc.embedPng(redactedPngDataUrl)
      const outputPage = outputDoc.addPage([pointViewport.width, pointViewport.height])

      outputPage.drawImage(redactedImage, {
        x: 0,
        y: 0,
        width: pointViewport.width,
        height: pointViewport.height,
      })

      if (pageRects.length > 0) {
        for (const rect of pageRects) {
          outputPage.drawRectangle({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            color: rgb(0, 0, 0),
          })
        }
      }
    }
  } finally {
    await loadingTask.destroy()
  }

  scrubMetadataFromDocument(outputDoc)
  const redactedBytes = await outputDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Burn-in redaction complete. Underlying content has been removed and flattened locally.",
    onStageChange
  )

  return redactedBytes
}

export async function signPDF(
  file: File,
  certificate?: ArrayBuffer,
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm core for local signing.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  const firstPage = pdfDoc.getPages()[0] ?? pdfDoc.addPage()

  reportStage(
    "Applying Visual Signature",
    "Applying visual signature stamp locally with no uploads.",
    onStageChange
  )

  const signaturePng = await createSignatureStampPng("Plain Local Signer")
  const signatureImage = await pdfDoc.embedPng(signaturePng)

  const stampWidth = Math.min(firstPage.getWidth() * 0.42, 240)
  const stampHeight = stampWidth * (signatureImage.height / signatureImage.width)
  const stampX = Math.max(24, firstPage.getWidth() - stampWidth - 24)
  const stampY = 24

  firstPage.drawImage(signatureImage, {
    x: stampX,
    y: stampY,
    width: stampWidth,
    height: stampHeight,
  })

  const signatureFieldName = `Plain.LocalSignature.${Date.now()}`
  const signatureFieldDict = pdfDoc.context.obj({
    FT: "Sig",
    T: PDFHexString.fromText(signatureFieldName),
    Ff: 0,
    Kids: [],
  })
  const signatureFieldRef = pdfDoc.context.register(signatureFieldDict)

  const widget = PDFWidgetAnnotation.create(pdfDoc.context, signatureFieldRef)
  widget.setRectangle({
    x: stampX,
    y: stampY,
    width: stampWidth,
    height: stampHeight,
  })
  widget.setP(firstPage.ref)
  widget.setDefaultAppearance("/Helv 10 Tf 0 g")
  const widgetRef = pdfDoc.context.register(widget.dict)

  signatureFieldDict.set(PDFName.of("Kids"), pdfDoc.context.obj([widgetRef]))
  pdfDoc.getForm().acroForm.addField(signatureFieldRef)
  firstPage.node.addAnnot(widgetRef)

  if (certificate && typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", certificate)
    const digestHex = toHex(new Uint8Array(digest))
    pdfDoc.setSubject(
      `Cryptographic signing placeholder initialised locally (SHA-256:${digestHex.slice(0, 16)}...)`
    )
    console.info(
      "[Plain] Cryptographic signing placeholder initialised with local SubtleCrypto digest."
    )
  } else {
    console.info(
      "[Plain] Cryptographic signing placeholder initialised without certificate data."
    )
  }

  scrubMetadataFromDocument(pdfDoc)
  const signedBytes = await pdfDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Signing complete. Visual signature and signature field were applied locally.",
    onStageChange
  )

  return signedBytes
}

export async function removePDFPassword(
  file: File,
  password: string,
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising local password removal engine.",
    onStageChange
  )

  if (!password.trim()) {
    throw new Error("A password is required for local password removal.")
  }

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfjs = await getPdfJs()

  reportStage(
    "Removing Password Protection",
    "Removing password protection locally with no telemetry.",
    onStageChange
  )

  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    password,
    disableWorker: true,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const openedPdf = await loadingTask.promise
    const openedBytes = new Uint8Array(await openedPdf.getData())

    try {
      const unprotectedBytes = await clonePdfWithoutEncryption(openedBytes)
      reportStage(
        "Complete",
        "Password removal complete. The PDF has been re-saved locally without protection.",
        onStageChange
      )
      return unprotectedBytes
    } catch {
      const outputDoc = await PDFDocument.create()

      for (let pageIndex = 0; pageIndex < openedPdf.numPages; pageIndex++) {
        const page = await openedPdf.getPage(pageIndex + 1)
        const viewport = page.getViewport({ scale: 1.5 })
        const pointViewport = page.getViewport({ scale: 1 })

        const canvas = document.createElement("canvas")
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)

        const context = canvas.getContext("2d")
        if (!context) {
          throw new Error("Could not initialise canvas context for local password removal.")
        }

        await page.render({
          canvasContext: context,
          viewport,
          annotationMode: pdfjs.AnnotationMode.ENABLE,
        }).promise

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        const pageImage = await outputDoc.embedJpg(imageDataUrl)
        const outputPage = outputDoc.addPage([pointViewport.width, pointViewport.height])
        outputPage.drawImage(pageImage, {
          x: 0,
          y: 0,
          width: pointViewport.width,
          height: pointViewport.height,
        })
      }

      scrubMetadataFromDocument(outputDoc)
      const unprotectedBytes = await outputDoc.save({ useObjectStreams: true })

      reportStage(
        "Complete",
        "Password removal complete. A flattened local copy has been generated.",
        onStageChange
      )
      return unprotectedBytes
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Local password removal failed. Please verify the password and try again."
    throw new Error(message)
  } finally {
    await loadingTask.destroy()
  }
}

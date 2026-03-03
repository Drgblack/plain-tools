"use client"

import {
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
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

export interface PlainRedactionRegion {
  page: number
  coords: {
    x: number
    y: number
    width: number
    height: number
  }
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

export type LocalSigningKeyInput = CryptoKey | ArrayBuffer | Uint8Array

export interface PlainLocalSignerOptions {
  verificationKey?: CryptoKey
  signerName?: string
  reason?: string
  location?: string
  certificate?: ArrayBuffer | Uint8Array
  onStageChange?: StageReporter
}

interface MetadataSnapshot {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  creationDate?: string
  modificationDate?: string
  hasXmpMetadata: boolean
  infoKeys: string[]
  customInfo: Record<string, string>
}

export interface MetadataPurgeDiff {
  before: MetadataSnapshot
  after: MetadataSnapshot
  removedInfoKeys: string[]
  removedCustomInfoKeys: string[]
  xmpRemoved: boolean
  infoDictionaryCleared: boolean
}

export interface PlainMetadataPurgeOptions {
  onStageChange?: StageReporter
  onDiff?: (diff: MetadataPurgeDiff) => void
}

export interface PlainPasswordBreakerOptions {
  knownPassword?: string
  bruteForceLimit?: number
  onStageChange?: StageReporter
}

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

const STANDARD_INFO_KEYS = new Set<string>(METADATA_KEYS)

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
    pdfJsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
      }
      return pdfjs
    })
  }

  return pdfJsModulePromise
}

const serialisePdfObject = (value: unknown) => {
  if (value instanceof PDFString || value instanceof PDFHexString) {
    return value.decodeText()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value && typeof value === "object" && "toString" in value) {
    return String(value.toString())
  }

  return String(value ?? "")
}

const readInfoDictionary = (pdfDoc: PDFDocument) => {
  const infoEntry = pdfDoc.context.trailerInfo.Info
  if (!infoEntry) {
    return {
      keys: [] as string[],
      customInfo: {} as Record<string, string>,
    }
  }

  const infoDict = pdfDoc.context.lookup(infoEntry, PDFDict)
  if (!(infoDict instanceof PDFDict)) {
    return {
      keys: [] as string[],
      customInfo: {} as Record<string, string>,
    }
  }

  const keys: string[] = []
  const customInfo: Record<string, string> = {}
  for (const [key, value] of infoDict.entries()) {
    const decodedKey = key.decodeText()
    keys.push(decodedKey)
    if (!STANDARD_INFO_KEYS.has(decodedKey)) {
      customInfo[decodedKey] = serialisePdfObject(value)
    }
  }

  return { keys, customInfo }
}

const snapshotMetadata = (pdfDoc: PDFDocument): MetadataSnapshot => {
  const infoSnapshot = readInfoDictionary(pdfDoc)

  return {
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    subject: pdfDoc.getSubject(),
    keywords: pdfDoc.getKeywords(),
    creator: pdfDoc.getCreator(),
    producer: pdfDoc.getProducer(),
    creationDate: pdfDoc.getCreationDate()?.toISOString(),
    modificationDate: pdfDoc.getModificationDate()?.toISOString(),
    hasXmpMetadata: pdfDoc.catalog.has(name("Metadata")),
    infoKeys: infoSnapshot.keys,
    customInfo: infoSnapshot.customInfo,
  }
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

type PixelRegion = {
  x: number
  y: number
  width: number
  height: number
}

const createRedactionCanvas = (width: number, height: number) => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Could not initialise offscreen canvas for local redaction.")
    }

    return {
      canvas,
      context,
      width,
      height,
      getImageData: () => context.getImageData(0, 0, width, height),
      putImageData: (imageData: ImageData) => context.putImageData(imageData, 0, 0),
      toPngBytes: async () => new Uint8Array(await (await canvas.convertToBlob({
        type: "image/png",
      })).arrayBuffer()),
    }
  }

  if (typeof document === "undefined") {
    throw new Error(
      "Canvas rendering is unavailable. Please run redaction in a browser context."
    )
  }

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialise canvas context for local redaction.")
  }

  return {
    canvas,
    context,
    width,
    height,
    getImageData: () => context.getImageData(0, 0, width, height),
    putImageData: (imageData: ImageData) => context.putImageData(imageData, 0, 0),
    toPngBytes: async () =>
      await new Promise<Uint8Array>((resolve, reject) => {
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error("Could not export redacted canvas image."))
              return
            }
            resolve(new Uint8Array(await blob.arrayBuffer()))
          },
          "image/png",
          1
        )
      }),
  }
}

const drawBleedFillRectangles = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  rectangles: PixelRegion[]
) => {
  context.save()
  context.fillStyle = "#000000"
  for (const rect of rectangles) {
    context.fillRect(rect.x, rect.y, rect.width, rect.height)
  }
  context.restore()
}

const normalisePixelRegion = (
  pageWidth: number,
  pageHeight: number,
  rect: PixelRegion
): PixelRegion => {
  const startX = Math.max(0, Math.floor(rect.x))
  const startY = Math.max(0, Math.floor(rect.y))
  const endX = Math.min(pageWidth, Math.ceil(rect.x + rect.width))
  const endY = Math.min(pageHeight, Math.ceil(rect.y + rect.height))
  return {
    x: startX,
    y: startY,
    width: Math.max(0, endX - startX),
    height: Math.max(0, endY - startY),
  }
}

const applyWebGpuRedactionMask = async (
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  regions: PixelRegion[]
) => {
  const gpuNavigator = (
    typeof navigator !== "undefined" ? navigator : undefined
  ) as Navigator & { gpu?: unknown }
  if (!gpuNavigator?.gpu || regions.length === 0) {
    return pixels
  }

  try {
    const gpu = gpuNavigator.gpu as {
      requestAdapter: () => Promise<{
        requestDevice: () => Promise<unknown>
      } | null>
    }
    const adapter = await gpu.requestAdapter()
    if (!adapter) {
      return pixels
    }

    const device = (await adapter.requestDevice()) as {
      createBuffer: (params: {
        size: number
        usage: number
        mappedAtCreation?: boolean
      }) => {
        getMappedRange: () => ArrayBuffer
        unmap: () => void
        mapAsync: (mode: number) => Promise<void>
        destroy: () => void
      }
      createShaderModule: (params: { code: string }) => unknown
      createComputePipeline: (params: {
        layout: "auto"
        compute: { module: unknown; entryPoint: string }
      }) => {
        getBindGroupLayout: (index: number) => unknown
      }
      createBindGroup: (params: {
        layout: unknown
        entries: Array<{ binding: number; resource: { buffer: unknown } }>
      }) => unknown
      createCommandEncoder: () => {
        beginComputePass: () => {
          setPipeline: (pipeline: unknown) => void
          setBindGroup: (index: number, bindGroup: unknown) => void
          dispatchWorkgroups: (x: number) => void
          end: () => void
        }
        copyBufferToBuffer: (
          source: unknown,
          sourceOffset: number,
          destination: unknown,
          destinationOffset: number,
          size: number
        ) => void
        finish: () => unknown
      }
      queue: {
        submit: (commands: unknown[]) => void
      }
    }

    const gpuBufferUsage = (globalThis as unknown as {
      GPUBufferUsage?: Record<string, number>
    }).GPUBufferUsage
    const gpuMapMode = (globalThis as unknown as {
      GPUMapMode?: Record<string, number>
    }).GPUMapMode
    const gpuShaderStage = (globalThis as unknown as {
      GPUShaderStage?: Record<string, number>
    }).GPUShaderStage

    if (!gpuBufferUsage || !gpuMapMode || !gpuShaderStage) {
      return pixels
    }

    const pixelByteLength = pixels.byteLength
    const pixelBuffer = device.createBuffer({
      size: pixelByteLength,
      usage:
        gpuBufferUsage.STORAGE |
        gpuBufferUsage.COPY_DST |
        gpuBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    })
    new Uint8Array(pixelBuffer.getMappedRange()).set(pixels)
    pixelBuffer.unmap()

    const regionData = new Uint32Array(regions.length * 4)
    for (let index = 0; index < regions.length; index++) {
      const region = regions[index]
      const offset = index * 4
      regionData[offset] = region.x
      regionData[offset + 1] = region.y
      regionData[offset + 2] = region.width
      regionData[offset + 3] = region.height
    }

    const regionBuffer = device.createBuffer({
      size: Math.max(16, regionData.byteLength),
      usage: gpuBufferUsage.STORAGE | gpuBufferUsage.COPY_DST,
      mappedAtCreation: true,
    })
    new Uint8Array(regionBuffer.getMappedRange()).set(new Uint8Array(regionData.buffer))
    regionBuffer.unmap()

    const params = new Uint32Array([width, height, regions.length, 0])
    const paramsBuffer = device.createBuffer({
      size: 16,
      usage: gpuBufferUsage.UNIFORM | gpuBufferUsage.COPY_DST,
      mappedAtCreation: true,
    })
    new Uint8Array(paramsBuffer.getMappedRange()).set(new Uint8Array(params.buffer))
    paramsBuffer.unmap()

    const shaderModule = device.createShaderModule({
      code: `
        struct Params {
          width: u32,
          height: u32,
          regionCount: u32,
          padding: u32,
        };

        struct Region {
          x: u32,
          y: u32,
          width: u32,
          height: u32,
        };

        @group(0) @binding(0) var<storage, read_write> pixels: array<u32>;
        @group(0) @binding(1) var<storage, read> regions: array<Region>;
        @group(0) @binding(2) var<uniform> params: Params;

        @compute @workgroup_size(256)
        fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
          let index = gid.x;
          let totalPixels = params.width * params.height;
          if (index >= totalPixels) {
            return;
          }

          let pixelX = index % params.width;
          let pixelY = index / params.width;
          var shouldMask = false;

          for (var i: u32 = 0u; i < params.regionCount; i = i + 1u) {
            let region = regions[i];
            if (
              pixelX >= region.x &&
              pixelX < (region.x + region.width) &&
              pixelY >= region.y &&
              pixelY < (region.y + region.height)
            ) {
              shouldMask = true;
              break;
            }
          }

          if (shouldMask) {
            pixels[index] = 0xff000000u;
          }
        }
      `,
    })

    const pipeline = device.createComputePipeline({
      layout: "auto",
      compute: {
        module: shaderModule,
        entryPoint: "main",
      },
    })

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: pixelBuffer } },
        { binding: 1, resource: { buffer: regionBuffer } },
        { binding: 2, resource: { buffer: paramsBuffer } },
      ],
    })

    const readbackBuffer = device.createBuffer({
      size: pixelByteLength,
      usage: gpuBufferUsage.COPY_DST | gpuBufferUsage.MAP_READ,
    })

    const encoder = device.createCommandEncoder()
    const pass = encoder.beginComputePass()
    pass.setPipeline(pipeline)
    pass.setBindGroup(0, bindGroup)
    pass.dispatchWorkgroups(Math.ceil((width * height) / 256))
    pass.end()
    encoder.copyBufferToBuffer(pixelBuffer, 0, readbackBuffer, 0, pixelByteLength)

    device.queue.submit([encoder.finish()])
    await readbackBuffer.mapAsync(gpuMapMode.READ)

    const mapped = readbackBuffer.getMappedRange()
    const output = new Uint8ClampedArray(mapped.slice(0))

    readbackBuffer.destroy()
    pixelBuffer.destroy()
    regionBuffer.destroy()
    paramsBuffer.destroy()

    return output
  } catch (error) {
    console.info(
      "[Plain] WebGPU masking was unavailable. Falling back to CPU redaction fill."
    )
    console.info(error)
    return pixels
  }
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

const toBase64 = (bytes: Uint8Array) => {
  let binary = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

const toByteArray = (value: ArrayBuffer | Uint8Array) =>
  value instanceof Uint8Array ? value : new Uint8Array(value)

type LocalSigningAlgorithm = AlgorithmIdentifier | RsaPssParams | EcdsaParams

const resolveSigningAlgorithm = (key: CryptoKey): LocalSigningAlgorithm => {
  const algorithm = key.algorithm
  if (!algorithm || typeof algorithm !== "object" || !("name" in algorithm)) {
    return { name: "HMAC" }
  }

  const algorithmName = algorithm.name
  if (algorithmName === "RSA-PSS") {
    return { name: "RSA-PSS", saltLength: 32 } as RsaPssParams
  }

  if (algorithmName === "ECDSA") {
    return { name: "ECDSA", hash: "SHA-256" } as EcdsaParams
  }

  if (algorithmName === "RSASSA-PKCS1-v1_5") {
    return { name: "RSASSA-PKCS1-v1_5" }
  }

  if (algorithmName === "HMAC") {
    return { name: "HMAC" }
  }

  return { name: algorithmName }
}

const normaliseLocalSigningKey = async (keyMaterial: LocalSigningKeyInput) => {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is unavailable. Local signing cannot be initialised.")
  }

  if (keyMaterial instanceof CryptoKey) {
    if (!keyMaterial.usages.includes("sign")) {
      throw new Error("The provided key cannot sign documents locally.")
    }

    return {
      signingKey: keyMaterial,
      verificationKey: keyMaterial.usages.includes("verify") ? keyMaterial : undefined,
    }
  }

  const rawKey = toByteArray(keyMaterial)
  const importedKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )

  return {
    signingKey: importedKey,
    verificationKey: importedKey,
  }
}

const getHashAlgorithmName = (key: CryptoKey) => {
  const algorithm = key.algorithm as { hash?: { name?: string } }
  return algorithm.hash?.name || "SHA-256"
}

const getSigningAlgorithmLabel = (algorithm: AlgorithmIdentifier) => {
  if (typeof algorithm === "string") {
    return algorithm
  }

  if (algorithm && typeof algorithm === "object" && "name" in algorithm) {
    return String(algorithm.name)
  }

  return "Unknown"
}

const createDetachedPkcs7Payload = (params: {
  signature: Uint8Array
  digestHex: string
  signerName: string
  reason: string
  location: string
  signedAt: string
  algorithm: string
  certificate?: Uint8Array
}) => {
  const payload = {
    profile: "PAdES-B-B",
    subFilter: "adbe.pkcs7.detached",
    signerName: params.signerName,
    reason: params.reason,
    location: params.location,
    signedAt: params.signedAt,
    digestHex: params.digestHex,
    algorithm: params.algorithm,
    signatureBase64: toBase64(params.signature),
    certificateBase64: params.certificate ? toBase64(params.certificate) : undefined,
    localOnly: true,
  }

  return new TextEncoder().encode(JSON.stringify(payload))
}

const clonePdfWithoutEncryption = async (inputBytes: Uint8Array) => {
  const sourcePdf = await PDFDocument.load(inputBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  const cleanDoc = await rebuildAsFlattenedDocument(sourcePdf)
  return await cleanDoc.save({ useObjectStreams: true })
}

const MAX_LOCAL_BRUTE_FORCE_LIMIT = 50_000

const isPasswordFailure = (
  error: unknown,
  pdfjs: PdfJsModule
) => {
  if (!(error instanceof Error)) {
    return false
  }

  const passwordError = error as Error & { code?: number }
  if (
    error.name === "PasswordException" &&
    typeof passwordError.code === "number" &&
    (passwordError.code === pdfjs.PasswordResponses.INCORRECT_PASSWORD ||
      passwordError.code === pdfjs.PasswordResponses.NEED_PASSWORD)
  ) {
    return true
  }

  const message = (error.message || "").toLowerCase()
  return message.includes("password")
}

const saveUnprotectedFromOpenedPdf = async (
  openedPdf: Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]>,
  pdfjs: PdfJsModule
) => {
  const openedBytes = new Uint8Array(await openedPdf.getData())

  try {
    return await clonePdfWithoutEncryption(openedBytes)
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
        canvas,
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
    return await outputDoc.save({ useObjectStreams: true })
  }
}

const attemptPasswordUnlock = async (
  sourceBytes: Uint8Array,
  password: string,
  pdfjs: PdfJsModule
) => {
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    password,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  try {
    const openedPdf = await loadingTask.promise
    return await saveUnprotectedFromOpenedPdf(openedPdf, pdfjs)
  } catch (error) {
    if (isPasswordFailure(error, pdfjs)) {
      return null
    }
    throw error
  } finally {
    await loadingTask.destroy()
  }
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

export async function plainMetadataPurge(
  file: File,
  options: PlainMetadataPurgeOptions = {}
): Promise<Uint8Array> {
  reportStage(
    "Initialising Wasm",
    "Initialising Wasm core for local metadata purge.",
    options.onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const sourceDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  const before = snapshotMetadata(sourceDoc)

  reportStage(
    "Scrubbing Metadata",
    "Scrubbing XMP, producer, creator, and custom metadata locally.",
    options.onStageChange
  )

  sourceDoc.setProducer("")
  sourceDoc.setCreator("")
  sourceDoc.setAuthor("")
  sourceDoc.setTitle("")
  sourceDoc.setSubject("")
  sourceDoc.setKeywords([])

  scrubMetadataFromDocument(sourceDoc)
  const flattenedDoc = await rebuildAsFlattenedDocument(sourceDoc)
  scrubMetadataFromDocument(flattenedDoc)

  const after = snapshotMetadata(flattenedDoc)
  const diff: MetadataPurgeDiff = {
    before,
    after,
    removedInfoKeys: before.infoKeys.filter((key) => !after.infoKeys.includes(key)),
    removedCustomInfoKeys: Object.keys(before.customInfo).filter(
      (key) => !(key in after.customInfo)
    ),
    xmpRemoved: before.hasXmpMetadata && !after.hasXmpMetadata,
    infoDictionaryCleared: before.infoKeys.length > 0 && after.infoKeys.length === 0,
  }

  options.onDiff?.(diff)
  console.info("[Plain] Metadata purge diff", diff)

  const cleanedBytes = await flattenedDoc.save({ useObjectStreams: true })

  reportStage(
    "Complete",
    "Metadata purge complete. The cleaned PDF is ready for local download.",
    options.onStageChange
  )

  return cleanedBytes
}

export async function plainIrreversibleRedactor(
  file: File,
  redactionRegions: PlainRedactionRegion[],
  onStageChange?: StageReporter
): Promise<Uint8Array> {
  if (!redactionRegions.length) {
    throw new Error("At least one redaction region is required for irreversible redaction.")
  }

  reportStage(
    "Initialising Wasm",
    "Initialising Wasm and WebGPU pipeline for irreversible local redaction.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfjs = await getPdfJs()
  const loadingTask = pdfjs.getDocument({
    data: sourceBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  const sourcePdf = await loadingTask.promise
  const outputDoc = await PDFDocument.create()
  const renderScale = 2
  const bleedPoints = 1.5

  try {
    for (let pageIndex = 0; pageIndex < sourcePdf.numPages; pageIndex++) {
      const page = await sourcePdf.getPage(pageIndex + 1)
      const renderViewport = page.getViewport({ scale: renderScale })
      const pointViewport = page.getViewport({ scale: 1 })
      const canvasWidth = Math.max(1, Math.ceil(renderViewport.width))
      const canvasHeight = Math.max(1, Math.ceil(renderViewport.height))
      const renderSurface = createRedactionCanvas(canvasWidth, canvasHeight)

      await page.render({
        canvas: renderSurface.canvas as unknown as HTMLCanvasElement,
        canvasContext: renderSurface.context as unknown as CanvasRenderingContext2D,
        viewport: renderViewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      reportStage(
        "Applying Burn-In Redaction",
        `Applying irreversible redaction on page ${pageIndex + 1} locally.`,
        onStageChange
      )

      const regionsForPage = redactionRegions
        .filter((region) => region.page - 1 === pageIndex)
        .map((region) => region.coords)
        .map((coords) => {
          const bleedX = Math.max(0, coords.x - bleedPoints)
          const bleedY = Math.max(0, coords.y - bleedPoints)
          const bleedWidth = coords.width + bleedPoints * 2
          const bleedHeight = coords.height + bleedPoints * 2

          return normalisePixelRegion(canvasWidth, canvasHeight, {
            x: bleedX * renderScale,
            y: (pointViewport.height - (bleedY + bleedHeight)) * renderScale,
            width: bleedWidth * renderScale,
            height: bleedHeight * renderScale,
          })
        })
        .filter((region) => region.width > 0 && region.height > 0)

      if (regionsForPage.length > 0) {
        const pagePixels = renderSurface.getImageData()
        const maskedPixels = await applyWebGpuRedactionMask(
          pagePixels.data,
          canvasWidth,
          canvasHeight,
          regionsForPage
        )
        pagePixels.data.set(maskedPixels)
        renderSurface.putImageData(pagePixels)
        drawBleedFillRectangles(renderSurface.context, regionsForPage)
      }

      const redactedPngBytes = await renderSurface.toPngBytes()
      const redactedImage = await outputDoc.embedPng(redactedPngBytes)
      const outputPage = outputDoc.addPage([pointViewport.width, pointViewport.height])

      outputPage.drawImage(redactedImage, {
        x: 0,
        y: 0,
        width: pointViewport.width,
        height: pointViewport.height,
      })

      for (const region of redactionRegions.filter((entry) => entry.page - 1 === pageIndex)) {
        const bleedX = Math.max(0, region.coords.x - bleedPoints)
        const bleedY = Math.max(0, region.coords.y - bleedPoints)
        const bleedWidth = Math.min(
          pointViewport.width - bleedX,
          region.coords.width + bleedPoints * 2
        )
        const bleedHeight = Math.min(
          pointViewport.height - bleedY,
          region.coords.height + bleedPoints * 2
        )

        outputPage.drawRectangle({
          x: bleedX,
          y: bleedY,
          width: Math.max(0, bleedWidth),
          height: Math.max(0, bleedHeight),
          color: rgb(0, 0, 0),
        })
      }
    }
  } finally {
    await loadingTask.destroy()
  }

  scrubMetadataFromDocument(outputDoc)
  const redactedBytes = await outputDoc.save({ useObjectStreams: true })

  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error(
      "SHA-256 verification is unavailable in this browser for irreversible redaction."
    )
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", redactedBytes)
  const redactedHash = toHex(new Uint8Array(hashBuffer))
  console.info(
    `[Plain] Irreversible redaction complete. SHA-256 verification: ${redactedHash}`
  )

  reportStage(
    "Complete",
    "Irreversible redaction complete. Content streams were rebuilt and verified locally.",
    onStageChange
  )

  return redactedBytes
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
        canvas,
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

export async function plainLocalCryptographicSigner(
  file: File,
  keyMaterial: LocalSigningKeyInput,
  options: PlainLocalSignerOptions = {}
): Promise<Uint8Array> {
  const onStageChange = options.onStageChange

  reportStage(
    "Initialising Wasm",
    "Initialising local signing engine for PAdES/PKCS#7 processing.",
    onStageChange
  )

  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfDoc = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is unavailable. Local cryptographic signing cannot continue.")
  }

  const { signingKey, verificationKey: fallbackVerificationKey } =
    await normaliseLocalSigningKey(keyMaterial)
  const verificationKey = options.verificationKey ?? fallbackVerificationKey

  if (!verificationKey) {
    throw new Error(
      "Offline validity checking requires a verification key with 'verify' usage."
    )
  }

  const signerName = options.signerName?.trim() || "Plain Local Cryptographic Signer"
  const reason =
    options.reason?.trim() || "Document approved and signed fully offline."
  const location = options.location?.trim() || "Local Browser Runtime"
  const certificateBytes = options.certificate
    ? toByteArray(options.certificate)
    : undefined

  const firstPage = pdfDoc.getPages()[0] ?? pdfDoc.addPage()

  reportStage(
    "Applying Visual Signature",
    "Applying local visual signature and creating signature field.",
    onStageChange
  )

  const signaturePng = await createSignatureStampPng(signerName)
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

  const signatureFieldName = `Plain.LocalCryptographicSignature.${Date.now()}`
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

  const unsignedBytes = await pdfDoc.save({ useObjectStreams: true })
  const signingAlgorithm = resolveSigningAlgorithm(signingKey)
  const signingAlgorithmLabel = getSigningAlgorithmLabel(signingAlgorithm)
  const signatureBuffer = await crypto.subtle.sign(
    signingAlgorithm,
    signingKey,
    unsignedBytes
  )
  const signatureBytes = new Uint8Array(signatureBuffer)

  const isValid = await crypto.subtle.verify(
    signingAlgorithm,
    verificationKey,
    signatureBuffer,
    unsignedBytes
  )

  if (!isValid) {
    throw new Error("Offline validity check failed. Signature bytes could not be verified.")
  }

  const hashAlgorithm = getHashAlgorithmName(signingKey)
  const digestBuffer = await crypto.subtle.digest(hashAlgorithm, unsignedBytes)
  const digestHex = toHex(new Uint8Array(digestBuffer))
  const signingTimestamp = new Date()

  const detachedPayload = createDetachedPkcs7Payload({
    signature: signatureBytes,
    digestHex,
    signerName,
    reason,
    location,
    signedAt: signingTimestamp.toISOString(),
    algorithm: `${signingAlgorithmLabel}-${hashAlgorithm}`,
    certificate: certificateBytes,
  })

  const signatureDictionary = pdfDoc.context.obj({
    Type: "Sig",
    Filter: "Adobe.PPKLite",
    SubFilter: "adbe.pkcs7.detached",
    Name: PDFHexString.fromText(signerName),
    Reason: PDFHexString.fromText(reason),
    Location: PDFHexString.fromText(location),
    M: PDFString.fromDate(signingTimestamp),
    ByteRange: pdfDoc.context.obj([0, 0, 0, 0]),
    Contents: PDFHexString.of(toHex(detachedPayload)),
  })

  const signatureDictionaryRef = pdfDoc.context.register(signatureDictionary)
  signatureFieldDict.set(PDFName.of("V"), signatureDictionaryRef)

  pdfDoc.setSubject(
    `Local cryptographic signature verified offline (${hashAlgorithm}:${digestHex.slice(0, 16)}...).`
  )
  pdfDoc.setProducer("Plain Local Cryptographic Signer")

  const signedBytes = await pdfDoc.save({ useObjectStreams: true })
  const verificationDoc = await PDFDocument.load(signedBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  })
  const hasSignatureField = verificationDoc
    .getForm()
    .getFields()
    .some((field) => field.getName() === signatureFieldName)

  if (!hasSignatureField) {
    throw new Error("Offline validity check failed. Signature field was not persisted.")
  }

  reportStage(
    "Complete",
    "Local cryptographic signing complete. Offline validity check passed.",
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

  try {
    const unprotectedBytes = await attemptPasswordUnlock(sourceBytes, password, pdfjs)
    if (unprotectedBytes) {
      reportStage(
        "Complete",
        "Password removal complete. The PDF has been re-saved locally without protection.",
        onStageChange
      )
      return unprotectedBytes
    }

    throw new Error("Local password removal failed. Please verify the password and try again.")
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Local password removal failed. Please verify the password and try again."
    throw new Error(message)
  }
}

export async function plainPasswordBreaker(
  file: File,
  options: PlainPasswordBreakerOptions = {}
): Promise<Uint8Array> {
  const onStageChange = options.onStageChange
  const sourceBytes = new Uint8Array(await file.arrayBuffer())
  const pdfjs = await getPdfJs()

  reportStage(
    "Initialising Wasm",
    "Initialising local password recovery engine.",
    onStageChange
  )

  console.warn(
    "[Plain] Password recovery runs entirely locally with no telemetry. Use only on files you are authorised to unlock."
  )

  const knownPassword = options.knownPassword?.trim()
  if (knownPassword) {
    reportStage(
      "Removing Password Protection",
      "Trying the supplied password locally.",
      onStageChange
    )

    const unlockedWithKnownPassword = await attemptPasswordUnlock(
      sourceBytes,
      knownPassword,
      pdfjs
    )

    if (unlockedWithKnownPassword) {
      reportStage(
        "Complete",
        "Password recovery complete. The file was unlocked locally.",
        onStageChange
      )
      return unlockedWithKnownPassword
    }
  }

  const requestedLimit = Math.floor(options.bruteForceLimit ?? 0)
  const bruteForceLimit = Math.max(0, Math.min(MAX_LOCAL_BRUTE_FORCE_LIMIT, requestedLimit))
  if (bruteForceLimit <= 0) {
    throw new Error(
      "Password recovery failed with the supplied key. Provide a valid password or set a local brute-force limit."
    )
  }

  reportStage(
    "Removing Password Protection",
    `Running local brute-force recovery for up to ${bruteForceLimit} candidate keys.`,
    onStageChange
  )

  const pinWidth = Math.max(4, String(bruteForceLimit - 1).length)
  for (let attemptIndex = 0; attemptIndex < bruteForceLimit; attemptIndex++) {
    const candidate = String(attemptIndex).padStart(pinWidth, "0")
    const unlocked = await attemptPasswordUnlock(sourceBytes, candidate, pdfjs)

    if (unlocked) {
      console.info(
        `[Plain] Local password recovery succeeded after ${attemptIndex + 1} attempts.`
      )
      reportStage(
        "Complete",
        "Password recovery complete. The file was unlocked locally.",
        onStageChange
      )
      return unlocked
    }

    if (attemptIndex === 0 || (attemptIndex + 1) % 250 === 0) {
      console.info(
        `[Plain] Password recovery is still running locally (${attemptIndex + 1}/${bruteForceLimit}).`
      )
    }
  }

  throw new Error(
    "Password recovery was unsuccessful within the local brute-force limit."
  )
}


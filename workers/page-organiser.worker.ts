/// <reference lib="webworker" />
/// <reference types="@webgpu/types" />

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js"
}

type GenerateThumbnailsRequest = {
  type: "generateThumbnails"
  requestId: string
  pdfBytes: ArrayBuffer
  thumbnailWidth?: number
}

type ProgressMessage = {
  type: "progress"
  requestId: string
  progress: number
  status: string
}

type SuccessMessage = {
  type: "success"
  requestId: string
  thumbnails: Array<{ originalIndex: number; dataUrl: string }>
  pageCount: number
  webgpuActive: boolean
}

type ErrorMessage = {
  type: "error"
  requestId: string
  error: string
}

const THUMBNAIL_WIDTH_DEFAULT = 180

let gpuDevice: GPUDevice | null = null
let gpuPipeline: GPURenderPipeline | null = null
let gpuSampler: GPUSampler | null = null
let gpuFormat: GPUTextureFormat | null = null

const workerScope = self as DedicatedWorkerGlobalScope

const createStatus = (page: number, total: number) =>
  `Organising previews locally: page ${page} of ${total}.`

const sendProgress = (requestId: string, progress: number, status: string) => {
  const message: ProgressMessage = {
    type: "progress",
    requestId,
    progress,
    status,
  }
  workerScope.postMessage(message)
}

const sendError = (requestId: string, error: string) => {
  const message: ErrorMessage = {
    type: "error",
    requestId,
    error,
  }
  workerScope.postMessage(message)
}

const arrayBufferToDataUrl = (buffer: ArrayBuffer, mimeType: string) => {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunkSize = 0x8000

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return `data:${mimeType};base64,${btoa(binary)}`
}

const offscreenToDataUrl = async (canvas: OffscreenCanvas) => {
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 })
  const buffer = await blob.arrayBuffer()
  return arrayBufferToDataUrl(buffer, "image/jpeg")
}

const ensureGpuResources = async () => {
  if (gpuDevice && gpuPipeline && gpuSampler && gpuFormat) {
    return true
  }

  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return false
  }

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  })

  if (!adapter) {
    return false
  }

  gpuDevice = await adapter.requestDevice()
  gpuFormat = navigator.gpu.getPreferredCanvasFormat()
  gpuSampler = gpuDevice.createSampler({
    magFilter: "linear",
    minFilter: "linear",
  })

  const shaderModule = gpuDevice.createShaderModule({
    code: `
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) uv: vec2<f32>,
      };

      @vertex
      fn vs(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
        var positions = array<vec2<f32>, 6>(
          vec2<f32>(-1.0, -1.0),
          vec2<f32>(1.0, -1.0),
          vec2<f32>(-1.0, 1.0),
          vec2<f32>(-1.0, 1.0),
          vec2<f32>(1.0, -1.0),
          vec2<f32>(1.0, 1.0),
        );
        var uvs = array<vec2<f32>, 6>(
          vec2<f32>(0.0, 1.0),
          vec2<f32>(1.0, 1.0),
          vec2<f32>(0.0, 0.0),
          vec2<f32>(0.0, 0.0),
          vec2<f32>(1.0, 1.0),
          vec2<f32>(1.0, 0.0),
        );

        var out: VertexOutput;
        out.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
        out.uv = uvs[vertexIndex];
        return out;
      }

      @group(0) @binding(0) var thumbnailSampler: sampler;
      @group(0) @binding(1) var thumbnailTexture: texture_2d<f32>;

      @fragment
      fn fs(in: VertexOutput) -> @location(0) vec4<f32> {
        return textureSample(thumbnailTexture, thumbnailSampler, in.uv);
      }
    `,
  })

  gpuPipeline = gpuDevice.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs",
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs",
      targets: [{ format: gpuFormat }],
    },
    primitive: {
      topology: "triangle-list",
    },
  })

  return true
}

const resizeWithWebGpu = async (
  sourceCanvas: OffscreenCanvas,
  targetWidth: number,
  targetHeight: number
) => {
  const ready = await ensureGpuResources()
  if (!ready || !gpuDevice || !gpuPipeline || !gpuSampler || !gpuFormat) {
    return null
  }

  const outputCanvas = new OffscreenCanvas(targetWidth, targetHeight)
  const context = outputCanvas.getContext("webgpu") as GPUCanvasContext | null
  if (!context) {
    return null
  }

  context.configure({
    device: gpuDevice,
    format: gpuFormat,
    alphaMode: "premultiplied",
  })

  const sourceTexture = gpuDevice.createTexture({
    size: [sourceCanvas.width, sourceCanvas.height, 1],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  })

  gpuDevice.queue.copyExternalImageToTexture(
    { source: sourceCanvas },
    { texture: sourceTexture },
    [sourceCanvas.width, sourceCanvas.height]
  )

  const bindGroup = gpuDevice.createBindGroup({
    layout: gpuPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: gpuSampler },
      { binding: 1, resource: sourceTexture.createView() },
    ],
  })

  const commandEncoder = gpuDevice.createCommandEncoder()
  const view = context.getCurrentTexture().createView()
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view,
        loadOp: "clear",
        storeOp: "store",
        clearValue: { r: 1, g: 1, b: 1, a: 1 },
      },
    ],
  })

  renderPass.setPipeline(gpuPipeline)
  renderPass.setBindGroup(0, bindGroup)
  renderPass.draw(6, 1, 0, 0)
  renderPass.end()

  gpuDevice.queue.submit([commandEncoder.finish()])
  await gpuDevice.queue.onSubmittedWorkDone()

  sourceTexture.destroy()
  return outputCanvas
}

const resizeWithCanvas2D = (
  sourceCanvas: OffscreenCanvas,
  targetWidth: number,
  targetHeight: number
) => {
  const outputCanvas = new OffscreenCanvas(targetWidth, targetHeight)
  const context = outputCanvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialise 2D context for thumbnail rendering.")
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, targetWidth, targetHeight)
  context.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight)
  return outputCanvas
}

const generateThumbnails = async ({
  requestId,
  pdfBytes,
  thumbnailWidth = THUMBNAIL_WIDTH_DEFAULT,
}: GenerateThumbnailsRequest) => {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes,
    disableAutoFetch: true,
    disableRange: true,
    disableStream: true,
  })

  const pdf = await loadingTask.promise
  const thumbnails: Array<{ originalIndex: number; dataUrl: string }> = []
  let webgpuActive = false

  try {
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex)
      const viewport = page.getViewport({ scale: 1 })
      const scale = thumbnailWidth / viewport.width
      const thumbnailHeight = Math.max(1, Math.round(viewport.height * scale))

      const renderCanvas = new OffscreenCanvas(
        Math.max(1, Math.round(viewport.width)),
        Math.max(1, Math.round(viewport.height))
      )

      const renderContext = renderCanvas.getContext("2d")
      if (!renderContext) {
        throw new Error("Could not initialise render context in worker.")
      }

      await page.render({
        canvas: renderCanvas as unknown as HTMLCanvasElement,
        canvasContext: renderContext as unknown as CanvasRenderingContext2D,
        viewport,
        annotationMode: pdfjsLib.AnnotationMode.ENABLE,
      }).promise

      let outputCanvas: OffscreenCanvas | null = null

      try {
        outputCanvas = await resizeWithWebGpu(renderCanvas, thumbnailWidth, thumbnailHeight)
      } catch {
        outputCanvas = null
      }

      if (outputCanvas) {
        webgpuActive = true
      } else {
        outputCanvas = resizeWithCanvas2D(renderCanvas, thumbnailWidth, thumbnailHeight)
      }

      thumbnails.push({
        originalIndex: pageIndex - 1,
        dataUrl: await offscreenToDataUrl(outputCanvas),
      })

      sendProgress(
        requestId,
        Math.round((pageIndex / pdf.numPages) * 100),
        createStatus(pageIndex, pdf.numPages)
      )
    }
  } finally {
    await loadingTask.destroy()
  }

  const successMessage: SuccessMessage = {
    type: "success",
    requestId,
    thumbnails,
    pageCount: pdf.numPages,
    webgpuActive,
  }
  workerScope.postMessage(successMessage)
}

workerScope.onmessage = async (event: MessageEvent<GenerateThumbnailsRequest>) => {
  const payload = event.data

  if (payload?.type !== "generateThumbnails") {
    return
  }

  try {
    await generateThumbnails(payload)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate thumbnails in the local worker."
    sendError(payload.requestId, message)
  }
}


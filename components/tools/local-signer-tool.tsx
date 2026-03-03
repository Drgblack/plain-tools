"use client"

import { Download, FileSignature, Loader2, ShieldCheck, Trash2, UploadCloud } from "lucide-react"
import {
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
  PDFWidgetAnnotation,
} from "pdf-lib"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { ProcessedLocallyBadge } from "@/components/tools/processed-locally-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { notifyLocalDownloadSuccess } from "@/lib/local-download-events"

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs")

type SignatureMode = "draw" | "type" | "upload"
type CryptoMode = "webcrypto" | "webauthn"
type WebCryptoAlgorithm = "RSA-PSS" | "ECDSA"
type VerifyStatus = "idle" | "valid" | "invalid"

type SignatureAsset = {
  dataUrl: string
  width: number
  height: number
}

type Placement = {
  x: number
  y: number
  width: number
  height: number
}

type PreviewSize = {
  width: number
  height: number
}

type SignEnvelope = {
  version: number
  path: CryptoMode
  algorithm: string
  signerName: string
  createdAt: string
  fingerprintHex: string
  signedDigestHex: string
  signatureBase64: string
  publicKeySpkiBase64?: string
  webauthn?: {
    credentialIdBase64: string
    authenticatorDataBase64: string
    clientDataJSONBase64: string
  }
}

type SignResult = {
  signedBytes: Uint8Array
  fingerprintHex: string
  publicKeyPem: string | null
  pathUsed: CryptoMode
}

const SIGNATURE_PLACEHOLDER_BYTES = 8192
const BYTE_RANGE_PLACEHOLDER = "9999999999"
const SIGNATURE_PREFIX = "PLAINSIG1:"
const DRAW_CANVAS_WIDTH = 640
const DRAW_CANVAS_HEIGHT = 220

let pdfJsModulePromise: Promise<PdfJsModule> | null = null

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

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

const hexToBytes = (hex: string) => {
  const normalised = hex.replace(/\s+/g, "")
  const length = Math.floor(normalised.length / 2)
  const output = new Uint8Array(length)
  for (let index = 0; index < length; index++) {
    output[index] = parseInt(normalised.slice(index * 2, index * 2 + 2), 16)
  }
  return output
}

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

const base64ToBytes = (value: string) => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

const base64UrlToBytes = (value: string) => {
  const normalised = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = `${normalised}${"=".repeat((4 - (normalised.length % 4)) % 4)}`
  return base64ToBytes(padded)
}

const concatBytes = (...parts: Uint8Array[]) => {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}

const latin1ToString = (bytes: Uint8Array) => {
  let output = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    output += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return output
}

const stringToLatin1Bytes = (value: string) => {
  const bytes = new Uint8Array(value.length)
  for (let index = 0; index < value.length; index++) {
    bytes[index] = value.charCodeAt(index) & 0xff
  }
  return bytes
}

const trimTrailingZeros = (bytes: Uint8Array) => {
  let end = bytes.length
  while (end > 0 && bytes[end - 1] === 0) {
    end -= 1
  }
  return bytes.subarray(0, end)
}

const extractBaseName = (fileName: string) => fileName.replace(/\.pdf$/i, "")

const toPem = (spkiBytes: Uint8Array) => {
  const base64 = bytesToBase64(spkiBytes)
  const lines = base64.match(/.{1,64}/g) ?? [base64]
  return `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----`
}

const parsePemPublicKey = (pem: string) => {
  const body = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "")
  if (!body) {
    throw new Error("PEM file does not contain a public key.")
  }
  return base64ToBytes(body)
}

const sha256 = async (bytes: Uint8Array) =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))

const getAssetFromDataUrl = async (dataUrl: string): Promise<SignatureAsset> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const instance = new Image()
    instance.onload = () => resolve(instance)
    instance.onerror = () => reject(new Error("Could not read signature image."))
    instance.src = dataUrl
  })

  return {
    dataUrl,
    width: image.naturalWidth,
    height: image.naturalHeight,
  }
}

const normaliseToPngDataUrl = async (asset: SignatureAsset) => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const instance = new Image()
    instance.onload = () => resolve(instance)
    instance.onerror = () => reject(new Error("Could not rasterise signature."))
    instance.src = asset.dataUrl
  })

  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, image.naturalWidth)
  canvas.height = Math.max(1, image.naturalHeight)
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not prepare signature image for PDF embedding.")
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/png")
}

const mapPlacementToPdf = (
  placement: Placement,
  preview: PreviewSize,
  pdfPageWidth: number,
  pdfPageHeight: number
) => {
  const x = (placement.x / preview.width) * pdfPageWidth
  const width = (placement.width / preview.width) * pdfPageWidth
  const height = (placement.height / preview.height) * pdfPageHeight
  const y = pdfPageHeight - ((placement.y + placement.height) / preview.height) * pdfPageHeight

  return {
    x,
    y,
    width,
    height,
  }
}

const applyByteRangeAndGetSignedData = (unsignedBytes: Uint8Array) => {
  let pdfText = latin1ToString(unsignedBytes)

  const byteRangePattern = new RegExp(
    String.raw`/ByteRange\s*\[\s*0\s+${BYTE_RANGE_PLACEHOLDER}\s+${BYTE_RANGE_PLACEHOLDER}\s+${BYTE_RANGE_PLACEHOLDER}\s*\]`
  )
  const byteRangeMatch = pdfText.match(byteRangePattern)
  if (!byteRangeMatch || typeof byteRangeMatch.index !== "number") {
    throw new Error("Could not locate signature byte range placeholder.")
  }

  const contentsMarkerIndex = pdfText.indexOf("/Contents <", byteRangeMatch.index)
  if (contentsMarkerIndex < 0) {
    throw new Error("Could not locate signature contents placeholder.")
  }

  const hexStart = pdfText.indexOf("<", contentsMarkerIndex)
  const hexEnd = pdfText.indexOf(">", hexStart + 1)
  if (hexStart < 0 || hexEnd < 0) {
    throw new Error("Malformed signature contents placeholder.")
  }

  const signatureHexStart = hexStart + 1
  const signatureHexEnd = hexEnd
  const secondRangeStart = signatureHexEnd + 1

  const byteRange: [number, number, number, number] = [
    0,
    signatureHexStart,
    secondRangeStart,
    pdfText.length - secondRangeStart,
  ]

  const actualByteRangeText = `/ByteRange [${byteRange[0]} ${byteRange[1]} ${byteRange[2]} ${byteRange[3]}]`
  const placeholderText = byteRangeMatch[0]

  if (actualByteRangeText.length > placeholderText.length) {
    throw new Error("ByteRange placeholder is too short for this document.")
  }

  const paddedByteRangeText = `${actualByteRangeText}${" ".repeat(
    placeholderText.length - actualByteRangeText.length
  )}`

  pdfText = `${pdfText.slice(0, byteRangeMatch.index)}${paddedByteRangeText}${pdfText.slice(
    byteRangeMatch.index + placeholderText.length
  )}`

  const byteRangePatched = stringToLatin1Bytes(pdfText)
  const signedData = concatBytes(
    byteRangePatched.subarray(0, byteRange[1]),
    byteRangePatched.subarray(byteRange[2], byteRange[2] + byteRange[3])
  )

  return {
    pdfText,
    signedData,
    signatureHexStart,
    signatureHexLength: signatureHexEnd - signatureHexStart,
  }
}

const embedEnvelopeIntoPdf = (
  byteRangePatchedPdfText: string,
  signatureHexStart: number,
  signatureHexLength: number,
  envelope: SignEnvelope
) => {
  const envelopeBytes = new TextEncoder().encode(`${SIGNATURE_PREFIX}${JSON.stringify(envelope)}`)
  const envelopeHex = bytesToHex(envelopeBytes)

  if (envelopeHex.length > signatureHexLength) {
    throw new Error("Signature payload exceeded PDF placeholder size.")
  }

  const paddedEnvelopeHex = `${envelopeHex}${"0".repeat(signatureHexLength - envelopeHex.length)}`

  const signedPdfText = `${byteRangePatchedPdfText.slice(0, signatureHexStart)}${paddedEnvelopeHex}${byteRangePatchedPdfText.slice(
    signatureHexStart + signatureHexLength
  )}`

  return stringToLatin1Bytes(signedPdfText)
}

const importVerificationKey = async (spki: Uint8Array, algorithm: string) => {
  if (algorithm.startsWith("RSA-PSS")) {
    return await crypto.subtle.importKey(
      "spki",
      spki,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    )
  }

  return await crypto.subtle.importKey(
    "spki",
    spki,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false,
    ["verify"]
  )
}

const signWithWebCrypto = async (
  digestBytes: Uint8Array,
  signerName: string,
  algorithm: WebCryptoAlgorithm
): Promise<{
  envelope: SignEnvelope
  publicKeyPem: string
}> => {
  if (algorithm === "RSA-PSS") {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )

    const signature = new Uint8Array(
      await crypto.subtle.sign(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        keyPair.privateKey,
        digestBytes
      )
    )

    const publicSpki = new Uint8Array(await crypto.subtle.exportKey("spki", keyPair.publicKey))
    const publicKeyPem = toPem(publicSpki)

    return {
      publicKeyPem,
      envelope: {
        version: 1,
        path: "webcrypto",
        algorithm: "RSA-PSS-SHA256",
        signerName,
        createdAt: new Date().toISOString(),
        fingerprintHex: bytesToHex(digestBytes),
        signedDigestHex: bytesToHex(digestBytes),
        signatureBase64: bytesToBase64(signature),
        publicKeySpkiBase64: bytesToBase64(publicSpki),
      },
    }
  }

  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  )

  const signature = new Uint8Array(
    await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      digestBytes
    )
  )

  const publicSpki = new Uint8Array(await crypto.subtle.exportKey("spki", keyPair.publicKey))
  const publicKeyPem = toPem(publicSpki)

  return {
    publicKeyPem,
    envelope: {
      version: 1,
      path: "webcrypto",
      algorithm: "ECDSA-P256-SHA256",
      signerName,
      createdAt: new Date().toISOString(),
      fingerprintHex: bytesToHex(digestBytes),
      signedDigestHex: bytesToHex(digestBytes),
      signatureBase64: bytesToBase64(signature),
      publicKeySpkiBase64: bytesToBase64(publicSpki),
    },
  }
}

const signWithWebAuthn = async (
  digestBytes: Uint8Array,
  signerName: string
): Promise<{
  envelope: SignEnvelope
  publicKeyPem: string | null
}> => {
  if (!navigator.credentials || typeof window.PublicKeyCredential === "undefined") {
    throw new Error("WebAuthn is unavailable in this browser.")
  }

  const userId = crypto.getRandomValues(new Uint8Array(16))

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge: digestBytes,
    rp: {
      name: "Plain Local Signer",
    },
    user: {
      id: userId,
      name: `plain-local-signer-${Date.now()}@local`,
      displayName: signerName || "Plain Local Signer",
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    timeout: 60_000,
    attestation: "none",
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "preferred",
    },
  }

  const created = (await navigator.credentials.create({
    publicKey: creationOptions,
  })) as PublicKeyCredential | null

  if (!created) {
    throw new Error("Passkey registration was cancelled.")
  }

  const attestation = created.response as AuthenticatorAttestationResponse
  const publicKeyBuffer = attestation.getPublicKey ? attestation.getPublicKey() : null
  const publicKeySpki = publicKeyBuffer ? new Uint8Array(publicKeyBuffer) : null

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: digestBytes,
    allowCredentials: [{
      id: created.rawId,
      type: "public-key",
    }],
    timeout: 60_000,
    userVerification: "preferred",
  }

  const asserted = (await navigator.credentials.get({
    publicKey: requestOptions,
  })) as PublicKeyCredential | null

  if (!asserted) {
    throw new Error("Passkey assertion was cancelled.")
  }

  const assertionResponse = asserted.response as AuthenticatorAssertionResponse

  return {
    publicKeyPem: publicKeySpki ? toPem(publicKeySpki) : null,
    envelope: {
      version: 1,
      path: "webauthn",
      algorithm: "WEBAUTHN-ES256",
      signerName,
      createdAt: new Date().toISOString(),
      fingerprintHex: bytesToHex(digestBytes),
      signedDigestHex: bytesToHex(digestBytes),
      signatureBase64: bytesToBase64(new Uint8Array(assertionResponse.signature)),
      publicKeySpkiBase64: publicKeySpki ? bytesToBase64(publicKeySpki) : undefined,
      webauthn: {
        credentialIdBase64: bytesToBase64(new Uint8Array(asserted.rawId)),
        authenticatorDataBase64: bytesToBase64(new Uint8Array(assertionResponse.authenticatorData)),
        clientDataJSONBase64: bytesToBase64(new Uint8Array(assertionResponse.clientDataJSON)),
      },
    },
  }
}

const extractEnvelopeFromPdf = (bytes: Uint8Array) => {
  const pdfText = latin1ToString(bytes)

  const byteRangeMatch = pdfText.match(/\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/)
  if (!byteRangeMatch) {
    throw new Error("No signature ByteRange found in this PDF.")
  }

  const byteRangeOffset = byteRangeMatch.index ?? 0
  const rangeStart = Number(byteRangeMatch[1])
  const rangeLength = Number(byteRangeMatch[2])
  const secondStart = Number(byteRangeMatch[3])
  const secondLength = Number(byteRangeMatch[4])

  const contentsMarkerIndex = pdfText.indexOf("/Contents <", byteRangeOffset)
  if (contentsMarkerIndex < 0) {
    throw new Error("No embedded signature payload found.")
  }

  const hexStart = pdfText.indexOf("<", contentsMarkerIndex)
  const hexEnd = pdfText.indexOf(">", hexStart + 1)
  if (hexStart < 0 || hexEnd < 0) {
    throw new Error("Signature contents are malformed.")
  }

  const payloadHex = pdfText.slice(hexStart + 1, hexEnd)
  const payloadBytes = trimTrailingZeros(hexToBytes(payloadHex))
  const payloadText = new TextDecoder().decode(payloadBytes)

  if (!payloadText.startsWith(SIGNATURE_PREFIX)) {
    throw new Error("Signature payload is not a Plain Local Signer envelope.")
  }

  const envelope = JSON.parse(payloadText.slice(SIGNATURE_PREFIX.length)) as SignEnvelope

  const signedData = concatBytes(
    bytes.subarray(rangeStart, rangeStart + rangeLength),
    bytes.subarray(secondStart, secondStart + secondLength)
  )

  return {
    envelope,
    signedData,
  }
}

const verifyEnvelope = async (
  envelope: SignEnvelope,
  signedData: Uint8Array,
  pemText: string
) => {
  const digestBytes = await sha256(signedData)
  const digestHex = bytesToHex(digestBytes)

  if (envelope.fingerprintHex && envelope.fingerprintHex !== digestHex) {
    return {
      valid: false,
      message: "Document fingerprint mismatch. The file appears modified.",
      fingerprintHex: digestHex,
    }
  }

  const spki = parsePemPublicKey(pemText)

  if (envelope.path === "webauthn") {
    if (!envelope.webauthn) {
      return {
        valid: false,
        message: "WebAuthn payload is incomplete.",
        fingerprintHex: digestHex,
      }
    }

    const importedKey = await importVerificationKey(spki, "ECDSA-P256-SHA256")
    const authenticatorData = base64ToBytes(envelope.webauthn.authenticatorDataBase64)
    const clientDataJson = base64ToBytes(envelope.webauthn.clientDataJSONBase64)
    const clientDataHash = await sha256(clientDataJson)
    const verificationBytes = concatBytes(authenticatorData, clientDataHash)

    const clientData = JSON.parse(new TextDecoder().decode(clientDataJson)) as {
      challenge?: string
    }

    const challengeBytes = clientData.challenge
      ? base64UrlToBytes(clientData.challenge)
      : new Uint8Array()

    if (challengeBytes.length > 0 && bytesToHex(challengeBytes) !== digestHex) {
      return {
        valid: false,
        message: "WebAuthn challenge does not match the signed document digest.",
        fingerprintHex: digestHex,
      }
    }

    const valid = await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      importedKey,
      base64ToBytes(envelope.signatureBase64),
      verificationBytes
    )

    return {
      valid,
      message: valid
        ? "Signature valid. Document has not been modified since signing."
        : "Signature invalid or document has been altered.",
      fingerprintHex: digestHex,
    }
  }

  const importedKey = await importVerificationKey(spki, envelope.algorithm)

  const verifyAlgorithm = envelope.algorithm.startsWith("RSA-PSS")
    ? { name: "RSA-PSS" as const, saltLength: 32 }
    : { name: "ECDSA" as const, hash: "SHA-256" }

  const valid = await crypto.subtle.verify(
    verifyAlgorithm,
    importedKey,
    base64ToBytes(envelope.signatureBase64),
    digestBytes
  )

  return {
    valid,
    message: valid
      ? "Signature valid. Document has not been modified since signing."
      : "Signature invalid or document has been altered.",
    fingerprintHex: digestHex,
  }
}

export default function LocalSignerTool() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadSignatureInputRef = useRef<HTMLInputElement>(null)
  const verifyPdfInputRef = useRef<HTMLInputElement>(null)
  const verifyPemInputRef = useRef<HTMLInputElement>(null)

  const drawCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const drawPointerActiveRef = useRef(false)
  const drawLastPointRef = useRef<{ x: number; y: number } | null>(null)

  const interactionRef = useRef<
    | {
        mode: "drag" | "resize"
        startX: number
        startY: number
        origin: Placement
      }
    | null
  >(null)

  const [activeTab, setActiveTab] = useState<"sign" | "verify">("sign")

  const [file, setFile] = useState<File | null>(null)
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [pdfPageSize, setPdfPageSize] = useState<PreviewSize | null>(null)
  const [previewSize, setPreviewSize] = useState<PreviewSize | null>(null)
  const [isDraggingOverFile, setIsDraggingOverFile] = useState(false)

  const [signatureMode, setSignatureMode] = useState<SignatureMode>("draw")
  const [typedSignature, setTypedSignature] = useState("Jane Doe")
  const [uploadedAsset, setUploadedAsset] = useState<SignatureAsset | null>(null)
  const [drawHasInk, setDrawHasInk] = useState(false)

  const [signerName, setSignerName] = useState("Jane Doe")
  const [usePasskey, setUsePasskey] = useState(false)
  const [algorithm, setAlgorithm] = useState<WebCryptoAlgorithm>("RSA-PSS")

  const [placement, setPlacement] = useState<Placement | null>(null)

  const [isSigning, setIsSigning] = useState(false)
  const [signStatus, setSignStatus] = useState("Upload a PDF and add your signature.")

  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null)
  const [signedPdfName, setSignedPdfName] = useState("signed.pdf")
  const [publicKeyUrl, setPublicKeyUrl] = useState<string | null>(null)
  const [publicKeyName, setPublicKeyName] = useState("public-key.pem")
  const [fingerprintHex, setFingerprintHex] = useState("")
  const [pathUsed, setPathUsed] = useState<CryptoMode | null>(null)

  const [verifyPdfFile, setVerifyPdfFile] = useState<File | null>(null)
  const [verifyPemFile, setVerifyPemFile] = useState<File | null>(null)
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle")
  const [verifyMessage, setVerifyMessage] = useState("Upload a signed PDF and a PEM public key to verify.")
  const [verifyFingerprint, setVerifyFingerprint] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [webAuthnAvailable, setWebAuthnAvailable] = useState(false)

  useEffect(() => {
    setWebAuthnAvailable(
      typeof window !== "undefined" &&
        typeof window.PublicKeyCredential !== "undefined" &&
        !!navigator.credentials
    )
  }, [])

  useEffect(() => {
    if (!drawCanvasRef.current) return
    const canvas = drawCanvasRef.current
    canvas.width = DRAW_CANVAS_WIDTH
    canvas.height = DRAW_CANVAS_HEIGHT

    const context = canvas.getContext("2d")
    if (!context) return

    context.fillStyle = "#0f1115"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = "#60a5fa"
    context.lineWidth = 3.5
    context.lineCap = "round"
    context.lineJoin = "round"
  }, [])

  useEffect(() => {
    return () => {
      if (signedPdfUrl) URL.revokeObjectURL(signedPdfUrl)
      if (publicKeyUrl) URL.revokeObjectURL(publicKeyUrl)
    }
  }, [publicKeyUrl, signedPdfUrl])

  const clearOutputs = useCallback(() => {
    if (signedPdfUrl) URL.revokeObjectURL(signedPdfUrl)
    if (publicKeyUrl) URL.revokeObjectURL(publicKeyUrl)
    setSignedPdfUrl(null)
    setPublicKeyUrl(null)
    setFingerprintHex("")
    setPathUsed(null)
  }, [publicKeyUrl, signedPdfUrl])

  const clearDrawPad = useCallback(() => {
    const canvas = drawCanvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#0f1115"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = "#60a5fa"
    context.lineWidth = 3.5
    context.lineCap = "round"
    context.lineJoin = "round"
    setDrawHasInk(false)
  }, [])

  const getCanvasPoint = useCallback((canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * canvas.width
    const y = ((clientY - rect.top) / rect.height) * canvas.height
    return { x, y }
  }, [])

  const beginDraw = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = drawCanvasRef.current
      if (!canvas) return

      const context = canvas.getContext("2d")
      if (!context) return

      const point = getCanvasPoint(canvas, clientX, clientY)
      drawPointerActiveRef.current = true
      drawLastPointRef.current = point
      context.beginPath()
      context.moveTo(point.x, point.y)
    },
    [getCanvasPoint]
  )

  const moveDraw = useCallback(
    (clientX: number, clientY: number) => {
      if (!drawPointerActiveRef.current) return

      const canvas = drawCanvasRef.current
      if (!canvas) return

      const context = canvas.getContext("2d")
      if (!context) return

      const point = getCanvasPoint(canvas, clientX, clientY)
      const lastPoint = drawLastPointRef.current
      if (!lastPoint) {
        drawLastPointRef.current = point
        return
      }

      context.beginPath()
      context.moveTo(lastPoint.x, lastPoint.y)
      context.lineTo(point.x, point.y)
      context.stroke()

      drawLastPointRef.current = point
      setDrawHasInk(true)
    },
    [getCanvasPoint]
  )

  const endDraw = useCallback(() => {
    drawPointerActiveRef.current = false
    drawLastPointRef.current = null
  }, [])

  const getDrawSignatureAsset = useCallback(async (): Promise<SignatureAsset | null> => {
    const canvas = drawCanvasRef.current
    if (!canvas || !drawHasInk) return null

    const context = canvas.getContext("2d")
    if (!context) return null

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const { data } = imageData

    let minX = canvas.width
    let minY = canvas.height
    let maxX = 0
    let maxY = 0
    let found = false

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const offset = (y * canvas.width + x) * 4
        const red = data[offset]
        const green = data[offset + 1]
        const blue = data[offset + 2]

        const isInk = red > 40 || green > 40 || blue > 40
        if (!isInk) continue

        found = true
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }

    if (!found) return null

    const padding = 12
    minX = Math.max(0, minX - padding)
    minY = Math.max(0, minY - padding)
    maxX = Math.min(canvas.width - 1, maxX + padding)
    maxY = Math.min(canvas.height - 1, maxY + padding)

    const width = Math.max(1, maxX - minX + 1)
    const height = Math.max(1, maxY - minY + 1)

    const trimmedCanvas = document.createElement("canvas")
    trimmedCanvas.width = width
    trimmedCanvas.height = height
    const trimmedContext = trimmedCanvas.getContext("2d")
    if (!trimmedContext) return null

    trimmedContext.drawImage(canvas, minX, minY, width, height, 0, 0, width, height)

    return {
      dataUrl: trimmedCanvas.toDataURL("image/png"),
      width,
      height,
    }
  }, [drawHasInk])

  const getTypedSignatureAsset = useCallback(async (): Promise<SignatureAsset | null> => {
    const text = typedSignature.trim()
    if (!text) return null

    if (document.fonts) {
      await document.fonts.load("64px 'Dancing Script Local'")
    }

    const canvas = document.createElement("canvas")
    canvas.width = 900
    canvas.height = 260
    const context = canvas.getContext("2d")
    if (!context) return null

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.font = "700 116px 'Dancing Script Local', cursive"
    context.textBaseline = "middle"
    context.fillStyle = "#0f172a"
    context.fillText(text, 24, canvas.height / 2)

    const metrics = context.measureText(text)
    const width = Math.max(1, Math.ceil(metrics.width + 48))
    const height = 180

    const clipped = document.createElement("canvas")
    clipped.width = width
    clipped.height = height
    const clippedContext = clipped.getContext("2d")
    if (!clippedContext) return null

    clippedContext.font = "700 116px 'Dancing Script Local', cursive"
    clippedContext.textBaseline = "middle"
    clippedContext.fillStyle = "#0f172a"
    clippedContext.fillText(text, 24, clipped.height / 2)

    return {
      dataUrl: clipped.toDataURL("image/png"),
      width,
      height,
    }
  }, [typedSignature])

  const activeSignatureAsset = useMemo(() => {
    if (signatureMode === "upload") {
      return uploadedAsset
    }
    return null
  }, [signatureMode, uploadedAsset])

  const initialisePlacement = useCallback(
    (asset: SignatureAsset) => {
      if (!previewSize) return

      const ratio = asset.width / Math.max(1, asset.height)
      const width = Math.min(previewSize.width * 0.45, 220)
      const height = Math.max(44, width / Math.max(0.2, ratio))

      setPlacement((existing) =>
        existing ?? {
          x: Math.max(0, (previewSize.width - width) / 2),
          y: Math.max(0, (previewSize.height - height) / 2),
          width,
          height,
        }
      )
    },
    [previewSize]
  )

  const handleUploadedSignature = useCallback(async (fileToLoad: File) => {
    const reader = new FileReader()

    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onerror = () => reject(new Error("Could not read uploaded signature file."))
      reader.onload = () => resolve(String(reader.result ?? ""))
      reader.readAsDataURL(fileToLoad)
    })

    const asset = await getAssetFromDataUrl(dataUrl)
    setUploadedAsset(asset)
    setSignatureMode("upload")
    initialisePlacement(asset)
  }, [initialisePlacement])

  const loadPdfPreview = useCallback(async (candidate: File) => {
    if (!isPdfFile(candidate)) {
      toast.error("Only PDF files are supported.")
      return
    }

    const bytes = new Uint8Array(await candidate.arrayBuffer())
    const pdfjs = await getPdfJs()
    const loadingTask = pdfjs.getDocument({
      data: bytes,
      disableAutoFetch: true,
      disableRange: true,
      disableStream: true,
    })

    try {
      const pdf = await loadingTask.promise
      const firstPage = await pdf.getPage(1)
      const baseViewport = firstPage.getViewport({ scale: 1 })
      const targetWidth = Math.min(760, baseViewport.width)
      const scale = targetWidth / baseViewport.width
      const viewport = firstPage.getViewport({ scale })

      const canvas = previewCanvasRef.current
      if (!canvas) {
        throw new Error("Could not initialise PDF preview canvas.")
      }

      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)

      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Could not initialise PDF preview context.")
      }

      await firstPage.render({
        canvas,
        canvasContext: context,
        viewport,
        annotationMode: pdfjs.AnnotationMode.ENABLE,
      }).promise

      setFile(candidate)
      setFileBytes(bytes)
      setPageCount(pdf.numPages)
      setPreviewSize({ width: canvas.width, height: canvas.height })
      setPdfPageSize({ width: baseViewport.width, height: baseViewport.height })
      setSignStatus("PDF loaded. Add signature content and place it on the preview.")
      setPlacement(null)
      clearOutputs()
      toast.success("PDF loaded for signing.")
    } finally {
      await loadingTask.destroy()
    }
  }, [clearOutputs])

  const activeAssetForPlacement = useCallback(async () => {
    if (signatureMode === "upload") {
      return uploadedAsset
    }

    if (signatureMode === "draw") {
      return await getDrawSignatureAsset()
    }

    return await getTypedSignatureAsset()
  }, [getDrawSignatureAsset, getTypedSignatureAsset, signatureMode, uploadedAsset])

  const beginPlacementInteraction = useCallback(
    (mode: "drag" | "resize", event: React.PointerEvent<HTMLDivElement>) => {
      if (!placement) return

      event.preventDefault()
      interactionRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        origin: placement,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        if (!interactionRef.current || !previewSize) return

        const deltaX = moveEvent.clientX - interactionRef.current.startX
        const deltaY = moveEvent.clientY - interactionRef.current.startY
        const origin = interactionRef.current.origin

        if (interactionRef.current.mode === "drag") {
          const nextX = Math.max(0, Math.min(previewSize.width - origin.width, origin.x + deltaX))
          const nextY = Math.max(0, Math.min(previewSize.height - origin.height, origin.y + deltaY))

          setPlacement({
            ...origin,
            x: nextX,
            y: nextY,
          })
          return
        }

        const minSize = 44
        const nextWidth = Math.max(minSize, Math.min(previewSize.width - origin.x, origin.width + deltaX))
        const nextHeight = Math.max(minSize, Math.min(previewSize.height - origin.y, origin.height + deltaY))

        setPlacement({
          ...origin,
          width: nextWidth,
          height: nextHeight,
        })
      }

      const handleUp = () => {
        interactionRef.current = null
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
      }

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
    },
    [placement, previewSize]
  )

  const signPdf = useCallback(async (): Promise<SignResult> => {
    if (!fileBytes || !previewSize || !pdfPageSize || !placement) {
      throw new Error("Upload a PDF and place a signature before signing.")
    }

    const asset = await activeAssetForPlacement()
    if (!asset) {
      throw new Error("Provide signature content first (draw, type, or upload).")
    }

    const signer = signerName.trim() || typedSignature.trim() || "Plain Local Signer"

    const pdfDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    })

    const signaturePngDataUrl = await normaliseToPngDataUrl(asset)
    const embeddedImage = await pdfDoc.embedPng(signaturePngDataUrl)
    const targetPage = pdfDoc.getPage(0)

    const mapped = mapPlacementToPdf(
      placement,
      previewSize,
      pdfPageSize.width,
      pdfPageSize.height
    )

    targetPage.drawImage(embeddedImage, {
      x: mapped.x,
      y: mapped.y,
      width: mapped.width,
      height: mapped.height,
    })

    const signatureFieldName = `Plain.LocalSigner.${Date.now()}`
    const signatureFieldDict = pdfDoc.context.obj({
      FT: "Sig",
      T: PDFHexString.fromText(signatureFieldName),
      Ff: 0,
      Kids: [],
    })
    const signatureFieldRef = pdfDoc.context.register(signatureFieldDict)

    const widget = PDFWidgetAnnotation.create(pdfDoc.context, signatureFieldRef)
    widget.setRectangle({
      x: mapped.x,
      y: mapped.y,
      width: mapped.width,
      height: mapped.height,
    })
    widget.setP(targetPage.ref)
    widget.setDefaultAppearance("/Helv 10 Tf 0 g")
    const widgetRef = pdfDoc.context.register(widget.dict)

    signatureFieldDict.set(PDFName.of("Kids"), pdfDoc.context.obj([widgetRef]))
    pdfDoc.getForm().acroForm.addField(signatureFieldRef)
    targetPage.node.addAnnot(widgetRef)

    const signatureDictionary = pdfDoc.context.obj({
      Type: "Sig",
      Filter: "Adobe.PPKLite",
      SubFilter: "adbe.pkcs7.detached",
      Name: PDFHexString.fromText(signer),
      Reason: PDFHexString.fromText("Signed locally using Plain Local Signer"),
      M: PDFString.fromDate(new Date()),
      ByteRange: pdfDoc.context.obj([
        0,
        Number(BYTE_RANGE_PLACEHOLDER),
        Number(BYTE_RANGE_PLACEHOLDER),
        Number(BYTE_RANGE_PLACEHOLDER),
      ]),
      Contents: PDFHexString.of("0".repeat(SIGNATURE_PLACEHOLDER_BYTES * 2)),
    })
    const signatureDictionaryRef = pdfDoc.context.register(signatureDictionary)
    signatureFieldDict.set(PDFName.of("V"), signatureDictionaryRef)

    const unsignedBytes = new Uint8Array(
      await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
      })
    )

    const {
      pdfText,
      signedData,
      signatureHexStart,
      signatureHexLength,
    } = applyByteRangeAndGetSignedData(unsignedBytes)

    const digestBytes = await sha256(signedData)
    const fingerprint = bytesToHex(digestBytes)

    let envelope: SignEnvelope
    let publicKeyPem: string | null = null
    let usedPath: CryptoMode = "webcrypto"

    if (usePasskey && webAuthnAvailable) {
      try {
        const webauthnResult = await signWithWebAuthn(digestBytes, signer)
        envelope = webauthnResult.envelope
        publicKeyPem = webauthnResult.publicKeyPem
        usedPath = "webauthn"
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Passkey signing failed. Falling back to Web Crypto."
        toast.error(message)

        const fallback = await signWithWebCrypto(digestBytes, signer, algorithm)
        envelope = fallback.envelope
        publicKeyPem = fallback.publicKeyPem
        usedPath = "webcrypto"
      }
    } else {
      const webCryptoResult = await signWithWebCrypto(digestBytes, signer, algorithm)
      envelope = webCryptoResult.envelope
      publicKeyPem = webCryptoResult.publicKeyPem
      usedPath = "webcrypto"
    }

    const signedBytes = embedEnvelopeIntoPdf(
      pdfText,
      signatureHexStart,
      signatureHexLength,
      envelope
    )

    return {
      signedBytes,
      fingerprintHex: fingerprint,
      publicKeyPem,
      pathUsed: usedPath,
    }
  }, [
    activeAssetForPlacement,
    algorithm,
    fileBytes,
    pdfPageSize,
    placement,
    previewSize,
    signerName,
    typedSignature,
    usePasskey,
    webAuthnAvailable,
  ])

  const onSign = useCallback(async () => {
    if (!file) {
      toast.error("Upload a PDF first.")
      return
    }

    setIsSigning(true)
    setSignStatus("Preparing local signature workflow...")

    try {
      const result = await signPdf()

      clearOutputs()

      const outputBlob = new Blob([result.signedBytes], { type: "application/pdf" })
      const outputUrl = URL.createObjectURL(outputBlob)
      const outputName = `${extractBaseName(file.name)}-signed.pdf`

      setSignedPdfUrl(outputUrl)
      setSignedPdfName(outputName)
      setFingerprintHex(result.fingerprintHex)
      setPathUsed(result.pathUsed)

      if (result.publicKeyPem) {
        const pemBlob = new Blob([result.publicKeyPem], { type: "application/x-pem-file" })
        const pemUrl = URL.createObjectURL(pemBlob)
        setPublicKeyUrl(pemUrl)
        setPublicKeyName(`${extractBaseName(file.name)}-public-key.pem`)
      }

      setSignStatus("Signing complete. Download the signed PDF and public key for verification.")
      toast.success("PDF signed locally.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not sign this PDF."
      setSignStatus("Signing failed.")
      toast.error(message)
    } finally {
      setIsSigning(false)
    }
  }, [clearOutputs, file, signPdf])

  const onVerify = useCallback(async () => {
    if (!verifyPdfFile || !verifyPemFile) {
      toast.error("Upload both a signed PDF and PEM key file.")
      return
    }

    setIsVerifying(true)
    setVerifyStatus("idle")
    setVerifyMessage("Verifying signature locally...")

    try {
      const pdfBytes = new Uint8Array(await verifyPdfFile.arrayBuffer())
      const pemText = await verifyPemFile.text()

      const { envelope, signedData } = extractEnvelopeFromPdf(pdfBytes)
      const result = await verifyEnvelope(envelope, signedData, pemText)

      setVerifyStatus(result.valid ? "valid" : "invalid")
      setVerifyMessage(result.message)
      setVerifyFingerprint(result.fingerprintHex)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed."
      setVerifyStatus("invalid")
      setVerifyMessage(message)
      setVerifyFingerprint("")
    } finally {
      setIsVerifying(false)
    }
  }, [verifyPdfFile, verifyPemFile])

  return (
    <div className="space-y-6 overflow-x-hidden">
      <style jsx global>{`
        @font-face {
          font-family: 'Dancing Script Local';
          src: url('/fonts/dancing-script.ttf') format('truetype');
          font-style: normal;
          font-weight: 700;
          font-display: swap;
        }
      `}</style>

      <Toaster richColors position="top-right" />

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <p className="text-sm leading-relaxed text-amber-100">
            Plain Local Signer produces locally verifiable cryptographic signatures. It does not currently meet the requirements for qualified electronic signatures under eIDAS, ESIGN Act, or equivalent regulations. For legally binding e-signatures, consult a qualified trust service provider.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sign" | "verify") }>
        <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="sign" className="h-10">Sign PDF</TabsTrigger>
          <TabsTrigger value="verify" className="h-10">Verify Signed PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="sign" className="space-y-6 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (selected) {
                void loadPdfPreview(selected)
              }
              event.currentTarget.value = ""
            }}
          />

          <input
            ref={uploadSignatureInputRef}
            type="file"
            accept="image/png,image/svg+xml,image/*"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (selected) {
                void handleUploadedSignature(selected)
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
                  setIsDraggingOverFile(true)
                }}
                onDragLeave={(event) => {
                  event.preventDefault()
                  setIsDraggingOverFile(false)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDraggingOverFile(false)
                  const dropped = event.dataTransfer.files?.[0]
                  if (dropped) {
                    void loadPdfPreview(dropped)
                  }
                }}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
                  isDraggingOverFile
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/20 hover:border-primary/70"
                }`}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Drop a PDF here, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Signing and key generation happen fully local in your browser.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signature Creation</CardTitle>
              <CardDescription>{signStatus}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {file ? (
                <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBytes(file.size)} • {pageCount} page{pageCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setFile(null)
                      setFileBytes(null)
                      setPageCount(0)
                      setPreviewSize(null)
                      setPdfPageSize(null)
                      setPlacement(null)
                      clearOutputs()
                      setSignStatus("Upload a PDF and add your signature.")
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No PDF selected yet.</p>
              )}

              <Tabs value={signatureMode} onValueChange={(value) => setSignatureMode(value as SignatureMode)}>
                <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-3">
                  <TabsTrigger value="draw" className="h-10">Draw</TabsTrigger>
                  <TabsTrigger value="type" className="h-10">Type</TabsTrigger>
                  <TabsTrigger value="upload" className="h-10">Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="draw" className="space-y-3 pt-3">
                  <div className="rounded-lg border bg-[#0f1115] p-2">
                    <canvas
                      ref={drawCanvasRef}
                      className="h-[160px] w-full touch-none rounded-md"
                      onPointerDown={(event) => {
                        const target = event.currentTarget
                        target.setPointerCapture(event.pointerId)
                        beginDraw(event.clientX, event.clientY)
                      }}
                      onPointerMove={(event) => moveDraw(event.clientX, event.clientY)}
                      onPointerUp={() => endDraw()}
                      onPointerCancel={() => endDraw()}
                      onTouchStart={(event) => {
                        const touch = event.touches[0]
                        if (touch) beginDraw(touch.clientX, touch.clientY)
                      }}
                      onTouchMove={(event) => {
                        const touch = event.touches[0]
                        if (touch) moveDraw(touch.clientX, touch.clientY)
                      }}
                      onTouchEnd={() => endDraw()}
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={clearDrawPad}>
                      Clear Pad
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Touch and mouse drawing are supported.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="type" className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <Label htmlFor="typed-signature">Typed signature text</Label>
                    <Input
                      id="typed-signature"
                      value={typedSignature}
                      onChange={(event) => setTypedSignature(event.target.value)}
                      placeholder="Type your name"
                    />
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <p
                      className="text-4xl text-foreground"
                      style={{ fontFamily: "'Dancing Script Local', cursive" }}
                    >
                      {typedSignature || "Your signature preview"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-3 pt-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => uploadSignatureInputRef.current?.click()}>
                      <UploadCloud className="h-4 w-4" />
                      Upload PNG/SVG
                    </Button>
                    <p className="text-xs text-muted-foreground">Existing signature image is used as-is.</p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-4">
                    {uploadedAsset ? (
                      <div
                        className="h-20 w-full rounded bg-contain bg-left bg-no-repeat"
                        style={{ backgroundImage: `url(${uploadedAsset.dataUrl})` }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">No signature image uploaded yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signer-name">Signer display name</Label>
                  <Input
                    id="signer-name"
                    value={signerName}
                    onChange={(event) => setSignerName(event.target.value)}
                    placeholder="Signer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="algorithm">Web Crypto algorithm</Label>
                  <select
                    id="algorithm"
                    value={algorithm}
                    onChange={(event) => setAlgorithm(event.target.value as WebCryptoAlgorithm)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="RSA-PSS">RSA-PSS (2048, SHA-256)</option>
                    <option value="ECDSA">ECDSA P-256 (SHA-256)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={usePasskey}
                    onChange={(event) => setUsePasskey(event.target.checked)}
                    disabled={!webAuthnAvailable}
                    className="mt-0.5"
                  />
                  <span>
                    Use passkey / WebAuthn hardware-backed signing when available.
                    {!webAuthnAvailable ? " (Not available in this browser/context.)" : ""}
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signature Placement</CardTitle>
              <CardDescription>Click the page preview to place your signature, then drag or resize it.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div
                  className="relative inline-block rounded-lg border bg-muted/20"
                  style={{ width: previewSize?.width ?? "100%", maxWidth: "100%" }}
                  onClick={async (event) => {
                    if (!previewSize) return
                    const target = event.target as HTMLElement
                    if (target.closest("[data-placement-box='true']")) {
                      return
                    }

                    const asset = await activeAssetForPlacement()
                    if (!asset) {
                      toast.error("Create or upload a signature first.")
                      return
                    }

                    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
                    const ratio = asset.width / Math.max(1, asset.height)
                    const width = Math.min(previewSize.width * 0.35, 220)
                    const height = Math.max(44, width / Math.max(0.2, ratio))

                    const x = Math.max(0, Math.min(previewSize.width - width, event.clientX - rect.left - width / 2))
                    const y = Math.max(0, Math.min(previewSize.height - height, event.clientY - rect.top - height / 2))

                    setPlacement({ x, y, width, height })
                  }}
                >
                  <canvas ref={previewCanvasRef} className="block h-auto max-w-full" />

                  {placement && (
                    <div
                      data-placement-box="true"
                      className="absolute border-2 border-primary/80 bg-primary/10 shadow"
                      style={{
                        left: placement.x,
                        top: placement.y,
                        width: placement.width,
                        height: placement.height,
                        touchAction: "none",
                      }}
                      onPointerDown={(event) => beginPlacementInteraction("drag", event)}
                    >
                      <div
                        className="h-full w-full bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${activeSignatureAsset?.dataUrl ?? ""})`,
                        }}
                      />

                      <div
                        className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-se-resize items-center justify-center rounded-full border border-primary bg-background text-xs font-semibold text-primary"
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) => beginPlacementInteraction("resize", event)}
                      >
                        ↘
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="w-full sm:w-auto" onClick={onSign} disabled={!file || !previewSize || isSigning}>
                {isSigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <FileSignature className="h-4 w-4" />
                    Sign PDF
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setPlacement(null)
                  clearOutputs()
                }}
                disabled={isSigning}
              >
                Reset Placement
              </Button>
            </CardFooter>
          </Card>

          {(signedPdfUrl || publicKeyUrl || fingerprintHex) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Signed Output</CardTitle>
                <CardDescription>
                  {pathUsed === "webauthn"
                    ? "Signed with passkey flow (hardware-backed)."
                    : "Signed with Web Crypto keypair generated locally."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProcessedLocallyBadge />
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">SHA-256 Fingerprint</p>
                  <Textarea value={fingerprintHex} readOnly className="mt-2 text-xs" rows={3} />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {signedPdfUrl ? (
                    <Button asChild className="w-full sm:w-auto">
                      <a
                        href={signedPdfUrl}
                        download={signedPdfName}
                        onClick={() => {
                          notifyLocalDownloadSuccess()
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download Signed PDF
                      </a>
                    </Button>
                  ) : null}

                  {publicKeyUrl ? (
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <a
                        href={publicKeyUrl}
                        download={publicKeyName}
                        onClick={() => {
                          notifyLocalDownloadSuccess()
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download Public Key (.pem)
                      </a>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Public key export unavailable for this signature method.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-6 pt-2">
          <input
            ref={verifyPdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (selected) setVerifyPdfFile(selected)
              event.currentTarget.value = ""
            }}
          />

          <input
            ref={verifyPemInputRef}
            type="file"
            accept=".pem,text/plain,application/x-pem-file"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (selected) setVerifyPemFile(selected)
              event.currentTarget.value = ""
            }}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Verify Signature</CardTitle>
              <CardDescription>{verifyMessage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => verifyPdfInputRef.current?.click()}>
                  <UploadCloud className="h-4 w-4" />
                  {verifyPdfFile ? "Replace Signed PDF" : "Upload Signed PDF"}
                </Button>

                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => verifyPemInputRef.current?.click()}>
                  <UploadCloud className="h-4 w-4" />
                  {verifyPemFile ? "Replace PEM Key" : "Upload PEM Key"}
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                <p className="truncate">PDF: {verifyPdfFile ? verifyPdfFile.name : "(none)"}</p>
                <p className="truncate">PEM: {verifyPemFile ? verifyPemFile.name : "(none)"}</p>
              </div>

              <Button type="button" className="w-full sm:w-auto" onClick={onVerify} disabled={!verifyPdfFile || !verifyPemFile || isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verify Signature
                  </>
                )}
              </Button>

              {verifyStatus !== "idle" && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    verifyStatus === "valid"
                      ? "border-green-500/40 bg-green-500/10 text-green-100"
                      : "border-red-500/40 bg-red-500/10 text-red-100"
                  }`}
                >
                  {verifyStatus === "valid" ? "✅ " : "❌ "}
                  {verifyMessage}
                </div>
              )}

              {verifyFingerprint ? (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Computed SHA-256 Fingerprint</p>
                  <Textarea value={verifyFingerprint} readOnly className="mt-2 text-xs" rows={3} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

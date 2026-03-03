"use client"

import { useState } from "react"
import { Cpu, Sparkles, Trash2, ShieldCheck } from "lucide-react"
import { sanitizeInlineHtml } from "@/lib/sanitize"

// Brand terms that should not be translated
const BRAND_TERMS = {
  WebAssembly: '<span translate="no" class="notranslate">WebAssembly</span>',
  Wasm: '<span translate="no" class="notranslate">Wasm</span>',
  Plain: '<span translate="no" class="notranslate">Plain</span>',
}

const techColumns = [
  {
    icon: Cpu,
    titleHtml: `${BRAND_TERMS.WebAssembly} Core`,
    description:
      `${BRAND_TERMS.Plain} runs merge, split, convert, extract, and compression workflows locally using ${BRAND_TERMS.Wasm} and browser-native APIs. Your PDF bytes stay in local memory during processing.`,
    codeSnippet: `// Local PDF workflow
const bytes = new Uint8Array(await file.arrayBuffer());
const merged = await mergePdfs([fileA, fileB]);
const split = await splitPdf(file, [{ start: 1, end: 3 }]);
// Output is generated in-browser as Blob/Uint8Array
downloadBlob(new Blob([merged], { type: 'application/pdf' }));`,
  },
  {
    icon: Sparkles,
    titleHtml: "Security and Hygiene",
    description:
      `Metadata purge, irreversible redaction, password recovery, and local signing are implemented in the browser so you can inspect and control exactly what is removed or modified before export.`,
    codeSnippet: `// Metadata + redaction cleanup
const metadata = await inspectMetadata(file);
const cleanedPdf = await plainMetadataPurge(file, {
  fieldsToRemove: metadata.map((field) => field.key),
});
const redacted = await plainIrreversibleRedactor(file, regions);`,
  },
  {
    icon: Trash2,
    titleHtml: "Optional AI Relay (Text Only)",
    description:
      `AI tools require explicit user consent. Only extracted text is sent to the AI endpoint when enabled. Original PDF files remain local and are never uploaded.`,
    codeSnippet: `// Consent-gated AI request
if (!allowServerProcessing) {
  throw new Error('Consent required');
}
const text = await extractTextLocally(file);
const summary = await fetch('/api/ai/summarize', {
  method: 'POST',
  body: JSON.stringify({ text, instructions }),
});`,
  },
]

export function PrivacyManifesto() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative px-4 pt-44 pb-40 md:pt-56 md:pb-52">
      {/* Top gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/[0.02] to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* Verified Local Badge - top right */}
        <div className="mb-8 flex justify-end">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex cursor-default items-center gap-2 rounded-full px-3 py-1.5 ring-1 transition-all duration-300 sm:px-4 sm:py-2 ${
              isHovered
                ? "bg-accent/12 ring-accent/40 shadow-[0_0_20px_4px_oklch(0.62_0.21_250/0.15)]"
                : "bg-accent/6 ring-accent/20"
            }`}
          >
            <ShieldCheck
              className={`h-3.5 w-3.5 transition-colors duration-300 sm:h-4 sm:w-4 ${
                isHovered ? "text-accent" : "text-accent/90"
              }`}
              strokeWidth={2}
            />
            <span
              className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 sm:text-[11px] ${
                isHovered ? "text-accent" : "text-accent/90"
              }`}
            >
              VERIFIED LOCAL
            </span>
          </div>
        </div>

        {/* Privacy Manifesto Hero */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Privacy by Architecture,{" "}
            <span className="text-accent">Not Just Policy</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Traditional PDF utilities require you to &lsquo;trust&rsquo; their server-side
            encryption. At Plain, core PDF processing happens in your browser and
            your document files never leave your local machine. AI features are
            explicitly opt-in and send extracted text only. This isn&apos;t just a
            promise; it is a{" "}
            <span className="font-medium text-foreground/90">
              verifiable architecture
            </span>{" "}
            you can inspect.
          </p>
        </div>

        {/* Technical Breakdown - Three Columns */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {techColumns.map((column, idx) => (
            <div
              key={idx}
              className="group rounded-xl bg-[oklch(0.14_0.005_250)] p-6 ring-1 ring-white/[0.06] transition-all duration-300 hover:ring-accent/25 hover:bg-[oklch(0.15_0.007_250)]"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 transition-all duration-300 group-hover:bg-accent/15 group-hover:ring-accent/30">
                <column.icon
                  className="h-6 w-6 text-accent/80 transition-colors duration-300 group-hover:text-accent"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title preserves notranslate spans for brand terms */}
              <h3 
                className="text-[15px] font-semibold text-accent"
                dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(column.titleHtml) }}
              />

              {/* Description preserves notranslate spans for brand terms */}
              <p 
                className="mt-3 text-[13px] leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(column.description) }}
              />

              {/* Code Block */}
              <div
                className="mt-5 overflow-x-auto rounded-lg bg-[oklch(0.10_0.004_250)] p-4 font-mono ring-1 ring-white/[0.04]"
                tabIndex={0}
                role="region"
                aria-label={`${column.titleHtml.replace(/<[^>]*>/g, "")} code example`}
              >
                <pre className="min-w-full whitespace-pre text-[11px] leading-relaxed text-muted-foreground/80">
                  <code>{column.codeSnippet}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust statement */}
        <div className="mt-14 flex items-center justify-center gap-3 text-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/30" />
          <p className="text-[12px] font-medium tracking-wide text-muted-foreground/80">
            COMPLIANCE-READY FOR GDPR, UK GDPR & ENTERPRISE ENVIRONMENTS
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/30" />
        </div>
      </div>
    </section>
  )
}

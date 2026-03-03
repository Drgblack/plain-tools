import { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  generateTechArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  combineSchemas,
} from "@/lib/schema"
import { serializeJsonLd } from "@/lib/sanitize"

export const metadata: Metadata = {
  title: "Is Offline PDF Processing Secure?",
  description:
    "Understand the security model of offline PDF tools. Learn what 'offline' means, how browser sandboxing works, and when offline processing is safer than uploading.",
  alternates: {
    canonical: "https://plain.tools/learn/is-offline-pdf-processing-secure",
  },
}

// Article schema
const articleSchema = generateTechArticleSchema({
  title: "Is Offline PDF Processing Secure?",
  description:
    "Understand the security model of offline PDF tools, browser sandboxing, and when offline processing provides meaningful protection.",
  slug: "is-offline-pdf-processing-secure",
  datePublished: "2026-01-22",
  dateModified: "2026-02-27",
  proficiencyLevel: "Intermediate",
})

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Is Offline PDF Processing Secure?", slug: "is-offline-pdf-processing-secure" },
])

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: "Is offline PDF processing more secure than online tools?",
    answer:
      "Offline processing eliminates transmission risks - your files never travel over the internet or exist on remote servers. However, security depends on the specific tool, browser security, and your local device. Offline is not automatically 'secure' but removes certain categories of risk.",
  },
  {
    question: "What does browser sandboxing protect against?",
    answer:
      "Browser sandboxing isolates web applications from your file system and other browser tabs. A website cannot access files you have not explicitly selected, and processing happens in an isolated environment that cannot affect your system.",
  },
  {
    question: "Can offline tools still have security vulnerabilities?",
    answer:
      "Yes. The code running in your browser could have bugs or vulnerabilities. However, the impact is limited because the tool cannot access files you have not selected and cannot communicate with external servers during processing.",
  },
  {
    question: "When is offline processing the safer choice?",
    answer:
      "Offline processing is safer when you want to eliminate transmission risks, avoid third-party data handling, or work with sensitive documents where you cannot verify how an online service handles your data.",
  },
])

// Combine all schemas
const combinedSchema = combineSchemas([articleSchema, breadcrumbSchema, faqSchema])

export default function IsOfflinePdfProcessingSecurePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(combinedSchema) }}
      />
      <Header />

      <main className="flex-1">
        <article className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground/70">
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/learn" className="transition-colors hover:text-foreground">
                Learn
              </Link>
              <span>/</span>
              <span className="text-foreground/80">Is Offline PDF Processing Secure?</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Is Offline PDF Processing Secure?
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                A factual look at the security model of browser-based PDF tools that work without uploading files.
              </p>
            </header>

            {/* In Simple Terms */}
            <div className="mb-10 rounded-xl border border-accent/15 bg-[oklch(0.155_0.005_250)] p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                In Simple Terms
              </h2>
              <p className="text-[14px] leading-relaxed text-foreground/90">
                Offline PDF tools process files entirely within your browser, using your device's 
                computing power. No files are transmitted to external servers. This eliminates 
                network-based risks but does not make your device invulnerable. The security 
                depends on your browser's sandboxing and your device's overall security posture.
              </p>
            </div>

            {/* Main Content */}
            <div className="prose-custom space-y-10">
              {/* Intro */}
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                When evaluating any tool that handles sensitive documents, security is a 
                reasonable concern. Offline PDF tools—those that run entirely in your browser 
                without uploading files—have a different security model than traditional 
                cloud-based services. Understanding this model helps you make informed decisions.
              </p>

              {/* What "offline" actually means */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  What "offline" actually means
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  When we say a tool works "offline," we mean the file processing happens 
                  locally on your device using JavaScript and WebAssembly running in your browser. 
                  The term can be misleading—you typically need to be online to load the webpage 
                  initially—but once loaded, no further network communication is required for 
                  file operations.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  This means:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>Your PDF files are never transmitted over the network</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>Processing uses your device's CPU and memory</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>Results are generated locally and downloaded directly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>No server ever sees your document content</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  You can verify this by monitoring network activity in your browser's DevTools. 
                  Learn more about verification at{" "}
                  <Link href="/learn/how-plain-works" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                    How Plain Works
                  </Link>.
                </p>
              </section>

              {/* Browser sandbox security */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  Browser sandbox security
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Modern browsers implement a security model called "sandboxing." This means 
                  JavaScript code running in a webpage operates in an isolated environment with 
                  strict limitations:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">No file system access</strong> — Code cannot read files from your computer unless you explicitly select them</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Memory isolation</strong> — Each tab runs in a separate process with its own memory space</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Origin restrictions</strong> — Code from one website cannot access data from another</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Limited APIs</strong> — Browsers restrict access to sensitive system resources</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  This sandbox is battle-tested. Chrome, Firefox, Safari, and Edge have been 
                  hardened over decades to prevent malicious websites from compromising your 
                  system. An offline PDF tool inherits these protections.
                </p>
              </section>

              {/* Device-level risks */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  Device-level risks
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Offline processing eliminates server-side risks, but your device's security 
                  still matters. Consider these factors:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Malware on your device</strong> — Keyloggers or screen capture software could still observe your activity</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Browser extensions</strong> — Some extensions can read page content and could potentially access files you're working with</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Shared computers</strong> — Files may remain in browser cache or download folders accessible to other users</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Physical access</strong> — Anyone with physical access to your unlocked device can see your files</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  These risks exist regardless of what tools you use. Offline processing does 
                  not create new device-level vulnerabilities—it simply does not eliminate 
                  existing ones.
                </p>
              </section>

              {/* When offline is safer */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  When offline is safer
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Offline processing provides meaningful security advantages in several scenarios:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Sensitive documents</strong> — Legal contracts, medical records, financial statements never leave your device</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Compliance requirements</strong> — Some regulations prohibit transmitting certain data to third-party servers</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Network security concerns</strong> — Public WiFi or untrusted networks cannot intercept files that are never transmitted</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Data residency</strong> — Your files remain in your jurisdiction, not on servers in unknown locations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">No retention risk</strong> — No server copies means no risk of future data breaches exposing your documents</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  For more on Plain's approach, see{" "}
                  <Link href="/privacy" className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80">
                    Privacy by Design
                  </Link>.
                </p>
              </section>

              {/* When offline is not enough */}
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  When offline is not enough
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Offline processing is one layer of security, not a complete solution. 
                  It may not be sufficient when:
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Your device is compromised</strong> — No tool can protect files on an infected machine</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">You need audit trails</strong> — Some compliance scenarios require server-side logging of document operations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Collaboration is required</strong> — Offline tools process files locally; sharing still requires transmitting the output</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong className="text-foreground/90">Advanced features need server power</strong> — Some operations like OCR on large documents may require more resources than browsers provide</span>
                  </li>
                </ul>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  Security is contextual. Offline processing addresses specific risks—primarily 
                  the risks associated with uploading sensitive documents to third-party servers. 
                  It works best as part of a broader security approach that includes device 
                  hygiene, careful extension management, and awareness of physical security.
                </p>
              </section>

              {/* Summary callout */}
              <section className="rounded-xl border border-accent/15 bg-[oklch(0.155_0.005_250)] p-6">
                <h3 className="mb-3 text-[15px] font-semibold text-foreground">
                  The bottom line
                </h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  Offline PDF processing eliminates the risks of uploading files to unknown 
                  servers—no network transmission, no server storage, no data breach exposure. 
                  It does not make your device invulnerable, but it removes an entire category 
                  of risk from the equation. For most users handling sensitive documents, this 
                  represents a meaningful improvement in privacy and security.
                </p>
              </section>

              {/* Related */}
              <section className="border-t border-accent/10 pt-10">
                <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
                  Related articles
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/learn/how-plain-works"
                    className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                      How Plain Works
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                      Technical details of client-side PDF processing
                    </p>
                  </Link>
                  <Link
                    href="/privacy"
                    className="group rounded-xl bg-[oklch(0.165_0.006_250)] p-5 ring-1 ring-accent/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent/25"
                  >
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent">
                      Privacy by Design
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
                      Plain's approach to privacy and data handling
                    </p>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

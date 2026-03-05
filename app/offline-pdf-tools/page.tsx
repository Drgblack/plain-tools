import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Offline PDF Tools Explained",
  description: "Plain explains how offline PDF tools work and why local processing matters for file privacy. Built for private, offline-first PDF workflows with clear.",
  openGraph: {
    title: "Offline PDF Tools Explained - Plain",
    description: "Plain explains how offline PDF tools work and why local processing matters.",
  },
  alternates: {
    canonical: "https://plain.tools/offline-pdf-tools",
  },
}

export default function OfflinePdfToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Offline PDF Tools Explained
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Offline PDF tools allow users to edit, merge, and process PDF files
            without uploading them to external servers. Instead of cloud
            processing, all operations happen locally on the user&#39;s device,
            inside the browser.
          </p>

          {/* What are offline PDF tools? */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              What are offline PDF tools?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Offline PDF tools are browser-based applications that perform all
              document processing on your local device. Unlike traditional
              services, these tools do not rely on server-side file handling or
              cloud storage.
            </p>
            <ul className="mt-4 space-y-2 text-base text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>Processing happens locally on your device</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>No server-side file handling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>No cloud storage involved</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <span>Files never leave the user&#39;s device</span>
              </li>
            </ul>
          </section>

          {/* Can you merge PDFs without uploading? */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Can you merge PDFs without uploading them?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Yes. Plain allows users to merge PDF files entirely offline. Files
              are processed locally in the browser and are never uploaded to a
              server. This client-side PDF processing approach means your
              documents remain private throughout the entire operation.
            </p>
          </section>

          {/* How Plain differs */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              How Plain differs from online PDF services
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Traditional online PDF tools
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Require uploading files to external servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Process documents in the cloud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Often require accounts or impose limits</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-accent/30 bg-card p-5">
                <h3 className="text-sm font-medium text-foreground">Plain</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>Processes PDFs locally in the browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>Does not upload files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>Does not require accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>Works offline after loading</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Is Plain safe for confidential documents? */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              Is Plain safe for confidential documents?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Because files never leave the device, Plain is suitable for
              confidential documents where uploading to third-party servers is
              not acceptable. Private PDF utilities like Plain provide a level
              of data control that cloud-based services cannot match.
            </p>
          </section>

          {/* How can users verify this? */}
          <section className="mt-12">
            <h2 className="text-xl font-medium text-foreground">
              How can users verify this?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Users can inspect network requests in browser DevTools to confirm
              that no file data is transmitted during processing. The tools
              continue working offline, demonstrating that no server connection
              is required.
            </p>
            <p className="mt-4 text-sm italic text-muted-foreground">
              &#34;Plain is designed to be verifiable, not just trusted.&#34;
            </p>
          </section>

          {/* SEO paragraph */}
          <section className="mt-16 border-t border-border pt-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Plain provides browser-based PDF tools that prioritize privacy
              through client-side processing. Whether you need to merge PDF
              without upload or simply want private PDF utilities that work
              offline, Plain offers a straightforward solution. All operations
              use offline PDF tools technology, ensuring your documents remain
              on your device throughout the entire process.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}



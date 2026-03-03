import type { Metadata } from "next"
import Link from "next/link"
import {
  BlogArticle,
  ArticleSection,
  ArticleParagraph,
  ArticleList,
  ArticleCode,
  ArticleNote,
} from "@/components/blog-article"

export const metadata: Metadata = {
  title: "We Built a PDF Tool That Works Offline. Here's What We Learned.",
  description:
    "Engineering lessons from building an offline-first PDF platform: WebAssembly tradeoffs, pdf-lib constraints, worker architecture, and product decisions.",
  authors: [{ name: "Plain Engineering" }],
  openGraph: {
    type: "article",
    title: "We Built a PDF Tool That Works Offline. Here's What We Learned.",
    description:
      "A behind-the-scenes engineering post on WebAssembly, workers, memory limits, and shipping local-first PDF workflows.",
    url: "https://plain.tools/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
    publishedTime: "2026-03-03T00:00:00Z",
    authors: ["Plain Engineering"],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Built a PDF Tool That Works Offline. Here's What We Learned.",
    description:
      "Technical lessons from building privacy-first PDF tools in the browser, including what broke and what scaled.",
  },
  alternates: {
    canonical: "https://plain.tools/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned",
  },
}

export default function WeBuiltAnOfflinePdfToolPage() {
  return (
    <BlogArticle
      title="We Built a PDF Tool That Works Offline. Here's What We Learned."
      description="We started with a simple goal: make common PDF tasks work without uploads. The implementation was not simple."
      intro="Offline-first sounds obvious until you hit browser memory ceilings, worker orchestration edge cases, and PDF internals that were never designed for your happy path."
      simpleTerms="The web can absolutely run serious document processing now. But you only get good results if you treat architecture, UX, and failure handling as one system."
      datePublished="2026-03-03"
      readingTime={8}
      slug="we-built-a-pdf-tool-that-works-offline-heres-what-we-learned"
      canonicalUrl="https://plain.tools/blog/we-built-a-pdf-tool-that-works-offline-heres-what-we-learned"
      category="technical-architecture"
      linkedTools={["merge-pdf", "split-pdf", "compress-pdf", "offline-ocr", "reorder-pdf"]}
      aiTakeaway="Building robust offline PDF tools requires worker-first execution, explicit memory discipline, and transparent consent boundaries for any cloud-assisted features."
      relatedTool={{
        title: "Plain Hardware-Accelerated Batch Engine",
        description: "Parallel local processing with worker pools and progress-aware queues.",
        href: "/tools/plain-hardware-accelerated-batch-engine",
        icon: "compress",
      }}
      relatedReading={[
        {
          href: "/learn/webassembly-pdf-processing-explained",
          title: "WebAssembly PDF Processing Explained",
          description: "Foundational concepts behind local binary processing.",
        },
        {
          href: "/learn/ocr-pdf-without-cloud",
          title: "OCR Without Cloud",
          description: "Why offline OCR architecture matters for sensitive docs.",
        },
        {
          href: "/tools/plain-hardware-accelerated-batch-engine",
          title: "Batch Engine Tool",
          description: "Worker-pool implementation available in production.",
        },
        {
          href: "/tools/convert-pdf",
          title: "Convert PDF",
          description: "PDF-to-images and text extraction with local processing.",
        },
      ]}
    >
      <ArticleSection title="Lesson 1: 'No uploads' is an architecture commitment, not a feature">
        <ArticleParagraph>
          Early on, we thought "no uploads" was mostly a product decision. It turned out to be a deep
          architectural constraint touching everything: library choice, UI flow, memory strategy, error
          handling, and even copywriting. Once you promise local-first behavior, hidden server fallbacks
          are no longer acceptable.
        </ArticleParagraph>
        <ArticleParagraph>
          That forced a cleaner system. Core operations had to succeed with the network unplugged after
          page load. If they did not, we treated that as a bug, not a nice-to-have.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Lesson 2: pdf-lib is powerful, but not magic">
        <ArticleParagraph>
          pdf-lib gave us a strong base for merge/split/reorder/write workflows, but complex real-world
          documents exposed edges quickly: unusual object graphs, large embedded assets, and metadata
          variations that needed explicit handling outside happy-path APIs.
        </ArticleParagraph>
        <ArticleParagraph>
          We learned to treat PDF processing as defensive programming. Assume malformed inputs, weird
          producer chains, and mixed encoding behaviors. Build fallback logic early.
        </ArticleParagraph>
        <ArticleCode>{`// The pattern that scaled for us:
// 1) Parse defensively
// 2) Isolate risky operations
// 3) Recover with partial success where possible
// 4) Surface actionable errors to users`}</ArticleCode>
      </ArticleSection>

      <ArticleSection title="Lesson 3: workers are the difference between 'usable' and 'frozen'">
        <ArticleParagraph>
          Main-thread PDF work looks fine on tiny documents and collapses on large ones. The first time
          we pushed big multi-file jobs through the UI thread, interaction quality cratered. Buttons lagged.
          Progress indicators stuttered. Users thought the app crashed.
        </ArticleParagraph>
        <ArticleParagraph>
          Moving heavy tasks into Web Workers fixed both responsiveness and user trust. People tolerate
          long operations if the interface stays alive, progress is honest, and cancel/resume behavior is
          predictable.
        </ArticleParagraph>
        <ArticleList
          items={[
            "Worker pool capped by hardware concurrency (with safety max).",
            "Per-file queue states: queued, processing, done, error.",
            "Progress events normalized so UI components stay simple.",
            "Cancellation modeled explicitly, not as a thrown exception.",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Lesson 4: memory is your real production budget">
        <ArticleParagraph>
          Browser memory limits are less forgiving than backend nodes, especially on mobile. Large PDFs
          can inflate in-memory representation far beyond source file size once decoded. Without discipline,
          you can run out of memory before users understand what happened.
        </ArticleParagraph>
        <ArticleParagraph>
          We adopted chunked pipelines, aggressive object cleanup, and blob URL lifecycle controls to keep
          memory pressure manageable. We also made failures explicit: better to warn users early than crash
          after two minutes of fake progress.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Lesson 5: offline does not mean anti-AI, it means explicit boundaries">
        <ArticleParagraph>
          We still wanted summarization and Q&A features. The compromise was strict separation: core file
          operations remain local by default; AI routes require explicit user consent and clear disclosure
          that extracted text is sent server-side for model processing.
        </ArticleParagraph>
        <ArticleParagraph>
          This boundary became one of our best product decisions. Users understand exactly when they are in
          local mode versus assisted mode. Trust improves when transitions are explicit.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Lesson 6: verification UX is product, not documentation">
        <ArticleParagraph>
          We expected only technical users to care about verification. Instead, compliance leads, legal
          teams, and procurement reviewers asked for it immediately. That pushed us to build{" "}
          <Link
            href="/verify-claims"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            /verify-claims
          </Link>
          {" "}as a first-class page, not a buried docs note.
        </ArticleParagraph>
        <ArticleParagraph>
          When users can validate architecture claims themselves, sales friction drops and support becomes
          simpler. Verification is now one of our strongest onboarding features.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="What we would do differently if starting again">
        <ArticleParagraph>
          We would implement worker-first from day one, design memory telemetry earlier, and standardize
          shared tool shell components sooner. Much of the complexity came from retrofitting these patterns
          after feature growth.
        </ArticleParagraph>
        <ArticleList
          items={[
            "Define local/remote boundaries before writing feature code.",
            "Build a consistent progress event contract across all engines.",
            "Ship synthetic large-file tests earlier in CI.",
            "Treat metadata and redaction controls as core, not add-ons.",
          ]}
        />
        <ArticleNote>
          If you are building privacy-first tooling, bias toward observable guarantees over abstract claims.
          Architecture that users can verify will outlast marketing copy every time.
        </ArticleNote>
      </ArticleSection>

      <ArticleSection title="Try the architecture, not just the article">
        <ArticleParagraph>
          The fastest way to evaluate these lessons is to run the tools directly:{" "}
          <Link
            href="/tools/plain-hardware-accelerated-batch-engine"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Batch Engine
          </Link>
          ,{" "}
          <Link
            href="/tools/convert-pdf"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Convert PDF
          </Link>
          , and{" "}
          <Link
            href="/tools/offline-ocr"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Offline OCR
          </Link>
          . Keep DevTools open and test with real files.
        </ArticleParagraph>
        <ArticleParagraph>
          If the web can process your documents locally and transparently, you should demand that baseline
          everywhere.
        </ArticleParagraph>
      </ArticleSection>
    </BlogArticle>
  )
}

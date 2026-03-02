import { Metadata } from "next"
import Link from "next/link"
import {
  BlogArticle,
  ArticleSection,
  ArticleParagraph,
  ArticleList,
  ArticleNote,
} from "@/components/blog-article"

export const metadata: Metadata = {
  title: "Why We Built Plain",
  description:
    "Plain explains the reasoning behind building offline PDF tools when most services rely on server uploads.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "Why We Built Plain",
    description: "Plain explains the reasoning behind building offline PDF tools.",
    publishedTime: "2026-02-15T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why We Built Plain",
    description: "Plain explains the reasoning behind building offline PDF tools.",
  },
}

export default function WhyWeBuiltPlainPage() {
  return (
    <BlogArticle
      title="Why We Built Plain"
      description="The reasoning behind creating offline-first PDF tools in a world of cloud services."
      intro="Most PDF tools on the web require uploading your files to a server. We built Plain to offer an alternative: tools that run entirely in your browser, with no uploads required."
      simpleTerms="We wanted PDF tools that work without sending your files anywhere. Modern browsers are capable of processing PDFs locally, so we built Plain to prove that privacy-first document tools are possible."
      datePublished="2026-02-15"
      readingTime={4}
      canonicalUrl="https://plain.tools/blog/why-we-built-plain"
      breadcrumbs={[
        { name: "Blog", href: "/blog" },
        { name: "Why We Built Plain", href: "/blog/why-we-built-plain" },
      ]}
      relatedReading={[
        {
          href: "/learn/how-plain-works",
          title: "How Plain Works",
          description: "Technical explanation of client-side PDF processing.",
        },
        {
          href: "/learn/online-vs-offline-pdf-tools",
          title: "Online vs Offline PDF Tools",
          description: "Understand the differences between tool architectures.",
        },
        {
          href: "/blog/browser-pdf-processing-explained",
          title: "Browser PDF Processing Explained",
          description: "How modern browsers handle PDF operations.",
        },
        {
          href: "/verify",
          title: "How to Verify Plain",
          description: "Steps to independently verify our privacy claims.",
        },
      ]}
    >
      <ArticleSection title="What problem does Plain solve?">
        <ArticleParagraph>
          PDF tools are everywhere, but most of them work the same way: you upload your file to a server, the server processes it, and you download the result. This model has worked for years, but it comes with trade-offs that are rarely discussed.
        </ArticleParagraph>
        <ArticleList
          items={[
            "Your files pass through third-party infrastructure",
            "You cannot verify what happens to them after processing",
            "You need an internet connection to use the tools",
            "Sensitive documents may be stored, cached, or logged",
          ]}
        />
        <ArticleParagraph>
          Plain takes a different approach. Every operation happens in your browser. Your files never leave your device.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Why browser-based processing?">
        <ArticleParagraph>
          Modern browsers are remarkably capable. Technologies like WebAssembly allow complex operations—including PDF manipulation—to run locally at near-native speeds. The File API provides secure access to local files without uploading them.
        </ArticleParagraph>
        <ArticleParagraph>
          This means the architecture for privacy-first PDF tools already exists. The question was whether anyone would build it.
        </ArticleParagraph>
        <ArticleNote>
          Plain uses{" "}
          <Link href="/learn/how-plain-works" className="text-accent underline underline-offset-4 hover:text-accent/80">
            pdf-lib
          </Link>{" "}
          and WebAssembly for PDF processing. These run entirely in your browser with no server communication.
        </ArticleNote>
      </ArticleSection>

      <ArticleSection title="Who is Plain for?">
        <ArticleParagraph>
          Plain is designed for people who care about where their documents go:
        </ArticleParagraph>
        <ArticleList
          items={[
            "Professionals handling confidential client documents",
            "Researchers working with sensitive data",
            "Anyone who prefers tools that work offline",
            "Users in regions with strict data residency requirements",
            "People who simply prefer not to upload personal files",
          ]}
        />
        <ArticleParagraph>
          Plain does not require accounts, does not track usage, and does not store files. The privacy model is not a feature—it is the architecture.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="What Plain is not">
        <ArticleParagraph>
          Plain is not a replacement for full-featured PDF editors like Adobe Acrobat. It does not offer OCR, digital signatures, or form creation. These features typically require server-side processing or proprietary software.
        </ArticleParagraph>
        <ArticleParagraph>
          Plain focuses on common, everyday PDF tasks: merging, splitting, reordering, and compressing. These operations can be performed entirely in the browser, and that is exactly what Plain does.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="Verifiable by design">
        <ArticleParagraph>
          We do not ask you to trust us. Plain is designed so you can verify our claims yourself. Open your browser&apos;s developer tools, check the Network tab, and see that no files are transmitted during processing.
        </ArticleParagraph>
        <ArticleParagraph>
          You can even disconnect from the internet after loading the page. Plain will continue to work because it does not need a server connection to process your files.
        </ArticleParagraph>
        <ArticleNote>
          For step-by-step verification instructions, see{" "}
          <Link href="/verify" className="text-accent underline underline-offset-4 hover:text-accent/80">
            How to Verify Plain
          </Link>.
        </ArticleNote>
      </ArticleSection>
    </BlogArticle>
  )
}

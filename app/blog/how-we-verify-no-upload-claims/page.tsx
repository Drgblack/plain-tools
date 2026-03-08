import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleList,
  ArticleNote,
  ArticleParagraph,
  ArticleSection,
  BlogArticle,
} from "@/components/blog-article"

export const metadata: Metadata = {
  title: "How We Verify No-Upload Claims",
  description:
    "How Plain evaluates no-upload claims with DevTools, offline checks, and route-level verification instead of policy language alone.",
  authors: [{ name: "Plain Editorial" }],
  openGraph: {
    type: "article",
    title: "How We Verify No-Upload Claims",
    description:
      "A practical verification protocol for checking whether PDF tools actually keep your files local.",
    publishedTime: "2026-03-08T00:00:00Z",
    authors: ["Plain Editorial"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Verify No-Upload Claims",
    description:
      "A practical verification protocol for checking whether PDF tools actually keep your files local.",
  },
}

export default function HowWeVerifyNoUploadClaimsPage() {
  return (
    <BlogArticle
      title="How We Verify No-Upload Claims"
      description="The practical method Plain uses to evaluate whether a PDF tool really keeps file bytes local."
      intro="A no-upload claim should be treated as a technical statement that can be tested, not a slogan. The useful question is simple: what happens on the wire during a real file operation?"
      simpleTerms="We verify no-upload claims by running a real document job, watching the Network panel in DevTools, and checking whether the tool still works after the page is loaded and the network is removed."
      datePublished="2026-03-08"
      readingTime={7}
      slug="how-we-verify-no-upload-claims"
      canonicalUrl="https://plain.tools/blog/how-we-verify-no-upload-claims"
      category="privacy-ethics"
      linkedTools={["merge-pdf", "compress-pdf", "pdf-qa"]}
      faqItems={[
        {
          question: "What is the fastest way to verify a no-upload claim?",
          answer:
            "Run a real file operation, watch the Network tab for outbound payloads, and confirm the core workflow still functions once the page is loaded and connectivity is removed.",
        },
        {
          question: "Does zero outbound traffic prove everything?",
          answer:
            "No. It proves a useful part of the story, but you still need to understand what the page loaded earlier and whether any optional features call remote services.",
        },
      ]}
      relatedReading={[
        {
          href: "/learn/how-to-audit-pdf-tool-network-requests",
          title: "How to Audit PDF Tool Network Requests",
          description: "Browser-by-browser steps for inspecting requests during a real PDF workflow.",
        },
        {
          href: "/learn/can-pdf-tools-see-my-files",
          title: "Can PDF Tools See My Files?",
          description: "A short answer with practical verification steps and common false signals.",
        },
        {
          href: "/verify-claims",
          title: "Verify Claims",
          description: "Run the verification method directly against Plain's own claims.",
        },
      ]}
    >
      <ArticleSection title="Why policy language is not enough">
        <ArticleParagraph>
          Privacy pages can be useful, but they are still claims. If a tool says
          &quot;your files are not uploaded&quot;, that statement should survive a network inspection during a
          real job, not just a marketing review.
        </ArticleParagraph>
        <ArticleParagraph>
          We treat no-upload language as a route question: what happens when a user selects a
          file, runs the operation, and downloads the result?
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection title="The verification routine we actually use">
        <ArticleParagraph>
          We use a small repeatable checklist rather than a one-off guess. The goal is to make the
          route visible enough that another reviewer could repeat the same test later.
        </ArticleParagraph>
        <ArticleList
          items={[
            "Load the tool normally and open the Network panel before selecting any file.",
            "Run one realistic file operation rather than an empty or toy interaction.",
            "Filter for fetch and XHR traffic, then inspect request size and payload behaviour.",
            "Repeat the operation after the page is loaded and connectivity is removed where possible.",
          ]}
        />
        <ArticleNote>
          The exact steps are documented in{" "}
          <Link href="/learn/how-to-audit-pdf-tool-network-requests" className="text-accent underline underline-offset-4 hover:text-accent/80">
            How to Audit PDF Tool Network Requests
          </Link>
          .
        </ArticleNote>
      </ArticleSection>

      <ArticleSection title="What counts as a red flag">
        <ArticleParagraph>
          The obvious red flag is file data moving to a remote endpoint during the job. There are
          softer red flags too: opaque route switching, optional features that quietly invoke remote
          services, and upload-dependent fallbacks that appear only on certain file types.
        </ArticleParagraph>
        <ArticleList
          items={[
            "request payloads that scale with the uploaded file",
            "remote endpoints called only when the actual processing step starts",
            "a workflow that stops working as soon as connectivity is removed",
            "mixed local and remote routes that are hard for ordinary users to recognise",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="What this does and does not prove">
        <ArticleParagraph>
          Network testing is strong evidence, but it is not the whole compliance story. It tells you
          whether document bytes appear to leave the browser during the tested route. It does not
          replace product review, legal review, or environment-specific governance.
        </ArticleParagraph>
        <ArticleParagraph>
          The practical standard is not perfection. It is whether the route is clear enough,
          repeatable enough, and observable enough to trust in ordinary operations.
        </ArticleParagraph>
      </ArticleSection>
    </BlogArticle>
  )
}
